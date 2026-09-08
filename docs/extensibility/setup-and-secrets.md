---
id: setup-and-secrets
title: "Setup and secrets"
sidebar_label: "Setup and secrets"
sidebar_position: 5
description: "Hanging your setup off the Bifröst Setup page, storing credentials in Secret Store ori, and masking the request log."
---

# Setup and secrets

An administrator configures the whole Bifröst family from one page. A dependent app hangs
its own setup off that page, keeps its credentials in Foundation's secret store, and tells
Foundation which of its outbound traffic must never be logged in clear text.

## Reaching your setup from the Bifröst Setup page

The **Bifrost Setup** page (`Setup ori`, page 10077914) is the entry point. It is the only
page in the family with `UsageCategory = Administration`; everything else is reached from
it.

**The rule: a dependent app adds exactly one action.** Foundation ships two deliberately
empty groups for that single action, and nothing else on the page is an extension point:

| Group | Area | Purpose |
| --- | --- | --- |
| `Apps` | `area(Processing)` | Holds one action per installed Bifröst app |
| `Category_Apps` | `area(Promoted)` | The matching promoted category, so that action reaches the ribbon |

(`Category_Connectors` sits alongside `Category_Apps` and belongs to Foundation's own
connector actions.)

The whole footprint of a dependent app on the Bifröst Setup page is one page extension with
one action and one action reference:

```al
namespace Origo.Bifrost.IcelandTreasury;

using Origo.Bifrost;

/// <summary>
/// Adds the Bifröst Iceland Treasury setup action to the Bifröst Setup page.
/// </summary>
pageextension 10036010 "Treasury Setup Ext ori" extends "Setup ori"
{
    actions
    {
        addlast(Apps)
        {
            action(TreasurySetup)
            {
                ApplicationArea = All;
                Caption = 'Iceland Treasury', Comment = 'is-IS=Fjárstýring Íslands';
                ToolTip = 'Open the setup of the Bifröst Iceland Treasury application.', Comment = 'is-IS=Opna uppsetningu Bifröst fjárstýringar Íslands.';
                Image = Bank;
                RunObject = page "Treasury Setup ori";
            }
        }
        addlast(Category_Apps)
        {
            actionref(TreasurySetup_Promoted; TreasurySetup)
            {
            }
        }
    }
}
```

Keep the caption short — it is the app's name, not a sentence. The `ToolTip` carries the
explanation.

### What you must not add to `Setup ori`

| Do not | Do this instead |
| --- | --- |
| Add fields to `Setup ori` through a table extension | Create your own setup table and page |
| Add a field group to `Setup ori` through a page extension | Put the fields on your own setup page |
| Add an action group of your own to `Setup ori` | Put the actions on your own setup page |
| Add several actions to the `Apps` group | Add one; group the rest behind your setup page |
| Add a promoted category of your own | Use `addlast(Category_Apps)` |

The reason is upgrade cost. Foundation is shared by every Bifröst app. A field one app adds
to `Setup ori` ships to every tenant that installs Foundation, is visible to every other
app, and has to be carried forever, because removing it later is a breaking change.

### Your own setup page

A dependent app's setup page is an ordinary card page over its own setup table:

- a `General` group with the app's own fields;
- a group or action that opens **Bifrost App Secrets** filtered to the app, when it needs
  secrets;
- the app's own lists, logs and processing actions.

Nornir's extension of the Bifröst Setup page goes one step further: `OnOpenPage` sends a
`Notification` when HTTP client requests are blocked or its job queue is not running, with
an action that opens its setup wizard. That is a good pattern for anything an administrator
must switch on before the app works — surface it where they already are, rather than
failing later at call time.

Your own setup page carries `ContextSensitiveHelpPage`, and your `pageextension` may set
its own so F1 on Bifrost Setup lands on your app's help page.

### `UsageCategory = None` on your own pages

Every page your app owns that is reached from Bifrost Setup — setup cards, lists, log
viewers, card pages behind a list — is declared with:

```al
page 10035536 "Scheduler Setup ori"
{
    PageType = Card;
    ApplicationArea = All;
    UsageCategory = None;
    // …
}
```

`UsageCategory = None` keeps the page out of Tell Me and out of the role centre search.
The administrator reaches it from Bifrost Setup, where it sits in context with the rest of
the family, and there is exactly one route to it. Nornir and Hnitbjörg apply this to every
one of their setup, list and card pages.

The one page that stays searchable is Bifrost Setup itself, and Foundation's own shared
administration pages such as **Bifrost App Secrets**.

