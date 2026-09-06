---
id: data-operations
title: "Data operations"
sidebar_label: "Data operations"
sidebar_position: 4
description: "The generic read/write message types that work against any table — Data.Records.Get / .Set, Data.RecordIds.Get, the CSV exports, Data.Totals.Get, the deleted-record feeds, Data.Entries.Find and notes — plus the field-name normalisation rule they all share, the pagination pattern…"
---

The generic read/write message types that work against any table — `Data.Records.Get` / `.Set`, `Data.RecordIds.Get`, the CSV exports, `Data.Totals.Get`, the deleted-record feeds, `Data.Entries.Find` and notes — plus the field-name normalisation rule they all share, the pagination pattern and how to check whether a record already exists.

[← back to SKILL.md](../index.md) · originally sections 6, 7.1, 8, 22 of the single-file skill.

---

## 6. Data Field Naming — Field Name Normalization

BC field names are normalized to JSON keys using two steps applied in order:

1. Replace each of `` % . " \ / ' `` with `_`
2. Strip every remaining character that is **not** `_`, a letter (`A–Z`, `a–z`), or a digit (`0–9`)

```
BC field name          → JSON key
──────────────────────────────────
No.                    → No_
Phone No.              → PhoneNo_
E-Mail                 → EMail
Credit Limit (LCY)     → CreditLimitLCY
G/L Account No.        → G_LAccountNo_
Sell-to Customer No.   → SelltoCustomerNo_
Dimension Set ID       → DimensionSetID
Unit Price             → UnitPrice
Document Type          → DocumentType
```

**Golden rule: call `Help.Fields.Get` on the table to get the exact `jsonName` for any field. Do not guess.**

- `name` → original BC field name (use in `tableView` WHERE clauses)
- `jsonName` → normalized JSON key (use in `Data.Records.Get` / `Data.Records.Set` field objects)
- `caption` → localised display label (use for UI only, not in queries)

---

### 7.1 DATA OPERATIONS

#### `Data.Records.Get` — Read table records

Direction: **Outbound**

Table identification (evaluated in this priority order):
1. `data.tableNumber` (or `tableNo` / `tableId`) — integer
2. `data.tableName` — string
3. `subject` — table name or numeric string

```json
{
  "specversion": "1.0",
  "type": "Data.Records.Get",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"fieldNumbers\":[1,2,5,7],\"tableView\":\"WHERE(Blocked=CONST( ))\",\"startDateTime\":\"2026-01-01T00:00:00Z\",\"endDateTime\":\"2026-12-31T23:59:59Z\",\"skip\":0,\"take\":100}"
}
```

Input parameters:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `tableName` | string | — | Table name (e.g. `"Customer"`) |
| `tableNumber` / `tableNo` / `tableId` | integer | — | Table number (e.g. `18`) |
| `fieldNumbers` | int[] | all fields | Field numbers to return. When specified, FlowFields are also calculated. |
| `startDateTime` | ISO 8601 | — | Filter by `SystemModifiedAt` ≥ |
| `endDateTime` | ISO 8601 | — | Filter by `SystemModifiedAt` ≤ |
| `tableView` | string | — | BC table view filter (see §11) |
| `skip` | integer | 0 | Pagination offset |
| `take` | integer | 100 | Page size |

Response:
```json
{
  "status": "Success",
  "noOfRecords": 245,
  "result": [
    {
      "id": "7FE8C74C-7A01-F111-A1F9-6045BD750E1F",
      "primaryKey": { "No_": "10000" },
      "fields": {
        "Name": "Adatum Corporation",
        "CreditLimitLCY": 10000.50,
        "Blocked": " "
      }
    }
  ]
}
```

- `id` = SystemId (GUID, uppercase)
- `noOfRecords` = **total count matching all filters** — unaffected by `skip`/`take`. Use for pagination: `totalPages = Math.ceil(noOfRecords / take)`
- `primaryKey` = PK fields only; never appears in `fields`
- `fields` = non-PK fields; only the normalised `jsonName` is used as key
- Option/Enum fields return the **display caption** in the requested `lcid`
- FlowFields are **only calculated when `fieldNumbers` is specified**
- Blank `Date` fields return as `null` or `"0001-01-01"`
- Currency Code blank = LCY code (see §9)
- Dimension Set ID returns as array (see §9)

#### `Data.RecordIds.Get` — IDs + timestamps (fast incremental sync)

