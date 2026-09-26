---
id: item-availability-get
title: "Item.Availability.Get"
sidebar_label: "Item.Availability.Get"
sidebar_position: 94
description: "Request and response contract for the Item.Availability.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns calculated item availability per location: inventory, reservations, gross requirement, scheduled receipts, planned receipts, and `availableQuantity = inventory - qtyReserved + scheduledReceipt + plannedOrderReceipt - grossRequirement`.

**Direction**: Outbound (read-only)  **Content-Type**: `text/json`

## Changes

This message type always returns the calculated-quantity result. Physical on-hand inventory is available separately via `Item.Inventory.Get`. Tenants that previously left the removed Bifrost Setup field `Item Calc. Availability Type` at its default (Physical Inventory) now receive the calculated answer under this name.

## Identifier Resolution Order

Items are resolved as a *range* (the call iterates the resulting set). First non-empty wins:
1. `subject` envelope attribute — GUID = `Item.SystemId`, otherwise `Item.No.`.
2. `data.itemNo`.
3. `data.itemId` / `data.id` / `data.systemId` / `data.recordSystemId` — `Item.SystemId`.
4. `data.tableView` — raw `Item.SetView` string.
5. Fallback: `Item.Blocked = false`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `itemNo` / `itemId` / `tableView` | string / GUID / string | See above | Item selection. |
| `requestedDeliveryDate` | date | No | Format 9. Default: `WorkDate`. Used as the date cutoff for requirements/receipts. |
| `locationFilter` | string | No | BC filter expression applied to `Location.Code`. Default: per-item `Item."Location Filter"`. |
| `variantCode` | string | No | Restricts entries to a single variant. |

### Request Example
```json
{
  "itemNo": "1896-S",
  "locationFilter": "BLUE|YELLOW",
  "requestedDeliveryDate": "2026-02-15"
}
```

## Response Shape

### Success
```json
{
  "status": "Success",
  "items": [
    {
      "itemNo": "1896-S",
      "itemDescription": "ATHENS Desk",
      "baseUnitOfMeasure": "PCS",
      "requestedDeliveryDate": "2026-02-15",
      "availability": [
        {
          "locationCode": "BLUE",
          "inventory": 50,
          "qtyReserved": 5,
          "grossRequirement": 10,
          "scheduledReceipt": 20,
          "plannedOrderReceipt": 0,
          "availableQuantity": 55
        }
      ]
    }
  ]
}
```

### Response Fields

| Field | Source |
|---|---|
| `inventory` | Item ledger quantity for the item/variant/location. |
| `qtyReserved` | Reserved quantity (negated reservation sum). |
| `grossRequirement` | Sum of demand: sales lines, job planning, assembly lines (plus service lines and production components when Premium Experience is enabled). |
| `scheduledReceipt` | Sum of supply: purchase lines, assembly headers, inbound transfer lines (plus production order lines when Premium is enabled). |
| `plannedOrderReceipt` | Planning worksheet and planned production receipts. |
| `availableQuantity` | `inventory - qtyReserved + scheduledReceipt + plannedOrderReceipt - grossRequirement`. |

Locations marked as in-transit are excluded. Locations with zero activity for the item are omitted from the response. When no `locationFilter` is supplied an additional entry for the blank location code is appended.

## Errors

| Error | Cause |
|---|---|
| `No items found matching the specified criteria.` | Item selection produced an empty set. |

## Related Message Types

- `Item.Inventory.Get` — physical on-hand inventory only for the same item set.
- `Item.Price.Get` — pricing for the same item/customer.
- `Data.Records.Get` — raw `Item` record.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

