---
id: resources-resourcejournal-post
title: "Resources.ResourceJournal.Post"
sidebar_label: "Resources.ResourceJournal.Post"
sidebar_position: 119
description: "Request and response contract for the Resources.ResourceJournal.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Posts a resource journal batch via BC `Res. Jnl.-Post Batch` and returns aggregate posting statistics. Recommend calling `Resources.ResourceJournal.Check` first.

**Direction**: Inbound (writes Resource Ledger Entries) · **Content-Type**: `text/json`

## Idempotency
Not idempotent. Successful posting consumes the batch lines; reposting will produce different (or no) Resource Ledger Entries.

## Identifier Resolution
Batch is resolved in this order:
1. JSON `templateName` (+ optional `batchName`)
2. `subject` is a GUID → batch SystemId
3. `subject` contains `|` → `TEMPLATE|BATCH`

## Request Parameters

| Name | Type | Description |
|---|---|---|
| `templateName` | string | Journal template name (`Code[10]`). |
| `batchName` | string | Journal batch name (`Code[10]`). |

## Request Example
```json
{ "templateName": "RESOURCE", "batchName": "DEFAULT" }
```

## Response Shape (Success)

| Property | Type | Description |
|---|---|---|
| `status` | string | `"Success"`. |
| `templateName` | string | Journal template name posted. |
| `batchName` | string | Journal batch name posted. |
| `batchDescription` | string | Batch description. |
| `linesPosted` | integer | Number of lines in the batch before posting (`Count`). |
| `postingDate` | string | `Posting Date` of the first line, formatted XML (`yyyy-MM-dd`). |
| `totalQuantity` | decimal | `CalcSums(Quantity)` across posted lines. |
| `totalCost` | decimal | `CalcSums("Total Cost")` across posted lines. |

The following four properties are present **only when a Resource Register is created** by the posting (some configurations may not produce one):

| Property | Type | Description |
|---|---|---|
| `resourceRegisterNo` | integer | `Resource Register."No."`. |
| `resourceRegisterId` | string | `Resource Register.SystemId` (GUID, no braces). |
| `fromEntryNo` | integer | `Resource Register."From Entry No."`. |
| `toEntryNo` | integer | `Resource Register."To Entry No."`. |

```json
{
  "status": "Success",
  "templateName": "RESOURCE",
  "batchName": "DEFAULT",
  "batchDescription": "Default resource journal",
  "linesPosted": 3,
  "postingDate": "2026-04-15",
  "totalQuantity": 8.0,
  "totalCost": 1500.0,
  "resourceRegisterNo": 17,
  "resourceRegisterId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromEntryNo": 501,
  "toEntryNo": 503
}
```

## Response Shape (Posting Failure)
Failures from `Res. Jnl.-Post Batch.Run` are caught and returned as a structured error.

```json
{
  "status": "Error",
  "error": "Resource No. must have a value in Res. Journal Line ...",
  "callstack": "..."
}
```

## Posting Gate
Calling this message type requires the `BIFROST Res Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST Res Post ori' permission set.`

## Errors

| Message | Cause |
|---|---|
| `Posting denied: missing 'BIFROST Res Post ori' permission set.` | Caller lacks the `BIFROST Res Post ori` permission set. |
| `Resource journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification provided. |
| `Resource journal batch {templateName}\|{batchName} not found.` | Batch lookup failed. |
| `Resource journal batch {templateName}\|{batchName} has no lines to post.` | Batch is empty. |

## Related Message Types
- `Resources.ResourceJournal.SetupNewLine`
- `Resources.ResourceJournal.Check`

