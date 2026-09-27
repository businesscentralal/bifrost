---
id: index
title: "Bifröst Warehouse"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Warehouse message types on Bifröst Foundation: create and post warehouse shipments and receipts, create and register picks and put-aways, and preview postings."
---

Bifröst Warehouse is a feature app on top of Bifröst Foundation. It publishes the **Warehouse** message types, so an external caller, an MCP client or a Business Central process can drive warehouse shipments, receipts, picks and put-aways through the same queue, task and data pattern used by the rest of Bifröst.

Warehouse handling is a specialist area that many companies do not use, so these message types live in their own app instead of in Foundation. Install Bifröst Warehouse only in companies that run warehouse documents.

## What it does

- **Outbound flow** — `Warehouse.Shipment.Create` creates one warehouse shipment per released Sales Order or outbound Transfer Order. `Warehouse.Pick.Create` and `Warehouse.Pick.Register` create and register the pick where the location requires one. `Warehouse.Shipment.Post` posts the shipment, optionally with the invoice.
- **Inbound flow** — `Warehouse.Receipt.Create` creates one warehouse receipt per released Purchase Order, Sales Return Order or inbound Transfer Order. `Warehouse.Receipt.Post` posts the receipt. `Warehouse.Putaway.Create` and `Warehouse.Putaway.Register` create (or return) and register the put-away.
- **Preview before you post** — `Warehouse.Shipment.PreviewPost` and `Warehouse.Receipt.Post.Preview` return the ledger entries a posting would produce and roll everything back.
- **Self-documenting contract** — every message type answers its own Markdown help document (parameters, examples, response shape and errors) through `Help.Implementation.Get`.

## How it works

1. Install and activate **Bifröst Foundation**.
2. Install **Bifröst Warehouse**. It depends on Foundation only.
3. External systems send Bifröst messages named `Warehouse.*` through the standard queue → task → data pattern.
4. Posting and registering go through Foundation's posting gate. `Warehouse.Shipment.Post`, `Warehouse.Receipt.Post`, `Warehouse.Pick.Register` and `Warehouse.Putaway.Register` need the `BIFROST WhsePost ori` permission set on the calling user; `Warehouse.Shipment.Post` with `invoice = true` also needs `BIFROST GL Post ori`. Creating documents and previewing postings are not gated.

The message type names are unchanged from the time they shipped inside Foundation, so a caller that already uses `Warehouse.Receipt.Create` and the others needs no change beyond installing this app.

## Message types

| Domain | Message types |
| --- | --- |
| Warehouse shipments | `Warehouse.Shipment.Create`, `Warehouse.Shipment.Post`, `Warehouse.Shipment.PreviewPost` |
| Warehouse receipts | `Warehouse.Receipt.Create`, `Warehouse.Receipt.Post`, `Warehouse.Receipt.Post.Preview` |
| Warehouse picks | `Warehouse.Pick.Create`, `Warehouse.Pick.Register` |
| Warehouse put-aways | `Warehouse.Putaway.Create`, `Warehouse.Putaway.Register` |

| Type | Direction | Purpose |
|------|-----------|---------|
| [`Warehouse.Shipment.Create`](./reference/message-types/warehouse-shipment-create) | Inbound | Create warehouse shipments from released Sales Orders and outbound Transfer Orders |
| [`Warehouse.Shipment.Post`](./reference/message-types/warehouse-shipment-post) | Inbound | Post a warehouse shipment (ship, optionally invoice) |
| [`Warehouse.Shipment.PreviewPost`](./reference/message-types/warehouse-shipment-previewpost) | Inbound | Preview posting a warehouse shipment (ship + invoice); rolled back |
| [`Warehouse.Receipt.Create`](./reference/message-types/warehouse-receipt-create) | Inbound | Create warehouse receipts from released Purchase Orders, Sales Return Orders and inbound Transfer Orders |
| [`Warehouse.Receipt.Post`](./reference/message-types/warehouse-receipt-post) | Inbound | Post a warehouse receipt |
| [`Warehouse.Receipt.Post.Preview`](./reference/message-types/warehouse-receipt-post-preview) | Inbound | Preview posting a warehouse receipt; rolled back |
| [`Warehouse.Pick.Create`](./reference/message-types/warehouse-pick-create) | Inbound | Create a warehouse pick from a warehouse shipment |
| [`Warehouse.Pick.Register`](./reference/message-types/warehouse-pick-register) | Inbound | Register a warehouse pick |
| [`Warehouse.Putaway.Create`](./reference/message-types/warehouse-putaway-create) | Inbound | Create, or return the existing, put-away for a posted warehouse receipt |
| [`Warehouse.Putaway.Register`](./reference/message-types/warehouse-putaway-register) | Inbound | Register a warehouse put-away |

## Typical workflows

**Outbound:** `Sales.Document.Release` → `Warehouse.Shipment.Create` → `Warehouse.Pick.Create` → `Warehouse.Pick.Register` → `Warehouse.Shipment.Post`. The two pick steps apply only where the location has `Require Pick` (or directed put-away and pick).

**Inbound:** `Purchase.Document.Release` → `Warehouse.Receipt.Create` → `Warehouse.Receipt.Post` → `Warehouse.Putaway.Create` → `Warehouse.Putaway.Register`. The two put-away steps apply only where the location has `Require Put-away`.

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- **Bifröst Foundation**, available separately on AppSource.
- Locations set up for warehouse handling (`Require Shipment`, `Require Receive`, `Require Pick`, `Require Put-away` as your process needs).
- Object ID ranges: app `10036935–10036984`.

## Where to go next

- [In-product help](/help/warehouse/)
- [Message type reference](./reference/message-types/) — the request and response contract for every type, from the app's help codeunits
- [Partner Center listing](./listing)
- [Posting gates in Foundation](/foundation/reference/setup/#posting-gates-bifrost-gl--item--fa--job--resource--warehouse-posting)
- [Build on Bifröst](/extensibility/)
