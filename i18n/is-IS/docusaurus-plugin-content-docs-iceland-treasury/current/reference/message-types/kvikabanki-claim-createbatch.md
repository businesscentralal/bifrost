---
id: kvikabanki-claim-createbatch
title: "Kvikabanki.Claim.CreateBatch"
sidebar_label: "Kvikabanki.Claim.CreateBatch"
sidebar_position: 62
description: "Beiðni- og svarsamningur fyrir Kvikabanki.Claim.CreateBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a batch of Kvika banki claims. The bank processes the batch asynchronously og Skilar an operation id. Poll Niðurstaðan með `Kvikabanki.Claim.GetOperationResult`. Claim creation er batch-Aðeins.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
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

## Svar
Skilar `status`, `submitted` (claim count), `operationId` (poll the bank með this id), og `logEntryNo`.

## Errors
- `The request must contain a non-empty 'claims' array`
- `Claim #N is missing a required field ('claimant', 'account', or 'claimDate')`


