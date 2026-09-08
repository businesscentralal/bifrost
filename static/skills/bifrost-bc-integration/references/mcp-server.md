# BC MCP server (local setup)

The `origo-bc-mcp-server` package runs a Model Context Protocol (MCP) server on your own
machine that exposes Business Central metadata and data as MCP tools, so an AI assistant
(Claude Code, VS Code Copilot, Claude Desktop, Cursor, etc.) can look up schema and call
Bifröst message types without you writing a client by hand. There is no hosted instance of
this server — every developer or tester runs their own, against their own BC connection.

[← back to SKILL.md](../SKILL.md) · originally sections 23 of the single-file skill.

---

## 23. Origo BC MCP Server

Source and releases: [github.com/businesscentralal/origo-bc-mcp](https://github.com/businesscentralal/origo-bc-mcp).

### 23.1 Install

Requires Node.js 22+.

```bash
npm install -g github:businesscentralal/origo-bc-mcp
```

Verify the install:

```bash
origo-bc-mcp-server --help
```

### 23.2 Configure

Run the guided setup wizard once per machine:

```bash
origo-bc-mcp-server setup
```

It walks through: connection type (SaaS or on-prem), credentials, secret storage (DPAPI on
Windows, Keychain on macOS), connection validation, MCP client registration, and an optional
desktop shortcut.

Configuration is stored at `%USERPROFILE%\.origo-bc-mcp\local.settings.json` (Windows) or
`~/.origo-bc-mcp/local.settings.json` (macOS/Linux). It holds one default `devConnection`
plus any number of named `connections`, each pointing at a tenant/environment/company:

```json
{
  "basicAuth": {
    "enabled": true,
    "username": "dev",
    "password": "<pick your own — never commit this>"
  },
  "devConnection": {
    "tenantId": "<entra-tenant-guid>",
    "clientId": "<app-client-id>",
    "clientSecret": "env:BC_DEV_CLIENT_SECRET",
    "environment": "sandbox",
    "companyId": "<company-guid>"
  },
  "connections": {
    "sandbox": {
      "tenantId": "<entra-tenant-guid>",
      "clientId": "<app-client-id>",
      "clientSecret": "env:BC_SANDBOX_CLIENT_SECRET",
      "environment": "sandbox",
      "companyId": "<company-guid>"
    }
  }
}
```

An on-prem connection uses `baseUrl` / `onPremTenant` / `user` / `key` instead of
`tenantId` / `clientId` / `clientSecret`.

**Never write a real tenant id, client id, client secret, company id, username or password
into this file as a literal, into a command, or into chat.** Use `env:VAR_NAME` (a value
read from an environment variable), or the `dpapi:` / `keychain:` / `aes:` prefixed forms
the setup wizard writes for you, and keep the placeholders above (or your own dummy values)
in anything you commit or share.

You can add a connection without the full wizard (`origo-bc-mcp-server add <name>`), list
configured connections (`origo-bc-mcp-server remove` with no name), remove one
(`origo-bc-mcp-server remove <name>`), or wipe everything (`origo-bc-mcp-server clean`).

### 23.3 Start the server

```bash
origo-bc-mcp-server
```

or, if the global npm bin is not on `PATH`:

```
node %APPDATA%\npm\node_modules\origo-bc-mcp-server\dist\cli.js
```

Expected output:

```
origo-bc-mcp listening on :3000 (development)
  MCP endpoint:    http://localhost:3000/mcp
  Dashboard:       http://localhost:3000/dashboard
  Health:          http://localhost:3000/healthz
```

Check it is up with `curl http://localhost:3000/healthz`, and validate configured
connections with `origo-bc-mcp-server verify` (or `origo-bc-mcp-server verify <name>` for
one connection). Change the port with `PORT=3001 origo-bc-mcp-server`.

The server registers **~75 tools by default** (full mode). Against a smaller or local model
that gets confused or slow with a large tool catalogue, start it in **lite mode** instead —
about 26 tools built around `invoke_message_type` as the universal entry point, plus data
records, aging, period breakdown, crypto, memory and the bundled skill doc (the API/OData
endpoint-testing tools are not included in lite mode):

```bash
MCP_LITE=1 origo-bc-mcp-server          # macOS/Linux
$env:MCP_LITE="1"; origo-bc-mcp-server   # Windows PowerShell
```

### 23.4 Register it in an MCP client

The server is plain streamable-HTTP with Basic Auth, listening on `localhost` — register it
as a local HTTP server, not stdio.

**Claude Code** — add to `.mcp.json` in the project root (or `~/.claude/mcp.json` for a
global entry):

```json
{
  "mcpServers": {
    "origo-bc-local": {
      "type": "http",
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Basic <base64 of username:password>"
      }
    }
  }
}
```

**VS Code (GitHub Copilot)** — the same shape in `.vscode/mcp.json`:

```json
{
  "servers": {
    "origo-bc-local": {
      "type": "http",
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Basic <base64 of username:password>"
      }
    }
  }
}
```

Generate the Basic Auth value from the `basicAuth.username` / `basicAuth.password` you set
in `local.settings.json`:

```bash
echo -n 'username:password' | base64                                          # macOS/Linux
```
```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("username:password")) # Windows
```

To target a named connection instead of the default `devConnection`, append
`?connection=<name>` to the URL, e.g. `http://localhost:3000/mcp?connection=sandbox`.

The `setup` wizard writes the VS Code entry for you automatically; the manual step above is
for Claude Code or any other MCP client.

### 23.5 Available tools

The tools fall into groups. The ones below are the ones an integration built against this
skill reaches for most; the server has more (search-by-entity helpers, translations,
business event subscriptions, incoming documents, memory — run `origo-bc-mcp-server --help`
or open the dashboard for the full catalogue).

#### Generic message-type invocation

| Tool | Purpose |
|---|---|
| `list_message_types` | Wraps `Help.MessageTypes.Get` — the catalogue of message types installed in the target environment. Call this before using a type you have not used before; see [help-and-discovery.md](help-and-discovery.md). |
| `get_message_type_help` | Wraps `Help.Implementation.Get` — the contract (parameters, `data` shape, examples) for one message type. Call this instead of guessing a type's arguments from its name. |
| `invoke_message_type` | Generic entry point: send any Bifröst message type by name with its `data` payload and get the result back, without hand-building the queue-api envelope yourself. This is the tool `MCP_LITE=1` builds the reduced tool set around. |

#### Records

| Tool | Purpose |
|---|---|
| `get_records` | Wraps `Data.Records.Get` — read rows from any table with a `tableView` filter, `fieldNumbers`, paging. See [data-operations.md](data-operations.md). |
| `set_records` | Wraps `Data.Records.Set` — insert, modify or delete rows. Does **not** fire AL `OnValidate` — supply every field BC needs to post, same as calling the message type directly. |

#### Raw BC API / OData testing

| Tool | Purpose |
|---|---|
| `bc_api_request` | Discover, inspect and call any BC API v2.0 or custom API page endpoint directly (not through the Bifröst message envelope) — full CRUD, `$metadata` parsing, and OData query support (`$filter`, `$select`, `$top`, `$orderby`, `$expand`). Use this for API pages that are not exposed as Bifröst message types. |

#### Table metadata

##### `list_tables` — List all BC tables

Returns the full table catalogue for the target company: table numbers, AL names, and
localized captions.

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `lcid` | integer | `1033` | Language LCID for captions (1033 = English, 1039 = Icelandic, 1030 = Danish) |

**Example (JSON-RPC 2.0 body, posted to `http://localhost:3000/mcp`):**
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

##### `get_table_info` — Get summary for one table

Returns name, number, and caption for a single table identified by name or number.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `table` | string | ✅ | Table name (`"Customer"`) or number as string (`"18"`) |
| `lcid` | integer | | Language LCID (default 1033) |

---

##### `get_table_fields` — Get all fields for a table

Returns complete field metadata plus read/write permissions for the table.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `table` | string | ✅ | Table name (`"Customer"`) or number as string (`"18"`) |
| `lcid` | integer | | Language LCID (default 1033) |

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
    }
  ]
}
```

**Field object properties:**

| Property | Description |
|---|---|
| `id` | BC field number |
| `name` | AL field name (use in `tableView` WHERE clauses) |
| `jsonName` | Normalized JSON key (use in `get_records` / `set_records` and `Data.Records.Get` / `Data.Records.Set`) |
| `caption` | Localized display caption |
| `type` | AL data type (`Text`, `Code`, `Integer`, `Decimal`, `Boolean`, `Date`, `DateTime`, `Option`, `Enum`, …) |
| `len` | Field length (for Text/Code fields) |
| `class` | `Normal`, `FlowField`, or `FlowFilter` (FlowFilter = filter-dimension field for `tableView`) |
| `isPartOfPrimaryKey` | `true` if field is part of the primary key |
| `hasTableRelation` | `true` if field has a table relation (`RelationTableNo > 0`) |
| `enum` | Array of `{ value, caption }` for Option/Enum fields |

---

#### Totals

##### `get_record_count` — Total records in any table (with optional filter)

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
```

