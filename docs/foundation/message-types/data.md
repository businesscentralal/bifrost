---
id: data
title: "Data message types"
sidebar_position: 1
---

This document describes the Data message types available in the Bifrost API for retrieving and manipulating record data.

**Parent Document:** [API_Reference.md](/foundation/reference/api/)

**Implementation Folder:** `app/src/Message Type/Implementations/Data/`

---

## Overview

Data message types provide operations for retrieving and manipulating record data in Business Central tables following the data shipping standard format. All data operations support field filtering, date/time range filtering, and pagination for optimal performance with large datasets.

**Available Message Types:**

| Message Type | Description | Direction |
|--------------|-------------|-----------|
| Data.Records.Get | Retrieves full record data as JSON for records in a specified table | Outbound |
| Data.Records.Set | Inserts or updates full record data as JSON for records in a specified table | Inbound |
| Data.RecordIds.Get | Retrieves record IDs and modification timestamps for records in a specified table | Outbound |
| CSV.Records.Get | Exports all matching records from a specified table as a CSV file in Open Mirroring format | Outbound |
| Data.Totals.Get | Aggregates Decimal SumIndexFields across all matching records, returning field totals | Outbound |
| Data.Notes.Get | Retrieves notes from the Record Link table for a specified record | Outbound |
| Data.Notes.Set | Adds new notes or edits existing notes on the Record Link table for a specified record | Inbound |
| Deleted.Records.Get | Retrieves full field-level snapshots of deleted records from the Delete Log ori | Outbound |
| Deleted.RecordIds.Get | Retrieves SystemId and deletion timestamp for deleted records | Outbound |
| CSV.DeletedRecords.Get | Exports deleted record audit log entries as CSV | Outbound |
| Data.Entries.Find | Finds all related entries for a document using BC standard Navigate | Outbound |

---

## 1. Data.Records.Get {#datarecordsget}

**Purpose:** Retrieve full record data as JSON for records in a specified table, following the data shipping standard format.

**Description:** Retrieves full record data as JSON for records in a specified table, following the data shipping standard format. Supports optional field filtering, FlowField retrieval, table view filtering, date/time range filtering, and pagination.

**Message Direction:** Outbound

**Table Identification:**

The target table can be specified using the following options (evaluated in this order):
1. `tableName` in the JSON data payload
2. `tableNumber` in the JSON data payload
3. `tableNo` in the JSON data payload (alias for `tableNumber`)
4. `tableId` in the JSON data payload (alias for `tableNumber`)
5. `subject` field in the Bifrost envelope — accepts either a table name (e.g., `"Customer"`) or a table number (e.g., `"18"`)

**Input Parameters:**

```json
{
  "tableName": "Customer",  // Table name OR
  "tableNumber": 18,         // Table number OR
  "tableNo": 18,             // Table number (alias for tableNumber) OR
  "tableId": 18,             // Table ID (alias for tableNumber)
  "fieldNumbers": [1, 2, 3, 5, 7],  // Optional - specific field numbers to include; also enables FlowField retrieval
  "startDateTime": "2026-01-01T00:00:00Z",  // Optional - filter by SystemModifiedAt
  "endDateTime": "2026-02-19T23:59:59Z",    // Optional - filter by SystemModifiedAt
  "tableView": "WHERE(Blocked = CONST( ))",  // Optional - additional SETVIEW filter
  "skip": 0,                 // Optional - number of records to skip (default: 0)
  "take": 100                // Optional - number of records to return (default: 100)
}
```

**Response Format:**

```json
{
  "status": "Success",
  "noOfRecords": 245,  // Total number of records matching the filters
  "result": [
    {
      "id": "{guid}",
      "primaryKey": {
        "No": "10000"
      },
      "fields": {
        "Name": "Contoso Ltd.",
        "Address": "123 Main St",
        "City": "Atlanta",
        "Balance": 1250.50
      }
    }
  ]
}
```

**Data Shipping Standard Format:**

Each record in the result array contains:
- **id**: System ID (GUID) of the record
- **primaryKey**: Object containing primary key field(s) and their values
- **fields**: Object containing non-primary key field(s) and their values

Field names are normalized to contain only alphanumeric characters (spaces and special characters removed).

**Supported Field Types:**

- BigInteger, Boolean, Code, Date, DateFormula, DateTime
- Decimal, Duration, GUID, Integer, Option, Text, Time, RecordID
- BLOB, Media, MediaSet (Base64 encoded)
- FlowField (only when `fieldNumbers` is specified)

**Option/Enum fields**: Values are returned as their display **captions** (not internal names). Use `Help.Fields.Get` to discover valid values and their captions for a specific field.

**Notes:**

- **Flexible Table Identification**: Specify table via `tableName`, `tableNumber`, `tableNo`, or `tableId` in data payload, or `subject` in Bifrost envelope (table name or number)
- **Data Shipping Standard**: Follows established data shipping JSON structure with id, primaryKey, and fields
- **Field Filtering**: Optionally specify exact field numbers to include in response using **fieldNumbers** array
- **FlowField Support**: When `fieldNumbers` is provided, FlowField class fields are included and calculated on-the-fly
- **Enum Captions**: Option/Enum field values are returned as their display captions (not internal names)
- **Field Access Restrictions**: Per-user field-level read restrictions are enforced via `Field Access ori`. When a field carries restriction type `Both` or `Read` for the current user (or a matching wildcard entry exists), the field is **silently dropped** from the `fields` object — no error is raised. Primary-key fields are always returned regardless. Use `Help.Fields.Get` to discover the `readRestricted` flag per field before assuming a value will be present. See [Field_Access_Restrictions.md](/foundation/reference/field-access-restrictions/) for the full restriction model and wildcard resolution order.
- **Date Range Filtering**: Filters records based on SystemModifiedAt field using **startDateTime** and **endDateTime**
- **Pagination Support**: Use **skip** and **take** parameters for pagination (default: skip=0, take=100)
  - The **noOfRecords** field in the response shows the total count regardless of skip/take
  - Use for pagination to avoid timeouts and memory issues with large datasets
- **Table View Support**: Apply additional SETVIEW filters using standard NAV/BC table view syntax with **tableView** parameter
- **Primary Key Separation**: Primary key fields are always included in primaryKey object, regardless of fieldNumbers filter
- **Field Name Normalization**: Field names are normalized (alphanumeric only)
- **Performance Tip**: Use fieldNumbers to limit the amount of data returned, especially for large tables
- **Related Message**: If you only need IDs and timestamps, use **Data.RecordIds.Get** instead for better performance
- Message Direction: Outbound
- Filter Table No: 0

