---
id: 23-bc-metadata-mcp-server
title: "23. BC Metadata MCP Server"
sidebar_label: "23. BC Metadata MCP Server"
sidebar_position: 25
---

A Model Context Protocol (MCP) server is deployed at **`https://dynamics.is/api/mcp`**.
It exposes Business Central table and field metadata as MCP tools so that AI assistants
(Copilot, Claude, Cursor, etc.) can look up schema information on demand without any
extra credentials — authentication uses the server-side `BC_TENANT_ID`, `BC_CLIENT_ID`,
and `BC_CLIENT_SECRET` environment variables.

The company is resolved automatically: on the first tool call the server fetches
`GET /v2.0/{tenantId}/{env}/api/v2.0/companies` and caches the first company for the
lifetime of the warm function instance.

### 23.1 MCP Client Configuration

Add this to your MCP client configuration (e.g. `.vscode/mcp.json`, Claude Desktop, Cursor):

```json
{
  "servers": {
    "bc-metadata": {
      "type": "http",
      "url": "https://dynamics.is/api/mcp"
    }
  }
}
```

Auto-discovery is available at `https://dynamics.is/.well-known/mcp.json`.

### 23.2 Available Tools

#### `list_tables` — List all BC tables

Returns the full table catalogue for the company with table numbers, AL names, and
localized captions.

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `lcid` | integer | `1033` | Language LCID for captions (1033 = English, 1039 = Icelandic, 1030 = Danish) |

**Example request (JSON-RPC 2.0):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "list_tables",
    "arguments": { "lcid": 1033 }
  }
}
```

**Example response excerpt:**
```json
{
  "company": "CRONUS International Ltd.",
  "tableCount": 312,
  "tables": [
    { "id": 18,  "name": "Customer",  "caption": "Customer" },
    { "id": 23,  "name": "Vendor",    "caption": "Vendor" },
    { "id": 27,  "name": "Item",      "caption": "Item" }
  ]
}
```

---

#### `get_table_info` — Get summary for one table

Returns name, number, and caption for a single table identified by name or number.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `table` | string | ✅ | Table name (`"Customer"`) or number as string (`"18"`) |
| `lcid` | integer | | Language LCID (default 1033) |

**Example:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_table_info",
    "arguments": { "table": "Customer" }
  }
}
```

---

#### `get_table_fields` — Get all fields for a table

Returns complete field metadata plus read/write permissions for the table.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `table` | string | ✅ | Table name (`"Customer"`) or number as string (`"18"`) |
| `lcid` | integer | | Language LCID (default 1033) |

**Example:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "get_table_fields",
    "arguments": { "table": "Customer", "lcid": 1033 }
  }
}
```

**Response shape:**
```json
{
  "company": "CRONUS International Ltd.",
  "table": "Customer",
  "permissions": { "read": true, "write": true },
  "fieldCount": 148,
  "fields": [
    {
      "id": 1,
      "name": "No.",
      "jsonName": "No_",
      "caption": "No.",
      "type": "Code",
      "len": 20,
      "class": "Normal",
      "isPartOfPrimaryKey": true
    },
    {
      "id": 2,
      "name": "Name",
      "jsonName": "Name",
      "caption": "Name",
      "type": "Text",
      "len": 100,
      "class": "Normal",
      "isPartOfPrimaryKey": false,
      "hasTableRelation": false
    },
    {
      "id": 18,
      "name": "Gen. Bus. Posting Group",
      "jsonName": "Gen_Bus_PostingGroup",
      "caption": "Gen. Bus. Posting Group",
      "type": "Code",
      "len": 20,
      "class": "Normal",
      "isPartOfPrimaryKey": false,
      "hasTableRelation": false
    }
  ]
}
```

**Field object properties:**

| Property | Description |
|---|---|
| `id` | BC field number |
| `name` | AL field name (use in `tableView` WHERE clauses) |
| `jsonName` | Normalized JSON key (use in `Data.Records.Get` / `Data.Records.Set`) |
| `caption` | Localized display caption |
| `type` | AL data type (`Text`, `Code`, `Integer`, `Decimal`, `Boolean`, `Date`, `DateTime`, `Option`, `Enum`, …) |
| `len` | Field length (for Text/Code fields) |
| `class` | `Normal`, `FlowField`, or `FlowFilter` (FlowFilter = filter-dimension field for `tableView`) |
| `isPartOfPrimaryKey` | `true` if field is part of the primary key |
| `hasTableRelation` | `true` if field has a table relation (`RelationTableNo > 0`) |
| `enum` | Array of `{ value, caption }` for Option/Enum fields |

---

#### `get_record_count` — Total records in any table (with optional filter)

Returns the exact total number of records matching an optional filter, without fetching
full record data. Internally fires `Data.Records.Get` with `take:1` and `fieldNumbers:[1]`
(only the first field) so the response payload is minimal; the count is read from
`noOfRecords` in the BC response.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `table` | string | ✅ | BC table name (e.g. `'Customer'`, `'G/L Account'`). |
| `filter` | string | | Optional BC tableView filter (e.g. `"WHERE(Blocked=CONST( ))"`). |

**Returns:** `{ company, table, filter, count }`

```json
{ "company": "CRONUS IS", "table": "G/L Account", "filter": null, "count": 282 }
```

**Usage examples:**
```
// Total customers
get_record_count({ table: "Customer" })

