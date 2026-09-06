---
id: kvikabanki-payment-resultbatch
title: "Kvikabanki.Payment.ResultBatch"
sidebar_label: "Kvikabanki.Payment.ResultBatch"
sidebar_position: 69
description: "Request and response contract for the Kvikabanki.Payment.ResultBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Polls the result of an asynchronous Kvika banki payments submission. Pass the `paymentsId` returned by `Kvikabanki.Payment.Batch`.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "paymentsId":   "BATCH-123",
  "filterStatus": "GetAll"      // GetStatus | GetErrors | GetOkay | GetAll (default GetAll)
}
```

## Response
Returns `status`, `paymentsId`, `filterStatus`, `logEntryNo`, and a `result` object with a `batches` array. Each batch carries `paymentsId`, `status` (InProgress | Completed | CompletedWithErrors | Cancelled | OnHold | NotConfirmed), `dateOfPayment`, and a `lines` array of per-leg success/error rows (with PaymentSlip expense breakdown when applicable). Keep polling while `status` is `InProgress`.

## Errors
- `Missing required 'paymentsId' in the request`
- `'filterStatus' must be one of: GetStatus, GetErrors, GetOkay, GetAll`

