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
Bifrost Manufacturing

## Search Result Summary (max 100 chars)
Run production from an assistant or integration: orders, BOMs, routings, output and consumption.

## Offer Summary
Bifröst Manufacturing lets an assistant, a scheduled routine or an integration run the manufacturing work Microsoft keeps on its pages: create and refresh production orders, create orders from sales demand, certify production BOMs and routings, copy and exchange versions, check availability and statistics, move orders through their statuses, post output and consumption, and reverse a posting. It runs Business Central's own manufacturing logic, so the results appear on the standard pages.

## Search Keywords
1. Manufacturing
2. Production orders
3. Production BOM
4. Routing
5. Output and consumption

## Categories
- **Primary:** Operations and Supply Chain
- **Secondary:** Finance

## Industries
- Discrete Manufacturing
- Process Manufacturing
- Food and Beverage
- Wholesale Distribution

---

## Description

The full description text is [below](#full-description-text).

---

## Help Link
https://docs.bifrost.origo.is/en-us/manufacturing/

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central
- Bifrost Foundation (required dependency)

---

## Full description text

### Run production from the assistant you already use

Bifröst takes Business Central out to the assistant people already use. **Bifröst Manufacturing** lets that assistant, a scheduled routine or an integration do the work behind the actions of Business Central's manufacturing pages: create a production order, refresh it, move it through its statuses, post output and consumption, finish it and correct what was posted.

It runs Business Central's own manufacturing logic. The results appear on the standard pages, so you review them where you always do.

### Who is this for?

**Production planners and finance teams.** Create and refresh orders, check shortages, certify new versions of production BOMs and routings, and deal with the exceptions.

**Teams who connect an assistant or their own integration.** Each operation explains itself from Business Central: what it is for, what it needs, what it changes and what can go wrong. The assistant reads that help and does the work.

**Target industries:** discrete and process manufacturing, food and beverage, and any business that builds what it sells.

### What it does

- **Production orders** — create an order, or create orders from the demand of a released sales order. Refresh an order to calculate its lines, components and routing.
- **Statuses** — change the status of an order, check whether it can be finished, finish it, or reopen a finished order once.
- **Bills of material and routings** — certify a version, or set it under development or closed. Copy a version into a new one, and exchange a component across production BOMs.
- **Where used** — see every production BOM that uses an item, with levels and required quantities.
- **Availability and statistics** — component shortages that take reservations into account, and the cost and quantity statistics of an order.
- **Production journal** — look at the journal an order would produce, preview posting without keeping anything, and post it.
- **Corrections** — reverse a posted output or consumption entry as a whole.

### Control

The app acts as the signed-in user. Its permission sets do not widen access to manufacturing data. Changing the status of an order, finishing it, posting the production journal and reversing a posting need the separate permission set **Bifrost Manufacturing Posting** (`BIFROST MfgPost ori`).

Operations that post or cannot be undone report how many records they would affect and do nothing until that count is confirmed. If a step fails, the work is rolled back and a clear error comes back in English or Icelandic.

### Built on Bifröst Foundation

This app requires Bifröst Foundation. Manufacturing operations are discovered from Business Central the same way as the Foundation operations.

### Supported editions and countries

- **Editions:** Business Central Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain
- **Languages:** English (United States), Icelandic (Iceland)

### Requirements and prerequisites

- Microsoft Dynamics 365 Business Central Premium, with manufacturing set up
- Bifrost Foundation by Origo (available separately on AppSource)
- The permission set **Bifrost Manufacturing** (`BIFROST Mfg ori`) on the calling user or service, and **Bifrost Manufacturing Posting** (`BIFROST MfgPost ori`) for whoever may post
