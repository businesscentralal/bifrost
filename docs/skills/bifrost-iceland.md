---
id: bifrost-iceland
title: "Iceland message types"
sidebar_label: "Iceland message types"
sidebar_position: 4
description: "Message types added to the Bifröst API by Bifrost Iceland. Icelandic government services and SMS gateways as Bifröst message types: Þjóðskrá through Umsjá, Skatturinn, Seðlabanki, Skilagrein, island.is and Já Gagnatorg. Load alongside bifrost-bc-integration, which carries the…"
---

Icelandic government services and SMS gateways as Bifröst message types: Þjóðskrá through Umsjá, Skatturinn, Seðlabanki, Skilagrein, island.is and Já Gagnatorg.

---

## When to load this skill

Load it together with the core skill when:

- the task involves an Icelandic statutory requirement — national registry lookups, the Icelandic chart of accounts, capital income tax, VAT reporting, payroll files or bank claim formats;
- a company number (kennitala) has to be validated or resolved to a customer, vendor or contact.

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](./bifrost-bc-integration/index.md) and are not repeated here.

---

## Hard rules

- A kennitala is not a number. Keep it as text — leading zeros are significant and the checksum digit is part of the value.
- Icelandic amounts settle in ISK, which has no minor unit. Do not assume two decimals when formatting or rounding.
- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.
- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.
- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.

---

## Reference pages

**Reference base:** `../../iceland/reference/` — every path below is relative to it.

Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.
From the deployed site the same paths resolve against this file’s own URL.

### `Iceland.*` (68)

| Message type | Page |
| --- | --- |
| `Iceland.Address.Get` | `message-types/iceland-address-get/` |
| `Iceland.AddressInfo.Get` | `message-types/iceland-addressinfo-get/` |
| `Iceland.CapitalTax.GetExemptions` | `message-types/iceland-capitaltax-getexemptions/` |
| `Iceland.CapitalTax.GetOverview` | `message-types/iceland-capitaltax-getoverview/` |
| `Iceland.CapitalTax.GetPeriods` | `message-types/iceland-capitaltax-getperiods/` |
| `Iceland.CapitalTax.GetStatus` | `message-types/iceland-capitaltax-getstatus/` |
| `Iceland.CapitalTax.GetSubmittablePeriods` | `message-types/iceland-capitaltax-getsubmittableperiods/` |
| `Iceland.CapitalTax.GetTypes` | `message-types/iceland-capitaltax-gettypes/` |
| `Iceland.CapitalTax.Reopen` | `message-types/iceland-capitaltax-reopen/` |
| `Iceland.CapitalTax.Submit` | `message-types/iceland-capitaltax-submit/` |
| `Iceland.Collector.Get` | `message-types/iceland-collector-get/` |
| `Iceland.CollectorExtraAmount.Confirm` | `message-types/iceland-collectorextraamount-confirm/` |
| `Iceland.CollectorPayment.Send` | `message-types/iceland-collectorpayment-send/` |
| `Iceland.ConsumerPriceIndex.Get` | `message-types/iceland-consumerpriceindex-get/` |
| `Iceland.Currency.Get` | `message-types/iceland-currency-get/` |
| `Iceland.Currency.Sync` | `message-types/iceland-currency-sync/` |
| `Iceland.CurrencyRates.Get` | `message-types/iceland-currencyrates-get/` |
| `Iceland.Customs.Calculate` | `message-types/iceland-customs-calculate/` |
| `Iceland.Customs.Categories` | `message-types/iceland-customs-categories/` |
| `Iceland.Customs.CountryCurrencies` | `message-types/iceland-customs-countrycurrencies/` |
| `Iceland.Customs.Units` | `message-types/iceland-customs-units/` |
| `Iceland.DeltaMonthly.Sync` | `message-types/iceland-deltamonthly-sync/` |
| `Iceland.EconomicData.Get` | `message-types/iceland-economicdata-get/` |
| `Iceland.ExchangeRateIndex.Get` | `message-types/iceland-exchangerateindex-get/` |
| `Iceland.Holidays.Get` | `message-types/iceland-holidays-get/` |
| `Iceland.Holidays.IsHoliday` | `message-types/iceland-holidays-isholiday/` |
| `Iceland.IkonRates.Get` | `message-types/iceland-ikonrates-get/` |
| `Iceland.InterbankRates.Get` | `message-types/iceland-interbankrates-get/` |
| `Iceland.InterestRates.Get` | `message-types/iceland-interestrates-get/` |
| `Iceland.Isat.Get` | `message-types/iceland-isat-get/` |
| `Iceland.Kennitala.Validate` | `message-types/iceland-kennitala-validate/` |
| `Iceland.Language.Get` | `message-types/iceland-language-get/` |
| `Iceland.LoanTermRates.Get` | `message-types/iceland-loantermrates-get/` |
| `Iceland.Member.Get` | `message-types/iceland-member-get/` |
| `Iceland.NationalRegistry.Sync` | `message-types/iceland-nationalregistry-sync/` |
| `Iceland.NationalRegistryCheck.Get` | `message-types/iceland-nationalregistrycheck-get/` |
| `Iceland.Parties.Get` | `message-types/iceland-parties-get/` |
| `Iceland.Payroll.GetAllPeriods` | `message-types/iceland-payroll-getallperiods/` |
| `Iceland.Payroll.GetPeriodPrereqs` | `message-types/iceland-payroll-getperiodprereqs/` |
| `Iceland.Payroll.Receipt` | `message-types/iceland-payroll-receipt/` |
| `Iceland.Payroll.Reopen` | `message-types/iceland-payroll-reopen/` |
| `Iceland.Payroll.Send` | `message-types/iceland-payroll-send/` |
| `Iceland.Payroll.Validate` | `message-types/iceland-payroll-validate/` |
| `Iceland.PenaltyInterest.Get` | `message-types/iceland-penaltyinterest-get/` |
| `Iceland.PensionFund.Get` | `message-types/iceland-pensionfund-get/` |
| `Iceland.PensionSupplement.Get` | `message-types/iceland-pensionsupplement-get/` |
| `Iceland.PostCode.Get` | `message-types/iceland-postcode-get/` |
| `Iceland.RehabFund.Get` | `message-types/iceland-rehabfund-get/` |
| `Iceland.Relations.Get` | `message-types/iceland-relations-get/` |
| `Iceland.Roles.Get` | `message-types/iceland-roles-get/` |
| `Iceland.Search.Get` | `message-types/iceland-search-get/` |
| `Iceland.SearchByName.Get` | `message-types/iceland-searchbyname-get/` |
| `Iceland.SearchBySocialID.Get` | `message-types/iceland-searchbysocialid-get/` |
| `Iceland.SMS.Send` | `message-types/iceland-sms-send/` |
| `Iceland.SMS.Status` | `message-types/iceland-sms-status/` |
| `Iceland.Stakeholders.Get` | `message-types/iceland-stakeholders-get/` |
| `Iceland.Union.Get` | `message-types/iceland-union-get/` |
| `Iceland.VAT.Correct` | `message-types/iceland-vat-correct/` |
| `Iceland.VAT.DeleteInTest` | `message-types/iceland-vat-deleteintest/` |
| `Iceland.VAT.GetInfo` | `message-types/iceland-vat-getinfo/` |
| `Iceland.VAT.GetNumbers` | `message-types/iceland-vat-getnumbers/` |
| `Iceland.VAT.GetPeriodEntries` | `message-types/iceland-vat-getperiodentries/` |
| `Iceland.VAT.GetRSKDeclaration` | `message-types/iceland-vat-getrskdeclaration/` |
| `Iceland.VAT.Receipt` | `message-types/iceland-vat-receipt/` |
| `Iceland.VAT.Submit` | `message-types/iceland-vat-submit/` |
| `Iceland.VAT.Validate` | `message-types/iceland-vat-validate/` |
| `Iceland.VatNumber.Get` | `message-types/iceland-vatnumber-get/` |
| `Iceland.Vehicle.Get` | `message-types/iceland-vehicle-get/` |

