---
id: landsbankinn-acquiring-transactions
title: "Landsbankinn.Acquiring.Transactions"
sidebar_label: "Landsbankinn.Acquiring.Transactions"
sidebar_position: 77
description: "Request and response contract for the Landsbankinn.Acquiring.Transactions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists acquiring transactions. If `settlementId` is provided, returns
transactions for that specific settlement (GET /Settlements/&#123;id&#125;/Transactions).
Otherwise returns all transactions (GET /Transactions).

## Request
```json
{
  "settlementId": "<id>",          // optional — filter to one settlement
  "dateFrom": "2026-07-01",        // optional (for /Transactions only)
  "dateTo": "2026-07-22",          // optional
  "contractNumber": "...",          // optional
  "skip": 0, "take": 100           // optional
}
```

## Response
Returns `data` (array of transactions), `page`, `perPage`, `totalItems`, `logEntryNo`.

