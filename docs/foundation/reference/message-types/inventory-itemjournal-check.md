---
id: inventory-itemjournal-check
title: "Inventory.ItemJournal.Check"
sidebar_label: "Inventory.ItemJournal.Check"
sidebar_position: 84
description: "Request and response contract for the Inventory.ItemJournal.Check Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Validates an item journal batch before posting by running BC `Item Jnl.-Check Line.RunCheck` on every line and aggregating the outcome into a single verdict with separate `errors` and `warnings` arrays.

**Direction**: Outbound (read-only)  **Content-Type**: `text/json`

## Idempotency / Safety
Safe and idempotent. No writes are performed; the batch and its lines are unchanged.

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
{ "type": "Inventory.ItemJournal.Check", "subject": "ITEM|DEFAULT" }
```
```json
{
  "type": "Inventory.ItemJournal.Check",
  "data": { "templateName": "ITEM", "batchName": "DEFAULT" }
}
```

## Response Shape
```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal",
  "lineCount": 2,
  "totalQuantity": 30,
  "totalAmount": 0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

| Property | Description |
|----------|-------------|
| status | `Success` whenever validation ran. Lookup or identification failures use the error envelope. |
| validationResult | `Ready` (no errors, no warnings), `ReadyWithWarnings` (warnings only), or `NotReady` (any errors, or empty batch). |
| templateName / batchName / batchDescription | Identifying info for the validated batch. |
| lineCount | Number of item journal lines in the batch. |
| totalQuantity | Sum of `Quantity` across all lines. |
| totalAmount | Sum of `Amount` across all lines. |
| errorCount / warningCount | Counts of entries in `errors` / `warnings`. |
| errors[] | Strings describing blocking validation failures (per-line or batch-level). |
| warnings[] | Strings describing non-blocking issues that still allow posting. |

## Validation Rules
- Empty batch -> `validationResult = NotReady`, `errors = ["No item journal lines exist in the batch."]`.
- Per line: `Item Jnl.-Check Line.RunCheck` is invoked. Any captured error is added to `errors`.
- Per line: `Quantity = 0` -> error `Line {lineNo}: Quantity must not be zero.`.
- Per line: `Posting Date > WorkDate()` -> warning `Line {lineNo}: Posting Date is in the future ({postingDate}).`.

## Examples (from unit tests)
- Postable batch -> `Ready`, `errorCount = 0`.
- Batch containing a zero-quantity line -> `NotReady`, `errorCount > 0`, populated `errors[]`.
- Postable batch with all lines pushed `+30D` into the future -> `ReadyWithWarnings`, `warningCount > 0`.
- Empty batch -> `Success` + `NotReady`.

## Errors
| Error | Cause |
|-------|-------|
| `Item journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | None of the three identification paths produced a value. |
| `Item journal batch {templateName}\|{batchName} not found.` | Batch lookup returned no record. |

## Related Message Types
- `Inventory.ItemJournal.SetupNewLine` - add lines.
- `Inventory.ItemJournal.Post` - post once validation is `Ready` or `ReadyWithWarnings`.

