---
id: message-types
title: "Message types"
sidebar_label: "Message types"
sidebar_position: 2
description: "Extending the message type enum, implementing Msg Interface ori, the request and response envelope, dispatch, and error handling."
---

# Message types

A message type is the unit of API surface in Bifröst. It has a dotted name
(`Storage.File.Get`, `Orchestrator.Playbook.Run`), an enum value that carries that name,
and exactly one codeunit implementing `Msg Interface ori` behind it.

Adding one to your app is two objects: an `enumextension` value and an implementation
codeunit.

## Register the type on the enum

Foundation's `Message Type ori` (10077894) is `Extensible = true` and declares
`implements "Msg Interface ori"`. Each value binds itself to its implementation:

```al
namespace Origo.Bifrost.Hnitbjorg;

using Origo.Bifrost;

enumextension 10035635 "Storage Msg Type ori" extends "Message Type ori"
{
    /// <summary>Downloads a file as base64.</summary>
    value(10035638; "Storage.File.Get")
    {
        Caption = 'Storage.File.Get', Locked = true;
        Implementation = "Msg Interface ori" = "Storage File Get Impl ori";
    }
}
```

Three rules apply to every value:

- **The enum value name is the wire contract.** It is what a caller passes as `type`, and
  what `Help.MessageTypes.Get` returns. Renaming or removing a published value breaks
  every caller. Nornir's message types still carry the `Orchestrator.*` prefix from the
  app they replaced, for exactly this reason.
- **`Caption` is `Locked = true`** and repeats the name verbatim. The identifier is not
  user-facing text and is never translated.
- **The ordinal comes out of your app's own object ID range** — see
  [Object and naming conventions](/extensibility/conventions).

Group values by domain and keep the dotted names consistent: `<Domain>.<Noun>.<Verb>`.

## Implement `Msg Interface ori`

```al
interface "Msg Interface ori"
{
    procedure IsEnabled(): Boolean
    procedure GetFilterTableNo(): Integer
    procedure GetDescription(): Text[250]
    procedure GetMessageDirection(): Enum "Msg Direction ori"
    procedure GetMessageHelpAsMarkdownDocument(var Argument: Record "Message Argument ori")
    procedure ExecuteBifrostTask(var Argument: Record "Message Argument ori")
}
```

The first four procedures are metadata: they answer `Help.MessageTypes.Get` without the
type ever running. `GetFilterTableNo` returns the table the type is bound to, or `0` when
it is not bound to one. `GetMessageDirection` returns `Outbound` (the caller reads from
BC), `Inbound` (the caller writes into BC) or `Both`.

A complete implementation, from Nornir:

```al
namespace Origo.Bifrost.Nornir;

using Origo.Bifrost;

codeunit 10035559 "Status Get Msg ori" implements "Msg Interface ori"
{
    Access = Internal;

    internal procedure IsEnabled(): Boolean
    begin
        exit(true);
    end;

    internal procedure GetFilterTableNo(): Integer
    begin
        exit(0);
    end;

    internal procedure GetDescription(): Text[250]
    var
        DescriptionLbl: Label 'Get orchestrator health status and entry counts.', Comment = 'is-IS=Sækja heilsustöðu áætlara og fjölda færslna.';
    begin
        exit(DescriptionLbl);
    end;

    internal procedure GetMessageDirection(): Enum "Msg Direction ori"
    begin
        exit("Msg Direction ori"::Outbound);
    end;

    internal procedure GetMessageHelpAsMarkdownDocument(var Argument: Record "Message Argument ori")
    var
        Help: Codeunit "Help ori";
    begin
        Argument.SetResponseMarkdown(Help.GetHelp('Orchestrator.Status.Get'));
    end;

    internal procedure ExecuteBifrostTask(var Argument: Record "Message Argument ori")
    begin
        Handler.ExecuteGet(Argument);
    end;

    var
        Handler: Codeunit "Status Msg Handler ori";
}
```

Two things are worth copying from this shape:

- The implementation codeunit is thin. The work lives in a shared
  `<Domain> Msg Handler ori` codeunit, so several related types share one body of logic.
- `GetMessageHelpAsMarkdownDocument` delegates to the domain's help codeunit rather than
  building Markdown inline. See [Help codeunits](/extensibility/help-codeunits).

The implementation codeunit is normally `Access = Internal` — it is reached through the
enum, never by name.

## The request and response envelope

Callers reach Bifröst through the `tasks` API page (`origo/bifrost/v1.0`), whose fields
are a CloudEvents-shaped envelope over the `Message ori` queue table:

| Field | Meaning |
| --- | --- |
| `specversion` | Bifröst spec version — `1.0` |
| `type` | The message type name, e.g. `Storage.File.Get` |
| `source` | Caller identifier |
| `id` | Message id, assigned by BC |
| `time` | Message timestamp |
| `subject` | The record key, document number or GUID the call is about |
| `lcid` | Windows language id to process the call under |
| `datacontenttype` | MIME type of `data` |
| `data` | The request payload |

The response comes back on the same record: `datacontenttype` and `data` are overwritten
with the response content type and body.

Inside AL you never touch that table. The orchestrator hands your implementation a
`Message Argument ori` record carrying the request, and reads the response back off it.
The accessors you will use most:

| Reading the request | Writing the response |
| --- | --- |
| `Argument.GetRequestJson()` | `Argument.SetResponseJson(ResponseJson)` |
| `Argument.GetRequestText()` | `Argument.SetResponseText(Text)` |
| `Argument.GetRequestXml()` | `Argument.SetResponseXml(Xml)` |
| `Argument."Subject"` | `Argument.SetResponseMarkdown(Text)` |
| `Argument.GetRequestDataArray(RecordsArray)` | `Argument.SetResponsePdf(TempBlob)` |

