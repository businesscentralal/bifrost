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
Bifröst Inventory

## Search Result Summary (max 50 chars)
Item attributes via Bifröst messages

## Offer Summary (max 100 chars)
Read, set and change Business Central item attributes through Bifröst Foundation.

## Search Keywords
1. Item attributes
2. Inventory
3. Product attributes
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

**Bifröst Inventory** adds item attribute operations to the Bifröst platform — a message-based integration layer that gives external systems, AI agents and automation tools structured access to Business Central via OData. Instead of joining Item, Item Attribute and Item Attribute Value Mapping through generic record APIs, callers use dedicated operations to read attributes, set and change values, and define attributes.

### Who is this for?

**Integration developers and AI agents** that need to read or maintain product attributes on items without multi-table joins. Ideal for catalogue sync, PIM-style enrichment and agent-driven master-data tasks.

**Target industries:** manufacturing, distribution, retail — any business that classifies items with Business Central item attributes.

### What it does

- **Read attributes** — attribute definitions and assigned values for one or more items, optionally with the attributes that have no value yet
- **Assign values** — give an item an attribute value; setting the same value again changes nothing, and a different value is replaced only on request
- **Change values** — change an existing value, with the value before and after in the answer
- **Define attributes** — create an attribute definition, with its option values, before any item uses it

### How it works

1. Install **Bifröst Foundation** and **Bifröst Inventory**
2. Callers name the item by its system id or item number
3. Results return as structured JSON through the standard Bifröst data API

### Supported editions and countries

- **Editions:** Business Central Essentials and Premium
- **Countries:** Iceland, United Kingdom, Denmark, Norway, Sweden, Finland, Germany, France, Netherlands, Austria, Switzerland, Ireland, Portugal, Spain

### Requirements and prerequisites

- Microsoft Dynamics 365 Business Central 28.0 or later
- Bifrost Foundation extension by Origo (available separately on AppSource)
