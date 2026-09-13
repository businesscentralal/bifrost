---
id: finance-generaljournal-check
title: "Finance.GeneralJournal.Check"
sidebar_label: "Finance.GeneralJournal.Check"
sidebar_position: 45
description: "Beiðni- og svarsamningur fyrir Finance.GeneralJournal.Check Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Validates a Gen. dagbók Batch án posting. Runs BC `Gen. Jnl.-Check Line.RunCheck` against every line under the BC Villa Message Management framework so **all** Villur eru collected in one pass, plus computes the LCY balance og emits warnings fyrir zero amounts og future Posting Dates.

**Stefna**: Útgående (lesa-aðeins — no data modified)  **Efnisgerð**: `text/json`

## Batch Identification Order

fyrsta match wins:
1. `data.templateName` (+ valfrjálst `data.batchName`).
2. `subject` envelope attribute er a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `templateName` | strengur | Sjá above | Gen. dagbók template (Code[10]). |
| `batchName` | strengur | No | Gen. dagbók batch (Code[10]). |

### Dæmi um beiðni
```json
{ "templateName": "GENERAL", "batchName": "DEFAULT" }
```

## Uppbygging svars

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "lineCount": 4,
  "isBalanced": true,
  "requiresBalance": true,
  "totalAmount": 0.0,
  "totalAmountLCY": 0.0,
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
| `isBalanced` | bool | `true` þegar `totalAmountLCY = 0`. |
| `requiresBalance` | bool | `true` þegar the dagbók template `Type = General`. Other template types may post án a zero total. |
| `totalAmount` / `totalAmountLCY` | tugabrot | `CalcSums` of `Amount` / `Amount (LCY)` across all lines. |
| `errors` | strengur[] | Per-line blocking issues úr BC `Gen. Jnl.-Check Line.RunCheck`, plus the literal `Journal is not balanced: Total LCY = {amount} (should be 0.00).` þegar `requiresBalance` og ekki balanced, og the literal `"No journal lines exist in the batch."` þegar the batch er empty. |
| `warnings` | strengur[] | Non-blocking — zero upphæð, future Posting dagsetning. |

## Per-Line Warnings

| Condition | Severity | Message |
|---|---|---|
| `Amount = 0` | Warning | `Line {lineNo}: Amount is zero.` |
| `Posting Date > WorkDate()` | Warning | `Line {lineNo}: Posting Date is in the future ({date}).` |

Reitur-level Villur come unaltered úr BC `Gen. Jnl.-Check Line` (vantar G/L account, posting period lokað, blocked viðskiptamanni/birgi, vantar dimensions, VAT validation, etc.).

## Dæmi (úr einingaprófum)

úr `Gen. Journal Check Tests` (codeunit 95334):
- `FinanceGeneralJournalCheck_BalancedBatch_ReturnsReady` — balanced lines → `validationResult: "Ready"`, `errorCount: 0`.
- `FinanceGeneralJournalCheck_UnbalancedBatch_ReturnsNotReady` — debits ≠ credits → `validationResult: "NotReady"`, `errorCount > 0`, balance Villa included in `errors`.
- `FinanceGeneralJournalCheck_FuturePostingDate_ReturnsReadyWithWarnings` — `Posting Date > WorkDate()` → `validationResult: "ReadyWithWarnings"`.
- `FinanceGeneralJournalCheck_SystemIdSubject_ReturnsReady` — subject = batch `SystemId` (`Format(SystemId, 0, 4)`).

## Villur

Validation issues eru returned via `errors` / `warnings` með `status: "Success"`. The following eru returned as `status: "Error"`:

| Villa | Orsök |
|---|---|
| `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |

## Tengdar skilaboðategundir

- `Finance.GeneralJournal.SetupNewLine` — create ný dagbók lines.
- `Finance.GeneralJournal.PreviewPost` — simulate the post án committing.
- `Finance.GeneralJournal.Post` — post the batch eftir a `Ready` / `ReadyWithWarnings` result.

