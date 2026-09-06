---
id: iceland-payroll-getallperiods
title: "Iceland.Payroll.GetAllPeriods"
sidebar_label: "Iceland.Payroll.GetAllPeriods"
sidebar_position: 42
description: "Request and response contract for the Iceland.Payroll.GetAllPeriods Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves all payroll tax periods and prerequisite values from Skatturinn using `NaITimabilOgForsendur`.
Creates or updates `Iceland PAYE Period ori` records with rate fields.

**Direction:** Both
**RSK Operation:** `NaITimabilOgForsendur`

## Workflow
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send
```

## Tables
| Table | Role |
|---|---|
| Iceland PAYE Period ori | Header — one per year/month. Prerequisites stored here. |
| Iceland PAYE Period Entry ori | Lines — employee payroll data. Not touched by this call. |

## Request
```json
{}
```
No parameters — retrieves all available periods for the kennitala.

## Response (live)
```json
{ "operation": "NaITimabilOgForsendur", "success": true, "periodsProcessed": 8 }
```

## After this call
1. Call `GetPeriodPrereqs` for the specific target period (refreshes rates).
2. Create `Iceland PAYE Period Entry ori` lines.
3. Set `Tryggingagjald Amount` on the period header.
4. Call `Validate`, then `Send`.

## Notes
- Best **connectivity smoke test** — does NOT require ForritUtgafa registration.
- Does not touch employee entries or submission state.
- Check Request Log: Request Log ori, LogType=PAYE, Operation=NaITimabilOgForsendur.

