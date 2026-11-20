---
id: inventory-setup
title: "Inventory Setup"
sidebar_position: 1
---

**Inventory Setup** turns the areas of Bifrost Inventory on or off for this company. It is for the
administrator who decides which inventory work assistants and integrations may do here.

Search for **Inventory Setup** in Business Central, or open it from the list of installed apps on
[Bifrost Setup](/help/foundation/bifrost-setup/). There is one setup record per company; it is created
when the app is installed, when a new company is created, or the first time the page opens.

## Domains

Each field turns one area on or off. **Every area is off by default**, and a company with no setup record
counts as having every area off. When an area is off, its operations are not listed for assistants in
this company. The switch only changes that list: an operation that is called is never refused because its
area is off, and the caller's Business Central permissions still apply. To let assistants see the
operations of an area, turn it on here, or use [Suggest Setup](#suggest-setup).

The fields appear in this order:

| Field | Turns on or off |
| --- | --- |
| **Attributes** | Reading item attributes, giving items attribute values and defining new attributes. |
| **Transfer Orders** | Creating, releasing, reopening, previewing and posting transfer orders, and their statistics. |
| **Assembly** | Creating, refreshing, releasing, reopening, previewing and posting assembly orders, their statistics, and undoing posted assemblies. |
| **Reservations** | Reading, creating and cancelling reservations, reserving a sales line automatically, and reading the order tracking chain of a line. |
| **Item Tracking** | Reading the lot, serial and package tracking of a line or an item, and the remaining quantity per lot, serial number or package. |
| **Physical Inventory** | Calculating, recording, previewing and posting physical inventory journals. |
| **Costing** | Reading and changing item costs, cost adjustment, posting inventory cost to the general ledger, and calculating, previewing and posting revaluation. |
| **Reclassification** | Checking, previewing and posting reclassification journals. |
| **Item Application** | Reading item applications, and undoing and redoing them. |
| **Inventory Period** | Reading, closing and reopening inventory periods. |
| **Item Price** | Updating the unit price of an item. |
| **Item Reference** | Resolving a barcode, a customer or vendor item reference, an item number or a GTIN to an item. |
| **Availability** | Reading the projected availability of items per day, week, month, quarter or year. |
| **Item Charge** | Assigning an item charge on a purchase or sales document to its item lines, and reading how it is spread. |
| **Item Substitution** | Reading the direct substitutes of an item and their current inventory. |
| **Item Category** | Reading the item category tree and creating or updating item categories with their default attributes. |
| **Purchase Returns** | Creating a purchase return order or credit memo from posted receipt or invoice lines. |
| **Catalog Items** | Creating an item from a catalog item, using the item template of the catalog item. |
| **Planning** | Calculating a planning worksheet and carrying out its suggestions to create purchase or transfer orders. |

### New and existing companies

A new company gets its setup record with every area off. When Bifrost Inventory is installed or updated,
Suggest Setup runs once for each company that has no setup record yet, without asking, and turns on the
areas that company can use. A company that already has a setup record is never changed by the install or
the update: the record is the administrator's choice.

## Suggest Setup

**Suggest Setup** is an action on **Inventory Setup** and in the guided setup (the **Domains** step). It
reads the Business Central setup of the company and works out which areas the company can use.

1. Choose **Suggest Setup**.
2. A list shows every area with a proposal, **turn on**, **leave off** or **already on**, and a reason that
   names the area and says what was found.
3. Choose **OK** to apply the proposal, or **Cancel** to change nothing. Nothing is changed until you
   confirm. If nothing would change, a message says so instead.

Suggest Setup only turns areas on. It never turns a switch off, so an area you switched on stays on, and
you can run it again at any time, for example after you set up locations or item charges. To turn an area
off, clear its field on **Inventory Setup**.

### How Suggest Setup decides

| Area | Proposed on when |
| --- | --- |
| **Transfer Orders** | The company has a location used as in-transit location and at least two other locations. |
| **Assembly** | At least one assembly BOM is set up, that is, a BOM component of type Item. |
| **Item Tracking** | At least one item uses an item tracking code. |
| **Item Charge** | At least one item charge is set up. |
| **Inventory Period** | At least one inventory period is set up. |
| **Attributes**, **Reservations**, **Physical Inventory**, **Costing**, **Reclassification**, **Item Application**, **Item Price**, **Item Reference**, **Availability**, **Item Substitution**, **Item Category**, **Purchase Returns**, **Catalog Items** and **Planning** | The company has at least one item. |

When an area is left off, the reason says what is missing, for example that no in-transit location is set up
or that the company has no items.

## Good to know

- Turning an area on does not grant any permission. Callers still need their own Business Central
  permissions and Bifröst's `BIFROST Read ori` or `BIFROST Full ori`.
- Posting transfer and assembly orders, posting or previewing reclassification and revaluation
  journals, cost adjustment and posting inventory cost to the general ledger also need the
  **Inv. Posting Gate** (`BIFROST InvPost ori`) permission set. That set also lets a user open and
  change this page.
- An assistant cannot change this page's settings through Bifröst's general data operations; change
  them here.
