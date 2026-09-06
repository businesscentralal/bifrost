---
id: index
title: "Bifröst Iceland"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Icelandic government services and SMS gateways as Bifröst message types: Þjóðskrá through Umsjá, Skatturinn, Seðlabanki, Skilagrein, island.is and Já Gagnatorg."
---

Bifröst Iceland adds 75 Iceland-specific message types to Bifröst Foundation. An external system posts a request to the queue API (`origo/bifrost/v1.0`), Business Central runs the matching message type, and the result comes back through the response API — the same pattern as every other Bifröst message type, now reaching Þjóðskrá, Skatturinn, Seðlabanki Íslands, Skilagrein, island.is, Já Gagnatorg and the Icelandic SMS gateways.

## What it does

- **National registry (Þjóðskrá through Umsjá)** — full and monthly-delta loads into a local cache, plus person, company, address, relation, role, stakeholder, VAT-number and ÍSAT lookups.
- **Tax filing with Skatturinn** — virðisaukaskattur (VAT), staðgreiðsla (payroll withholding) and fjármagnstekjuskattur (capital income tax): fetch a period, validate, submit, correct, reopen and pull the PDF receipt.
- **Central bank data** — exchange rates, policy and facility rates, IKON, REIBID/REIBOR, loan-term yields, statutory penalty interest, the consumer price index, exchange-rate indices and the SDDS macroeconomic dataset. Exchange rates can be written straight into the Business Central Currency Exchange Rate table.
- **Skilagrein** — collectors, pension funds, unions, rehabilitation funds and pension supplements as master data, plus contribution returns and confirmation of extra charges.
- **island.is** — kennitala validation, vehicle lookup by plate or VIN, and the customs tariff: categories, input units, country-to-currency mapping and duty calculation.
- **Já Gagnatorg** — free-text directory search (Símaskrá) and registry lookups against Þjóðskrá and Fyrirtækjaskrá.
- **SMS** — Síminn magnSMS (REST or SOAP) and Nova, with delivery status.
- **Icelandic reference data** — public holidays, the Byggðastofnun postal-code registry, ISO currency and language lists.

Two message types run entirely inside Business Central with no external service: `Finance.VATStatement.Preview` calculates VAT statement lines per box number ready for RSK mapping, and `Finance.VAT.CalcAndPostSettlement` runs Calculate and Post VAT Settlement.

## How it works

1. Install Bifröst Foundation, then Bifröst Iceland. The **Set up Bifrost Iceland** assisted setup opens on first install.
2. Allow outgoing HTTP client requests for the extension — nothing reaches an external service until that is on.
3. Enter the credentials each service needs, on the **Bifrost Iceland Setup** card — reached from the **Apps** group of the Bifröst **Setup** page — or through the wizard. Every credential goes to the Bifröst Foundation secret store; nothing is written to a table and passwords are masked before any request reaches the Bifröst request log.
4. Set the company kennitala in **Company Information → Registration No.** Skatturinn authentication reads it from there.
5. Callers send Bifröst messages naming an `Iceland.*`, `Ja.*` or `Finance.VAT*` message type.

Each connector has a **client type** — the live service, a test service, or none — so a company can exercise the whole flow against Skatturinn's test endpoint before going live.

## Message types

