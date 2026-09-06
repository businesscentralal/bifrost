---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts into Partner Center when creating/updating the offer listing.

---

## Offer Name
Bifrost Subscription Billing

## Search Result Summary (max 100 chars)
Run Subscription Billing end to end from an agent or API — no manual UI steps.

## Offer Summary
Bifröst Subscription Billing adds a curated set of Bifröst message types for Microsoft's Subscription Billing app. It covers exactly the operations a generic record read or write cannot perform: applying subscription packages, attaching lines to customer and vendor contracts, running the billing pipeline, previewing a billing run without writing, importing and processing usage data, releasing deferrals, rebuilding contract analysis and creating records from staged migration rows.

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

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central
- Subscription Billing (Microsoft)
- Bifrost Foundation (required dependency)

---

## Full description text

### Run Subscription Billing without the clicks

Microsoft's Subscription Billing app models recurring revenue well, but every meaningful operation in it lives behind a page action: get subscription lines onto a contract, create the contract invoice, run the billing proposal, perform the price update, import a usage file. An integration or an AI agent can read and write subscription records through a generic API, and then stops at the first button.

**Bifröst Subscription Billing** closes that gap. It publishes a curated set of Bifröst message types — one per operation that genuinely needs a codeunit, record context at insert time, a stored filter, or a preview-and-rollback run — so the whole application surface becomes callable.

### Who is this for?

**Finance teams running high-volume recurring billing.** Schedule the monthly billing proposal and document creation, and let exceptions come to you instead of working every contract by hand.

**Partners building integrations.** A stable, documented, versioned message-type surface rather than page automation that breaks on the next update.

**Teams adopting AI agents in Business Central.** Every message type ships a full help document — purpose, parameters, a worked example, the response shape and the errors it raises — so an agent can discover what it can do and call it correctly on the first attempt.

**Target industries:** professional services, software and IT services, telecommunications, media — any business billing the same customers on a recurring schedule.

### Key capabilities

- **Commitments** — create subscription lines by applying a subscription package, which a plain record insert cannot do because the package context is required up front
- **Customer and vendor contracts** — attach unassigned subscription lines to a contract and bill a contract to an unposted invoice
- **Billing pipeline** — build a billing proposal for a template and date range, then turn the proposal into documents in a bulk run
- **Preview without writing** — preview the customer, vendor and bulk billing runs. The work is performed for real so the numbers are true, then everything the preview built is removed again and nothing is left behind
- **Usage-based billing** — import a usage file as data rather than through a file dialog, and run Microsoft's processing stages over it
- **Deferrals, analysis and migration** — release deferred revenue and cost for a period, rebuild contract analysis entries, and create real subscriptions and contracts from staged import rows

### Designed to be safe

No message type deletes anything. Ending a subscription is an end date, not a hard delete. Every write runs in an isolated transaction that rolls back cleanly and returns a structured error with the failure and its call stack. Operations that post to the general ledger say so plainly in their help, and nothing posts unless you ask for it.

### Built on Bifröst Foundation

This extension requires Bifröst Foundation, which provides the message dispatcher, the request log, the change-log write guard and the permission model. Subscription Billing message types appear alongside the Foundation ones and are discovered the same way.

### Supported editions and countries

- **Editions:** Business Central Essentials and Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain
- **Languages:** English (United States), Icelandic (Iceland)

### Requirements and prerequisites

- Microsoft Dynamics 365 Business Central 28.0 or later
- Subscription Billing by Microsoft, installed and set up
- Bifrost Foundation by Origo (available separately on AppSource)
- The permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) on the calling user or service
