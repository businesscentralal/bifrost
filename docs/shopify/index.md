---
id: index
title: "Bifröst Shopify"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Shopify orders, products, customers, prices, stock and shipments from an assistant or integration."
---

# Bifröst Shopify

**Bring a Shopify shop into the assistant you already use.** Bifröst Shopify lets an assistant, a scheduled routine or an integration run the Shopify work that sits on the shop in Business Central: import orders, products and customers, create the sales document and the credit memo, and send prices, stock and shipments back to Shopify.

It runs the logic of Microsoft's **Shopify Connector**. The results appear on the connector's shop, order, product and customer pages, and on the standard sales and inventory pages, so you review them where you always do.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with [How Bifröst works](/documentation/how-it-works/).*

## What you can do {#what-you-can-do}

- **Bring orders in.** Fetch new and changed orders for one enabled shop. A later run picks up only what changed.
- **Create the sales document.** Create the sales order or invoice for one imported order. The answer names the document type and its status: Open, Released, Pending Approval or Pending Prepayment, with those same words in every language.
- **Create the credit memo for a refund.** Create the credit memo of one imported refund, using the shop's refund process.
- **Keep products aligned.** Import products from Shopify and export changed items, as the shop is set up. Create and map items for the variants of a product that is already in Business Central. Send prices when only the price should move.
- **Keep customers aligned.** Import Shopify customers and update Shopify customers from Business Central, following the shop's own customer settings.
- **Tell Shopify what shipped.** Send one posted sales shipment of a Shopify order to Shopify as a fulfillment.
- **Send stock.** Send the stock level of each location for one enabled shop. You can send stock without importing products first, and you can limit the send to one variant.

## Capabilities {#capabilities}

| Domain | Capabilities |
|---|---|
| **Sales** | Orders into Business Central, the sales order or invoice, customer import and update, the credit memo of a refund, and the fulfillment of a posted shipment |
| **Inventory** | Product import and export, items for product variants, prices sent to Shopify, and stock levels per location |

## Before you start {#before-you-start}

1. Follow [Set it up](/setup/) to prepare Bifröst Foundation and connect your assistant or integration.
2. Install Microsoft's **Shopify Connector**. Create the shop, enable it and connect it to Shopify. Set item sync, customer import and the return and refund process the way the company works.
3. Install **Bifrost Shopify** next to Bifröst Foundation.
4. Give each person or service that may change Shopify data the permission set **Bifrost Shopify Full** (`SHOPIFY Full ori`), next to their Foundation permissions and the Microsoft Shopify permissions for the documents they touch. Use **Bifrost Shopify Read** (`SHOPIFY Read ori`) when they should not change data.

The app has no pages of its own. Review the shop, orders, products and customers on the Shopify Connector pages, and the sales documents, credit memos and shipments on the standard Business Central pages. Help in Business Central opens this overview.

## Good to know {#good-to-know}

- **It acts as you.** These permission sets do not replace the Microsoft Shopify permissions. The user's own permissions still apply, and every call is logged in the company's Business Central.
- **A shop that creates credit memos automatically cannot create the sales document this way.** When **Return and Refund Process** on the shop is **Auto Create Credit Memo**, creating the sales document is refused before anything changes, because that run would also create credit memos for refunds it was not asked to handle. Create the credit memo of each refund on its own, or use a shop whose return process does not create those credit memos inside the sales-document run.
- **Some runs keep what they already saved.** Importing orders, syncing products and sending stock can leave the records saved before a later failure. Review what arrived, then run again for what is still missing. Sending prices is different: a failed send puts the shop's variants back, so the next send can try again.
- **A fulfillment is a write to Shopify.** A shipment that already has a fulfillment is refused. If the send fails before Shopify accepts it, the shipment can be tried again. A fulfillment Shopify has accepted stays.
- **Items are created from data already in Business Central.** Creating items does not call Shopify and does not import the product. A variant that is already mapped, or an item that already exists for the SKU, is mapped instead of created again. The company needs the item template the connector asks for.
- **Prices follow the shop.** A variant is sent when its price, compare-at price or unit cost differs from what Shopify has. A second send with the same prices sends nothing.
- **Customers follow the shop settings.** What is imported and what is updated is the shop's customer setup. Customers already mapped are matched, not created again.
- **A refund credit memo is created once.** A second request for the same refund reports that it is already processed. The shop must be set to auto-create the credit memo. The credit memo is not posted for you.

## Get it {#get-it}

Install **Bifrost Shopify** next to Bifröst Foundation and Microsoft's **Shopify Connector**. Your Business Central partner installs it. It needs Business Central Essentials or Premium, version 28, with the Shopify Connector installed and a shop connected. For the price, contact your Business Central partner.

Next: follow the [user scenarios](./user-scenarios.md), or read the [release notes](./release-notes.md).
