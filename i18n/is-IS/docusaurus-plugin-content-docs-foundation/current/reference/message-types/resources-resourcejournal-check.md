---
id: resources-resourcejournal-check
title: "Resources.ResourceJournal.Check"
sidebar_label: "Resources.ResourceJournal.Check"
sidebar_position: 118
description: "Beiðni- og svarsamningur fyrir Resources.ResourceJournal.Check Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Validates a resource dagbók batch og Skilar an aggregated readiness report. Runs BC `Res. Jnl.-Check Line.RunCheck` per line og collects Villur via the BC Villa Message framework.

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
{ "templateName": "RESOURCE", "batchName": "DEFAULT" }
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
| `totalCost` | tugabrot | `CalcSums("Total Cost")` across all lines. |
| `errorCount` | heiltala | Length of `errors[]`. |
| `warningCount` | heiltala | Length of `warnings[]`. |
| `errors` | strengur[] | Blocking Villur collected úr the BC Villa Message framework. |
| `warnings` | strengur[] | Non-blocking warnings: zero `Quantity` line, og `Posting Date` in the future. |

```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "RESOURCE",
  "batchName": "DEFAULT",
  "batchDescription": "Default resource journal",
  "lineCount": 3,
  "totalQuantity": 8.0,
  "totalCost": 1500.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

## Validation Outcomes
- Empty batch → `validationResult = "NotReady"`, Villur contain `"No resource journal lines exist in the batch."`.
- Zero `Quantity` on a line → **warning** `"Line {n}: Quantity is zero."` (unlike project journals, this er non-blocking).
- `Posting Date` eftir `WorkDate()` → warning `"Line {n}: Posting Date is in the future ({date})."`.

## Villur

| Message | Orsök |
|---|---|
| `Resource journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification provided. |
| `Resource journal batch {templateName}\|{batchName} not found.` | Batch lookup mistókst. |

## Tengdar skilaboðategundir
- `Resources.ResourceJournal.SetupNewLine`
- `Resources.ResourceJournal.Post`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

