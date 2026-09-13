---
id: kvikabanki-claim-alterbatch
title: "Kvikabanki.Claim.AlterBatch"
sidebar_label: "Kvikabanki.Claim.AlterBatch"
sidebar_position: 60
description: "Beiðni- og svarsamningur fyrir Kvikabanki.Claim.AlterBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Alters a batch of existing Kvika banki claims. Each claim er located by its key (`claimant` + `account` + `claimDate`); the remaining fields carry the new values. The bank processes the batch asynchronously og Skilar an operation id; poll með `Kvikabanki.Claim.GetOperationResult`. Claim alteration er batch-Aðeins.

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
      "amount":     13000.00,
      "finalDueDate":"2026-02-01",
      "reference":  "0001"
    }
  ]
}
```

## Svar
Skilar `status`, `submitted` (claim count), `operationId`, og `logEntryNo`.

## Errors
- `The request must contain a non-empty 'claims' array`
- `Claim #N is missing a required field ('claimant', 'account', or 'claimDate')`