Direction: **Outbound**

Same parameters as `Data.Records.Get` except no `fieldNumbers`. Returns only SystemId and `SystemModifiedAt`.

**`startDateTime` and `endDateTime` are both optional:**
- Omit `startDateTime` → defaults to `0DT` (beginning of time, returns all records from the start)
- Omit `endDateTime` → defaults to `CurrentDateTime()` (up to now)
- Omit both → returns IDs for all records in the table

```json
{
  "specversion": "1.0",
  "type": "Data.RecordIds.Get",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"startDateTime\":\"2026-01-01T00:00:00Z\"}"
}
```

Minimal form (all records, no date filter):
```json
{
  "specversion": "1.0",
  "type": "Data.RecordIds.Get",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\"}"
}
```

Response:
```json
{
  "status": "Success",
  "noOfRecords": 150,
  "result": [
    { "id": "3F915906-44FF-F011-A1FB-7CED8DB3A1C7", "modifiedAt": "2026-03-09T20:55:57.89Z" }
  ]
}
```

#### `CSV.Records.Get` — Export table as CSV (Open Mirroring format)

Direction: **Outbound**  
Content-Type: **text/csv**

Exports all matching records from a BC table as a UTF-8 CSV file. For large result sets that approach the 2 GB OutStream limit, a **continuation pattern** is supported via `continueFromRecordId`. Designed for bulk export and Open Mirroring scenarios.

Table identification is the same priority order as `Data.Records.Get`: `tableNumber` → `tableName` → `subject`.

```json
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Customer",
  "datacontenttype": "application/json",
  "data": "{\"tableName\":\"Customer\",\"tableView\":\"WHERE(Blocked = CONST( ))\"}"
}
```

Input parameters (in `data` JSON payload):

| Parameter | Type | Default | Description |
|---|---|---|---|
| `tableName` | string | — | Table name (e.g. `"Customer"`) |
| `tableNumber` / `tableNo` / `tableId` | integer | — | Table number (e.g. `18`) |
| `fieldNumbers` | int[] | all fields | Specific field numbers to include (BLOB/Media fields are always skipped) |
| `startDateTime` | ISO 8601 | — | Filter by `SystemModifiedAt` ≥ |
| `endDateTime` | ISO 8601 | — | Filter by `SystemModifiedAt` ≤ |
| `tableView` | string | — | BC AL table view filter (see §11) |

Top-level Bifrost attribute (NOT in data payload):

| Parameter | Type | Default | Description |
|---|---|---|---|
| `continueFromRecordId` | GUID | — | SystemId of the record to resume from. Omit or leave empty for the first request. |

**No `skip` or `take`** — use the continuation pattern for large exports instead of pagination.

**Column naming convention:** stripped field name with non-alphanumeric characters (except `%`) removed  
Only characters `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890%` are kept from the field name; all other characters are removed.

| BC field | Column header |
|---|---|
| `No.` | `No` |
| `Name` | `Name` |
| `Sell-to Customer No.` | `SelltoCustomerNo` |
| `SystemId` | `SystemId` |

**System fields always appended** (regardless of `fieldNumbers`):

| Column | Field No. | Description |
|---|---|---|
| `timestamp` | 0 | Internal timestamp (BigInteger) |
| `SystemId` | 2000000000 | Record GUID |
| `SystemCreatedAt` | 2000000001 | Creation timestamp UTC |
| `SystemCreatedBy` | 2000000002 | Created by user GUID |
| `SystemModifiedAt` | 2000000003 | Last modified timestamp UTC |
| `SystemModifiedBy` | 2000000004 | Last modified by user GUID |

**`__rowMarker__` column (Open Mirroring)** — always the last column in every row. For `CSV.Records.Get` the value is always `4` (active/upsert record). When combined with `CSV.DeletedRecords.Get` exports (`__rowMarker__` = `2`), downstream systems can merge both exports for a complete record lifecycle view.

**`$Company` column** — appended before system fields for per-company tables. Value is the current company name (double-quoted).

**Value formatting:**

| Type | Format | Quoted |
|---|---|---|
| BigInteger, Integer, Decimal, Duration | Culture-invariant number | No |
| Boolean | `true` or `false` | No |
| Date | `YYYY-MM-DD` (blank → empty string) | No |
| DateTime | ISO 8601 UTC with 3-digit ms, e.g. `2024-01-15T10:30:00.000Z` (zero DT → empty) | No |
| Time | `HH:mm:ss` | Yes |
| Option | Enum value name | Yes |
| Code, Text, Guid | String value | Yes |

