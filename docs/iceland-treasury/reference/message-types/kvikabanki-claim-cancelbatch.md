---
id: kvikabanki-claim-cancelbatch
title: "Kvikabanki.Claim.CancelBatch"
sidebar_label: "Kvikabanki.Claim.CancelBatch"
sidebar_position: 61
description: "Request and response contract for the Kvikabanki.Claim.CancelBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Cancels a batch of existing Kvika banki claims by key. The bank processes the batch asynchronously and returns an operation id; poll with `Kvikabanki.Claim.GetOperationResult`. Claim cancellation is batch-only.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "keys": [
    { "claimant": "1234567", "account": "0133-26-012345", "claimDate": "2026-01-01" }
  ]
}
```

## Response
Returns `status`, `submitted` (key count), `operationId`, and `logEntryNo`.

## Errors
- `The request must contain a non-empty 'keys' array`
- `Key #N is missing a required field ('claimant', 'account', or 'claimDate')`

