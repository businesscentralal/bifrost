---
id: landsbankinn-portfolio-holdings
title: "Landsbankinn.Portfolio.Holdings"
sidebar_label: "Landsbankinn.Portfolio.Holdings"
sidebar_position: 131
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Portfolio.Holdings Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists current holdings (stocks, bonds, funds, deposits) in a portfolio.
Calls `GET /Portfolios/{id}/Holdings` on the Landsbankinn Assets API.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "portfolioId": "308437", "skip": 0, "take": 50 }
```

| Parameter | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `portfolioId` | string | yes | Portfolio ID frá `Portfolio.List`. |
| `skip` | integer | no | Number of færslur til skip (default 0). |
| `take` | integer | no | Maximum færslur til return (default 10000). |

### API Fyrirspurn parameters (applied sjálfkrafa)
| Parameter | Gerð | Lýsing |
|---|---|---|
| `page` | integer | Page number (1-based). |
| `perPage` | integer | færslur per page (max 1000). |

## Svar
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

### Svar fields per holding
| Reitur | Gerð | Lýsing |
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

## Leiðbeiningar fyrir gervigreind/umboð
Kallaðu á `Portfolio.List` first til Sækja portfolio IDs, then Notaðu this til see current positions.
The `conversion` object gives the value in the portfolio's base currency — useful fyrir multi-currency portfolios.
Notaðu `Portfolio.HoldingReturns` til see gain/loss fyrir these same holdings.


