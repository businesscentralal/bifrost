---
id: inventory-itemjournal-post
title: "Inventory.ItemJournal.Post"
sidebar_label: "Inventory.ItemJournal.Post"
sidebar_position: 85
description: "Request and response contract for the Inventory.ItemJournal.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Posts every line in the specified item journal batch by invoking BC `Item Jnl.-Post Batch.Run`. On success returns batch totals plus the produced Item Register and Item Ledger Entry / Value Entry ranges.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Not idempotent. Successful posting deletes the source lines and writes Item Ledger Entries, Value Entries, and an Item Register record. Re-running on the same batch posts whatever lines remain (or returns an error if none remain). Posting failures roll back via `Codeunit.Run` and return `status: "Error"` with `callstack` for diagnosis.

## Batch Identification
Resolved in this order:
1. Request JSON `templateName` (+ optional `batchName`).
2. `subject` parsed as GUID -> batch `SystemId`.
3. `subject` containing `|` -> split into `TEMPLATE|BATCH`.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| templateName | Code[10] | One of the three identification paths must succeed | Item Journal Template name. |
| batchName | Code[10] | No | Item Journal Batch name. Combined with `templateName`. |

## Request Examples
```json
{ "type": "Inventory.ItemJournal.Post", "subject": "ITEM|DEFAULT" }
```
```json
{
  "type": "Inventory.ItemJournal.Post",
  "data": { "templateName": "ITEM", "batchName": "DEFAULT" }
}
```

## Response Shape
```json
{
  "status": "Success",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 30,
  "totalAmount": 0,
  "itemRegisterNo": 1234,
  "itemRegisterId": "<SystemId>",
  "fromEntryNo": 5001,
  "toEntryNo": 5002,
  "fromValueEntryNo": 7001,
  "toValueEntryNo": 7002
}
```

| Property | Description |
|----------|-------------|
| status | `Success` on completed posting; `Error` otherwise. |
| templateName / batchName / batchDescription | Identifying info for the posted batch. |
| linesPosted | Number of journal lines that were present immediately before posting. |
| postingDate | Posting Date used for the first line (Format `0,9`). |
| totalQuantity / totalAmount | Aggregates summed across the posted lines. |
| itemRegisterNo | `No.` of the new Item Register row covering this posting. |
| itemRegisterId | `SystemId` of the Item Register row (Format `0,4`, no braces). |
| fromEntryNo / toEntryNo | Inclusive range of Item Ledger Entry `Entry No.` values created. |
| fromValueEntryNo / toValueEntryNo | Inclusive range of Value Entry `Entry No.` values created. Zero when no value entries were posted. |

## Examples (from unit tests)
- Postable batch via pipe subject -> `Success`, `linesPosted = 2`, `itemRegisterNo > 0`, `toEntryNo - fromEntryNo + 1` equals the original line count.
- SystemId subject (`Format(SystemId, 0, 4)`) -> equivalent `Success` response.
- Data parameters `{ templateName, batchName }` -> equivalent `Success` response.
- Zero-quantity lines -> `Error` with `callstack` propagated from BC posting.

## Posting Gate
Calling this message type requires the `BIFROST ItemPost ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST ItemPost ori' permission set.`

## Errors
| Error | Cause |
|-------|-------|
| `Posting denied: missing 'BIFROST ItemPost ori' permission set.` | Caller lacks the `BIFROST ItemPost ori` permission set. |
| `Item journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | None of the three identification paths produced a value. |
| `Item journal batch {templateName}\|{batchName} not found.` | Batch lookup returned no record. |
| `Item journal batch {templateName}\|{batchName} has no lines to post.` | Identified batch contained zero `Item Journal Line` rows. |
| `Nothing was posted. Review journal for errors.` | `Item Jnl.-Post Batch.Run` completed without producing any Item Ledger Entry rows. |
| (BC posting error text) | `Item Jnl.-Post Batch.Run` threw. The original error is surfaced in `error` and the full stack in `callstack`. |

## Operational Notes — Populating Lines via Data.Records.Set

`SetupNewLine` inserts lines via `Insert(true)` (triggers run), but `Data.Records.Set` writes via `Modify` **without** calling `OnValidate`. Therefore, when using `Data.Records.Set` to populate a journal line, supply every derived field manually:

- **`InventoryPostingGroup`** — from the item's `Inventory Posting Group` field.
- **`Gen_Prod_PostingGroup`** — from the item's `Gen. Prod. Posting Group` field.
- **`Gen_Bus_PostingGroup`** — must be supplied alongside `Gen_Prod_PostingGroup`. BC looks up `General Posting Setup` using both fields to find the inventory adjustment G/L accounts. Omitting `Gen_Bus_PostingGroup` causes a "General Posting Setup does not exist" error at posting time even when `Gen_Prod_PostingGroup` is correct.
- **`UnitCost`** — from the item's `Unit Cost` field (or last direct cost).

### Physical Inventory Template (RAUNBIRGÐI)

Lines created by the BC "Calculate Inventory" function have `Phys_Inventory = true`. These lines are **locked** — any attempt to modify them via `Data.Records.Set` fails with "Raunbirgðir must be equal to 'Nei'" (Physical Inventory must equal 'No'). Only lines with `Phys_Inventory = false` can be modified via `Data.Records.Set`.

For regular adjustment lines (where `Phys_Inventory = false`) in a Physical Inventory template, setting `EntryType` to a value other than what the template allows may trigger the reverse error ("Raunbirgðir must be equal to 'Já'"). The safe approach is:
1. Leave `EntryType` at its default (`SetUpNewLine` initialises it from the last line or template; for a fresh empty batch it defaults to `Purchase`).
2. Set `ItemNo_`, `Quantity` (positive for additions), `InventoryPostingGroup`, `Gen_Bus_PostingGroup`, `Gen_Prod_PostingGroup`, `UnitCost`, `DocumentNo_`.
3. Run `Inventory.ItemJournal.Check` to confirm `validationResult = "Ready"` before posting.

## Related Message Types
- `Inventory.ItemJournal.SetupNewLine` - create lines.
- `Inventory.ItemJournal.Check` - validate before posting.