**Example Usage Scenarios:**

1. **Get all fields for all customers:**
   ```json
   {"tableName": "Customer"}
   ```

2. **Get specific fields for customers modified in date range:**
   ```json
   {
     "tableName": "Customer",
     "fieldNumbers": [2, 5, 7, 21],
     "startDateTime": "2026-02-01T00:00:00Z",
     "endDateTime": "2026-02-28T23:59:59Z"
   }
   ```

3. **Get customers with table view filter:**
   ```json
   {
     "tableName": "Customer",
     "tableView": "WHERE(Blocked = CONST( ))",
     "fieldNumbers": [1, 2, 3, 5]
   }
   ```

4. **Get customers with pagination (first 100 records):**
   ```json
   {
     "tableName": "Customer",
     "skip": 0,
     "take": 100
   }
   ```

5. **Get customers with pagination (records 101-200):**
   ```json
   {
     "tableName": "Customer",
     "skip": 100,
     "take": 100
   }
   ```

---

## 2. Data.Records.Set {#datarecordsset}

**Purpose:** Insert or update full record data as JSON for records in a specified table, following the data shipping standard format.

**Description:** Inserts or updates full record data as JSON for records in a specified table, following the data shipping standard format. Supports both insert (new records) and update (existing records) operations based on SystemId or primary key.

**Message Direction:** Inbound

**Table Identification:**

The target table can be specified using the following options (evaluated in this order):
1. `tableName` in the JSON data payload
2. `tableNumber` in the JSON data payload
3. `tableNo` in the JSON data payload (alias for `tableNumber`)
4. `tableId` in the JSON data payload (alias for `tableNumber`)
5. `subject` field in the Bifrost envelope — accepts either a table name (e.g., `"Customer"`) or a table number (e.g., `"18"`)

**Input Parameters:**

```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",  // Optional - SystemId for update
      "identityInsert": true,                         // Optional - allow insert with specific SystemId
      "primaryKey": {                                 // Optional - for lookup or verification
        "No_": "10000"
      },
      "fields": {                                     // Fields to set/update
        "Name": "Contoso Ltd.",
        "Address": "123 Main St",
        "City": "Atlanta",
        "Balance": 1250.50
      }
    }
  ]
}
```

**Response Format:**

```json
{
  "status": "Success",
  "insertedCount": 5,   // Number of new records inserted
  "modifiedCount": 3,   // Number of existing records updated
  "result": [           // Complete record data for all processed records
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": {
        "No_": "10000"
      },
      "fields": {
        "Name": "Contoso Ltd.",
        "Address": "123 Main St",
        "City": "Atlanta",
        "Balance": 1250.50
      }
    }
  ]
}
```

**Data Shipping Standard Format:**

Each record in the data array contains:
- **id**: System ID (GUID) as plain text - use to update existing records
- **primaryKey**: Object containing primary key field(s) and their values - use for lookups
- **fields**: Object containing non-primary key field(s) and their values to set

Field names are normalized to contain only alphanumeric characters (spaces and special characters replaced with underscores).

**Record Lookup Logic:**

For each record in the data array, the system determines whether to insert or update based on:

1. **If "id" is provided**:
   - Looks up the record by SystemId
   - If found, updates the existing record
   - If "primaryKey" is also provided, verifies it matches the found record
   - If not found and "identityInsert" is true, inserts a new record with the specified SystemId
   - If not found and "identityInsert" is not true, returns an error

2. **If "primaryKey" is provided (without "id")**:
   - Sets the primary key fields and attempts Find('=')
   - If found, updates the existing record
   - If not found, inserts a new record with those primary key values

3. **If neither "id" nor "primaryKey" is provided**:
   - Inserts a new record
   - Primary key fields must be auto-generated or provided in the "primaryKey" object (not in "fields")

**Field Handling:**

- Only non-primary key fields included in "fields" object are set or updated
- **Primary key fields are NEVER processed from the "fields" object**
- Primary key fields must always be in the "primaryKey" object for lookups and inserts
- System fields (SystemCreatedAt, SystemModifiedAt, etc.) cannot be set and are ignored
- All field values go through validation using the RecordRef.Validate() method
- FlowFields and CalcFields are read-only and cannot be set

**Supported Field Types:**

- BigInteger, Boolean, Code, Date, DateFormula, DateTime
- Decimal, Duration, GUID, Integer, Option, Text, Time, RecordID
- BLOB, Media, MediaSet (Base64 encoded)

**Special Field Handling:**

- **LCY Currency Conversion**: Fields with Currency table relation: empty string = LCY, LCY code accepted and converted to empty
- **Dimension Set**: Fields with Dimension Set Entry relation accept either integer (Dimension Set ID) or array of dimensions
- **BLOB/Media/MediaSet**: Encoded as Base64 strings or structured objects with Base64 values
- **Option Fields**: Use enum value names (e.g., "Open", "Released")
- **System Fields**: SystemCreatedAt, SystemModifiedAt, etc. cannot be set and are ignored
- **FlowFields/CalcFields**: Read-only fields are ignored

**Notes:**

- **Data Shipping Standard**: Follows established data shipping JSON structure with id, primaryKey, and fields
- **Insert or Update**: Automatically determines whether to insert new records or update existing ones
- **Partial Updates**: Only fields included in "fields" object are updated; others remain unchanged
- **Field Validation**: All field values are validated using RecordRef.Validate() before insertion/update
- **Batch Processing**: Process multiple records in a single request
- **Complete Response**: Returns full record data in standard format for all processed records
- **Field Access Restrictions**: Per-user field-level write restrictions are enforced via `Field Access ori` **before** the ChangeLog Write Guard. When a field carries restriction type `Both` or `Write` for the current user (or a matching wildcard entry exists), the write is rejected and the field is excluded from the `Did you mean` / valid-field hints. A separate `Bypass` restriction type **opts a field out** of the ChangeLog Write Guard. See [Field_Access_Restrictions.md](/foundation/reference/field-access-restrictions/).
- **ChangeLog Write Guard**: When `Setup ori > ChangeLog Write Guard` is `Blocked` or `Via force`, only fields *covered by Change Log* may be written. A field is considered covered when either (a) its `Change Log Setup (Table)` row has `Log Modification = All Fields`, or (b) a `Change Log Setup (Field)` row exists for the field with `Log Modification = true`. A field with a `Bypass` entry in `Field Access ori` is also allowed regardless of Change Log coverage. When `Change Log Setup."Change Log Activated"` is `false`, the guard treats every non-bypassed field as uncovered. In `Via force` mode, the caller may send `"force": true` if they hold the `Force Access ori` permission set. Block responses include `blockedFields`, `guardMode`, and `forceAvailable`.
- **Message Direction**: Inbound
- **Filter Table No**: 0

