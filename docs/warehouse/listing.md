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
Bifröst Warehouse

## Search Result Summary (max 50 chars)
Warehouse documents via Bifröst messages

## Offer Summary (max 100 chars)
Create, post and preview warehouse shipments, receipts, picks and put-aways as Bifröst messages.

## Search Keywords
1. Warehouse
2. Warehouse shipment
3. Pick and put-away
4. Bifröst
5. Business Central integration

## Categories
- **Primary:** Operations > Supply Chain
- **Secondary:** IT & Admin Tools > Data Integration

## Industries
- Distribution
- Manufacturing
- Retail

---

## Description

The full description text is [below](#full-description-text).

---

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central
- Bifrost Foundation (required dependency)

---

## Full description text

**Bifröst Warehouse** adds warehouse message types to the Bifröst platform — a message-based integration layer that gives external systems, AI agents and automation tools structured access to Business Central. Instead of driving the warehouse pages by hand, callers create, register and post warehouse documents with dedicated message types and get structured JSON back.

### Who is this for?

**Integration developers and AI agents** that run the warehouse flow from outside Business Central: a web store that releases orders and ships them, a scanner app that registers picks and put-aways, or an agent that receives purchase orders.

**Target industries:** distribution, manufacturing and retail — any business that uses warehouse shipments, receipts, picks or put-aways in Business Central.

### What it does

- **Warehouse.Shipment.Create / Post / PreviewPost** — create warehouse shipments from released source documents, post them (optionally with the invoice) and preview the posting
- **Warehouse.Receipt.Create / Post / Post.Preview** — create warehouse receipts from released source documents, post them and preview the posting
- **Warehouse.Pick.Create / Register** — create a pick from a warehouse shipment and register it
- **Warehouse.Putaway.Create / Register** — create or return the put-away for a posted receipt and register it

### How it works

1. Install **Bifröst Foundation** and **Bifröst Warehouse**
2. Callers send Bifröst messages with the document in `subject` or `data`
3. Posting and registering are guarded by Bifröst's posting permission sets
4. Results return as structured JSON through the standard Bifröst data API

### Supported editions and countries

- **Editions:** Business Central Essentials and Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain

### Requirements and prerequisites

- Microsoft Dynamics 365 Business Central 28.0 or later
- Bifrost Foundation extension by Origo (available separately on AppSource)
