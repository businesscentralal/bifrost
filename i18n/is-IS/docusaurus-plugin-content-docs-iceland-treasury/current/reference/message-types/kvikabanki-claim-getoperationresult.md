---
id: kvikabanki-claim-getoperationresult
title: "Kvikabanki.Claim.GetOperationResult"
sidebar_label: "Kvikabanki.Claim.GetOperationResult"
sidebar_position: 63
description: "Beiðni- og svarsamningur fyrir Kvikabanki.Claim.GetOperationResult Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Polls Niðurstaðan of an asynchronous claim batch (CreateBatch / AlterBatch / CancelBatch). Pass the `operationId` returned by the submit Kallaðu á.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "operationId": "BATCH-123" }
```

## Svar
Skilar `status`, `operationId`, `batchStatus` (InProgress | Completed | CompletedWithErrors | NotConfirmed), a `results` array (per-item `Success`/`Error` rows), og `logEntryNo`. Keep polling while `batchStatus` er `InProgress`.

## Errors
- `Missing required 'operationId' in the request`


