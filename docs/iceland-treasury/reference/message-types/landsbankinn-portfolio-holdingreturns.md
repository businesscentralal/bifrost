---
id: landsbankinn-portfolio-holdingreturns
title: "Landsbankinn.Portfolio.HoldingReturns"
sidebar_label: "Landsbankinn.Portfolio.HoldingReturns"
sidebar_position: 130
description: "Request and response contract for the Landsbankinn.Portfolio.HoldingReturns Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves gain/loss returns per holding in a portfolio.
Calls `GET /Portfolios/{id}/HoldingReturns` on the Landsbankinn Assets API.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "portfolioId": "308437", "skip": 0, "take": 50 }
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `portfolioId` | string | yes | Portfolio ID from `Portfolio.List`. |
| `skip` | integer | no | Number of records to skip (default 0). |
| `take` | integer | no | Maximum records to return (default 10000). |

## Response
```json
{
  "data": [
    {
      "id": "QUFQTA==",
      "portfolioId": "308437",
      "instrument": {
        "id": "IS0000020338",
        "name": "Eimskip",
        "type": "Equity",
        "currencyCode": "ISK"
      },
      "gainLoss": 45000.0,
      "gainLossPercentage": 8.33,
      "currencyCode": "ISK",
      "from": "2026-01-01T00:00:00",
      "to": "2026-07-15T00:00:00"
    }
  ],
  "page": 1,
  "perPage": 50,
  "totalItems": 5,
  "logEntryNo": 123
}
```

### Response fields per holding return
| Field | Type | Description |
|---|---|---|
| `id` | string | Holding identifier (base64-encoded, matches `Portfolio.Holdings` id). |
| `portfolioId` | string | Parent portfolio ID. |
| `instrument` | object | Instrument details: `id` (ISIN), `name`, `type`, `currencyCode`. |
| `gainLoss` | double | Absolute gain or loss amount in holding currency. Positive = gain, negative = loss. |
| `gainLossPercentage` | double | Gain/loss as a percentage (e.g. `8.33` = 8.33%). |
| `currencyCode` | string | ISO 4217 currency of the return figures. |
| `from` | string | Start of the return period (ISO date-time). |
| `to` | string | End of the return period (ISO date-time). |

## AI/Agent playbook
Use **after** `Portfolio.Holdings` to see performance. Pair the `id` field with Holdings to correlate position size with return.
`gainLoss` is the absolute ISK (or holding currency) gain; `gainLossPercentage` is the percentage return.
For a full portfolio picture: Portfolio.List → Portfolio.Holdings (what you own) → Portfolio.HoldingReturns (how it performed).

