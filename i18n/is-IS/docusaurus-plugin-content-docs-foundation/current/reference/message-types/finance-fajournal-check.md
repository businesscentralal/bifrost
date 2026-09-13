---
id: finance-fajournal-check
title: "Finance.FAJournal.Check"
sidebar_label: "Finance.FAJournal.Check"
sidebar_position: 40
description: "Beiðni- og svarsamningur fyrir Finance.FAJournal.Check Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Validates an FA dagbók Batch án posting. Runs BC `FA Jnl.-Check Line` against every line under the BC Villa Message Management framework so **all** Villur eru collected in one pass, plus emits explicit Athugar fyrir vantar `FA No.` / `Depreciation Book Code` og warnings fyrir zero amounts og future FA Posting Dates. Skilar aggregate totals og per-line Villur/warnings.

**Stefna**: Útgående (lesa-aðeins — no data modified)  **Efnisgerð**: `text/json`

## Batch Identification Order

fyrsta match wins:
1. `data.templateName` (+ valfrjálst `data.batchName`).
2. `subject` envelope attribute er a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `templateName` | strengur | Sjá above | FA dagbók template (Code[10]). |
| `batchName` | strengur | No | FA dagbók batch (Code[10]). |

### Dæmi um beiðni
```json
{ "templateName": "ASSETS", "batchName": "DEFAULT" }
```

## Uppbygging svars

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "ASSETS",
  "batchName": "DEFAULT",
  "batchDescription": "Default FA journal",
  "lineCount": 3,
  "totalQuantity": 0.0,
  "totalAmount": 1500.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

### Svarreitir

| Reitur | Gerð | Athugasemdir |
|---|---|---|
| `validationResult` | strengur | `Ready` (no Villur, no warnings), `ReadyWithWarnings` (no Villur, ≥1 warning), eða `NotReady` (≥1 Villa, **þar á meðal the case where the batch has no lines**). |
| `lineCount` | int | `0` þegar the batch has no lines. |
| `totalQuantity` | tugabrot | `CalcSums` of `Quantity` across all lines. |
| `totalAmount` | tugabrot | `CalcSums` of `Amount` across all lines. |
| `errors` | strengur[] | Per-line blocking issues. Includes BC Villa-message-framework output úr `FA Jnl.-Check Line.CheckFAJnlLine`, the vantar-FA / vantar-Depreciation-Book Athugar below, og the literal `"No fixed asset journal lines exist in the batch."` þegar the batch er empty. |
| `warnings` | strengur[] | Non-blocking — zero upphæð, future FA Posting dagsetning. |

## Per-Line Athugar

Explicit Athugar run **áður en** delegating til `FA Jnl.-Check Line.CheckFAJnlLine` (which may skip lines með empty FA No.):

| Condition | Severity | Message |
|---|---|---|
| `FA No.` empty | Villa | `Line {lineNo}: FA No. is required.` |
| `Depreciation Book Code` empty (þegar FA No. set) | Villa | `Line {lineNo}: Depreciation Book Code is required.` |
| `Amount = 0` | Warning | `Line {lineNo}: Amount is zero.` |
| `FA Posting Date > WorkDate()` | Warning | `Line {lineNo}: FA Posting Date is in the future ({date}).` |

## Villur

Validation issues eru returned via `errors` / `warnings` með `status: "Success"`. The following eru returned as `status: "Error"`:

| Villa | Orsök |
|---|---|
| `Fixed asset journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Fixed asset journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |

## Tengdar skilaboðategundir

- `Finance.FAJournal.SetupNewLine` — create ný FA dagbók lines.
- `Finance.FAJournal.Post` — post the batch eftir a `Ready` / `ReadyWithWarnings` result.

