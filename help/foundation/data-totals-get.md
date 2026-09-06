---
id: data-totals-get
title: "Data.Totals.Get"
sidebar_label: "Data.Totals.Get"
sidebar_position: 35
---

Outbound  Content-Type: `text/json`

Aggregates one or more Decimal fields across all matching records in a specified Business Central table using the native `CalcSums` function. No record iteration is performed — aggregation is done natively by the BC server. Returns a single JSON result object with one key/value pair per requested field.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `tableName` | string | One of table ID params | Table name, e.g. `"Item Ledger Entry"` |
| `tableNumber` / `tableNo` / `tableId` | integer | One of table ID params | Table number, e.g. `32` |
| `fieldNumbers` | array of integers | Required | Field numbers to sum. All must be Decimal fields and defined as SumIndexFields (SIFT keys) on the table. Missing or empty array returns an error. |
| `tableView` | string | Optional | BC AL table view filter in SetView format, e.g. `"WHERE(Entry Type=CONST(Purchase))"`. If no records match, `CalcSums` returns 0 for each field — this is not an error. |

**Note:** `skip`, `take`, `startDateTime`, and `endDateTime` are **not** supported.

## Response Format

```
{
  "status": "Success",
  "result": {
    "Quantity": 12500.00,
    "InvoicedQuantity": 11200.50
  }
}
```

## Field Name Convention

JSON keys in the `result` object are derived from BC field names using the same stripping rule as `Data.Records.Get`:

1.  Characters `%`, `.`, `"`, `\`, `/`, `'` are replaced with `_`
2.  All remaining characters outside `[a-zA-Z0-9_]` (e.g. spaces) are removed

| BC Field Name | JSON Key |
| --- | --- |
| `Quantity` | `Quantity` |
| `Invoiced Quantity` | `InvoicedQuantity` |
| `Cost Amount (Actual)` | `CostAmountActual` |
| `Sales (LCY)` | `SalesLCY` |

## CalcSums Requirement

`Data.Totals.Get` uses the BC `CalcSums` function, which requires each requested field to be:

-   **Type Decimal** — Integer and other numeric types are not supported (returns an error)
-   **Defined as a SumIndexField** on one of the table's SIFT keys — non-SIFT fields cause a BC runtime error

Use the `Help.Fields.Get` message type to inspect field metadata and verify SumIndexField status before calling this message type.

## Error Handling

| Condition | Response |
| --- | --- |
| `fieldNumbers` missing or empty array | `{"status":"Error","error":"fieldNumbers is required and must contain at least one field number."}` |
| Table not identified | Error propagated from table evaluation |
| Read permission denied | `{"status":"Error","error":"Read permission denied for table {n}."}` |
| Field number does not exist in table | `{"status":"Error","error":"Field {n} does not exist in table {t}."}` |
| Field is not of type Decimal | `{"status":"Error","error":"Field {n} ({name}) in table {t} is not of type Decimal."}` |
| Field is read-restricted | `{"status":"Error","error":"Read access to field {n} ({name}) in table {t} is restricted."}` |
| Field is not a SumIndexField | BC runtime error propagates as task failure |
| No records match `tableView` | Returns 0 for each field — not an error |

## Usage Example

### Request — Sum Quantity and Invoiced Quantity for Purchase entries

```
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

```
{
  "status": "Success",
  "result": {
    "Quantity": 8500.00,
    "InvoicedQuantity": 7200.00
  }
}
```

## Related Message Types

-   **Data.Records.Get** — full record data as JSON with pagination; same table identification and `tableView` parameters
-   **Data.RecordIds.Get** — returns only record IDs and modification timestamps
-   **Help.Fields.Get** — returns field metadata including whether a field is a SumIndexField
