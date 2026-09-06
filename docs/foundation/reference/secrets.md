---
id: secrets
title: "Secrets"
sidebar_position: 6
---

## Overview

Bifröst Foundation owns one secret store for every application built on it. An application
registers the secrets it needs, an administrator enters the values through one shared masked
dialog, and the application reads them back with a single call.

Before this, each application shipped its own `<X> Secret Mgt ori` codeunit and its own
`<X> Set Secret Dialog ori` page. That is no longer needed.

**Namespace:** `Origo.Bifrost`

| Object | Id | Purpose |
|---|---|---|
| Codeunit `Secret Store ori` | 10078305 | The public API - the only thing an application needs |
| Table `App Secret ori` | 10078304 | The registry: which secrets exist, not their values |
| Enum `Secret Scope ori` | 10078303 | `Company` / `Company And User` |
| Page `Set Secret Dialog ori` | 10078306 | The shared masked input dialog |
| Page `App Secrets ori` | 10078307 | The administrator's list of registered secrets |

---

## Where the value lives

Values are written to **IsolatedStorage under the Bifröst Foundation module**, never to a table,
never to telemetry, never to an error message. The storage key is:

```
<App Id>/<Secret Code>
```

where `<App Id>` is the application's id formatted without braces (`Format(AppId, 0, 4)`).

The IsolatedStorage data scope follows the registered scope:

| Scope | Data scope | Meaning |
|---|---|---|
| `Company` | `DataScope::Company` | One value shared by everyone in the company |
| `Company And User` | `DataScope::CompanyAndUser` | Every user enters an own value |

Because the store is a `SecretText` end to end, an extension compiled for `Cloud` can pass the
value to an `HttpClient` header, to `IsolatedStorage` or to a cryptography API, but can never
print it, log it or convert it back to `Text`. That is by design.

---

## The API

All procedures are on `codeunit "Secret Store ori"`, `Access = Public`.

### Register

```al
procedure Register(AppId: Guid; SecretCode: Code[50]; Description: Text[100]; Scope: Enum "Secret Scope ori")
```

Creates or updates the registry row. **Idempotent** - call it from the install codeunit, the
upgrade codeunit and the setup page's `OnOpenPage`; it never creates duplicates.

Registering an existing secret with a **different scope drops the stored value**, because the
value would otherwise be unreachable in the new data scope. The administrator has to enter it once
more.

### Set

```al
procedure Set(AppId: Guid; SecretCode: Code[50]; Value: SecretText)
```

Stores the value and stamps the registry row (`Is Set`, `Set On`, `Set By`). Fails when the secret
is not registered or the value is empty.

### TryGet

```al
procedure TryGet(AppId: Guid; SecretCode: Code[50]; var Value: SecretText): Boolean
```

Returns `true` and the value when one is stored for the current scope, `false` otherwise. It never
throws, so an application can use it to decide whether to show a "secret missing" hint.

### IsSet

```al
procedure IsSet(AppId: Guid; SecretCode: Code[50]): Boolean
```

Answers whether a value exists **without reading it**. Use this on setup pages and status fields.

### MarkUsed

```al
procedure MarkUsed(AppId: Guid; SecretCode: Code[50])
```

Stamps `Last Used On` on the registry row, at most once per day. `TryGet` deliberately does **not**
call it, so reading a secret never writes - a read-only API request would otherwise fail. Call it
yourself from a context that is allowed to write.

### Clear / ClearAll

```al
procedure Clear(AppId: Guid; SecretCode: Code[50])
procedure ClearAll(AppId: Guid)
```

Remove the stored value(s). The registrations survive, so the administrator still sees which
secrets the application expects.

### SetFromDialog

```al
procedure SetFromDialog(AppId: Guid; SecretCode: Code[50]): Boolean
procedure SetFromDialog(AppId: Guid; SecretCode: Code[50]; RequireConfirmation: Boolean; MultiLine: Boolean): Boolean
```

Opens the shared masked dialog and stores what the user typed. Returns `true` when a value was
stored.

- `RequireConfirmation` shows a second masked field; both must match. Use it for passwords.
- `MultiLine` shows a multi-line field instead of the masked one. Use it for long base-64 values
  such as certificates, which nobody types by hand and which cannot be reviewed in a masked field.

### GetStorageKey

```al
procedure GetStorageKey(AppId: Guid; SecretCode: Code[50]): Text
```

