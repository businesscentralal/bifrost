---
id: kvikabanki-claim-createbatch
title: "Kvikabanki.Claim.CreateBatch"
sidebar_label: "Kvikabanki.Claim.CreateBatch"
sidebar_position: 62
description: "Request and response contract for the Kvikabanki.Claim.CreateBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a batch of Kvika banki claims. The bank processes the batch asynchronously and returns an operation id. Poll the result with `Kvikabanki.Claim.GetOperationResult`. Claim creation is batch-only.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "claims": [
    {
      "claimant":   "1234567",        // required (claim key)
      "account":    "0133-26-012345", // required (claim key)
      "claimDate":  "2026-01-01",     // required (claim key due date, ISO)
      "amount":     12500.00,         // required
      "finalDueDate":"2026-01-15",    // defaults to claimDate when omitted
      "identifier": "INV-2026-0001",
      "payorId":    "1101012220",
      "reference":  "0001",
      "cancellationDate": "2027-01-01", // defaults to claimDate + 1Y
      "otherCosts": 0,
      "otherDefaultCosts": 0,
      "permitOutOfSequencePayment": false,
      "isPartialPaymentAllowed": false
    }
  ]
}
```

## Response
Returns `status`, `submitted` (claim count), `operationId` (poll the bank with this id), and `logEntryNo`.

## Errors
- `The request must contain a non-empty 'claims' array`
- `Claim #N is missing a required field ('claimant', 'account', or 'claimDate')`

