---
id: data-entries-find
title: "Data.Entries.Find"
sidebar_label: "Data.Entries.Find"
sidebar_position: 14
description: "Request and response contract for the Data.Entries.Find Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Finds all related entries for a document number using Business Central's standard Navigate (Find Entries) mechanism. Returns a list of tables that contain entries matching the document number, along with the count of records in each table.

This is the programmatic equivalent of the "Find Entries..." action (Ctrl+F7 → Navigate) available throughout Business Central. It automatically searches all standard entry tables (G/L Entries, Customer Ledger Entries, Vendor Ledger Entries, Item Ledger Entries, VAT Entries, Bank Account Ledger Entries, etc.) plus any tables registered by installed extensions.

**Direction**: Outbound (response to request)
**Content-Type**: text/json

## Request Format

### Bifrost Parameters

- **source** (required): Identifies the calling application or system.
- **data** (required): JSON object containing the request parameters.

### Input Parameters (in data payload)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentNo` | string | **Yes** | The document number to search for (e.g. invoice number, order number, shipment number). |
| `postingDate` | date | No | Optional posting date filter. When provided, only entries with this posting date are included. Format: `YYYY-MM-DD`. |

### Request Example

```json
{
  "documentNo": "PSI-103047",
  "postingDate": "2025-03-15"
}
```

### Minimal Request (document number only)

```json
{
  "documentNo": "PSI-103047"
}
```

## Response Format

```json
{
  "status": "Success",
  "documentNo": "PSI-103047",
  "postingDate": "2025-03-15",
  "totalTables": 4,
  "totalRecords": 12,
  "entries": [
    { "tableId": 21,  "tableName": "Cust. Ledger Entry",          "tableCaption": "Viðskm.færsla",              "noOfRecords": 1 },
    { "tableId": 17,  "tableName": "G/L Entry",                   "tableCaption": "Fjárhagsfærsla",             "noOfRecords": 5 },
    { "tableId": 254, "tableName": "VAT Entry",                   "tableCaption": "VSK-færsla",                 "noOfRecords": 2 },
    { "tableId": 379, "tableName": "Detailed Cust. Ledg. Entry",  "tableCaption": "Sundurliðuð viðskm.færsla",  "noOfRecords": 4 }
  ]
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"Success"` or `"Error"` |
| `documentNo` | string | The document number that was searched |
| `postingDate` | string | The posting date filter (only present if provided in request) |
| `totalTables` | integer | Number of distinct tables with matching entries |
| `totalRecords` | integer | Total number of matching records across all tables |
| `entries` | array | Array of table results |
| `entries[].tableId` | integer | The BC table ID. Use this — not `tableName` — when passing to `Data.Records.Get`. |
| `entries[].tableName` | string | Invariant AL object name from `Table Metadata` (e.g. `"Cust. Ledger Entry"`). Language-independent. |
| `entries[].tableCaption` | string | Display caption in the session language (LCID), e.g. `"Viðskm.færsla"` at LCID 1039. |
| `entries[].noOfRecords` | integer | Number of matching records in this table |

## Usage Notes

- The search uses BC's standard Navigate infrastructure, which includes all base application tables and any extensions that subscribe to the Navigate events.
- When `postingDate` is omitted, all entries matching the document number regardless of date are returned.
- Tables with zero matching records are not included in the response.

## Next Step: Retrieve the Actual Entries

After identifying which tables contain entries, use `Data.Records.Get` with the table number from the response and a `tableView` filter to retrieve the full record data:

```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableId": 21,
    "tableView": "WHERE(Document No.=CONST(PSI-103047),Posting Date=CONST(2025-03-15))"
  }
}
```

- Use `tableId` from the entries array. `tableName` is invariant but `tableId` is the safest key.
- The `tableView` filter uses BC AL syntax: `WHERE(Document No.=CONST(<value>),Posting Date=CONST(<value>))`.
- Omit `Posting Date` from the filter if `postingDate` was not used in the original request.
- Add `fieldNumbers` to limit which fields are returned.

## Common Tables in Results

| Table ID | Table Name | Typical Content |
|----------|-----------|-----------------|
| 17 | G/L Entry | General ledger postings |
| 21 | Cust. Ledger Entry | Customer receivables |
| 25 | Vendor Ledger Entry | Vendor payables |
| 32 | Item Ledger Entry | Inventory movements |
| 254 | VAT Entry | VAT postings |
| 271 | Bank Account Ledger Entry | Bank transactions |
| 379 | Detailed Cust. Ledg. Entry | Detailed customer entries |
| 380 | Detailed Vendor Ledg. Entry | Detailed vendor entries |
| 5802 | Value Entry | Item valuation entries |

## Error Handling

| Error | Cause |
|-------|-------|
| `documentNo is required.` | The `documentNo` parameter was not provided or is empty |

## Related Message Types

- **Data.Records.Get** — Retrieve the actual record data from tables identified by this message type
- **Data.RecordIds.Get** — Get record IDs with filters for a specific table
- **Data.Totals.Get** — Aggregate numeric fields across matching records

