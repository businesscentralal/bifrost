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
Bifrost Iceland Treasury

## Search Result Summary (max 50 chars)
Iceland treasury in Business Central, from any AI

## Offer Summary (max 100 chars)
Treasury for Iceland in Business Central: payments, claims, statements and currency rates.

## Search Keywords
1. Iceland treasury
2. Bank reconciliation
3. Claims

## Categories
- **Primary:** Finance > Accounting
- **Secondary:** IT & Admin Tools > Data Integration

## Industries
- Professional Services
- Distribution
- Retail and Consumer Goods
- Manufacturing

## Supported Countries
- Iceland

## Supported Languages
- English (en-US)
- Icelandic (is-IS)

---

## Description

The full description text is [below](#full-description-text).

---

## Help Link
https://docs.bifrost.origo.is/en-us/iceland-treasury/

## Support Link
https://www.origo.is/

## Privacy Policy
https://docs.bifrost.origo.is/en-us/licensing/privacy/

## Terms of Use
https://docs.bifrost.origo.is/en-us/licensing/eula/

## Products your app works with
- Dynamics 365 Business Central

## Dependencies
- Bifrost Foundation (Origo), required, available separately on AppSource

---

## Full description text

**Bifrost Iceland Treasury** supports the treasury process of Icelandic companies in Business Central,
for your assistant, your integrations and your routines. It connects Business Central to the web services
of Icelandic banks and payment providers, and works the same way for each.

### What it does

- **Bring statements into bank reconciliation.** Each provider has its own bank statement import format:
  importing a statement fetches it from the provider, creates the reconciliation lines and shows a summary
  of the balances. Card transactions are imported the same way where the provider offers them.
- **Register payment batches.** Domestic and foreign payment batches, with the Central Bank category key
  each provider takes. Where the provider holds a batch for approval, a person at your company approves
  and pays it in the online bank.
- **Know when a payment is paid.** Every statement that is read or imported is checked against the open
  payments of its account, and the payments it shows are marked paid.
- **Create and follow claims (kröfur).** Create claims for customer ledger entries, change or cancel
  them, and register the payments the provider reports, so each claim shows what is paid and what is open.
- **Follow everything in Business Central.** Payment batches, payments and charges, claims, claim batches,
  claim payments and a log of every action at a provider, on read-only pages, the same for every provider.
- **More from each provider.** Depending on the provider: accounts and account verification, currency
  rates, bills and unpaid invoices, credit and corporate cards, foreign-currency accounts, portfolios,
  electronic documents and card acquiring.

### How it works

Bifrost Iceland Treasury adds operations to Bifrost Foundation. Each one is a complete task at the
provider that explains itself to the assistant: what it is for, what it needs and what it changes. Your
assistant (Copilot, ChatGPT, Claude or another) calls them through the Bifrost MCP server; integrations
and routines call them through the Bifrost API or the Bifrost queue. Every call runs with the user's own
Business Central permissions and is logged in the company.

### Control

- Bifrost does not approve payments, and a batch named for straight-through payment is refused.
- A permission set per domain, the same for every provider: payments and foreign payments are always
  given on purpose, and only an administrator with the setup permission set changes the setup.
- Passwords, certificates and API keys are kept in protected storage and never shown again. A user with a
  login of their own at a provider enters it for themselves.
- Every call to a provider is logged with the passwords masked.

### Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later (Essentials or Premium), for companies in Iceland
- Bifrost Foundation (available separately on AppSource)
- An agreement with each bank or payment provider for its web services, with the credentials and client
  certificate it issues
- For the price, contact your Business Central partner
