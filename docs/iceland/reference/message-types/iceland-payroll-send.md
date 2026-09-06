---
id: iceland-payroll-send
title: "Iceland.Payroll.Send"
sidebar_label: "Iceland.Payroll.Send"
sidebar_position: 46
description: "Request and response contract for the Iceland.Payroll.Send Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a validated payroll tax return to Skatturinn using `SendaSkilagrein`.

**Direction:** Both
**RSK Operation:** `SendaSkilagrein`
**Local write:** Updates submission fields, stores the PDF receipt, and changes Status to Submitted on success.

## Workflow
```
GetAllPeriods -> GetPeriodPrereqs -> create entries + set Tryggingagjald Amount -> Validate -> Send -> Receipt

Correction: Reopen -> modify entries -> Validate -> Send
```
RSK treats a second Send for the same period as a correction automatically — no special flag needed.

## State gates
| Current Status | Behavior |
|---|---|
| Open | Error — validate first |
| Validated | Calls RSK, stores result + PDF receipt, sets Status = Submitted |
| Submitted | Error — call `Reopen` first to correct |

## Managed request
```json
{ "year": 2026, "month": "08" }
```

## Managed response
```json
{ "operation": "SendaSkilagrein", "managed": true, "returnCode": 0, "status": "Skilað",
  "toPay": 127892, "claimCreated": true, "claimNumber": "116861", "dueDate": "2026-09-01" }
```

## Response fields
| Field | Meaning |
|---|---|
| toPay | Total amount payable (stadgreidsla_heild + arrears) |
| claimCreated | Whether RSK created a payment claim |
| claimNumber | RSK claim reference number |
| dueDate | Payment due date |
| fieldA/E | stadgreidsla_heild / heildar_laun |

## Zero-wage period
Returns `toPay=0`, `claimCreated=false`, empty `claimNumber` and `dueDate`.

## Agent playbook
1. Confirm the period is Validated. If not, call `Iceland.Payroll.Validate` first.
2. Call `Send` — capture `claimNumber`, `toPay`, and `dueDate`.
3. Call `Iceland.Payroll.Receipt` to retrieve the PDF receipt.
4. To correct: `Reopen` → modify entries → `Validate` → `Send` again.

## Errors
- Period must be Validated → call `Validate` first.
- "Útgáfa forrits" → ForritUtgafa not registered at RSK.