### `Ja.*` (3)

| Message type | Page |
| --- | --- |
| `Ja.Company.Get` | `message-types/ja-company-get/` |
| `Ja.Person.Get` | `message-types/ja-person-get/` |
| `Ja.Search.Query` | `message-types/ja-search-query/` |

### `Finance.*` (2)

| Message type | Page |
| --- | --- |
| `Finance.VAT.CalcAndPostSettlement` | `message-types/finance-vat-calcandpostsettlement/` |
| `Finance.VATStatement.Preview` | `message-types/finance-vatstatement-preview/` |

### `Help.*` (2)

| Message type | Page |
| --- | --- |
| `Help.Iceland.Get` | `message-types/help-iceland-get/` |
| `Help.Ja.Get` | `message-types/help-ja-get/` |

---

## Related skills

- [bifrost-bc-integration](./bifrost-bc-integration/index.md) — the API itself. Always load this one.
- [bifrost-foundation](./bifrost-foundation.md) — Bifrost Foundation
- [bifrost-iceland-treasury](./bifrost-iceland-treasury.md) — Bifrost Iceland Treasury
- [bifrost-iceland-docex](./bifrost-iceland-docex.md) — Bifrost Iceland DocEx
- [bifrost-bragi](./bifrost-bragi.md) — Bifrost Bragi
- [bifrost-hnitbjorg](./bifrost-hnitbjorg.md) — Bifrost Hnitbjorg
- [bifrost-nornir](./bifrost-nornir.md) — Bifrost Nornir
- [bifrost-clockify](./bifrost-clockify.md) — Bifrost Clockify
- [bifrost-subscription-billing](./bifrost-subscription-billing.md) — Bifrost Subscription Billing
## Loading this skill

An agent loads the skill file itself: [SKILL.md](pathname:///skills/bifrost-iceland/SKILL.md).
It is an index: what the app adds, when to load it, and the path of every reference page.

<details>
<summary>The description an agent matches this skill against</summary>

Message types added to the Bifröst API by Bifrost Iceland. Icelandic government services and SMS gateways as Bifröst message types: Þjóðskrá through Umsjá, Skatturinn, Seðlabanki, Skilagrein, island.is and Já Gagnatorg. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index of what Iceland adds — 75 message types across 4 families (Iceland.*, Ja.*, Finance.*, Help.*).

</details>
