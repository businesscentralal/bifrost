---
id: index
title: "Bifröst Warehouse — Help"
sidebar_label: "Bifröst Warehouse — Help"
sidebar_position: 1
slug: /
---

**Bifröst Warehouse** adds read-only warehouse message types to Bifröst Foundation. The app has no pages of its own; use the message types to inspect bin content and open warehouse activities from an external system or agent.

## Message Types

| Message type | Description |
| --- | --- |
| `Warehouse.BinContent.Get` | Lists bin content using item, location, bin, and variant filters. |
| `Warehouse.Activity.Get` | Lists open warehouse activities and optionally includes their lines. |

Call `Help.MessageTypes.Get` to list registered types. Call `Help.Implementation.Get` for either type to retrieve its exact request and response contract.

## Getting Started

1. Install Bifröst Foundation.
2. Install Bifröst Warehouse.
3. Assign the caller a Foundation read permission set; Warehouse extends `BIFROST Read ori` and `BIFROST Full ori`.
4. Send `Warehouse.BinContent.Get` or `Warehouse.Activity.Get` through the Bifröst message queue.

## Learn More

- [Product documentation](/warehouse/) — message types, filters, paging, and requirements
- [Build on Bifröst](/extensibility/)