**Example Usage Scenarios:**

1. **Insert new customer record:**
   ```json
   {
     "data": [
       {
         "primaryKey": {
           "No_": "CUST-001"
         },
         "fields": {
           "Name": "New Customer Inc.",
           "Address": "456 Oak Ave",
           "City": "Seattle"
         }
       }
     ]
   }
   ```
   Subject: "Customer" or "18"

2. **Update existing customer by SystemId:**
   ```json
   {
     "data": [
       {
         "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
         "fields": {
           "Address": "789 New Street",
           "City": "Portland"
         }
       }
     ]
   }
   ```
   Subject: "Customer"

3. **Batch insert/update multiple records:**
   ```json
   {
     "data": [
       {
         "id": "existing-customer-guid",
         "fields": { "City": "Boston" }
       },
       {
         "primaryKey": { "No_": "CUST-NEW" },
         "fields": {
           "Name": "Fresh Customer",
           "City": "Miami"
         }
       }
     ]
   }
   ```
   Subject: "Customer"

**Error Messages:**

- **Table Not Found**: "Table &#123;tableName&#125; not found."
- **Missing Data Array**: "Missing required 'data' array in request."
- **Record Processing Error**: Various errors related to validation, constraints, or field issues

---

## 3. Data.RecordIds.Get {#datarecordidsget}

**Purpose:** Retrieve record IDs and modification timestamps for records in a specified table within a date/time range.

**Description:** Retrieves record IDs (SystemId) and modification timestamps (SystemModifiedAt) for records in a specified table within a specified date/time range. This message type is optimized for synchronization scenarios where you need to identify which records have changed without retrieving full record data.

**Message Direction:** Outbound

**Input Parameters:**

```json
{
  "tableName": "Customer",  // Table name OR
  "tableNumber": 18,         // Table number OR
  "tableNo": 18,             // Table number (alias for tableNumber) OR
  "tableId": 18,             // Table ID (alias for tableNumber), all optional if subject is set
  "startDateTime": "2026-01-01T00:00:00Z",  // Optional - filter by SystemModifiedAt
  "endDateTime": "2026-02-19T23:59:59Z",    // Optional - filter by SystemModifiedAt
  "tableView": "WHERE(Blocked = CONST( ))",  // Optional - additional filtering
  "skip": 0,                 // Optional - number of records to skip (default: 0)
  "take": 100                // Optional - number of records to return (default: 100)
}
```

**Response Format:**

```json
{
  "status": "Success",
  "noOfRecords": 245,  // Total number of records matching the filters
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "modifiedAt": "2026-02-15T14:30:00Z"
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
      "modifiedAt": "2026-02-16T09:15:30Z"
    }
  ]
}
```

**Response Fields:**

- **status**: Processing status ("Success" or "Error")
- **noOfRecords**: Total number of records matching the filters (regardless of skip/take)
- **result**: Array of record identifiers
  - **id**: System ID (GUID) of the record
  - **modifiedAt**: Timestamp when the record was last modified (SystemModifiedAt)

**Notes:**

- **Optimized for Sync**: This message type is designed for efficient synchronization scenarios
- **Filters by SystemModifiedAt**: Use startDateTime and endDateTime to filter records by modification timestamp. Both are optional — omitting startDateTime returns records from the beginning of time; omitting endDateTime defaults to the current date/time. Omit both to return all records.
- **Pagination Support**: Use **skip** and **take** parameters for pagination (default: skip=0, take=100)
  - The **noOfRecords** field in the response shows the total count regardless of skip/take
  - Use for pagination to avoid timeouts with large datasets
- **Table View Support**: Optional **tableView** parameter can be used to apply additional filters (e.g., "WHERE(Blocked = CONST( ))")
- **Performance**: Significantly faster than Data.Records.Get when you only need to identify changed records
- **Use Case**: First call Data.RecordIds.Get to identify changed records, then call Data.Records.Get only for those specific records
- Message Direction: Outbound
- Filter Table No: 0

**Example Usage Scenarios:**

1. **Get all customer record IDs (no date filter):**
   ```json
   {
     "tableName": "Customer"
   }
   ```

2. **Get customer record IDs modified in date range:**
   ```json
   {
     "tableName": "Customer",
     "startDateTime": "2026-02-01T00:00:00Z",
     "endDateTime": "2026-02-28T23:59:59Z"
   }
   ```

3. **Get customer IDs with pagination (first 100 records):**
   ```json
   {
     "tableName": "Customer",
     "startDateTime": "2026-02-01T00:00:00Z",
     "endDateTime": "2026-02-28T23:59:59Z",
     "skip": 0,
     "take": 100
   }
   ```

4. **Get customer IDs with table view filter:**
   ```json
   {
     "tableName": "Customer",
     "startDateTime": "2026-02-01T00:00:00Z",
     "endDateTime": "2026-02-28T23:59:59Z",
     "tableView": "WHERE(Blocked = CONST( ))"
   }
   ```

**Integration Pattern:**

**Step 1: Identify changed records**
```json
{
  "type": "Data.RecordIds.Get",
  "data": {
    "tableName": "Customer",
    "startDateTime": "2026-02-01T00:00:00Z",
    "endDateTime": "2026-02-28T23:59:59Z"
  }
}
```

