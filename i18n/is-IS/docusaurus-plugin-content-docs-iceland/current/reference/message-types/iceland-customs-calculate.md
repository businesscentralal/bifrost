---
id: iceland-customs-calculate
title: "Iceland.Customs.Calculate"
sidebar_label: "Iceland.Customs.Calculate"
sidebar_position: 22
description: "Beiðni- og svarsamningur fyrir Iceland.Customs.Calculate Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Calculates Icelandic customs duty og charges fyrir importing goods.
Uses the island.er public customs calculator API.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Authentication:** None — public island.er API.

## Notað þegar
- You need til calculate the import duties fyrir a product being shipped til Iceland.
- You have a tariff number (frá `Iceland.Customs.Categories`) og know the CIF value.
- Importing a vehicle og need the CO2-based emission levy calculation.

## Beiðni

- **Subject**: Not used. Leave empty.
- **Body** (JSON object):

| Reitur | nauðsynlegt | Lýsing |
|-------|----------|-------------|
| `tariffNumber` | Yes | Customs tariff code (Notaðu `Iceland.Customs.Categories` til find) |
| `currencyCode` | Yes | 3-letter currency code (e.g. `EUR`, `USD`, `ISK`) |
| `priceWithShipping` | No | Total CIF value (price + shipping) as string |
| `unitCount` | No | Number of units as string |
| `netWeightKg` | No | Net weight in kilograms as string |
| `liters` | No | Volume in liters as string (alcohol/fuel) |
| `percentage` | No | Alcohol percentage as string |
| `nedcEmission` | No | NEDC CO2 emission (vehicles) |
| `nedcWeightedEmission` | No | NEDC weighted CO2 (vehicles) |
| `wltpEmission` | No | WLTP CO2 emission (vehicles, preferred) |
| `wltpWeightedEmission` | No | WLTP weighted CO2 (hybrid vehicles) |

## Svar

| Reitur | Lýsing |
|-------|-------------|
| `charges[]` | Breakdown of duty charges |
| `charges[].code` | Charge Gerð code |
| `charges[].description` | Human-readable Lýsing |
| `charges[].amount` | Amount in ISK |
| `charges[].percentage` | Rate as percentage |
| `charges[].unit` | Unit of measure |
| `startAmount` | Base value (ISK) |
| `additionalAmount` | Additional charges (ISK) |
| `totalAmount` | Total duty payable (ISK) |
| `hasUnparseableCharge` | `true` Ef some charges could not be calculated |

## Leiðbeiningar fyrir gervigreind/umboð
1. First Notaðu `Iceland.Customs.Categories` til find the correct `tariffNumber` fyrir the product.
2. fyrir vehicle imports, Notaðu `Iceland.Vehicle.Get` til obtain `co2WLTP` og pass it as `wltpEmission`.
3. Numeric fields (weight, price, emissions) verður að be passed as strings.
4. Check `hasUnparseableCharge = true` — some charges may require manual review even Þegar totalAmount er returned.
5. `totalAmount` er in ISK regardless of the `currencyCode` input (currency er used fyrir the CIF conversion).
Capability boundary: reads public API; no BC færslur eru modified.

## Authentication

None nauðsynlegt — public API.

## Dæmi body

```json
{
  "tariffNumber": "8703.80.0019",
  "currencyCode": "EUR",
  "priceWithShipping": "45000",
  "netWeightKg": "2500",
  "wltpEmission": "0"
}
```

## Status

> **NOT YET LIVE** — Endapunktur merged til island.er but not deployed til production as of 2026-06-27.
> Þegar live, vehicle imports Notaðu tariff 8703.x; emission fields enable the CO2-based levy calculation.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://api.island.is`.


