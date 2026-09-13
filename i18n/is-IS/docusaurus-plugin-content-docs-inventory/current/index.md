---
id: index
title: "Bifröst Inventory"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Item Attribute message types on Bifröst Foundation: get, create, update and define attributes without multi-table Data.Records joins."
---

Bifröst Inventory er a feature app on top of Bifröst Foundation. It publishes first-class **Item Attribute** message tegunds so an external caller, an MCP client eða a Business Central process getur read og write vara eiginleikar through the same queue, verkþáttur og data pattern used by the rest of Bifröst — án stitching multi-table `Data.Records.Get` joins.

## What it does

- **Lestu eiginleikar** — `Item.Attribute.Get` returns eigind definitions og assigned gildi fyrir one eða more vörur, með optional filters og unassigned eiginleikar.
- **Assign gildi** — `Item.Attribute.Create` assigns eigind gildi to an vara. Idempotent þegar the mapping already has the same gildi; use `overwrite: true` to replace a different gildi.
- **Change mappings** — `Item.Attribute.Update` changes an existing vara↔eigind mapping og returns before/after gildi.
- **Define eiginleikar** — `Item.AttributeDefinition.Create` creates an eigind definition og optional option gildi independently of any vara.
- **Self-skjaling samningur** — every message tegund answers its own Markdown help skjal (parameters, examples, response shape og villur).

## How it works

1. Install og activate **Bifröst Foundation** (28.0.0.87 eða later recommended; app depends on Foundation 28.0.0.0+).
2. Install **Bifröst Inventory**. Permissions ship as PermissionStilltuExtensions onto `BIFROST Read ori` / `BIFROST Full ori`.
3. External systems send Bifröst messages heitid `Item.Attribute.*` eða `Item.AttributeDefinition.Create` through the standard queue → verkþáttur → data pattern.
4. Identifier resolution fyrir vara-scoped tegunds prefers `subject` (GUID = `Item.SystemId`, otherwise `Item.No.`), then `data.itemNo` / id fields / `tableView`.

## Skilaboð tegunds

| Domain | Skilaboð tegunds |
| --- | --- |
| Item eiginleikar | `Item.Attribute.Get`, `Item.Attribute.Create`, `Item.Attribute.Update` |
| Attribute definitions | `Item.AttributeDefinition.Create` |

| Type | Direction | Purpose |
|------|-----------|---------|
| `Item.Attribute.Get` | Út á við | Lestu eiginleikar/gildi fyrir vörur |
| `Item.Attribute.Create` | Inn á við | Assign eigind gildi to an vara |
| `Item.Attribute.Update` | Inn á við | Change an existing mapping |
| `Item.AttributeDefinition.Create` | Inn á við | Create eigind definition (+ options) |

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 eða later, Essentials eða Premium.
- **Bifröst Foundation** 28.0.0.0 eða later (this app was validagsetningd against 28.0.0.87), available separately on AppSource.
- Object ID ranges: app `10036885–10036934`.

## Where to go next

- [In-product help](/help/inventory/)
- [Skilaboð tegund reference](./reference/message-types/) — the request og response samningur fyrir every tegund, úr the app's help kóðiunits
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
