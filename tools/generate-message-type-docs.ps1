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
    Bifröst API root, ending in the company segment. The script appends `/tasks` and
    `/responses(<id>)/data` itself. Defaults to the BIFROST_DOCS_BASEURL environment
    variable (a repository secret in CI). The two shapes are:

      online   https://api.businesscentral.dynamics.com/v2.0/<tenant>/<environment>/api/origo/bifrost/v1.0/companies(<id>)
      on-prem  https://<host>/<instance>/api/origo/bifrost/v1.0/companies(<id>)

.PARAMETER Tenant
    Business Central tenant for an on-premises (Basic auth) instance, sent as the
    `?tenant=` query string. Defaults to `default`. Ignored with OAuth: online, the
    tenant is already part of the URL path.

.PARAMETER Auth
    How to authenticate: `Auto` (default), `OAuth` or `Basic`. `Auto` uses OAuth when
    BC_TENANT_ID, BC_CLIENT_ID and BC_CLIENT_SECRET are all set, and falls back to
    Basic otherwise. See .NOTES.

.PARAMETER EntraTenantId
    Microsoft Entra tenant for the OAuth token request. Overrides BC_TENANT_ID.

.PARAMETER ClientId
    Application (client) id of the Entra app registration. Overrides BC_CLIENT_ID.
    There is deliberately no parameter for the client secret: it is read from the
    BC_CLIENT_SECRET environment variable only.

.PARAMETER LockFile
    Path of the advisory lock file. Defaults to `bifrost-mcp.lock` in the system
    temporary directory (`[System.IO.Path]::GetTempPath()`), on Windows and Linux alike.

.PARAMETER SiteRoot
    Repository root of the documentation site. Defaults to the parent of this script.

.PARAMETER ListOnly
    Fetch and print the catalogue with the app each type maps to, and write nothing.
    Use this after adding message types to check the mapping before generating.

.EXAMPLE
    pwsh tools/generate-message-type-docs.ps1
    pwsh tools/generate-message-type-docs.ps1 -App nornir
    pwsh tools/generate-message-type-docs.ps1 -ListOnly

.EXAMPLE
    # Business Central online, OAuth client credentials. Set the variables in the
    # session (or as CI secrets) first; the values never go on the command line.
    #   BC_TENANT_ID, BC_CLIENT_ID, BC_CLIENT_SECRET, BIFROST_DOCS_BASEURL
    pwsh tools/generate-message-type-docs.ps1 -Auth OAuth -ListOnly

.EXAMPLE
    # Force Basic auth against the on-premises instance even when the OAuth
    # variables happen to be set.
    pwsh tools/generate-message-type-docs.ps1 -Auth Basic -App nornir

.NOTES
    Credentials are read from environment variables and never written to disk, echoed,
    or passed on a command line. The script prints one line naming the method it
    chose, and nothing else about the credentials.

    OAuth2 client credentials (Business Central online):

      BC_TENANT_ID       Microsoft Entra tenant (or -EntraTenantId)
      BC_CLIENT_ID       application (client) id (or -ClientId)
      BC_CLIENT_SECRET   client secret (environment variable only, never a parameter)

    The token comes from the Microsoft identity platform v2.0 token endpoint of that
    tenant with scope https://api.businesscentral.dynamics.com/.default. It is held in
    memory for the run and renewed shortly before it expires. It needs an Entra app
    registration with the Dynamics 365 Business Central application permission
    API.ReadWrite.All or Automation.ReadWrite.All (admin consent granted), and the same
    app registered on the Microsoft Entra Applications page in Business Central with
    the Bifröst read permission set. Online, the BC tenant is part of the URL path, so
    no `?tenant=` query string is sent.

    Basic (the on-premises BC28IS instance), used when the OAuth variables are not
    all set:

      CI     BC_USER / BC_PASSWORD           (repository secrets)
      local  BC28IS_USER / BC28IS_PASSWORD   (user-level Windows environment variables)

    Either way the identity needs read access to the Bifröst API only; the help
    message types read no business data.
#>

