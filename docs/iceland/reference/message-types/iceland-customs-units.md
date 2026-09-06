---
id: iceland-customs-units
title: "Iceland.Customs.Units"
sidebar_label: "Iceland.Customs.Units"
sidebar_position: 25
description: "Request and response contract for the Iceland.Customs.Units Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns the list of required input units for a given customs tariff number.
Use this to determine which optional fields (`netWeightKg`, `liters`,
`unitCount`, `percentage`, emission fields) must be supplied when calling
`Iceland.Customs.Calculate` for that tariff.

**Direction:** Outbound  
**Content-Type:** text/json  
**Authentication:** None — public island.is API.

## Use when
- You have a tariff number and need to know which measurement fields to collect before calling `Iceland.Customs.Calculate`.
- You want to dynamically show/hide input fields in a customs import UI based on the product type.
- You need to validate that you have all required data before submitting a calculation.

## Request

- **Subject** (required): Customs tariff number (e.g. `8703239090`).
  Use `Iceland.Customs.Categories` to find the correct tariff number.
- **Body**: Not used. Leave empty or pass `{}`.

## Response fields

| Field | Description |
|-------|-------------|
| `units` | Array of unit identifiers required for this tariff |

An empty `units` array means only `tariffNumber`, `currencyCode`, and
`priceWithShipping` are needed for the calculation.

## Authentication

None required — public API.

## AI/Agent playbook
1. Get the tariff number from `Iceland.Customs.Categories`.
2. Call this endpoint with the tariff number as subject.
3. If `units` is empty, proceed to `Iceland.Customs.Calculate` with just price and currency.
4. If `units` contains values, collect those measurements before calling Calculate.
Capability boundary: reads public customs data only; no write operations.

## Example

Subject `8703239090` returns the units needed for passenger vehicle import duty.

## Errors
- `Subject is required. Provide a customs tariff number (e.g. 8703239090).` — subject missing.

## Troubleshooting - outbound HTTP blocked
If a call fails with an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://island.is`.

