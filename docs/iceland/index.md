---
id: index
title: "Bifröst Iceland"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Icelandic government services and SMS gateways as Bifröst message types: Þjóðskrá through Umsjá, Skatturinn, Seðlabanki, Skilagrein, island.is and Já Gagnatorg."
---

# Bifröst Iceland

**Business Central talks to the Icelandic services you already use.** File VAT and payroll tax,
look up people and companies, and fetch exchange rates without typing anything in twice.

Bifröst Iceland connects Business Central to Þjóðskrá through Umsjá, Skatturinn, Seðlabanki
Íslands, Skilagrein, island.is, Já Gagnatorg and the Síminn and Nova SMS gateways. A person, a
scheduled routine or an assistant can use them the same way as the rest of Bifröst.

*An add-on to [Bifröst Foundation](/foundation/) for companies in Iceland. New to Bifröst? Start
with [How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Look up a person or a company.** Search the national register (Þjóðskrá through Umsjá) by
  kennitala, name or address, see relations, roles and stakeholders, or search the Já directory.
  The register can also be kept as a local copy, refreshed monthly.
- **File tax returns to Skatturinn.** Fetch, validate, submit and correct VAT, payroll withholding
  (staðgreiðsla) and capital income tax (fjármagnstekjuskattur) returns, and get the receipt as a
  PDF. Try it against Skatturinn's test service first.
- **Prepare and close VAT in Business Central.** Preview the VAT statement per box ready for
  Skatturinn, and calculate and post the VAT settlement.
- **Get rates from Seðlabanki.** Exchange rates straight into the Business Central exchange rate
  table, plus interest rates, penalty interest, the consumer price index and other indicators.
- **Send pension and union contributions.** Keep Skilagrein master data up to date, send
  contribution returns to collectors and confirm extra charges.
- **Check details and send messages.** Validate a kennitala, look up a vehicle or customs tariff
  on island.is, check public holidays and postal codes, and send SMS through Síminn or Nova.

Run any of these on a schedule, for example a daily exchange rate update, as a playbook in
[Bifröst Orchestrator](/orchestrator/). For bank connections, see
[Bifröst Iceland Treasury](/iceland-treasury/).

## Get it

Install **Bifrost Iceland** next to Bifröst Foundation, from AppSource or through your partner. It
needs Business Central 28.0 or later, Essentials or Premium, with Microsoft's Icelandic
localisation (IS Core).

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Run Bifröst Foundation's **Bifrost Setup Wizard**: allow outgoing HTTP requests for the app and enter the credentials for the services you use. Nothing reaches an external service until HTTP is on. | Business Central administrator |
| 2 | Run **Set up Bifrost Iceland connectors** from Assisted Setup, or open **Bifrost Iceland Setup**, and choose the live or test service for each connector. | Business Central administrator |
| 3 | Enter the company kennitala in **Company Information → Registration No.** Skatturinn reads it from there. | Business Central administrator |
| 4 | For Skilagrein, set each collector's password on the **Skilagrein Collectors** page. | Business Central administrator |
| 5 | Assign permissions: `BIFROST Full ori` for full access, or the set for one service only (see the table below). | Business Central administrator |

The step-by-step guides are in the in-product help:
[Bifrost Iceland Setup](/help/iceland/iceland-setup/),
[National Registry Entries](/help/iceland/iceland-umsja-registry/) and
[Skilagrein Master Data](/help/iceland/iceland-skilagrein/).

## Good to know

- **Each service has its own permission set**, so a user can be allowed to file VAT without being
  able to send SMS or sync the register. Every call is logged on **Bifrost Messages**.
- **Credentials** are needed for Umsjá, Skatturinn, Skilagrein, SMS and Já Gagnatorg. They are
  kept in the Bifröst Foundation secret store, never shown again, and masked in the request log.
  Seðlabanki, island.is, holidays and postal codes need none.
- **Credentials do not carry over** from Origo Cloud Events Iceland. Enter them once after
  installing.
- **The national register copy is personal data.** Keep the permission sets narrow, and clear the
  copy when the company no longer has a lawful basis for holding it.

## Capabilities and reference

Capabilities: **`Iceland`** and **`Ja`**. The app also adds the `Finance.VAT*` message types to
Foundation's **`Finance`** capability. Its directories of types are `Help.Iceland.Get` and
`Help.Ja.Get`.

What each message type does, in plain words: [Capabilities](./capabilities).

- [Message type reference](./reference/message-types/): the contract of every type, generated from the app itself
- [In-product help](/help/iceland/)
- [AppSource validation scenarios](./user-scenarios) · [AppSource listing text](./listing)

### Permission sets

`BIFROST ISFull ori` is a permission set extension: it adds every Iceland object to Bifröst
Foundation's `BIFROST Full ori`, so that is the set to assign for full access. The rest gate one
service each and are assigned on their own where a caller should reach only part of the app.

| Permission set | Assignable | Covers |
| --- | --- | --- |
| `BIFROST ISFull ori` | Extension of `BIFROST Full ori` | Every Iceland object |
| `BIFROST Umsja ori` | No, included in `BIFROST ISFull ori` | Umsjá lookups and the registry cache |
| `BIFROST NatReg ori` | Yes | National registry synchronisation |
| `BIFROST VAT ori` | Yes | VAT submissions |
| `BIFROST Payroll ori` | Yes | Payroll tax submissions |
| `BIFROST CapTax ori` | Yes | Capital income tax submissions |
| `BIFROST Collect ori` | Yes | Skilagrein collector submissions |
| `BIFROST SMS ori` | Yes | SMS to Icelandic numbers |
| `BIFROST SMS Fgn ori` | Yes | SMS to foreign numbers |
| `BIFROST Ja ori` | Yes | Já Gagnatorg search, person and company lookups |
