---
id: data-records-get
title: "Data.Records.Get"
sidebar_label: "Data.Records.Get"
sidebar_position: 18
description: "Request and response contract for the Data.Records.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Reads records from any non-restricted BC table and returns them as JSON in the Data Shipping standard format (`{id, primaryKey, fields}`). Supports field projection, BC table view filtering, `SystemModifiedAt` date range, and `skip`/`take` pagination.

**Direction**: Outbound  **Content-Type**: `text/json`

## Identifier Resolution Order (table)

The target table is resolved by checking these keys in order and using the first one present:
1. `data.tableName` (string, e.g. `"Customer"`)
2. `data.tableNumber` (integer, e.g. `18`)
3. `data.tableNo` (alias for `tableNumber`)
4. `data.tableId` (alias for `tableNumber`)
5. `subject` envelope attribute (table name or number as string, e.g. `"Customer"` or `"18"`)

## Request Parameters (in data)

| Parameter | Type | Default | Notes |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | string / int | — | One required (or `subject`). See resolution order above. |
| `fieldNumbers` | int[] | all Normal fields | When set, only these field numbers are returned in `fields`. FlowFields are calculated and included **only** when listed here. Primary-key fields are always in `primaryKey` regardless. |
| `tableView` | string | — | BC `SetView` syntax, e.g. `"WHERE(Blocked = CONST( ))"` or `"WHERE(Location Code = CONST(BLUE))"` |
| `startDateTime` / `endDateTime` | ISO 8601 | — | Filter on `SystemModifiedAt`. Provide both. |
| `skip` | int | 0 | Pagination offset. |
| `take` | int | 100 | Page size. `noOfRecords` in the response is the unpaginated total. |

## Response Shape

```json
{
  "status": "Success",
  "noOfRecords": 245,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "No_": "10000" },
      "fields":     { "Name": "Contoso Ltd.", "Address": "123 Main St" }
    }
  ]
}
```

### Per-record properties

| Property | Description |
|---|---|
| `id` | `SystemId` GUID, formatted without braces (`Format(guid, 0, 4)`). |
| `primaryKey` | Object — primary key field(s) only. Always present. |
| `fields` | Object — non-primary-key field(s). Subject to `fieldNumbers` and field-read restrictions. |

### Field name normalization

Keys in `primaryKey` and `fields` are derived from BC field names by:
1. Replacing `%`, `.`, `"`, `\`, `/`, `'` with `_`
2. Removing all other non-alphanumeric characters

| BC Field | JSON Key |
|---|---|
| `No.` | `No_` |
| `Sell-to Customer No.` | `SelltoCustomerNo_` |
| `Balance (LCY)` | `BalanceLCY` |

### Value formatting

- **GUID**: bare form (`Format(value, 0, 4)`).
- **Date / Time / DateTime / Decimal / Integer / etc.**: culture-invariant (`Format(value, 0, 9)`). Blank `0D` / `0T` / `0DT` render as empty string.
- **Option / Enum**: returned as the **display caption** (not the internal name). Use `Help.Fields.Get` to discover the option set if you need to filter.
- **BLOB / Media / MediaSet**: Base64-encoded.
- **Currency / LCY fields** with a `Currency Code` relation are auto-converted (see DataRecordsGetImpl `ShouldApplyLCYConversion`).
- **Dimension Set ID** fields are auto-expanded to a `Dimensions` object via `AddDimensionSetConversion`.

## Field Access Restrictions

Per-user field-level read restrictions are enforced via `Bifrost Field Access` (codeunit 65350). When a field carries restriction type `Both` or `Read` for the current user (or a wildcard entry matches), the field is **silently dropped** from the `fields` object — no error is raised. Primary-key fields are always returned. Use `Help.Fields.Get` to discover the `readRestricted` flag per field before relying on a value being present in the response.

Wildcards: `Field No. = 0` covers all fields on a table; `Table No. = 0` covers all tables for the user. Resolution order: specific entry → all-fields wildcard → all-tables wildcard. First match wins; no match means unrestricted.

## Discovery Workflow

When you don't know the table or field numbers:
1. `Help.Tables.Get` — list tables and IDs.
2. `Help.Fields.Get` (with the chosen table) — list fields, types, captions, and read/write restrictions.
3. `Data.Records.Get` — fetch a sample record (e.g. `take: 1`) to see exact JSON key names.

## Examples (from unit tests)

### All fields, all records
```json
{ "tableName": "Customer" }
```
Returns `{status, noOfRecords, result[]}`. Each record has `id`, `primaryKey.No_`, and `fields.*`.

### Project specific fields
```json
{ "tableName": "Customer", "fieldNumbers": [2, 5, 7] }
```
Customer field 2=`Name`, 5=`Address`, 7=`City`. Only those appear in `fields`; field 9 (`Phone No.`) is excluded.

### Modified-at date range
```json
{ "tableName": "Customer",
  "startDateTime": "2025-01-01T00:00:00Z",
  "endDateTime":   "2027-12-31T23:59:59Z" }
```

### BC table view filter
```json
{ "tableName": "Customer",
  "tableView": "WHERE(Blocked = CONST( ))",
  "fieldNumbers": [1, 2, 3, 5] }
```

### Pagination (records 101–200)
```json
{ "tableName": "Customer", "skip": 100, "take": 100 }
```
Use `noOfRecords` in the response to plan further pages.

## Errors

| Condition | Status / message |
|---|---|
| Table not identified | Error — `Table {name} not found.` |
| Table is internal / restricted | Error — `Table {id} ({name}) cannot be read via Data.Records.Get. This is an internal table.` |
| Caller lacks read permission | Error — populated by `CheckTableReadPermission`. |
| Read-restricted field requested via `fieldNumbers` | Field silently dropped from response (see `Bifrost Field Access`). |

## Related Message Types

- **Data.RecordIds.Get** — IDs + `SystemModifiedAt` only (lightweight incremental sync).
- **Data.Totals.Get** — server-side `CalcSums` for Decimal SumIndexFields.
- **CSV.Records.Get** — same filtering, CSV output, supports 4 MB chunked continuation.
- **Data.Records.Set** — accepts the same `{id, primaryKey, fields}` shape on the way back.
- **Help.Tables.Get** / **Help.Fields.Get** — schema discovery.