| Domain | Count | Message types |
| --- | --- | --- |
| Directory | 1 | `Help.Iceland.Get` |
| Umsjá — Þjóðskrá | 15 | `Iceland.NationalRegistry.Sync`, `Iceland.NationalRegistryCheck.Get`, `Iceland.DeltaMonthly.Sync`, `Iceland.Member.Get`, `Iceland.Search.Get`, `Iceland.SearchByName.Get`, `Iceland.SearchBySocialID.Get`, `Iceland.Address.Get`, `Iceland.AddressInfo.Get`, `Iceland.Relations.Get`, `Iceland.Roles.Get`, `Iceland.Parties.Get`, `Iceland.Stakeholders.Get`, `Iceland.VatNumber.Get`, `Iceland.Isat.Get` |
| Skatturinn — VAT | 9 | `Iceland.VAT.GetPeriodEntries`, `Iceland.VAT.Validate`, `Iceland.VAT.Submit`, `Iceland.VAT.Correct`, `Iceland.VAT.GetNumbers`, `Iceland.VAT.GetInfo`, `Iceland.VAT.GetRSKDeclaration`, `Iceland.VAT.Receipt`, `Iceland.VAT.DeleteInTest` |
| Skatturinn — payroll | 6 | `Iceland.Payroll.GetPeriodPrereqs`, `Iceland.Payroll.GetAllPeriods`, `Iceland.Payroll.Validate`, `Iceland.Payroll.Send`, `Iceland.Payroll.Receipt`, `Iceland.Payroll.Reopen` |
| Skatturinn — capital tax | 8 | `Iceland.CapitalTax.Submit`, `Iceland.CapitalTax.GetStatus`, `Iceland.CapitalTax.GetOverview`, `Iceland.CapitalTax.GetTypes`, `Iceland.CapitalTax.GetPeriods`, `Iceland.CapitalTax.GetSubmittablePeriods`, `Iceland.CapitalTax.GetExemptions`, `Iceland.CapitalTax.Reopen` |
| Business Central VAT | 2 | `Finance.VATStatement.Preview`, `Finance.VAT.CalcAndPostSettlement` |
| Seðlabanki Íslands | 11 | `Iceland.CurrencyRates.Get`, `Iceland.Currency.Sync`, `Iceland.InterestRates.Get`, `Iceland.IkonRates.Get`, `Iceland.InterbankRates.Get`, `Iceland.LoanTermRates.Get`, `Iceland.PenaltyInterest.Get`, `Iceland.ConsumerPriceIndex.Get`, `Iceland.ExchangeRateIndex.Get`, `Iceland.EconomicData.Get`, `Iceland.Language.Get` |
| Skilagrein | 7 | `Iceland.Collector.Get`, `Iceland.PensionFund.Get`, `Iceland.Union.Get`, `Iceland.RehabFund.Get`, `Iceland.PensionSupplement.Get`, `Iceland.CollectorPayment.Send`, `Iceland.CollectorExtraAmount.Confirm` |
| island.is | 6 | `Iceland.Kennitala.Validate`, `Iceland.Vehicle.Get`, `Iceland.Customs.Categories`, `Iceland.Customs.Calculate`, `Iceland.Customs.Units`, `Iceland.Customs.CountryCurrencies` |
| SMS | 2 | `Iceland.SMS.Send`, `Iceland.SMS.Status` |
| Reference data | 4 | `Iceland.Holidays.Get`, `Iceland.Holidays.IsHoliday`, `Iceland.PostCode.Get`, `Iceland.Currency.Get` |
| Já Gagnatorg | 4 | `Help.Ja.Get`, `Ja.Search.Query`, `Ja.Person.Get`, `Ja.Company.Get` |

## Permission sets

`BIFROST ISFull ori` is a permission set extension: it adds every Iceland object to Bifröst Foundation's `BIFROST Full ori`, so that is the set to assign for full access. The rest gate one service each and are assigned on their own where a caller should reach only part of the app.

| Permission set | Assignable | Covers |
| --- | --- | --- |
| `BIFROST ISFull ori` | Extension of `BIFROST Full ori` | Every Iceland object |
| `BIFROST Umsja ori` | No — included in `BIFROST ISFull ori` | Umsjá lookups and the registry cache |
| `BIFROST NatReg ori` | Yes | National registry synchronization |
| `BIFROST VAT ori` | Yes | VAT submissions |
| `BIFROST Payroll ori` | Yes | Payroll tax submissions |
| `BIFROST CapTax ori` | Yes | Capital income tax submissions |
| `BIFROST Collect ori` | Yes | Skilagrein collector submissions |
| `BIFROST SMS ori` | Yes | SMS to Icelandic numbers |
| `BIFROST SMS Fgn ori` | Yes | SMS to foreign numbers |
| `BIFROST Ja ori` | Yes | Já Gagnatorg search, person and company lookups |

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- Bifröst Foundation, available separately on AppSource.
- Outgoing HTTP client requests enabled for the extension.
- Credentials for each service the company uses: an Umsjá licence with user name and password, Skatturinn passwords for VAT, payroll and capital tax, a Skilagrein password per collector, an SMS account with Síminn or Nova, and Já Gagnatorg search and registry API keys. The public data services — Seðlabanki, island.is, holidays, postal codes — need no credentials.

## Where to go next

- [In-product help](/help/iceland/)
- [Message type reference](./reference/message-types/) — the request and response contract for every type, generated from the app itself
- [AppSource user scenarios](./user-scenarios)
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