**Step 2: Retrieve full data for changed records**
Use the returned IDs with Data.Records.Get and tableView filter:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Customer",
    "tableView": "WHERE(SystemId=FILTER(a1b2c3d4-e5f6-7890-abcd-ef1234567890|b2c3d4e5-f6g7-8901-bcde-fg2345678901))"
  }
}
```

---

## 4. CSV.Records.Get {#csvrecordsget}

**Purpose:** Export all matching records from a specified Business Central table as a CSV file in Open Mirroring format.

**Description:** Exports all matching records from a specified table as a UTF-8 encoded CSV file following the bc2adls Open Mirroring column-naming convention. Unlike the JSON-based data message types, this message type returns `text/csv` content directly in the response blob. For large result sets that approach the 2 GB OutStream limit, a continuation pattern is supported via `continueFromRecordId`.

**Message Direction:** Outbound  
**Content-Type:** `text/csv`

**Table Identification:**

The target table can be specified using the following options (evaluated in this order):
1. `tableName` in the JSON data payload
2. `tableNumber` in the JSON data payload
3. `tableNo` in the JSON data payload (alias for `tableNumber`)
4. `tableId` in the JSON data payload (alias for `tableNumber`)
5. `subject` field in the Bifrost envelope — accepts either a table name (e.g., `"Customer"`) or a table number (e.g., `"18"`)

**Input Parameters:**

```json
{
  "tableName": "Customer",              // Table name OR
  "tableNumber": 18,                     // Table number (also: tableNo, tableId)
  "fieldNumbers": [1, 2, 5, 7],         // Optional - specific field numbers to include
  "startDateTime": "2026-01-01T00:00:00Z",  // Optional - filter by SystemModifiedAt >=
  "endDateTime": "2026-12-31T23:59:59Z",    // Optional - filter by SystemModifiedAt <=
  "tableView": "WHERE(Blocked = CONST( ))"  // Optional - additional filter/sort view
}
```

> **Note:** `skip` and `take` are NOT supported. The entire result set is always returned.

**Response Format:**

When records match, a UTF-8 encoded CSV text is returned with content type `text/csv`. The first row is the header row; subsequent rows are data rows, one per record.

**If no records match the filters, no CSV is written.** Both `data` and `datacontenttype` in the Bifrost response will be empty string. The task still completes successfully — always check whether `data` is empty before attempting to download.

Example (Customer table, fields 1 and 2 only):
```csv
No,Name,timestamp,SystemId,SystemCreatedAt,SystemCreatedBy,SystemModifiedAt,SystemModifiedBy,$Company,__rowMarker__
"10000","Contoso Ltd.",0,a1b2c3d4-e5f6-7890-abcd-ef1234567890,2026-01-10T08:00:00.000Z,user-guid-here,2026-03-01T12:30:00.000Z,user-guid-here,"CRONUS International Ltd.",4
```

**Column Naming Convention:**

Each column header is formed by stripping non-alphanumeric characters (except `%`) from the BC field name.

Only the characters `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890%` are kept from the BC field name; all other characters (spaces, dots, hyphens, slashes, parentheses, etc.) are removed.

| Field | Column Header |
|-------|---------------|
| `No.` | `No` |
| `Name` | `Name` |
| `Sell-to Customer No.` | `SelltoCustomerNo` |
| `SystemId` | `SystemId` |

**System Fields (always included):**

The following system fields are always appended at the end of every row, regardless of `fieldNumbers`:

| Column | Field No. | Description |
|--------|-----------|-------------|
| `timestamp` | 0 | Internal timestamp (BigInteger) |
| `SystemId` | 2000000000 | Record GUID |
| `SystemCreatedAt` | 2000000001 | Creation timestamp (UTC) |
| `SystemCreatedBy` | 2000000002 | Created by user GUID |
| `SystemModifiedAt` | 2000000003 | Last modified timestamp (UTC) |
| `SystemModifiedBy` | 2000000004 | Last modified by user GUID |

**$Company Column:**

For per-company tables (most Business Central tables), a `$Company` column is appended after the system fields. The value is double-quoted and escaped. The exact value is controlled by the **Export Company Name Type** setup field (Bifrost Setup):

| Setup value | `$Company` value |
|-------------|------------------|
| `Company Name` (default) | `CompanyName()` — the technical `Company.Name` |
| `Company Display Name` | `Company."Display Name"`, falling back to `CompanyName()` when blank |

The value is resolved once per request and reused for every row. The enum is extensible via the `Company Name Type ori` enum (10077886) and the `Company Name ori` interface — see [Setup_Reference.md](/foundation/reference/setup/) section 8.

**__rowMarker__ Column (Open Mirroring):**

The `__rowMarker__` column is always the last column in every row. For `CSV.Records.Get`, the value is always `4`, indicating an upsert/active record. When combined with `CSV.DeletedRecords.Get` exports (rowMarker = `2`), downstream systems can merge both exports to maintain a complete record lifecycle view. This follows the Open Mirroring convention used by bc2adls and Azure Data Lake sync pipelines.

**Supported Field Types:**

- **Included:** BigInteger, Boolean, Code, Date, DateFormula, DateTime, Decimal, Duration, Guid, Integer, Option, Text, Time
- **Silently skipped:** BLOB, Media, MediaSet, RecordID, OemCode, OemText, TableFilter

**Value Formatting:**

| Type | Format | Quoted |
|------|--------|--------|
| BigInteger, Integer, Decimal, Duration | Culture-invariant (`Format(x, 0, 9)`) | No |
| Boolean | `true` or `false` | No |
| Date | `YYYY-MM-DD` (blank date → empty string) | No |
| Time | `HH:MM:SS` | Yes |
| DateTime | ISO 8601 UTC with 3-digit ms: `YYYY-MM-DDTHH:MM:SS.mmmZ` (zero DateTime → empty string) | No |
| Option | Enum value name (not caption) | Yes |
| Code, Text, Guid | Raw value | Yes |

String quoting: values are wrapped in double quotes; inner double quotes are escaped as `\"`, backslashes as `\\`, and CR/LF replaced with a space.

**Notes:**

- **No pagination**: `skip` and `take` are not supported. Use `tableView` and `startDateTime`/`endDateTime` to reduce the result set, or use the continuation pattern (`continueFromRecordId`) for large exports.
- **Field Restrictions**: Fields marked as read-restricted via `BifrostFieldAccess` are excluded even when listed in `fieldNumbers`.
- **Performance**: Use `fieldNumbers` to limit columns and `tableView`/date range to limit rows when exporting large tables.
- **Open Mirroring compatibility**: Column naming follows the bc2adls convention so the output can be consumed directly by Azure Data Lake Storage / Fabric Open Mirroring pipelines.
- Message Direction: Outbound
- Filter Table No: 0

**Example Usage Scenarios:**

1. **Export all Customer fields as CSV:**
   ```json
   {"tableName": "Customer"}
   ```

2. **Export specific Customer fields, modified in a date range:**
   ```json
   {
     "tableName": "Customer",
     "fieldNumbers": [1, 2, 5, 7, 21],
     "startDateTime": "2026-03-01T00:00:00Z",
     "endDateTime": "2026-03-31T23:59:59Z"
   }
   ```

3. **Export non-blocked customers only:**
   ```json
   {
     "tableName": "Customer",
     "tableView": "WHERE(Blocked = CONST( ))"
   }
   ```

