---
id: help-iceland-get
title: "Help.Iceland.Get"
sidebar_label: "Help.Iceland.Get"
sidebar_position: 3
description: "Request and response contract for the Help.Iceland.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


71 message types across 13 service areas. All outbound, all return JSON.
Call `get_message_type_help` with any type name for exact request/response schema.

---
## 1. Holiday (no credentials)
| Type | Subject | Data | Returns |
|------|---------|------|---------|
| `Iceland.Holidays.Get` | year (`2026`) or year-month (`2026-12`) | — | Array of holidays with date, name, isHoliday, halfDay |
| `Iceland.Holidays.IsHoliday` | ISO date (`2026-12-25`) | — | isHoliday, isWorkDay, description |

Pure local computation — no HTTP call, no logging.

## 2. Island.is (no credentials)
| Type | Subject | Data | Returns |
|------|---------|------|---------|
| `Iceland.Kennitala.Validate` | 10-digit kt | — | valid, type (person/company), birthDate |
| `Iceland.Vehicle.Get` | plate or VIN | — | Vehicle record (make, model, color, CO2, mass, status) |
| `Iceland.Customs.Categories` | — | — | Full customs tariff category tree |
| `Iceland.Customs.Calculate` | — | `{"tariffNumber","currencyCode","priceWithShipping",...}` | Duty charges + totalAmount ISK |

Kennitala.Validate is local (checksum). Vehicle/Customs call island.is GraphQL API (public, no key).

## 3. ISO & PostCode (no credentials)
| Type | Returns |
|------|---------|
| `Iceland.Currency.Get` | Full ISO 4217 currency list (code, name, country, decimals) |
| `Iceland.PostCode.Get` | Icelandic postal code registry from Byggðastofnun |

## 4. Seðlabanki — Central Bank (no credentials)
| Type | Data (JSON) | Returns |
|------|-------------|---------|
| `Iceland.CurrencyRates.Get` | `{"date":"2026-07-01","rateType":"Reference\|Mid\|All"}` | Exchange rates (ISK per unit) |
| `Iceland.Currency.Sync` | `{"date":"2026-07-01"}` | Syncs rates → BC Currency + Exchange Rate tables |
| `Iceland.InterestRates.Get` | `{"date":"2026-07"}` | Policy rate, deposit/lending facilities |
| `Iceland.ExchangeRateIndex.Get` | `{"date":"2026-07"}` | Trade-weighted ISK indices |
| `Iceland.ConsumerPriceIndex.Get` | `{"date":"2026-06"}` | CPI level + 12-month inflation % |
| `Iceland.PenaltyInterest.Get` | `{"date":"2026-07"}` | Dráttarvextir (statutory penalty rate) |
| `Iceland.InterbankRates.Get` | `{"date":"2026-07"}` | REIBID/REIBOR interbank rates |
| `Iceland.LoanTermRates.Get` | `{"date":"2026-07"}` | Fixed loan-term par/annuity yields |
| `Iceland.EconomicData.Get` | `{}` (latest) or `{"date":"..."}` | SDDS macro dataset (200+ series) |
| `Iceland.IkonRates.Get` | `{"date":"2026-07-01"}` | IKON A/B reference rates |
| `Iceland.Language.Get` | `{"q":"icelandic"}` or `{}` for all | ISO 639-1 language list |

Date formats: `YYYY-MM-DD` for daily, `YYYY-MM` for monthly. Omit date for latest values.
rateType: `Reference` (10 majors), `Mid` (20 exotics), `All` (merged).

## 5. Skatturinn / VAT (requires VSK password in Bifrost Setup)
Lifecycle: `GetNumbers → GetInfo → GetPeriodEntries → Validate → Submit → Receipt`

| Type | Data | Notes |
|------|------|-------|
| `Iceland.VAT.GetNumbers` | `{"vat":{"vskNumer":"...","ar":2026,"timabil":"01"}}` | Discover VSK numbers |
| `Iceland.VAT.GetInfo` | same vat object | Period info |
| `Iceland.VAT.GetPeriodEntries` | same vat object | Period entries |
| `Iceland.VAT.Validate` | same vat object | Validates statement |
| `Iceland.VAT.Submit` | same vat object | ⚠️ Submits to RSK |
| `Iceland.VAT.Correct` | vat object + revision | ⚠️ Corrects submitted |
| `Iceland.VAT.GetRSKDeclaration` | same vat object | RSK declaration |
| `Iceland.VAT.DeleteInTest` | same vat object | Test env only |
| `Iceland.VAT.Receipt` | same vat object | PDF receipt |

## 6. Skatturinn / Payroll (requires Staðgreiðsla password)
Lifecycle: `GetAllPeriods → GetPeriodPrereqs → [create entries] → Validate → Send → Receipt`

| Type | Data | Notes |
|------|------|-------|
| `Iceland.Payroll.GetAllPeriods` | `{}` | All periods + prerequisites |
| `Iceland.Payroll.GetPeriodPrereqs` | `{"year":2026,"month":"06"}` | Rates for one period |
| `Iceland.Payroll.Validate` | `{"year":2026,"month":"06"}` | Validates entries |
| `Iceland.Payroll.Send` | `{"year":2026,"month":"06"}` | ⚠️ Submits |
| `Iceland.Payroll.Receipt` | `{"year":2026,"month":"06"}` | PDF receipt |

