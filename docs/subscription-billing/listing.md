---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts into Partner Center when creating or updating the offer listing.

---

## Offer Name
Bifrost Subscription Billing

## Search Result Summary (max 100 chars)
Run recurring billing from an assistant or integration: contracts, billing runs, usage, deferrals.

## Offer Summary
Bifröst Subscription Billing lets an assistant, a scheduled routine or an integration run the Subscription Billing work Microsoft keeps on its pages: apply a subscription package, attach lines to customer and vendor contracts, run billing, preview a run without keeping the result, import and process usage, release deferrals, update prices, rebuild contract analysis and create subscriptions from staged import rows.

## Search Keywords
1. Subscription billing
2. Recurring billing
3. Contract management
4. Usage-based billing
5. Revenue deferral

## Categories
- **Primary:** Finance
- **Secondary:** Operations and Supply Chain

## Industries
- Professional Services
- Software and IT Services
- Telecommunications
- Media

---

## Description

The full description text is [below](#full-description-text).

---

## Help Link
https://docs.bifrost.origo.is/en-us/subscription-billing/

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central
- Subscription Billing (Microsoft)
- Bifrost Foundation (required dependency)

---

## Full description text

### Run Subscription Billing from the assistant you already use

Bifröst takes Business Central out to the assistant people already use. **Bifröst Subscription Billing** lets that assistant, a scheduled routine or an integration run the work in Microsoft's **Subscription Billing** app: put subscription lines on a contract, create the contract invoice, run the billing proposal, import a usage file, release deferrals and update prices.

It runs Microsoft's own Subscription Billing logic. The results appear on the standard Subscription Billing pages, so you review them where you always do.

### Who is this for?

**Finance teams running recurring billing.** Schedule the monthly billing proposal, document creation and posting, and deal with the exceptions.

**Teams who connect an assistant or their own integration.** Each operation explains itself from Business Central: what it is for, what it needs, what it changes and what can go wrong. The assistant reads that help and does the work.

**Target industries:** professional services, software and IT services, telecommunications and media, and any business that bills the same customers on a recurring schedule.

### What it does

- **Subscriptions on contracts** — apply a subscription package, and attach its lines to a customer or vendor contract. Microsoft's rules work out the prices, billing rhythms and dates.
- **Billing** — bill one contract, or build a billing proposal for a billing template and turn it into documents in one run. Post the documents the run created, or undo a run that is not posted yet.
- **Preview** — preview what a contract or a billing run would produce, with real figures, without keeping anything.
- **Usage** — deliver a usage file as data, connect it to the subscriptions it belongs to and move it through Microsoft's processing stages. Delete imported usage data so the import can be run again.
- **Contracts kept current** — close lines that have ended, merge contract lines, remove an unbilled line, update exchange rates on foreign-currency contracts and update prices.
- **Close the period** — release deferred revenue and cost to the general ledger, rebuild contract analysis entries, extend a subscription onto a new contract, or create a renewal sales quote.
- **Move subscriptions in** — turn staged import rows into real subscriptions and contracts. Remove a subscription package's assignment to an item.

### Control

The app acts as the signed-in user. Its permission sets do not widen access to Subscription Billing data. Posting billing documents needs the separate permission set **Sub. Billing Posting** (`BIFROST SubPost ori`). A vendor invoice is posted only with the vendor's own invoice number.

Ending a subscription is an end date. An unbilled contract line can be removed, and a subscription package's assignment to an item can be removed. Posted documents are not removed. Undoing a billing run that is not posted clears that run's proposal and deletes the unposted documents the run created.

If a step fails, the work is rolled back and a clear error comes back, except in the bulk billing, usage processing and import runs, which keep what was done before the failure and say so. Deferral release posts to the general ledger for every contract, up to the work date. The date cannot be passed in from outside. Check the work date before you run it in production.

### Built on Bifröst Foundation

This app requires Bifröst Foundation. Subscription Billing operations are discovered from Business Central the same way as the Foundation operations.

### Supported editions and countries

- **Editions:** Business Central Essentials and Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain
- **Languages:** English (United States), Icelandic (Iceland)

### Requirements and prerequisites

- Microsoft Dynamics 365 Business Central, Essentials or Premium, at the version Microsoft's Subscription Billing app requires
- Subscription Billing by Microsoft, installed and set up
- Bifrost Foundation by Origo (available separately on AppSource)
- The permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) on the calling user or service, and **Sub. Billing Posting** (`BIFROST SubPost ori`) for whoever may post
