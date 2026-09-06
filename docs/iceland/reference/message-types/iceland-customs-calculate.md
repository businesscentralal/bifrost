---
id: iceland-customs-calculate
title: "Iceland.Customs.Calculate"
sidebar_label: "Iceland.Customs.Calculate"
sidebar_position: 22
description: "Request and response contract for the Iceland.Customs.Calculate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Calculates Icelandic customs duty and charges for importing goods.
Uses the island.is public customs calculator API.

**Direction:** Outbound  
**Content-Type:** text/json  
**Authentication:** None — public island.is API.

## Use when
- You need to calculate the import duties for a product being shipped to Iceland.
- You have a tariff number (from `Iceland.Customs.Categories`) and know the CIF value.
- Importing a vehicle and need the CO2-based emission levy calculation.

## Request

- **Subject**: Not used. Leave empty.
- **Body** (JSON object):

| Field | Required | Description |
|-------|----------|-------------|
| `tariffNumber` | Yes | Customs tariff code (use `Iceland.Customs.Categories` to find) |
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

## Response

| Field | Description |
|-------|-------------|
| `charges[]` | Breakdown of duty charges |
| `charges[].code` | Charge type code |
| `charges[].description` | Human-readable description |
| `charges[].amount` | Amount in ISK |
| `charges[].percentage` | Rate as percentage |
| `charges[].unit` | Unit of measure |
| `startAmount` | Base value (ISK) |
| `additionalAmount` | Additional charges (ISK) |
| `totalAmount` | Total duty payable (ISK) |
| `hasUnparseableCharge` | `true` if some charges could not be calculated |

## AI/Agent playbook
1. First use `Iceland.Customs.Categories` to find the correct `tariffNumber` for the product.
2. For vehicle imports, use `Iceland.Vehicle.Get` to obtain `co2WLTP` and pass it as `wltpEmission`.
3. Numeric fields (weight, price, emissions) must be passed as strings.
4. Check `hasUnparseableCharge = true` — some charges may require manual review even when totalAmount is returned.
5. `totalAmount` is in ISK regardless of the `currencyCode` input (currency is used for the CIF conversion).
Capability boundary: reads public API; no BC records are modified.

## Authentication

None required — public API.

## Example body

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

> **NOT YET LIVE** — endpoint merged to island.is but not deployed to production as of 2026-06-27.
> When live, vehicle imports use tariff 8703.x; emission fields enable the CO2-based levy calculation.

## Troubleshooting - outbound HTTP blocked
If a call fails with an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://api.island.is`.

