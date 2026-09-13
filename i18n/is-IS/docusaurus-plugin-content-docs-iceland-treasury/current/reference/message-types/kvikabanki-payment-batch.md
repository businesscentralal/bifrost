---
id: kvikabanki-payment-batch
title: "Kvikabanki.Payment.Batch"
sidebar_label: "Kvikabanki.Payment.Batch"
sidebar_position: 68
description: "Beiðni- og svarsamningur fyrir Kvikabanki.greiðsla.Batch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir eina eða fleiri Kvika banki greiðsla batches. Each batch debits one `out` reikningur og pays eina eða fleiri recipient legs. The bank processes each batch asynchronously og Skilar a `paymentsId`; poll með `Kvikabanki.Payment.ResultBatch`. greiðslur eru batch-Aðeins (there er no stakan-greiðsla operation).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "batches": [
    {
      "outAccount":   "0133-26-012345", // debit account
      "outAccountOwnerId": "1234567",
      "dateOfForwardPayment": "2026-01-20", // optional forward date
      "nameOfBatch":  "January wages",   // must NOT start with "STP"
      "isOneToMany":  true,
      "rollbackOnError": true,
      "lines": [
        { "kind": "Transfer", "recipientAccount": "0111-26-7890", "amount": 50000.00, "description": "Wage" },
        { "kind": "PaymentSlip", "recipientAccount": "0133-26-012345", "personId": "1234567", "dueDate": "2026-01-15", "isDeposit": false, "amount": 12500.00 }
      ]
    }
  ]
}
```

Line `kind` verður að be `Transfer` (reikningur-til-reikningur) eða `PaymentSlip` (claim greiðsla).

## Svar
Skilar `status`, `submitted` (batch count), og a `batches` array of `{ batchNo, nameOfBatch, paymentsId, logEntryNo }`.

## Rules & errors
- Beiðnin verður að contain a non-empty `batches` array.
- Each batch verður að have a non-empty `lines` array; each line needs a valid `kind` og `amount`.
- `STP` batches eru rejected: `nameOfBatch` verður að not start með `STP`.