## Secrets

**A credential never lands in a table field.** Not encrypted, not obfuscated, not "just for
now". Foundation ships a secret store for exactly this, and using it means the value goes
to IsolatedStorage and nowhere else — not to a table, not to telemetry, not into an error
message.

**Never build your own secret store.** Not a table with an encrypted BLOB, not a per-app
IsolatedStorage wrapper, not a "temporary" setup field. Foundation's store is the one place
the family keeps credentials, and it is the only one the shared **Bifrost App Secrets**
page can show an administrator. A second store means a secret nobody can find, rotate or
audit.

### `Secret Store ori`

Codeunit 10078305, `Access = Public`. Values are written to IsolatedStorage under the
Bifröst Foundation module with the key `<App Id>/<Secret Code>`.

| Procedure | Purpose |
| --- | --- |
| `Register(AppId; SecretCode; Description; Scope)` | Declares a secret your app needs. Idempotent — safe from install, upgrade and every time a setup page opens. |
| `Set(AppId; SecretCode; Value: SecretText)` | Stores the value. `[NonDebuggable]`. |
| `TryGet(AppId; SecretCode; var Value: SecretText): Boolean` | Reads it back. Returns `false` when nothing is stored. `[NonDebuggable]`, and deliberately side-effect free. |
| `IsSet(AppId; SecretCode): Boolean` | Whether a value exists, without reading it. |
| `SetFromDialog(AppId; SecretCode)` | Opens Foundation's shared masked-input dialog. An overload adds confirmation entry and a multi-line field for long values such as a base-64 certificate. |
| `MarkUsed(AppId; SecretCode)` | Stamps "last used", at most once per day. Call it from a context that may write — never from a read-only API request. |
| `Clear(AppId; SecretCode)` / `ClearAll(AppId)` | Removes stored values, keeping the registration so the administrator still sees which secret is missing. |
| `Unregister(AppId; SecretCode)` / `UnregisterAll(AppId)` | Removes stored values **and** deletes the registration row, so the secret no longer appears on Bifrost App Secrets at all. |
| `GetStorageKey(AppId; SecretCode): Text` | The storage key, for assertions in tests. Never the value. |

The `AppId` is always your own module:

```al
local procedure AppId(): Guid
var
    AppInfo: ModuleInfo;
begin
    NavApp.GetCurrentModuleInfo(AppInfo);
    exit(AppInfo.Id());
end;
```

Register from your install codeunit, and again when your setup page opens so a secret added
in a later version appears without a reinstall:

```al
SecretStore.Register(AppId(), 'API-KEY', 'API key for the external service.', "Secret Scope ori"::Company);
```

`Secret Scope ori` has two values. `Company` stores one value for the whole company
(IsolatedStorage `DataScope::Company`); `Company And User` stores one value per user
(`DataScope::CompanyAndUser`). Changing the scope of an already registered secret clears
the stored value, because the value then lives in a different data scope.

Reading is a `SecretText`:

```al
var
    SecretStore: Codeunit "Secret Store ori";
    ApiKey: SecretText;
begin
    if not SecretStore.TryGet(AppId(), 'API-KEY', ApiKey) then begin
        Argument.RespondWithError(ApiKeyMissingErr);
        exit;
    end;
    RequestHeaders.Add('Authorization', ApiKey);
end;
```

Keep your own procedures that touch the value `[NonDebuggable]`, and pass `SecretText`
straight into the HTTP headers rather than converting it to `Text`.

### The shared secrets page

Foundation's **Bifrost App Secrets** page lists every secret registered by every installed
app: application, secret code, description, scope, whether a value is set, when it was
entered and by whom. Never the value. It is reachable from Bifrost Setup, and your setup
page can open it filtered to your own app id.

Because registration is what makes a secret visible there, a secret you forgot to register
is invisible to the administrator — they cannot enter it, and they cannot see that it is
missing.

When the record that owns a secret is deleted — a bank connection, a provider configuration
— call `Unregister` from its `OnDelete` trigger, so the registry does not keep listing a
secret nobody uses any more.

### Secrets do not survive a take-over

IsolatedStorage is scoped to the extension that wrote it. A successor app has a **new app
id**, so it cannot read what the app it replaces stored — the install take-over copies
tables, and there is no way for it to copy secrets. Every credential has to be entered
again after the switch.

Three things follow:

1. **Register every secret at install**, so the administrator sees the complete list of
   what the new app needs on **Bifrost App Secrets** the moment it is installed.
