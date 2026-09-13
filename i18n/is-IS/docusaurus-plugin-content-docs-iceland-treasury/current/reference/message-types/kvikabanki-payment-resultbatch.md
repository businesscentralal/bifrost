---
id: kvikabanki-payment-resultbatch
title: "Kvikabanki.Payment.ResultBatch"
sidebar_label: "Kvikabanki.Payment.ResultBatch"
sidebar_position: 69
description: "Beiðni- og svarsamningur fyrir Kvikabanki.greiðsla.ResultBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Polls Niðurstaðan of an asynchronous Kvika banki greiðslur submission. Pass the `paymentsId` returned by `Kvikabanki.Payment.Batch`.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "paymentsId":   "BATCH-123",
  "filterStatus": "GetAll"      // GetStatus | GetErrors | GetOkay | GetAll (default GetAll)
}
```

## Svar
Skilar `status`, `paymentsId`, `filterStatus`, `logEntryNo`, og a `result` object með a `batches` array. Each batch carries `paymentsId`, `status` (InProgress | Completed | CompletedWithErrors | Cancelled | OnHold | NotConfirmed), `dateOfPayment`, og a `lines` array of per-leg success/error rows (með PaymentSlip expense breakdown Þegar applicable). Keep polling while `status` er `InProgress`.

## Errors
- `Missing required 'paymentsId' in the request`
- `'filterStatus' must be one of: GetStatus, GetErrors, GetOkay, GetAll`


