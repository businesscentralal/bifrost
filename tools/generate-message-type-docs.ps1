<#
.SYNOPSIS
    Generates the message-type reference pages from the apps' own help codeunits.

.DESCRIPTION
    Every Bifröst message type documents itself: `Help.MessageTypes.Get` returns the
    catalogue, and `Help.Implementation.Get` returns one type's request and response
    contract as Markdown. This script asks a running Business Central environment for
    both and writes one Markdown page per message type into the owning app's
    `docs/<app>/reference/message-types/` folder.

    The pages are therefore generated, never hand-written, and cannot drift from the
    product. Re-run the script after a release and commit the diff.

    Calls are made strictly one at a time. A burst of parallel calls has been observed
    to take the queue endpoint down, so the script also takes a lock file for the
    duration of the run and refuses to start while another Bifröst-driving process
    holds it.

.PARAMETER App
    Restrict generation to one app id (for example `nornir`). Omit to generate every
    app in the mapping table below.

.PARAMETER BaseUrl
    Bifröst API root, including the company segment. Defaults to the documentation
    container.

.PARAMETER SiteRoot
    Repository root of the documentation site. Defaults to the parent of this script.

.PARAMETER ListOnly
    Fetch and print the catalogue with the app each type maps to, and write nothing.
    Use this after adding message types to check the mapping before generating.

.EXAMPLE
    pwsh tools/generate-message-type-docs.ps1
    pwsh tools/generate-message-type-docs.ps1 -App nornir
    pwsh tools/generate-message-type-docs.ps1 -ListOnly

.NOTES
    Credentials are read from environment variables and never written to disk, echoed,
    or passed on a command line:

      local  BC28IS_USER / BC28IS_PASSWORD   (user-level Windows environment variables)
      CI     BC_USER / BC_PASSWORD           (repository secrets)

    The user needs read access to the Bifröst API; the help message types read no
    business data.
#>

