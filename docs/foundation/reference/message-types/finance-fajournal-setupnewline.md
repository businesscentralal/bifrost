---
id: finance-fajournal-setupnewline
title: "Finance.FAJournal.SetupNewLine"
sidebar_label: "Finance.FAJournal.SetupNewLine"
sidebar_position: 43
description: "Request and response contract for the Finance.FAJournal.SetupNewLine Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Inserts one or more new FA Journal Line records in a batch, each pre-populated by BC `FA Journal Line.SetUpNewLine`. Line numbering continues at `last Line No. + 10000` (or `10000` if the batch is empty). Returns each inserted line in the **same `{id, primaryKey, fields}` shape** used by `Data.Records.Get`, so the response can be fed directly into `Data.Records.Set` after populating business fields.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- **Not idempotent** — each call appends new lines. Re-sending the same request creates additional lines unless `clearExistingLines: true` is used.
- `clearExistingLines: true` runs `DeleteAll(true)` on the batch before inserting — destructive and not recoverable.
- Defensive: if `SetUpNewLine` leaves `FA Posting Date = 0D`, the implementation sets it to `WorkDate()` before insert.

## Batch Identification Order

First match wins:
1. `data.templateName` (+ optional `data.batchName`).
2. `subject` envelope attribute is a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `templateName` | string | See above | FA journal template (Code[10]). |
| `batchName` | string | No | FA journal batch (Code[10]). Optional when the template has only one batch. |
| `noOfLines` | int | No | Number of lines to create. Default `1`. Must be `1..100`. |
| `clearExistingLines` | bool | No | Default `false`. When `true`, deletes all existing lines in the batch (triggers fire) before inserting. |
| `fieldNumbers` | int[] | No | Restrict the returned `fields` to these field numbers. When omitted, all non-PK fields are returned. |

### Request Example
```json
{
  "templateName": "ASSETS",
  "batchName": "DEFAULT",
  "noOfLines": 3,
  "clearExistingLines": true
}
```

## Response Shape

```json
{
  "status": "Success",
  "noOfRecords": 3,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "JournalTemplateName": "ASSETS", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "FAPostingDate": "2026-04-15", "DepreciationBookCode": "COMPANY", "FAPostingType": "Acquisition Cost", "SourceCode": "FAJNL" }
    }
  ]
}
```

Field names follow the same normalization rules as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics).

## Typical Workflow

1. `Finance.FAJournal.SetupNewLine` — get pre-populated lines with SystemIds.
2. `Data.Records.Set` — populate `FA No.`, `Depreciation Book Code`, `FA Posting Type`, `Amount` (in that order — earlier fields drive validation of later ones).
3. `Finance.FAJournal.Check` — validate.
4. `Finance.FAJournal.Post` — post.

## Errors

| Error | Cause |
|---|---|
| `Fixed asset journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Fixed asset journal batch {template}\|{batch} not found.` | Identification did not match an existing batch. |
| `noOfLines must be between 1 and 100. Received: {n}.` | `noOfLines` is `< 1` or `> 100`. |

## Related Message Types

- `Finance.FAJournal.Check` — validate the batch.
- `Finance.FAJournal.Post` — post the batch.
- `Data.Records.Set` — populate business fields on the new lines.
- `Data.Records.Get` — re-read lines after edits (same response shape).

