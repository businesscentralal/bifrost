---
id: projects-projectjournal-check
title: "Projects.ProjectJournal.Check"
sidebar_label: "Projects.ProjectJournal.Check"
sidebar_position: 104
description: "Beiðni- og svarsamningur fyrir Projects.ProjectJournal.Check Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Validates a project (job) dagbók batch og Skilar an aggregated readiness report. Runs BC `Job Jnl.-Check Line.RunCheck` per line via a try-function og collects Villur úr the BC Villa Message framework.

**Stefna**: Útgående (lesa-aðeins) · **Efnisgerð**: `text/json`

## Identifier Resolution
Batch er resolved in this order:
1. JSON `templateName` (+ valfrjálst `batchName`)
2. `subject` er a GUID → batch SystemId
3. `subject` contains `|` → `TEMPLATE|BATCH`

## Beiðnibreytur

| Heiti | Gerð | Lýsing |
|---|---|---|
| `templateName` | strengur | dagbók template Heiti (`Code[10]`). |
| `batchName` | strengur | dagbók batch Heiti (`Code[10]`). |

## Dæmi um beiðni
```json
{ "templateName": "PROJECT", "batchName": "DEFAULT" }
```

## Uppbygging svars

| Property | Gerð | Lýsing |
|---|---|---|
| `status` | strengur | `"Success"`. |
| `validationResult` | strengur | `Ready` (no issues), `ReadyWithWarnings` (warnings aðeins), `NotReady` (Villur eða empty batch). |
| `templateName` | strengur | Echoed template Heiti. |
| `batchName` | strengur | Echoed batch Heiti. |
| `batchDescription` | strengur | Batch Lýsing. |
| `lineCount` | heiltala | númer of lines in the batch (0 þegar empty). |
| `totalQuantity` | tugabrot | `CalcSums(Quantity)` across all lines. |
| `totalLineAmount` | tugabrot | `CalcSums("Line Amount")` across all lines. |
| `errorCount` | heiltala | Length of `errors[]`. |
| `warningCount` | heiltala | Length of `warnings[]`. |
| `errors` | strengur[] | Blocking Villur: zero-quantity lines, BC `Job Jnl.-Check Line` failures, og færslur úr the BC Villa Message framework. |
| `warnings` | strengur[] | Non-blocking warnings. Currently: `Posting Date` in the future. |

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "PROJECT",
  "batchName": "DEFAULT",
  "batchDescription": "Default project journal",
  "lineCount": 2,
  "totalQuantity": 16.0,
  "totalLineAmount": 4800.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

## Validation Outcomes
- Empty batch → `validationResult = "NotReady"`, Villur contain `"No project journal lines exist in the batch."`.
- Zero `Quantity` on a line → Villa `"Line {n}: Quantity is zero."`.
- `Posting Date` eftir `WorkDate()` → warning `"Line {n}: Posting Date is in the future ({date})."`.

## Villur

| Message | Orsök |
|---|---|
| `Project journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification provided. |
| `Project journal batch {templateName}\|{batchName} not found.` | Batch lookup mistókst. |

## Tengdar skilaboðategundir
- `Projects.ProjectJournal.SetupNewLine`
- `Projects.ProjectJournal.Post`

