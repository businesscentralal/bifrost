---
id: finance-generaljournal-setupnewline
title: "Finance.GeneralJournal.SetupNewLine"
sidebar_label: "Finance.GeneralJournal.SetupNewLine"
sidebar_position: 50
description: "Request and response contract for the Finance.GeneralJournal.SetupNewLine Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Inserts one or more new Gen. Journal Line records in a batch, each pre-populated by BC `Gen. Journal Line.SetUpNewLine(LastLine, 0, true)` (the `true` flag is `BottomLine`, which is what allows the template / batch to suggest a balancing amount or document number on the trailing line). Line numbering continues at `last Line No. + 10000` (or `10000` if the batch is empty). Returns each inserted line in the **same `{id, primaryKey, fields}` shape** used by `Data.Records.Get`, so the response can be fed directly into `Data.Records.Set` after populating business fields.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- **Not idempotent** — each call appends new lines. Re-sending the same request creates additional lines unless `clearExistingLines: true` is used.
- `clearExistingLines: true` runs `DeleteAll(true)` on the batch before inserting — destructive and not recoverable.
- When a No. Series is configured on the batch, BC populates `Document No.` from the series during `SetUpNewLine`.

## Batch Identification Order

First match wins:
1. `data.templateName` (+ optional `data.batchName`).
2. `subject` envelope attribute is a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `templateName` | string | See above | Gen. journal template (Code[10]). |
| `batchName` | string | No | Gen. journal batch (Code[10]). |
| `noOfLines` | int | No | Number of lines to create. Default `1`. Must be `1..100`. |
| `clearExistingLines` | bool | No | Default `false`. When `true`, deletes all existing lines in the batch (triggers fire) before inserting. |
| `fieldNumbers` | int[] | No | Restrict the returned `fields` to these field numbers. When omitted, all non-PK fields are returned. |

### Request Example
```json
{
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "noOfLines": 3
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
      "primaryKey": { "JournalTemplateName": "GENERAL", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "PostingDate": "2026-04-15", "AccountType": "G/L Account", "BalAccountType": "G/L Account", "DocumentType": " " }
    }
  ]
}
```

Field names follow the same normalization rules as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics).

## Examples (from unit tests)

From `Gen. Jnl. SetupLine Tests` (codeunit 95336):
- `SetupNewLine_PipeSubject_ReturnsSuccessWithNewLine` — subject = `"GENERAL|DEFAULT"`, no data — inserts one line at `LineNo_ = 10000`.
- `SetupNewLine_SystemIdSubject_ReturnsSuccess` — subject = batch `SystemId` (formatted `Format(SystemId, 0, 4)`).
- `SetupNewLine_NoOfLines3_Returns3LinesWithSequentialLineNos` — data = `{ "templateName": "...", "batchName": "...", "noOfLines": 3 }` — produces line numbers `10000`, `20000`, `30000`.
- `SetupNewLine_NoOfLines0_ReturnsError` / `SetupNewLine_NoOfLines101_ReturnsError` — `noOfLines` outside `1..100` is rejected with the `noOfLines must be between 1 and 100` error.

## Typical Workflow

1. `Finance.GeneralJournal.SetupNewLine` — get pre-populated lines with SystemIds.
2. `Data.Records.Set` — populate `Account Type` → `Account No.` → `Currency Code` → `Amount` → `Bal. Account Type` → `Bal. Account No.` (earlier fields drive validation of later ones).
3. `Finance.GeneralJournal.Check` — validate.
4. `Finance.GeneralJournal.PreviewPost` — optional, simulate the post.
5. `Finance.GeneralJournal.Post` — post.

## Errors

| Error | Cause |
|---|---|
| `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Journal batch {template}\|{batch} not found.` | Identification did not match an existing batch. |
| `noOfLines must be between 1 and 100. Received: {n}.` | `noOfLines` is `< 1` or `> 100`. |

## Related Message Types

- `Finance.GeneralJournal.Check` — validate the batch.
- `Finance.GeneralJournal.PreviewPost` — simulate the post without committing.
- `Finance.GeneralJournal.Post` — post the batch.
- `Data.Records.Set` — populate business fields on the new lines.
- `Data.Records.Get` — re-read lines after edits (same response shape).