Returns the IsolatedStorage key. Useful in tests and in support scenarios; it never exposes the
value.

---

## Using it in an application

```al
namespace Origo.Bifrost.IcelandTreasury;

using Origo.Bifrost;
using System.Environment;

codeunit 10036020 "Treasury Secrets ori"
{
    var
        ClientSecretTok: Label 'CLIENT-SECRET', Locked = true;

    /// <summary>
    /// Registers the secrets this application needs. Safe to call on every install and upgrade.
    /// </summary>
    internal procedure RegisterSecrets()
    var
        SecretStore: Codeunit "Secret Store ori";
    begin
        SecretStore.Register(AppId(), ClientSecretTok, 'Client secret of the bank API registration', "Secret Scope ori"::Company);
    end;

    /// <summary>
    /// Returns the client secret, or fails with a message that points at the setup page.
    /// </summary>
    [NonDebuggable]
    internal procedure GetClientSecret() Value: SecretText
    var
        SecretStore: Codeunit "Secret Store ori";
        SecretMissingErr: Label 'The client secret is not set. Enter it on the Bifröst App Secrets page.', Comment = 'is-IS=Leyndarmál biðlarans er ekki skráð. Skráðu það á síðunni Leyndarmál forrita Bifröst.';
    begin
        if not SecretStore.TryGet(AppId(), ClientSecretTok, Value) then
            Error(SecretMissingErr);
    end;

    local procedure AppId(): Guid
    var
        ModuleInfo: ModuleInfo;
    begin
        NavApp.GetCurrentModuleInfo(ModuleInfo);
        exit(ModuleInfo.Id());
    end;
}
```

On the application's own setup page, show the status and offer the dialog:

```al
field(ClientSecretIsSet; ClientSecretIsSet)
{
    Caption = 'Client Secret', Comment = 'is-IS=Leyndarmál biðlarans';
    Editable = false;
    ToolTip = 'Specifies whether the client secret has been entered.', Comment = 'is-IS=Tilgreinir hvort leyndarmál biðlarans hafi verið skráð.';
}
```

```al
action(SetClientSecret)
{
    Caption = 'Set Client Secret...', Comment = 'is-IS=Skrá leyndarmál biðlarans...';
    ToolTip = 'Enter the client secret of the bank API registration.', Comment = 'is-IS=Skráðu leyndarmál biðlarans fyrir skráningu bankans.';
    Image = EncryptionKeys;

    trigger OnAction()
    var
        SecretStore: Codeunit "Secret Store ori";
    begin
        if SecretStore.SetFromDialog(AppId(), 'CLIENT-SECRET', true, false) then
            CurrPage.Update(false);
    end;
}
```

To show every secret of the application in one list, open `App Secrets ori` filtered:

```al
var
    AppSecrets: Page "App Secrets ori";
begin
    AppSecrets.SetAppFilter(AppId());
    AppSecrets.Run();
end;
```

---

## The administrator's view

**Bifröst Setup → Setup → Secrets** opens `App Secrets ori` for every installed application. The
list shows the application, the secret code, its description, its scope, whether a value is stored
(`Is Set`, green when set, red when missing), when it was entered and by whom. It never shows the
value.

Actions: **Set...** opens the shared dialog, **Clear** removes the value and keeps the
registration.

---

## Permissions

| Permission set | Access |
|---|---|
| `BIFROST Read ori` | read on `App Secret ori`, execute on the store and the pages |
| `BIFROST Full ori` | RIMD on `App Secret ori`, execute on the store and the pages |

Reading a value through `TryGet` only needs read permission on the registry table; the value comes
from IsolatedStorage, which is governed by the extension, not by table permissions.

---

## Telemetry

| Event type | Tag | Logged |
|---|---|---|
| `Secret Set` | ORI-BIF-0160 | app id, secret code |
| `Secret Cleared` | ORI-BIF-0161 | app id, secret code |

The value is never part of a telemetry dimension.

---

## Not to be confused with

`Secret Mgt ori` (codeunit 10077907) is **internal** to Foundation and serves the licensing
backend: App Key Vault in SaaS, company-scoped IsolatedStorage on premises. It is unrelated to the
application secret store described here and is not part of the public API.

---

## Related

- **[Extending Bifröst Setup](/extensibility/setup-and-secrets/)** - the Apps extension point
- **[Setup Reference](/foundation/reference/setup/)** - the Bifröst Setup table
- **KeyVault Setup** - the licensing secrets in the App Key Vault
