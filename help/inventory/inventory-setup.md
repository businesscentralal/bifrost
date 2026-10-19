---
id: inventory-setup
title: "Inventory Setup"
sidebar_position: 1
---

**Inventory Setup** turns the areas of Bifrost Inventory on or off for this company. It is for the
administrator who decides which inventory work assistants and integrations may do here.

Search for **Inventory Setup** in Business Central, or open it from the list of installed apps on
[Bifrost Setup](/help/foundation/bifrost-setup/). There is one setup record per company; it is created
when the app is installed, or the first time the page opens.

## Domains

Each field turns one area on or off. When an area is off, its operations are not offered to assistants
in this company, and a call to one of them answers with an error that names the area.

| Field | Turns on or off |
| --- | --- |
| **Attributes** | Reading item attributes, giving items attribute values and defining new attributes. |
| **Transfer Orders** | Creating, releasing, reopening, previewing and posting transfer orders, their statistics, and undoing posted transfer shipments and receipts. |
| **Assembly** | Creating, refreshing, releasing, reopening, previewing and posting assembly orders, their statistics, and undoing posted assemblies. |
| **Reservations** | Reading, creating and cancelling reservations. |
| **Item Tracking** | Assigning and removing lot, serial and package numbers, and the remaining quantity per lot, serial number or package. |
| **Physical Inventory** | Calculating, recording, previewing and posting physical inventory journals. |
| **Costing** | Reading item costs, cost adjustment, posting inventory cost to the general ledger and calculating revaluation. |
| **Reclassification** | Checking, previewing and posting reclassification journals. Off when the setup record is created; turn it on when you need it. |
| **Item Application** | Reading item applications, and undoing and redoing them. |
| **Inventory Period** | Reading, closing and reopening inventory periods. |
| **Item Price** | Updating the unit price of an item. |

## Good to know

- Turning an area on does not grant any permission. Callers still need their own Business Central
  permissions and Bifröst's `BIFROST Read ori` or `BIFROST Full ori`.
- Posting, cost adjustment and posting inventory cost to the general ledger also need the
  **Inv. Posting Gate** (`BIFROST InvPost ori`) permission set. That set also lets a user open and
  change this page.
- An assistant cannot change this page's settings through Bifröst's general data operations; change
  them here.