---

#### Integration timestamps

##### `get_integration_timestamp` — Latest integration DateTime for source + tableId

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

---

##### `set_integration_timestamp` — Record a completed integration run

Inserts a new non-reversed entry. Call this after a successful sync to persist the exact
cutoff timestamp. The `dateTime` value becomes the `Date & Time` primary key and is the
value returned by the next `get_integration_timestamp` call.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source` | string | ✅ | Integration source name |
| `tableId` | integer | ✅ | BC table number |
| `dateTime` | string | ✅ | ISO 8601 timestamp to record (e.g. `"2026-03-17T12:00:00Z"`) |

**Returns:** `{ company, source, tableId, dateTime, written: 1 }`

---

##### `reverse_integration_timestamp` — Invalidate the current timestamp

Finds the latest non-reversed entry for `source + tableId` and sets `Reversed = true`.
Use this to roll back a sync checkpoint so the next run re-processes from the previous
timestamp (leaving earlier non-reversed entries intact).

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

#### Memory & config

##### `set_config` — Persist a JSON config object in BC

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

---

##### `get_config` — Read a JSON config object from BC

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

---

#### Crypto

##### `encrypt_data` / `decrypt_data` — Server-side AES-256-GCM encryption

`encrypt_data` encrypts any string with the server-side `MCP_ENCRYPTION_KEY` (AES-256-GCM).
The output is a single Base64 string containing the IV (12 bytes) + auth tag (16 bytes) + ciphertext.

`decrypt_data` reverses the operation. Throws if the payload is tampered with or a different key is used.

**`encrypt_data` parameters:** `{ plaintext: string }` → `{ ciphertext: string }`
**`decrypt_data` parameters:** `{ ciphertext: string }` → `{ plaintext: string }`

**Typical use — encrypt a value before storing it locally:**
```powershell
$body = @{
  jsonrpc = "2.0"; id = 1; method = "tools/call"
  params  = @{
    name      = "encrypt_data"
    arguments = @{ plaintext = "<value to protect>" }
  }
} | ConvertTo-Json -Depth 10 -Compress
Invoke-WebRequest -Uri "http://localhost:3000/mcp" -Method POST `
  -Headers @{ Authorization = "Basic <base64 of username:password>" } `
  -ContentType "application/json" -Body $body -UseBasicParsing
  # → { "ciphertext": "<base64>" }
