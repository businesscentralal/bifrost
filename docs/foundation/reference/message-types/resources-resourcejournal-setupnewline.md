---
id: resources-resourcejournal-setupnewline
title: "Resources.ResourceJournal.SetupNewLine"
sidebar_label: "Resources.ResourceJournal.SetupNewLine"
sidebar_position: 120
description: "Request and response contract for the Resources.ResourceJournal.SetupNewLine Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Creates one or more new resource journal lines in a batch, pre-populated by BC `SetUpNewLine`. Each line is assigned `Line No.` = last line + 10000 (or 10000 for an empty batch).

**Direction**: Inbound (writes) · **Content-Type**: `text/json`

## Idempotency
Not idempotent — each call inserts new lines. Set `clearExistingLines: true` to wipe the batch (`DeleteAll(true)` — triggers fire) before inserting.

## Identifier Resolution
Batch is resolved in this order:
1. JSON `templateName` (+ optional `batchName`)
2. `subject` is a GUID → batch SystemId
3. `subject` contains `|` → `TEMPLATE|BATCH`

## Request Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `templateName` | string | — | Journal template name (`Code[10]`). |
| `batchName` | string | — | Journal batch name (`Code[10]`). |
| `noOfLines` | integer | 1 | Lines to create. Must be 1–100. |
| `clearExistingLines` | boolean | false | Delete all existing lines in the batch (with triggers) before creating. |
| `fieldNumbers` | int[] | all | Field numbers to include in each line's `fields` block. Omit to return every field. |

## Request Example
```json
{ "templateName": "RESOURCE", "batchName": "DEFAULT", "noOfLines": 2, "clearExistingLines": true }
```

## Response Shape
Same record shape as `Data.Records.Get`.

| Property | Type | Description |
|---|---|---|
| `status` | string | Always `"Success"` on success. |
| `noOfRecords` | integer | Number of lines created. |
| `result` | array | One object per line with `id` (SystemId, no braces), `primaryKey`, and `fields`. |

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "JournalTemplateName": "RESOURCE", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "PostingDate": "2026-04-15", "DocumentNo_": "RJNL000001", "SourceCode": "RESJNL" }
    }
  ]
}
```

## Errors

| Message | Cause |
|---|---|
| `Resource journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification provided. |
| `Resource journal batch {templateName}\|{batchName} not found.` | Batch lookup failed. |
| `noOfLines must be between 1 and 100. Received: {noOfLines}.` | Out-of-range `noOfLines`. |

## Related Message Types
- `Resources.ResourceJournal.Check`
- `Resources.ResourceJournal.Post`
- `Data.Records.Set` — populate fields on the new line via SystemId.
- `Data.Records.Get` — same response shape.