String escaping: LF/CR → space; `\` → `\\`; `"` → `\"`; wrapped in double quotes.

**Unsupported types (silently skipped):** BLOB, Media, MediaSet, RecordID, OemCode, OemText, TableFilter.

Response — when records match, the `data` field contains a download URL:
```
/api/origo/bifrost/v1.0/responses({guid})
```
GET that URL to download the CSV. The first row is the header. **If no records match, both `data` and `datacontenttype` in the Bifrost response will be empty string** — no content is produced. Check whether `data` is empty before attempting to download.

```
No,Name,Address,City,$Company,timestamp,SystemId,SystemCreatedAt,SystemCreatedBy,SystemModifiedAt,SystemModifiedBy,__rowMarker__
"C00001","Fabrikam, Inc.","123 Main St","Seattle","CRONUS International Ltd.",12345,"7FE8C7...",2024-01-15T10:30:00.000Z,"user-guid...",2024-01-15T10:30:00.000Z,"user-guid...",4
```

**Error handling:**

| Condition | Result |
|---|---|
| Table not identified | Error raised |
| Table is internal/restricted | Error: `Table {n} ({name}) cannot be read via CSV.Records.Get. This is an internal table.` |
| Read permission denied | Error with table number |
| `continueFromRecordId` points to non-existent record | Error: `Unable to locate the record in table {name} with System Id {guid}` |
| No records match | Task succeeds; `data` and `datacontenttype` are both empty |
| Unsupported field type | Field silently skipped |

**Continuation pattern (large exports):**

When the CSV response approaches the ~2 GB OutStream limit, the export stops after the current 4 MB chunk and returns the `SystemId` of the **next unprocessed record** in the `continueFromRecordId` response field.

1. Send a normal `CSV.Records.Get` request (no `continueFromRecordId`).
2. Check the `continueFromRecordId` field in the response.
3. If it contains a GUID, send another request with `continueFromRecordId` set to that value.
4. Repeat until the response `continueFromRecordId` is empty (all records exported).

Continuation request example:
```json
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Item Ledger Entry",
  "continueFromRecordId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

**Important:** Each continuation chunk includes the CSV header row — consumers should skip the header on subsequent chunks. The same filters (`tableView`, `startDateTime`, `endDateTime`) must be sent on every continuation request to ensure consistent results.

**Related:** `Data.Records.Get` — same filtering, JSON output, supports pagination · `Data.RecordIds.Get` — IDs + timestamps only · `CSV.DeletedRecords.Get` — deleted record audit export as CSV

---

#### `Data.Totals.Get` — Aggregate Decimal SumIndexFields

Direction: **Outbound** — Content-Type: `text/json`

Uses BC's native `CalcSums` to sum one or more Decimal SumIndexFields without iterating records. Returns a JSON **array** where each element contains a `group` key and one key per summed field. Without `groupBy`, returns a single element with an empty `group`. With `groupBy`, returns one element per distinct value.

Table identified via `tableName`/`tableNumber` (or `subject`). `fieldNumbers` is **required**. `groupBy` is optional.

```json
{
  "type": "Data.Totals.Get",
  "data": { "tableName": "Item Ledger Entry", "fieldNumbers": [12, 14], "tableView": "WHERE(Entry Type=CONST(Purchase))", "groupBy": 3 }
}
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `tableName` / `tableNumber` | string / integer | Yes (one of) | Target table |
| `fieldNumbers` | int[] | **Required** | Field numbers to sum. Must all be Decimal SumIndexFields. |
| `tableView` | string | No | BC AL SetView filter to restrict which records are included |
| `groupBy` | integer or string | No | Field number or field name to group by. Returns one result element per distinct value. |

Response (ungrouped): `{ "status": "Success", "result": [{ "group": "", "Quantity": 8500.00, "InvoicedQuantity": 7200.00 }] }`

Response (grouped): `{ "status": "Success", "result": [{ "group": "Purchase", "Quantity": 8500.00, "InvoicedQuantity": 7200.00 }, { "group": "Sale", "Quantity": -3200.00, "InvoicedQuantity": -2800.50 }] }`

