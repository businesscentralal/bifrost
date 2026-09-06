---
id: iceland-payroll-getperiodprereqs
title: "Iceland.Payroll.GetPeriodPrereqs"
sidebar_label: "Iceland.Payroll.GetPeriodPrereqs"
sidebar_position: 43
description: "Request and response contract for the Iceland.Payroll.GetPeriodPrereqs Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves payroll prerequisites for one year/month from Skatturinn using `NaIForsendurTimabils`.
Creates or updates one `Iceland PAYE Period ori` record with rate fields.

**Direction:** Both
**RSK Operation:** `NaIForsendurTimabils`

## Workflow
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send
```

## Tables
| Table | Role |
|---|---|
| Iceland PAYE Period ori | Header — one record per year/month. Rate fields populated by this call. |
| Iceland PAYE Period Entry ori | Lines — one per employee. Created separately after this call. |

## Request
```json
{ "year": 2026, "month": "07" }
```

## Response (live 2026/07)
```json
{ "operation": "NaIForsendurTimabils", "success": true, "year": 2026, "month": 7,
  "tryggingagjald": 6.35, "tryggingagjaldSjomanna": 0.65,
  "personuafslattur": 72492, "personuafslatturVika": 0, "fjarsysluskatturProsenta": 5.5 }
```
`personuafslatturVika` = 0 is normal — RSK no longer populates it.

## After this call
1. Create `Iceland PAYE Period Entry ori` lines with employee payroll data.
2. Set `Tryggingagjald Amount` on `Iceland PAYE Period ori` — the actual amount, not computed from the rate.
3. Set `Company Information."E-Mail"` if not already configured.
4. Call `Iceland.Payroll.Validate`.

## Errors
- Missing payroll credentials → set Registration No. and Payroll Password in Bifrost Setup.
- SOAP fault → check Request Log (Request Log ori, LogType=PAYE).

