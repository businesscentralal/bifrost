---
id: iceland-payroll-validate
title: "Iceland.Payroll.Validate"
sidebar_label: "Iceland.Payroll.Validate"
sidebar_position: 47
description: "Request and response contract for the Iceland.Payroll.Validate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Validates a payroll tax return with Skatturinn using `VilluprofaSkilagrein`.

**Direction:** Both
**RSK Operation:** `VilluprofaSkilagrein`
**Local write:** Updates validation fields on `Iceland PAYE Period ori` and changes Status to Validated on success.

## Workflow
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send
```

## Prerequisites
1. Call `GetPeriodPrereqs` first — populates rate fields on the period header.
2. Create `Iceland PAYE Period Entry ori` lines with employee data.
3. Set `Tryggingagjald Amount` on `Iceland PAYE Period ori` — this is the actual amount filed, not computed from the rate.
4. Set `Company Information."E-Mail"` — required by RSK.

## State gates
| Current Status | Behavior |
|---|---|
| Open | Builds SOAP, calls RSK, stores validation result, sets Status = Validated on returnCode 0 |
| Validated | Error — call `Reopen` first to re-validate |
| Submitted | Error — call `Reopen` first, then re-validate |

## Managed request
```json
{ "year": 2026, "month": "07" }
```

## Key fields in the SOAP envelope
| Field | Source |
|---|---|
| Veflykill | Payroll Password from Bifrost Setup (not the kennitala) |
| Tegund | Always `1` |
| Forrit_Utgafa | Registered RSK software identifier |
| Stadgreidsla_heild | stadgreidsla_laun + tryggingagjald (from Tryggingagjald Amount field) |

## Entry fields (Iceland PAYE Period Entry ori)
| Field | Type | Notes |
|---|---|---|
| Employee Kennitala | Text | Employee kennitala |
| Starfshlutfall | Text | Employment percentage (e.g. "100") |
| Laun | Decimal | Gross salary |
| Reiknadendurgjald | Integer | Imputed income (for owners). StadgreidslaLaunam covers salary withholding only |
| Stadgreidsla Launam. | Decimal | Withholding on salary. RSK computes endurgjald withholding separately |
| Tharaf Gr. Sereignarsp. | Decimal | Of which: private pension savings |
| Greitt i Lifeyrissjod | Decimal | Pension fund contribution |
| Bifreidahlunnindi | Text | Car benefit ("true"/"false") |
| TharafThrep 1/2/3 | Decimal | Tax bracket breakdown (must sum to Laun − GreittiLifeyrissjod) |

## Salary vs reiknað endurgjald
| Scenario | Laun | Reiknadendurgjald | StadgreidslaLaunam |
|---|---|---|---|
| Salary (employer ≠ employee) | Gross salary | 0 | Withholding on salary |
| Reiknað endurgjald (employer = employee) | 0 | Imputed amount | 0 (RSK computes) |

## Zero-wage period
A period with no entries validates and submits successfully.
The envelope sets `Engin_laun=1`, `EnginnFjarsysluskattur=1`, empty `Sundurlidun`.

## Managed response
```json
{ "operation": "VilluprofaSkilagrein", "managed": true, "returnCode": 0, "status": "Villupróf keyrð",
  "fieldA": 127892, "fieldB": 97634, "fieldD": 30258, "fieldE": 265000 }
```
fieldA = stadgreidsla_heild, fieldB = stadgreidsla_laun, fieldD = tryggingagjald, fieldE = heildar_laun.

## Errors
- "Útgáfa forrits hefur ekki fengið staðfestingu" → ForritUtgafa not registered at RSK.
- "Þrepaskipting stemmir ekki" → TharafThrep1+2+3 must equal Laun − GreittiLifeyrissjod.
- Period must be Open → call `Iceland.Payroll.Reopen` first.
- Company E-Mail required → set Company Information E-Mail.

