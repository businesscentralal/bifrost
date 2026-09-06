---
id: landsbankinn-claim-list
title: "Landsbankinn.Claim.List"
sidebar_label: "Landsbankinn.Claim.List"
sidebar_position: 96
description: "Request and response contract for the Landsbankinn.Claim.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists claims from the Landsbankinn Claims REST API.
Replaces the SOAP `Landsbankinn.Claim.Query`.

## Request
```json
{
  "dueDateFrom": "2026-01-01",         // REQUIRED
  "dueDateTo": "2026-12-31",           // optional
  "claimantNationalId": "6306251060",  // optional (defaults to caller)
  "payorNationalId": "1102713369",     // optional
  "status": "unpaid",                  // optional: unpaid, paid, cancelled
  "skip": 0,                           // optional
  "take": 100                          // optional (max 1000)
}
```

## Response
Returns `data` (array), `page`, `perPage`, `totalItems`, `logEntryNo`.