// Only non-blocked customers
get_record_count({ table: "Customer", filter: "WHERE(Blocked=CONST( ))" })

// G/L accounts
get_record_count({ table: "G/L Account" })
```

---

#### `get_integration_timestamp` — Latest integration DateTime for source + tableId

Queries the **Integration ori** table for the most recent non-reversed `Date & Time`
entry matching the given `source` and `tableId`. Uses
`SORTING(Source,Table Id,Date & Time) ORDER(Descending) WHERE(...,Reversed=CONST(false))`
with `skip:0, take:1` so only one record is fetched.

**The Integration ori table schema:**

| Field | Type | PK | JSON key | Notes |
|---|---|---|---|---|
| Source | Text | ✅ | `Source` | Integration source name |
| Table Id | Integer | ✅ | `TableId` | BC table number |
| Date & Time | DateTime | ✅ | `DateTime` | ISO 8601 timestamp |
| Reversed | Boolean | | `Reversed` | `"true"` = entry is invalidated; ignored in lookup |

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source` | string | ✅ | Integration source name (e.g. `"MyApp"`) |
| `tableId` | integer | ✅ | BC table number (e.g. `18` for Customer) |

**Returns:** `{ company, source, tableId, dateTime }` — `dateTime` is `null` if no entry exists.

```json
{ "company": "CRONUS IS", "source": "MyApp", "tableId": 18, "dateTime": "2026-03-17T10:00:00Z" }
```

---

#### `set_integration_timestamp` — Record a completed integration run

Inserts a new non-reversed entry into the Bifrost Integration table. Call this after
a successful sync to persist the exact cutoff timestamp. The `dateTime` value becomes the
`Date & Time` primary key and is the value returned by the next `get_integration_timestamp` call.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source` | string | ✅ | Integration source name |
| `tableId` | integer | ✅ | BC table number |
| `dateTime` | string | ✅ | ISO 8601 timestamp to record (e.g. `"2026-03-17T12:00:00Z"`) |

**Returns:** `{ company, source, tableId, dateTime, written: 1 }`

---

#### `reverse_integration_timestamp` — Invalidate the current timestamp

Finds the latest non-reversed entry for `source + tableId` and sets `Reversed = true`.
Use this to roll back a sync checkpoint so the next run re-processes from the previous
timestamp (leaving earlier non-reversed entries intact).

The operation is a two-step read-then-modify:
1. `Data.Records.Get` with descending sort + `Reversed=CONST(false)` + `take:1`
2. `Data.Records.Set` with `mode: "modify"` to set `Reversed = "true"` on that record

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source` | string | ✅ | Integration source name |
| `tableId` | integer | ✅ | BC table number |

**Returns:** `{ company, source, tableId, reversed: true, dateTime }` — or `reversed: false` with a message if no reversible entry was found.

**Typical workflow:**

```
1. get_integration_timestamp({ source: "MyApp", tableId: 18 })
   → { dateTime: "2026-03-17T09:00:00Z" }

2. Run sync: fetch all Customer records modified after "2026-03-17T09:00:00Z"

3. set_integration_timestamp({ source: "MyApp", tableId: 18, dateTime: "2026-03-17T12:00:00Z" })
   → records the new cutoff

4. If the sync fails:
   reverse_integration_timestamp({ source: "MyApp", tableId: 18 })
   → marks "2026-03-17T12:00:00Z" as reversed; next get returns "2026-03-17T09:00:00Z" again
```

---

### 23.3 Using MCP Metadata in Integration Code

