---
id: index
title: "Bifröst Subscription Billing"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Microsoft's Subscription Billing app made callable — 22 Bifröst message types for contracts, the billing pipeline, usage data, deferrals and migration."
---

# Bifröst Subscription Billing

**Run recurring billing without clicking through every contract.** Bifröst Subscription Billing lets
an integration, a scheduled routine or an assistant do the work that sits behind the action buttons
in Microsoft's **Subscription Billing** app.

It calls Microsoft's own Subscription Billing logic and reimplements none of it. The results appear
in the standard Subscription Billing pages, so you review them where you always do.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Put subscriptions on contracts.** Apply a subscription package to a subscription, and attach
  its lines to a customer or vendor contract. Microsoft's own rules work out the prices, billing
  rhythms and dates.
- **Bill a contract or a whole run.** Bill one contract to an unposted invoice, or build a billing
  proposal for a billing template and turn it into documents in one run.
- **See the result before you bill.** Preview what a contract or a billing run would produce, with
  real figures, without keeping anything.
- **Bill for usage.** Deliver a usage file as data and move it through Microsoft's processing
  stages.
- **Close the period.** Release deferred revenue and cost to the general ledger, rebuild contract
  analysis entries, extend a subscription onto a new contract, or create a renewal sales quote.
- **Move subscriptions in.** Turn staged import rows into real subscriptions and contracts.

Schedule the monthly billing proposal and document creation as a playbook in
[Bifröst Orchestrator](/orchestrator/), and deal only with the exceptions.

## Get it

Install **Bifrost Subscription Billing** next to Bifröst Foundation, from AppSource or through your
partner. It needs Business Central 28.0 or later, Essentials or Premium, and Microsoft's
**Subscription Billing** app installed and set up.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Install Microsoft's **Subscription Billing** app and run its assisted setup, so Subscription Contract Setup, number series and at least one Billing Template exist. | Business Central administrator |
| 2 | Complete the posting setup Subscription Billing needs before billing and deferrals can post: General Posting Setup, VAT Posting Setup, Source Code Setup and the deferral release journal. | Business Central administrator or partner |
| 3 | Install **Bifrost Subscription Billing** next to Bifröst Foundation. | Business Central administrator |
| 4 | Give each user or service that calls it the **Bifrost Sub. Billing** (`BIFROST SubBil ori`) permission set, next to their Foundation permissions. | Business Central administrator |

The app has no pages of its own. The in-product help explains where its results appear:
[Bifröst Subscription Billing help](/help/subscription-billing/).

## Good to know

- **It acts as you.** The permission set lets a user run this app's operations only. It
  does not widen access to Subscription Billing data; the user's own permissions still apply.
- **Nothing is deleted.** Ending a subscription is an end date or a closed flag. If a step fails,
  the work is rolled back and a clear error comes back, except in the bulk billing, usage
  processing and import runs, which keep what was done before the failure and say so.
- **Some operations are not available yet.** Updating contract line dates, updating exchange rates
  and the price update proposal and run are listed but return an error, because Microsoft has not
  made the underlying function public. Use the matching action in Business Central instead.
- **Deferral release posts to the general ledger, for every contract, up to the work date.** The
  date cannot be passed in from outside. Check the work date before you run it in production.
- **A contract is billed once until its last document is posted.** Vendor invoices are always
  created unposted, and no external service or credential is involved: everything runs inside
  Business Central.

## Capabilities and reference

Capability: **`Subscription`**.

What each message type does, in plain words: [Capabilities](./capabilities).

- [Message type reference](./reference/message-types/): the contract of every type, generated from the app itself
- [Message type guide](./message-types): the shared request and response contract, and the limitations in full
- [In-product help](/help/subscription-billing/)
- [AppSource validation scenarios](./user-scenarios) · [AppSource listing text](./listing)
- Permission set: **Bifrost Sub. Billing** (`BIFROST SubBil ori`), on top of the caller's Foundation permissions.