4. **Export Item Ledger Entries modified since a checkpoint:**
   ```json
   {
     "tableName": "Item Ledger Entry",
     "startDateTime": "2026-03-15T00:00:00Z"
   }
   ```

**Error Messages:**

- **Table Not Found**: Returned when the specified table cannot be resolved.
- **Read Permission Denied**: `"Read permission denied for table {tableNumber}."` — returned when the calling user lacks read permission on the table.
- **No records match**: Task completes successfully with `data` and `datacontenttype` both empty string. No CSV content is produced.
- **Continuation record not found**: `"Unable to locate the record in table {name} with System Id {guid}"` — returned when `continueFromRecordId` points to a deleted or non-existent record.

### Continuation Pattern (Large Exports)

When the CSV response approaches the 2 GB OutStream limit, the export stops after the current 4 MB chunk and returns the `SystemId` of the **next unprocessed record** in the `continueFromRecordId` response field.

**How It Works:**

1. Send a normal `CSV.Records.Get` request (no `continueFromRecordId`).
2. Check the `continueFromRecordId` field in the response.
3. If it contains a GUID, send another request with `continueFromRecordId` set to that value.
4. Repeat until the response `continueFromRecordId` is empty (all records exported).

**`continueFromRecordId`** is a **top-level Bifrost attribute** (like `subject`), not part of the JSON data payload.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `continueFromRecordId` | GUID | No | SystemId of the record to resume from. Omit or leave empty for the first request. |

**Continuation Example:**

First request (no continuation):
```json
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Item Ledger Entry",
  "datacontenttype": "application/json",
  "data": {}
}
```

Response indicates more data available:
- CSV data in `data` field (download URL)
- `continueFromRecordId` = `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`

Next request (with continuation):
```json
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Item Ledger Entry",
  "continueFromRecordId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "datacontenttype": "application/json",
  "data": {}
}
```

Final response (all records exported):
- CSV data in `data` field
- `continueFromRecordId` is empty

**Important Notes:**

- Each continuation chunk includes the CSV header row, so consumers should skip the header on subsequent chunks.
- The same filters (`tableView`, `startDateTime`, `endDateTime`) must be sent on every continuation request to ensure consistent results.
- `continueFromRecordId` uses `RecRef.GetBySystemId()` — if the record was deleted between requests, an error is returned.
- `skip` and `take` are NOT supported. Use continuation for large result sets instead of pagination.

---

## 5. Data.Totals.Get {#datatotalsget}

**Purpose:** Aggregate Decimal SumIndexFields across all matching records in a specified Business Central table, optionally grouped by a field.

**Description:** Uses Business Central's native `CalcSums` function to sum one or more Decimal fields without iterating over individual records. Returns a JSON array where each element contains a `group` key and one key/value pair per requested field. Without `groupBy`, a single element is returned with an empty `group` value. With `groupBy`, one element is returned per distinct value. Supports optional `tableView` filtering. Does not support pagination — `skip`, `take`, `startDateTime`, and `endDateTime` are not applicable.

**Message Direction:** Outbound  
**Content-Type:** `text/json`

**Table Identification:** Same options as other Data message types (`tableName`, `tableNumber`, `tableNo`, `tableId`, or `subject`).

**Input Parameters:**

```json
{
  "tableName": "Item Ledger Entry",
  "fieldNumbers": [12, 14],
  "tableView": "WHERE(Entry Type=CONST(Purchase))",
  "groupBy": 3
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tableName` / `tableNumber` | string / integer | Yes (one of) | Target table |
| `fieldNumbers` | array of integers | **Required** | Field numbers to aggregate. Must all be Decimal SumIndexFields. |
| `tableView` | string | No | BC AL SetView filter to restrict which records are included |
| `groupBy` | integer or string | No | Field number or field name to group by. When provided, returns one result element per distinct value. |

**Requirements for `fieldNumbers`:**
- Must not be absent or empty — returns an error if missing or `[]`
- Each field must exist in the table
- Each field must be of type **Decimal** — non-Decimal fields return an error
- Each field must be a **SumIndexField** (SIFT key) — non-SumIndexField fields cause a BC runtime error
- Each field must not be read-restricted

**`groupBy` behavior:**
- Accepts a field number (integer) or a field name (string)
- The field is resolved against the table's field metadata
- If the field is not found, it is silently ignored (no grouping applied)
- The response `group` value is the formatted field value for each distinct group

**Response Format (without groupBy):**

```json
{
  "status": "Success",
  "result": [
    {
      "group": "",
      "Quantity": 12500.00,
      "InvoicedQuantity": 11200.50
    }
  ]
}
```

**Response Format (with groupBy):**

```json
{
  "status": "Success",
  "result": [
    {
      "group": "Purchase",
      "Quantity": 8500.00,
      "InvoicedQuantity": 7200.00
    },
    {
      "group": "Sale",
      "Quantity": -3200.00,
      "InvoicedQuantity": -2800.50
    }
  ]
}
```

**Field Key Naming Convention:**

JSON keys in each result element follow the same stripping rule as `Data.Records.Get`:
1. Characters `%`, `.`, `"`, `\`, `/`, `'` → replaced with `_`
2. All other non-`[a-zA-Z0-9_]` characters (e.g. spaces) → removed

| BC Field Name | JSON Key |
|---------------|----------|
| `Quantity` | `Quantity` |
| `Invoiced Quantity` | `InvoicedQuantity` |
| `Cost Amount (Actual)` | `CostAmountActual` |
| `Sales (LCY)` | `SalesLCY` |

**CalcSums Requirement:**

`Data.Totals.Get` uses BC's `CalcSums`, which requires all fields to be declared as SumIndexFields on one of the table's SIFT keys. Use `Help.Fields.Get` to check field metadata before calling this message type.

If no records match the `tableView`, `CalcSums` returns 0 for each field — this is not an error.

**Error Handling:**

| Condition | Response |
|-----------|----------|
| `fieldNumbers` missing or empty | `{"status":"Error","error":"fieldNumbers is required and must contain at least one field number."}` |
| Table not found | Error propagated from table evaluation |
| Read permission denied | `{"status":"Error","error":"Read permission denied for table {n}."}` |
| Field not found in table | `{"status":"Error","error":"Field {n} does not exist in table {t}."}` |
| Field not Decimal type | `{"status":"Error","error":"Field {n} ({name}) in table {t} is not of type Decimal."}` |
| Field read-restricted | `{"status":"Error","error":"Read access to field {n} ({name}) in table {t} is restricted."}` |
| Field not a SumIndexField | BC runtime error propagates as task failure |
| No records match `tableView` | Returns 0 for each field — not an error |

