---
id: landsbankinn-claimbatch-get
title: "Landsbankinn.ClaimBatch.Get"
sidebar_label: "Landsbankinn.ClaimBatch.Get"
sidebar_position: 100
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimBatch.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir the status of a stakan batch operation.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "batchId": "b1e693ad-44ec-45b1-8bff-ef960529c6f3" }
```

## Svar
Skilar batch object: `id`, `method`, `status`, `results` (success/failure/processing), `totalActions`, `created`, `completed`, `logEntryNo`.

## SOAP equivalent
`Landsbankinn.Claim.GetOperationResult` — the SOAP version polls until terminal. This REST version Skilar current state immediately.


