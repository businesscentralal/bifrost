---
id: iceland-payroll-getperiodprereqs
title: "Iceland.Payroll.GetPeriodPrereqs"
sidebar_label: "Iceland.Payroll.GetPeriodPrereqs"
sidebar_position: 43
description: "Beiðni- og svarsamningur fyrir Iceland.Payroll.GetPeriodPrereqs Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir payroll prerequisites fyrir one year/month frá Skatturinn using `NaIForsendurTimabils`.
Býr til eða Uppfærir one `Iceland PAYE Period ori` færsla með rate fields.

**Stefna:** Both
**RSK Operation:** `NaIForsendurTimabils`

## Verkflæði
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send
```

## Tables
| Table | Role |
|---|---|
| Iceland PAYE Period ori | Header — one færsla per year/month. Rate fields populated by this Kallaðu á. |
| Iceland PAYE Period Entry ori | Lines — one per employee. Created separately eftir this Kallaðu á. |

## Beiðni
```json
{ "year": 2026, "month": "07" }
```

## Svar (live 2026/07)
```json
{ "operation": "NaIForsendurTimabils", "success": true, "year": 2026, "month": 7,
  "tryggingagjald": 6.35, "tryggingagjaldSjomanna": 0.65,
  "personuafslattur": 72492, "personuafslatturVika": 0, "fjarsysluskatturProsenta": 5.5 }
```
`personuafslatturVika` = 0 er normal — RSK no longer populates it.

## eftir this Kallaðu á
1. Create `Iceland PAYE Period Entry ori` lines með employee payroll data.
2. Set `Tryggingagjald Amount` on `Iceland PAYE Period ori` — the actual amount, not computed frá the rate.
3. Set `Company Information."E-Mail"` Ef not already configured.
4. Kallaðu á `Iceland.Payroll.Validate`.

## Errors
- Missing payroll credentials → set Registration No. og Payroll Password in Bifrost Setup.
- SOAP fault → check Beiðni Log (Beiðni Log ori, LogType=PAYE).


