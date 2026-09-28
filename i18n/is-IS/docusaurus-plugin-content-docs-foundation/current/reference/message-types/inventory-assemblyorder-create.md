---
id: inventory-assemblyorder-create
title: "Inventory.AssemblyOrder.Create"
sidebar_label: "Inventory.AssemblyOrder.Create"
sidebar_position: 77
description: "Beiðni- og svarsamningur fyrir Inventory.AssemblyOrder.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Overview
Creates a new Assembly Order (Assembly Header with `Document Type = Order`) for a parent item. The header `No.` is assigned from the Assembly Order No. Series. By default the component lines are refreshed from the parent item BOM via `Item No.` re-validation.

**Direction**: Inbound  **Content-Type**: `text/json`

## Idempotency / Safety
Not idempotent. Every call inserts a new Assembly Order header and consumes one number from the Assembly Order No. Series, and (when `refreshLines = true`, the default) re-creates component lines from the BOM.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| itemNo | Code[20] | Yes | Parent (assembled) item number. |
| quantity | Decimal | Yes | JSON number, or a string with `.` and no thousands separator. Must be `> 0`. An invalid value is an error. |
| variantCode | Code[10] | No | Item variant. |
| locationCode | Code[10] | No | Output location. |
| binCode | Code[20] | No | Output bin within the location. Applied after `Quantity`. |
| unitOfMeasureCode | Code[10] | No | UoM of the parent item. |
| description | Text[100] | No | Header description. |
| postingDate | Date | No | `YYYY-MM-DD`. Omitted: `WorkDate()`. An invalid value is an error. |
| dueDate | Date | No | `YYYY-MM-DD`. Omitted: blank. An invalid value is an error. |
| startingDate | Date | No | `YYYY-MM-DD`. Omitted: blank. An invalid value is an error. |
| endingDate | Date | No | `YYYY-MM-DD`. Omitted: blank. An invalid value is an error. |
| quantityToAssemble | Decimal | No | JSON number, or a string with `.` and no thousands separator. Applied only when `> 0`; otherwise BC default (= `Quantity`) is kept. An invalid value is an error. |
| refreshLines | Boolean | No | When `true` (default), re-validates `Item No.` after the initial validate to refresh component lines from the BOM. Set `false` to skip the BOM refresh. `true` or `false`; any other value is an error. |

## Request Example
```json
{
  "type": "Inventory.AssemblyOrder.Create",
  "data": {
    "itemNo": "BICYCLE",
    "quantity": 5,
    "locationCode": "BLUE",
    "dueDate": "2026-05-30",
    "refreshLines": true
  }
}
```

## Response Shape
```json
{
  "status": "Success",
  "documentNo": "AO000123",
  "systemId": "00000000-0000-0000-0000-000000000000",
  "itemNo": "BICYCLE",
  "variantCode": "",
  "description": "Bicycle",
  "locationCode": "BLUE",
  "binCode": "",
  "unitOfMeasureCode": "PCS",
  "quantity": 5,
  "quantityToAssemble": 5,
  "postingDate": "2026-04-15",
  "dueDate": "2026-05-30",
  "startingDate": "2026-04-15",
  "endingDate": "2026-05-30",
  "statusAfter": "Open",
  "lineCount": 3
}
```

| Property | Description |
|----------|-------------|
| status | `Success`. Validation failures use the standard error envelope. |
| documentNo | New `Assembly Header.No.` (from No. Series). |
| systemId | New header `SystemId` (Format `0,4`, no braces). |
| itemNo / variantCode / description / locationCode / binCode / unitOfMeasureCode | Header echo after BC validation (may differ from request if defaults applied). |
| quantity / quantityToAssemble | Header values after validation. |
| postingDate / dueDate / startingDate / endingDate | Format `0,9` (`yyyy-MM-dd`). BC computes the dates not supplied explicitly. |
| statusAfter | `Open` (newly created orders are always Open). |
| lineCount | Number of `Assembly Line` rows. `0` when `refreshLines = false`, otherwise the BOM line count. |

## Errors
| Error | Cause |
|-------|-------|
| `itemNo must be specified in the request JSON.` | `itemNo` missing or empty. |
| `quantity must be specified and greater than 0 in the request JSON.` | `quantity` missing or `<= 0`. |
| (BC validation error text) | Any `Validate` call surfaced an error (unknown item, invalid location, missing BOM, etc.). Caught and returned in `error`. |

## Related Message Types
- `Inventory.AssemblyOrder.RefreshLines` - refresh BOM lines on an existing order.
- `Inventory.AssemblyOrder.Release` - release an Open order.
- `Inventory.AssemblyOrder.Post` - post.
- `Inventory.AssemblyOrder.PreviewPost` - dry run.
- `Data.Records.Set` - adjust component lines.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

