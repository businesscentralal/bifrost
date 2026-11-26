---
id: user-scenarios
title: "Shopify user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 5
description: "Import a Shopify shop, create the sales document and the credit memo, and send prices, stock and shipments."
---

# Shopify user scenarios

These scenarios help an administrator, or a sales and inventory user, work with one connected Shopify shop from an assistant or integration and review the result in Business Central. Complete the [prerequisites](./index.md#before-you-start) first. The examples describe the outcome to request; your assistant reads the available operations from your installed environment.

## Bring orders in {#bring-orders-in}

1. Enable the shop and confirm it is connected to Shopify. For this scenario, set **Return and Refund Process** to a value other than **Auto Create Credit Memo**.
2. Ask the assistant to import new and changed orders for that shop.
3. Open the imported orders in Business Central and select one that has no sales document yet.
4. Ask the assistant to create the sales document for that order.
5. Open the sales order or invoice and check the customer, lines and amounts. Do not post it until the review is done.

**Result:** the order has a sales order or invoice. The answer names the document type and a status of Open, Released, Pending Approval or Pending Prepayment, with those words in every language. Asking again for the same order reports that the sales document already exists. Importing again does not duplicate orders that have not changed. If the import stops part way, orders already saved stay; review them before you import again.

## When the shop creates credit memos automatically {#credit-memos-automatic}

1. Set **Return and Refund Process** on the shop to **Auto Create Credit Memo**.
2. Ask the assistant to create the sales document for an imported order that has no sales document.

**Result:** the request is refused before anything changes, because that run would also create credit memos for refunds it was not asked to handle. No sales document is created. Create the credit memo of a refund as its own request, described below, or use a shop setting that does not create those credit memos inside the sales-document run.

## Products, items and prices {#products-items-prices}

1. Set the shop's item sync the way the company works. A shop with no item-sync direction does not move products.
2. Ask the assistant to sync products for the shop. Review new and changed items, and the product mapping, in Business Central.
3. For one product whose variants are not items yet, ask the assistant to create the items. This does not call Shopify. Confirm the item template the connector needs is in place.
4. Change a price in Business Central and ask the assistant to send prices for the shop. Review the variant prices in Shopify.

**Result:** products follow the shop's sync direction. A variant that is already mapped, or an item that already exists for the SKU, is not created again. A second price send with unchanged prices sends nothing. If the price send fails, the variants are put back and can be sent again. If the product sync stops part way, products already saved stay.

## Customers {#customers}

1. Confirm the shop's settings for importing customers from Shopify and for updating Shopify customers from Business Central.
2. Ask the assistant to sync customers for the shop.
3. Review the mapped customers in Business Central, and the updated customers in Shopify when the shop is allowed to update them.

**Result:** customers already mapped are matched, not created again. What moves follows the shop settings. A customer is reported as created or updated when that change was saved.

## Ship an order and send stock {#ship-and-stock}

1. Post the sales shipment for a Shopify order that has not been fulfilled.
2. Ask the assistant to send that posted shipment to Shopify as a fulfillment. Review the fulfillment in Shopify.
3. Ask the assistant to send stock for the shop. You can ask it to send stock without importing products first, and to limit the send to one variant.
4. Review the stock levels in Shopify.

**Result:** the shipment has a fulfillment. Asking again for the same shipment is refused. A fulfillment Shopify has accepted is not undone from Business Central. If the send fails before Shopify accepts it, try that shipment again. Stock levels match what Business Central sent, and sending the same stock again leaves Shopify unchanged. If the stock send stops part way, review which variants were updated before you run it again.

## Credit memo for a refund {#refund-credit-memo}

1. Set **Return and Refund Process** on the shop to **Auto Create Credit Memo**.
2. Use a refund that is already imported and not yet processed.
3. Ask the assistant to create the credit memo for that refund.
4. Open the credit memo in Business Central and check the customer, lines and amounts before you post it.

**Result:** a credit memo from the shop's refund process. Creating it does not post it. A second request reports that the refund is already processed. If the shop is not set to auto-create the credit memo, the request is refused and nothing is created.

## A request that cannot run {#request-that-cannot-run}

1. Ask the assistant to import orders for a shop code that does not exist, or for a shop that is not enabled.
2. Ask it to create items when the item template the connector needs is missing.

**Result:** the request is refused and says what is wrong. It does not change records the connector had not already saved. Fix the cause and run it again.

For the changes included in the app, see the [release notes](./release-notes.md).
