---
id: public-surface
title: "Foundation public surface"
sidebar_position: 9
description: "The public extension points of Bifröst Foundation that a dependent app may rely on, and what is internal."
---

This document lists the **public extension points** of Bifröst Foundation that downstream Business Central extensions may rely on.

Anything not listed here is **internal** and may change between releases without notice. The package marks internal codeunits with `Access = Internal` and locks down the rest via the publisher's standard release policy.

---

## How to depend on Bifröst Foundation

Add the dependency to your extension's `app.json`:

```json
"dependencies": [
    {
        "id": "54db7020-675c-4760-aca6-f4061f924ed2",
        "name": "Bifröst Foundation",
        "publisher": "Origo",
        "version": "27.0.0.0"
    }
]
```

All objects in this guide live in the namespace `Origo.Bifrost`.

---

## Extensibility surface at a glance

| Category | Items | Stability |
|---|---|---|
| Interfaces | 8 | Stable contract — additive changes only |
| Extensible enums | 13 | Add new `value(...)` entries from your extension |
| Integration events | 6 + 2 facade codeunits | Stable signature; additive parameters via overloads |
| Control add-ins | `Text Editor ori` | Stable procedure/event signatures |
| Public tables | `User Setup ori` | Extend with `tableextension` |

---

## Interfaces

Implementations are registered through the matching extensible enum (column "Selector enum"). Add your `value(...)` to the enum with an `Implementation = "<Interface>" = "<Your Impl>"` clause.

| Interface | Selector enum | Purpose |
|---|---|---|
| `Msg Interface ori` | `Message Type ori` | Contract for every message type. Implements `GetFilterTableNo`, `GetDescription`, `GetMessageDirection`, `GetMessageHelpAsMarkdownDocument`, `ExecuteBifrostTask`. |
| `Msg Metering ori` | `Message Type ori` | Metering hook, one procedure: `OnMessageCompleted(var Argument)`. Called after every successful call except `Help.*` and `Webhook.*`. Every value falls back to `Default Metering ori`, whose body does nothing; a billing solution overrides it on the types it prices. |
| `Customer Credit Limit ori` | `Customer Credit Limit Type ori` | Replace the default credit-limit check used by `Customer.CreditLimit.Get`. |
| `Customer Statement` | `Customer Statement Type` | Provide an alternative customer-statement PDF for `Customer.Statement.Pdf`. |
| `Item Calc. Availability ori` | `Item Calc. Avail.Type ori` | Replace the default item-availability calculation. |
| `Item Price Calculation ori` | `Item Price Calc. Type ori` | Plug in a custom price-calculation strategy. |
| `Company Name ori` | `Company Name Type ori` | Decide whether outbound payloads carry the technical Company Name or the Display Name. |
| `ChangeLog Write Guard` | `ChangeLog Write Guard Type` | Decide whether a `Data.Records.Set` write is allowed based on Change Log coverage. |

### Example — adding a new message type

```al
namespace Acme.Sales;

using Origo.Bifrost;

enumextension 50100 "Acme Bifrost Msg Type" extends "Message Type ori"
{
    value(50100; "Sales.Quote.SendForApproval")
    {
        Caption = 'Send sales quote for approval';
        Implementation = "Msg Interface ori" = "Acme Quote Approval Impl";
    }
}

codeunit 50100 "Acme Quote Approval Impl" implements "Msg Interface ori"
{
    procedure GetFilterTableNo(): Integer
    begin
        exit(Database::"Sales Header");
    end;

    procedure GetDescription(): Text[250]
    begin
        exit('Sends a sales quote into the approval workflow.');
    end;

    procedure GetMessageDirection(): Enum "Msg Direction ori"
    begin
        exit("Msg Direction ori"::Inbound);
    end;

    procedure GetMessageHelpAsMarkdownDocument(var Argument: Record "Message Argument ori")
    begin
        // delegate to a help codeunit and call Argument.SetResponseText(...)
    end;

    procedure ExecuteBifrostTask(var Argument: Record "Message Argument ori")
    begin
        // your implementation
    end;
}
```

---

## Extensible enums

Add new `value(...)` entries from your extension via `enumextension`. The base app does not own ordinals above its allocated range.

| Enum | Used by | Notes |
|---|---|---|
| `Message Type ori` | Message dispatcher | Largest extension point — add one value per new message type, wired to your implementation via the interface. |
| `Message Version ori` | Message dispatcher | Add a new version when your implementation breaks request/response shape. |
| `Msg Direction ori` | Message metadata | Inbound / Outbound / Both. |
| `Company Name Type ori` | Outbound payloads | Switch between technical / display names; extensions may add custom strategies. |
| `Approval Type ori` | Approval message types | Strategy enum for `Document.Approval.*`. |
| `Customer Credit Limit Type ori` | `Customer.CreditLimit.Get` | Strategy enum bound to the `Customer Credit Limit ori` interface. |
| `ChangeLog Write Guard Type` | `Data.Records.Set` | Built-in Open / Blocked / Via Force modes; add a custom guard if needed. |
| `Customer Statement Type` | `Customer.Statement.Pdf` | Bound to the `Customer Statement` interface. |
| `Item Price Calc. Type ori` | Price calculations | Bound to the `Item Price Calculation ori` interface. |
| `Telemetry Event Type ori` | Telemetry | Add custom telemetry events your extension emits. |
| `Posting Type ori` | Posting gate | G/L, Item, FA, Job, Resource, Warehouse — add a domain only if you also introduce a new posting gate placeholder table + permission set. |
| `Item Calc. Avail.Type ori` | Availability calculations | Bound to the `Item Calc. Availability ori` interface. |
| `Restriction Type ori` | Field restrictions | Strategy for field-level read / write restrictions. |