[CmdletBinding()]
param(
    [string] $App,

    # Never commit an environment URL here: the repository is public.
    [string] $BaseUrl = $env:BIFROST_DOCS_BASEURL,

    [string] $Tenant = 'default',

    [ValidateSet('Auto', 'OAuth', 'Basic')]
    [string] $Auth = 'Auto',

    # Identifiers only. The client secret is never a parameter: it is read from
    # BC_CLIENT_SECRET so it cannot end up in a process listing or shell history.
    [string] $EntraTenantId = $env:BC_TENANT_ID,

    [string] $ClientId = $env:BC_CLIENT_ID,

    [string] $SiteRoot = (Split-Path -Parent $PSScriptRoot),

    # $env:TEMP is unset on Linux; GetTempPath() works on every platform.
    [string] $LockFile = (Join-Path ([System.IO.Path]::GetTempPath()) 'bifrost-mcp.lock'),

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
    'Orchestrator.'         = 'nornir'
    'Help.Orchestrator'     = 'nornir'

    # Bifröst Hnitbjörg — external storage
    'Storage.'              = 'hnitbjorg'
    'Help.Storage'          = 'hnitbjorg'

    # Bifröst Bragi — chat and language models
    'LLM.'                  = 'bragi'
    'Chat.'                 = 'bragi'
    'Help.Chat'             = 'bragi'
    'Help.LLM'              = 'bragi'

    # Bifröst Iceland DocEx — electronic document exchange
    'DocumentExchange.'     = 'iceland-docex'
    'Help.DocumentExchange' = 'iceland-docex'

    # Bifröst Clockify — time tracking
    'Clockify.'             = 'clockify'
    'Help.Clockify'         = 'clockify'

    # Bifröst Subscription Billing
    'Subscription.'         = 'subscription-billing'
    'Help.Subscription'     = 'subscription-billing'

    # Bifröst Iceland Treasury — the bank connectors. Listed before Bifröst
    # Iceland because no key is shared, but kept together for readability.
    'Landsbankinn.'         = 'iceland-treasury'
    'Help.Landsbankinn'     = 'iceland-treasury'
    'Arionbanki.'           = 'iceland-treasury'
    'Arion.'                = 'iceland-treasury'
    'Help.Arionbanki'       = 'iceland-treasury'
    'Help.Arion'            = 'iceland-treasury'
    'Islandsbanki.'         = 'iceland-treasury'
    'Help.Islandsbanki'     = 'iceland-treasury'
    'Kvikabanki.'           = 'iceland-treasury'
    'Kvika.'                = 'iceland-treasury'
    'Help.Kvikabanki'       = 'iceland-treasury'
    'Help.Kvika'            = 'iceland-treasury'
    'Sparisjodir.'          = 'iceland-treasury'
    'Help.Sparisjodir'      = 'iceland-treasury'

    # Bifröst Iceland — Icelandic government services, SMS and Já Gagnatorg.
    # `Finance.VAT` is the exception to "Finance.* belongs to Foundation": the
    # two Icelandic VAT statement types are implemented in Bifröst Iceland, and
    # Foundation ships no Finance.VAT* type of its own.
    'Iceland.'              = 'iceland'
    'Help.Iceland'          = 'iceland'
    'Ja.'                   = 'iceland'
    'Help.Ja'               = 'iceland'
    'Finance.VAT'           = 'iceland'
}

# Apps whose documentation this repository generates. Every app in the family is
# mapped; anything the table does not claim belongs to Bifröst Foundation, which
# owns the standard ERP catalogue (Data.*, Sales.*, Purchase.*, Finance.*,
# Inventory.*, Projects.*, Resources.*, Help.MessageTypes.Get and the rest).
$KnownApps = @(
    'foundation', 'iceland', 'iceland-treasury', 'iceland-docex',
    'bragi', 'hnitbjorg', 'nornir', 'clockify', 'subscription-billing'
)

$FallbackApp = 'foundation'

# Test-only message types exist so a test app can reach setup that is
# `Access = Internal`, or to stand in for an external service. They are not part
# of the public API and are never published.
$ExcludedPatterns = @('Test.*', '*.Test.*', '*.Mock.*')

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

    # Unclaimed types are Foundation's own. Foundation owns the standard ERP
    # catalogue, so its keys have no single prefix to match on — it is the
    # residue, not a pattern.
    return $FallbackApp
}

# ---------------------------------------------------------------------------
# Credentials
# ---------------------------------------------------------------------------

