---
id: landsbankinn-portfolio-transactions
title: "Landsbankinn.Portfolio.Transactions"
sidebar_label: "Landsbankinn.Portfolio.Transactions"
sidebar_position: 133
description: "Request and response contract for the Landsbankinn.Portfolio.Transactions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves portfolio transactions (buys, sells, dividends, fees) for a portfolio.
Calls `GET /Transactions` on the Landsbankinn Assets API.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "portfolioId": "308437",
  "tradeDateFrom": "2025-07-15",
  "tradeDateTo": "2026-07-15",
  "skip": 0,
  "take": 50
}
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `portfolioId` | string | yes | Portfolio ID from `Portfolio.List`. |
| `tradeDateFrom` | string (date) | yes | Start of trade date range (ISO date). Default: 1 month ago. |
| `tradeDateTo` | string (date) | yes | End of trade date range (ISO date). Default: today. |
| `skip` | integer | no | Number of records to skip (default 0). |
| `take` | integer | no | Maximum records to return (default 10000). |

**Constraint:** Maximum date span is 1 year. All three parameters are required.

### API query parameters (applied automatically)
| Parameter | Type | Description |
|---|---|---|
| `action` | string | Filter by transaction action (e.g. buy, sell, dividend). |
| `instrumentId` | string | Filter by instrument ID (ISIN). |
| `page` | integer | Page number (1-based). |
| `perPage` | integer | Records per page (max 1000). |

## Response
```json
{
  "data": [
    {
      "id": "TXN-001",
      "tradeId": "T-12345",
      "customerNationalId": "6306251060",
      "portfolioId": "308437",
      "accountBban": "013326019566",
      "action": "buy",
      "direction": "in",
      "status": "completed",
      "instrument": {
        "id": "IS0000020338",
        "name": "Eimskip",
        "type": "Equity",
        "currencyCode": "ISK"
      },
      "quantity": 500.0,
      "price": 585.0,
      "taxAmount": 0.0,
      "orderAmount": 292500.0,
      "totalFee": 1462.5,
      "totalPayment": 293962.5,
      "currencyCode": "ISK",
      "conversion": { "totalPayment": 293962.5, "currencyCode": "ISK", "currencyRate": 1.0 },
      "fees": { "transactionFee": 1462.5, "serviceFee": 0.0, "totalFee": 1462.5 },
      "tradeDate": "2026-07-10",
      "estimatedSettlementDate": "2026-07-12",
      "paidDate": "2026-07-12",
      "modifiedDate": "2026-07-12T10:30:00"
    }
  ],
  "page": 1,
  "perPage": 50,
  "totalItems": 12,
  "logEntryNo": 123
}
```

### Response fields per transaction
| Field | Type | Description |
|---|---|---|
| `id` | string | Unique transaction identifier. |
| `tradeId` | string | Trade identifier (may group related transactions). |
| `customerNationalId` | string | Owner kennitala. |
| `portfolioId` | string | Portfolio the transaction belongs to. |
| `accountBban` | string | Settlement account (12-digit BBAN). |
| `action` | string | Transaction type: `buy`, `sell`, `dividend`, etc. |
| `direction` | string | Cash flow direction: `in` or `out`. |
| `status` | string | Transaction status: `new`, `completed`, etc. |
| `instrument` | object | Instrument details: `id` (ISIN), `name`, `type`, `currencyCode`. |
| `quantity` | double | Number of units traded. |
| `price` | double | Price per unit. |
| `taxAmount` | double | Tax withheld (e.g. fjármagnstekjuskattur on dividends). |
| `orderAmount` | double | Gross trade amount (`quantity` × `price`). |
| `totalFee` | double | Sum of all fees. |
| `totalPayment` | double | Net settlement amount (`orderAmount` + `totalFee` + `taxAmount`). |
| `currencyCode` | string | ISO 4217 currency of the transaction. |
| `conversion` | object | Converted totals in portfolio currency: `totalPayment`, `currencyCode`, `currencyRate`. |
| `fees` | object | Fee breakdown: `transactionFee`, `serviceFee`, `totalFee`. |
| `tradeDate` | string (date) | Date the trade was executed. |
| `estimatedSettlementDate` | string (date) | Expected settlement date. |
| `paidDate` | string (date) | Actual payment/settlement date. |
| `modifiedDate` | string (date-time) | Last modification timestamp. |

## AI/Agent playbook
Use to retrieve trade history, dividend payments, and fee details for a portfolio.
All three parameters are required — pick a date range up to 1 year.
For accounting: `action` = `dividend` with `taxAmount` gives you withholding tax; `fees` breaks down broker costs.
Typical workflow: Portfolio.List → Portfolio.Transactions (with date range) → post to G/L journal.