## 7. Skatturinn / Capital Tax (requires Staðgreiðsla password)
| Type | Data | Notes |
|------|------|-------|
| `Iceland.CapitalTax.GetTypes` | `{}` | Income type codes |
| `Iceland.CapitalTax.GetPeriods` | `{"year":2025}` | Available periods |
| `Iceland.CapitalTax.GetSubmittablePeriods` | `{"year":2025}` | Open for submission |
| `Iceland.CapitalTax.GetExemptions` | `{"tekjuar":2025,"timabil":202501}` | Tax exemptions |
| `Iceland.CapitalTax.GetOverview` | `{"year":2025}` | Submission overview |
| `Iceland.CapitalTax.Submit` | entries JSON | ⚠️ Submits |
| `Iceland.CapitalTax.GetStatus` | period ref | Check submitted status |

## 8. Skilagrein (requires collector password per collector)
| Type | Notes |
|------|-------|
| `Iceland.Collector.Get` | All collectors (innheimtuaðilar) |
| `Iceland.PensionFund.Get` | Pension funds (lífeyrissjóðir) |
| `Iceland.Union.Get` | Trade unions (stéttarfélög) |
| `Iceland.RehabFund.Get` | Rehabilitation funds (endurhæfingarsjóðir) |
| `Iceland.PensionSupplement.Get` | Pension supplements (lífeyrisaukar) |
| `Iceland.CollectorPayment.Send` | ⚠️ Submits payment to collector |
| `Iceland.CollectorExtraAmount.Confirm` | Confirm/reject extra amount (`{"refno":"...","confirm":"yes\|no"}`) |

## 9. SMS (requires Síminn or Nova credentials)
| Type | Subject | Data | Notes |
|------|---------|------|-------|
| `Iceland.SMS.Send` | phone (7 digits: 6xx/7xx/8xx) | `{"text":"...","deliveryReport":true}` | Returns messageId |
| `Iceland.SMS.Status` | messageId | — | Delivery status (DELIVERED/EXPIRED/UNDELIVERABLE) |

Unicode enabled by default (supports íéáóúðþæö). Max 70 chars/segment.

## 10. Umsja / National Registry (requires Umsja credentials)

**Lookups (immediate):**
| Type | Input | Returns |
|------|-------|---------|
| `Iceland.Member.Get` | subject=kt | Full person/company record |
| `Iceland.Search.Get` | subject=text | Free-text search results |
| `Iceland.SearchByName.Get` | subject=name | Name search |
| `Iceland.SearchBySocialID.Get` | subject=kt | Social ID search |
| `Iceland.Address.Get` | subject=kt | All members at address |
| `Iceland.AddressInfo.Get` | subject=kt | Address details |
| `Iceland.Parties.Get` | data: `{"CompanyID":"..."}` | Board, auditors, founders |
| `Iceland.Roles.Get` | data: `{"SocialID":"..."}` | Company roles held by person |
| `Iceland.Relations.Get` | subject=person kt | Family + company relations |
| `Iceland.Stakeholders.Get` | subject=company kt | Company stakeholders |
| `Iceland.VatNumber.Get` | subject=kt | VAT numbers + ISAT |
| `Iceland.Isat.Get` | subject=kt (optional) | ISAT codes or full table |
| `Iceland.NationalRegistryCheck.Get` | — | Check if registry file exists |

**Sync (use `queue_message_type`):**
| Type | Subject | Records |
|------|---------|---------|
| `Iceland.NationalRegistry.Sync` | — | ~400K (full replace, 5-10 min) |
| `Iceland.DeltaMonthly.Sync` | month (1-12) | ~30K monthly changes |

**Local table after sync:** `Umsja Registry Entry ori`
PK: Social ID. Fields: Name, Gender, Marital Status, Born Date, Address, Post Code, Record Type, Fade, Reversed.
Filter: `WHERE("Name"=FILTER(@*Origo*))`, `WHERE("Fade"=FILTER())` (active only).

---
## Agent decision tree

**"Is today a holiday?"** → `Iceland.Holidays.IsHoliday` subject=today
**"Validate this kennitala"** → `Iceland.Kennitala.Validate` subject=kt
**"Look up a person/company"** → `Iceland.Member.Get` subject=kt
**"Search by name"** → `Iceland.Search.Get` subject=text
**"Who sits on this board?"** → `Iceland.Parties.Get` data=&#123;"CompanyID":"..."&#125;
**"Get exchange rates"** → `Iceland.CurrencyRates.Get` data=&#123;"date":"...","rateType":"All"&#125;
**"Sync rates to BC"** → `Iceland.Currency.Sync` data=&#123;"date":"..."&#125;
**"Send an SMS"** → `Iceland.SMS.Send` subject=phone, data=&#123;"text":"..."&#125;
**"Sync national registry"** → `queue_message_type` type=Iceland.NationalRegistry.Sync
**"Check VAT status"** → `Iceland.VAT.GetInfo` with vat object
**"Submit payroll"** → `Iceland.Payroll.Send` data=&#123;"year":...,"month":"..."&#125;

## Request log
All HTTP calls logged to `Request Log ori`. Query via `Iceland.RequestLog.Get`.
Retention: 1 month (auto-purge via BC Retention Policy).

