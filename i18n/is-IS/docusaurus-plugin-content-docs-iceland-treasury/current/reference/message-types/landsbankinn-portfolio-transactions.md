---
id: landsbankinn-portfolio-transactions
title: "Landsbankinn.Portfolio.Transactions"
sidebar_label: "Landsbankinn.Portfolio.Transactions"
sidebar_position: 133
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Portfolio.færslur Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir portfolio færslur (buys, sells, dividends, fees) fyrir a portfolio.
Calls `GET /Transactions` on the Landsbankinn Assets API.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "portfolioId": "308437",
  "tradeDateFrom": "2025-07-15",
  "tradeDateTo": "2026-07-15",
  "skip": 0,
  "take": 50
}
```

| Parameter | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `portfolioId` | string | yes | Portfolio ID frá `Portfolio.List`. |
| `tradeDateFrom` | string (date) | yes | Start of trade date range (ISO date). Default: 1 month ago. |
| `tradeDateTo` | string (date) | yes | End of trade date range (ISO date). Default: today. |
| `skip` | integer | no | Number of færslur til skip (default 0). |
| `take` | integer | no | Maximum færslur til return (default 10000). |

**Constraint:** Maximum date span er 1 year. Allt three parameters eru nauðsynlegt.

### API Fyrirspurn parameters (applied sjálfkrafa)
| Parameter | Gerð | Lýsing |
|---|---|---|
| `action` | string | Filter by færsla action (e.g. buy, sell, dividend). |
| `instrumentId` | string | Filter by instrument ID (ISIN). |
| `page` | integer | Page number (1-based). |
| `perPage` | integer | færslur per page (max 1000). |

## Svar
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

### Svar fields per færsla
| Reitur | Gerð | Lýsing |
|---|---|---|
| `id` | string | Unique færsla identifier. |
| `tradeId` | string | Trade identifier (may group related færslur). |
| `customerNationalId` | string | Owner kennitala. |
| `portfolioId` | string | Portfolio the færsla belongs til. |
| `accountBban` | string | Settlement reikningur (12-digit BBAN). |
| `action` | string | færsla Gerð: `buy`, `sell`, `dividend`, etc. |
| `direction` | string | Cash flow Stefna: `in` eða `out`. |
| `status` | string | færsla status: `new`, `completed`, etc. |
| `instrument` | object | Instrument details: `id` (ISIN), `name`, `type`, `currencyCode`. |
| `quantity` | double | Number of units traded. |
| `price` | double | Price per unit. |
| `taxAmount` | double | Tax withheld (e.g. fjármagnstekjuskattur on dividends). |
| `orderAmount` | double | Gross trade amount (`quantity` × `price`). |
| `totalFee` | double | Sum of Allt fees. |
| `totalPayment` | double | Net settlement amount (`orderAmount` + `totalFee` + `taxAmount`). |
| `currencyCode` | string | ISO 4217 currency of the færsla. |
| `conversion` | object | Converted totals in portfolio currency: `totalPayment`, `currencyCode`, `currencyRate`. |
| `fees` | object | Fee breakdown: `transactionFee`, `serviceFee`, `totalFee`. |
| `tradeDate` | string (date) | Date the trade was executed. |
| `estimatedSettlementDate` | string (date) | Expected settlement date. |
| `paidDate` | string (date) | Actual greiðsla/settlement date. |
| `modifiedDate` | string (date-time) | Last modification timestamp. |

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu til retrieve trade history, dividend greiðslur, og fee details fyrir a portfolio.
Allt three parameters eru nauðsynlegt — pick a date range up til 1 year.
fyrir accounting: `action` = `dividend` með `taxAmount` gives you withholding tax; `fees` breaks down broker costs.
Typical Verkflæði: Portfolio.Listi → Portfolio.færslur (með date range) → post til G/L journal.


