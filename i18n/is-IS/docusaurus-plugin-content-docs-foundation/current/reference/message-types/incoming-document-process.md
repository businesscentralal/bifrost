---
id: incoming-document-process
title: "Incoming.Document.Process"
sidebar_label: "Incoming.Document.Process"
sidebar_position: 75
description: "Beiðni- og svarsamningur fyrir Incoming.Document.Process Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Overview
Processes an `Incoming Document` by invoking its standard BC processing — creating a linked purchase invoice, credit memo, or journal line according to the document's Data Exchange Type and configuration. Work runs inside `Codeunit.Run` so AL errors are captured and returned as a JSON `error` field rather than rolling back the outer transaction.

## Prerequisites
The target `Incoming Document` must have `Data Exchange Type` populated before it can be processed. This value tells Business Central which data exchange definition to use when interpreting the incoming document attachment and creating the linked document.

## Direction
Inbound (write)

## Response Content Type
`text/json`

## Identifier Resolution
The target `Incoming Document` is identified by the `subject` or by the request keys `entryNo`, `systemId` or `id`. Every identifier sent is tried:
1. A GUID is read as the `SystemId`.
2. Anything else is read as the `Entry No.` (an integer); text that is not a number gives `InvalidParameterFormat`.
3. Two identifiers that point to different documents give `ConflictingIdentifiers`.

## Request Parameters
| Field | Location | Type | Required | Description |
|-------|----------|------|----------|-------------|
| subject | Bifrost | Text | One of these | Incoming Document `Entry No.` or `SystemId` GUID |
| entryNo | data | Integer | One of these | Incoming Document `Entry No.` |
| systemId / id | data | GUID | One of these | Incoming Document `SystemId` |

The request body is read only for these identifier keys.

## Request Example
```json
{ "type": "Incoming.Document.Process", "subject": "1234" }
```

## Response Shape (success)
```json
{
  "status": "Success",
  "record": { "tableNo": 130, "tableName": "Incoming Document", "tableCaption": "...", "recordSystemId": "..." },
  "entryNo": 1234,
  "id": "..."
}
```

## Response Shape (BC processing produced errors)
```json
{
  "status": "Error",
  "error": [ { "id": "...", "message": "...", "type": "...", "table": { "id": 0, "name": "" }, "field": { "id": 0, "name": "" }, "context": { }, "additionalInformation": "" } ],
  "entryNo": 1234,
  "id": "..."
}
```

## Response Shape (AL runtime error caught by `Codeunit.Run`)
```json
{ "status": "Error", "error": "<message>" }
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` or `Error` |
| record | Object | Present on success — `{ tableNo, tableName, tableCaption, recordSystemId }` |
| error | Array or Text | Array of BC `Error Message` entries when standard processing fails; a single Text when `Codeunit.Run` traps an AL runtime error |
| entryNo | Integer | Incoming Document `Entry No.` (always set when the document was found) |
| id | Text | Incoming Document `SystemId` (always set when the document was found) |

## Errors
| Scenario | Surface | Message |
|----------|---------|---------|
| No identifier | error response | `Incoming Document identifier is missing. Pass it as the subject, or as one of: entryNo, systemId, id.` (`MissingParameter`) |
| Identifier is not a number or GUID | error response | `"{value}" is not a valid integer (from {subject or key}).` (`InvalidParameterFormat`) |
| Identifier does not resolve | error response | `Incoming Document "{value}" was not found (from {subject or key}).` (`RecordNotFound`) |
| Data Exchange Type is blank | AL error | `You must select a value in the Data Exchange Type field on the incoming document.` |
| Document has no main attachment | AL error → `error` field | `Incoming Document {entryNo} has no main attachment.` |
| Document already posted | AL error → `error` field | `Incoming Document {entryNo} has already been posted.` |

## Related Message Types
- `Incoming.Document.Create`
- `Incoming.Document.Attach`
- `Incoming.Document.Get`
- `Incoming.Document.SetDefault`

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

