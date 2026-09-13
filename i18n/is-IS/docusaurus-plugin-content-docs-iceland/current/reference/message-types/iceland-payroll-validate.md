---
id: iceland-payroll-validate
title: "Iceland.Payroll.Validate"
sidebar_label: "Iceland.Payroll.Validate"
sidebar_position: 47
description: "Beiðni- og svarsamningur fyrir Iceland.Payroll.Validate Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Staðfestir a payroll tax return með Skatturinn using `VilluprofaSkilagrein`.

**Stefna:** Both
**RSK Operation:** `VilluprofaSkilagrein`
**Local write:** Uppfærir validation fields on `Iceland PAYE Period ori` og changes Status til Validated on success.

## Verkflæði
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send
```

## Prerequisites
1. Kallaðu á `GetPeriodPrereqs` first — populates rate fields on the period header.
2. Create `Iceland PAYE Period Entry ori` lines með employee data.
3. Set `Tryggingagjald Amount` on `Iceland PAYE Period ori` — this er the actual amount filed, not computed frá the rate.
4. Set `Company Information."E-Mail"` — nauðsynlegt by RSK.

## State gates
| Current Status | Behavior |
|---|---|
| Open | Builds SOAP, calls RSK, stores validation result, sets Status = Validated on returnCode 0 |
| Validated | Error — Kallaðu á `Reopen` first til re-validate |
| Submitted | Error — Kallaðu á `Reopen` first, then re-validate |

## Managed Beiðni
```json
{ "year": 2026, "month": "07" }
```

## Key fields in the SOAP envelope
| Reitur | Source |
|---|---|
| Veflykill | Payroll Password frá Bifrost Setup (not the kennitala) |
| Tegund | Always `1` |
| Forrit_Utgafa | Registered RSK software identifier |
| Stadgreidsla_heild | stadgreidsla_laun + tryggingagjald (frá Tryggingagjald Amount Reitur) |

## Entry fields (Iceland PAYE Period Entry ori)
| Reitur | Gerð | Notes |
|---|---|---|
| Employee Kennitala | Text | Employee kennitala |
| Starfshlutfall | Text | Employment percentage (e.g. "100") |
| Laun | Decimal | Gross salary |
| Reiknadendurgjald | Integer | Imputed income (fyrir owners). StadgreidslaLaunam covers salary withholding Aðeins |
| Stadgreidsla Launam. | Decimal | Withholding on salary. RSK computes endurgjald withholding separately |
| Tharaf Gr. Sereignarsp. | Decimal | Of which: private pension savings |
| Greitt i Lifeyrissjod | Decimal | Pension fund contribution |
| Bifreidahlunnindi | Text | Car benefit ("true"/"false") |
| TharafThrep 1/2/3 | Decimal | Tax bracket breakdown (verður að sum til Laun − GreittiLifeyrissjod) |

## Salary vs reiknað endurgjald
| Scenario | Laun | Reiknadendurgjald | StadgreidslaLaunam |
|---|---|---|---|
| Salary (employer ≠ employee) | Gross salary | 0 | Withholding on salary |
| Reiknað endurgjald (employer = employee) | 0 | Imputed amount | 0 (RSK computes) |

## Zero-wage period
A period með no entries Staðfestir og Sendir með góðum árangri.
The envelope sets `Engin_laun=1`, `EnginnFjarsysluskattur=1`, empty `Sundurlidun`.

## Managed Svar
```json
{ "operation": "VilluprofaSkilagrein", "managed": true, "returnCode": 0, "status": "Villupróf keyrð",
  "fieldA": 127892, "fieldB": 97634, "fieldD": 30258, "fieldE": 265000 }
```
fieldA = stadgreidsla_heild, fieldB = stadgreidsla_laun, fieldD = tryggingagjald, fieldE = heildar_laun.

## Errors
- "Útgáfa forrits hefur ekki fengið staðfestingu" → ForritUtgafa not registered at RSK.
- "Þrepaskipting stemmir ekki" → TharafThrep1+2+3 verður að equal Laun − GreittiLifeyrissjod.
- Period verður að be Open → Kallaðu á `Iceland.Payroll.Reopen` first.
- fyrirtæki E-Mail nauðsynlegt → set fyrirtæki Information E-Mail.


