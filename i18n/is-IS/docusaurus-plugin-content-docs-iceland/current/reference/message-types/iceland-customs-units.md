---
id: iceland-customs-units
title: "Iceland.Customs.Units"
sidebar_label: "Iceland.Customs.Units"
sidebar_position: 25
description: "Beiðni- og svarsamningur fyrir Iceland.Customs.Units Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar Listi of nauðsynlegt input units fyrir a given customs tariff number.
Notaðu this til determine which valfrjálst fields (`netWeightKg`, `liters`,
`unitCount`, `percentage`, emission fields) verður að be supplied Þegar calling
`Iceland.Customs.Calculate` fyrir that tariff.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Authentication:** None — public island.er API.

## Notað þegar
- You have a tariff number og need til know which measurement fields til collect áður en calling `Iceland.Customs.Calculate`.
- You want til dynamically show/hide input fields in a customs import UI based on the product Gerð.
- You need til validate that you have Allt nauðsynlegt data áður en submitting a calculation.

## Beiðni

- **Subject** (nauðsynlegt): Customs tariff number (e.g. `8703239090`).
  Notaðu `Iceland.Customs.Categories` til find the correct tariff number.
- **Body**: Not used. Leave empty eða pass `{}`.

## Svar fields

| Reitur | Lýsing |
|-------|-------------|
| `units` | Array of unit identifiers nauðsynlegt fyrir this tariff |

An empty `units` array means Aðeins `tariffNumber`, `currencyCode`, og
`priceWithShipping` eru needed fyrir the calculation.

## Authentication

None nauðsynlegt — public API.

## Leiðbeiningar fyrir gervigreind/umboð
1. Sækja the tariff number frá `Iceland.Customs.Categories`.
2. Kallaðu á this Endapunktur með the tariff number as subject.
3. Ef `units` er empty, proceed til `Iceland.Customs.Calculate` með just price og currency.
4. Ef `units` contains values, collect those measurements áður en calling Calculate.
Capability boundary: reads public customs data Aðeins; no write operations.

## Dæmi

Subject `8703239090` Skilar units needed fyrir passenger vehicle import duty.

## Errors
- `Subject is required. Provide a customs tariff number (e.g. 8703239090).` — subject missing.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://island.is`.


