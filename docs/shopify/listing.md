---
id: listing
title: "Shopify listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "Marketplace description of Bifröst Shopify for Business Central."
---

# Bifrost Shopify

## Search result summary {#search-result-summary}

Run a Shopify shop from an assistant or integration: orders, products, customers, prices, stock and shipments.

## Offer summary {#offer-summary}

Bifröst Shopify connects an assistant, a scheduled routine or an integration to Microsoft's Shopify Connector in Business Central. Import orders, products and customers, create the sales document and the credit memo of a refund, and send prices, stock and posted shipments back to Shopify.

## Full description {#full-description}

Sales and inventory teams can carry a Shopify shop from the assistant they already use. The results remain on the Shopify Connector pages and on the standard sales and inventory pages in Business Central.

Import new and changed orders for one shop, then create the sales order or invoice for an imported order. The answer names the document type and a status of Open, Released, Pending Approval or Pending Prepayment. When the shop is set to auto-create credit memos for returns, that sales-document request is refused before anything changes. Create the credit memo of an imported refund as its own step, and review it before you post it.

Sync products in the direction the shop is set up for. Create items for variants that are already in Business Central, without calling Shopify, and send prices when a price, compare-at price or unit cost has changed. Import customers and update Shopify customers from Business Central according to the shop's customer settings.

Send one posted sales shipment to Shopify as a fulfillment, and send stock levels per location. You can send stock without importing products first, and you can limit that send to one variant.

The app requires Bifröst Foundation, Microsoft's Shopify Connector and the Business Central permissions for the documents being changed. A fulfillment Shopify has accepted is not undone from Business Central. Creating a sales document or a credit memo does not post it. Repeating a request that already did its work does not create a second document.

## Search keywords {#search-keywords}

- Shopify
- Shopify Connector
- Order import
- Inventory sync
- Fulfillment

## Category {#category}

E-commerce

## Requirements and languages {#requirements-and-languages}

- Microsoft Dynamics 365 Business Central, Essentials or Premium, version 28, with Microsoft's Shopify Connector installed and a shop connected.
- Bifröst Foundation and the permissions described in the [overview](./index.md#before-you-start).
- English (United States) and Icelandic (Iceland).

## Help and support {#help-and-support}

- [Product documentation](https://docs.bifrost.origo.is/en-us/shopify/)
- [Support](https://www.origo.is/)
- For pricing, contact your Business Central partner.

See the [user scenarios](./user-scenarios.md) for the work you can do.
