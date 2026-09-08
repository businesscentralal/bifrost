---
id: index
title: "Bifröst Iceland — Help"
sidebar_label: "Bifröst Iceland — Help"
sidebar_position: 1
slug: /
---

**Bifrost Iceland** is a Business Central extension by Origo that adds 75 Iceland-specific message types to **Bifrost Foundation**. It connects Business Central to Icelandic government services (Þjóðskrá via Umsjá, Skatturinn, Seðlabanki, island.is, Skilagrein, Já Gagnatorg) and to the Síminn and Nova SMS gateways. Every capability is reached the same way as any other Bifrost message type: post a request to the queue API, run the task, read the response.

## Pages

| Page | Description |
| --- | --- |
| [Bifrost Iceland Setup](/help/iceland/iceland-setup/) | Credentials and client types for Umsjá, SMS, Skatturinn, Skilagrein and Já Gagnatorg. |
| [National Registry Entries](/help/iceland/iceland-umsja-registry/) | The local cache of Þjóðskrá data retrieved through Umsjá. |
| [Skilagrein Master Data](/help/iceland/iceland-skilagrein/) | Collectors, pension funds, unions, rehabilitation funds and pension supplements. |

## Permission sets

| Permission set | Grants |
| --- | --- |
| BIFROST ISFull ori | Permission set extension. Adds every Iceland object to `BIFROST Full ori` — assign that set, not this one. |
| BIFROST Umsja ori | Umsjá lookups and the national registry cache. Not assignable on its own; included in BIFROST ISFull ori. |
| BIFROST NatReg ori | National registry synchronization. |
| BIFROST VAT ori | VAT (virðisaukaskattur) submissions. |
| BIFROST Payroll ori | Payroll tax (staðgreiðsla) submissions. |
| BIFROST CapTax ori | Capital income tax (fjármagnstekjuskattur) submissions. |
| BIFROST Collect ori | Skilagrein collector submissions. |
| BIFROST SMS ori | SMS to Icelandic numbers. |
| BIFROST SMS Fgn ori | SMS to foreign numbers. |
| BIFROST Ja ori | Já Gagnatorg search, person and company lookups. |

## Message types by domain

### Directory

| Message type | Description |
| --- | --- |
| `Help.Iceland.Get` | Returns a Markdown overview of every Iceland message type. |

### Umsjá — Þjóðskrá (national registry)

Requires Umsjá credentials and **BIFROST Umsja ori**.

| Message type | Description |
| --- | --- |
| `Iceland.NationalRegistry.Sync` | Syncs the full national registry into the local cache (full replace). |
| `Iceland.NationalRegistryCheck.Get` | Checks whether the full registry file exists and contains data. |
| `Iceland.DeltaMonthly.Sync` | Syncs the monthly delta feed into the cache (upsert by social ID). |
| `Iceland.Member.Get` | Gets a specific person or company from the registry. |
| `Iceland.Search.Get` | Search by free text, name, address or postal address. |
| `Iceland.SearchByName.Get` | Search by name. |
| `Iceland.SearchBySocialID.Get` | Search by social ID (kennitala). |
| `Iceland.Address.Get` | All members and companies registered at an address. |
| `Iceland.AddressInfo.Get` | Address information for a social ID. |
| `Iceland.Relations.Get` | Family relations and company relations by ID. |
| `Iceland.Roles.Get` | Company roles held by a person. |
| `Iceland.Parties.Get` | Company parties — board members, auditors, founders. |
| `Iceland.Stakeholders.Get` | Stakeholders of a company. |
| `Iceland.VatNumber.Get` | VAT numbers registered to a company. |
| `Iceland.Isat.Get` | The ISAT industry classification table, or the ISAT codes of one kennitala. |

### Skatturinn — VAT (virðisaukaskattur)

Requires an RSK VAT password and **BIFROST VAT ori**.

| Message type | Description |
| --- | --- |
| `Iceland.VAT.GetPeriodEntries` | Retrieves the entries of a VAT period. |
| `Iceland.VAT.Validate` | Validates a VAT statement before submission. |
| `Iceland.VAT.Submit` | Submits a VAT statement to RSK. |
| `Iceland.VAT.Correct` | Corrects a previously submitted VAT statement. |
| `Iceland.VAT.GetNumbers` | Retrieves the company's VAT numbers. |
| `Iceland.VAT.GetInfo` | Retrieves VAT registration information. |
| `Iceland.VAT.GetRSKDeclaration` | Retrieves the declaration as RSK holds it. |
| `Iceland.VAT.Receipt` | Returns the PDF receipt of a submitted period. |
| `Iceland.VAT.DeleteInTest` | Deletes a test submission. Test client type only. |

### Skatturinn — payroll tax (staðgreiðsla)

Requires an RSK payroll password and **BIFROST Payroll ori**.

| Message type | Description |
| --- | --- |
| `Iceland.Payroll.GetPeriodPrereqs` | Retrieves the rates and allowances RSK publishes for a period. |
| `Iceland.Payroll.GetAllPeriods` | Lists all payroll periods with their status. |
| `Iceland.Payroll.Validate` | Validates a payroll return against the RSK schema. |
| `Iceland.Payroll.Send` | Submits a payroll return. |
| `Iceland.Payroll.Receipt` | Returns the PDF receipt of a submitted period. |
| `Iceland.Payroll.Reopen` | Reopens a validated or submitted period for correction. |

### Skatturinn — capital income tax (fjármagnstekjuskattur)

Requires an RSK FTS password and **BIFROST CapTax ori**.