# Two methods, picked once per run by Resolve-BifrostAuth:
#
#   OAuth  OAuth2 client credentials against Microsoft Entra ID, for Business
#          Central online. Used when BC_TENANT_ID, BC_CLIENT_ID and
#          BC_CLIENT_SECRET are all set (or -Auth OAuth).
#   Basic  user name and password for the on-premises BC28IS instance, from
#          BC_USER/BC_PASSWORD or the user-level BC28IS_USER/BC28IS_PASSWORD.
#
# No secret or token is ever printed, logged or written anywhere. Error messages
# name the missing variable, never a value.

$TokenScope = 'https://api.businesscentral.dynamics.com/.default'

# Renew the token when less than this much of its lifetime is left, so a long
# serial run never sends a request with a token that expires in flight.
$TokenRefreshMargin = [timespan]::FromMinutes(5)

function Get-BasicCredentialOrNull {
    $user = $env:BC_USER
    $password = $env:BC_PASSWORD

    if (-not $user) { $user = [Environment]::GetEnvironmentVariable('BC28IS_USER', 'User') }
    if (-not $password) { $password = [Environment]::GetEnvironmentVariable('BC28IS_PASSWORD', 'User') }

    if (-not $user -or -not $password) { return $null }

    return [pscredential]::new($user, (ConvertTo-SecureString $password -AsPlainText -Force))
}

function Get-MissingOAuthVariables {
    param([string] $TenantId, [string] $ClientId)

    $missing = @()
    if (-not $TenantId) { $missing += 'BC_TENANT_ID' }
    if (-not $ClientId) { $missing += 'BC_CLIENT_ID' }
    if (-not $env:BC_CLIENT_SECRET) { $missing += 'BC_CLIENT_SECRET' }
    return , $missing
}

function Resolve-BifrostAuth {
    param([string] $Mode, [string] $TenantId, [string] $ClientId)

    $missingOAuth = Get-MissingOAuthVariables -TenantId $TenantId -ClientId $ClientId

    if ($Mode -eq 'OAuth' -or ($Mode -eq 'Auto' -and $missingOAuth.Count -eq 0)) {
        if ($missingOAuth.Count) {
            $verb = if ($missingOAuth.Count -eq 1) { 'is' } else { 'are' }
            throw "OAuth authentication needs $($missingOAuth -join ', '), which $verb not set. Set the environment variable(s); the client secret is never accepted as a parameter."
        }
        return @{
            Method    = 'OAuth'
            TenantId  = $TenantId
            ClientId  = $ClientId
            Token     = $null
            ExpiresAt = [datetime]::MinValue
        }
    }

    $credential = Get-BasicCredentialOrNull
    if (-not $credential) {
        if ($Mode -eq 'Basic') {
            throw 'Basic authentication needs BC_USER and BC_PASSWORD (CI) or the user-level BC28IS_USER and BC28IS_PASSWORD environment variables (local), which are not set. Values are never printed or stored by this script.'
        }
        throw "No Bifröst credentials found. For Business Central online set BC_TENANT_ID, BC_CLIENT_ID and BC_CLIENT_SECRET (missing: $($missingOAuth -join ', ')). For the on-premises instance set BC_USER/BC_PASSWORD (CI) or the user-level BC28IS_USER/BC28IS_PASSWORD (local). Values are never printed or stored by this script."
    }
    return @{ Method = 'Basic'; Credential = $credential }
}

