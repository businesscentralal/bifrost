---
id: help-codeunits
title: "Help codeunits"
sidebar_label: "Help codeunits"
sidebar_position: 4
description: "One help codeunit per domain, the per-app help directory message type, the Markdown contract, and how discovery finds it."
---

# Help codeunits

Every Bifröst message type ships a Markdown document describing how to call it. That
document is not a nice-to-have: the callers are frequently AI agents that read the help
first and construct the request from it, and Foundation's own error responses point back
at it. A type without help is a type nobody can use correctly.

## The rule: one help codeunit per domain

Foundation ships **one help codeunit per standard ERP message type**. Its help folder is
one file per type — `DataRecordsGetHelp.Codeunit.al`, `DocApprovalApproveHelp.Codeunit.al`,
`HelpMessageTypesGetHelp.Codeunit.al` — because the types there are unrelated to each
other and each document stands alone.

A **dependent app combines its types per domain**: one help codeunit for a group of
related message types, with a `case` selecting the document. The domain is the middle
segment of the dotted name — `Storage.File.*` is the file domain, `Orchestrator.Report.*`
is the report domain.

Hnitbjörg has one codeunit per domain, dispatching on the enum:

```al
namespace Origo.Bifrost.Hnitbjorg;

using Origo.Bifrost;

codeunit 10035671 "Storage File Help ori"
{
    Access = Internal;

    internal procedure GetHelp(MessageType: Enum "Message Type ori"; var Argument: Record "Message Argument ori")
    begin
        case MessageType of
            MessageType::"Storage.File.List":
                FileListHelp(Argument);
            MessageType::"Storage.File.Get":
                FileGetHelp(Argument);
            MessageType::"Storage.File.Create":
                FileCreateHelp(Argument);
            MessageType::"Storage.File.Delete":
                FileDeleteHelp(Argument);
        end;
    end;
}
```

Nornir keeps a single `Help ori` codeunit for the whole app, dispatching on the type name
and grouping the domains inside one `case`:

```al
procedure GetHelp(MessageType: Text) HelpText: Text
var
    Help: TextBuilder;
begin
    Help.AppendLine(StrSubstNo(HelpHeadingLbl, MessageType));
    Help.AppendLine('');
    Help.AppendLine('## Overview');
    Help.AppendLine('');
    case MessageType of
        'Orchestrator.Playbook.Run',
        'Orchestrator.Playbook.Schedule',
        'Orchestrator.Playbook.Enqueue':
            BuildPlaybookHelp(Help, MessageType);
        'Orchestrator.Status.Get',
        'Orchestrator.Status.Restart',
        'Orchestrator.Status.RestartIfNeeded':
            BuildStatusHelp(Help, MessageType);
        // …
    end;
    exit(Help.ToText());
end;
```

Either shape satisfies the rule. What is not acceptable is a help document written inline
in each implementation codeunit: the contract for a domain then drifts type by type.

Each implementation's `GetMessageHelpAsMarkdownDocument` is a one-liner that delegates:

```al
internal procedure GetMessageHelpAsMarkdownDocument(var Argument: Record "Message Argument ori")
var
    Help: Codeunit "Help ori";
begin
    Argument.SetResponseMarkdown(Help.GetHelp('Orchestrator.Status.Get'));
end;
```

`SetResponseMarkdown` writes the text and sets the content type to Markdown in one call.

## What the Markdown contract must contain

A caller should be able to build a correct request from the document alone, without
reading AL. Every help document therefore covers:

1. **A heading** with the message type name.
2. **One or two sentences** saying what the type does and what it changes.
3. **The direction** — `Outbound` when the caller reads from BC, `Inbound` when it writes.
4. **The request**: a parameter table with name, type, required, and description. Say
   where a value comes from when it is not obvious ("resolve via `Storage.Account.List`").
5. **A request example** as JSON.
6. **The response**: the shape returned on success, again as JSON.
7. **Errors** the caller can provoke, and what to do about each.
8. **Related types** — the ones a caller usually needs next.

Anything surprising belongs in the document too. Nornir's help for
`Orchestrator.Playbook.Run` spends a paragraph on the fact that the playbook runs inline
for as long as it takes and that a client which times out leaves the instance at
`Running`; and it warns that `itemsProcessed` counts iterations, not distinct records.
That kind of warning is exactly what stops a caller misusing the type.

Hnitbjörg builds its documents through a small shared builder so every type in the app
comes out with the same section order:

