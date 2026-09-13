---
id: landsbankinn-portfolio-list
title: "Landsbankinn.Portfolio.List"
sidebar_label: "Landsbankinn.Portfolio.List"
sidebar_position: 132
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Portfolio.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists portfolios (verðbréfasöfn) at Landsbankinn.
Calls `GET /Portfolios` on the Landsbankinn Assets API.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{ "skip": 0, "take": 50 }
```

| Parameter | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `skip` | integer | no | Number of færslur til skip (default 0). |
| `take` | integer | no | Maximum færslur til return (default 10000). |

### API Fyrirspurn parameters (applied sjálfkrafa)
| Parameter | Gerð | Lýsing |
|---|---|---|
| `status` | array | Filter by status: `active`, `inactive`, `closed`. |
| `sortBy` | string | Sort order fyrir Niðurstaðan set. |
| `page` | integer | Page number (1-based). |
| `perPage` | integer | færslur per page (max 1000). |

## Svar
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

### Svar fields per portfolio
| Reitur | Gerð | Lýsing |
|---|---|---|
| `id` | string | Portfolio identifier (e.g. `"273816"`). Notaðu as `portfolioId` in Holdings, HoldingReturns, og færslur. |
| `name` | string | Portfolio display Heiti (e.g. `"Vörslusafn"`). |
| `currencyCode` | string | ISO 4217 currency code (e.g. `"ISK"`). |
| `status` | string | Portfolio status: `active`, `inactive`, eða `closed`. |
| `customer` | object | Owner með `nationalId` (kennitala) og `name`. |

Paging headers `X-Paging-TotalItems` og `X-Paging-TotalPages` eru returned by the bank API.

## Leiðbeiningar fyrir gervigreind/umboð
Kallaðu á this **first** til discover portfolio IDs. Then Notaðu:
- `Portfolio.Holdings` — current positions in a portfolio
- `Portfolio.HoldingReturns` — gain/loss per holding
- `Portfolio.Transactions` — trade history, dividends, fees


