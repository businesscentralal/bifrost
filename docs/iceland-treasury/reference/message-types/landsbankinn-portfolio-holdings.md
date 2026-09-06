---
id: landsbankinn-portfolio-holdings
title: "Landsbankinn.Portfolio.Holdings"
sidebar_label: "Landsbankinn.Portfolio.Holdings"
sidebar_position: 131
description: "Request and response contract for the Landsbankinn.Portfolio.Holdings Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists current holdings (stocks, bonds, funds, deposits) in a portfolio.
Calls `GET /Portfolios/{id}/Holdings` on the Landsbankinn Assets API.

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

### API query parameters (applied automatically)
| Parameter | Type | Description |
|---|---|---|
| `page` | integer | Page number (1-based). |
| `perPage` | integer | Records per page (max 1000). |

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
      "quantity": 1000.0,
      "price": 585.0,
      "marketValue": 585000.0,
      "currencyCode": "ISK",
      "date": "2026-07-15T00:00:00",
      "conversion": {
        "marketValue": 585000.0,
        "currencyCode": "ISK",
        "currencyRate": 1.0
      }
    }
  ],
  "page": 1,
  "perPage": 50,
  "totalItems": 5,
  "logEntryNo": 123
}
```

### Response fields per holding
| Field | Type | Description |
|---|---|---|
| `id` | string | Holding identifier (base64-encoded). |
| `portfolioId` | string | Parent portfolio ID. |
| `instrument` | object | Instrument details: `id` (ISIN), `name`, `type`, `currencyCode`. |
| `quantity` | double | Number of units held. |
| `price` | double | Price per unit in instrument currency. |
| `marketValue` | double | Total market value (`quantity` × `price`) in instrument currency. |
| `currencyCode` | string | ISO 4217 currency of the holding. |
| `date` | string | Valuation date (ISO date-time). |
| `conversion` | object | Converted market value in portfolio currency: `marketValue`, `currencyCode`, `currencyRate`. |

## AI/Agent playbook
Call `Portfolio.List` first to get portfolio IDs, then use this to see current positions.
The `conversion` object gives the value in the portfolio's base currency — useful for multi-currency portfolios.
Use `Portfolio.HoldingReturns` to see gain/loss for these same holdings.

