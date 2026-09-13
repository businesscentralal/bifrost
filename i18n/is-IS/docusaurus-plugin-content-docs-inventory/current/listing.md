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
Bifröst Inventory

## Search Result Summary (max 50 chars)
Item eiginleikar via Bifröst messages

## Offer Summary (max 100 chars)
Get, create og updagsetning Item Attributes as Bifröst message tegunds on Foundation.

## Search Keywords
1. Item eiginleikar
2. Inventory
3. Product eiginleikar
4. Bifröst
5. Business Central integration

## Categories
- **Primary:** Operations > Supply Chain
- **Secondary:** IT & Admin Tools > Data Integration

## Industries
- Manufacturing
- Distribution
- Retail
- Professional Services

---

## Lýsing

The full description text er [below](#full-description-text).

---

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central
- Bifrost Foundation (required dependency)

---

## Full description text

**Bifröst Inventory** adds Item Attribute message tegunds to the Bifröst platform — a message-based integration layer that gives external systems, AI agents og automation tools structured access to Business Central via OData. Instead of joining Item, Item Attribute og Item Attribute Value Mapping through generic færsla APIs, callers use dedicated tegunds fyrir get, create, updagsetning og eigind definition create.

### Who er this for?

**Integration developers og AI agents** that need to read eða maintain product eiginleikar on vörur án multi-table joins. Ideal fyrir catalogue sync, PIM-style enrichment og agent-driven master-data verkþættir.

**Target industries:** manufacturing, distribution, retail — any business that classifies vörur með Business Central vara eiginleikar.

### What it does

- **Item.Attribute.Get** — outbound read of eigind definitions og assigned gildi fyrir one eða more vörur
- **Item.Attribute.Create** — inbound assign (idempotent; optional overwrite)
- **Item.Attribute.Updagsetning** — inbound change of an existing mapping með before/after
- **Item.AttributeDefinition.Create** — inbound create of an eigind definition og optional option gildi

### How it works

1. Install **Bifröst Foundation** og **Bifröst Inventory**
2. Kallaðu áers send Bifröst messages með the vara in `subject` eða `data`
3. Results return as structured JSON through the standard Bifröst data API

### Supported editions og countries

- **Editions:** Business Central Essentials og Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain

### Requirements og prerequisites

- Microsoft Dynamics 365 Business Central 28.0 eða later
- Bifrost Foundation extension by Origo (available separately on AppSource)
