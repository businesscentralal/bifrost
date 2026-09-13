---
id: help-iceland-get
title: "Help.Iceland.Get"
sidebar_label: "Help.Iceland.Get"
sidebar_position: 3
description: "Beiðni- og svarsamningur fyrir Help.Iceland.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


71 message types across 13 service areas. Allt outbound, Allt return JSON.
Kallaðu á `get_message_type_help` með any Gerð Heiti fyrir exact Beiðni/Svar schema.

---
## 1. Holiday (no credentials)
| Gerð | Subject | Data | Skilar |
|------|---------|------|---------|
| `Iceland.Holidays.Get` | year (`2026`) eða year-month (`2026-12`) | — | Array of holidays með date, Heiti, isHoliday, halfDay |
| `Iceland.Holidays.IsHoliday` | ISO date (`2026-12-25`) | — | isHoliday, isWorkDay, Lýsing |

Pure local computation — no HTTP Kallaðu á, no logging.

## 2. Island.er (no credentials)
| Gerð | Subject | Data | Skilar |
|------|---------|------|---------|
| `Iceland.Kennitala.Validate` | 10-digit kt | — | valid, Gerð (person/fyrirtæki), birthDate |
| `Iceland.Vehicle.Get` | plate eða VIN | — | Vehicle færsla (make, model, color, CO2, mass, status) |
| `Iceland.Customs.Categories` | — | — | fulla customs tariff category tree |
| `Iceland.Customs.Calculate` | — | `{"tariffNumber","currencyCode","priceWithShipping",...}` | Duty charges + totalAmount ISK |

Kennitala.Validate er local (checksum). Vehicle/Customs Kallaðu á island.er GraphQL API (public, no key).

## 3. ISO & PostCode (no credentials)
| Gerð | Skilar |
|------|---------|
| `Iceland.Currency.Get` | fulla ISO 4217 currency Listi (code, Heiti, country, decimals) |
| `Iceland.PostCode.Get` | Icelandic postal code registry frá Byggðastofnun |

## 4. Seðlabanki — Central Bank (no credentials)
| Gerð | Data (JSON) | Skilar |
|------|-------------|---------|
| `Iceland.CurrencyRates.Get` | `{"date":"2026-07-01","rateType":"Reference\|Mid\|All"}` | Exchange rates (ISK per unit) |
| `Iceland.Currency.Sync` | `{"date":"2026-07-01"}` | Syncs rates → BC Currency + Exchange Rate tables |
| `Iceland.InterestRates.Get` | `{"date":"2026-07"}` | Policy rate, deposit/lending facilities |
| `Iceland.ExchangeRateIndex.Get` | `{"date":"2026-07"}` | Trade-weighted ISK indices |
| `Iceland.ConsumerPriceIndex.Get` | `{"date":"2026-06"}` | CPI level + 12-month inflation % |
| `Iceland.PenaltyInterest.Get` | `{"date":"2026-07"}` | Dráttarvextir (statutory penalty rate) |
| `Iceland.InterbankRates.Get` | `{"date":"2026-07"}` | REIBID/REIBOR interbank rates |
| `Iceland.LoanTermRates.Get` | `{"date":"2026-07"}` | Fixed loan-term par/annuity yields |
| `Iceland.EconomicData.Get` | `{}` (latest) eða `{"date":"..."}` | SDDS macro dataset (200+ series) |
| `Iceland.IkonRates.Get` | `{"date":"2026-07-01"}` | IKON A/B reference rates |
| `Iceland.Language.Get` | `{"q":"icelandic"}` eða `{}` fyrir Allt | ISO 639-1 language Listi |

Date formats: `YYYY-MM-DD` fyrir daily, `YYYY-MM` fyrir monthly. Omit date fyrir latest values.
rateType: `Reference` (10 majors), `Mid` (20 exotics), `All` (merged).

## 5. Skatturinn / VAT (requires VSK password in Bifrost Setup)
Lifecycle: `GetNumbers → GetInfo → GetPeriodEntries → Validate → Submit → Receipt`

| Gerð | Data | Notes |
|------|------|-------|
| `Iceland.VAT.GetNumbers` | `{"vat":{"vskNumer":"...","ar":2026,"timabil":"01"}}` | Discover VSK numbers |
| `Iceland.VAT.GetInfo` | same vat object | Period info |
| `Iceland.VAT.GetPeriodEntries` | same vat object | Period entries |
| `Iceland.VAT.Validate` | same vat object | Staðfestir statement |
| `Iceland.VAT.Submit` | same vat object | ⚠️ Sendir til RSK |
| `Iceland.VAT.Correct` | vat object + revision | ⚠️ Corrects submitted |
| `Iceland.VAT.GetRSKDeclaration` | same vat object | RSK declaration |
| `Iceland.VAT.DeleteInTest` | same vat object | Test env Aðeins |
| `Iceland.VAT.Receipt` | same vat object | PDF receipt |

## 6. Skatturinn / Payroll (requires Staðgreiðsla password)
Lifecycle: `GetAllPeriods → GetPeriodPrereqs → [create entries] → Validate → Send → Receipt`

| Gerð | Data | Notes |
|------|------|-------|
| `Iceland.Payroll.GetAllPeriods` | `{}` | Allt periods + prerequisites |
| `Iceland.Payroll.GetPeriodPrereqs` | `{"year":2026,"month":"06"}` | Rates fyrir one period |
| `Iceland.Payroll.Validate` | `{"year":2026,"month":"06"}` | Staðfestir entries |
| `Iceland.Payroll.Send` | `{"year":2026,"month":"06"}` | ⚠️ Sendir |
| `Iceland.Payroll.Receipt` | `{"year":2026,"month":"06"}` | PDF receipt |

