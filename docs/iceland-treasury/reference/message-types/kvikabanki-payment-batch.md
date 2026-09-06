---
id: kvikabanki-payment-batch
title: "Kvikabanki.Payment.Batch"
sidebar_label: "Kvikabanki.Payment.Batch"
sidebar_position: 68
description: "Request and response contract for the Kvikabanki.Payment.Batch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits one or more Kvika banki payment batches. Each batch debits one `out` account and pays one or more recipient legs. The bank processes each batch asynchronously and returns a `paymentsId`; poll with `Kvikabanki.Payment.ResultBatch`. Payments are batch-only (there is no single-payment operation).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
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

Line `kind` must be `Transfer` (account-to-account) or `PaymentSlip` (claim payment).

## Response
Returns `status`, `submitted` (batch count), and a `batches` array of `{ batchNo, nameOfBatch, paymentsId, logEntryNo }`.

## Rules & errors
- The request must contain a non-empty `batches` array.
- Each batch must have a non-empty `lines` array; each line needs a valid `kind` and `amount`.
- `STP` batches are rejected: `nameOfBatch` must not start with `STP`.