```al
HelpBuilder.Init('Storage.File.List', 'Lists the files in a directory of the configured storage connection.', 'ListFiles');
HelpBuilder.AddParam('storageCode', true, 'string', 'The configured storage connection to use. Resolve via Storage.Account.List.');
HelpBuilder.AddParam('path', false, 'string', 'The directory whose files are listed. Omit to list the root.');
HelpBuilder.SetRequestExample('{ "storageCode": "ARCHIVE", "path": "invoices/2026" }');
HelpBuilder.SetResponseNote('`path` and an `entries` array of `{ name, type, parentDirectory }`');
HelpBuilder.AddError('Path not found', 'Verify the directory exists with Storage.Directory.Exists.');
Argument.SetResponseMarkdown(HelpBuilder.Render());
```

A builder is optional, but it pays for itself once an app has more than a handful of types.

## The `Help.<Domain>.Get` type

Alongside the per-type documents, each app registers one **directory** type that returns an
overview of everything the app exposes. It is a normal message type, named
`Help.<Domain>.Get`:

- Nornir: `Help.Orchestrator.Get`
- Hnitbjörg: `Help.Storage.Get`

Its implementation returns the overview both as help and as its execution result:

```al
internal procedure GetMessageHelpAsMarkdownDocument(var Argument: Record "Message Argument ori")
var
    Help: Codeunit "Help ori";
begin
    Argument.SetResponseMarkdown(Help.GetOverview());
end;

internal procedure ExecuteBifrostTask(var Argument: Record "Message Argument ori")
var
    Help: Codeunit "Help ori";
    ResponseJson: JsonObject;
    ResultJson: JsonObject;
begin
    Argument.AssertVersion1();

    ResultJson.Add('messageType', 'Help.Orchestrator.Get');
    ResultJson.Add('format', 'markdown');
    ResultJson.Add('markdown', Help.GetOverview());

    ResponseJson.Add('status', 'Success');
    ResponseJson.Add('result', ResultJson);
    Argument.SetResponseJson(ResponseJson);
    Argument."Content Type" := 'text/json';
end;
```

`Help.*` types are exempt from licence quota in the orchestrator: they always run, are
never blocked, and are never counted. That exemption is the default; a type can also
declare it explicitly through [`Msg Metering ori`](/extensibility/metering).

## How discovery finds your help

Three Foundation types form the discovery chain, and your app plugs into all three
without writing any of them.

### `Help.MessageTypes.Get` — the catalogue

Iterates every ordinal of `Message Type ori`, resolves the interface for each and calls
`IsEnabled`, `GetFilterTableNo`, `GetDescription` and `GetMessageDirection`. Your types
appear the moment the enum extension is installed. Pass a type name as the subject to get
a single entry, or `onlyEnabled` in the request to skip disabled types.

This is why `GetDescription` deserves a real sentence: it is the only text a caller sees
when browsing the catalogue.

### `Help.Implementation.Get` — the per-type document

Takes the type name as the **subject**, resolves the enum value by name, and calls
`GetMessageHelpAsMarkdownDocument` on the interface. It returns whatever your help
codeunit produced. An unknown name is an error naming the type that was not found.

### `Help.Bifrost.Get` — the family overview

Returns a Markdown guide whose "Discovery endpoints" table lists Foundation's own `Help.*`
types. After building that table it raises the integration event `OnAfterCreatingOverview`
on `Message Events ori`, so each installed app can append its own row. Subscribe with one
codeunit:

```al
namespace Origo.Bifrost.Hnitbjorg;

using Origo.Bifrost;

codeunit 10035638 "Storage Overview Subscr ori"
{
    Access = Internal;

    [EventSubscriber(ObjectType::Codeunit, Codeunit::"Message Events ori", 'OnAfterCreatingOverview', '', false, false)]
    local procedure OnAfterCreatingOverview(Overview: TextBuilder)
    begin
        Overview.AppendLine('| `Help.Storage.Get` | Storage connector directory - file, directory, upload, and attachment message types for Business Central external file storage. |');
    end;
}
```

One row, one line, pointing at your `Help.<Domain>.Get`. That is the whole registration.

A caller therefore walks: `Help.Bifrost.Get` to see which apps are installed →
`Help.<Domain>.Get` for your app's overview → `Help.MessageTypes.Get` for the catalogue →
`Help.Implementation.Get` for the type it wants to call.

## Where the prose lives

The help codeunits are the in-product contract, served over the API. The narrative product
documentation and the context-sensitive HTML help for your pages live on this site, in the
`businesscentralal/bifrost` repository — see [Object and naming conventions](/extensibility/conventions).
Keep them consistent: when a request parameter changes, both the help codeunit and the
documentation page change in the same release.
