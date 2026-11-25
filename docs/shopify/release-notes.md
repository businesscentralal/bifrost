---
id: release-notes
title: "Shopify release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "Customer-facing changes in Bifröst Shopify."
---

# Bifröst Shopify release notes

These notes help sales, inventory and administrator teams review what the app changes. To check your installed version, open **Extension Management** in Business Central.

## 28.0.0.0 — Unreleased {#v28-0-0-0}

### Initial capabilities {#initial-capabilities}

- Import new and changed orders for one shop. A later import does not duplicate orders that have not changed. Orders saved before a failure stay.
- Create the sales order or invoice of one imported order. The answer names the document type and the status Open, Released, Pending Approval or Pending Prepayment, with those words in every language. Asking again reports that the sales document already exists. When **Return and Refund Process** on the shop is **Auto Create Credit Memo**, the request is refused before anything changes.
- Create the credit memo of one imported refund when the shop auto-creates credit memos. A second request reports that the refund is already processed. The credit memo is not posted for you.
- Sync products in the direction the shop is set up for, and create items for the variants of a product already in Business Central. Creating items does not call Shopify. A variant already mapped, or an item that already exists for the SKU, is mapped instead of created again.
- Send prices for variants whose price, compare-at price or unit cost changed. A failed send puts the variants back. A second send with the same prices sends nothing.
- Import Shopify customers and update Shopify customers from Business Central, following the shop's customer settings. Customers already mapped are matched, not created again.
- Send one posted sales shipment to Shopify as a fulfillment. A shipment that already has a fulfillment is refused. A fulfillment Shopify has accepted stays.
- Send stock levels per location for one enabled shop. You can send stock without importing products first, and you can limit the send to one variant. Sending the same stock again leaves Shopify unchanged.
- English (United States) and Icelandic (Iceland). **Bifrost Shopify Full** (`SHOPIFY Full ori`) may change data. **Bifrost Shopify Read** (`SHOPIFY Read ori`) may not. Microsoft Shopify permissions are still required.

### Requirements {#requirements}

This version requires Bifröst Foundation **28.0.5.590** or later and Microsoft's Shopify Connector **28.0.0.0** or later, on Business Central 28.

See the [overview](./index.md) for setup and the [user scenarios](./user-scenarios.md) for the work to review before you post a document or send a fulfillment.
