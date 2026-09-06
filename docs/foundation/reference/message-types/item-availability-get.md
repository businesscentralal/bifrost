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

Returns calculated item availability per location: inventory, reservations, gross requirement, scheduled receipts, planned receipts, and `availableQuantity = inventory - qtyReserved + scheduledReceipt + plannedOrderReceipt - grossRequirement`. The active implementation is resolved from `Bifrost Setup.Item Availability Implementation`; default is `Calculated Quantity Impl` (codeunit 65333).

**Direction**: Outbound (read-only)  **Content-Type**: `text/json`

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
| `inventory` | `Item Ledger Entry.CalcSums(Quantity)` for the item/variant/location. |
| `qtyReserved` | `Reservation Entry.CalcSums(Quantity)` negated. |
| `grossRequirement` | Sum of demand: Sales Lines + Job Planning + Assembly Lines (+ Service Lines and Prod Order Components when the Premium Experience is enabled). |
| `scheduledReceipt` | Sum of supply: Purchase Lines + Assembly Header + inbound Transfer Lines (+ Prod Order Lines when Premium is enabled). |
| `plannedOrderReceipt` | Planning worksheet receipts. |
| `availableQuantity` | `inventory - qtyReserved + scheduledReceipt + plannedOrderReceipt - grossRequirement`. |

Locations marked `Use As In-Transit` are excluded. Locations with zero activity for the item are omitted from the response. When no `locationFilter` is supplied an additional entry for the blank location code is appended.

## Configuration

Alternative implementation: `Physical Inventory Impl` (codeunit 65332) returns only physical inventory and reservations. Switch via `Bifrost Setup.Item Availability Implementation`.

## Examples (from unit tests)

From `Item Availability Tests` (`test/test/Sales/ItemAvailabilityTests.Codeunit.al`) — exercises item-by-No., item-by-SystemId, `locationFilter`, `variantCode`, requested delivery date, and the inventory/reservation/requirement aggregation paths.

## Errors

| Error | Cause |
|---|---|
| `No items found matching the specified criteria.` | `FindItemRange` produced an empty set. |

## Related Message Types

- `Item.Price.Get` — pricing for the same item/customer.
- `Data.Records.Get` — raw `Item` record.

