---
id: data-totals-get
title: "Data.Totals.Get"
sidebar_label: "Data.Totals.Get"
sidebar_position: 21
description: "Request and response contract for the Data.Totals.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Aggregates one or more Decimal fields across all matching records in a specified Business Central table using `CalcSums`. Returns a single JSON result object with the summed value of each requested field. No row iteration is performed — aggregation is done natively by Business Central.

**Direction**: Outbound (response to request)
**Content-Type**: text/json

## Request Format

### Bifrost Parameters

- **source** (required): Identifies the calling application or system.
- **subject** (optional): Table name or number; can be used instead of `tableName`/`tableNumber` in the data payload.
- **data** (required): JSON object containing the request parameters.

### Input Parameters (in data payload)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tableName` | string | One of table ID params | Table name, e.g. `"Item Ledger Entry"` |
| `tableNumber` / `tableNo` / `tableId` | integer | One of table ID params | Table number, e.g. `32` |
| `fieldNumbers` | array of int | **Required** | Field numbers to sum. All must be Decimal fields (Normal, not FlowField). |
| `tableView` | string | No | BC AL table view filter in SetView format, e.g. `"WHERE(Entry Type=CONST(Purchase))"` |
| `groupBy` | string or int | No | Field name or field number to group by. Returns one result row per distinct value of that field. |

```json
{
  "tableName": "Item Ledger Entry",
  "fieldNumbers": [12, 14],
  "tableView": "WHERE(Entry Type=CONST(Purchase))"
}
```

- `tableName` — or `tableNumber` (alias `tableNo` / `tableId`) to identify the table by number, e.g. `32`.
- `fieldNumbers` — **required**, Decimal field numbers to sum (must be Normal fields, not FlowFields).
- `tableView` — optional BC SetView filter.

> **Note:** `fieldNumbers` is required. Omitting it or sending an empty array returns an error.
> `skip`, `take`, `startDateTime`, and `endDateTime` are **not** supported.

## Response Format

`result` is **always an array**. Without `groupBy` it contains one element with `group: ""`. With `groupBy` it contains one element per distinct group value.

Without `groupBy`:
```json
{
  "status": "Success",
  "result": [
    { "group": "", "Quantity": 12500.00, "InvoicedQuantity": 11200.50 }
  ]
}
```

With `groupBy: "Entry Type"`:
```json
{
  "status": "Success",
  "result": [
    { "group": "Purchase", "Quantity": 8500.00, "InvoicedQuantity": 8500.00 },
    { "group": "Sale",     "Quantity": -7200.00, "InvoicedQuantity": -7200.00 }
  ]
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"Success"` on the happy path, `"Error"` on failure |
| `result` | array | One object per group. Each object has `group` (empty string when no `groupBy`) plus one numeric key per requested field. |

If `tableView` filters out all records, `CalcSums` returns 0 for each field — this is not an error.

## Field Name Convention

JSON keys in the `result` object are derived from BC field names using the same stripping rule as `Data.Records.Get`:

1. Characters `%`, `.`, `"`, `\`, `/`, `'` are replaced with `_`
2. All remaining characters not in `[a-zA-Z0-9_]` are removed

| BC Field Name | JSON Key |
|---------------|----------|
| `Quantity` | `Quantity` |
| `Invoiced Quantity` | `InvoicedQuantity` |
| `Cost Amount (Actual)` | `CostAmountActual` |
| `Sales (LCY)` | `SalesLCY` |

## CalcSums Requirement

`Data.Totals.Get` uses the Business Central `CalcSums` function, which requires each requested field to be:

- **Type Decimal** — integer and other numeric types are not supported
- **Normal field class** — FlowFields cannot be summed (use Data.Records.Get with fieldNumbers to calculate individual FlowFields instead)

If a field does not meet these requirements, BC raises a runtime error.

## Usage Example

### Request — sum Quantity and Invoiced Quantity for all Purchase entries
```json
{
  "specversion": "1.0",
  "type": "Data.Totals.Get",
  "source": "my-integration",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Item Ledger Entry",
    "fieldNumbers": [12, 14],
    "tableView": "WHERE(Entry Type=CONST(Purchase))"
  }
}
```

### Response
```json
{
  "status": "Success",
  "result": [
    { "group": "", "Quantity": 8500.00, "InvoicedQuantity": 7200.00 }
  ]
}
```

### Request — group by Entry Type
```json
{
  "tableName": "Item Ledger Entry",
  "fieldNumbers": [12, 14],
  "groupBy": "Entry Type"
}
```
### Response
```json
{
  "status": "Success",
  "result": [
    { "group": "Purchase", "Quantity": 1207482, "InvoicedQuantity": 1207482 },
    { "group": "Sale",     "Quantity": -8765499, "InvoicedQuantity": -8765499 }
  ]
}
```

## Error Handling

| Condition | Response |
|-----------|----------|
| `fieldNumbers` missing or empty array | `{"status":"Error","error":"fieldNumbers is required and must contain at least one field number."}` |
| Table not identified | Error raised by table evaluation |
| Read permission denied | `{"status":"Error","error":"Read permission denied for table {n}."}` |
| Field number does not exist | `{"status":"Error","error":"Field {n} does not exist in table {t}."}` |
| Field is not Decimal type | `{"status":"Error","error":"Field {n} ({name}) in table {t} is not of type Decimal."}` |
| Field is read-restricted | `{"status":"Error","error":"Read access to field {n} ({name}) in table {t} is restricted."}` |
| Field not Decimal or not Normal | AL runtime error propagates as task failure |
| No records match tableView | Returns 0 for each field (not an error) |

## Related Message Types

- **Data.Records.Get** — returns full record data as JSON with pagination; supports the same table identification and tableView parameters
- **Data.RecordIds.Get** — returns only record IDs and modification timestamps
- **Help.Fields.Get** — returns field metadata including field class (Normal/FlowField/FlowFilter) and data type

