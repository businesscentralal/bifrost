---
id: index
title: "Bifröst Inventory"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Item Attribute message types on Bifröst Foundation: get, create, update and define attributes without multi-table Data.Records joins."
---

# Bifröst Inventory

**Keep item attributes up to date from other systems and assistants.** Read an item's attributes,
set their values and define new attributes, each in one request.

The results show on the item in Business Central, under the standard item attributes. The app has
no pages of its own.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **See an item's attributes in one go.** Get the attributes and their values for one or more
  items, and, if you want, the attributes that have no value yet.
- **Give an item an attribute value.** Setting the same value again changes nothing. Replacing a
  different value happens only when the request asks for it.
- **Change a value that is already set.** The answer shows the value before and after the change.
- **Define a new attribute.** Create an attribute, with its option values, before any item uses it.
- **Feed catalogue and product data work.** Catalogue sync, enrichment of product information and
  master-data tasks done by an AI assistant can all use the same requests.

## Get it

Install **Bifrost Inventory** next to Bifröst Foundation, from AppSource or through your partner.
It needs Business Central 28.0 or later, Essentials or Premium, and Bifröst Foundation 28.0.0.0 or
later.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Install and activate Bifröst Foundation, then install Bifröst Inventory. | Business Central administrator |
| 2 | Make sure the people and services that call it have **`BIFROST Read ori`** or **`BIFROST Full ori`**. Inventory adds its permissions to those sets. | Business Central administrator |
| 3 | Send item attribute requests, then check the attributes on the item in Business Central. | Whoever builds the integration |

The in-product help is at Bifröst Inventory help. Platform settings are on
[Bifrost Setup](/help/foundation/bifrost-setup/) in Bifröst Foundation.

## Good to know

- **It acts as you.** Every call runs with your own Business Central permissions and is logged on
  **Bifrost Messages**.
- **No new permission sets.** Access follows the Foundation sets `BIFROST Read ori` and
  `BIFROST Full ori`.
- **Nothing to open in the client.** The app adds no pages, actions or fields. Attribute values
  are kept in the standard Business Central item attribute tables and show on the item.
- **An item is named** by its system id or its item number.

## Capabilities and reference

Capability: **`Item`**. Bifröst Inventory adds its four message types to the `Item` capability that
Bifröst Foundation already has.

What each message type does, in plain words: [Capabilities](./capabilities).

- [Message type reference](./reference/message-types/): the contract of every type, from the app's help codeunits
- [AppSource listing text](./listing)
- [Build on Bifröst](/extensibility/)
- Permission sets: `BIFROST Read ori` or `BIFROST Full ori`, from Bifröst Foundation, extended by this app.