---

## Integration events

All listed events have stable signatures. Subscribe with the standard `[EventSubscriber(...)]` attribute on a codeunit in your extension.

### `Webhook Inbound Events ori` (codeunit 10078230)

Fire when an inbound webhook payload is received via the Bifrost website.

| Event | Parameters | When |
|---|---|---|
| `OnWebhookReceived` | `EventSource: Text`, `EventType: Text`, `HeadersJson: Text`, `BodyJson: Text`, `var Handled: Boolean` | Synchronously during bifrost task processing. Set `Handled := true` to signal that your subscriber consumed the payload — the value flows back to the caller in the `handled` response field. |

Subscriber pattern:

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"Webhook Inbound Events",
    'OnWebhookReceived', '', false, false)]
local procedure HandleScaleWebhook(EventSource: Text; EventType: Text;
    HeadersJson: Text; BodyJson: Text; var Handled: Boolean)
begin
    if not EventSource.StartsWith('scale/') then exit;
    // parse BodyJson, route by EventType
    Handled := true;
end;
```

### `Preview Events ori` (codeunit 10078238)

Fire while building posting-preview responses (used by `Finance.GeneralJournal.PreviewPost`, `Finance.VATStatement.Preview`, etc.).

| Event | Parameters | When |
|---|---|---|
| `OnGetPreviewFieldNames` | `var FieldNames: List of [Text]` | After the default field list is built. Append additional field names; names not present on a captured preview table are silently skipped. |
| `OnPrecalculateFlowFields` | `TableId: Integer`, `var TempRecRef: RecordRef`, `var PostingPreviewEventHandler: Codeunit "Posting Preview Event Handler"` | Once per captured preview table that lacks a built-in FlowField precalculator. Write computed values directly onto the temp rows — `CalcField` will not work because the rows are rolled-back temp records. |

### `Data Records Set Events ori` (codeunit 10078081)

Fire during `Data.Records.Set` processing.

| Event | Parameters | When |
|---|---|---|
| `OnAfterAddRecRefStateIfNeeded` | `var RecRef: RecordRef` | After the helper has added the record's state JSON. Inspect or augment the RecRef before serialization continues. |
| `OnAfterVerifyChangeAllowed` | `xRecRef: RecordRef`, `RecRef: RecordRef` | After the change has been verified as allowed. Run additional validation or trigger side effects. |

### `Message Argument ori` table (10077896)

| Event | Parameters | When |
|---|---|---|
| `OnAfterIsTableReadRestrictedForDataRecords` | `TableNo: Integer`, `var IsRestricted: Boolean` | After the built-in read-restriction check. Set `IsRestricted := true` to block additional tables or `false` to permit a table that would otherwise be blocked. |
| `OnAfterIsTableWriteRestrictedForDataRecords` | `TableNo: Integer`, `var IsRestricted: Boolean` | After the built-in write-restriction check. Same override semantics as the read variant. |

---

## Public codeunits (facade)

These are the only `Access = Public` codeunits intended as entry points from dependent extensions.

| Codeunit | Purpose |
|---|---|
| `Webhook Inbound Events ori` (10078230) | Event publisher — see Integration events above. |
| `Preview Events ori` (10078238) | Event publisher — see Integration events above. |
| `Data Records Set Events ori` (10078081) | Event publisher — see Integration events above. |

The `Message Argument ori` table (10077896) is public and is the standard parameter passed to every interface implementation. Use its helper methods (`GetRequestJson`, `SetResponseJson`, `EvaluateTableId`, `BifrostMessageSubjectIsGuid`, etc.) rather than touching fields directly — see the API reference for the full list.

---

## Public tables

| Table | Extending |
|---|---|
| `User Setup ori` (10077909) | Per-user setup. Extend with a `tableextension` to add provider-specific fields (e.g., `Anthropic Model`). |

The base app's standard upgrade rules apply — do not depend on internal field numbers; extend via your own ID range.

---

## Control add-ins

### `Text Editor ori`

Markdown / multi-line text editor with bundled JS and CSS. Public — dependent extensions can host the control via `usercontrol(MyControl; "Text Editor ori")`.

| Member | Kind | Purpose |
|---|---|---|
| `SetContent(Content: Text)` | Procedure | Replace the editor's text content. |
| `SetPlaceholder(Placeholder: Text)` | Procedure | Set the placeholder text shown when the editor is empty. |
| `SetReadOnly(ReadOnly: Boolean)` | Procedure | Toggle read-only mode. |
| `ControlReady()` | Event | Fired once the DOM is ready. Host page should respond by calling `SetContent`. |
| `ContentChanged(Content: Text)` | Event | Fired (debounced) when the user changes the text. |

Layout defaults are `RequestedHeight/Width = 600` with min 300 / max 1200. Host the control inside a part or group if you need different dimensions.

---

## Stability commitments

- **Interfaces, extensible enums and listed integration events**: additive changes only. Removals and renames go through one release with the obsolete-pending marker before the breaking change.
- **Public facade codeunits and tables**: new procedures and fields may be added; existing signatures are preserved across minor versions.
- **Control add-in**: procedure and event signatures listed above are part of the surface.
- **Internal codeunits, internal procedures, message-type implementation codeunits**: not extensible. Do not subscribe to their events or call them across an `internalsVisibleTo` boundary.

If you need an extensibility hook that is not listed here, open an issue in the Bifröst Foundation repository describing the use case rather than depending on internal members.