# Returns a cached access token, fetching a new one when there is none yet or the
# cached one is inside the refresh margin. The secret is read from the environment
# at the moment it is needed and never kept in the auth context.
function Get-BifrostAccessToken {
    param([Parameter(Mandatory)] [hashtable] $AuthContext)

    if ($AuthContext.Token -and (Get-Date).ToUniversalTime().Add($TokenRefreshMargin) -lt $AuthContext.ExpiresAt) {
        return $AuthContext.Token
    }

    $secret = $env:BC_CLIENT_SECRET
    if (-not $secret) { throw 'BC_CLIENT_SECRET is not set.' }

    $tokenUri = 'https://login.microsoftonline.com/{0}/oauth2/v2.0/token' -f [uri]::EscapeDataString($AuthContext.TenantId)
    $requestedAt = (Get-Date).ToUniversalTime()
    try {
        $response = Invoke-RestMethod -Method Post -Uri $tokenUri `
            -ContentType 'application/x-www-form-urlencoded' `
            -Body @{
                grant_type    = 'client_credentials'
                client_id     = $AuthContext.ClientId
                client_secret = $secret
                scope         = $TokenScope
            }
    }
    catch {
        # Report the identity platform's error code only. The request carried the
        # secret, so nothing from the request itself goes into the message.
        $failure = $_
        $detail = ''
        if ($failure.ErrorDetails -and $failure.ErrorDetails.Message) {
            try {
                $err = $failure.ErrorDetails.Message | ConvertFrom-Json -ErrorAction Stop
                if ($err.PSObject.Properties.Name -contains 'error' -and $err.error) { $detail = ", $($err.error)" }
            }
            catch { }
        }
        $statusCode = ''
        if ($failure.Exception.PSObject.Properties.Name -contains 'Response' -and $failure.Exception.Response) {
            $statusCode = "HTTP $([int]$failure.Exception.Response.StatusCode)"
        }
        $reason = "$statusCode$detail".TrimStart(', ')
        if ($reason) { $reason = " ($reason)" }
        throw "Could not get an OAuth access token from Microsoft Entra ID$reason. Check BC_TENANT_ID, BC_CLIENT_ID and BC_CLIENT_SECRET."
    }
    finally {
        $secret = $null
    }

    if (-not $response.access_token) { throw 'The token response from Microsoft Entra ID carried no access token.' }

    $lifetime = 3600
    if ($response.PSObject.Properties.Name -contains 'expires_in' -and $response.expires_in) { $lifetime = [int]$response.expires_in }

    $AuthContext.Token = $response.access_token
    $AuthContext.ExpiresAt = $requestedAt.AddSeconds($lifetime)
    return $AuthContext.Token
}

