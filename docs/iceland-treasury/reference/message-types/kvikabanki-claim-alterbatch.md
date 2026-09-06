---
id: kvikabanki-claim-alterbatch
title: "Kvikabanki.Claim.AlterBatch"
sidebar_label: "Kvikabanki.Claim.AlterBatch"
sidebar_position: 60
description: "Request and response contract for the Kvikabanki.Claim.AlterBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Alters a batch of existing Kvika banki claims. Each claim is located by its key (`claimant` + `account` + `claimDate`); the remaining fields carry the new values. The bank processes the batch asynchronously and returns an operation id; poll with `Kvikabanki.Claim.GetOperationResult`. Claim alteration is batch-only.

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
      "amount":     13000.00,
      "finalDueDate":"2026-02-01",
      "reference":  "0001"
    }
  ]
}
```

## Response
Returns `status`, `submitted` (claim count), `operationId`, and `logEntryNo`.

## Errors
- `The request must contain a non-empty 'claims' array`
- `Claim #N is missing a required field ('claimant', 'account', or 'claimDate')`

