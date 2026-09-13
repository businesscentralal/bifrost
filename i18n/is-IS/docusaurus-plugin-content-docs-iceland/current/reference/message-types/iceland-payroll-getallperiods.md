---
id: iceland-payroll-getallperiods
title: "Iceland.Payroll.GetAllPeriods"
sidebar_label: "Iceland.Payroll.GetAllPeriods"
sidebar_position: 42
description: "Beiðni- og svarsamningur fyrir Iceland.Payroll.GetAllPeriods Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Allt payroll tax periods og prerequisite values frá Skatturinn using `NaITimabilOgForsendur`.
Býr til eða Uppfærir `Iceland PAYE Period ori` færslur með rate fields.

**Stefna:** Both
**RSK Operation:** `NaITimabilOgForsendur`

## Verkflæði
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send
```

## Tables
| Table | Role |
|---|---|
| Iceland PAYE Period ori | Header — one per year/month. Prerequisites stored here. |
| Iceland PAYE Period Entry ori | Lines — employee payroll data. Not touched by this Kallaðu á. |

## Beiðni
```json
{}
```
No parameters — Sækir Allt available periods fyrir the kennitala.

## Svar (live)
```json
{ "operation": "NaITimabilOgForsendur", "success": true, "periodsProcessed": 8 }
```

## eftir this Kallaðu á
1. Kallaðu á `GetPeriodPrereqs` fyrir the specific target period (refreshes rates).
2. Create `Iceland PAYE Period Entry ori` lines.
3. Set `Tryggingagjald Amount` on the period header.
4. Kallaðu á `Validate`, then `Send`.

## Notes
- Best **connectivity smoke test** — does NOT require ForritUtgafa registration.
- Does not touch employee entries eða submission state.
- Check Beiðni Log: Beiðni Log ori, LogType=PAYE, Operation=NaITimabilOgForsendur.


