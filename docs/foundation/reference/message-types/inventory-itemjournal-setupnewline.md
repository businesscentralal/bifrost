---
id: inventory-itemjournal-setupnewline
title: "Inventory.ItemJournal.SetupNewLine"
sidebar_label: "Inventory.ItemJournal.SetupNewLine"
sidebar_position: 87
description: "Request and response contract for the Inventory.ItemJournal.SetupNewLine Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Creates one or more new item journal lines in the specified batch, pre-populated with defaults via BC `Item Journal Line.SetUpNewLine`. Each new line is assigned the next available `Line No.` (last line + 10000, or 10000 for an empty batch).

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Not idempotent. Every call inserts new rows and may consume numbers from a No. Series configured on the batch. Retrying after success appends additional lines.

When `clearExistingLines: true`, every existing line in the batch is deleted (with triggers, via `DeleteAll(true)`) before new lines are created. Destructive and unrecoverable.

## Batch Identification
Resolved in this order:
1. Request JSON `templateName` (+ optional `batchName`).
2. `subject` parsed as GUID -> batch `SystemId`.
3. `subject` containing `|` -> split into `TEMPLATE|BATCH`.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| templateName | Code[10] | One of the three identification paths must succeed | Item Journal Template name. |
| batchName | Code[10] | No | Item Journal Batch name. Combined with `templateName` for lookup. |
| noOfLines | Integer | No | Number of lines to create. Default `1`. Must be between `1` and `100` inclusive. |
| clearExistingLines | Boolean | No | When `true`, deletes all existing lines (with triggers) before inserting new ones. Default `false`. |
| fieldNumbers | Integer[] | No | Restrict the `fields` object in the response to the listed field numbers. When omitted, all fields are returned. |

## Request Examples
```json
{ "type": "Inventory.ItemJournal.SetupNewLine", "subject": "ITEM|DEFAULT" }
```
```json
{
  "type": "Inventory.ItemJournal.SetupNewLine",
  "data": { "templateName": "ITEM", "batchName": "DEFAULT", "noOfLines": 3 }
}
```

## Response Shape
`Data.Records.Get` shape: one entry per inserted line.
```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "<SystemId>",
      "primaryKey": { "JournalTemplateName": "ITEM", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "PostingDate": "2026-04-15", "EntryType": "Purchase", "SourceCode": "ITEMJNL" }
    }
  ]
}
```

| Property | Description |
|----------|-------------|
| status | `Success`. Failures use the standard error envelope. |
| noOfRecords | Equals `noOfLines` from the request (or `1` by default). |
| result[].id | `SystemId` of the inserted Item Journal Line. |
| result[].primaryKey | `JournalTemplateName`, `JournalBatchName`, `LineNo_`. |
| result[].fields | All Item Journal Line fields (subject to `fieldNumbers` filter and field read restrictions). |

## Line Numbering
Empty batch -> first line = `10000`. Existing lines -> next line = last `Line No.` + `10000`. Multiple lines in one call are spaced by `10000`.

## SetUpNewLine Defaults
BC populates: `Posting Date` (from last line or `WorkDate()`), `Document Date`, `Entry Type` (inherited from last line), `Document No.` (from batch No. Series if configured), `Source Code` (from template), `Reason Code` (from batch).

## Examples (from unit tests)
- `subject: "ITEM|DEFAULT"` against an empty batch -> `primaryKey.LineNo_ = 10000`, `fields.PostingDate = WorkDate()`.
- Same batch already containing lines `10000` and `20000` -> new `LineNo_ = 30000`.
- `data: { templateName, batchName, noOfLines: 3 }` -> 3 entries with `LineNo_ = 10000, 20000, 30000`.
- `data: { ..., fieldNumbers: [5, 6] }` -> `fields` contains exactly two keys.

## Field Naming
Response field names follow `RemoveNonAlphaNumericCharacters` of the BC field name: `Line No.` -> `LineNo_`, `Journal Template Name` -> `JournalTemplateName`.

## Errors
| Error | Cause |
|-------|-------|
| `Item journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | None of the three identification paths produced a value. |
| `Item journal batch {templateName}\|{batchName} not found.` | Batch lookup returned no record. |
| `noOfLines must be between 1 and 100. Received: {value}.` | `noOfLines` outside the inclusive range `1..100`. |

## Populating Lines via Data.Records.Set
After calling `SetupNewLine`, use `Data.Records.Set` on table `Item Journal Line` to set field values. Because `Data.Records.Set` does not call `OnValidate`, every derived field must be supplied explicitly:
- `ItemNo_` — item number.
- `Quantity` — must be non-zero for posting to succeed.
- `InventoryPostingGroup` — from the item.
- `Gen_Prod_PostingGroup` — from the item.
- `Gen_Bus_PostingGroup` — required alongside `Gen_Prod_PostingGroup`; BC resolves General Posting Setup using both. Omitting causes a "General Posting Setup does not exist" error at posting time.
- `UnitCost` — from the item (used to compute Amount).
- `DocumentNo_` — document number for the ledger entries.

See `Inventory.ItemJournal.Post` help for Physical Inventory template specifics (`Phys_Inventory` locking behaviour).

## Related Message Types
- `Inventory.ItemJournal.Check` - validate the batch.
- `Inventory.ItemJournal.Post` - post the batch.
- `Data.Records.Set` - populate field values on the new lines.