**Usage Examples:**

**Example 1 — Ungrouped totals:**

Request:
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

Response:
```json
{
  "status": "Success",
  "result": [
    {
      "group": "",
      "Quantity": 8500.00,
      "InvoicedQuantity": 7200.00
    }
  ]
}
```

**Example 2 — Grouped by Entry Type (field 3):**

Request:
```json
{
  "specversion": "1.0",
  "type": "Data.Totals.Get",
  "source": "my-integration",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Item Ledger Entry",
    "fieldNumbers": [12, 14],
    "groupBy": 3
  }
}
```

Response:
```json
{
  "status": "Success",
  "result": [
    {
      "group": "Purchase",
      "Quantity": 8500.00,
      "InvoicedQuantity": 7200.00
    },
    {
      "group": "Sale",
      "Quantity": -3200.00,
      "InvoicedQuantity": -2800.50
    }
  ]
}
```

**Example 3 — Grouped by field name:**

Request:
```json
{
  "specversion": "1.0",
  "type": "Data.Totals.Get",
  "source": "my-integration",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Item Ledger Entry",
    "fieldNumbers": [12],
    "groupBy": "Entry Type"
  }
}
```

**Related Message Types:**
- `Data.Records.Get` — full record data with the same table identification and `tableView` parameters, supports pagination
- `Data.RecordIds.Get` — returns only record IDs and modification timestamps
- `Help.Fields.Get` — returns field metadata including SumIndexField status

---

## 6. Data.Notes.Get {#datanotesget}

**Purpose:** Retrieve notes attached to records from the Record Link table.

**Description:** Follows the same record-loop pattern as Data.Records.Get — iterates through matching records and returns notes per record instead of field data. Notes are user-entered text annotations linked to individual records in any table (e.g., Customer, Sales Header, Item). Only entries of type Note are returned — links are excluded.

**Message Direction:** Outbound

**Table Identification:**

The target table can be specified using the following options (evaluated in this order):
1. `tableName` in the JSON data payload
2. `tableNumber` in the JSON data payload
3. `tableNo` in the JSON data payload (alias for `tableNumber`)
4. `tableId` in the JSON data payload (alias for `tableNumber`)
5. `subject` field in the Bifrost envelope

**Input Parameters:**

```json
{
  "tableName": "Customer",
  "tableView": "WHERE(No. = FILTER(10000..20000))",
  "startDateTime": "2025-01-01T00:00:00Z",
  "endDateTime": "2025-12-31T23:59:59Z",
  "skip": 0,
  "take": 100
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tableName | Text | Yes* | — | Name of the target table |
| tableNumber / tableNo / tableId | Integer | Yes* | — | ID of the target table (alternative to tableName) |
| tableView | Text | No | — | BC table view filter string to limit which records are included |
| startDateTime | DateTime | No | — | Filter records by SystemModifiedAt >= value (ISO 8601 UTC) |
| endDateTime | DateTime | No | — | Filter records by SystemModifiedAt &lt;= value (ISO 8601 UTC) |
| skip | Integer | No | 0 | Number of records to skip (pagination) |
| take | Integer | No | 100 | Maximum records to return (pagination) |

\* One table identifier is required.

**Response Format:**

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "notes": [
        {
          "lineNo": 12345,
          "description": "Call follow-up",
          "note": "Called customer about delayed payment.",
          "created": "2025-06-15T10:30:00Z",
          "userId": "USER001"
        },
        {
          "lineNo": 12346,
          "description": "Meeting scheduled",
          "note": "Follow-up meeting scheduled.",
          "created": "2025-06-16T14:00:00Z",
          "userId": "USER002"
        }
      ]
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "notes": []
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| status | Text | "Success" or "Error" |
| noOfRecords | Integer | Total number of matching records (before skip/take) |
| result | Array | Array of record objects, each with its notes |
| result[].id | Text | SystemId GUID of the record |
| result[].notes | Array | Array of note objects for this record |
| result[].notes[].lineNo | Integer | Record Link ID (unique identifier) |
| result[].notes[].description | Text[250] | Short description / subject line of the note |
| result[].notes[].note | Text | The note text content |
| result[].notes[].created | DateTime | When the note was created (ISO 8601 UTC) |
| result[].notes[].userId | Code[50] | User who created the note |

**Error Responses:**

| Error | Cause |
|-------|-------|
| Table not found | Invalid table name or number |
| Permission denied | User lacks read permission on the table |

**Example — Get notes for all customers:**

```json
{
  "tableName": "Customer"
}
```

**Example — Get notes for a specific customer using tableView:**

```json
{
  "tableName": "Customer",
  "tableView": "WHERE(No. = CONST(10000))"
}
```

**Example — Get notes with pagination:**

```json
{
  "tableName": "Sales Header",
  "skip": 10,
  "take": 5
}
```

**Example — Get notes modified in a date range:**

```json
{
  "tableName": "Customer",
  "startDateTime": "2025-01-01T00:00:00Z",
  "endDateTime": "2025-06-30T23:59:59Z"
}
```

**Performance Considerations:**
- Notes are stored as BLOBs — each note requires a BLOB read via Record Link Management
- Use skip/take pagination to limit the number of records returned
- Use tableView to filter to specific records when you only need notes for a subset
- Records with no notes appear in the result with an empty notes array
- The noOfRecords count is calculated before pagination is applied

**Related Message Types:**
- `Data.Records.Get` — retrieves full record data as JSON (same record-loop pattern)
- `Data.RecordIds.Get` — retrieves record IDs for a table
- `Data.Totals.Get` — aggregates decimal fields

---

## 7. Data.Notes.Set {#datanotesset}

**Purpose:** Add new notes or edit existing notes on the Record Link table for a specified record.

**Description:** Writes notes to any BC record via the Record Link table (Type = Note). Each note in the request array is either added (no lineNo) or edited (lineNo provided). Editing a note with empty text deletes it. Returns a summary of added/modified counts and the resulting note details.

**Message Direction:** Inbound

**Table Identification:**

The target table can be specified using the following options (evaluated in this order):
1. `tableName` in the JSON data payload
2. `tableNumber` in the JSON data payload
3. `tableNo` in the JSON data payload (alias for `tableNumber`)
4. `tableId` in the JSON data payload (alias for `tableNumber`)
5. `subject` field in the Bifrost envelope

**Record Identification:**

The target record must be identified using one of:
- `recordId`: SystemId GUID of the target record (preferred)
- `tableView`: BC table view filter that matches exactly one record

At least one must be provided. If both are present, `recordId` takes precedence.

**Input Parameters:**

```json
{
  "tableName": "Customer",
  "recordId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "notes": [
    { "description": "Payment follow-up", "note": "New note text" },
    { "description": "Updated subject", "note": "Updated text", "lineNo": 12345 }
  ]
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tableName | Text | Yes* | — | Name of the target table |
| tableNumber / tableNo / tableId | Integer | Yes* | — | ID of the target table (alternative to tableName) |
| recordId | GUID | Yes** | — | SystemId of the target record |
| tableView | Text | Yes** | — | BC table view filter to locate exactly one record |
| notes | Array | Yes | — | Array of note objects to add or edit |
| notes[].description | Text[250] | No | — | Short description / subject line for the note. On edit, only updated when non-empty. |
| notes[].note | Text | Yes (add) / No (edit) | — | The note text content. On edit, empty text deletes the note. |
| notes[].lineNo | Integer | No | — | Record Link ID of existing note to edit. Omit to add new. |

