---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts í Partner Center þegar creating/updating the offer listing.

---

## Offer Name
Bifrost Subscription Billing

## Search Result Summary (max 100 chars)
Run Subscription Billing end to end úr an agent eða API — no manual UI steps.

## Offer Summary
Bifröst Subscription Billing adds a curated set of Bifröst message tegunds fyrir Microsoft's Subscription Billing app. It covers exactly the operations a generic færsla read eða write geturnot perform: applying subscription packages, attaching línur to viðskiptavinur og vendor samningar, running the billing pipelína, previewing a billing run án writing, importing og processing usage data, releasing deferrals, rebuilding samningur analysis og creating færslur úr staged migration rows.

## Search Keywords
1. Subscription billing
2. Recurring billing
3. Contract management
4. Usage-based billing
5. Revenue deferral

## Categories
- **Primary:** Finance
- **Secondary:** Operations og Supply Chain

## Industries
- Professional Services
- Software og IT Services
- Telecommunications
- Media

---

## Lýsing

The full description text er [below](#full-description-text).

---

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central
- Subscription Billing (Microsoft)
- Bifrost Foundation (required dependency)

---

## Full description text

### Run Subscription Billing án the clicks

Microsoft's Subscription Billing app models recurring revenue well, but every meaningful operation in it lives behind a page action: get subscription línur onto a samningur, create the samningur reikningur, run the billing proposal, perform the price updagsetning, import a usage skrá. An integration eða an AI agent getur read og write subscription færslur through a generic API, og then stops at the first button.

**Bifröst Subscription Billing** closes that gap. It publishes a curated set of Bifröst message tegunds — one per operation that genuinely needs a kóðiunit, færsla context at insert time, a stored filter, eða a preview-and-rollback run — so the whole application surface becomes callable.

### Who er this for?

**Finance teams running high-volume recurring billing.** Schedule the monthly billing proposal og skjal creation, og let exceptions come to you instead of working every samningur by hand.

**Partners building integrations.** A stable, skjaled, versioned message-tegund surface rather than page automation that breaks on the next updagsetning.

**Teams adopting AI agents in Business Central.** Every message tegund ships a full help skjal — purpose, parameters, a worked example, the response shape og the villur it raises — so an agent getur discover what it getur do og call it correctly on the first attempt.

**Target industries:** professional services, software og IT services, telecommunications, media — any business billing the same viðskiptavinir on a recurring schedule.

### Key capabilities

- **Commitments** — create subscription línur by applying a subscription package, which a plain færsla insert geturnot do because the package context er required up front
- **Customer og vendor samningar** — attach unassigned subscription línur to a samningur og bill a samningur to an unposted reikningur
- **Billing pipelína** — build a billing proposal fyrir a template og dagsetning range, then turn the proposal í skjöl in a bulk run
- **Preview án writing** — preview the viðskiptavinur, vendor og bulk billing runs. The work er performed fyrir real so the numbers eru true, then everything the preview built er removed again og nothing er left behind
- **Usage-based billing** — import a usage skrá as data rather than through a skrá dialog, og run Microsoft's processing stages over it
- **Deferrals, analysis og migration** — release deferred revenue og cost fyrir a period, rebuild samningur analysis entries, og create real subscriptions og samningar úr staged import rows

### Designed to be safe

No message tegund deletes anything. Ending a subscription er an end dagsetning, not a hard delete. Every write runs in an isolated transaction that rolls back cleanly og returns a structured villa með the failure og its call stack. Operations that post to the general ledger say so plainly in their help, og nothing posts unless you ask fyrir it.

### Built on Bifröst Foundation

This extension requires Bifröst Foundation, which provides the message dispatcher, the request log, the change-log write guard og the permission model. Subscription Billing message tegunds appear alongside the Foundation ones og eru discovered the same way.

### Supported editions og countries

- **Editions:** Business Central Essentials og Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain
- **Languages:** English (United States), Icelandic (Iceland)

### Requirements og prerequisites

- Microsoft Dynamics 365 Business Central 28.0 eða later
- Subscription Billing by Microsoft, installed og set up
- Bifrost Foundation by Origo (available separately on AppSource)
- The permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) on the calling notandi eða service