## 7. Skatturinn / Capital Tax (requires Staðgreiðsla password)
| Gerð | Data | Notes |
|------|------|-------|
| `Iceland.CapitalTax.GetTypes` | `{}` | Income Gerð codes |
| `Iceland.CapitalTax.GetPeriods` | `{"year":2025}` | Available periods |
| `Iceland.CapitalTax.GetSubmittablePeriods` | `{"year":2025}` | Open fyrir submission |
| `Iceland.CapitalTax.GetExemptions` | `{"tekjuar":2025,"timabil":202501}` | Tax exemptions |
| `Iceland.CapitalTax.GetOverview` | `{"year":2025}` | Submission Yfirlit |
| `Iceland.CapitalTax.Submit` | entries JSON | ⚠️ Sendir |
| `Iceland.CapitalTax.GetStatus` | period ref | Check submitted status |

## 8. Skilagrein (requires collector password per collector)
| Gerð | Notes |
|------|-------|
| `Iceland.Collector.Get` | Allt collectors (innheimtuaðilar) |
| `Iceland.PensionFund.Get` | Pension funds (lífeyrissjóðir) |
| `Iceland.Union.Get` | Trade unions (stéttarfélög) |
| `Iceland.RehabFund.Get` | Rehabilitation funds (endurhæfingarsjóðir) |
| `Iceland.PensionSupplement.Get` | Pension supplements (lífeyrisaukar) |
| `Iceland.CollectorPayment.Send` | ⚠️ Sendir greiðsla til collector |
| `Iceland.CollectorExtraAmount.Confirm` | Confirm/reject extra amount (`{"refno":"...","confirm":"yes\|no"}`) |

## 9. SMS (requires Síminn eða Nova credentials)
| Gerð | Subject | Data | Notes |
|------|---------|------|-------|
| `Iceland.SMS.Send` | phone (7 digits: 6xx/7xx/8xx) | `{"text":"...","deliveryReport":true}` | Skilar messageId |
| `Iceland.SMS.Status` | messageId | — | Delivery status (DELIVERED/EXPIRED/UNDELIVERABLE) |

Unicode enabled by default (supports íéáóúðþæö). Max 70 chars/segment.

## 10. Umsja / National Registry (requires Umsja credentials)

**Lookups (immediate):**
| Gerð | Input | Skilar |
|------|-------|---------|
| `Iceland.Member.Get` | subject=kt | fulla person/fyrirtæki færsla |
| `Iceland.Search.Get` | subject=text | Free-text search results |
| `Iceland.SearchByName.Get` | subject=Heiti | Heiti search |
| `Iceland.SearchBySocialID.Get` | subject=kt | Social ID search |
| `Iceland.Address.Get` | subject=kt | Allt members at address |
| `Iceland.AddressInfo.Get` | subject=kt | Address details |
| `Iceland.Parties.Get` | data: `{"CompanyID":"..."}` | Board, auditors, founders |
| `Iceland.Roles.Get` | data: `{"SocialID":"..."}` | fyrirtæki roles held by person |
| `Iceland.Relations.Get` | subject=person kt | Family + fyrirtæki relations |
| `Iceland.Stakeholders.Get` | subject=fyrirtæki kt | fyrirtæki stakeholders |
| `Iceland.VatNumber.Get` | subject=kt | VAT numbers + ISAT |
| `Iceland.Isat.Get` | subject=kt (valfrjálst) | ISAT codes eða fulla table |
| `Iceland.NationalRegistryCheck.Get` | — | Check Ef registry file exists |

**Sync (Notaðu `queue_message_type`):**
| Gerð | Subject | færslur |
|------|---------|---------|
| `Iceland.NationalRegistry.Sync` | — | ~400K (fulla replace, 5-10 min) |
| `Iceland.DeltaMonthly.Sync` | month (1-12) | ~30K monthly changes |

**Local table eftir sync:** `Umsja Registry Entry ori`
PK: Social ID. Fields: Heiti, Gender, Marital Status, Born Date, Address, Post Code, færsla Gerð, Fade, Reversed.
Filter: `WHERE("Name"=FILTER(@*Origo*))`, `WHERE("Fade"=FILTER())` (active Aðeins).

---
## Agent decision tree

**"er today a holiday?"** → `Iceland.Holidays.IsHoliday` subject=today
**"Validate this kennitala"** → `Iceland.Kennitala.Validate` subject=kt
**"Look up a person/fyrirtæki"** → `Iceland.Member.Get` subject=kt
**"Search by Heiti"** → `Iceland.Search.Get` subject=text
**"Who sits on this board?"** → `Iceland.Parties.Get` data=&#123;"CompanyID":"..."&#125;
**"Sækja exchange rates"** → `Iceland.CurrencyRates.Get` data=&#123;"date":"...","rateType":"Allt"&#125;
**"Sync rates til BC"** → `Iceland.Currency.Sync` data=&#123;"date":"..."&#125;
**"Send an SMS"** → `Iceland.SMS.Send` subject=phone, data=&#123;"text":"..."&#125;
**"Sync national registry"** → `queue_message_type` Gerð=Iceland.NationalRegistry.Sync
**"Check VAT status"** → `Iceland.VAT.GetInfo` með vat object
**"Submit payroll"** → `Iceland.Payroll.Send` data=&#123;"year":...,"month":"..."&#125;

## Beiðni log
Allt HTTP calls logged til `Request Log ori`. Fyrirspurn via `Iceland.RequestLog.Get`.
Retention: 1 month (auto-purge via BC Retention Policy).