[CmdletBinding()]
param(
    [string] $App,

    [string] $BaseUrl = 'https://cosmo-alpaca-enterprise.westeurope.cloudapp.azure.com:443/f068155f0c39rest/api/origo/bifrost/v1.0/companies(b93c35e0-6a9d-f111-90df-7ced8d9d7f83)',

    [string] $Tenant = 'default',

    [string] $SiteRoot = (Split-Path -Parent $PSScriptRoot),

    [string] $LockFile = "$env:TEMP\bifrost-mcp.lock",

    [switch] $ListOnly
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# ---------------------------------------------------------------------------
# Message type -> app mapping
# ---------------------------------------------------------------------------
# A message type belongs to the app that implements it. Two signals identify the
# owner, in this order:
#
#   1. The help directory. Each app publishes exactly one `Help.<Domain>.Get` type
#      per domain it owns, and `Help.MessageTypes.Get` reports which directory a
#      type came from. When the catalogue carries that information it wins.
#
#   2. The key prefix. Message type keys are the public API contract and are stable
#      across the Cloud Events -> Bifröst rename, so the prefix is a reliable
#      fallback. The table below is the authority for that fallback.
#
# A type that matches nothing is reported and skipped rather than filed under a
# guess — add it here when a new domain ships.

$PrefixMap = [ordered]@{
    # Bifröst Nornir — scheduling and orchestration
    'Orchestrator.'       = 'nornir'
    'Help.Orchestrator'   = 'nornir'

    # Bifröst Hnitbjörg — external storage
    'Storage.'            = 'hnitbjorg'
    'Help.Storage'        = 'hnitbjorg'

    # Bifröst Bragi — chat and language models
    'LLM.'                = 'bragi'
    'Chat.'               = 'bragi'
    'Help.Chat'           = 'bragi'
    'Help.LLM'            = 'bragi'

    # Bifröst Iceland DocEx — electronic document exchange
    'DocumentExchange.'   = 'iceland-docex'
    'Help.DocumentExchange' = 'iceland-docex'
}

# Apps whose documentation this repository generates today. Wave-2 apps are added
# here as their sections are filled in.
$KnownApps = @('nornir', 'hnitbjorg', 'bragi', 'iceland-docex')

# The catalogue also contains Foundation's own types (Data.*, Finance.*, Sales.*,
# Help.MessageTypes.Get, Test.*). Those belong to Bifröst Foundation, whose
# documentation arrives in the second wave, so they are counted and skipped.

# Test-only message types exist so a test app can reach setup that is
# `Access = Internal`. They are not part of the public API and are never
# published.
$ExcludedPatterns = @('Test.*', '*.Test.*')

function Resolve-OwningApp {
    param([string] $Type, [string] $Directory)

    foreach ($pattern in $ExcludedPatterns) {
        if ($Type -like $pattern) { return $null }
    }

    if ($Directory) {
        foreach ($prefix in $PrefixMap.Keys) {
            if ($Directory -like "$prefix*") { return $PrefixMap[$prefix] }
        }
    }
    foreach ($prefix in $PrefixMap.Keys) {
        if ($Type -like "$prefix*") { return $PrefixMap[$prefix] }
    }
    return $null
}

# ---------------------------------------------------------------------------
# Credentials
# ---------------------------------------------------------------------------

function Get-BifrostCredential {
    $user = $env:BC_USER
    $password = $env:BC_PASSWORD

    if (-not $user) { $user = [Environment]::GetEnvironmentVariable('BC28IS_USER', 'User') }
    if (-not $password) { $password = [Environment]::GetEnvironmentVariable('BC28IS_PASSWORD', 'User') }

    if (-not $user -or -not $password) {
        throw 'No Bifröst credentials found. Set BC_USER/BC_PASSWORD (CI) or the user-level BC28IS_USER/BC28IS_PASSWORD environment variables (local). Values are never printed or stored by this script.'
    }

    return [pscredential]::new($user, (ConvertTo-SecureString $password -AsPlainText -Force))
}

# ---------------------------------------------------------------------------
# Queue API
# ---------------------------------------------------------------------------

# One CloudEvents 1.0 envelope per call. `datacontenttype` is fixed; `source` names
# this generator so the request log shows where a call came from.
#
# `data` is a STRING on the wire, not a nested object: the OData entity behind
# /tasks types it as text, and posting an object there fails with
# "An unexpected 'StartObject' node was found for property named 'data'".
function New-BifrostEnvelope {
    param([string] $Type, [hashtable] $Data, [string] $Subject)

    $envelope = @{
        specversion     = '1.0'
        id              = [guid]::NewGuid().ToString()
        source          = 'bifrost-docs/generate-message-type-docs'
        type            = $Type
        time            = (Get-Date).ToUniversalTime().ToString('o')
        datacontenttype = 'application/json'
        data            = ($Data | ConvertTo-Json -Depth 12 -Compress)
    }

    # `Help.Implementation.Get` takes the message type name here, in the envelope,
    # not inside the payload. The key has to be absent rather than empty for the
    # types that do not use it — a blank `subject` is rejected outright.
    if ($Subject) { $envelope['subject'] = $Subject }

    return $envelope
}

<#
    Posts one task and returns its parsed response body.

    The queue API answers a POST with a task id, and the body is fetched separately
    from the `data` stream. Both steps are serial by design.
#>
function Invoke-BifrostMessage {
    param(
        [Parameter(Mandatory)] [string] $Type,
        [hashtable] $Data = @{},
        [string] $Subject = '',
        [pscredential] $Credential,
        [string] $BaseUrl,
        [string] $Tenant
    )

    $body = New-BifrostEnvelope -Type $Type -Data $Data -Subject $Subject | ConvertTo-Json -Depth 12 -Compress

    $task = Invoke-RestMethod -Method Post `
        -Uri "$BaseUrl/tasks?tenant=$Tenant" `
        -ContentType 'application/json' `
        -Body $body `
        -Credential $Credential `
        -Authentication Basic

    $taskId = $task.id
    if (-not $taskId) { throw "No task id returned for $Type." }

    $status = if ($task.PSObject.Properties.Name -contains 'status') { $task.status } else { '' }
    if ($status -eq 'Error') {
        throw "$Type returned status Error: $($task.statusReason)"
    }

    $raw = Invoke-RestMethod -Method Get `
        -Uri "$BaseUrl/responses($taskId)/data?tenant=$Tenant" `
        -Credential $Credential `
        -Authentication Basic

    if ($raw -is [string]) {
        try { return $raw | ConvertFrom-Json -Depth 32 } catch { return $raw }
    }
    return $raw
}

# ---------------------------------------------------------------------------
# Page writing
# ---------------------------------------------------------------------------

# MDX reads `{` as the start of an expression and `<Word` as a JSX tag. Help text
# uses both as literal characters, outside code fences as well as inside them.
function ConvertTo-MdxSafe {
    param([string] $Markdown)

    $fences = New-Object System.Collections.ArrayList
    $parked = [regex]::Replace($Markdown, '(?s)```.*?```|`[^`\n]*`', {
        param($m)
        $null = $fences.Add($m.Value)
        "`u{0}$($fences.Count - 1)`u{0}"
    })

    $escaped = $parked -replace '\{', '&#123;' -replace '\}', '&#125;'
    $escaped = [regex]::Replace($escaped, '<(?=[A-Za-z][A-Za-z0-9._-]*[>\s])', '&lt;')

    return [regex]::Replace($escaped, "`u{0}(\d+)`u{0}", { param($m) $fences[[int]$m.Groups[1].Value] })
}

function Get-Slug {
    param([string] $Type)
    return ($Type -replace '\.', '-').ToLowerInvariant()
}

function Write-MessageTypePage {
    param(
        [string] $SiteRoot,
        [string] $AppId,
        [string] $Type,
        [string] $Markdown,
        [int] $Position
    )

    $dir = Join-Path $SiteRoot "docs/$AppId/reference/message-types"
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

    $slug = Get-Slug -Type $Type
    $body = ConvertTo-MdxSafe -Markdown $Markdown.Trim()

    # The help text usually opens with its own H1 naming the type; the page title
    # in the front matter renders one already.
    $body = [regex]::Replace($body, '^#\s+.*\r?\n', '')

    $frontMatter = @(
        '---'
        "id: $slug"
        "title: `"$Type`""
        "sidebar_label: `"$Type`""
        "sidebar_position: $Position"
        "description: `"Request and response contract for the $Type Bifröst message type.`""
        '---'
        ''
        ':::info Generated page'
        'This page is generated from the message type''s own help codeunit by'
        '`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.'
        ':::'
        ''
    ) -join "`n"

    $file = Join-Path $dir "$slug.md"
    Set-Content -Path $file -Value "$frontMatter`n$body`n" -Encoding utf8NoBOM
    return $file
}

function Write-CategoryFile {
    param([string] $SiteRoot, [string] $AppId)

    # An explicit `slug` is what keeps the category page at the same path as its
    # folder. Without it Docusaurus files generated indexes under
    # `<app>/category/...`, which no link in the site would guess.
    $dir = Join-Path $SiteRoot "docs/$AppId/reference/message-types"
    $category = @{
        label    = 'Message types'
        position = 1
        link     = @{
            type        = 'generated-index'
            slug        = '/reference/message-types'
            description = "Every message type this app adds to the Bifröst catalogue. Generated from the app's own help codeunits."
        }
    } | ConvertTo-Json -Depth 5

    Set-Content -Path (Join-Path $dir '_category_.json') -Value $category -Encoding utf8NoBOM

    $referenceDir = Join-Path $SiteRoot "docs/$AppId/reference"
    $referenceCategory = Join-Path $referenceDir '_category_.json'
    if (-not (Test-Path $referenceCategory)) {
        @{
            label    = 'Reference'
            position = 4
            link     = @{
                type        = 'generated-index'
                slug        = '/reference'
                description = 'Developer reference for this app.'
            }
        } | ConvertTo-Json -Depth 5 | Set-Content -Path $referenceCategory -Encoding utf8NoBOM
    }
}

# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

# The lock is advisory and process-scoped: it stops two documentation runs, or a
# run and a test agent, from hitting the queue endpoint at the same time.
if (Test-Path $LockFile) {
    $age = (Get-Date) - (Get-Item $LockFile).LastWriteTime
    if ($age.TotalMinutes -lt 30) {
        throw "Another Bifröst run holds $LockFile (started $([int]$age.TotalMinutes) minute(s) ago). Wait for it to finish, or delete the file if it is stale."
    }
    Write-Warning "Ignoring stale lock file $LockFile ($([int]$age.TotalHours) hour(s) old)."
}

New-Item -ItemType File -Path $LockFile -Force | Out-Null

try {
    $credential = Get-BifrostCredential

    Write-Host 'Fetching the message type catalogue...'
    $catalogue = Invoke-BifrostMessage -Type 'Help.MessageTypes.Get' -Credential $credential -BaseUrl $BaseUrl -Tenant $Tenant

    # The catalogue comes back as { status, usage, result: [ { name, isEnabled,
    # filterTableNo, description, messageDirection } ] }. The alternatives are
    # kept because older releases used different envelope keys.
    $types = @()
    foreach ($candidate in @('result', 'messageTypes', 'types', 'value', 'items')) {
        if ($catalogue.PSObject.Properties.Name -contains $candidate) {
            $types = $catalogue.$candidate
            break
        }
    }
    if (-not $types -and $catalogue -is [array]) { $types = $catalogue }
    if (-not $types) { throw 'Could not find the message type list in the Help.MessageTypes.Get response.' }

    # Strict mode makes a missing property an error rather than $null, so read
    # every optional field through the property bag.
    function Get-Property {
        param($Object, [string[]] $Names)
        foreach ($name in $Names) {
            if ($Object.PSObject.Properties.Name -contains $name) {
                $value = $Object.$name
                if ($value) { return $value }
            }
        }
        return ''
    }

    $planned = @()
    $unmapped = @()
    foreach ($entry in $types) {
        $key = if ($entry -is [string]) { $entry } else { Get-Property $entry @('name', 'key', 'type', 'messageType') }
        $directory = if ($entry -is [string]) { '' } else { Get-Property $entry @('directory', 'helpDirectory') }
        if (-not $key) { continue }

        $owner = Resolve-OwningApp -Type $key -Directory $directory
        if (-not $owner) { $unmapped += $key; continue }
        if ($App -and $owner -ne $App) { continue }
        if (-not $App -and $KnownApps -notcontains $owner) { continue }

        $planned += [pscustomobject]@{ Type = $key; AppId = $owner }
    }

    Write-Host ("Catalogue: {0} type(s); {1} mapped to a documented app; {2} belong to apps not documented here yet." -f @($types).Count, $planned.Count, $unmapped.Count)

    if ($ListOnly) {
        $planned | Sort-Object AppId, Type | Format-Table -AutoSize
        if ($unmapped.Count) {
            Write-Host ''
            Write-Host 'Not mapped to a documented app (Foundation types and second-wave apps):'
            $unmapped | Sort-Object | ForEach-Object { Write-Host "  $_" }
        }
        return
    }

    $written = 0
    $failed = @()
    foreach ($group in $planned | Group-Object AppId) {
        $position = 0
        foreach ($item in $group.Group | Sort-Object Type) {
            $position++
            try {
                # Strictly serial: one implementation call at a time, no batching.
                $help = Invoke-BifrostMessage -Type 'Help.Implementation.Get' `
                    -Subject $item.Type `
                    -Credential $credential -BaseUrl $BaseUrl -Tenant $Tenant

                # The help contract comes back as raw Markdown, not a JSON object.
                $markdown = if ($help -is [string]) { $help } else { $help.result ?? $help.markdown ?? $help.help ?? $help.content ?? $help.text }
                if (-not $markdown) {
                    $failed += "$($item.Type): no Markdown in the Help.Implementation.Get response"
                    continue
                }

                $file = Write-MessageTypePage -SiteRoot $SiteRoot -AppId $item.AppId -Type $item.Type -Markdown $markdown -Position $position
                $written++
                Write-Host "  $($item.AppId)/$($item.Type)"
                $null = $file
            }
            catch {
                $failed += "$($item.Type): $($_.Exception.Message)"
            }
        }
        Write-CategoryFile -SiteRoot $SiteRoot -AppId $group.Name
    }

    Write-Host ''
    Write-Host "Wrote $written page(s)."
    if ($failed.Count) {
        Write-Host ''
        Write-Warning "$($failed.Count) type(s) could not be generated:"
        $failed | ForEach-Object { Write-Warning "  $_" }
        exit 1
    }
}
finally {
    Remove-Item $LockFile -Force -ErrorAction SilentlyContinue
}
