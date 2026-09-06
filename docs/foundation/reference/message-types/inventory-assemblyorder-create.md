---
id: inventory-assemblyorder-create
title: "Inventory.AssemblyOrder.Create"
sidebar_label: "Inventory.AssemblyOrder.Create"
sidebar_position: 77
description: "Request and response contract for the Inventory.AssemblyOrder.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
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
| quantity | Decimal | Yes | Quantity to assemble. Must be `> 0`. |
| variantCode | Code[10] | No | Item variant. |
| locationCode | Code[10] | No | Output location. |
| binCode | Code[20] | No | Output bin within the location. Applied after `Quantity`. |
| unitOfMeasureCode | Code[10] | No | UoM of the parent item. |
| description | Text[100] | No | Header description. |
| postingDate | Date | No | Posting Date. Defaults to `WorkDate()` when omitted or `0D`. Format `0,9` (`yyyy-MM-dd`). |
| dueDate | Date | No | Due Date. Format `0,9`. |
| startingDate | Date | No | Starting Date. Format `0,9`. |
| endingDate | Date | No | Ending Date. Format `0,9`. |
| quantityToAssemble | Decimal | No | Initial value for `Quantity to Assemble`. Applied only when `> 0`; otherwise BC default (= `Quantity`) is kept. |
| refreshLines | Boolean | No | When `true` (default), re-validates `Item No.` after the initial validate to refresh component lines from the BOM. Set `false` to skip the BOM refresh. |

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