Before writing a `Data.Records.Get` or `Data.Records.Set` call against an unfamiliar
table, ask the MCP server for the field list first:

1. Call `get_table_fields` with the table name.
2. Use `name` (not `jsonName`) for `tableView` WHERE clause field names.
3. Use `jsonName` as the key in `Data.Records.Set` field objects and to read values
   back from `Data.Records.Get` responses.
4. Use `id` to build the `fieldNumbers` array in `Data.Records.Get` requests to
   return only the fields you actually need (see §18).
5. Check `permissions.write` before attempting `Data.Records.Set` — if `false`, BC
   will reject the write.

**Example — discover fields then read only what you need:**
```javascript
// Step 1 — ask MCP for Customer fields
// (via MCP client, not direct fetch — shown here for illustration)
const meta = await mcpClient.callTool('get_table_fields', { table: 'Customer' });
const noField     = meta.fields.find(f => f.name === 'No.');
const nameField   = meta.fields.find(f => f.name === 'Name');
const emailField  = meta.fields.find(f => f.name === 'E-Mail');

// Step 2 — use discovered field ids in the Bifrost call
const result = await cePost(companyId, {
  type: 'Data.Records.Get',
  data: JSON.stringify({
    tableName: 'Customer',
    fieldNumbers: [noField.id, nameField.id, emailField.id],
    take: 50
  })
});
```

---

#### `set_config` — Persist a JSON config object in BC

Upserts a record in the **Storage ori** table (`Source` + `Id` primary key, `Data` BLOB).  
The value is JSON-serialised, optionally AES-256-GCM encrypted, then Base64-encoded before storage.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source` | string | ✅ | Logical namespace / app name (e.g. `"BC Portal"`) |
| `id` | string | ✅ | Record identifier — any string or GUID |
| `data` | any | ✅ | JSON object or plain string to persist |
| `encrypt` | boolean | | Encrypt with server-side `MCP_ENCRYPTION_KEY` before storing (default `false`) |

**Returns:** `{ company, source, id, encrypted, written: 1 }`

```json
// Example: store connection settings encrypted
{
  "name": "set_config",
  "arguments": {
    "source": "BC Portal",
    "id":     "connection-settings",
    "data":   { "apiUrl": "https://example.com", "timeout": 30 },
    "encrypt": true
  }
}
```

---

#### `get_config` — Read a JSON config object from BC

Reads a record from the **Storage ori** table by `Source + Id`. Base64-decodes the BLOB,
optionally decrypts it, then JSON-parses the result. Returns `{ found: false }` when no record
exists.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source` | string | ✅ | Logical namespace / app name |
| `id` | string | ✅ | Record identifier |
| `decrypt` | boolean | | Decrypt with server-side `MCP_ENCRYPTION_KEY` (default `false`) |

**Returns:** `{ company, source, id, found: true, encrypted, data }` or `{ …, found: false }`

```json
// Example: read back the encrypted config
{
  "name": "get_config",
  "arguments": {
    "source":  "BC Portal",
    "id":      "connection-settings",
    "decrypt": true
  }
}
// → { "found": true, "data": { "apiUrl": "https://example.com", "timeout": 30 } }
```

---

#### `encrypt_data` / `decrypt_data` — Server-side AES-256-GCM encryption

`encrypt_data` encrypts any string with the server-side `MCP_ENCRYPTION_KEY` (AES-256-GCM).  
The output is a single Base64 string containing the IV (12 bytes) + auth tag (16 bytes) + ciphertext.

`decrypt_data` reverses the operation. Throws if the payload is tampered with or a different key is used.

**`encrypt_data` parameters:** `{ plaintext: string }` → `{ ciphertext: string }`  
**`decrypt_data` parameters:** `{ ciphertext: string }` → `{ plaintext: string }`

**Typical use — encrypt BC credentials for `x-encrypted-conn` header:**
```powershell
$body = @{
  jsonrpc = "2.0"; id = 1; method = "tools/call"
  params  = @{
    name      = "encrypt_data"
    arguments = @{
      plaintext = '{"tenantId":"...","clientId":"...","clientSecret":"...","environment":"Production"}'
    }
  }
} | ConvertTo-Json -Depth 10 -Compress
Invoke-WebRequest -Uri "https://dynamics.is/api/mcp" -Method POST `
  -ContentType "application/json" -Body $body -UseBasicParsing
  # → { "ciphertext": "<base64>" }  ← paste into .vscode/mcp.json as x-encrypted-conn value
```
