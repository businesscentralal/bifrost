---
id: inventory-assemblyorder-statistics
title: "Inventory.AssemblyOrder.Statistics"
sidebar_label: "Inventory.AssemblyOrder.Statistics"
sidebar_position: 83
description: "Request and response contract for the Inventory.AssemblyOrder.Statistics Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns header / line / cost statistics for an Assembly Order. Mirrors what BC Page 904 "Assembly Order Statistics" displays - including expected vs actual costs broken down by material, resource, capacity, capacity overhead, and manufacturing overhead.

**Direction**: Inbound (read-only)  **Content-Type**: `text/json`

## Idempotency / Safety
Safe and idempotent. Computes via `CalcFields` + `Assembly Header.CalcActualCosts`; no writes occur.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (with `Document Type = Order`).
3. Request JSON keys (every key supplied is tried; identifiers that point to different records are refused): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Request Parameters
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.Statistics", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.Statistics",
  "data": { "documentNo": "AO000123" }
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
  "unitOfMeasureCode": "PCS",
  "quantity": 5,
  "quantityToAssemble": 5,
  "assembledQuantity": 0,
  "remainingQuantity": 5,
  "reservedQuantity": 0,
  "assembleToOrder": false,
  "status_": "Open",
  "postingDate": "2026-04-15",
  "dueDate": "2026-05-30",
  "startingDate": "2026-04-15",
  "endingDate": "2026-05-30",
  "lines": { "total": 3, "item": 2, "resource": 1, "text": 0 },
  "costs": {
    "totalExpectedCost": 1250,
    "totalActualCost": 0,
    "actualMaterialCost": 0,
    "actualResourceCost": 0,
    "actualCapacityCost": 0,
    "actualCapacityOverhead": 0,
    "actualMfgOverhead": 0,
    "unitCost": 250,
    "indirectCostPercent": 0,
    "overheadRate": 0
  }
}
```

| Property | Description |
|----------|-------------|
| status | `Success`. Lookup failures use the error envelope. |
| documentNo / systemId / itemNo / variantCode / description / locationCode / unitOfMeasureCode | Header echo. `systemId` uses Format `0,4`. |
| quantity / quantityToAssemble / assembledQuantity / remainingQuantity / reservedQuantity | Header quantities. `reservedQuantity` comes from `CalcFields("Reserved Quantity")`. |
| assembleToOrder | Header `Assemble to Order` flag. |
| status_ | `Open` or `Released`. Suffix `_` because `status` is reserved for the response envelope. |
| postingDate / dueDate / startingDate / endingDate | Format `0,9`. |
| lines.total / .item / .resource / .text | Counts of `Assembly Line` rows by `Type` (`Item`, `Resource`, `""`/Text). |
| costs.totalExpectedCost | Header `Cost Amount`. |
| costs.totalActualCost | Sum of the five actual-cost components below. |
| costs.actualMaterialCost / .actualResourceCost / .actualCapacityCost / .actualCapacityOverhead / .actualMfgOverhead | Five-element array returned by `Assembly Header.CalcActualCosts` (positions 1..5). Zero before posting. |
| costs.unitCost / .indirectCostPercent / .overheadRate | Header costing fields. |

## Errors
| Error | Cause |
|-------|-------|
| `Assembly Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, assemblyOrderNo, no.` (`MissingParameter`) | No identifier in `subject` or the request JSON. |
| `Assembly Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | An identifier was given but matches no record; `parameter` and `received` name it. Every identifier supplied is tried. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Two identifiers were given that resolve to different records. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | A SystemId or entry number that cannot be read. |

## Related Message Types
- `Inventory.AssemblyOrder.PreviewPost` - see predicted ledger entries.
- `Inventory.AssemblyOrder.Post` - post the order.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

