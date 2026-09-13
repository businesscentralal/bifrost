---
id: landsbankinn-portfolio-holdingreturns
title: "Landsbankinn.Portfolio.HoldingReturns"
sidebar_label: "Landsbankinn.Portfolio.HoldingReturns"
sidebar_position: 130
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Portfolio.HoldingReturns Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir gain/loss Skilar per holding in a portfolio.
Calls `GET /Portfolios/{id}/HoldingReturns` on the Landsbankinn Assets API.

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

### Svar fields per holding return
| Reitur | Gerð | Lýsing |
|---|---|---|
| `id` | string | Holding identifier (base64-encoded, matches `Portfolio.Holdings` id). |
| `portfolioId` | string | Parent portfolio ID. |
| `instrument` | object | Instrument details: `id` (ISIN), `name`, `type`, `currencyCode`. |
| `gainLoss` | double | Absolute gain eða loss amount in holding currency. Positive = gain, negative = loss. |
| `gainLossPercentage` | double | Gain/loss as a percentage (e.g. `8.33` = 8.33%). |
| `currencyCode` | string | ISO 4217 currency of the return figures. |
| `from` | string | Start of the return period (ISO date-time). |
| `to` | string | End of the return period (ISO date-time). |

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu **eftir** `Portfolio.Holdings` til see performance. Pair the `id` Reitur með Holdings til correlate position size með return.
`gainLoss` er the absolute ISK (eða holding currency) gain; `gainLossPercentage` er the percentage return.
fyrir a fulla portfolio picture: Portfolio.Listi → Portfolio.Holdings (what you own) → Portfolio.HoldingReturns (how it performed).


