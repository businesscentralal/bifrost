---
id: item-inventory-get
title: "Item.Inventory.Get"
sidebar_label: "Item.Inventory.Get"
sidebar_position: 1
description: "Request and response contract for the Item.Inventory.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns physical on-hand inventory quantities per location for one or more items. No demand, supply, or reservation calculation is performed — only ledger quantities.

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
| `locationFilter` | string | No | BC filter expression applied to location code. Default: per-item `Item."Location Filter"`. |
| `variantCode` | string | No | Restricts entries to a single variant. |

### Request Example
```json
{
  "itemNo": "1896-S",
  "locationFilter": "BLUE|YELLOW"
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
      "inventory": [
        {
          "locationCode": "BLUE",
          "inventory": 50
        }
      ]
    }
  ]
}
```

### Response Fields

| Field | Source |
|---|---|
| `inventory[].locationCode` | Location code from item ledger quantities (non-in-transit). |
| `inventory[].inventory` | Sum of item ledger entry quantity for the item/variant/location. |

Locations marked as in-transit are excluded. Locations with zero inventory for the item are omitted.

## Errors

| Error | Cause |
|---|---|
| `Invalid tableView: field "{token}" does not exist in table 27. Did you mean "{field}"? Valid field names: ...` (`InvalidFilterField`, `parameter: tableView`, `received` is the token) | `tableView` names a field that does not exist, or its parentheses do not balance. No item is returned; the call does not fall back to all unblocked items. |
| `No items found matching the specified criteria.` | Item selection produced an empty set. |

## Related Message Types

- `Item.Availability.Get` — calculated availability (demand/supply) for the same item set.
- `Item.Price.Get` — pricing for the same item/customer.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

