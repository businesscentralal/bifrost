---
id: inventory-assemblyorder-statistics
title: "Inventory.AssemblyOrder.Statistics"
sidebar_label: "Inventory.AssemblyOrder.Statistics"
sidebar_position: 83
description: "Beiðni- og svarsamningur fyrir Inventory.AssemblyOrder.Statistics Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar header / line / cost statistics fyrir an Assembly Order. Mirrors what BC Page 904 "Assembly Order Statistics" displays - þar á meðal expected vs actual costs broken down með material, resource, capacity, capacity overhead, og manufacturing overhead.

**Stefna**: Innkomandi (lesa-aðeins)  **Efnisgerð**: `text/json`

## Idempotency / Safety
Safe og endurtekningarþolið. Computes via `CalcFields` + `Assembly Header.CalcActualCosts`; no writes occur.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (með `Document Type = Order`).
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Beiðnibreytur
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

## Uppbygging svars
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

| Property | Lýsing |
|----------|-------------|
| status | `Success`. Lookup failures nota the Villa envelope. |
| documentNo / systemId / itemNo / variantCode / Lýsing / locationCode / unitOfMeasureCode | Header echo. `systemId` uses Format `0,4`. |
| quantity / quantityToAssemble / assembledQuantity / remainingQuantity / reservedQuantity | Header quantities. `reservedQuantity` comes úr `CalcFields("Reserved Quantity")`. |
| assembleToOrder | Header `Assemble to Order` flag. |
| status_ | `Open` eða `Released`. Suffix `_` because `status` er reserved fyrir Svarið envelope. |
| postingDate / dueDate / startingDate / endingDate | Format `0,9`. |
| lines.total / .vöru / .resource / .text | Counts of `Assembly Line` rows með `Type` (`Item`, `Resource`, `""`/Text). |
| costs.totalExpectedCost | Header `Cost Amount`. |
| costs.totalActualCost | Sum of the five actual-cost components below. |
| costs.actualMaterialCost / .actualResourceCost / .actualCapacityCost / .actualCapacityOverhead / .actualMfgOverhead | Five-element fylki returned með `Assembly Header.CalcActualCosts` (positions 1..5). Zero áður en posting. |
| costs.unitCost / .indirectCostPercent / .overheadRate | Header costing fields. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Assembly Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, assemblyOrderNo, no.` (`MissingParameter`); gefið en fannst ekki: `Assembly Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No identifier supplied eða lookup mistókst. |

## Tengdar skilaboðategundir
- `Inventory.AssemblyOrder.PreviewPost` - Sjá predicted bók færslur.
- `Inventory.AssemblyOrder.Post` - post the order.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