**`groupBy` behavior:**
- Accepts field number (integer) or field name (string)
- Field is looked up in table metadata
- If field is not found, groupBy is silently ignored (no grouping)
- `group` value in response is the formatted field value for each distinct group

**Field naming** — same rule as `Data.Records.Get`: `` % . " \ / ' `` replaced with `_`, spaces and other non-alphanumeric symbols removed. E.g. `Invoiced Quantity` —> `InvoicedQuantity`.

**Constraints:**
- `fieldNumbers` missing or empty — error
- Field must be **Decimal** type; non-Decimal returns error
- Field must be a **SumIndexField**; non-SIFT field causes BC runtime error
- Field must not be read-restricted
- No records match `tableView` — returns 0 for each field (not an error)
- `skip`, `take`, `startDateTime`, `endDateTime` not supported

**Related:** `Data.Records.Get` — same filtering, JSON output — `Help.Fields.Get` — check if field is SumIndexField

---

#### `Deleted.Records.Get` — Full snapshots of deleted records

Direction: **Outbound** — Content-Type: `text/json`

Retrieves full field-level snapshots of deleted records from the Delete Log ori. Returns the same data-shipping format as `Data.Records.Get`. **Prerequisite:** "Store Record" must be enabled in Delete Setup ori for the source table.

