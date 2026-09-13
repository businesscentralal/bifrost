---
id: kvikabanki-claim-cancelbatch
title: "Kvikabanki.Claim.CancelBatch"
sidebar_label: "Kvikabanki.Claim.CancelBatch"
sidebar_position: 61
description: "Beiðni- og svarsamningur fyrir Kvikabanki.Claim.CancelBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Cancels a batch of existing Kvika banki claims by key. The bank processes the batch asynchronously og Skilar an operation id; poll með `Kvikabanki.Claim.GetOperationResult`. Claim cancellation er batch-Aðeins.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "keys": [
    { "claimant": "1234567", "account": "0133-26-012345", "claimDate": "2026-01-01" }
  ]
}
```

## Svar
Skilar `status`, `submitted` (key count), `operationId`, og `logEntryNo`.

## Errors
- `The request must contain a non-empty 'keys' array`
- `Key #N is missing a required field ('claimant', 'account', or 'claimDate')`