```

---

### 23.6 Using MCP Metadata in Integration Code

Before writing a `get_records` / `set_records` call (or a raw `Data.Records.Get` /
`Data.Records.Set`) against an unfamiliar table, ask the MCP server for the field list first:

1. Call `get_table_fields` with the table name.
2. Use `name` (not `jsonName`) for `tableView` WHERE clause field names.
3. Use `jsonName` as the key in `set_records` field objects and to read values
   back from `get_records` responses.
4. Use `id` to build the `fieldNumbers` array in `get_records` requests to
   return only the fields you actually need (see [field-selection.md](field-selection.md)).
5. Check `permissions.write` before attempting `set_records` — if `false`, BC
   will reject the write.

**Example — discover fields then read only what you need:**
```javascript
// Step 1 — ask the local MCP server for Customer fields
const meta = await mcpClient.callTool('get_table_fields', { table: 'Customer' });
const noField     = meta.fields.find(f => f.name === 'No.');
const nameField   = meta.fields.find(f => f.name === 'Name');
const emailField  = meta.fields.find(f => f.name === 'E-Mail');

// Step 2 — use discovered field ids in the get_records call
const result = await mcpClient.callTool('get_records', {
  tableName: 'Customer',
  fieldNumbers: [noField.id, nameField.id, emailField.id],
  take: 50
});
```

### 23.7 Calls must be serial

Business Central is not a farm of stateless workers, and the local MCP server holds one
warm connection per environment — a burst of parallel MCP calls can overload the server
process and the BC service behind it, and it can stay down for everyone on that connection.
Issue MCP tool calls **one at a time**. If you are running several test streams, keep each
stream's calls serial, and wait for one call to return before issuing the next.
