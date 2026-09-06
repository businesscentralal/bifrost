---
id: landsbankinn-portfolio-list
title: "Landsbankinn.Portfolio.List"
sidebar_label: "Landsbankinn.Portfolio.List"
sidebar_position: 132
description: "Request and response contract for the Landsbankinn.Portfolio.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists portfolios (verðbréfasöfn) at Landsbankinn.
Calls `GET /Portfolios` on the Landsbankinn Assets API.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{ "skip": 0, "take": 50 }
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `skip` | integer | no | Number of records to skip (default 0). |
| `take` | integer | no | Maximum records to return (default 10000). |

### API query parameters (applied automatically)
| Parameter | Type | Description |
|---|---|---|
| `status` | array | Filter by status: `active`, `inactive`, `closed`. |
| `sortBy` | string | Sort order for the result set. |
| `page` | integer | Page number (1-based). |
| `perPage` | integer | Records per page (max 1000). |

## Response
```json
{
  "data": [
    {
      "id": "273816",
      "name": "Vörslusafn",
      "currencyCode": "ISK",
      "status": "active",
      "customer": { "nationalId": "6306251060", "name": "Kappi ehf." }
    }
  ],
  "page": 1,
  "perPage": 50,
  "totalItems": 3,
  "logEntryNo": 123
}
```

### Response fields per portfolio
| Field | Type | Description |
|---|---|---|
| `id` | string | Portfolio identifier (e.g. `"273816"`). Use as `portfolioId` in Holdings, HoldingReturns, and Transactions. |
| `name` | string | Portfolio display name (e.g. `"Vörslusafn"`). |
| `currencyCode` | string | ISO 4217 currency code (e.g. `"ISK"`). |
| `status` | string | Portfolio status: `active`, `inactive`, or `closed`. |
| `customer` | object | Owner with `nationalId` (kennitala) and `name`. |

Paging headers `X-Paging-TotalItems` and `X-Paging-TotalPages` are returned by the bank API.

## AI/Agent playbook
Call this **first** to discover portfolio IDs. Then use:
- `Portfolio.Holdings` — current positions in a portfolio
- `Portfolio.HoldingReturns` — gain/loss per holding
- `Portfolio.Transactions` — trade history, dividends, fees

