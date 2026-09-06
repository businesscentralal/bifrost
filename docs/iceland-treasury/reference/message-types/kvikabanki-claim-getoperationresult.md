---
id: kvikabanki-claim-getoperationresult
title: "Kvikabanki.Claim.GetOperationResult"
sidebar_label: "Kvikabanki.Claim.GetOperationResult"
sidebar_position: 63
description: "Request and response contract for the Kvikabanki.Claim.GetOperationResult Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Polls the result of an asynchronous claim batch (CreateBatch / AlterBatch / CancelBatch). Pass the `operationId` returned by the submit call.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "operationId": "BATCH-123" }
```

## Response
Returns `status`, `operationId`, `batchStatus` (InProgress | Completed | CompletedWithErrors | NotConfirmed), a `results` array (per-item `Success`/`Error` rows), and `logEntryNo`. Keep polling while `batchStatus` is `InProgress`.

## Errors
- `Missing required 'operationId' in the request`

