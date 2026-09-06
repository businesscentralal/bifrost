---
id: landsbankinn-claimbatch-actions
title: "Landsbankinn.ClaimBatch.Actions"
sidebar_label: "Landsbankinn.ClaimBatch.Actions"
sidebar_position: 98
description: "Request and response contract for the Landsbankinn.ClaimBatch.Actions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves per-claim action results for a batch operation.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "batchId": "b1e693ad-...", "skip": 0, "take": 100 }
```

## Response
Returns `data` (array of action results per claim), `batchId`, `noOfRecords`, `page`, `perPage`, `totalItems`, `logEntryNo`.
Each action contains: claim details, `status`, and error info if failed.

## SOAP equivalent
`Landsbankinn.Claim.GetOperationResult` — the SOAP version returns both batch status and per-claim results in one call.

