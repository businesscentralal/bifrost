---
id: index
title: "Bifröst Inventory — Help"
sidebar_label: "Bifröst Inventory — Help"
sidebar_position: 1
slug: /
---

**Bifröst Inventory** is the inventory feature module of the Bifröst platform, a Business Central extension by Origo. It publishes Item Attribute message types on top of Bifröst Foundation so external systems can get, create and update item attributes — and create attribute definitions — through the Bifröst API.

## This extension has no pages of its own

There is nothing to open in the Business Central client for this app. The extension adds no pages, no page extensions, no actions and no fields to any existing page — it is operated entirely through Bifröst message types.

Results appear in the standard Business Central **Item Attributes** and item cards when attributes are assigned. Platform settings live on **Bifrost Setup** in Bifröst Foundation — see [Bifrost Setup](/help/foundation/bifrost-setup/).

## Message Types

| Message Type | Description |
| --- | --- |
| Item.Attribute.Get | Returns attribute definitions and assigned values for one or more items. |
| Item.Attribute.Create | Assigns attribute values to an item (idempotent; optional overwrite). |
| Item.Attribute.Update | Changes an existing item↔attribute mapping and returns before/after. |
| Item.AttributeDefinition.Create | Creates an item attribute definition and optional option values. |

Call `Help.MessageTypes.Get` for the registered catalogue, or ask any single message type for its own help document with `Help.Implementation.Get` to see its exact request parameters, response fields and error cases.

## Getting Started

1. Install and activate **Bifröst Foundation**.
2. Install **Bifröst Inventory**.
3. Ensure the calling user or service has Foundation read/write permissions (`BIFROST Read ori` / `BIFROST Full ori`); Inventory extends those sets.
4. Send Bifröst messages named `Item.Attribute.*` or `Item.AttributeDefinition.Create` through the Bifröst queue.
5. Review assigned attributes on the item in the Business Central client.

## Learn More

- [Product documentation](/inventory/) — what the extension does, how it works and what it requires
- [Message type reference](/inventory/reference/message-types/) — the request and response contract for every type
- [Bifrost Setup](/help/foundation/bifrost-setup/) — the Bifröst Foundation page holding the platform settings