| Message type | Description |
| --- | --- |
| `Iceland.CapitalTax.Submit` | Submits a capital income tax return. |
| `Iceland.CapitalTax.GetStatus` | Checks the status of a submission. |
| `Iceland.CapitalTax.GetOverview` | Yearly overview of submissions. |
| `Iceland.CapitalTax.GetTypes` | Valid income types. |
| `Iceland.CapitalTax.GetPeriods` | Valid periods. |
| `Iceland.CapitalTax.GetSubmittablePeriods` | Periods currently open for submission. |
| `Iceland.CapitalTax.GetExemptions` | Registered exemptions. |
| `Iceland.CapitalTax.Reopen` | Reopens a submitted period for correction. |

### Business Central VAT (no external service)

| Message type | Description |
| --- | --- |
| `Finance.VATStatement.Preview` | Calculates VAT statement lines and returns the amount per box number, ready for RSK mapping. |
| `Finance.VAT.CalcAndPostSettlement` | Runs Calculate and Post VAT Settlement in Business Central. |

### Seðlabanki Íslands (Central Bank)

Public data — no credentials required.

| Message type | Description |
| --- | --- |
| `Iceland.CurrencyRates.Get` | Currency exchange rates for a date or a date range. |
| `Iceland.Currency.Sync` | Writes the rates into the Business Central Currency Exchange Rate table. |
| `Iceland.InterestRates.Get` | Policy rate and deposit/lending facility rates. |
| `Iceland.IkonRates.Get` | IKON reference interest rates (daily fixings). |
| `Iceland.InterbankRates.Get` | Interbank market rates (REIBID/REIBOR). |
| `Iceland.LoanTermRates.Get` | Fixed loan-term yields, indexed and non-indexed. |
| `Iceland.PenaltyInterest.Get` | Statutory penalty interest (dráttarvextir). |
| `Iceland.ConsumerPriceIndex.Get` | CPI index level and 12-month inflation. |
| `Iceland.ExchangeRateIndex.Get` | Trade-weighted exchange rate indices. |
| `Iceland.EconomicData.Get` | SDDS macroeconomic dataset — money supply, reserves and more. |
| `Iceland.Language.Get` | ISO 639-1 language list published alongside the bank's reference data. |

### Skilagrein

Submissions require **BIFROST Collect ori** and a per-collector password.

| Message type | Description |
| --- | --- |
| `Iceland.Collector.Get` | Downloads all collectors (innheimtuaðilar). |
| `Iceland.PensionFund.Get` | Downloads pension funds (lífeyrissjóðir). |
| `Iceland.Union.Get` | Downloads unions (stéttarfélög). |
| `Iceland.RehabFund.Get` | Downloads rehabilitation funds (endurhæfingarsjóðir). |
| `Iceland.PensionSupplement.Get` | Downloads pension supplement funds (lífeyrisaukar). |
| `Iceland.CollectorPayment.Send` | Submits a fund contribution return to a collector. |
| `Iceland.CollectorExtraAmount.Confirm` | Confirms or rejects extra charges (aukagreiðslur) raised by a previous submission. |

### island.is

Public data — no credentials required.

| Message type | Description |
| --- | --- |
| `Iceland.Kennitala.Validate` | Validates a kennitala and returns its type and derived birth date. |
| `Iceland.Vehicle.Get` | Looks a vehicle up by plate number or VIN. |
| `Iceland.Customs.Categories` | Browses the customs tariff categories. |
| `Iceland.Customs.Calculate` | Calculates the import duty for a consignment. |
| `Iceland.Customs.Units` | Returns the input units required for a tariff number. |
| `Iceland.Customs.CountryCurrencies` | Returns the country-to-currency mapping used by Icelandic customs. |

### SMS (Síminn and Nova)

| Message type | Description |
| --- | --- |
| `Iceland.SMS.Send` | Sends an SMS through the configured gateway — Síminn magnSMS (REST or SOAP) or Nova. |
| `Iceland.SMS.Status` | Queries the delivery status of a message already sent. |

### Holidays, post codes and ISO currencies

Public data — no credentials required.

| Message type | Description |
| --- | --- |
| `Iceland.Holidays.Get` | Icelandic public holidays for a year or a month. |
| `Iceland.Holidays.IsHoliday` | Checks whether one date is an Icelandic public holiday. |
| `Iceland.PostCode.Get` | The Icelandic postal code registry from Byggðastofnun. |
| `Iceland.Currency.Get` | The published ISO 4217 currency list with alphabetic and numeric codes, names, countries and minor units. |

### Já Gagnatorg (api.ja.is)

Requires the `BIFROST Ja ori` permission set and a Search or Registry API key on the [Bifrost Iceland Setup](/help/iceland/iceland-setup/) page.

| Message type | Description |
| --- | --- |
| `Help.Ja.Get` | Markdown index of the Ja Gagnatorg connector. Open to all users. |
| `Ja.Search.Query` | Free-text directory search across people, businesses and places (Símaskrá Search v6). |
| `Ja.Person.Get` | Person lookup by kennitala, or person search (Þjóðskrá, Skrá v1). |
| `Ja.Company.Get` | Business lookup by kennitala, or company search (Fyrirtækjaskrá, Skrá v1). |

## Request log

Every outbound HTTP call is written to the Bifrost Foundation request log, tagged with the service it went to: island.is, Capital Tax, VAT, PAYE, Annual Returns, Limited Tax, Tax Return Data, Skilagrein, Siminn SMS, Siminn SMS (SOAP), Nova SMS, Umsja, Sedlabanki, ISO, PostCode or Ja Gagnatorg. Passwords are masked before the request is logged; Ja Gagnatorg responses also have kennitala values redacted.