\* One table identifier is required.
\*\* At least one record identifier is required. If both provided, recordId takes precedence.

**Response Format:**

```json
{
  "status": "Success",
  "addedCount": 1,
  "modifiedCount": 1,
  "notes": [
    {
      "lineNo": 67890,
      "note": "New note text",
      "action": "added"
    },
    {
      "lineNo": 12345,
      "note": "Updated text",
      "action": "modified"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| status | Text | "Success" or "Error" |
| addedCount | Integer | Number of new notes created |
| modifiedCount | Integer | Number of existing notes updated |
| notes | Array | Array of processed note objects |
| notes[].lineNo | Integer | Record Link ID (assigned on add, echoed on edit) |
| notes[].note | Text | The note text that was written |
| notes[].action | Text | "added" or "modified" |

**Error Responses:**

| Error | Cause |
|-------|-------|
| Table not found | Invalid table name or number |
| Table restricted | Table is internal and cannot be written via this message type |
| Record not found | recordId or tableView did not match any record |
| Missing record identifier | Neither recordId nor tableView was provided |
| Missing notes array | The notes array is required in the request |
| Note not found | lineNo does not match an existing Note-type record link for the record |

**Example — Add a single note by SystemId:**

```json
{
  "tableName": "Customer",
  "recordId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "notes": [
    { "note": "Called customer about delayed payment." }
  ]
}
```

**Example — Edit an existing note by tableView:**

```json
{
  "tableName": "Customer",
  "tableView": "WHERE(No. = CONST(10000))",
  "notes": [
    { "note": "Updated: Payment received.", "lineNo": 12345 }
  ]
}
```

**Example — Mixed add and edit:**

```json
{
  "tableName": "Sales Header",
  "recordId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "notes": [
    { "note": "Shipping confirmed." },
    { "note": "Correction: address updated.", "lineNo": 54321 }
  ]
}
```

**Example — Delete a note:**

```json
{
  "tableName": "Customer",
  "recordId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "notes": [
    { "note": "", "lineNo": 12345 }
  ]
}
```

**Implementation Details:**
- Notes are stored in the Record Link table (Type = Note)
- New notes are assigned a lineNo (Link ID) automatically on insert
- The Created timestamp and User ID are set from the current session
- Internal Bifrost tables are blocked from writes
- If any note in the array fails (e.g., invalid lineNo), processing stops and an error is returned
- Editing a note with empty text deletes the Record Link
- On edit, description is only updated when a non-empty value is provided

**Related Message Types:**
- `Data.Notes.Get` — retrieves notes for records (read counterpart)
- `Data.Records.Set` — sets field values on records
- `Data.Records.Get` — retrieves full record data as JSON

---

## 8. Deleted.Records.Get {#deletedrecordsget}

**Purpose:** Retrieve full field-level snapshots of deleted records from the Delete Log ori.

**Description:** Retrieves full field-level snapshots of deleted records from the Delete Log ori, following the same data-shipping format as `Data.Records.Get`. **Prerequisite:** "Store Record" must be enabled in Delete Setup ori for the source table — otherwise an error is returned.

**Message Direction:** Outbound

**Input Parameters:**

```json
{
  "tableName": "Customer",
  "startDateTime": "2026-01-01T00:00:00Z",
  "endDateTime": "2026-03-21T23:59:59Z",
  "fieldNumbers": [1, 2, 5],
  "skip": 0,
  "take": 100
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tableName` / `tableNumber` | string / integer | — | Source table (required) |
| `fieldNumbers` | int[] | all stored fields | Specific field numbers to return |
| `startDateTime` | ISO 8601 datetime | — | Filter by "Deleted At" ≥ |
| `endDateTime` | ISO 8601 datetime | now | Filter by "Deleted At" ≤ |
| `skip` | integer | 0 | Pagination offset |
| `take` | integer | 100 | Page size |

**Response Format:**

```json
{
  "status": "Success",
  "noOfRecords": 25,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "No_": "10000" },
      "fields": { "Name": "Deleted Customer", "City": "Reykjavik" }
    }
  ]
}
```

**Error Scenarios:**
- Read permission denied on the source table
- "Store Record must be enabled in Delete Setup ori for table &#123;x&#125;" — if snapshots are not configured for the table

**Related Message Types:**
- `Deleted.RecordIds.Get` — IDs + deletion timestamps only (no "Store Record" requirement)
- `CSV.DeletedRecords.Get` — deleted record audit log as CSV (fixed audit columns only)
- `Data.Records.Get` — same format for current (non-deleted) records

---

## 9. Deleted.RecordIds.Get {#deletedrecordidsget}

**Purpose:** Retrieve SystemId and deletion timestamp for deleted records — lightweight sync-oriented type.

**Description:** Returns only SystemId and deletion timestamp for deleted records. Works regardless of "Store Record" configuration in Delete Setup ori. Ideal for sync workflows that only need to know which records were deleted and when.

**Message Direction:** Outbound

**Input Parameters:**

```json
{
  "tableName": "Customer",
  "startDateTime": "2026-03-01T00:00:00Z",
  "endDateTime": "2026-03-21T23:59:59Z",
  "skip": 0,
  "take": 100
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tableName` / `tableNumber` | string / integer | — | Source table (required) |
| `startDateTime` | ISO 8601 datetime | — | Filter by "Deleted At" ≥ |
| `endDateTime` | ISO 8601 datetime | now | Filter by "Deleted At" ≤ |
| `skip` | integer | 0 | Pagination offset |
| `take` | integer | 100 | Page size |

Note: `fieldNumbers` and `tableView` are not supported.

**Response Format:**

```json
{
  "status": "Success",
  "noOfRecords": 42,
  "result": [
    { "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "deletedAt": "2026-03-15T14:30:00Z" }
  ]
}
```

Note: the timestamp field is `deletedAt` (not `modifiedAt` as in `Data.RecordIds.Get`).

**Related Message Types:**
- `Deleted.Records.Get` — full field-level snapshots (requires "Store Record" enabled)
- `CSV.DeletedRecords.Get` — deleted record audit log as CSV
- `Data.RecordIds.Get` — IDs + modification timestamps for current (non-deleted) records

---

## 10. CSV.DeletedRecords.Get {#csvdeletedrecordsget}

**Purpose:** Export deleted record audit log entries as CSV.

**Description:** Returns a plain UTF-8 CSV of Delete Log ori entries. Returns fixed audit columns plus a `$Company` column for per-company tables (controlled by the **Export Company Name Type** setup field — see [Setup_Reference.md](/foundation/reference/setup/) section 8) — not the field-level record data (use `Deleted.Records.Get` for full field data). `tableName` is optional; omit to get entries for all tables.

**Message Direction:** Outbound

**Input Parameters:**

```json
{
  "tableName": "Customer",
  "startDateTime": "2026-01-01T00:00:00Z",
  "endDateTime": "2026-03-21T23:59:59Z"
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `tableName` / `tableNumber` | string / integer | Source table filter (optional — omit for all tables) |
| `startDateTime` | ISO 8601 datetime | Filter by "Deleted At" ≥ |
| `endDateTime` | ISO 8601 datetime | Filter by "Deleted At" ≤ (defaults to now) |

**Fixed CSV Columns (always the same):**

| Column | Description |
|--------|-------------|
| `systemId` | GUID of the deleted record |
| `tableId` | BC table number |
| `tableName` | BC table name |
| `deletedAt` | ISO 8601 deletion timestamp |
| `userId` | User ID who deleted the record |
| `$Company` | Company name (only for per-company tables) |
| `__rowMarker__` | Open Mirroring row marker — always `2` (deleted record) |

**__rowMarker__ Column (Open Mirroring):**

The `__rowMarker__` column is always the last column in every row. For `CSV.DeletedRecords.Get`, the value is always `2`, indicating a deleted record. When combined with `CSV.Records.Get` exports (rowMarker = `4`), downstream systems can merge both exports for a complete record lifecycle view.

**Response:** When records match, the `data` field in the response contains a download URL. GET that URL to retrieve the CSV file. The first row is the column header; subsequent rows are data rows.

**If no records match the filters, no CSV is written.** Both `data` and `datacontenttype` in the Bifrost response will be empty string. The task still completes successfully — check whether `data` is empty before attempting to download. Pagination (`skip`/`take`) is not supported.

**Related Message Types:**
- `Deleted.Records.Get` — full JSON field data (requires "Store Record" enabled)
- `Deleted.RecordIds.Get` — IDs + timestamps (JSON format)
- `CSV.Records.Get` — export current (non-deleted) records as CSV

---

## 11. Data.Entries.Find {#dataentriesfind}

**Purpose:** Find all related entries for a document number using BC's standard Navigate (Find Entries) mechanism.

**Description:** Returns a list of tables that contain entries matching the given document number, along with the record count in each table. This is the programmatic equivalent of the "Find Entries..." action (Ctrl+F7 → Navigate) available throughout Business Central. It searches all standard entry tables (G/L Entries, Customer Ledger Entries, Vendor Ledger Entries, Item Ledger Entries, VAT Entries, Bank Account Ledger Entries, etc.) plus any tables registered by installed extensions.

**Message Direction:** Outbound

**Input Parameters:**

```json
{
  "documentNo": "PSI-103047",
  "postingDate": "2025-03-15"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentNo` | string | **Yes** | The document number to search for (e.g. invoice number, order number, shipment number) |
| `postingDate` | date (ISO 8601) | No | Optional posting date filter. When provided, only entries with this posting date are included. Format: `YYYY-MM-DD` |

**Minimal Request (document number only):**

```json
{
  "documentNo": "PSI-103047"
}
```

**Response Format:**

```json
{
  "status": "Success",
  "documentNo": "PSI-103047",
  "postingDate": "2025-03-15",
  "totalTables": 4,
  "totalRecords": 12,
  "entries": [
    {
      "tableId": 21,
      "tableName": "Cust. Ledger Entry",
      "noOfRecords": 1
    },
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "noOfRecords": 5
    },
    {
      "tableId": 254,
      "tableName": "VAT Entry",
      "noOfRecords": 2
    },
    {
      "tableId": 379,
      "tableName": "Detailed Cust. Ledg. Entry",
      "noOfRecords": 4
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"Success"` or `"Error"` |
| `documentNo` | string | The document number that was searched |
| `postingDate` | string | The posting date filter (only present if provided in request) |
| `totalTables` | integer | Number of distinct tables with matching entries |
| `totalRecords` | integer | Total number of matching records across all tables |
| `entries` | array | Array of table results |
| `entries[].tableId` | integer | The BC table ID |
| `entries[].tableName` | string | The table caption/name |
| `entries[].noOfRecords` | integer | Number of matching records in this table |

**Usage Notes:**

- The search uses BC's standard Navigate infrastructure, which includes all base application tables and any extensions that subscribe to the Navigate events.
- When `postingDate` is omitted, all entries matching the document number regardless of date are returned.
- Tables with zero matching records are not included in the response.
- To retrieve the actual records from a specific table in the results, use `Data.Records.Get` with a `tableView` filter on the document number field.

**Common Tables in Results:**

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

**Error Handling:**

| Error | Cause |
|-------|-------|
| `documentNo is required.` | The `documentNo` parameter was not provided or is empty |

**Related Message Types:**
- `Data.Records.Get` — Retrieve the actual record data from tables identified by this message type
- `Data.RecordIds.Get` — Get record IDs with filters for a specific table
- `Data.Totals.Get` — Aggregate numeric fields across matching records

---

## Related Documentation

- **[API_Reference.md](/foundation/reference/api/)**: API endpoints and authentication
- **[Metadata_Message_Types.md](/foundation/message-types/metadata/)**: Help and metadata message types
- **[Sales_Message_Types.md](/foundation/message-types/sales/)**: Sales and business logic message types
