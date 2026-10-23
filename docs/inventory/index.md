---
id: index
title: "Bifröst Inventory"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Inventory work in Business Central from an assistant or an integration — transfers, assembly, item tracking, reservations, availability, item references and categories, counts, costing and periods."
---

# Bifröst Inventory

**Run inventory work in Business Central from the assistant or system you already use.** Bifröst
Inventory lets a warehouse system, an integration or an AI assistant move stock between locations,
build assembly items, look up items by barcode or reference, check availability, reserve stock, count
inventory and close the period.

Every operation runs Business Central's own inventory logic, exactly as if a user did it, and the
results appear on the standard Business Central pages: transfer orders, assembly orders, item journals,
item ledger entries and the item card.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Move stock between locations.** Create, release, reopen and post transfer orders, preview the
  posting first, and read their statistics.
- **Build assembly items.** Create assembly orders, refresh their lines, release, reopen, preview and
  post them, and undo a posted assembly.
- **See lots, serial numbers and packages.** Read the item tracking of a document line or the open
  entries of an item, and see how much is left of each lot, serial number or package.
- **Reserve stock.** See existing reservations, reserve stock for a sales, purchase, transfer or
  assembly line, let Business Central reserve a sales line automatically from the available supply,
  cancel a reservation, and follow the order tracking chain of a line to see which supply covers which
  demand.
- **Check availability.** Read the projected availability of one or more items per day, week, month,
  quarter or year: requirements, scheduled receipts, planned receipts and the projected balance.
- **Find items.** Resolve a barcode, a customer or vendor item reference, an item number or a GTIN to
  the item, variant and unit of measure.
- **Count inventory.** Calculate the expected quantities into a physical inventory journal, record the
  counted quantities, preview the result and post the journal.
- **Reclassify.** Check, preview and post a reclassification journal.
- **Keep costs right and close the period.** Read item costs, change an item's unit cost, last direct
  cost or standard cost, run cost adjustment, post inventory cost to the general ledger, calculate,
  preview and post revaluation, update unit prices, undo and redo item applications, and close or
  reopen inventory periods.
- **Spread item charges.** Assign a freight, customs or other item charge on an open purchase or sales
  document to its item lines, and read how a charge is spread and how much is still unassigned.
- **Keep item categories and attributes up to date.** Read the item category tree, create or update
  categories with their default attributes, read an item's attributes, give it attribute values and
  define new attributes with their options.

## Capabilities

| Domain | Capabilities |
|---|---|
| **Inventory** | Transfer orders and assembly orders from creation to posting (and undoing a posted assembly), item tracking reads, reservations and order tracking, availability by period, item references, item charge assignment, item categories and attributes, physical inventory, reclassification, item application, unit cost and unit price updates, cost adjustment and cost posting to the general ledger, revaluation and inventory periods |

## Get it

Install **Bifrost Inventory** next to Bifröst Foundation, from [AppSource](https://marketplace.microsoft.com/en-US/product/dynamics-365-business-central/PUBID.origo%7CAID.origo_bifrost_inventory%7CPAPPID.02701c94-c962-4825-92c7-ef9f70311a2b) or through your Business
Central partner. It needs Business Central 28.3 or later, Essentials or Premium, and Bifröst
Foundation 28.0.3.530 or later. For the price, contact your Business Central partner.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Install Bifröst Foundation and complete its setup, then install **Bifrost Inventory**. | Business Central administrator |
| 2 | Open **Inventory Setup** and check which of its 15 areas are turned on in this company. On a company that existed before this version, an administrator turns on the four newest areas (item references, availability, item charges and item categories) here. | Business Central administrator |
| 3 | Make sure the people and services that call it have Bifröst's `BIFROST Read ori` or `BIFROST Full ori`; Bifrost Inventory adds its permissions to those sets. | Business Central administrator |
| 4 | Assign **Inv. Posting Gate** (`BIFROST InvPost ori`) only to those who may post transfer and assembly orders, post or preview reclassification and revaluation journals, run cost adjustment or post inventory cost to the general ledger. | Business Central administrator |
| 5 | Check the Business Central setup the work needs: locations and transfer routes, assembly setup, item tracking codes, journal templates and batches, inventory periods and posting setup. | Business Central administrator or partner |

The help of the setup page has the details: [Inventory Setup](/help/inventory/inventory-setup/).

## Good to know

- **It acts as you.** Every call runs with the caller's own Business Central permissions and is
  logged on **Bifrost Messages**.
- **Posting is a separate permission.** Posting transfer and assembly orders, posting or previewing
  reclassification and revaluation journals, running cost adjustment and posting inventory cost to the
  general ledger need `BIFROST InvPost ori` on top of the read and write sets. Creating and releasing
  documents can be given to an integration that cannot post them.
- **Each area can be turned off.** An area that is turned off on **Inventory Setup** is not offered to
  assistants in that company, and its operations answer with an error that says so. The reclassification
  area is off until an administrator turns it on.
- **Some tables are changed only through these operations.** An assistant cannot change item attribute
  data, item tracking lines, reservation entries, item categories, item charge assignments or Inventory Setup through Bifröst's general data
  operations; it uses the operations of this app, which keep Business Central's own checks.
- **Message types.** The operations this app adds are listed with all the others by the MCP tools
  (`list_domains`, `describe_domains`, `describe_message_type`) and on the **Bifrost Message Types**
  page, and each explains itself through `Help.Implementation.Get`.
