---
id: index
title: "Bifröst Warehouse"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Warehouse work in Business Central from an assistant or an integration — receipts, put-aways, picks, shipments and bin content."
---

# Bifröst Warehouse

**Run warehouse work in Business Central from the assistant or system you already use.** Bifröst
Warehouse lets a scanner app, a warehouse system, an integration or an AI assistant receive goods, put
them away, pick them and ship them, and see what is in each bin.

Every operation runs Business Central's own warehouse logic, exactly as if a warehouse worker did it,
and the results appear on the standard Business Central pages: warehouse receipts and shipments, picks
and put-aways, their registered and posted documents, and bin contents.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **See the warehouse.** Read the content of each bin by item, location, bin and variant, and list the
  open picks, put-aways and other warehouse activities, with their lines when needed.
- **Receive goods.** Create warehouse receipts from released purchase orders, sales return orders and
  transfer orders, preview the posting and post the receipt.
- **Put goods away.** Create the put-away for a posted receipt and register it when the goods are on
  the shelf.
- **Pick goods.** Create the pick for a warehouse shipment and register it when the goods are picked.
- **Ship goods.** Create warehouse shipments from released sales orders and transfer orders, preview the
  posting and post the shipment, with or without invoicing the sales order.

## Capabilities

| Domain | Capabilities |
|---|---|
| **Warehouse** | Bin content and open warehouse activities, warehouse receipts and shipments from creation through preview to posting, picks and put-aways from creation to registering |

## Get it

Install **Bifrost Warehouse** next to Bifröst Foundation, from AppSource or through your Business
Central partner. It needs Business Central 28.3 or later, Essentials or Premium, and Bifröst
Foundation 28.0.3.530 or later. For the price, contact your Business Central partner.

## Set it up

Bifröst Warehouse has no setup page of its own.

| Step | What | Who |
|---|---|---|
| 1 | Install Bifröst Foundation and complete its setup, then install **Bifrost Warehouse**. | Business Central administrator |
| 2 | Make sure the people and services that call it have Bifröst's `BIFROST Read ori` or `BIFROST Full ori`; Bifrost Warehouse adds its permissions to those sets. Reading needs `BIFROST Read ori`; creating receipts, shipments, picks and put-aways needs `BIFROST Full ori`. | Business Central administrator |
| 3 | Assign **Warehouse Posting Gate** (`BIFROST WhsePost ori`) only to those who may post receipts and shipments and register picks and put-aways. | Business Central administrator |
| 4 | Assign **Whse Invoice Gate** (`BIFROST WhseInv ori`) as well to those who may invoice the sales order when they post a shipment. | Business Central administrator |
| 5 | Check the Business Central setup the work needs: locations that require receipts, shipments, picks and put-aways, bins, warehouse employees, and posting setup for the source documents. | Business Central administrator or partner |

## Good to know

- **It acts as you.** Every call runs with the caller's own Business Central permissions and is
  logged on **Bifrost Messages**.
- **Posting is a separate permission.** Posting receipts and shipments and registering picks and
  put-aways need `BIFROST WhsePost ori` on top of the read and write sets, and invoicing a shipment
  also needs `BIFROST WhseInv ori`. Creating warehouse documents can be given to an integration that
  cannot post them.
- **Previews change nothing.** A receipt or shipment preview shows the entries posting would create
  and then rolls everything back.
- **Warehouse documents are changed only through these operations.** An assistant cannot change
  warehouse receipts, shipments or activities through Bifröst's general data operations; it uses the
  operations of this app, which keep Business Central's own checks.
- **Message types.** The operations this app adds are listed with all the others by the MCP tools
  (`list_domains`, `describe_domains`, `describe_message_type`) and on the **Bifrost Message Types**
  page, and each explains itself through `Help.Implementation.Get`.