# Splat for Invoke-RestMethod: a Bearer header for OAuth, Basic credentials
# otherwise. Called before every request so a long run picks up a renewed token.
function Get-BifrostRequestAuth {
    param([Parameter(Mandatory)] [hashtable] $AuthContext)

    if ($AuthContext.Method -eq 'OAuth') {
        $token = Get-BifrostAccessToken -AuthContext $AuthContext
        return @{ Headers = @{ Authorization = "Bearer $token" } }
    }
    return @{ Credential = $AuthContext.Credential; Authentication = 'Basic' }
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
        [Parameter(Mandatory)] [hashtable] $AuthContext,
        [string] $BaseUrl,
        [string] $Tenant
    )

    $body = New-BifrostEnvelope -Type $Type -Data $Data -Subject $Subject | ConvertTo-Json -Depth 12 -Compress

    # On-premises the tenant travels as a query string. Online it is already part
    # of the URL path (/v2.0/<tenant>/<environment>/...), so nothing is appended.
    $query = if ($AuthContext.Method -eq 'Basic') { "?tenant=$([uri]::EscapeDataString($Tenant))" } else { '' }

    $requestAuth = Get-BifrostRequestAuth -AuthContext $AuthContext
    $task = Invoke-RestMethod -Method Post `
        -Uri "$BaseUrl/tasks$query" `
        -ContentType 'application/json' `
        -Body $body `
        @requestAuth

    $taskId = $task.id
    if (-not $taskId) { throw "No task id returned for $Type." }

    $status = if ($task.PSObject.Properties.Name -contains 'status') { $task.status } else { '' }
    if ($status -eq 'Error') {
        throw "$Type returned status Error: $($task.statusReason)"
    }

    $requestAuth = Get-BifrostRequestAuth -AuthContext $AuthContext
    $raw = Invoke-RestMethod -Method Get `
        -Uri "$BaseUrl/responses($taskId)/data$query" `
        @requestAuth

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

    # Every remaining `<` is escaped, not just the ones that look like a tag.
    # Help text is prose and AL, so a bare `<` is a comparison operator (`<>`,
    # `<=`) or a placeholder far more often than it is markup — and MDX reads
    # `<>` as a fragment, which fails the build with an unclosed-tag error.
    $escaped = $escaped -replace '<', '&lt;'

    $restored = [regex]::Replace($escaped, "`u{0}(\d+)`u{0}", { param($m) $fences[[int]$m.Groups[1].Value] })

    # A `|` inside an inline code span still splits a GFM table cell, which tears
    # the span open and hands the rest of it to MDX as an expression. Escaping it
    # is the documented workaround, and GFM renders `\|` back as a plain pipe.
    $lines = $restored -split "`n"
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i].TrimStart().StartsWith('|')) {
            $lines[$i] = [regex]::Replace($lines[$i], '`([^`
]*)`', {
                param($m)
                $body = $m.Groups[1].Value
                if ($body.Contains('|')) { return '`' + $body.Replace('|', '\|') + '`' }
                return $m.Value
            })
        }
    }

    return ($lines -join "`n")
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

    # Help.Implementation.Get ends every type's help with the shared "Errors and warnings"
    # section. The site documents it once, on reference/errors; link there instead of
    # repeating it on every page.
    $body = [regex]::Replace($body, '(?s)\r?\n## Errors and warnings\r?\n.*$', "`n## Errors and warnings`nErrors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).")

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
    $category = [ordered]@{
        label    = 'Message types'
        position = 1
        link     = [ordered]@{
            type        = 'generated-index'
            slug        = '/reference/message-types'
            description = "Every message type this app adds to the Bifröst catalogue. Generated from the app's own help codeunits."
        }
    } | ConvertTo-Json -Depth 5

    Set-Content -Path (Join-Path $dir '_category_.json') -Value $category -Encoding utf8NoBOM

    $referenceDir = Join-Path $SiteRoot "docs/$AppId/reference"
    $referenceCategory = Join-Path $referenceDir '_category_.json'
    if (-not (Test-Path $referenceCategory)) {
        [ordered]@{
            label    = 'Reference'
            position = 4
            link     = [ordered]@{
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

# Resolve credentials first: a run without them should fail on that, before it
# touches the lock file or needs an API root.
$authContext = Resolve-BifrostAuth -Mode $Auth -TenantId $EntraTenantId -ClientId $ClientId
if ($authContext.Method -eq 'OAuth') {
    Write-Host 'Authentication: OAuth2 client credentials (Microsoft Entra ID, Business Central online).'
}
else {
    Write-Host 'Authentication: Basic (on-premises instance).'
}

# The lock is advisory and process-scoped: it stops two documentation runs, or a
# run and a test agent, from hitting the queue endpoint at the same time.
if (Test-Path $LockFile) {
    $age = (Get-Date) - (Get-Item $LockFile).LastWriteTime
    if ($age.TotalMinutes -lt 30) {
        throw "Another Bifröst run holds $LockFile (started $([int]$age.TotalMinutes) minute(s) ago). Wait for it to finish, or delete the file if it is stale."
    }
    Write-Warning "Ignoring stale lock file $LockFile ($([int]$age.TotalHours) hour(s) old)."
}

if (-not $BaseUrl) {
    throw 'No Bifröst API root. Set the BIFROST_DOCS_BASEURL environment variable or pass -BaseUrl.'
}

New-Item -ItemType File -Path $LockFile -Force | Out-Null

try {
    Write-Host 'Fetching the message type catalogue...'
    $catalogue = Invoke-BifrostMessage -Type 'Help.MessageTypes.Get' -AuthContext $authContext -BaseUrl $BaseUrl -Tenant $Tenant

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
    $excluded = @()
    foreach ($entry in $types) {
        $key = if ($entry -is [string]) { $entry } else { Get-Property $entry @('name', 'key', 'type', 'messageType') }
        $directory = if ($entry -is [string]) { '' } else { Get-Property $entry @('directory', 'helpDirectory') }
        if (-not $key) { continue }

        $owner = Resolve-OwningApp -Type $key -Directory $directory
        if (-not $owner) { $excluded += $key; continue }
        if ($App -and $owner -ne $App) { continue }
        if (-not $App -and $KnownApps -notcontains $owner) { continue }

        $planned += [pscustomobject]@{ Type = $key; AppId = $owner }
    }

    Write-Host ("Catalogue: {0} type(s); {1} mapped to an app; {2} excluded (test-only)." -f @($types).Count, $planned.Count, $excluded.Count)

    if ($ListOnly) {
        $planned | Sort-Object AppId, Type | Format-Table -AutoSize
        if ($excluded.Count) {
            Write-Host ''
            Write-Host 'Excluded (test-only message types, never published):'
            $excluded | Sort-Object | ForEach-Object { Write-Host "  $_" }
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
                    -AuthContext $authContext -BaseUrl $BaseUrl -Tenant $Tenant

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
