---
id: iceland-customs-countrycurrencies
title: "Iceland.Customs.CountryCurrencies"
sidebar_label: "Iceland.Customs.CountryCurrencies"
sidebar_position: 24
description: "Beiðni- og svarsamningur fyrir Iceland.Customs.CountryCurrencies Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar country-til-currency mapping used by Icelandic customs (Tollstjóri)
via the island.er public GraphQL API. Useful fyrir determining which currency code
til supply Þegar calling `Iceland.Customs.Calculate` fyrir a given country of origin.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Authentication:** None — public island.er API.

## Notað þegar
- You need til find the correct currency code fyrir a country of origin áður en calling `Iceland.Customs.Calculate`.
- You want til present a country-til-currency lookup in a customs import Verkflæði.
- You need til validate that a currency code er recognized by Icelandic customs fyrir a specific date.

## Beiðni

- **Subject** (nauðsynlegt): Date in ISO format (`YYYY-MM-DD`), e.g. `2026-08-01`.
  The date determines which currency mapping er in effect.
- **Body**: Not used. Leave empty eða pass `{}`.

## Svar fields

Skilar an array of objects:

| Reitur | Lýsing |
|-------|-------------|
| `countryName` | Country Heiti in Icelandic |
| `countryCode` | ISO 3166-1 alpha-2 country code |
| `currencyCode` | ISO 4217 currency code (null Ef not assigned) |

## Authentication

None nauðsynlegt — public API.

## Leiðbeiningar fyrir gervigreind/umboð
1. Kallaðu á með today's date (eða the import date) as subject.
2. Find the country of origin in Svarið by `countryCode`.
3. Notaðu the returned `currencyCode` as input til `Iceland.Customs.Calculate`.
4. Ef `currencyCode` er null fyrir a country, the currency er not mapped — ask the user.
Capability boundary: reads public customs data Aðeins; no write operations.

## Dæmi

Subject `2026-08-01` Skilar fulla country-currency Listi as of that date.

## Errors
- `Subject is required. Provide a date in ISO format (e.g. 2026-08-01).` — subject missing.
- `Subject "..." is not a valid date. Use ISO format YYYY-MM-DD.` — invalid date format.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://island.is`.


