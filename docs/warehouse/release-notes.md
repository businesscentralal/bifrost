---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Warehouse published on Microsoft AppSource."
---

# Bifröst Warehouse release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Warehouse published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.3.2 — 29 October 2026

### Added

- A guided setup for Warehouse now appears under Assisted Setup in Extensions, named Set up Bifröst Warehouse. It explains what Warehouse operations do, shows the app's connection status, points you to Foundation for the connection settings and describes the separate permissions for posting and invoicing. Nothing is changed until you choose Finish.
- Warehouse now shows up in Foundation's own setup step, so you can list it and enable it there.

### Changed

- The help for requests that contain a key the operation doesn't recognise now matches Foundation's stricter checking, in English and Icelandic. A refused shipment release states that the shipment's status is left unchanged.
- Icelandic wording in the Assisted Setup help is corrected.

## 28.3.1 — 25 October 2026

### Changed

- Your AI assistant gets a fuller description of every Warehouse operation: what it answers, the errors it can return and why, and what it changes in Business Central.
- Notes, examples and step-by-step guidance are added across the operations, and the lines or entries that an operation takes are described one by one.
- The descriptions now also cover the warnings returned when inventory picks and put-aways are created, and the refusals for assembly orders that are not released or have no location set for consumption.
- When you create bins, movements or inventory movements, the keys inside each list of lines, entries, bins or source documents are now checked there. A key the operation doesn't know is reported with a clear warning. Valid requests work as before.

### Fixed

- Listing open warehouse activities or bin content with a negative skip or take value now returns a clear error that names the value, what is accepted and what to do. If both are negative, both problems are listed in one answer.

## 28.3.0 — 20 October 2026

### First version on Microsoft AppSource

- Run warehouse work from a scanner app, a warehouse system, an integration or an assistant, with Business Central's own warehouse logic. The results appear on the standard warehouse pages.
- See the content of each bin and list the open picks, put-aways and other warehouse activities.
- Receive goods: create warehouse receipts from released purchase orders, sales return orders and transfer orders, preview the posting and post the receipt.
- Put goods away and pick them: create the put-away for a posted receipt and the pick for a shipment, and register them when the work is done.
- Ship goods: create warehouse shipments from released sales orders and transfer orders, preview the posting and post, with or without invoicing the sales order.
- Posting is a separate permission, and a preview changes nothing.
