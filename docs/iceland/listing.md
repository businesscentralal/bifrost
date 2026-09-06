---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts into Partner Center when creating/updating the offer listing.
>
> App id `e1276ba8-3405-4589-ba68-51d725992ef6` · Publisher **Origo** · Version **28.0.0.0**

---

## Offer Name
Bifrost Iceland

## Search Result Summary (max 100 chars)
Icelandic tax filing, registry lookups, central bank rates and SMS for Business Central. (87)

## Short Description (max 100 chars)
Skatturinn, Þjóðskrá, Seðlabanki, Skilagrein and SMS as Bifrost message types. (77)

## Search Keywords
1. Iceland tax
2. RSK VAT
3. Seðlabanki

## Categories
- **Primary:** Finance > Tax/Audit
- **Secondary:** IT & Admin Tools > Data Integration

## Industries
- Financial Services
- Professional Services

---

## Description

See [Full description](#full-description) below for the full description text.

---

## Supported editions and markets

- **Editions:** Business Central Essentials and Premium
- **Countries/regions:** Iceland
- **Supported languages:** English (United States), Icelandic (Iceland)

## Dependencies

- **Bifrost Foundation** (Origo) `7505e808-6e52-4b96-a328-82573391297a` v28.0.0.0
- **IS Core** (Microsoft) `cd6afb88-73aa-406f-a087-50a6149d5779` v28.0.0.0

---

## Support Link
https://www.origo.is/

## Help Link
https://bifrost.origo.is/en-us/iceland/

## Privacy Policy
https://www.origo.is/um-origo/stefnur/personuverndarstefna

## Products your app works with
- Dynamics 365 Business Central

---

## Full description

**Bifrost Iceland** adds Iceland-specific capabilities to Bifrost — a message-based integration layer that gives external systems, AI agents, and automation tools structured access to Business Central data and procedures via OData. It connects Business Central to Icelandic government services, the Central Bank, and communication providers, all through the same Queue → Task → Data API pattern used across the Bifrost platform. Any MCP-compatible client, REST caller, or BC process can invoke these operations without custom development.

The app adds 71 message types on top of **Bifrost Foundation**.

### Who is this for?

**Icelandic businesses and their IT teams** who need Business Central to communicate with local government services (Skatturinn, Þjóðskrá, Seðlabanki, Skilagrein) and communication providers (Síminn, Nova). Eliminates manual data entry for tax filing, currency rate updates, registry lookups and payroll submissions.

**Target industries:** All industries operating in Iceland — financial services, professional services, retail, manufacturing, distribution. Any company that files VAT returns or payroll tax, or needs Icelandic public data such as postal codes, holidays and currency rates.

### Tax filing (Skatturinn / RSK)

- **VAT returns** — Validate, submit, correct, and retrieve receipts for VSK statements
- **Payroll tax** (staðgreiðsla) — Submit and validate payroll returns, retrieve period prerequisites, reopen a period for correction
- **Capital income tax** (fjármagnstekjuskattur) — Submit returns, check status, get periods, types and exemptions

All submissions support both production and test client types. Test mode sends to the RSK sandbox without real tax consequences.

### National registry (Þjóðskrá via Umsjá)

- **Registry sync** — Full national registry load and monthly delta updates into a local cache
- **Lookups** — People and companies by kennitala, name, or address; family and company relations; roles, parties and stakeholders
- **Company data** — VAT numbers and ÍSAT industry classification

### Central Bank data (Seðlabanki Íslands)

- **Currency rates** — Daily reference rates; sync directly into the BC Currency Exchange Rate table
- **Interest rates** — Policy rate, deposit/lending facilities, IKON fixings, interbank (REIBID/REIBOR), loan-term yields
- **Economic indicators** — Consumer Price Index, penalty interest (dráttarvextir), exchange rate indices, SDDS macro data

### Public registries (island.is)

- **Kennitala validation** — Verify Icelandic national IDs, determine person/company type
- **Vehicle registry** — Look up vehicles by plate number or VIN
- **Customs** — Browse tariff categories, calculate import duties, get required units and country/currency mappings

### Payroll services (Skilagrein)

- **Master data** — Pension funds, unions, collectors, rehabilitation funds, pension supplements
- **Submissions** — Send fund contribution returns, confirm extra amounts

### Communication (SMS)

- **Send SMS** — via Síminn magnSMS (REST or SOAP) or Nova
- **Delivery status** — Track message delivery

### Icelandic reference data

- **Public holidays** — List holidays for any year, or check whether one date is a holiday
- **Postal codes** — Full Icelandic postal code registry from Byggðastofnun
- **ISO currencies** — The published ISO 4217 currency list

### Security

Credentials for Umsjá, Síminn, Nova, Skatturinn, Skilagrein and Já Gagnatorg are held in the Bifröst Foundation secret store, backed by Business Central IsolatedStorage, and are masked before any outbound request is written to the request log. Access is governed by dedicated permission sets: BIFROST ISFull ori, BIFROST Umsja ori, BIFROST NatReg ori, BIFROST VAT ori, BIFROST Payroll ori, BIFROST CapTax ori, BIFROST Collect ori, BIFROST SMS ori and BIFROST SMS Fgn ori.

### Supported editions and countries

- **Editions:** Business Central Essentials and Premium
- **Countries:** Iceland
- **Requires:** Bifrost Foundation (Origo), IS Core (Microsoft)

### Requirements

- Business Central 28.0 or later
- Bifrost Foundation extension installed
- IS Core localization (Microsoft) installed
- Outgoing HTTP client requests allowed for the extension
- RSK, Umsjá, Skilagrein or SMS credentials for the corresponding features — public data works without credentials
