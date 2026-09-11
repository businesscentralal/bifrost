---
id: index
title: "Bifröst Inventory"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Item Attribute message types on Bifröst Foundation: get, create, update and define attributes without multi-table Data.Records joins."
---

Bifröst Inventory is a feature app on top of Bifröst Foundation. It publishes first-class **Item Attribute** message types so an external caller, an MCP client or a Business Central process can read and write item attributes through the same queue, task and data pattern used by the rest of Bifröst — without stitching multi-table `Data.Records.Get` joins.

## What it does

- **Read attributes** — `Item.Attribute.Get` returns attribute definitions and assigned values for one or more items, with optional filters and unassigned attributes.
- **Assign values** — `Item.Attribute.Create` assigns attribute values to an item. Idempotent when the mapping already has the same value; use `overwrite: true` to replace a different value.
- **Change mappings** — `Item.Attribute.Update` changes an existing item↔attribute mapping and returns before/after values.
- **Define attributes** — `Item.AttributeDefinition.Create` creates an attribute definition and optional option values independently of any item.
- **Self-documenting contract** — every message type answers its own Markdown help document (parameters, examples, response shape and errors).

## How it works

1. Install and activate **Bifröst Foundation** (28.0.0.87 or later recommended; app depends on Foundation 28.0.0.0+).
2. Install **Bifröst Inventory**. Permissions ship as PermissionSetExtensions onto `BIFROST Read ori` / `BIFROST Full ori`.
3. External systems send Bifröst messages named `Item.Attribute.*` or `Item.AttributeDefinition.Create` through the standard queue → task → data pattern.
4. Identifier resolution for item-scoped types prefers `subject` (GUID = `Item.SystemId`, otherwise `Item.No.`), then `data.itemNo` / id fields / `tableView`.

## Message types

| Domain | Message types |
| --- | --- |
| Item attributes | `Item.Attribute.Get`, `Item.Attribute.Create`, `Item.Attribute.Update` |
| Attribute definitions | `Item.AttributeDefinition.Create` |

| Type | Direction | Purpose |
|------|-----------|---------|
| `Item.Attribute.Get` | Outbound | Read attributes/values for items |
| `Item.Attribute.Create` | Inbound | Assign attribute value to an item |
| `Item.Attribute.Update` | Inbound | Change an existing mapping |
| `Item.AttributeDefinition.Create` | Inbound | Create attribute definition (+ options) |

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- **Bifröst Foundation** 28.0.0.0 or later (this app was validated against 28.0.0.87), available separately on AppSource.
- Object ID ranges: app `10036885–10036934`.

## Where to go next

- [In-product help](/help/inventory/)
- [Message type reference](./reference/message-types/) — the request and response contract for every type, from the app's help codeunits
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
