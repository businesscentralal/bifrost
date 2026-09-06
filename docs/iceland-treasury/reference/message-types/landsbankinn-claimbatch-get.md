---
id: landsbankinn-claimbatch-get
title: "Landsbankinn.ClaimBatch.Get"
sidebar_label: "Landsbankinn.ClaimBatch.Get"
sidebar_position: 100
description: "Request and response contract for the Landsbankinn.ClaimBatch.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves the status of a single batch operation.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "batchId": "b1e693ad-44ec-45b1-8bff-ef960529c6f3" }
```

## Response
Returns the batch object: `id`, `method`, `status`, `results` (success/failure/processing), `totalActions`, `created`, `completed`, `logEntryNo`.

## SOAP equivalent
`Landsbankinn.Claim.GetOperationResult` — the SOAP version polls until terminal. This REST version returns current state immediately.