2. **Keep an `IsSet` status field per secret** on your own setup page, so a missing value is
   visible where the administrator is working, not only after the first call fails.
3. **Fail with a hint, not a stack trace.** When `TryGet` returns `false`, respond with
   "Secrets missing — enter them on Bifrost App Secrets", naming the secret code.

Say so in the release notes of the successor app. Re-entering credentials is a manual step
in the cut-over plan, and an administrator who is not told will discover it from a failed
integration.

## The request log and its masker

Foundation keeps a shared request log of outbound HTTP calls, written through the public
facade `Request Logger ori`. Every entry carries a **log type**, and each log type resolves
to a masker that redacts the bodies before they are stored. The log record is immutable:
masking happens once, at insert time.

### Register your log type

`Request Log Type ori` (10078259) is extensible and its `DefaultImplementation` is
`Req Log Default Masker ori`, which is fail-safe — it redacts every body and every error
text unless the Bifröst setup has **Request Debug Mode** switched on.

If default redaction is what you want, the enum value alone is enough. Nornir classifies
its playbook traffic this way:

```al
namespace Origo.Bifrost.Nornir;

using Origo.Bifrost;

enumextension 10035605 "RequestLogType.EnumExt ori" extends "Request Log Type ori"
{
    value(10035605; "Nornir Playbook")
    {
        Caption = 'Nornir Playbook', Comment = 'is-IS=Bifröst keðja';
    }
}
```

When you want finer control — keep error text readable, redact only the bodies — bind your
own masker on the value. Bragi does this for its language-model traffic:

```al
enumextension 10035400 "Bragi Request Log Type ori" extends "Request Log Type ori"
{
    value(10035421; "LLM")
    {
        Caption = 'LLM', Comment = 'is-IS=LLM';
        Implementation = "Request Log Masker ori" = "LLM Req Log Masker ori";
    }
}
```

### Implement the masker

```al
interface "Request Log Masker ori"
{
    procedure MaskRequestBody(Body: Text; DebugMode: Boolean): Text
    procedure MaskResponseBody(Body: Text; DebugMode: Boolean): Text
    procedure MaskErrorText(ErrorText: Text; DebugMode: Boolean): Text
    procedure GetBaseUrl(FullUrl: Text): Text
}
```

`GetBaseUrl` is the one that is easy to get wrong. It fills the public **Service Base URL**
field and must return only scheme and host — it has to strip paths, query strings,
fragments and any session token that travelled in the URL.

Bragi's masker keeps error text intact and redacts the bodies outside debug mode:

```al
codeunit 10035409 "LLM Req Log Masker ori" implements "Request Log Masker ori"
{
    Access = Internal;

    var
        RedactedTok: Label '***REDACTED***', Locked = true;

    procedure MaskRequestBody(Body: Text; DebugMode: Boolean): Text
    begin
        if DebugMode then
            exit(Body);
        exit(RedactedTok);
    end;

    procedure MaskErrorText(ErrorText: Text; DebugMode: Boolean): Text
    begin
        exit(ErrorText);
    end;
    // …
}
```

`DebugMode` comes from **Request Debug Mode** on the Bifröst setup record. It is a
troubleshooting switch, not a mode to run in: while it is on, unmasked bodies are stored.

### Write to the log

```al
var
    RequestLogger: Codeunit "Request Logger ori";
begin
    RequestLogger.Log(
        'ListFiles', 'GET', FullServiceUrl, 'Azure Blob', HttpStatus,
        Elapsed, IsSuccess, ErrorText, RequestBody, ResponseBody,
        "Request Log Type ori"::"Nornir Playbook");
    RequestLogger.Insert();
end;
```

`Log` prepares and masks the entry; `Insert` writes it in a background session, which is
what you want after a `TryFunction` — the log survives a rollback of the work that failed.
`InsertLog` does both in the foreground when that isolation is not needed, and
`GetLastEntryNo` returns the key it was given.

Decide deliberately which of your fields must never reach the log in clear text —
credentials, tokens, personal data in payloads — and make the masker responsible for them.
The default masker's behaviour is the safe fallback, so a log type you forget to bind still
redacts everything.

## Next

- Registering secrets and guard exceptions belongs in your install codeunit:
  [Install and upgrade](/extensibility/install-and-upgrade).
- Foundation's `Setup ori` is `Access = Internal`, so tests reach it through test-only
  message types: [Testing](/extensibility/testing).
