---
id: index
title: "Bifröst Subscription Billing"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Microsoft's Subscription Billing app made callable — contracts, the billing run, usage data, deferrals and migration."
---

# Bifröst Subscription Billing

**Run recurring billing without clicking through every contract.** Bifröst Subscription Billing lets
an integration, a scheduled routine or an assistant do the work that sits behind the action buttons
in Microsoft's **Subscription Billing** app.

It runs Microsoft's own Subscription Billing logic. Where Microsoft offers a step only behind a page,
the app carries Microsoft's code for that step. The results appear in the standard Subscription
Billing pages, so you review them where you always do.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Put subscriptions on contracts.** Apply a subscription package to a subscription, and attach
  its lines to a customer or vendor contract. Microsoft's own rules work out the prices, billing
  rhythms and dates.
- **Bill a contract or a whole run.** Bill one contract, or build a billing proposal for a billing
  template and turn it into documents in one run. Post the documents the run created, or undo a run
  that is not posted yet: clear the proposal and delete its documents.
- **See the result before you bill.** Preview what a contract or a billing run would produce, with
  real figures, without keeping anything.
- **Bill for usage.** Deliver a usage file as data, connect it to the subscriptions it belongs to and
  move it through Microsoft's processing stages.
- **Keep contracts current.** Close lines that have ended, merge contract lines, remove a line,
  update exchange rates on foreign-currency contracts and update prices.
- **Close the period.** Release deferred revenue and cost to the general ledger, rebuild contract
  analysis entries, extend a subscription onto a new contract, or create a renewal sales quote.
- **Move subscriptions in.** Turn staged import rows into real subscriptions and contracts.

Schedule the monthly billing proposal, document creation and posting from your own routine or
automation, and deal only with the exceptions.

## Capabilities

| Domain | Capabilities |
|---|---|
| **Subscription** | Contracts and their lines, the billing run from proposal to posting, usage billing, price updates, renewals, deferrals, contract analysis and migration of subscriptions |

## Get it

Install **Bifrost Subscription Billing** next to Bifröst Foundation, from [AppSource](https://marketplace.microsoft.com/en-US/product/dynamics-365-business-central/PUBID.origo%7CAID.origo_bifrost_subscription_billing%7CPAPPID.dd7b8bd8-f93e-4ac4-a251-1a132a14ef3d) or through your
Business Central partner. It needs Business Central 28.3 or later, Essentials or Premium, and
Microsoft's **Subscription Billing** app installed and set up. For the price, contact your Business
Central partner.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Install Microsoft's **Subscription Billing** app and run its assisted setup, so Subscription Contract Setup, number series and at least one Billing Template exist. | Business Central administrator |
| 2 | Complete the posting setup Subscription Billing needs before billing and deferrals can post: General Posting Setup, VAT Posting Setup, Source Code Setup and the deferral release journal. | Business Central administrator or partner |
| 3 | Install **Bifrost Subscription Billing** next to Bifröst Foundation. | Business Central administrator |
| 4 | Give each user or service that calls it the **Bifrost Sub. Billing** (`BIFROST SubBil ori`) permission set, next to their Foundation permissions. Add **Sub. Billing Posting** (`BIFROST SubPost ori`) only for those who may post billing documents. | Business Central administrator |

The app has no pages of its own: its results appear in the standard Subscription Billing pages.

## Good to know

- **It acts as you.** The permission sets let a user run this app's operations only. They do not
  widen access to Subscription Billing data; the user's own permissions still apply.
- **Posting is a separate permission.** Posting billing documents needs `BIFROST SubPost ori` on top
  of the billing permission set, so creating documents and posting them can be given to different
  people. A vendor invoice is posted only with the vendor's own invoice number.
- **Undo only before posting.** A billing run's proposal and documents can be removed while nothing
  is posted. A posted invoice is cancelled or corrected with the standard Business Central actions.
- **Changing a contract's currency happens on the contract.** An assistant cannot change the
  currency of a subscription contract through the general data operations; it updates the exchange
  rates on the contract's lines instead.
- **Deferral release posts to the general ledger, for every contract, up to the work date.** The
  date cannot be passed in from outside. Check the work date before you run it in production.
- **If a step fails,** the work is rolled back and a clear error comes back, except in the bulk
  billing, usage processing and import runs, which keep what was done before the failure and say so.
  Everything runs inside Business Central; no external service or credential is involved.

## Reference

The installed message types and their contracts are read from Business Central itself: the MCP
tools `list_domains`, `describe_domains` and `describe_message_type`, or the **Bifrost Message Types** page.

- Permission sets: **Bifrost Sub. Billing** (`BIFROST SubBil ori`) and **Sub. Billing Posting** (`BIFROST SubPost ori`), on top of the caller's Foundation permissions.
