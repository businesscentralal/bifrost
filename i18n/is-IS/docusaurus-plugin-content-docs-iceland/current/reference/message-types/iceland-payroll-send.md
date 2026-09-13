---
id: iceland-payroll-send
title: "Iceland.Payroll.Send"
sidebar_label: "Iceland.Payroll.Send"
sidebar_position: 46
description: "Beiðni- og svarsamningur fyrir Iceland.Payroll.Send Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a validated payroll tax return til Skatturinn using `SendaSkilagrein`.

**Stefna:** Both
**RSK Operation:** `SendaSkilagrein`
**Local write:** Uppfærir submission fields, stores the PDF receipt, og changes Status til Submitted on success.

## Verkflæði
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send
```
RSK treats a second Send fyrir the same period as a correction sjálfkrafa — no special flag needed.

## State gates
| Current Status | Behavior |
|---|---|
| Open | Error — validate first |
| Validated | Calls RSK, stores result + PDF receipt, sets Status = Submitted |
| Submitted | Error — Kallaðu á `Reopen` first til correct |

## Managed Beiðni
```json
{ "year": 2026, "month": "08" }
```

## Managed Svar
```json
{ "operation": "SendaSkilagrein", "managed": true, "returnCode": 0, "status": "Skilað",
  "toPay": 127892, "claimCreated": true, "claimNumber": "116861", "dueDate": "2026-09-01" }
```

## Svar fields
| Reitur | Meaning |
|---|---|
| toPay | Total amount payable (stadgreidsla_heild + arrears) |
| claimCreated | Whether RSK created a greiðsla claim |
| claimNumber | RSK claim reference number |
| dueDate | greiðsla due date |
| fieldA/E | stadgreidsla_heild / heildar_laun |

## Zero-wage period
Skilar `toPay=0`, `claimCreated=false`, empty `claimNumber` og `dueDate`.

## Agent playbook
1. Confirm the period er Validated. Ef not, Kallaðu á `Iceland.Payroll.Validate` first.
2. Kallaðu á `Send` — capture `claimNumber`, `toPay`, og `dueDate`.
3. Kallaðu á `Iceland.Payroll.Receipt` til retrieve the PDF receipt.
4. til correct: `Reopen` → modify entries → `Validate` → `Send` again.

## Errors
- Period verður að be Validated → Kallaðu á `Validate` first.
- "Útgáfa forrits" → ForritUtgafa not registered at RSK.


