---
id: landsbankinn-claimbatch-actions
title: "Landsbankinn.ClaimBatch.Actions"
sidebar_label: "Landsbankinn.ClaimBatch.Actions"
sidebar_position: 98
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimBatch.Actions Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir per-claim action results fyrir a batch operation.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "batchId": "b1e693ad-...", "skip": 0, "take": 100 }
```

## Svar
Skilar `data` (array of action results per claim), `batchId`, `noOfRecords`, `page`, `perPage`, `totalItems`, `logEntryNo`.
Each action contains: claim details, `status`, og error info Ef failed.

## SOAP equivalent
`Landsbankinn.Claim.GetOperationResult` — the SOAP version Skilar both batch status og per-claim results in one Kallaðu á.


