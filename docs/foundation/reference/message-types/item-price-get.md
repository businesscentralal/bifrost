---
id: item-price-get
title: "Item.Price.Get"
sidebar_label: "Item.Price.Get"
sidebar_position: 95
description: "Request and response contract for the Item.Price.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns the best-applicable price list lines for one or more items, optionally evaluated against a specific customer (with the customer's VAT/Gen/Customer posting groups). The active implementation is resolved from `Bifrost Setup.Item Price Implementation`; default is `Default Price Impl` (codeunit 65334).

**Direction**: Outbound (read-only)  **Content-Type**: `text/json`

## Identifier Resolution Order

Items are resolved via `FindItemRange` (same precedence as `Item.Availability.Get`). Customer is optional and resolved from JSON only:
- `customerNo` (Customer `No.`)
- `customerId` / `customerRecordId` / `customerSystemId` (Customer `SystemId`)

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `itemNo` / `itemId` / `tableView` | string / GUID / string | See above | Item selection. |
| `customerNo` / `customerId` / `customerRecordId` / `customerSystemId` | string / GUID | No | When supplied, evaluates customer-specific best price. |
| `variantCode` | string | No | Filters returned lines to a single variant. |
| `requestedDeliveryDate` | date | No | Format 9. Default: `WorkDate`. Used as the price-list line date filter. |
| `quantity` | decimal | No | Quantity for tier evaluation. Default: `1` (a `0` value is treated as `1`). |

### Request Example
```json
{
  "itemNo": "1896-S",
  "customerNo": "10000",
  "quantity": 5,
  "requestedDeliveryDate": "2026-02-15"
}
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "priceListLines": [
    {
      "priceListCode": "RETAIL",
      "lineNo": 10000,
      "itemNo": "1896-S",
      "unitOfMeasureCode": "PCS",
      "qtyPerUnitOfMeasure": 1,
      "minimumQuantity": 0,
      "amountType": "Price",
      "unitPrice": 1000.00,
      "unitPriceExclVAT": 1000.00,
      "unitPriceInclVAT": 1240.00,
      "lineDiscountPct": 0,
      "vatPct": 24,
      "baseUnitOfMeasure": "PCS",
      "itemSystemId": "11111111-2222-3333-4444-555555555555"
    }
  ]
}
```

### Response Fields

| Field | Source |
|---|---|
| `unitPrice` | Raw price-list `Unit Price`. |
| `unitPriceExclVAT` / `unitPriceInclVAT` | Derived via `Price Calculation`: excludes/includes VAT according to the price-list line. |
| `vatPct` | From `VAT Posting Setup` for the resolved VAT Bus./Prod. groups. |
| `startingDate` / `endingDate` | Emitted only when the price-list line specifies validity dates. |

When a customer is supplied, the lines come from `Sales Price Buffer.AddBestPriceForCustomer`. Without a customer, lines come from `PopulateFromQuery` (extended price calc enabled) or `AddItemCardPrice` (legacy).

## Examples (from unit tests)

From `Item Price Calculation Tests` (`test/test/Sales/ItemPriceCalculationTests.Codeunit.al`) — covers single item, multi-item via `tableView`, with/without customer, quantity tiers, variants, and the VAT/posting-group validation errors below.

## Errors

| Error | Cause |
|---|---|
| `No items found matching the specified criteria.` | `FindItemRange` produced an empty set. |
| `VAT Bus. Posting Gr. (Price) must have a value in Sales & Receivables Setup.` | `Sales & Receivables Setup."VAT Bus. Posting Gr. (Price)"` is blank — pricing cannot be evaluated. |
| `Customer not found or invalid. Please provide a valid customerNo, customerId, customerRecordId, or customerSystemId in the request.` | Customer key was supplied but did not match a `Customer` record. |
| `Customer {no} must have a VAT Bus. Posting Group.` | Resolved customer is missing `VAT Bus. Posting Group`. |
| `Customer {no} must have a Gen. Bus. Posting Group.` | Resolved customer is missing `Gen. Bus. Posting Group`. |
| `Customer {no} must have a Customer Posting Group.` | Resolved customer is missing `Customer Posting Group`. |

## Related Message Types

- `Item.Availability.Get` — availability of the same item set.
- `Customer.SalesHistory.Get` — items recently sold to a customer.