Set the content type alongside the body: `Argument."Content Type" := Argument.GetContentTypeJson();`
for JSON, `Argument.GetContentTypeMarkdown()` for Markdown. `SetResponseMarkdown` sets it
for you.

`Message Argument ori` also carries a large set of helpers you should reach for before
writing your own: `AssertVersion1`, `EvaluateTableId`, `EvaluateSkipTake`,
`EvaluateFieldNumbers`, `ApplyTableView`, `LocateSingleRecord`, `OpenRecordBySystemId`,
`CheckTableReadPermission`, and the `Find…` procedures for the common BC documents.

A conventional JSON response looks like this:

```json
{
  "status": "Success",
  "result": { "playbookCode": "MYPLAYBOOK", "stepsExecuted": 3 }
}
```

The `status` property matters beyond convention: the orchestrator counts a call against
the caller's licence quota only when the response is a JSON object whose `status` is
`Success`, and only a successful call reaches the
[metering hook](/extensibility/metering).

## How a call is dispatched

1. A row is inserted into `Message ori` — from the `tasks` API page, or from AL through
   `Dispatcher ori`.
2. `Message Task ori` (internal) picks it up. It stores the caller's language, switches
   the global language to `lcid`, clears any previous response and commits.
3. It builds a `Message Argument ori` from the queue row: id, version, type, subject,
   source, content type and request payload.
4. Licensing is applied centrally, once. `Help.*` and `Webhook.*` types are exempt: they
   always run, are never blocked and never consume quota. Everything else needs a valid
   licence and enabled HTTP client requests.
5. `Argument.GetMessageTypeInterface().ExecuteBifrostTask(Argument)` resolves your codeunit
   from the enum value and runs it. When the call succeeds and the type is not `Help.*` or
   `Webhook.*`, the `Msg Metering ori` hook of the type is called — see
   [Metering a message type](/extensibility/metering).
6. The response content, content type and response time are written back to the queue row,
   the language is restored, and — when the message carried a task id — the
   `OnBifrostMessageCompleted` business event fires for webhook subscribers.

Your implementation never sees steps 1–4 or 6. It sees one `Message Argument ori`.

## Calling a message type from AL

`Dispatcher ori` (10078252) is the supported entry point from inside BC. It wraps the
internal queue and orchestrator so they stay encapsulated.

```al
var
    Dispatcher: Codeunit "Dispatcher ori";
    RequestContent: BigText;
    ResponseContent: BigText;
    ResponseContentType: Text[50];
begin
    Dispatcher.Execute(
        "Message Type ori"::"Data.Records.Get", "Message Version ori"::"1.0",
        '', 'MyApp', 'application/json',
        RequestContent, ResponseContent, ResponseContentType);
end;
```

`Execute` dispatches straight through the interface without persisting a queue row —
faster, but it does not exercise language switching, response time, retention or webhook
dispatch, and it always runs with `OmitCommit = true`. Message types that rely on
TryFunction isolation (posting preview, for instance) are incompatible with that mode.

`EnqueueAndProcess` persists a `Message ori` row and runs the full orchestrator against
it, with an overload that returns the response in a `Temp Blob` for binary or large
payloads.

Nornir routes every playbook step through a single internal codeunit that calls
`Dispatcher ori` inside a `Codeunit.Run` scope, so a message type that commits or fails
cannot abort the playbook run. If your app dispatches types it does not own, do the same.

## Error handling

**A failed call returns `status = Error` with a useful message. It never returns an
unhandled exception.** This is the rule the whole family follows, and callers — including
AI agents driving the MCP server — depend on it.

`Message Argument ori` gives you two ways to comply:

```al
// A failure you detected yourself.
Argument.RespondWithError('Request must contain a "storageCode" property.');

// A failure caught from a TryFunction or Codeunit.Run.
if not Codeunit.Run(Codeunit::"My Worker ori", Argument) then begin
    Argument.RespondWithLastError();
    exit;
end;
```

`RespondWithError` writes `{ "status": "Error", "error": "…" }`, sets the content type to
JSON and appends a `hint` property telling the caller to read
`Help.Implementation.Get` for this type before trying again. `RespondWithLastError` does
the same from `GetLastErrorText()` and adds the call stack. The hint is skipped for
`Help.*` types, which document themselves.

The guard pattern used throughout the family is early exit on a bad request:

```al
internal procedure ExecuteBifrostTask(var Argument: Record "Message Argument ori")
var
    RequestJson: JsonObject;
    FieldsToken: JsonToken;
begin
    Argument.AssertVersion1();

    RequestJson := Argument.GetRequestJson();
    if not RequestJson.Get('fields', FieldsToken) then begin
        Argument.RespondWithError(NoFieldsErr);
        exit;
    end;
    if not FieldsToken.IsObject() then begin
        Argument.RespondWithError(NoFieldsErr);
        exit;
    end;
    // … work …
end;
```

`AssertVersion1` raises an error when the caller sent a version other than `1.0`. Several
Foundation helpers follow the same convention of setting the error response themselves and
returning `false`, so the caller can write `if not Argument.CheckTableReadPermission(TableId) then exit;`.

## Next

- Every type you add needs a help document: [Help codeunits](/extensibility/help-codeunits).
- Solutions that bill or meter their own calls attach to the hook:
  [Metering a message type](/extensibility/metering).
- Types that talk to an external service need a masker and a place to keep credentials:
  [Setup and secrets](/extensibility/setup-and-secrets).
- Types that touch internal Foundation setup need a test-only counterpart:
  [Testing](/extensibility/testing).
