---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Inventory published on Microsoft AppSource."
---

# Bifröst Inventory release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Inventory published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.3.3 — 22 November 2026

### Added

- Reservations can be created and cancelled for a project planning line as well.

### Changed

- Carrying out a requisition or planning worksheet no longer asks for a confirmation count, because it creates orders that can be changed or deleted and posts nothing. Older callers that still send a count keep working; the count is ignored.
- When a planning worksheet line is for production, the refusal now points to the Manufacturing app, which carries out production lines.

## 28.3.2 — 20 November 2026

### Added

Each new operation works through your AI assistant or an integration, with Business Central's own logic behind it. Operations that read leave your data unchanged. Operations that write say so in their description.

**Items and master data**

- **Create items.** Create an item from an item template, or from a catalog item with that catalog item's template. Add units of measure and variants to an existing item, and read them back.
- **Item references.** Create or update an item reference. Omitted descriptions and dates are kept, and a reference that already belongs to another item is refused with guidance.
- **Stockkeeping units.** Create stockkeeping units per location and variant, and read them with their planning and cost fields.
- **Price lists.** Create or update a draft sales or purchase price list and its lines, and activate the list. Activation refuses a price that duplicates an existing one. Price tables can no longer be written through the generic record operations; reading them is unchanged.
- **Substitutes.** Read the direct substitutes of an item and the stock of each variant.
- **Standard cost.** Suggest new standard costs and implement them with Business Central's standard cost worksheet.

**Availability, valuation and planning**

- **Availability.** Read the dated supply and demand events of an item with the running projected inventory, and ask when a quantity can be promised.
- **Stock age and valuation.** Read stock quantity and value by age bucket, and read the inventory valuation at a date, grouped by item, location or variant, with paging.
- **Assembly.** Read the assembly BOM of an item, optionally exploded through all levels, and the assemble-to-order order linked to a sales line.
- **Planning.** Calculate the planning worksheet and the requisition worksheet for selected items, and carry out the accepted suggestions as new purchase, transfer and assembly orders. A suggestion that would change an existing document is refused.

**Tracking**

- **Trace a lot or serial number** through the item ledger, forwards or backwards. The trace is read only and is refused above 1,000 steps.
- **Read a lot, serial or package information card**: description, test quality, certificate, blocked status, comments and inventory.

**Counting**

- **Physical inventory orders.** Create an order with calculated expected quantities, write the counted quantities and finish it, then post it as a separate step.
- **Cycle counting.** Fill an empty physical inventory journal with the items and stockkeeping units that are due for counting.

**Transfers, returns and posted documents**

- **Partial transfers.** Ship or receive chosen quantities on selected transfer lines.
- **Pull posted lines into documents.** Add shipment lines that are not yet invoiced to a sales invoice, and receipt lines to a purchase invoice, as the Get Shipment Lines and Get Receipt Lines actions do. A line from another customer or vendor is refused.
- **Returns.** Create a sales or purchase return order or credit memo from posted lines. Nothing is posted.
- **Undo selected lines.** Undo chosen lines of a posted sales shipment or purchase receipt.

### Changed

- **Guided setup.** **Set up Bifröst Inventory** is a new guided setup in Business Central, in English and Icelandic. It explains what the app adds, shows the connection status and the company's active areas, and does not change settings by itself.
- **Areas are off until you choose them.** Each Inventory area is now off by default, so your AI assistant only sees the operations of the areas you use. A new **Suggest Setup** action on **Inventory Setup**, and in the guided setup, reads your Business Central setup and proposes which areas to turn on, with a reason for each. For example, transfers need an in-transit location and two other locations. It changes nothing until you confirm, and it never turns an area off. When the app is installed or upgraded, Suggest Setup runs once for each company that has no Inventory setup yet; it does not change a company that already has one. An area that is off only hides its operations from the list; your data and Business Central are not affected.
- **Setup mode.** While Bifröst Foundation's setup mode is active, **Inventory Setup** can be changed through Bifröst. Item, price, cost and ledger data stays protected. This needs Bifröst Foundation 28.0.14 or later.
- **Clearer confirmation counts.** For the operations that cannot be undone, the description now says what the confirmation count counts: one order, batch or run, not lines or entries.
- **More precise tracking, reservations and applications.** Item tracking and reservations are tied to the exact source line. Selections for item applications work with an exact quantity in the base unit of measure. Undoing a posted transfer shipment can be limited to selected lines.
- **Cost adjustment and posting to the general ledger** use Business Central's own filters.
- **Reclassification journals** can be checked, previewed and posted. They are separate from transfer orders.
- **Clearer refusals.** Refusals carry an error code and a next step in your language, and the built-in help and setup guidance are complete in English and Icelandic.
- **Business Central 29.** Direct transfer posting is supported in Business Central 29 without warnings. Business Central 28 keeps working as before.
- **Restricted license administrators** can be registered.

### Fixed

- Undoing a posted transfer receipt is refused, because Business Central cannot reverse it.
- Preview and check of a physical inventory journal treat blank rows the way posting does, so a preview no longer disagrees with the result.
- Cancelling a reservation that does not exist now says what was expected and what to do next.
- Adjust cost checks the license and version before it runs.

## 28.3.1 — 25 October 2026

### Changed

- Your AI assistant gets a fuller description of every Inventory operation: what it answers, the errors it can return and why, and what it changes in Business Central.
- Each description now says whether an operation only reads, changes data or cannot be undone, and gives worked examples and step-by-step guidance for most operations that change data.
- No operation, permission or behaviour changed. Everything that worked in 28.3.0 works the same way.

## 28.3.0 — 20 October 2026

### First version on Microsoft AppSource

- Run inventory work from an assistant or an integration with Business Central's own logic: create, release and post transfer orders and assembly orders, with a preview before posting.
- Read lots, serial numbers and packages, reserve stock, cancel reservations and follow the order tracking of a line.
- Check projected availability per day, week, month, quarter or year, and find items by barcode, item reference, item number or GTIN.
- Count inventory, reclassify, and post the journals, with a preview first.
- Keep costs right and close the period: cost adjustment, cost posting to the general ledger, revaluation, item charge assignment and inventory periods.
- Keep item categories and attributes up to date. Each area can be turned on or off on **Inventory Setup**, and posting is a separate permission.
