---
id: inventory-itemjournal-check
title: "Inventory.ItemJournal.Check"
sidebar_label: "Inventory.ItemJournal.Check"
sidebar_position: 84
description: "Beiðni- og svarsamningur fyrir Inventory.ItemJournal.Check Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Validates an vöru dagbók batch áður en posting með running BC `Item Jnl.-Check Line.RunCheck` on every line og aggregating the outcome í a single verdict með separate `errors` og `warnings` arrays.

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `text/json`

## Idempotency / Safety
Safe og endurtekningarþolið. No writes eru performed; the batch og its lines eru unchanged.

## Batch Identification
Resolved in this order:
1. Request JSON `templateName` (+ valfrjálst `batchName`).
2. `subject` parsed as GUID -> batch `SystemId`.
3. `subject` containing `|` -> split í `TEMPLATE|BATCH`.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| templateName | Code[10] | One of the three identification paths verður að succeed | vöru dagbók Template Heiti. |
| batchName | Code[10] | No | vöru dagbók Batch Heiti. Combined með `templateName`. |

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

## Uppbygging svars
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

| Property | Lýsing |
|----------|-------------|
| status | `Success` whenever validation ran. Lookup eða identification failures nota the Villa envelope. |
| validationResult | `Ready` (no Villur, no warnings), `ReadyWithWarnings` (warnings aðeins), eða `NotReady` (hvaða Villur, eða empty batch). |
| templateName / batchName / batchDescription | Identifying info fyrir the validated batch. |
| lineCount | númer of vöru dagbók lines in the batch. |
| totalQuantity | Sum of `Quantity` across all lines. |
| totalAmount | Sum of `Amount` across all lines. |
| errorCount / warningCount | Counts of færslur in `errors` / `warnings`. |
| Villur[] | Strings describing blocking validation failures (per-line eða batch-level). |
| warnings[] | Strings describing non-blocking issues that still allow posting. |

## Validation Rules
- Empty batch -> `validationResult = NotReady`, `errors = ["No item journal lines exist in the batch."]`.
- Per line: `Item Jnl.-Check Line.RunCheck` er invoked. hvaða captured Villa er added til `errors`.
- Per line: `Quantity = 0` -> Villa `Line {lineNo}: Quantity must not be zero.`.
- Per line: `Posting Date > WorkDate()` -> warning `Line {lineNo}: Posting Date is in the future ({postingDate}).`.

## Dæmi (úr einingaprófum)
- Postable batch -> `Ready`, `errorCount = 0`.
- Batch containing a zero-quantity line -> `NotReady`, `errorCount > 0`, populated `errors[]`.
- Postable batch með all lines pushed `+30D` í the future -> `ReadyWithWarnings`, `warningCount > 0`.
- Empty batch -> `Success` + `NotReady`.

## Villur
| Villa | Orsök |
|-------|-------|
| `Item journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | None of the three identification paths produced a Gildi. |
| `Item journal batch {templateName}\|{batchName} not found.` | Batch lookup returned no færsla. |

## Tengdar skilaboðategundir
- `Inventory.ItemJournal.SetupNewLine` - add lines.
- `Inventory.ItemJournal.Post` - post once validation er `Ready` eða `ReadyWithWarnings`.

