---
id: index
title: "Bifröst Warehouse — Help"
sidebar_label: "Bifröst Warehouse — Help"
sidebar_position: 1
slug: /
---

**Bifröst Warehouse** is the warehouse feature module of the Bifröst platform, a Business Central extension by Origo. It publishes the Warehouse message types on top of Bifröst Foundation, so external systems can create and post warehouse shipments and receipts, create and register picks and put-aways, and preview postings through the Bifröst API.

## This extension has no pages of its own

There is nothing to open in the Business Central client for this app. The extension adds no pages, no page extensions, no actions and no fields to any existing page — it is operated entirely through Bifröst message types.

What it does shows up on the standard Business Central warehouse pages: a shipment created by `Warehouse.Shipment.Create` appears in **Warehouse Shipments**, a pick created by `Warehouse.Pick.Create` appears in **Warehouse Picks**, a posted receipt appears in **Posted Whse. Receipts**, and so on. Use Microsoft's own pages to review the results.

Two things are set up outside this extension:

- **Bifrost Setup**, in Bifröst Foundation, holds the settings the message queue runs on. See [Bifrost Setup](/help/foundation/bifrost-setup/).
- **Locations**, **warehouse employees**, bins and number series belong to Business Central and are set up there.

## Message Types

| Message Type | Description |
| --- | --- |
| Warehouse.Shipment.Create | Creates warehouse shipments from released Sales Orders and outbound Transfer Orders. |
| Warehouse.Shipment.Post | Posts a warehouse shipment (ship, optionally invoice). |
| Warehouse.Shipment.PreviewPost | Simulates posting a warehouse shipment (ship + invoice) and returns the ledger entries without committing. |
| Warehouse.Receipt.Create | Creates warehouse receipts from released Purchase Orders, Sales Return Orders and inbound Transfer Orders. |
| Warehouse.Receipt.Post | Posts a warehouse receipt (receive). |
| Warehouse.Receipt.Post.Preview | Simulates posting a warehouse receipt and returns the ledger entries without committing. |
| Warehouse.Pick.Create | Creates a warehouse pick from a warehouse shipment. |
| Warehouse.Pick.Register | Registers a warehouse pick. |
| Warehouse.Putaway.Create | Creates, or returns the existing, put-away for a posted warehouse receipt. |
| Warehouse.Putaway.Register | Registers a warehouse put-away. |

Call `Help.MessageTypes.Get` for the registered catalogue, or ask any single message type for its own help document with `Help.Implementation.Get` to see its exact request parameters, response fields and error cases.

## Getting Started

1. Install and activate **Bifröst Foundation**.
2. Install **Bifröst Warehouse**.
3. Give the calling user or service the Foundation permission sets it needs. Posting and registering also need `BIFROST WhsePost ori`, and posting a shipment with the invoice also needs `BIFROST GL Post ori`.
4. Make sure the locations you use require the warehouse documents you plan to create (`Require Shipment`, `Require Receive`, `Require Pick`, `Require Put-away`).
5. Send Bifröst messages named `Warehouse.*` through the Bifröst queue.

## Learn More

- [Product documentation](/warehouse/) — what the extension does, how it works and what it requires
- [Message type reference](/warehouse/reference/message-types/) — the request and response contract for every type
- [Bifrost Setup](/help/foundation/bifrost-setup/) — the Bifröst Foundation page holding the platform settings