```json
{
  "specversion": "1.0",
  "type": "Deleted.Records.Get",
  "source": "my-integration",
  "data": "{\"tableName\":\"Customer\",\"startDateTime\":\"2026-01-01T00:00:00Z\",\"endDateTime\":\"2026-03-21T23:59:59Z\",\"skip\":0,\"take\":100}"
}
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `tableName` / `tableNumber` | string / integer | — | Source table (required) |
| `fieldNumbers` | int[] | all stored fields | Specific field numbers to return |
| `startDateTime` | ISO 8601 | — | Filter by "Deleted At" ≥ |
| `endDateTime` | ISO 8601 | now | Filter by "Deleted At" ≤ |
| `skip` | integer | 0 | Pagination offset |
| `take` | integer | 100 | Page size |

Response (same format as `Data.Records.Get`):
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

**Errors:** Read permission denied · "Store Record must be enabled in Delete Setup ori for table &#123;x&#125;" if snapshots not configured.

**Related:** `Deleted.RecordIds.Get` — IDs + timestamps only · `CSV.DeletedRecords.Get` — CSV audit export · `Data.Records.Get` — current (non-deleted) records

---

#### `Deleted.RecordIds.Get` — IDs + deletion timestamps for deleted records

Direction: **Outbound** — Content-Type: `text/json`

Lightweight sync-oriented type. Returns only SystemId and deletion timestamp. Works regardless of "Store Record" configuration.

```json
{
  "specversion": "1.0",
  "type": "Deleted.RecordIds.Get",
  "source": "my-integration",
  "data": "{\"tableName\":\"Customer\",\"startDateTime\":\"2026-03-01T00:00:00Z\",\"skip\":0,\"take\":100}"
}
```

Parameters: same as `Deleted.Records.Get` except no `fieldNumbers` and no `tableView`.

Response:
```json
{
  "status": "Success",
  "noOfRecords": 42,
  "result": [
    { "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "deletedAt": "2026-03-15T14:30:00Z" }
  ]
}
```

Note: response field is `deletedAt` (not `modifiedAt` as in `Data.RecordIds.Get`).

**Related:** `Deleted.Records.Get` — full field data · `CSV.DeletedRecords.Get` — CSV audit export · `Data.RecordIds.Get` — IDs for current (non-deleted) records

---

#### `CSV.DeletedRecords.Get` — Deleted record audit log as CSV

Direction: **Outbound** — Content-Type: `text/csv`

Returns a plain UTF-8 CSV of Delete Log ori entries. Always returns the same fixed audit columns — not the field-level record data. `tableName` is optional (omit to get all tables).

```json
{
  "specversion": "1.0",
  "type": "CSV.DeletedRecords.Get",
  "source": "my-integration",
  "data": "{\"tableName\":\"Customer\",\"startDateTime\":\"2026-01-01T00:00:00Z\",\"endDateTime\":\"2026-03-21T23:59:59Z\"}"
}
```

| Parameter | Type | Description |
|---|---|---|
| `tableName` / `tableNumber` | string / integer | Source table filter (optional — omit for all tables) |
| `startDateTime` | ISO 8601 datetime | Filter by "Deleted At" ≥ |
| `endDateTime` | ISO 8601 datetime | Filter by "Deleted At" ≤ (defaults to now) |

Uses the same `startDateTime`/`endDateTime` parameter names as all other data operations.

**Fixed CSV columns:**

| Column | Description |
|---|---|
| `systemId` | GUID of the deleted record |
| `tableId` | BC table number |
| `tableName` | BC table name |
| `deletedAt` | ISO 8601 deletion timestamp |
| `userId` | User ID who deleted the record |
| `$Company` | Company name (only for per-company tables) |
| `__rowMarker__` | Open Mirroring row marker — always `2` (deleted record) |

Response — `data` field contains download URL. GET to retrieve CSV. First row is the header. **If no records match, both `data` and `datacontenttype` are empty string** — check before downloading. No pagination (`skip`/`take` not supported).

**Related:** `Deleted.Records.Get` — full JSON field data · `Deleted.RecordIds.Get` — IDs + timestamps · `CSV.Records.Get` — export current (non-deleted) records

---

#### `Data.Entries.Find` — Find all related entries for a document

Direction: **Outbound** — Content-Type: `text/json`

Uses BC's standard Navigate (Find Entries) mechanism to find all related entries for a document number. Returns table names, IDs, and record counts for each table with matching entries.

```json
{
  "specversion": "1.0",
  "type": "Data.Entries.Find",
  "source": "my-integration",
  "data": "{\"documentNo\":\"PSI-103047\",\"postingDate\":\"2025-03-15\"}"
}
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `documentNo` | string | **Yes** | Document number to search for |
| `postingDate` | date (ISO 8601) | No | Posting date filter (only entries on this date) |

Response:
```json
{
  "status": "Success",
  "documentNo": "PSI-103047",
  "postingDate": "2025-03-15",
  "totalTables": 4,
  "totalRecords": 12,
  "entries": [
    { "tableId": 21, "tableName": "Cust. Ledger Entry", "noOfRecords": 1 },
    { "tableId": 17, "tableName": "G/L Entry", "noOfRecords": 5 },
    { "tableId": 254, "tableName": "VAT Entry", "noOfRecords": 2 },
    { "tableId": 379, "tableName": "Detailed Cust. Ledg. Entry", "noOfRecords": 4 }
  ]
}
```

**Errors:** `documentNo is required.` — the `documentNo` parameter was not provided or is empty.

**Next step — retrieve entries:** Use `Data.Records.Get` with the `tableId` from the response as `subject` and a `tableView` filter:
```json
{
  "specversion": "1.0",
  "type": "Data.Records.Get",
  "source": "my-integration",
  "subject": "21",
  "data": "{\"tableView\":\"WHERE(Document No.=CONST(PSI-103047),Posting Date=CONST(2025-03-15))\"}"
}
```
Omit the `Posting Date` filter if `postingDate` was not provided in the original request. Add `fieldNumbers` to limit returned fields.

**Related:** `Data.Records.Get` — retrieve actual record data from identified tables · `Data.RecordIds.Get` — IDs with filters for a specific table · `Data.Totals.Get` — aggregate numeric fields

---

#### `Data.Records.Set` — Insert or update records

Direction: **Inbound**

Table identified via `subject` (table name or number string) **or** `tableName`/`tableNumber` inside `data`.

```json
{
  "specversion": "1.0",
  "type": "Data.Records.Set",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"data\":[{\"id\":\"7FE8C74C-7A01-F111-A1F9-6045BD750E1F\",\"fields\":{\"Address\":\"New Road 1\",\"City\":\"Reykjavik\"}}]}"
}
```

Each record in the `data` array:

| Field | Use |
|---|---|
| `id` (GUID string) | Update by SystemId — send alongside `fields` |
| `primaryKey` | Insert (if not found) or update (if found) by PK |
| `fields` | Fields to set/update. Never include PK fields here. |
| `identityInsert` | true = insert with the specified `id` as SystemId |

Lookup logic: `id` provided → find by SystemId and update; `primaryKey` only → find-or-insert by PK; both → `id` takes precedence.

**Field values in `fields` must be strings**:
- Decimal: `"CreditLimitLCY": "25000.75"`
- Boolean: `"PrintStatements": "true"`
- Option/Enum: `"Blocked": "Ship"` (AL name, localised caption, or ordinal string — all valid)
- Currency Code: send `"ISK"` (the LCY code) to store blank — see §9
- Dimension Set ID: send the array you received from Get — see §9

Response:
```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [{ "id": "…", "primaryKey": {…}, "fields": {…} }]
}
```

#### `Data.Notes.Get` — Retrieve notes for one or more records

Direction: **Outbound**

Reads Record Link entries of type Note for specified records. Table identified via `subject` (table name or number string) or `tableName`/`tableNumber` inside `data`.

**Single record** — subject is the record's primary key or SystemId:
```json
{
  "specversion": "1.0",
  "type": "Data.Notes.Get",
  "source": "MyApp v1.0",
  "subject": "10000",
  "data": "{\"tableName\":\"Customer\"}"
}
```

**Multiple records** — subject is the table, `data.records` lists the keys:
```json
{
  "specversion": "1.0",
  "type": "Data.Notes.Get",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"records\":[{\"primaryKey\":{\"No_\":\"10000\"}},{\"primaryKey\":{\"No_\":\"20000\"}}]}"
}
```

Response (single record):
```json
{
  "status": "Success",
  "result": [
    {
      "id": "7FE8C74C-...",
      "primaryKey": { "No_": "10000" },
      "notes": [
        {
          "lineNo": 12345,
          "description": "Call follow-up",
          "note": "Called customer about delayed payment.",
          "created": "2025-06-15T10:30:00Z",
          "userId": "USER001"
        }
      ]
    }
  ]
}
```

Note fields:

| Field | Type | Description |
|---|---|---|
| `lineNo` | Integer | Record Link ID (unique identifier) |
| `description` | Text[250] | Short description / subject line of the note |
| `note` | Text | The note text content (from the Note BLOB) |
| `created` | DateTime | When the note was created (format 9) |
| `userId` | Code[50] | User who created the note |

If no notes exist for a record, the `notes` array is empty.

#### `Data.Notes.Set` — Add, edit, or delete notes on a record

Direction: **Inbound**

Adds new notes or edits existing notes on the Record Link table for a specified record. Editing with empty note text deletes the note. Table identified via `subject` or `tableName`/`tableNumber` inside `data`.

```json
{
  "specversion": "1.0",
  "type": "Data.Notes.Set",
  "source": "MyApp v1.0",
  "subject": "10000",
  "data": "{\"tableName\":\"Customer\",\"notes\":[{\"description\":\"Payment follow-up\",\"note\":\"New note text\"},{\"lineNo\":12345,\"description\":\"Updated subject\",\"note\":\"Updated text\"},{\"lineNo\":12346,\"note\":\"\"}]}"
}
```

Each note in the `notes` array:

| Field | Required | Description |
|---|---|---|
| `description` | No | Short description / subject line (Text[250]). On edit, only updated when non-empty. |
| `note` | Yes (add) / No (edit) | The note text. On edit, empty text deletes the note. |
| `lineNo` | No | Record Link ID of existing note to edit/delete. Omit to add new. |

Response:
```json
{
  "status": "Success",
  "addedCount": 1,
  "modifiedCount": 2,
  "notes": [
    { "lineNo": 12347, "note": "New note text", "action": "added" },
    { "lineNo": 12345, "note": "Updated text", "action": "modified" },
    { "lineNo": 12346, "note": "", "action": "modified" }
  ]
}
```

---

## 8. Pagination Pattern

`noOfRecords` always equals the **total records matching all filters** regardless of `skip`/`take`. Never changes between pages — use it once to calculate total pages.

```javascript
const take = 100;
let skip = 0;

const first = await cePost(companyId, {
  type: "Data.Records.Get",
  data: JSON.stringify({ tableName: "Customer", skip, take })
});

const totalPages = Math.ceil(first.noOfRecords / take);

// Page N:
skip = pageIndex * take;
```

---

## 22. Duplicate / Existence Checking Pattern

Before inserting, check whether a record with the same unique identifier already exists:

```javascript
async function recordExists(companyId, tableName, tableView) {
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableName,
      tableView,
      fieldNumbers: [1],  // Only PK — minimal payload
      take: 1
    })
  });
  return (res.result?.length ?? 0) > 0;
}

// Check customer by registration number
const exists = await recordExists(
  companyId,
  'Customer',
  `WHERE(Registration Number=CONST(${regNo}))`
);
if (exists) {
  showError(`A customer with registration number ${regNo} already exists.`);
  return;
}
```
