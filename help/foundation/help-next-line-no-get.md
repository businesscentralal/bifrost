---
id: help-next-line-no-get
title: "Help.NextLineNo.Get"
sidebar_label: "Help.NextLineNo.Get"
sidebar_position: 36
---

Outbound  Content-Type: `text/json`

Returns the next available Line No. for any table whose last primary key field is an Integer. Covers tables such as Sales Line, Purchase Line, Gen. Journal Line, or any table where the last PK field is an auto-incrementing Integer. The response contains a complete `primaryKey` object that can be passed directly to `Data.Records.Set`.

## Request Parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Text / Integer | Target table (standard table identification) |
| `primaryKey` | Yes\* | Object | Parent PK field values (all except last Integer field) |
| `id` | Yes\* | GUID | SystemId of an existing record in the table |
| `increment` | No | Integer | Value to add to last line no. Default: 10000. Must be > 0. |

\* Exactly one of `primaryKey` or `id` must be provided. If both are present, `id` takes precedence.

## Response Format

```
{
  "status": "Success",
  "primaryKey": {
    "DocumentType": "Order",
    "DocumentNo": "S-ORD-001",
    "LineNo": 40000
  }
}
```

### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `status` | String | `"Success"` or `"Error"` |
| `primaryKey` | Object | Complete primary key with all parent fields plus the last field set to next value |

## Error Handling

| Condition | Error Message |
| --- | --- |
| Table not found | Table `{tableName}` not found. |
| Last PK field not Integer | The last primary key field of table '`{tableName}`' (`{fieldName}`) is not an Integer field. |
| Too few PK fields | Table '`{tableName}`' must have at least two primary key fields. |
| Missing input | Either 'primaryKey' or 'id' must be provided. |
| Missing PK field value | Missing value for primary key field '`{fieldName}`'. |
| Record not found | Record with SystemId '`{id}`' not found in table '`{tableName}`'. |
| Invalid increment | Increment must be greater than zero. |
| No read permission | You do not have read permission on table '`{tableName}`'. |

## Usage Example

### Request (primaryKey)

```
{
  "tableName": "Sales Line",
  "primaryKey": {
    "DocumentType": "Order",
    "DocumentNo": "S-ORD-001"
  },
  "increment": 10000
}
```

### Request (SystemId)

```
{
  "tableName": "Sales Line",
  "id": "a0e2b3c4-d5e6-7890-abcd-ef1234567890"
}
```

## Related Message Types

-   **Data.Records.Get** — Retrieve full record data from any table
-   **Data.Records.Set** — Insert or update records (use the returned primaryKey directly)
-   **Help.Tables.Get** — Discover available tables
-   **Help.Fields.Get** — Discover field metadata for a table
