---
id: iceland-customs-countrycurrencies
title: "Iceland.Customs.CountryCurrencies"
sidebar_label: "Iceland.Customs.CountryCurrencies"
sidebar_position: 24
description: "Request and response contract for the Iceland.Customs.CountryCurrencies Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns the country-to-currency mapping used by Icelandic customs (Tollstjóri)
via the island.is public GraphQL API. Useful for determining which currency code
to supply when calling `Iceland.Customs.Calculate` for a given country of origin.

**Direction:** Outbound  
**Content-Type:** text/json  
**Authentication:** None — public island.is API.

## Use when
- You need to find the correct currency code for a country of origin before calling `Iceland.Customs.Calculate`.
- You want to present a country-to-currency lookup in a customs import workflow.
- You need to validate that a currency code is recognized by Icelandic customs for a specific date.

## Request

- **Subject** (required): Date in ISO format (`YYYY-MM-DD`), e.g. `2026-08-01`.
  The date determines which currency mapping is in effect.
- **Body**: Not used. Leave empty or pass `{}`.

## Response fields

Returns an array of objects:

| Field | Description |
|-------|-------------|
| `countryName` | Country name in Icelandic |
| `countryCode` | ISO 3166-1 alpha-2 country code |
| `currencyCode` | ISO 4217 currency code (null if not assigned) |

## Authentication

None required — public API.

## AI/Agent playbook
1. Call with today's date (or the import date) as subject.
2. Find the country of origin in the response by `countryCode`.
3. Use the returned `currencyCode` as input to `Iceland.Customs.Calculate`.
4. If `currencyCode` is null for a country, the currency is not mapped — ask the user.
Capability boundary: reads public customs data only; no write operations.

## Example

Subject `2026-08-01` returns the full country-currency list as of that date.

## Errors
- `Subject is required. Provide a date in ISO format (e.g. 2026-08-01).` — subject missing.
- `Subject "..." is not a valid date. Use ISO format YYYY-MM-DD.` — invalid date format.

## Troubleshooting - outbound HTTP blocked
If a call fails with an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://island.is`.

