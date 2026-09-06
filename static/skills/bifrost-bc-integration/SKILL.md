---
name: bifrost-bc-integration
description: >
  Domain knowledge for building integration code that calls the Origo Bifrost
  API on Microsoft Business Central. Use when a developer asks to: connect to BC via
  Bifrost, call any Data / Help / Customer / Item / Sales / Purchase / Finance / Approval
  message type, implement sync or async task submission, handle pagination, read/write
  record data, handle field name normalization, or convert enum values. Also covers:
  dynamic schema discovery via the BC Metadata MCP server at https://dynamics.is/api/mcp
  (tools: list_tables, get_table_fields, get_table_info, list_companies, list_message_types,
  get_records, get_record_count, search_customers, search_items, list_translations, set_translations,
  get_integration_timestamp, set_integration_timestamp, reverse_integration_timestamp,
  set_config, get_config, encrypt_data, decrypt_data;
  resources: bc://tables, bc://tables/{name}, bc://message-types, bc://companies;
  prompts: customer_lookup_pattern, item_lookup_pattern, sales_order_creation_workflow,
  describe_table, find_tables_for_entity, data_model_overview), selecting only needed
  fields with fieldNumbers, tableView filtering and sorting in BC AL syntax (WHERE/
  FILTER/CONST/SORTING/ORDER with skip+take for sorted paging), UI translations via the
  Translation ori table, integration timestamps via the Bifrost Integration
  table, field metadata caching, webhooks, special field conversions (BLOB, Media, Dimension Set,
  Currency Code), CSV bulk export via CSV.Records.Get (Open Mirroring format, continuation
  pattern via continueFromRecordId for large exports approaching 2 GB limit, column naming
  convention, system fields always appended, $Company column, __rowMarker__ Open Mirroring
  column), field-level translations via Field.Translation.Get/Set
  and Field.Translations.Get (BC codeunit 3711), creating sales orders via the generic
  Data.Records.Set workflow, general journal line preparation via
  Finance.GeneralJournal.SetupNewLine (the default way to prepare a journal line),
  general journal validation/posting via
  Finance.GeneralJournal.Check and Finance.GeneralJournal.Post,
  G/L entry reversal via Finance.GeneralJournal.ReverseRegister (reverse all entries
  in a G/L Register by register number) and Finance.GeneralJournal.ReverseTransaction
  (reverse all entries sharing a transaction number),
  bank reconciliation workflow via Finance.BankReconciliation.Create
  (create or reuse reconciliation and import lines), Finance.BankReconciliation.Match
  (mode resolution and strict matching validation), Finance.BankReconciliation.Reset
  (remove all matches), and Finance.BankReconciliation.Post (post reconciliation),
  VAT settlement preview/posting via Finance.VAT.CalcAndPostSettlement
  (aggregates open VAT entries by posting group, optionally runs report 20
  *Calc. and Post VAT Settlement* and returns the resulting G/L Register
  and VAT entry range),
  VAT statement preview via Finance.VATStatement.Preview (reproduces standard
  page 474 by iterating VAT Statement Lines and returning the calculated
  Column Amount per line via report 12 CalcLineTotal),
  foreign-currency revaluation via Finance.Currency.AdjustExchangeRates
  (previews or posts BC codeunit 699 *Exch. Rate Adjmt. Process* and returns
  either the simulated entries — captured via the BC posting-preview framework —
  or the new G/L Register, entry range, and per-currency LCY breakdown),
  and BC Change Log operations via ChangeLog.Field.History (browse field modification history
  with synthetic current-value entry at index 0), ChangeLog.Field.Restore (restore a field
  to a previous Change Log value by entry number or point-in-time, Mode 1 / Mode 2 pattern),
  and ChangeLog.Field.Enabled (check whether a field is covered by Change Log modification
  tracking and whether the ChangeLog Write Guard is active), and ChangeLog.Records.Delta
  (return distinct SystemIds of records Inserted/Modified in a table within a date/time
  range, optionally filtered to a set of fields — designed as the source for incremental
  sync). The ChangeLog Write Guard
  (Bifrost Setup field 17) has three modes: Open (all writes allowed), Blocked (only
  Change Log-covered fields may be written), Via force (Blocked but bypassable with
  force=true + Force Access ori permission). The `Restriction Type ori` enum
  (10077890) also has a `Bypass` value (3): creating a Field Access ori record with
  Restriction Type = Bypass for a table/field marks that field as explicitly open for
  Write Guard — the guard allows writes without Change Log coverage when this entry exists,
  regardless of which user is calling. Bypass does not block read or write access.
  Wildcard support: Field No. = 0 means "all fields in the table"; Table No. = 0
  (with Field No. = 0) means "all tables". Resolution order: specific field → all-fields
  (Field 0) → all-tables (Table 0, Field 0); first match wins.
  Document approval workflow events are tracked via Document.Approval.Get (retrieves
  approval log entries from table 10077885 with linked active and posted approval entries,
  per-record permission filtering, skip/take pagination), Document.Approval.Send
  (creates approval entries for a document with approver assignments and per-line
  amount calculation, setting document status to Pending Approval),
  Document.Approval.Approve (approves one or more open entries with optional comment,
  cascading document release when all required approvals are met, delegation support),
  Document.Approval.Reject (rejects open entries with optional comment
  stored as Approval Comment Lines, delegation support),
  Document.Approval.Me (retrieves approval entries assigned to calling user with
  skip/take pagination, permission filtering, and tableView support),
  Document.Approval.Delegate (delegates open entries to another user by
  changing Approver ID, requires target user in User Setup, entry remains Open),
  and Document.Approval.Cancel (cancels all open entries for a document and
  reopens it, supported tables: Sales Header, Purchase Header, Incoming Document).
  The extension also provides key-value memory storage: Memory.Company.Get/Set for
  company-scoped records (table 10077893) and Memory.User.Get/Set for per-user records
  (table 10077894, auto-filtered to current user via FilterGroup(2)).
  Transfer order operations: Inventory.TransferOrder.Create (creates header; lines added via
  Data.Records.Set on Transfer Line), Inventory.TransferOrder.Release / Reopen (Open ↔ Released
  via codeunit 5708), Inventory.TransferOrder.Post (codeunit 5706 with Ship/Receive postingType
  for non-direct; direct transfers use BC Inventory Setup Direct Transfer Posting; manual
  event subscriber on OnBeforeGetPostingOptions injects parameters since SetParameters is
  internal), Inventory.TransferOrder.PreviewPost (Gen. Jnl.-Post Preview with rollback;
  returns predicted next document numbers and ledger entries),
  Inventory.TransferOrder.Statistics (mirrors Page 5755; line count, quantity, parcels,
  net/gross weight, volume; derived lines excluded).
  Assembly order operations: Inventory.AssemblyOrder.Create (creates header from parent
  item with BOM auto-refresh), Inventory.AssemblyOrder.RefreshLines (re-runs BOM via
  cloud-safe Validate("Item No.") since RefreshBOM is OnPrem-only),
  Inventory.AssemblyOrder.Release / Reopen (Open ↔ Released via codeunit 414; Reopen uses
  isolated Codeunit.Run for clean error handling), Inventory.AssemblyOrder.Post
  (codeunit 900 Assembly-Post; returns postedDocumentNo, postedSystemId, assembleToOrder
  flag, postedQuantity), Inventory.AssemblyOrder.PreviewPost (Gen. Jnl.-Post Preview with
  rollback; captures Item Ledger, Value Entry, Capacity Ledger, G/L Entry),
  Inventory.AssemblyOrder.Statistics (mirrors Page 920; expected vs. actual material,
  resource, resource overhead, and assembly overhead costs via CalcActualCosts).
  Warehouse shipment operations: Warehouse.Shipment.Create (creates one Warehouse Shipment
  Header per supplied source via codeunit 5752 Get Source Doc. Outbound; supports
  SalesOrder and TransferOrder sources; requires Require Shipment on the source location),
  Warehouse.Shipment.Post (codeunit 5763 Whse.-Post Shipment; gated by
  Warehouse Posting ori always and G/L Posting ori when invoice = true; response includes
  posted source documents derived from Posted Whse. Shipment Line), and
  Warehouse.Shipment.PreviewPost (Gen. Jnl.-Post Preview against Whse.-Post Shipment (Yes/No)
  with rollback; the invoice flag is forced to true by the BC preview subscriber; WMS
  locations require a registered Warehouse Pick first because Qty. to Ship starts at 0).
  Journal preview-post operations (all simulate posting via Gen. Jnl.-Post Preview and roll
  back, returning preview[] with per-row id + primaryKey + fields + tableCaption, plus
  rollback/summary/totals/predictedDocumentNos):
  Finance.FAJournal.PreviewPost (FA Jnl.-Post; FA G/L Integration flags decide whether the
  posting type must route through the general journal instead),
  Inventory.ItemJournal.PreviewPost (Item Jnl.-Post; lines inserted via set_records skip
  OnValidate so all required fields must be supplied), and
  Projects.ProjectJournal.PreviewPost (Job Jnl.-Post; Line Type must not be blank;
  DimensionSetID expands to an array of {DimensionCode, DimensionValueCode} pairs).
  Warehouse pick operations: Warehouse.Pick.Create (BC report 7318 isolated via Process
  codeunit; optional assignedUserId / sortingMethod honoured field-restrictions on
  Warehouse Activity Header) and Warehouse.Pick.Register (BC codeunit 7307
  Whse.-Activity-Register; gated by Warehouse Posting ori; response includes registeredPickNo
  and shipmentLines snapshot with Qty. Picked / Qty. to Ship per source shipment line).
  Warehouse putaway operations: Warehouse.Putaway.Create (BC report 7305 Whse.-Source -
  Create Document isolated via Process codeunit; consumes a Posted Whse. Receipt; optional
  assignedUserId / sortingMethod; idempotent — posting a receipt auto-creates the put-away
  unless the location has Use Put-away Worksheet = true, so this message type returns the
  existing put-away with alreadyExisted = true rather than erroring) and
  Warehouse.Putaway.Register (BC codeunit 7307
  Whse.-Activity-Register; gated by Warehouse Posting ori; response includes
  registeredPutawayNo and receiptLines snapshot with Qty. Put Away per Posted Whse.
  Receipt Line).
  Warehouse receipt operations: Warehouse.Receipt.Create (creates one Warehouse Receipt
  Header per supplied source via codeunit 5751 Get Source Doc. Inbound; supports
  PurchaseOrder, SalesReturnOrder, and TransferOrder sources; requires Require Receive on
  the receiving location), Warehouse.Receipt.Post (codeunit 5760 Whse.-Post Receipt;
  gated by Warehouse Posting ori; no invoice flag; response includes posted source
  documents derived from Posted Whse. Receipt Line), and Warehouse.Receipt.Post.Preview
  (Gen. Jnl.-Post Preview with rollback; predictedNumbers key varies by source type —
  postedPurchaseReceiptNo for PO, postedReturnReceiptNo for sales return,
  postedTransferReceiptNo for inbound transfer; balanced=true with zero G/L totals).
---

# Bifrost BC Integration Skill

This skill gives you accurate, verified knowledge of the **Origo Bifrost API** so
you can write integration code (TypeScript, JavaScript, Python, C#, AL, etc.) that
interacts with Microsoft Business Central through this API.

---

## 1. What the API Is

The Origo Bifrost extension for Business Central exposes a REST API (Bifrost API v1.0)
whose message envelope draws on ideas from the [CNCF CloudEvents specification](https://cloudevents.io/).
Instead of dozens of entity-specific OData endpoints, **every operation is a Bifrost message** sent to
one of three endpoints: `/tasks` (synchronous), `/queues` (asynchronous), or
`/responses` (fetch results).

All business logic (read records, write records, check credit limits, get PDFs, …) is
selected by the `type` field of the message envelope.

---

## 2. Base URL

```
https://api.businesscentral.dynamics.com/v2.0/{tenantId}/{environment}/api/origo/bifrost/v1.0/companies({companyId})/
```

| Placeholder | Source | Example |
|---|---|---|
| `{tenantId}` | Tenant domain or GUID | `dynamics.is` |
| `{environment}` | BC environment name | `UAT`, `Production` |
| `{companyId}` | Company GUID | fetched from `/companies` endpoint |

**Authentication:** OAuth 2.0 Bearer token via Microsoft Entra ID (Azure AD).  
Scope: `https://api.businesscentral.dynamics.com/.default`

> **Data Isolation — Entra Application Boundary**  
> Every Bifrost endpoint (`/tasks`, `/queues`, `/responses`, `/requests`) automatically
> filters all results to the **Entra Application (Client ID)** that authenticated the request.
> This is enforced server-side via `SystemCreatedBy = UserSecurityId()` — it cannot be bypassed
> by any query parameter or OData filter.  
> **One Entra Application will never see messages, history, or responses that were created by
> a different Entra Application**, even within the same BC company and environment.

> **Tenant GUID note:** The `data` URL returned in task/queue responses uses the internal
> tenant GUID (e.g. `9069b642-…`), not the named tenant (`dynamics.is`). When using
> the returned URL verbatim it will always work. If you construct the URL from a known
> message ID (e.g. from a webhook), use the named-tenant form — both forms are accepted.

---

## 3. Three Endpoints

### 3.1 `/tasks` — Synchronous (preferred for real-time use)

POST a message. BC processes it immediately. The `data` field in the response is a
**full absolute URL** ending in `/data`. GET that URL to retrieve the result.

```http
POST /companies({companyId})/tasks
Content-Type: application/json
Authorization: Bearer {token}

{
  "specversion": "1.0",
  "type": "Data.Records.Get",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"tableName\":\"Customer\",\"take\":100}"
}
```

Response:
```json
{
  "id": "7df25b48-ec25-498f-b8cf-566044ae020d",
  "type": "Data.Records.Get",
  "data": "https://api.businesscentral.dynamics.com/v2.0/{tenantGuid}/UAT/api/origo/bifrost/v1.0/companies({companyId})/responses(7df25b48-ec25-498f-b8cf-566044ae020d)/data"
}
```

Then:
```http
GET {task.data}
Authorization: Bearer {token}
```

### 3.2 `/queues` — Asynchronous

Same request body. BC returns immediately; job runs in background.

```http
POST /companies({companyId})/queues                                         ← submit
POST /companies({companyId})/queues({id})/Microsoft.NAV.GetStatus           ← poll
POST /companies({companyId})/queues({id})/Microsoft.NAV.RetryTask           ← retry
POST /companies({companyId})/queues({id})/Microsoft.NAV.CancelTask          ← cancel
GET  /companies({companyId})/queues({id})                                   ← read
```

**GetStatus Response:**  
Returns standard HTTP status codes based on message state:

| Semantic Status | HTTP Status Code | Meaning |
|-----------------|------------------|----------|
| `Created` | 201 Created | Message is still running/processing |
| `Updated` | 200 OK | Processing complete, results available |
| `Deleted` | 204 No Content | No task scheduled |
| `None` | 204 No Content | Message status unknown |

### 3.3 `/responses({id})/data` — Download Results

If you already know the message ID, call `/data` directly — no prior lookup required:

```http
GET /companies({companyId})/responses({id})/data
Authorization: Bearer {token}
```

The URL in `task.data` / `queue.data` is always this same pattern with the internal tenant GUID. You can also construct it yourself from a known message ID (e.g. from webhooks or your own storage).

> **Tenant GUID note:** The `data` URL returned by BC uses the internal tenant GUID (e.g. `9069b642-…`), not the named tenant (`dynamics.is`). If you construct the URL yourself use the named tenant form like the example above — both work.

### 3.4 `/requests({id})/data` — Read the Original Request Payload

Returns the raw request body that was originally sent for a message. Call `/data` directly when you know the ID:

```http
GET /companies({companyId})/requests({id})/data
Authorization: Bearer {token}
```

Or fetch the OData record (includes `id` + `data` fields) without the `/data` suffix:

```http
GET /companies({companyId})/requests({id})
Authorization: Bearer {token}
```

Response:
```json
{
  "id": "8440906f-113b-4c21-90a0-3a016a4ea043",
  "data": "{\"tableName\":\"G/L Entry\",\"startDateTime\":\"2020-01-01T00:00:00Z\"}"
}
```

The `id` is the same GUID as the queue or task message — no extra lookup needed. Results are scoped to the current application (`SystemCreatedBy`).

---

## 3b. Listing Message History (GET queues / tasks)

Both endpoints support standard OData **GET** to list previously submitted messages. Use `$filter` on `source` to scope results to your own application.

> **Note:** Results are automatically scoped to the calling Entra Application — you will
> never see records created by another application. The `source` filter is an additional
> optional label you control; it does not replace or weaken security isolation.

Once you have a message `id`, call `/data` directly on either endpoint — no prior lookup needed:

| What you want | URL |
|---|---|
| Full response body | `GET /responses({id})/data` |
| Original request payload | `GET /requests({id})/data` |

### List queue history
```http
GET /companies({companyId})/queues?$filter=source eq 'MyApp v1.0'
Authorization: Bearer {token}
```

### List task history
```http
GET /companies({companyId})/tasks?$filter=source eq 'MyApp v1.0'
Authorization: Bearer {token}
```

Without a filter you get all your own application's messages — the Entra isolation
already ensures you never see another application's data.

### Response shape (same for both endpoints)

```json
{
  "@odata.context": ".../$metadata#companies(...)/queues",
  "value": [
    {
      "@odata.etag": "W/\"...\"",
      "id": "fb304e23-2aac-43fa-a16d-5bc837a52830",
      "specversion": "1.0",
      "type": "Data.Records.Get",
      "source": "MyApp v1.0",
      "time": "2026-03-16T10:18:51.303Z",
      "subject": "",
      "lcid": 0,
      "datacontenttype": "text/json",
      "data": "https://api.businesscentral.dynamics.com/v2.0/{tenantGuid}/UAT/api/origo/bifrost/v1.0/companies({companyId})/responses(fb304e23-2aac-43fa-a16d-5bc837a52830)/data"
    }
  ]
}
```

Key fields:

| Field | Description |
|---|---|
| `id` | Message GUID — use it as the queue/task ID and as the response ID |
| `type` | The message type that was executed |
| `source` | The caller identifier set in the original request |
| `time` | When the message was submitted (UTC) |
| `subject` | Optional subject sent by the caller (table name, document no., etc.) |
| `lcid` | Language requested (0 = default) |
| `datacontenttype` | Content type of the response (`text/json`, `text/markdown`, `application/pdf`, …) |
| `data` | Absolute URL to fetch the response body — GET this URL to retrieve results |

The `data` URL is always in the form `.../responses({id})/data`. You can fetch it at any time after the message is processed.

### Queue-specific: poll status, retry and cancel

These actions are only available on `/queues`, not `/tasks` (tasks are already completed synchronously).

**Poll status**
```http
POST /companies({companyId})/queues({id})/Microsoft.NAV.GetStatus
Authorization: Bearer {token}
```

Returns the current processing status with standard HTTP status codes:

| Status | HTTP Code | Meaning |
|--------|-----------|---------|
| `Created` | 201 Created | Job is still running |
| `Updated` | 200 OK | Job completed successfully — `data` URL is ready |
| `Deleted` | 204 No Content | Queue entry no longer exists |
| `None` | 204 No Content | Unknown / not found |

**Retry a failed job**
```http
POST /companies({companyId})/queues({id})/Microsoft.NAV.RetryTask
Authorization: Bearer {token}
```

Requeues the same message for re-processing. Use after investigating a `Created`-but-stalled or errored entry.

| Status | HTTP Code | Meaning |
|--------|-----------|--------|
| `Created` | 201 Created | Task is already running — cannot retry |
| `Updated` | 200 OK | Task successfully restarted |
| `None` | 204 No Content | Failed to create background task |

**Cancel a running job**
```http
POST /companies({companyId})/queues({id})/Microsoft.NAV.CancelTask
Authorization: Bearer {token}
```

Cancels a running or scheduled background task. If no task is scheduled, returns immediately.

| Status | HTTP Code | Meaning |
|--------|-----------|--------|
| `Deleted` | 204 No Content | No task was scheduled |
| `Updated` | 200 OK | Task successfully cancelled |
| `None` | 204 No Content | Cancellation failed |

### JavaScript polling pattern

```js
async function pollUntilDone(companyId, messageId, token, maxWaitMs = 30_000) {
  const base = `${BASE_URL}/companies(${companyId})/queues(${messageId})`;
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    const st = await fetch(`${base}/Microsoft.NAV.GetStatus`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    if (st.value === 'Updated') return; // done
    if (st.value === 'Deleted')  throw new Error('Queue entry deleted');
    await new Promise(r => setTimeout(r, 2000)); // wait 2 s before next poll
  }
  throw new Error('Timed out waiting for queue message to complete');
}
```

---

## 4. Request Envelope

Every POST body follows this structure:

| Field | Required | Type | Notes |
|---|---|---|---|
| `specversion` | Yes | string | Always `"1.0"` |
| `type` | Yes | string | Message type, e.g. `"Data.Records.Get"` |
| `source` | Yes | string | Caller identifier, e.g. `"MyApp v2.3"` |
| `id` | No | GUID | Auto-generated if omitted |
| `subject` | Depends | string | Target record key (customer no., table name, order no., item no., …). Required by some types. |
| `data` | Depends | **JSON string** | Input parameters. **Must be serialized to a string**: `"data": "{\"tableName\":\"Customer\"}"`. Not an object. |
| `lcid` | No | integer | Windows Language ID for localised captions. 1033 = English, 1039 = Icelandic. Defaults to Bifrost Setup language. |
| `datacontenttype` | No | string | `"application/json"` — informational only |

---

## 5. Response Patterns

### Pattern A — Two-step (most data operations)

1. POST returns `{ …, "data": "<url>" }`
2. GET the URL → result JSON

### Pattern B — Direct response (some operations)

PDF types and some inbound operations embed status/error directly in the POST response.
No `data` URL. Check `response.status === "Error"` immediately.

### Error handling order

```
POST /tasks
  ├─ if response.status === "Error"   → direct error (no data URL)
  └─ if response.data exists
       └─ GET response.data
            ├─ if result.status === "Error"   → task execution error
            └─ if result.status === "Success" → use result
```

Error shape:
```json
{
  "status": "Error",
  "error": "Human-readable error message",
  "callStack": "Codeunit.Method line N — ..."
}
```

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

## 7. All Message Types

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

**Errors:** Read permission denied · "Store Record must be enabled in Delete Setup ori for table {x}" if snapshots not configured.

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

### 7.2 METADATA OPERATIONS

All metadata types use `/tasks`. `data` must be a JSON string.

#### `Help.Tables.Get` — List all tables

```json
{ "specversion": "1.0", "type": "Help.Tables.Get", "source": "MyApp v1.0", "lcid": 1033 }
```

Single-table lookup — three approaches (evaluated in priority order):
1. `data.tableNumber` — integer in `data`
2. `data.tableName` — string in `data`
3. `subject` — table name or numeric string in the envelope

```json
{ "specversion": "1.0", "type": "Help.Tables.Get", "source": "MyApp", "subject": "Customer" }
{ "specversion": "1.0", "type": "Help.Tables.Get", "source": "MyApp", "data": "{\"tableNumber\":18}", "lcid": 1039 }
```

Response: `{ "status": "Success", "result": [{ "id": 18, "name": "Customer", "caption": "Customer", "dataPerCompany": true, "namespace": "Microsoft.Sales.Customer", "readRestricted": false, "writeRestricted": false }] }`

- `readRestricted` → `true` when the table is blocked from `Data.Records.Get` (internal Bifrost / Change Log system tables and non-normal table types).
- `writeRestricted` → `true` when the table is blocked from `Data.Records.Set`. Covers all read-restricted tables plus `Message ori` (read-allowed, write-blocked).
- Check these flags **before** issuing a Get/Set against an unfamiliar table to avoid an avoidable error round-trip.

#### `Help.Fields.Get` — Field metadata for a table

```json
{
  "specversion": "1.0",
  "type": "Help.Fields.Get",
  "source": "MyApp v1.0",
  "lcid": 1033,
  "data": "{\"tableName\":\"Customer\",\"fieldNumbers\":[1,2,21,39,59]}"
}
```

Response per field:
```json
{
  "id": 39,
  "name": "Blocked",
  "jsonName": "Blocked",
  "caption": "Blocked",
  "class": "Normal",
  "type": "Option",
  "len": 4,
  "isPartOfPrimaryKey": false,
  "hasTableRelation": false,
  "readRestricted": false,
  "writeRestricted": false,
  "enum": [
    { "value": " ",       "caption": " ",       "ordinal": 0 },
    { "value": "Ship",    "caption": "Ship",    "ordinal": 1 },
    { "value": "Invoice", "caption": "Invoice", "ordinal": 2 },
    { "value": "All",     "caption": "All",     "ordinal": 3 }
  ]
}
```

- `name` → use in `tableView` WHERE clauses
- `jsonName` → use as the key in `Data.Records.Get` / `Data.Records.Set` field objects
- `caption` → display only (changes with `lcid`)
- `enum[].value` → always-English AL name (use in Set and tableView)
- `enum[].caption` → localised caption (matches what Get returns)
- `class` → `"Normal"`, `"FlowField"`, or `"FlowFilter"` (FlowFields only calculated when `fieldNumbers` specified in Get; FlowFilter fields are filter-dimension fields — use in `tableView` WHERE clauses, not in `fieldNumbers`)
- `readRestricted` → `true` when the current user is blocked from reading the field via `Field Access ori` (restriction type `Both` or `Read`, or a matching wildcard). `Data.Records.Get` **silently drops** the field from the response — no error. Primary-key fields are always returned regardless.
- `writeRestricted` → `true` when the current user is blocked from writing the field via `Field Access ori` (restriction type `Both` or `Write`, or a matching wildcard). `Data.Records.Set` rejects the write and omits the field from the `Did you mean` hint list. A separate `Bypass` restriction type opts a field out of the ChangeLog Write Guard but does not appear in these flags.

#### `Help.MessageTypes.Get` — Discover all message types

```json
{ "specversion": "1.0", "type": "Help.MessageTypes.Get", "source": "MyApp" }
```

Optional `subject` field returns a single message type by exact name:

```json
{ "specversion": "1.0", "type": "Help.MessageTypes.Get", "source": "MyApp", "subject": "Data.Records.Get" }
```

Optional request parameter `onlyEnabled` (boolean, default `false`). When `true`, returns only message types the current user has permission to use:

```json
{ "specversion": "1.0", "type": "Help.MessageTypes.Get", "source": "MyApp", "data": { "onlyEnabled": true } }
```

Response: `{ "result": [{ "name": "Data.Records.Get", "isEnabled": true, "filterTableNo": 0, "description": "…", "messageDirection": "Outbound" }] }`

Each result object includes `isEnabled` (boolean) indicating whether the user has the required table/posting permissions for that message type. When `subject` is set, the result array contains at most one element.

#### `Help.Implementation.Get` — Docs for a specific message type

```json
{
  "specversion": "1.0",
  "type": "Help.Implementation.Get",
  "source": "MyApp",
  "subject": "Data.Records.Get"
}
```

Returns Markdown documentation for the requested message type.

#### `Help.Permissions.Get` — Check table permissions for current user

```json
{
  "specversion": "1.0",
  "type": "Help.Permissions.Get",
  "source": "MyApp",
  "subject": "Customer"
}
```

Response:
```json
{
  "status": "Success",
  "permissions": {
    "read": true,
    "write": false
  }
}
```

Table names with special characters work directly in `subject`:
```json
{
  "specversion": "1.0",
  "type": "Help.Permissions.Get",
  "source": "MyApp",
  "subject": "G/L Account"
}
```
Response: `{"status":"Success","permissions":{"read":true,"write":true}}`

- `permissions.read` — user can read from the table
- `permissions.write` — user can insert/modify/delete in the table
- No `tableName` field in the response — use the value you sent as `subject`/`tableName`

**Permission layers.** Data access through Bifrost is gated by **two independent layers** — both must allow the operation:

1. **BC permission** (this message type) — from BC permission sets + `InherentPermissions`. Whole-table scope. When denied, BC returns a platform permission error.
2. **Bifrost restrictions** (`Field Access ori`, per user) — per table **and** per field, with types `Read`, `Write`, `Both`, or `Bypass`. When denied: `Data.Records.Get` silently drops the field; `Data.Records.Set` rejects the write; the five Create message types (`Sales.Document.Create`, `Purchase.Document.Create`, `Inventory.AssemblyOrder.Create`, `Inventory.TransferOrder.Create`, `Finance.BankReconciliation.Create`) refuse the request when the principal field is write-restricted.

To compute effective access for a field, query all three sources for the same `tableName` and combine:

- `canReadField = Help.Permissions.Get.permissions.read AND NOT Help.Tables.Get.readRestricted AND NOT Help.Fields.Get.readRestricted`
- `canWriteField = Help.Permissions.Get.permissions.write AND NOT Help.Tables.Get.writeRestricted AND NOT Help.Fields.Get.writeRestricted`

Use `Help.Tables.Get` for the table-level restriction flags and `Help.Fields.Get` for the per-field flags (both resolved against the current user).

#### `Help.NextLineNo.Get` — Get next available line number for a table

Direction: **Outbound**. Returns the next available Line No. for any table whose last
primary key field is an Integer (e.g. Sales Line, Gen. Journal Line). Provide parent
PK values via `primaryKey` or locate an existing record by `id` (SystemId).

```json
{
  "specversion": "1.0",
  "type": "Help.NextLineNo.Get",
  "source": "MyApp",
  "data": "{\"tableName\":\"Sales Line\",\"primaryKey\":{\"DocumentType\":\"Order\",\"DocumentNo\":\"S-ORD-001\"},\"increment\":10000}"
}
```

Response:
```json
{
  "status": "Success",
  "primaryKey": {
    "DocumentType": "Order",
    "DocumentNo": "S-ORD-001",
    "LineNo": 40000
  }
}
```

- `primaryKey` — complete PK object ready for `Data.Records.Set`
- `increment` — optional, defaults to 10000, must be > 0
- If both `id` and `primaryKey` are present, `id` takes precedence
- Table must have >= 2 PK fields with the last being Integer

#### `Help.PageUrl.Get` — Get the card page URL for a specific record

Direction: **Outbound** — Content-Type: `text/json`. Resolves a table and record SystemId using the standard
table and GUID request formats from `Message Argument ori`, determines the
conditional card page with `Page Management`, and returns the Business Central web URL.

```json
{
  "specversion": "1.0",
  "type": "Help.PageUrl.Get",
  "source": "MyApp",
  "data": "{\"tableName\":\"Customer\",\"id\":\"a0e2b3c4-d5e6-7890-abcd-ef1234567890\"}"
}
```

Response:
```json
{
  "status": "Success",
  "url": "https://businesscentral.dynamics.com/..."
}
```

- Table accepts `tableName`, `tableNumber`, `tableNo`, `tableId`, or `subject`
- Record accepts `id`, `systemId`, `recordId`, `recordSystemId`, or GUID `subject`
- Returns `Success` only when a non-empty URL is resolved
- Error responses use the standard `{ "status": "Error", "error": "..." }` contract

#### `Help.TableRelations.Get` — Get all relation branches for a specific field

Direction: **Outbound**. Reads `Table Relations Metadata` (system table 2000000140) and
returns every relation branch for the specified table field, plus reverse relations
(`relatedTo`) showing which fields in other tables point to this table/field. Both table
AND field are required. Use `fieldId` or `fieldNo` for a numeric lookup, or `fieldName`
for a name lookup.

```json
{
  "specversion": "1.0",
  "type": "Help.TableRelations.Get",
  "source": "MyApp",
  "data": "{\"tableName\":\"Customer\",\"fieldName\":\"Country/Region Code\"}"
}
```

Response (single unconditional relation + reverse relations):
```json
{
  "status": "Success",
  "tableId": 18,
  "tableName": "Customer",
  "relationCount": 1,
  "relations": [
    {
      "tableId": 18,
      "fieldNo": 35,
      "fieldName": "Country/Region Code",
      "fieldJsonName": "Country_RegionCode",
      "relationNo": 1,
      "relatedTableId": 9,
      "relatedTableName": "Country/Region",
      "relatedFieldNo": 0,
      "relatedFieldName": "(Primary Key)",
      "relatedFieldJsonName": "PrimaryKey",
      "conditionType": "",
      "conditionFieldNo": 0,
      "conditionFieldName": "",
      "conditionFieldJsonName": "",
      "conditionValue": ""
    }
  ],
  "relatedToCount": 1,
  "relatedTo": [
    {
      "tableId": 36,
      "fieldNo": 5,
      "fieldName": "Sell-to Customer No.",
      "fieldJsonName": "SelltoCustomerNo_",
      "relationNo": 1,
      "relatedTableId": 18,
      "relatedTableName": "Customer",
      "relatedFieldNo": 0,
      "relatedFieldName": "(Primary Key)",
      "relatedFieldJsonName": "PrimaryKey",
      "conditionType": "",
      "conditionFieldNo": 0,
      "conditionFieldName": "",
      "conditionFieldJsonName": "",
      "conditionValue": ""
    }
  ]
}
```

- Table: `tableName`, `tableNumber`, `tableNo`, `tableId`, or `subject`
- Field (required — one of): `fieldId` or `fieldNo` (integer), `fieldName` (string)
- `relations` — outbound: where this field points to (e.g. Customer."Country/Region Code" → Country/Region)
- `relatedTo` — inbound/reverse: which fields in other tables reference this table/field (e.g. Sales Header."Sell-to Customer No." → Customer)
- `relationCount` / `relatedToCount` — counts for each array
- Each relation object includes `tableId` — the source table of the relation
- `relatedFieldNo = 0` → relation targets the primary key; `relatedFieldName` will be `"(Primary Key)"`
- Fields with multiple conditional branches appear as multiple rows — each row is one branch
- Condition types: `""` (unconditional), `"TableFilter"`, `"Const"`, `"Filter"`, `"Field"`
- `fieldJsonName`, `relatedFieldJsonName`, `conditionFieldJsonName` — JSON-safe names matching `Data.Records.Get` output

#### `Help.WhoAmI.Get` — Comprehensive user profile

Direction: **Outbound**. Returns a 19-section JSON profile for the calling user. No request
parameters required — the message type uses the caller's session context.

```json
{
  "specversion": "1.0",
  "type": "Help.WhoAmI.Get",
  "source": "MyApp",
  "data": {}
}
```

Response (abbreviated — each section is an object or null):
```json
{
  "status": "Success",
  "user": { "userSecurityId": "...", "userName": "DOMAIN\\USER", "fullName": "John Smith", "contactEmail": "john@example.com", "authenticationEmail": "john@example.com" },
  "personalization": { "profileId": "BUSINESS MANAGER", "languageId": 1033, "localeId": 1033, "company": "CRONUS International Ltd.", "timeZone": "UTC" },
  "userSetup": { "userId": "JOHN", "salesPurchCode": "JS", "approverId": "MANAGER1", "salesRespCtrFilter": "", "purchaseRespCtrFilter": "", "serviceRespCtrFilter": "", "allowPostingFrom": "2025-01-01", "allowPostingTo": "2025-12-31", "timeSheetAdmin": false, "email": "john@example.com" },
  "approvalSetup": { "approverId": "MANAGER1", "approvalAdministrator": false, "unlimitedSalesApproval": false, "unlimitedPurchaseApproval": false, "unlimitedRequestApproval": false, "salesAmountApprovalLimit": 10000, "purchaseAmountApprovalLimit": 5000, "requestAmountApprovalLimit": 5000, "substitute": "JOHN2" },
  "notificationSetup": [ { "notificationType": "New Record", "notificationMethod": "Email", "recurrence": "Daily", "time": "08:00:00", "dailyFrequency": "Weekday" } ],
  "resource": { "no": "JS", "name": "John Smith", "type": "Person" },
  "salesperson": { "code": "JS", "name": "John Smith", "email": "john@example.com", "phoneNo": "+354 555 1234" },
  "employee": { "no": "EMP001", "firstName": "John", "lastName": "Smith", "socialSecurityNo": "010180-1234", "email": "john@example.com", "phoneNo": "+354 555 1234", "jobTitle": "Developer", "managerNo": "EMP002", "resourceNo": "JS" },
  "manager": { "no": "EMP002", "firstName": "Jane", "lastName": "Doe", "email": "jane@example.com", "phoneNo": "+354 555 5678", "jobTitle": "Team Lead" },
  "companyInfo": { "name": "CRONUS International Ltd.", "address": "123 Main Street", "city": "Reykjavik", "postCode": "101", "countryRegionCode": "IS", "phoneNo": "+354 555 0000", "email": "info@company.com", "homePage": "https://company.com", "vatRegistrationNo": "123456-7890", "registrationNo": "1234567890" },
  "warehouseLocations": [ { "locationCode": "BLUE", "default": true, "adcsUser": false } ],
  "responsibilityCenters": { "salesRespCtrFilter": "MAIN", "purchaseRespCtrFilter": "", "serviceRespCtrFilter": "" },
  "dueFromToOwner": { "glAccountNo": "33050", "name": "Arður", "balanceAtDate": 150000.00, "netChange": 25000.00 },
  "customer": { "no": "10000", "name": "Contoso Ltd.", "address": "123 Main Street", "city": "Reykjavik", "postCode": "101", "phoneNo": "+354 555 1234", "email": "info@contoso.com", "creditLimitLCY": 500000, "balanceLCY": 120000, "balanceDueLCY": 15000 },
  "vendor": { "no": "20000", "name": "Fabrikam Inc.", "address": "456 Oak Avenue", "city": "Akureyri", "postCode": "600", "phoneNo": "+354 555 5678", "email": "ap@fabrikam.com", "balanceLCY": 85000, "balanceDueLCY": 10000 },
  "contact": { "no": "CT000001", "name": "Anna Jónsdóttir", "address": "789 Elm Road", "city": "Reykjavik", "postCode": "105", "phoneNo": "+354 555 9012", "email": "anna@example.com", "type": "Person", "companyNo": "CT000000", "companyName": "Contoso Ltd." },
  "systemPrompt": "You are a helpful assistant...",
  "unreadNotifications": [{"sender": "ADMIN", "subject": "Follow up on order", "threadId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"}],
  "pendingApprovals": [{"documentType": "Purchase Order", "documentNo": "PO-1001", "amountLCY": 25000.00, "dueDate": "2025-03-15"}],
  "canUpdateCompanyMemory": true,
  "canSendAndCancelApprovalRequests": true
}
```

**Sections:** `status`, `user`, `personalization`, `userSetup`, `approvalSetup`, `notificationSetup`, `resource`, `salesperson`, `employee`, `manager`, `companyInfo`, `warehouseLocations`, `responsibilityCenters`, `dueFromToOwner`, `customer`, `vendor`, `contact`, `systemPrompt`, `unreadNotifications`, `pendingApprovals`, `canUpdateCompanyMemory`, `canSendAndCancelApprovalRequests`

`systemPrompt` is stored per-user, per-company as standard UTF-8 text. `unreadNotifications` is a JSON array of unread notification threads for the current user — each object contains `sender` (User ID), `subject` (text), and `threadId` (GUID without braces). Returns an empty array when no unread notifications exist. `pendingApprovals` is a JSON array of approval entries where Approver ID = current user and Status = Open — each object contains `documentType`, `documentNo`, `amountLCY`, and `dueDate`. Returns `null` when the user has no read permission on Approval Entry or no pending entries exist. `canUpdateCompanyMemory` is a Boolean indicating whether the caller can use the `Memory.Company.Set` message type (i.e. has write permission to the Bifrost Memory table). `canSendAndCancelApprovalRequests` is a Boolean indicating whether the caller can use the `Document.Approval.Send` and `Document.Approval.Cancel` message types (i.e. has write permission to the Approval Access ori table).

Each section returns `null` when the underlying record is not found or unreadable.

**User Setup ori overrides:**

| Link Field | Overrides | Default Lookup |
|------------|-----------|----------------|
| `Resource No.` | `resource` | Time Sheet Owner User ID |
| `Salesperson Code` | `salesperson` | User Setup → Salespers./Purch. Code |
| `Employee No.` | `employee`, `manager` | Resource → Employee chain |
| `G/L Account No.` | `dueFromToOwner` | *(no default — null when empty)* |
| `Customer No.` | `customer` | *(no default — null when empty)* |
| `Vendor No.` | `vendor` | *(no default — null when empty)* |
| `Contact No.` | `contact` | *(no default — null when empty)* |

#### `Field.Translation.Get` — Read a single translation for a record field

Direction: **Outbound**. Uses BC codeunit 3711 "Translation" to retrieve the stored
system translation for one field on one record in a specific language.

```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Get",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": "{\"systemId\":\"12345678-1234-1234-1234-123456789012\",\"fieldId\":3,\"lcid\":1030}"
}
```

| Parameter | Required | Type | Description |
|---|---|---|---|
| `tableName` / `tableNumber` / `subject` | Yes | string / integer | Target table |
| `systemId` / `id` | Yes | GUID | Record SystemId (without braces) |
| `fieldId` / `fieldNo` | Yes | integer | Target field number |
| `lcid` | Yes | integer | Windows Language ID (in request JSON `data`, not envelope) |

Response:
```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "fieldId": 3,
  "lcid": 1030,
  "value": "Skrivebord i trae"
}
```

Errors: `"Request must specify systemId or id parameter"` · `"Request must specify fieldId or fieldNo parameter"` · `"Request must specify lcid parameter"`.

#### `Field.Translation.Set` — Write or delete a translation for a record field

Direction: **Inbound**. Uses BC codeunit 3711 "Translation" to set (or delete) the
system translation for one field on one record in a specific language.

```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Set",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": "{\"systemId\":\"12345678-1234-1234-1234-123456789012\",\"fieldId\":3,\"lcid\":1036,\"value\":\"Description en français\"}"
}
```

| Parameter | Required | Type | Description |
|---|---|---|---|
| `tableName` / `tableNumber` / `subject` | Yes | string / integer | Target table |
| `systemId` / `id` | Yes | GUID | Record SystemId (without braces) |
| `fieldId` / `fieldNo` | Yes | integer | Target field number |
| `lcid` | Yes | integer | Windows Language ID (in request JSON `data`) |
| `value` | No | string | Translation text (max 2048 chars). Blank or omitted = delete. |

Response (same shape as Get):
```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "fieldId": 3,
  "lcid": 1036,
  "value": "Description en français"
}
```

#### `Field.Translations.Get` — Read all translations for a record (plural)

Direction: **Outbound**. Retrieves translations for **all fields** (or a specific field)
on a record, optionally filtered by language. Returns an array.

```json
{
  "specversion": "1.0",
  "type": "Field.Translations.Get",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": "{\"systemId\":\"12345678-1234-1234-1234-123456789012\"}"
}
```

| Parameter | Required | Type | Description |
|---|---|---|---|
| `tableName` / `tableNumber` / `subject` | Yes | string / integer | Target table |
| `systemId` / `id` | Yes | GUID | Record SystemId (without braces) |
| `fieldId` / `fieldNo` | No | integer | Specific field (omit or 0 = all fields) |
| `lcid` | No | integer | Language filter (omit = all languages) |

Response:
```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "translationCount": 4,
  "translations": [
    { "fieldId": 3, "languageId": 1030, "value": "Skrivebord i trae" },
    { "fieldId": 3, "languageId": 1036, "value": "Bureau en bois" },
    { "fieldId": 3, "languageId": 1039, "value": "Viðarskrifborð" },
    { "fieldId": 100, "languageId": 1030, "value": "Kontormøbel" }
  ]
}
```

When `fieldId` is specified, the response includes a `fieldId` top-level field. When `lcid` is specified, the response includes a `lcid` top-level field. Both are omitted when filtering was not requested.

---

### 7.3 SALES, CUSTOMER & ITEM OPERATIONS

#### `Customer.CreditLimit.Get`

Direction: **Outbound**. `subject` = customer number.

```json
{ "specversion": "1.0", "type": "Customer.CreditLimit.Get", "source": "MyApp", "subject": "10000" }
```

Response (all verified fields):
```json
{
  "status": "Success",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "balanceLCY": 4500.00,
  "outstandingBalanceDueLCY": 1200.00,
  "outstandingAmountLCY": 3000.00,
  "creditLimitLCY": 10000.00,
  "remainingCredit": 2500.00,
  "tolerancePercent": 10,
  "remainingCreditWithTolerance": 3500.00,
  "isCreditLimitExceeded": false,
  "hasOverdueBalance": true
}
```

- `remainingCredit` = `creditLimitLCY − balanceLCY − outstandingAmountLCY` (can be negative)
- `remainingCreditWithTolerance` = `creditLimitLCY × (1 + tolerancePercent/100) − balanceLCY − outstandingAmountLCY`
- `isCreditLimitExceeded` = true only when remaining credit **with tolerance** is negative
- Errors: invalid customer number throws a top-level error (no `{"status":"Error"}`)

#### `Customer.SalesHistory.Get`

Direction: **Outbound**. `subject` = customer number (or provide `customerNo` in `data`).

```json
{
  "specversion": "1.0",
  "type": "Customer.SalesHistory.Get",
  "source": "MyApp",
  "subject": "10000",
  "data": "{\"fromDate\":\"2025-01-01\",\"toDate\":\"2025-12-31\"}"
}
```

Parameters: `fromDate` (required, YYYY-MM-DD), `toDate` (optional, defaults to today), `customerNo` (if not in `subject`).

Response:
```json
{
  "status": "Success",
  "noOfRecords": 5,
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "fromDate": "2025-01-01",
  "toDate": "2025-12-31",
  "salesHistory": [
    {
      "itemNo": "1000",
      "variantCode": "",
      "description": "Bicycle",
      "unitOfMeasureCode": "PCS",
      "baseUnitOfMeasure": "PCS",
      "baseUOMDescription": "Piece",
      "quantity": 25,
      "noOfOrders": 3
    }
  ]
}
```

Based on posted sales invoices only. `noOfOrders` = count of sales invoice lines for that item.

#### `Customer.Statement.Pdf`

Direction: **Outbound**. `subject` = customer number or SystemId.

```json
{ "specversion": "1.0", "type": "Customer.Statement.Pdf", "source": "MyApp", "subject": "10000" }
```

Optional: pass `startDate` and `endDate` in `data`. Defaults to last 30 days.

```json
{
  "specversion": "1.0",
  "type": "Customer.Statement.Pdf",
  "source": "MyApp",
  "subject": "10000",
  "data": "{\"startDate\":\"2026-01-01\",\"endDate\":\"2026-03-20\"}"
}
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `startDate` | ISO 8601 date | Today − 30 days | Start of statement period |
| `endDate` | ISO 8601 date | Today | End of statement period |

Response — same two-step PDF flow as all PDF types. `datacontenttype` = `"application/pdf"`. GET `task.data` to download the binary PDF.

**Errors:** `"Subject parameter is required"` · `"Customer {x} not found."` · `"Invalid date range: start date {s} must be before or equal to end date {e}."`.

Statement implementation is configurable via **Customer Statement Type** in Bifrost Setup (extensible enum 10077888). Default (`Standard Statement`) uses BC Report Selections for `C.Statement`.

#### `Item.Availability.Get`

Direction: **Outbound**. Supports single-item (via `subject` or item key) or multi-item (via `tableView`).

```json
{
  "specversion": "1.0",
  "type": "Item.Availability.Get",
  "source": "MyApp",
  "subject": "1000",
  "data": "{\"requestedDeliveryDate\":\"2026-04-01\",\"variantCode\":\"RED\",\"locationFilter\":\"BLUE|RED\"}"
}
```

Item resolution (checked in order): `subject` (GUID → SystemId, text → No.), then data keys `itemNo`, `itemId`, `id`, `systemId`, `recordSystemId`, `tableView` (BC AL table view syntax — see §11). If none specified, returns all non-blocked items.

Optional parameters: `requestedDeliveryDate` (date, defaults to WorkDate), `variantCode`, `locationFilter` (BC filter syntax).

Response wraps results in an `items` array (one entry per matched item). Format depends on Bifrost Setup:

**Physical Inventory** (simpler):
```json
{
  "status": "Success",
  "items": [
    {
      "itemNo": "1000",
      "itemDescription": "Bicycle",
      "baseUnitOfMeasure": "PCS",
      "inventory": [
        { "locationCode": "BLUE", "inventory": 50 }
      ]
    }
  ]
}
```

**Calculated Quantity** (projected availability):
```json
{
  "status": "Success",
  "items": [
    {
      "itemNo": "1000",
      "itemDescription": "Bicycle",
      "baseUnitOfMeasure": "PCS",
      "requestedDeliveryDate": "2026-04-01",
      "availability": [
        {
          "locationCode": "BLUE",
          "inventory": 50,
          "qtyReserved": 10,
          "grossRequirement": 20,
          "scheduledReceipt": 30,
          "plannedOrderReceipt": 15,
          "availableQuantity": 65
        }
      ]
    }
  ]
}
```

**Multi-item example** (using `tableView`):
```json
{
  "specversion": "1.0",
  "type": "Item.Availability.Get",
  "source": "MyApp",
  "data": "{\"tableView\":\"WHERE(Item Category Code=CONST(FURNITURE))\",\"locationFilter\":\"BLUE\"}"
}
```

#### `Item.Price.Get`

Direction: **Outbound**. Supports single-item (via `subject` or item key) or multi-item (via `tableView`).

```json
{
  "specversion": "1.0",
  "type": "Item.Price.Get",
  "source": "MyApp",
  "subject": "1000",
  "data": "{\"customerNo\":\"10000\",\"requestedDeliveryDate\":\"2026-04-01\",\"quantity\":10,\"variantCode\":\"RED\"}"
}
```

Item resolution: same as `Item.Availability.Get` — `subject`, `itemNo`, `itemId`, `id`, `systemId`, `recordSystemId`, `tableView`, or all non-blocked items.

Customer resolution (optional, priority order): `customerNo` (Code), `customerId` (SystemId GUID), `customerRecordId` (SystemId GUID), `customerSystemId` (SystemId GUID). If none provided, returns all-customers prices only.

Customer validation (when any customer identifier provided): Customer must exist and have `VAT Bus. Posting Group`, `Gen. Bus. Posting Group`, and `Customer Posting Group` configured. Missing any of these returns an error response.

Response:
```json
{
  "status": "Success",
  "priceListLines": [
    {
      "priceListCode": "SALES-2026",
      "priceListDescription": "Sales Prices 2026",
      "lineNo": 10000,
      "itemNo": "1000",
      "variantCode": "RED",
      "unitOfMeasureCode": "PCS",
      "qtyPerUnitOfMeasure": 1,
      "minimumQuantity": 0,
      "amountType": "Price",
      "unitPrice": 100.00,
      "unitPriceExclVAT": 90.91,
      "unitPriceInclVAT": 110.00,
      "lineDiscountPct": 0,
      "allowInvoiceDisc": true,
      "allowLineDisc": true,
      "vatBusPostingGr": "DOMESTIC",
      "vatProdPostingGr": "STANDARD",
      "vatPct": 11,
      "itemName": "Bicycle",
      "itemDescription": "Touring Model",
      "baseUnitOfMeasure": "PCS",
      "eanCode": "5701234560013",
      "unspscCode": "87111501",
      "netWeight": 12.5,
      "itemSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "startingDate": "2026-01-01",
      "endingDate": "2026-12-31"
    }
  ]
}
```

When no price list is configured, returns one line with `"priceListCode": "ITEM CARD"`. Each `priceListLines` entry includes `itemNo` to identify which item the price belongs to.

#### `Sales.Document.Post`

Direction: **Inbound**. Supports all sales document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Sales.Document.Post", "source": "MyApp", "subject": "SO-001" }
```

Posts the document. The original document is deleted; one or more posted documents are created.

| Source Document Type | Posted Documents Created |
|---|---|
| Order | Posted Sales Invoice + Posted Sales Shipment |
| Invoice | Posted Sales Invoice |
| Credit Memo | Posted Sales Credit Memo |
| Return Order | Posted Sales Credit Memo + Posted Return Receipt |

Success:
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "SO-001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "postedDocuments": [
    {
      "type": "Posted Sales Invoice",
      "recordSystemId": "a1b2c3d4-...",
      "no": "PSI-001",
      "postingDate": "2026-03-16",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "custLedgerEntryNo": 12345
    },
    {
      "type": "Posted Sales Shipment",
      "recordSystemId": "e5f6a7b8-...",
      "no": "PSS-001",
      "postingDate": "2026-03-16",
      "amount": 0,
      "amountIncludingVAT": 0,
      "custLedgerEntryNo": 0
    }
  ]
}
```

Errors: document not found, document has no lines, or any BC posting validation error — returned as `{ "status": "Error", "error": "…" }`.

#### `Sales.Document.Release` / `Sales.Document.Reopen`

Direction: **Inbound**. Supports all sales document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Sales.Document.Release", "source": "MyApp", "subject": "SO-001" }
```

Success: `{ "status": "Success", "documentType": "Order", "documentNo": "SO-001", "customerNo": "10000", "customerName": "Adatum Corporation", "statusBefore": "Open", "statusAfter": "Released" }`  
Reopen accepts documents with status Released or Pending Approval. For Pending Approval documents without approval entries, status is set directly to Open. Returns `"statusAfter": "Open"` with the actual `"statusBefore"` value.

#### `Sales.Document.Create`

Direction: **Inbound**. Creates a new sales document header for a specified customer and document type.

- Required: `documentType` in data JSON — values: "Quote", "Order", "Invoice", "Credit Memo", "Blanket Order", "Return Order"
- Customer lookup: `subject` (No. or GUID) or data keys (`no`, `id`, `systemId`, `recordSystemId`)
- Optional: `postingDate` in data JSON (ISO YYYY-MM-DD, defaults to WorkDate)
- Response uses Data.Records.Get format with all header fields

```json
{ "specversion": "1.0", "type": "Sales.Document.Create", "source": "MyApp", "subject": "10000", "data": { "documentType": "Order" } }
```

Success: `{ "status": "Success", "noOfRecords": 1, "result": [{ "id": "...", "primaryKey": { "DocumentType": "Order", "No_": "SO-001" }, "fields": { ... } }] }`

Errors: `"documentType is required in request JSON."`, `"Invalid document type 'X'."`, customer not found.

#### `Sales.Document.Statistics`

Direction: **Outbound**. Supports all sales document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Sales.Document.Statistics", "source": "MyApp", "subject": "SO-001" }
```

Response:
```json
{
  "status": "Success",
  "documentNo": "SO-001",
  "order": {
    "amount": 1000.00,
    "invoiceDiscountAmount": 50.00,
    "totalExclVAT": 950.00,
    "vatAmount": 104.50,
    "totalInclVAT": 1054.50,
    "quantity": 10,
    "totalWeight": 25.5,
    "totalVolume": 0.5,
    "noOfVATLines": 1
  },
  "vat_totals": [
    { "vatIdentifier": "NORM", "vatPct": 11, "lineAmount": 950.00, "vatAmount": 104.50 }
  ]
}
```

#### PDF Document Retrieval

Direction: **Outbound**. `subject` = document number or SystemId.

| Type | Document |
|---|---|
| `Sales.SalesInvoice.Pdf` | Posted sales invoice |
| `Sales.SalesShipment.Pdf` | Posted shipment |
| `Sales.SalesCreditMemo.Pdf` | Posted credit memo |
| `Sales.ReturnReceipt.Pdf` | Posted return receipt |
| `Sales.SalesCreditMemo.Pdf` | Posted credit memo |
| `Sales.ReturnReceipt.Pdf` | Posted return receipt |

```json
{ "specversion": "1.0", "type": "Sales.SalesInvoice.Pdf", "source": "MyApp", "subject": "INV-001" }
```

**Response flow — two steps, same as all other message types:**

The POST to `/tasks` returns a standard JSON envelope. When successful, `datacontenttype`
will be `"application/pdf"` and `data` contains the **full absolute download URL** to
the binary PDF file — exactly the same pattern as `Data.Records.Get`:

```json
{
  "id": "7df25b48-ec25-498f-b8cf-566044ae020d",
  "specversion": "1.0",
  "type": "Sales.SalesInvoice.Pdf",
  "source": "MyApp",
  "subject": "INV-001",
  "datacontenttype": "application/pdf",
  "data": "https://api.businesscentral.dynamics.com/v2.0/{tenantGuid}/UAT/api/origo/bifrost/v1.0/companies({companyId})/responses(7df25b48-...)/data"
}
```

Then GET the `data` URL with a Bearer token to download the raw binary PDF bytes:

```javascript
// Step 1 — POST the task
const task = await fetch(`${BASE}/companies(${companyId})/tasks`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ specversion: '1.0', type: 'Sales.SalesInvoice.Pdf',
                         source: 'MyApp', subject: 'INV-001' })
}).then(r => r.json());

// Step 2 — GET the binary PDF from the download URL
const pdfResponse = await fetch(task.data, {
  headers: { Authorization: `Bearer ${token}` }
});
const pdfBlob = await pdfResponse.blob();

// Use in browser — open or trigger download
const url = URL.createObjectURL(pdfBlob);
window.open(url);  // or: downloadLink.href = url; downloadLink.click();
```

> **Key point:** `task.datacontenttype === "application/pdf"` signals that the `data`
> URL returns binary content. Use `response.blob()` or `response.arrayBuffer()` — do
> **not** call `response.json()` on the download step.

Errors from the POST response are thrown as exceptions (not `{"status":"Error"}`):
`"Subject parameter is required"`, `"Sales invoice 'X' not found"`.

#### `Customer.Application.Post`

Direction: **Inbound**. Apply one open customer ledger entry (payment / credit memo / refund) against one or more open target entries of the same customer via codeunit 226.

`subject` = SystemId (GUID) or Entry No. of the *applying* entry. `data.appliesToEntries` (required) is a non-empty array of Entry Nos / SystemIds / `{entryNo}` / `{systemId}` objects.

**Sign trap:** customer payments are *negative*, invoices *positive*. `amountToApply` must match the sign of the applying entry's `Remaining Amount` (which includes VAT).

Full request/response schema, sign convention table, identifier resolution order, discovery workflow, partial-apply and multi-invoice examples, and error catalog: call `Help.Implementation.Get` with `name = Customer.Application.Post`.

#### `Customer.Application.Reverse`

Direction: **Inbound**. Unapply a posted application on a customer ledger entry via codeunit 226.

`subject` = SystemId (GUID) or Entry No. of the customer ledger entry. Optional `data.detailedEntryNo` targets a specific application; without it, the most recent un-reversed application is reversed (**not idempotent** — always pass `detailedEntryNo` for retry safety).

Full schema, how to find the right `detailedEntryNo` via `Detailed Cust. Ledg. Entry`, identifier resolution order, and error catalog: call `Help.Implementation.Get` with `name = Customer.Application.Reverse`.

#### `Sales.Quote.MakeOrder`

Direction: **Inbound**. Converts an existing sales **quote** into a sales **order** via BC codeunit 86 `"Sales-Quote to Order"`. The original quote is deleted; the new order keeps the same customer, lines, and dimensions.

- `subject` = quote document number or SystemId (GUID) of the `Sales Header`
- Resolved document **must** have `Document Type = Quote`; any other type returns an error

```json
{ "specversion": "1.0", "type": "Sales.Quote.MakeOrder", "source": "MyApp", "subject": "SQ-001" }
```

Success: `{ "status": "Success", "quoteNo": "SQ-001", "orderNo": "SO-005", "orderSystemId": "…", "customerNo": "10000", "customerName": "Adatum Corporation", "documentDate": "2026-03-07", "orderDate": "2026-03-07" }`

Errors: `"Subject parameter is required."`, `"Sales header {No} not found."`, `"Sales document {No} is not a Quote (actual type: {Type})."`, or any BC validation error (callstack included as `callstack` field).

#### `Sales.BlanketOrder.MakeOrder`

Direction: **Inbound**. Creates a new sales order from an existing sales **blanket order** via BC codeunit 87 `"Blanket Sales Order to Order"`. Only lines with `Qty. to Ship > 0` are transferred; the blanket order remains and outstanding quantities are reduced.

- `subject` = blanket order document number or SystemId (GUID) of the `Sales Header`
- Resolved document **must** have `Document Type = Blanket Order`
- **Prerequisite:** at least one line must have `Qty. to Ship > 0` — set via `Data.Records.Set` if needed

```json
{ "specversion": "1.0", "type": "Sales.BlanketOrder.MakeOrder", "source": "MyApp", "subject": "SB-001" }
```

Success: `{ "status": "Success", "blanketOrderNo": "SB-001", "orderNo": "SO-006", "orderSystemId": "…", "customerNo": "10000", "customerName": "Adatum Corporation", "documentDate": "2026-03-07", "orderDate": "2026-03-07" }`

Errors: same as `Sales.Quote.MakeOrder` but with "Blanket Order" wording; the BC codeunit also errors if no line qualifies for shipment.

#### `Sales.SalesInvoice.Correct`

Direction: **Inbound**. Wraps BC codeunit 1303 `Correct Posted Sales Invoice` method `CancelPostedInvoiceCreateNewInvoice`. Posts a corrective credit memo against a **posted** sales invoice and creates a new draft `Sales Header` (Document Type = Invoice) initialised from the original. Posting gate: **G/L**.

- `subject` = posted invoice `No.` or SystemId (GUID) of `Sales Invoice Header`
- Or `data` keys: `systemId`, `recordSystemId`, `id`, `invoiceNo`, `no`, `documentNo`

```json
{ "specversion": "1.0", "type": "Sales.SalesInvoice.Correct", "source": "MyApp", "subject": "POST-INV-000123" }
```

Success: `{ "status": "Success", "originalInvoiceNo": "POST-INV-000123", "originalInvoiceId": "…", "customerNo": "10000", "customerName": "Adatum", "cancellingCreditMemo": { "no": "PCM-000456", "id": "…" }, "newDraftInvoice": { "no": "SI-000789", "id": "…", "documentType": "Invoice" } }`

Follow-up with `Data.Records.Get` by `SystemId`: `Sales Header` (new draft), `Sales Cr.Memo Header` (cancelling credit memo), and `Sales Invoice Header` (original). Lines via `Sales Line` / `Sales Cr.Memo Line` by `Document No.`.

Linkage: original invoice has `Cancelled = true` and `Canceled By Cr. Memo No.`; credit memo has `Applies-to Doc. Type/No. = Invoice / <originalInvoiceNo>`; `Cancelled Document` row carries the formal link (`Source ID = 112`, `Cancelled Doc. No.`, `Cancelled By Doc. No.`). New draft has no field-level FK to the original.

Errors: `"Message subject or request data must contain a record identifier"`, invoice not found, invoice cannot be corrected (already cancelled, payments applied, posting period closed) — BC error text with `callstack` field.

#### `Sales.SalesInvoice.Cancel`

Direction: **Inbound**. Wraps BC codeunit 1303 method `CancelPostedInvoice`. Posts only the corrective credit memo — no new draft invoice. Same lookup, gate (G/L), and errors as `Sales.SalesInvoice.Correct`. Response omits `newDraftInvoice`.

```json
{ "specversion": "1.0", "type": "Sales.SalesInvoice.Cancel", "source": "MyApp", "subject": "POST-INV-000123" }
```

Success: `{ "status": "Success", "originalInvoiceNo": "POST-INV-000123", "originalInvoiceId": "…", "customerNo": "10000", "customerName": "Adatum", "cancellingCreditMemo": { "no": "PCM-000456", "id": "…" } }`

Follow-up with `Data.Records.Get` by `SystemId`: `Sales Cr.Memo Header` (+ `Sales Cr.Memo Line` by `Document No.`) and `Sales Invoice Header` (original). Same linkage fields as `Sales.SalesInvoice.Correct` (`Cancelled`, `Canceled By Cr. Memo No.`, `Applies-to Doc.`, `Cancelled Document` with `Source ID = 112`).

#### `Sales.SalesInvoice.Send`

Direction: **Inbound**. Wraps BC standard `Sales Invoice Header.SendProfile(var "Document Sending Profile")`. Same behaviour as clicking **Send** on the posted sales invoice page in BC — exposed as a Bifrost so external systems and AI agents can trigger it without a UI. Channel selection (e-mail / print / disk / electronic document) is fully BC-configured via Document Sending Profiles; this message only decides *which* profile to use. Posting gate: **none** (sending produces no ledger entries).

**Sending flow (what happens when you call this):**

1. Resolve the `Sales Invoice Header` from the request (`invoiceId` GUID → `invoiceNo` → `subject`).
2. Resolve the `Document Sending Profile` using the chain below.
3. Call `Sales Invoice Header.SendProfile(DocumentSendingProfile)` — from here, behaviour is exactly the standard BC Send.
4. BC dispatches every channel the resolved profile has enabled: **Printer** (prints the report), **E-Mail** (renders + sends via the configured email account; sets `Sent as Email = true`), **Disk** (writes the file to user download location), **Electronic Document** (builds PEPPOL/OIOUBL/custom format, hands off to the Document Exchange Service, updates header tracking fields).
5. Return the success envelope (with resolved profile + source), or an error envelope with the original BC error text and callstack.

**Document lookup order:** `data.invoiceNo` → `data.invoiceId` (SystemId) → `subject` (number or SystemId GUID; GUIDs auto-detected).

**Profile resolution order:**

1. `data.documentSendingProfile` (request override) → `documentSendingProfileSource = "Request"`
2. `Customer."Document Sending Profile"` (customer's configured profile) → `documentSendingProfileSource = "Customer"`
3. First `Document Sending Profile` with `Default = true` → `documentSendingProfileSource = "Default"`
4. None of the above → error

**Tracking — where the status lives after sending.** The call does NOT return delivery confirmation. Delivery is asynchronous (especially for e-mail and electronic documents). Read these `Sales Invoice Header` (table 112) fields via `Data.Records.Get` to inspect what happened:

| Field | Type | Meaning |
|---|---|---|
| `Sent as Email` | Boolean | `true` once the e-mail channel handed the message to the mail server. |
| `No. Printed` | Integer | Incremented each time the printer channel produced the document. |
| `Document Exchange Status` | Option | E-document lifecycle at the Document Exchange Service: `Not Sent`, `Sent to Document Exchange Service`, `Sent to Recipient`, `Delivered to Recipient`, `Failed Delivery to Recipient`. Updated asynchronously by the DES connector job queue. |
| `Document Exchange Identifier` | Code[50] | DES-side identifier — used to trace the electronic document in the exchange service portal. |

Sent-email history (subject, recipients, attachment, timestamp) is in the BC base app `Sent Email` / `Email Outbox` tables. A `Success` response means BC accepted dispatch without throwing; it does NOT prove end-to-end delivery — query the tracking fields above for that.

```json
{ "specversion": "1.0", "type": "Sales.SalesInvoice.Send", "source": "MyApp", "subject": "POST-INV-000123", "data": { "documentSendingProfile": "EMAIL" } }
```

Success: `{ "status": "Success", "documentType": "PostedSalesInvoice", "documentNo": "POST-INV-000123", "documentId": "…", "customerNo": "10000", "customerName": "Adatum", "documentSendingProfileCode": "EMAIL", "documentSendingProfileSource": "Request", "message": "Document sent successfully." }`

Errors (returned as `{ "status": "Error", "error": "...", "callstack": "..." }`):
- `"Subject parameter is required. Provide the invoice number or SystemId."`
- `"Sales Invoice {no} not found."`
- `"Document Sending Profile \"{code}\" not found."` (request override does not exist)
- `"Document Sending Profile \"{code}\" referenced by customer {no} does not exist."` (dangling customer profile)
- `"No Document Sending Profile resolved for customer {no} and no system default profile exists."`
- Any error raised by BC's `SendProfile` (e.g., missing e-mail account, missing report selection, electronic document validation failure) — surfaced verbatim through `error` + `callstack`.

#### `Sales.SalesCreditMemo.Send`

Direction: **Inbound**. Wraps BC standard `Sales Cr.Memo Header.SendProfile(var "Document Sending Profile")`. Same sending flow, profile resolution, and tracking semantics as `Sales.SalesInvoice.Send` — read tracking fields from `Sales Cr.Memo Header` (table 114) instead of `Sales Invoice Header` (table 112).

**Document lookup order:** `data.creditMemoNo` → `data.creditMemoId` (SystemId) → `subject`.

```json
{ "specversion": "1.0", "type": "Sales.SalesCreditMemo.Send", "source": "MyApp", "subject": "POST-CRM-000456", "data": { "documentSendingProfile": "EMAIL" } }
```

Success: `{ "status": "Success", "documentType": "PostedSalesCreditMemo", "documentNo": "POST-CRM-000456", "documentId": "…", "customerNo": "10000", "customerName": "Adatum", "documentSendingProfileCode": "EMAIL", "documentSendingProfileSource": "Customer", "message": "Document sent successfully." }`

Errors: same as `Sales.SalesInvoice.Send` except `"Sales Credit Memo {no} not found."` is used when the credit memo is missing.

---

### 7.4 PURCHASE ORDER OPERATIONS

#### `Purchase.Document.Release` / `Purchase.Document.Reopen`

Direction: **Inbound**. Supports all purchase document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Purchase.Document.Release", "source": "MyApp", "subject": "PO-001" }
```

Release returns `{ "status": "Success", "documentType": "Order", "documentNo": "PO-001", "vendorNo": "10000", "vendorName": "Fabrikam Supplies", "statusBefore": "Open", "statusAfter": "Released" }`.  
Reopen accepts documents with status Released or Pending Approval. For Pending Approval documents without approval entries, status is set directly to Open. Returns `"statusAfter": "Open"` with the actual `"statusBefore"` value.

Full response also includes: `documentDate`, `amount`, `amountIncludingVAT`.

#### `Purchase.Document.Create`

Direction: **Inbound**. Creates a new purchase document header for a specified vendor and document type.

- Required: `documentType` in data JSON — values: "Quote", "Order", "Invoice", "Credit Memo", "Blanket Order", "Return Order"
- Vendor lookup: `subject` (No. or GUID) or data keys (`no`, `id`, `systemId`, `recordSystemId`)
- Optional: `postingDate` in data JSON (ISO YYYY-MM-DD, defaults to WorkDate)
- Response uses Data.Records.Get format with all header fields

```json
{ "specversion": "1.0", "type": "Purchase.Document.Create", "source": "MyApp", "subject": "10000", "data": { "documentType": "Order" } }
```

Success: `{ "status": "Success", "noOfRecords": 1, "result": [{ "id": "...", "primaryKey": { "DocumentType": "Order", "No_": "PO-001" }, "fields": { ... } }] }`

Errors: `"documentType is required in request JSON."`, `"Invalid document type 'X'."`, vendor not found.

#### `Purchase.Document.Statistics`

Direction: **Outbound**. Supports all purchase document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Purchase.Document.Statistics", "source": "MyApp", "subject": "PO-001" }
```

Response:
```json
{
  "status": "Success",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "currencyCode": "",
  "documentDate": "2026-03-07",
  "order": {
    "amount": 1000.00,
    "invoiceDiscountAmount": 50.00,
    "totalExclVAT": 950.00,
    "vatAmount": 104.50,
    "totalInclVAT": 1054.50,
    "quantity": 10,
    "totalWeight": 25.5,
    "totalVolume": 0.5,
    "noOfVATLines": 1
  },
  "vat_totals": [
    { "vatIdentifier": "NORM", "vatPct": 11, "lineAmount": 950.00, "vatAmount": 104.50, "amountInclVAT": 1054.50 }
  ]
}
```

#### `Purchase.Document.Post`

Direction: **Inbound**. Supports all purchase document types: Order, Invoice, Credit Memo, Return Order.

- Plain-text `subject` defaults to Document Type = Order
- GUID in `subject` or `data` (`systemId`, `id`, `recordSystemId`) finds any document type
- Specific data keys: `orderNo` (Order), `quoteNo` (Quote), `invoiceNo` (Invoice), `creditMemoNo` (Credit Memo), `blanketOrderNo` (Blanket Order), `returnOrderNo` (Return Order)

```json
{ "specversion": "1.0", "type": "Purchase.Document.Post", "source": "MyApp", "subject": "PO-001" }
```

Posts the document. The original document is deleted; one or more posted documents are created.

| Source Document Type | Posted Documents Created |
|---|---|
| Order | Posted Purchase Invoice + Purchase Receipt |
| Invoice | Posted Purchase Invoice |
| Credit Memo | Posted Purchase Credit Memo |
| Return Order | Posted Purchase Credit Memo + Return Shipment |

Success:
```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "postedDocuments": [
    {
      "type": "Posted Purchase Invoice",
      "recordSystemId": "a1b2c3d4-...",
      "no": "PPI-001",
      "postingDate": "2026-03-16",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "vendorLedgerEntryNo": 12345
    },
    {
      "type": "Purchase Receipt",
      "recordSystemId": "e5f6a7b8-...",
      "no": "PR-001",
      "postingDate": "2026-03-16",
      "amount": 0,
      "amountIncludingVAT": 0,
      "vendorLedgerEntryNo": 0
    }
  ]
}
```

Errors: document not found, document has no lines, or any BC posting validation error — returned as `{ "status": "Error", "error": "…" }`.

---

#### `Purchase.Document.PreviewPost`

Direction: **Inbound**. Supports Order, Invoice, Credit Memo, Return Order.

**Document selection methods** (any one identifies the document):

1. `subject` as plain text — looked up as document `No.` across all four document types on Purchase Header (38).
2. `subject` as GUID — looked up as `SystemId` on Purchase Header.
3. `data.systemId` / `data.recordSystemId` / `data.id` — SystemId lookup.
4. `data.orderNo` — typed `No.` lookup restricted to Document Type = Order.
5. `data.invoiceNo` — typed `No.` lookup restricted to Document Type = Invoice.
6. `data.creditMemoNo` — typed `No.` lookup restricted to Document Type = Credit Memo.
7. `data.returnOrderNo` — typed `No.` lookup restricted to Document Type = Return Order.

First matched `data` key wins. Same lookup semantics as `Purchase.Document.Post`.

Simulates the full BC posting routine through `Codeunit "Gen. Jnl.-Post Preview"` and **rolls the transaction back**. No data is persisted; the source purchase header is unchanged after the call.

```json
{ "specversion": "1.0", "type": "Purchase.Document.PreviewPost", "source": "MyApp", "subject": "PO-001" }
```

Response shape:

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting Order PO-001 for vendor V01 would create 6 ledger entries across 6 tables. Transaction is balanced.",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "V01",
  "vendorName": "Acme Supplies",
  "lcyCode": "USD",
  "documentCurrencyCode": "EUR",
  "documentExchangeRate": 1.08,
  "predictedNumbers": { "postedInvoiceNo": "PI-00045", "postedReceiptNo": "PR-00045" },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 1080.00, "totalCreditLCY": 1080.00,
    "totalDebitFCY": 1000.00, "totalCreditFCY": 1000.00
  },
  "preview": [
    { "tableId": 17,   "tableName": "G/L Entry",                    "tableCaption": "G/L Entry",                     "description": "...", "entryCount": 3, "entries": [ /* full row per entry */ ] },
    { "tableId": 254,  "tableName": "VAT Entry",                    "tableCaption": "VAT Entry",                     "description": "...", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 32,   "tableName": "Item Ledger Entry",            "tableCaption": "Item Ledger Entry",             "description": "...", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 5802, "tableName": "Value Entry",                  "tableCaption": "Value Entry",                   "description": "...", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 25,   "tableName": "Vendor Ledger Entry",          "tableCaption": "Vendor Ledger Entry",           "description": "...", "entryCount": 1, "entries": [ { "Amount": 1000.00, "AmountLCY": 1080.00, "CurrencyCode": "EUR", "...": "..." } ] },
    { "tableId": 379,  "tableName": "Detailed Vendor Ledg. Entry",  "tableCaption": "Detailed Vendor Ledg. Entry",   "description": "...", "entryCount": 1, "entries": [ ... ] }
    /* additional populated tables (Job Ledger, FA Ledger, Bank Account Ledger, Employee Ledger, ...) appear here when the document touches them */
  ]
}
```

**Key contracts:**

- `rollback: true` is always present on success — the source document is unchanged.
- The `preview` array contains **one element per ledger table populated by the BC posting routine**. Tables are discovered dynamically via `Codeunit "Posting Preview Event Handler".FillDocumentEntry()` — the array length depends on the document and any extension-registered tables. The shared `Preview Helper ori` ships curated field-name blocks for 17 BC ledger tables (G/L Entry, VAT Entry, Item Ledger Entry, Value Entry, Vendor / Detailed Vendor Ledger, Cust. / Detailed Cust. Ledger, Bank Account Ledger, FA Ledger, Maintenance Ledger, Job Ledger, Res. Ledger, Service Ledger, Warranty Ledger, Employee / Detailed Employee Ledger). Extensions can register additional tables via the `OnGetPreviewFieldNames` and `OnPrecalculateFlowFields` events on Codeunit 10078239 `"Preview Helper ori"`.
- Entry field names use **mechanical normalization** (`RemoveNonAlphaNumericCharacters`): `No.` → `No_`, `Amount (LCY)` → `AmountLCY`, `Document No.` → `DocumentNo_`. Same rules as `Data.Records.Get`.
- Read-restricted fields from `Field Access ori` are omitted from each entry.
- **Currency invariant:** `documentCurrencyCode == "" ⇒ documentExchangeRate == 1 ∧ totalDebitFCY == totalDebitLCY ∧ totalCreditFCY == totalCreditLCY`. Per-entry currency context (`CurrencyCode`, `Amount` (FCY), `AmountLCY`) is carried on each multi-currency entry.
- `predictedNumbers` are informational only — between preview and actual posting another transaction may consume those No. Series numbers.
- `totals.balanced` is determined in LCY (always exists), rounded to 0.01.

Errors: document not found, document has no lines, or any BC posting validation error — returned as `{ "status": "Error", "error": "…" }`.

---

#### `Sales.Document.PreviewPost`

Direction: **Inbound**. Supports Order, Invoice, Credit Memo, Return Order.

**Document selection methods** (any one identifies the document):

1. `subject` as plain text — looked up as document `No.` across all four document types on Sales Header (36).
2. `subject` as GUID — looked up as `SystemId` on Sales Header.
3. `data.systemId` / `data.recordSystemId` / `data.id` — SystemId lookup.
4. `data.orderNo` — typed `No.` lookup restricted to Document Type = Order.
5. `data.invoiceNo` — typed `No.` lookup restricted to Document Type = Invoice.
6. `data.creditMemoNo` — typed `No.` lookup restricted to Document Type = Credit Memo.
7. `data.returnOrderNo` — typed `No.` lookup restricted to Document Type = Return Order.

First matched `data` key wins. Same lookup semantics as `Sales.Document.Post`.

Simulates the full BC posting routine through `Codeunit "Gen. Jnl.-Post Preview"` driving `Codeunit "Sales-Post (Yes/No)"`, and **rolls the transaction back**. No data is persisted; the source sales header is unchanged after the call.

```json
{ "specversion": "1.0", "type": "Sales.Document.PreviewPost", "source": "MyApp", "subject": "SO-001" }
```

Response shape:

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting Order SO-001 for customer C01 would create 6 ledger entries across 6 tables. Transaction is balanced.",
  "documentType": "Order",
  "documentNo": "SO-001",
  "customerNo": "C01",
  "customerName": "Acme Customer",
  "lcyCode": "USD",
  "documentCurrencyCode": "EUR",
  "documentExchangeRate": 1.08,
  "predictedNumbers": { "postedInvoiceNo": "SI-00045", "postedShipmentNo": "SS-00045" },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 1080.00, "totalCreditLCY": 1080.00,
    "totalDebitFCY": 1000.00, "totalCreditFCY": 1000.00
  },
  "preview": [
    { "tableId": 17,   "tableName": "G/L Entry",                    "tableCaption": "G/L Entry",                     "description": "...", "entryCount": 3, "entries": [ /* full row per entry */ ] },
    { "tableId": 254,  "tableName": "VAT Entry",                    "tableCaption": "VAT Entry",                     "description": "...", "entryCount": 1, "entries": [ ] },
    { "tableId": 32,   "tableName": "Item Ledger Entry",            "tableCaption": "Item Ledger Entry",             "description": "...", "entryCount": 1, "entries": [ ] },
    { "tableId": 5802, "tableName": "Value Entry",                  "tableCaption": "Value Entry",                   "description": "...", "entryCount": 1, "entries": [ ] },
    { "tableId": 21,   "tableName": "Cust. Ledger Entry",           "tableCaption": "Cust. Ledger Entry",            "description": "...", "entryCount": 1, "entries": [ { "Amount": 1000.00, "AmountLCY": 1080.00, "CurrencyCode": "EUR" } ] },
    { "tableId": 380,  "tableName": "Detailed Cust. Ledg. Entry",   "tableCaption": "Detailed Cust. Ledg. Entry",    "description": "...", "entryCount": 1, "entries": [ ] }
    /* additional populated tables (Job Ledger, FA Ledger, Bank Account Ledger, Employee Ledger, ...) appear here when the document touches them */
  ]
}
```

**Key contracts:**

- `rollback: true` is always present on success — the source document is unchanged.
- `predictedNumbers` keys depend on document type: Order → `postedInvoiceNo` + `postedShipmentNo`; Invoice → `postedInvoiceNo`; Credit Memo → `postedCreditMemoNo`; Return Order → `postedCreditMemoNo` + `postedReturnReceiptNo`.
- The `preview` array, field-name normalization, field-access restrictions, currency invariant, and `totals.balanced` semantics are identical to `Purchase.Document.PreviewPost`.
- Customer sign convention: the customer is **debited** (positive `Amount`) on Invoice/Order; credited (negative) on Credit Memo/Return Order. FCY columns are one-sided on the Cust. Ledger Entry side per document.

Errors: document not found, document has no lines, or any BC posting validation error — returned as `{ "status": "Error", "error": "…" }`.

#### `Vendor.Application.Post`

Direction: **Inbound**. Apply one open vendor ledger entry (payment / credit memo / refund) against one or more open target entries of the same vendor via codeunit 227.

`subject` = SystemId (GUID) or Entry No. of the *applying* entry. `data.appliesToEntries` (required) is a non-empty array of Entry Nos / SystemIds / `{entryNo}` / `{systemId}` objects.

**Sign trap (opposite of customer):** vendor payments are *positive*, invoices *negative*. `amountToApply` must match the sign of the applying entry's `Remaining Amount` (which includes VAT).

Full request/response schema, sign convention table, identifier resolution order, discovery workflow, partial-apply and multi-invoice examples, and error catalog: call `Help.Implementation.Get` with `name = Vendor.Application.Post`.

#### `Vendor.Application.Reverse`

Direction: **Inbound**. Unapply a posted application on a vendor ledger entry via codeunit 227.

`subject` = SystemId (GUID) or Entry No. of the vendor ledger entry. Optional `data.detailedEntryNo` targets a specific application; without it, the most recent un-reversed application is reversed (**not idempotent** — always pass `detailedEntryNo` for retry safety).

Full schema, how to find the right `detailedEntryNo` via `Detailed Vendor Ledg. Entry`, identifier resolution order, and error catalog: call `Help.Implementation.Get` with `name = Vendor.Application.Reverse`.

#### `Purchase.Quote.MakeOrder`

Direction: **Inbound**. Converts an existing purchase **quote** into a purchase **order** via BC codeunit 96 `"Purch.-Quote to Order"`. The original quote is deleted; the new order keeps the same vendor, lines, and dimensions.

- `subject` = quote document number or SystemId (GUID) of the `Purchase Header`
- Resolved document **must** have `Document Type = Quote`

```json
{ "specversion": "1.0", "type": "Purchase.Quote.MakeOrder", "source": "MyApp", "subject": "PQ-001" }
```

Success: `{ "status": "Success", "quoteNo": "PQ-001", "orderNo": "PO-005", "orderSystemId": "…", "vendorNo": "10000", "vendorName": "Fabrikam, Inc.", "documentDate": "2026-03-07", "orderDate": "2026-03-07" }`

Errors: `"Subject parameter is required."`, `"Purchase header {No} not found."`, `"Purchase document {No} is not a Quote (actual type: {Type})."`, or any BC validation error (callstack included as `callstack` field).

#### `Purchase.BlanketOrder.MakeOrder`

Direction: **Inbound**. Creates a new purchase order from an existing purchase **blanket order** via BC codeunit 97 `"Blanket Purch. Order to Order"`. Only lines with `Qty. to Receive > 0` are transferred; the blanket order remains and outstanding quantities are reduced.

- `subject` = blanket order document number or SystemId (GUID) of the `Purchase Header`
- Resolved document **must** have `Document Type = Blanket Order`
- **Prerequisite:** at least one line must have `Qty. to Receive > 0` — set via `Data.Records.Set` if needed

```json
{ "specversion": "1.0", "type": "Purchase.BlanketOrder.MakeOrder", "source": "MyApp", "subject": "PB-001" }
```

Success: `{ "status": "Success", "blanketOrderNo": "PB-001", "orderNo": "PO-006", "orderSystemId": "…", "vendorNo": "10000", "vendorName": "Fabrikam, Inc.", "documentDate": "2026-03-07", "orderDate": "2026-03-07" }`

Errors: same as `Purchase.Quote.MakeOrder` but with "Blanket Order" wording; the BC codeunit also errors if no line qualifies for receipt.

#### `Purchase.PurchaseInvoice.Correct`

Direction: **Inbound**. Wraps BC codeunit 1313 `Correct Posted Purch. Invoice` method `CancelPostedInvoiceStartNewInvoice`. Posts a corrective credit memo against a **posted** purchase invoice and creates a new draft `Purchase Header` (Document Type = Invoice) initialised from the original. Posting gate: **G/L**.

- `subject` = posted invoice `No.` or SystemId (GUID) of `Purch. Inv. Header`
- Or `data` keys: `systemId`, `recordSystemId`, `id`, `invoiceNo`, `no`, `documentNo`

```json
{ "specversion": "1.0", "type": "Purchase.PurchaseInvoice.Correct", "source": "MyApp", "subject": "PINV-000123" }
```

Success: `{ "status": "Success", "originalInvoiceNo": "PINV-000123", "originalInvoiceId": "…", "vendorNo": "10000", "vendorName": "Fabrikam", "cancellingCreditMemo": { "no": "PCM-000456", "id": "…" }, "newDraftInvoice": { "no": "PI-000789", "id": "…", "documentType": "Invoice" } }`

Follow-up with `Data.Records.Get` by `SystemId`: `Purchase Header` (new draft), `Purch. Cr. Memo Hdr.` (cancelling credit memo), and `Purch. Inv. Header` (original). Lines via `Purchase Line` / `Purch. Cr. Memo Line` by `Document No.`.

Linkage: original invoice has `Cancelled = true` and `Canceled By Cr. Memo No.`; credit memo has `Applies-to Doc. Type/No. = Invoice / <originalInvoiceNo>`; `Cancelled Document` row carries the formal link (`Source ID = 122`, `Cancelled Doc. No.`, `Cancelled By Doc. No.`). New draft has no field-level FK to the original.

Errors: missing identifier, invoice not found, invoice cannot be corrected — BC error text with `callstack` field.

#### `Purchase.PurchaseInvoice.Cancel`

Direction: **Inbound**. Wraps BC codeunit 1313 method `CancelPostedInvoice`. Posts only the corrective credit memo — no new draft invoice. Same lookup, gate (G/L), and errors as `Purchase.PurchaseInvoice.Correct`. Response omits `newDraftInvoice`.

```json
{ "specversion": "1.0", "type": "Purchase.PurchaseInvoice.Cancel", "source": "MyApp", "subject": "PINV-000123" }
```

Success: `{ "status": "Success", "originalInvoiceNo": "PINV-000123", "originalInvoiceId": "…", "vendorNo": "10000", "vendorName": "Fabrikam", "cancellingCreditMemo": { "no": "PCM-000456", "id": "…" } }`

Follow-up with `Data.Records.Get` by `SystemId`: `Purch. Cr. Memo Hdr.` (+ `Purch. Cr. Memo Line` by `Document No.`) and `Purch. Inv. Header` (original). Same linkage fields as `Purchase.PurchaseInvoice.Correct` (`Cancelled`, `Canceled By Cr. Memo No.`, `Applies-to Doc.`, `Cancelled Document` with `Source ID = 122`).

---

### 7.5 FINANCE OPERATIONS

#### `Finance.GeneralJournal.Check`

Direction: **Outbound**. `subject` = `TEMPLATE|BATCH` (pipe-separated) or SystemId GUID. Or pass `templateName`/`batchName` in `data`.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.Check", "source": "MyApp", "subject": "GENERAL|DEFAULT" }
```

Validates a general journal batch without posting. Returns readiness status with comprehensive validation results.

Response (Ready):
```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "lineCount": 4,
  "isBalanced": true,
  "totalAmountLCY": 0.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

Response (Not Ready):
```json
{
  "status": "Success",
  "validationResult": "NotReady",
  "templateName": "GENERAL",
  "batchName": "INVALID",
  "lineCount": 2,
  "isBalanced": false,
  "totalAmountLCY": 1500.0,
  "errorCount": 3,
  "warningCount": 0,
  "errors": [
    "Journal is not balanced: Total LCY = 1500.00 (should be 0.00).",
    "Line 10000: Document No. is required.",
    "Line 20000: G/L Account 44000 does not allow direct posting."
  ],
  "warnings": []
}
```

**Validation states:**
- `Ready` — no errors, no warnings — safe to post
- `ReadyWithWarnings` — no errors, has warnings (e.g., future posting dates, zero amounts) — posting allowed
- `NotReady` — has blocking errors — posting will fail

Uses BC Error Message Management framework with codeunit 11 "Gen. Jnl.-Check Line" to collect **all** validation errors (not just the first).

#### `Finance.GeneralJournal.Post`

Direction: **Inbound**. `subject` = `TEMPLATE|BATCH` or SystemId GUID. Or pass `templateName`/`batchName` in `data`.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.Post", "source": "MyApp", "subject": "GENERAL|BATCH001" }
```

Posts a general journal batch. All lines are cleared from the batch after successful posting.

Success:
```json
{
  "status": "Success",
  "templateName": "GENERAL",
  "batchName": "BATCH001",
  "batchDescription": "Default Journal Batch",
  "linesPosted": 6,
  "postingDate": "2024-01-15",
  "totalAmountLCY": 0.0,
  "glRegisterNo": 42,
  "glRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 1001,
  "toEntryNo": 1006,
  "fromVATEntryNo": 501,
  "toVATEntryNo": 502
}
```

Error (with callstack):
```json
{
  "status": "Error",
  "error": "Journal batch is not balanced.",
  "callstack": "Gen. Jnl.-Post Batch(CodeUnit 80).OnRun..."
}
```

Uses "Gen. Jnl.-Post Batch" codeunit 80 for posting. Returns G/L Register details including entry ranges for audit trail. All journal lines are cleared after successful posting.

**Workflow:** Prepare lines with `Finance.GeneralJournal.SetupNewLine`, populate fields with `Data.Records.Set`, validate with `Finance.GeneralJournal.Check`, then post with `Finance.GeneralJournal.Post`.

#### `Finance.GeneralJournal.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). `subject` = `TEMPLATE|BATCH` or SystemId GUID. Or pass `templateName`/`batchName` in `data`.

Simulates posting a general journal batch and returns the resulting ledger entries (G/L Entry, VAT Entry, Customer/Vendor/Bank/Employee Ledger Entry, FA Ledger Entry, Job Ledger Entry, plus any extension-registered tables) **without committing changes**. The full `Gen. Jnl.-Post` routine runs inside a transaction that is rolled back after capturing the simulated entries.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.PreviewPost", "source": "MyApp", "subject": "GENERAL|DEFAULT" }
```

Success:
```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting general journal batch GENERAL|DEFAULT (3 lines) would create 6 ledger entries across 2 tables. Transaction is balanced.",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 3,
  "postingDate": "2024-01-15",
  "lcyCode": "USD",
  "predictedDocumentNos": ["DOC-001", "DOC-002"],
  "totals": { "balanced": true, "totalDebitLCY": 1500.00, "totalCreditLCY": 1500.00 },
  "preview": [
    { "tableId": 17, "tableName": "G/L Entry", "entryCount": 6, "entries": [ /* ... */ ] }
  ]
}
```

**Identification methods (first match wins):**
1. Subject `TEMPLATE|BATCH` (pipe-separated names)
2. Subject SystemId GUID of the journal batch
3. Data `templateName` + `batchName`

**Notes:**
- The `totals` object reports only LCY totals because a journal batch can mix multiple currencies across lines. Per-entry currency context (`CurrencyCode`, `Amount`, `AmountLCY`) remains available inside each captured entry in the `preview` array.
- `predictedDocumentNos` is informational only — No. Series state may change between preview and actual post.
- Field-level access restrictions from `Field Access ori` are honoured: read-restricted fields are omitted from `preview[].entries`.
- Uses BC codeunit `Gen. Jnl.-Post Preview` to drive `Gen. Jnl.-Post` headlessly via `SetContext + Run()`. Tables are enumerated dynamically via `Posting Preview Event Handler.FillDocumentEntry()`, so any extension-registered ledger tables also appear in the `preview` array.

#### `Finance.GeneralJournal.SetupNewLine` — create a new journal line with defaults

Direction: **Inbound** (creates a record). `subject` = `TEMPLATE|BATCH` (pipe-separated) or SystemId GUID. Or pass `templateName`/`batchName` in `data`. Optional: `fieldNumbers` to limit response fields. Optional: `clearExistingLines` (Boolean, default `false`) — when `true`, deletes all existing lines in the batch before creating the new line (line numbering restarts at 10000).

This is the default way to prepare a general journal line. It creates and inserts a new line pre-populated with defaults from BC's `SetUpNewLine` procedure. Default values inherited from the template and batch include Bal. Account Type, Bal. Account No., Document Type, and Posting Date. If a No. Series is configured on the journal batch, the Document No. is automatically populated from the next number in the series.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.SetupNewLine", "source": "MyApp", "subject": "GENERAL|DEFAULT" }
```

Response (same format as `Data.Records.Get` — single record):
```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
      "primaryKey": {
        "JournalTemplateName": "GENERAL",
        "JournalBatchName": "DEFAULT",
        "LineNo_": 10000
      },
      "fields": {
        "PostingDate": "2026-04-15",
        "DocumentNo_": "GJ-00001",
        "DocumentType": " ",
        "AccountType": "G/L Account",
        "BalAccountType": "G/L Account",
        "BalAccountNo_": "29900"
      }
    }
  ]
}
```

**Typical workflow:**
1. `Finance.GeneralJournal.SetupNewLine` — create line with defaults
2. `Data.Records.Set` — populate Account No., Amount, etc. using the returned SystemId
3. Repeat 1–2 for each line
4. `Finance.GeneralJournal.Check` — validate
5. `Finance.GeneralJournal.Post` — post

#### `Finance.GeneralJournal.ReverseRegister` — reverse all entries in a G/L Register

Direction: **Inbound** (modifies data). `subject` = G/L Register No. (integer) or SystemId GUID of the G/L Register record.

Reverses all G/L entries belonging to a specific G/L Register. Uses BC's `Reversal Entry` table with `ReverseRegister` method and dialog suppression. The reversal is executed in an isolated codeunit for clean error handling.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.ReverseRegister", "source": "MyApp", "subject": "42" }
```

Success:
```json
{
  "status": "Success",
  "reversedRegisterNo": 42,
  "fromEntryNo": 1001,
  "toEntryNo": 1006
}
```

Error (already reversed):
```json
{
  "status": "Error",
  "error": "G/L Register 42 has already been reversed."
}
```

Error (reversal failure with callstack):
```json
{
  "status": "Error",
  "error": "The transaction cannot be reversed because...",
  "callstack": "Reversal-Post(CodeUnit 179).OnRun..."
}
```

**Validation rules:**
- Subject is required — returns error if empty
- Subject must be a valid integer or GUID — returns error if unparseable
- G/L Register must exist — returns error if not found
- G/L Register must not already be reversed — returns error if `Reversed = true`

#### `Finance.GeneralJournal.ReverseTransaction` — reverse all entries by transaction number

Direction: **Inbound** (modifies data). `subject` = Transaction No. (integer) or SystemId GUID of any G/L Entry in the transaction.

Reverses all G/L entries sharing a specific transaction number. Uses BC's `Reversal Entry` table with `ReverseTransaction` method and dialog suppression. The reversal is executed in an isolated codeunit for clean error handling.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.ReverseTransaction", "source": "MyApp", "subject": "157" }
```

Success:
```json
{
  "status": "Success",
  "reversedTransactionNo": 157,
  "entriesReversed": 4
}
```

Error (already reversed):
```json
{
  "status": "Error",
  "error": "Transaction No. 157 has already been reversed."
}
```

Error (reversal failure with callstack):
```json
{
  "status": "Error",
  "error": "The transaction cannot be reversed because...",
  "callstack": "Reversal-Post(CodeUnit 179).OnRun..."
}
```

**Validation rules:**
- Subject is required — returns error if empty
- Subject must be a valid integer or GUID — returns error if unparseable
- At least one G/L entry must exist for the transaction number — returns error if none found
- The entries must not already be reversed — returns error if `Reversed = true`

**Reversal workflow (both types):**
1. Identify entries to reverse (by register or transaction number)
2. Call `Finance.GeneralJournal.ReverseRegister` or `Finance.GeneralJournal.ReverseTransaction`
3. BC creates new offsetting entries with the next available entry numbers
4. Original entries are marked as `Reversed = true`

### 7.5a BANK RECONCILIATION OPERATIONS

**Identification:** `subject` should be reconciliation SystemId GUID for `Match`, `Reset`, and `Post`. For `Create`, `subject` may be Bank Account No. or Bank Account SystemId GUID. JSON fallback fields are supported per message type.

**Workflow:** `Finance.BankReconciliation.Create` → `Finance.BankReconciliation.Match` (or `Finance.BankReconciliation.Reset` + `Finance.BankReconciliation.Match`) → `Finance.BankReconciliation.Post`.

**Data-flow mechanism (important for query/verification):**
- Header: `Bank Acc. Reconciliation` with `Statement Type = Bank Reconciliation`.
- Lines: `Bank Acc. Reconciliation Line`.
- `Match` stamps `Bank Account Ledger Entry` with `Statement No.`, `Statement Line No.`, and `Statement Status = Bank Acc. Entry Applied` (via BC helper `Bank Acc. Entry Set Recon.-No.`). Many-to-one matches add rows to `Bank Acc. Rec. Match Buffer`. Auto-match calls `Match Bank Rec. Lines.BankAccReconciliationAutoMatch`.
- `Reset` calls `Match Bank Rec. Lines.RemoveMatchesFromRecLines`, which reverses the BLE stamps and zeroes line `Applied Amount`/`Applied Entries`/`Difference`.
- `Post` runs `Bank Acc. Reconciliation Post`: closes matched BLEs (`Open=false`, `Statement Status=Closed`), posts G/L entries, deletes the header, writes `Posted Bank Acc. Reconciliation` history.
- **This flow never writes `Applied Payment Entry` rows.** That table exists only for Statement Type = `Payment Application`. To verify a match externally, read `Bank Account Ledger Entry` filtered by the reconciliation `Statement No.` -- not `Applied Payment Entry`.

#### `Finance.BankReconciliation.Create`

Creates a new bank reconciliation (`Statement Type = Bank Reconciliation`) or reuses an existing empty one for the bank account, then attempts statement import.

```json
{ "specversion": "1.0", "type": "Finance.BankReconciliation.Create", "source": "MyApp", "subject": "BANK-MAIN", "data": { "statementDate": "2026-05-30" } }
```

Success fields: `status`, `reused`, `bankAccountNo`, `statementNo`, `statementDate`, `systemId`, `lineCount`, optional `warning`.

Important behavior:
- Missing `statementDate` + reused reconciliation -> statement date reset to `0D`.
- Import failures are returned as `warning`; `status` remains `Success`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.BankReconciliation.Create`.

#### `Finance.BankReconciliation.Match`

Resolves reconciliation and computes match mode from `statementLines` and `ledgerEntries` arrays. Empty arrays trigger auto-match execution.

```json
{ "specversion": "1.0", "type": "Finance.BankReconciliation.Match", "source": "MyApp", "subject": "<reconciliation-guid>", "data": { "statementLines": [10000, 20000], "ledgerEntries": [30000, 40000], "strict": true } }
```

Success fields: `status`, `mode`, `strict`, `statementLinesCount`, `ledgerEntriesCount`, `bankAccountNo`, `statementNo`, `reconciliationSystemId`.

Validation rules:
- N-N is only allowed with `strict=true`.
- Strict N-N requires equal array lengths.

Detailed help: call `Help.Implementation.Get` with `name = Finance.BankReconciliation.Match`.

#### `Finance.BankReconciliation.Reset`

Removes all applied matches across all lines for a reconciliation.

```json
{ "specversion": "1.0", "type": "Finance.BankReconciliation.Reset", "source": "MyApp", "subject": "<reconciliation-guid>", "data": {} }
```

Success fields: `status`, `mode` (`ResetAll`), `resetLineCount`, `bankAccountNo`, `statementNo`, `reconciliationSystemId`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.BankReconciliation.Reset`.

#### `Finance.BankReconciliation.Post`

Posts reconciliation through BC codeunit `Bank Acc. Reconciliation Post`.

```json
{ "specversion": "1.0", "type": "Finance.BankReconciliation.Post", "source": "MyApp", "subject": "<reconciliation-guid>", "data": {} }
```

Success fields: `status`, `bankAccountNo`, `statementNo`, `reconciliationSystemId`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.BankReconciliation.Post`.

#### `Finance.VAT.CalcAndPostSettlement`

Previews or posts a VAT settlement via report 20 *Calc. and Post VAT Settlement*. Set `post=false` (default) to inspect aggregated totals; set `post=true` to post and receive the resulting G/L Register number plus the inclusive `VAT Entry."Entry No."` range.

```json
{ "specversion": "1.0", "type": "Finance.VAT.CalcAndPostSettlement", "source": "MyApp",
  "data": { "startingDate": "2026-01-01", "endingDate": "2026-01-31",
            "postingDate": "2026-02-01", "documentNo": "VAT-2026-01",
            "settlementAccountNo": "2150", "post": true,
            "vatBusPostingGroup": "DOMESTIC", "vatProdPostingGroup": "VAT24",
            "type": "Sale", "showAmountsInAddCurrency": false } }
```

Required: `startingDate`, `endingDate`, `postingDate`, `documentNo`, `settlementAccountNo`. Optional filters: `vatBusPostingGroup`, `vatProdPostingGroup`, `vatRegistrationNo`, `type` (`Purchase` / `Sale` / `Purchase|Sale`).

Preview success fields: `status`, `posted=false`, `documentNo`, `postingDate`, `settlementAccountNo`, `startingDate`, `endingDate`, `showAmountsInAddCurrency`, `lcyCode`, `totals` (`vatBase`, `vatAmount`, `vatBaseACY`, `vatAmountACY`, `entryCount`), `byPostingGroup[]` (per `Type` + `VAT Bus.`/`Prod. Posting Group` combination).

Post success adds: `posted=true`, `glRegisterNo`, `fromVATEntryNo`, `toVATEntryNo`, `settlementVATEntryCount`. Individual VAT entries are omitted; retrieve them via `Data.Records.Get` against `VAT Entry` filtered by `Entry No.` between the returned bounds.

Validation errors (`status=Error`): missing required field, `endingDate < startingDate`, settlement account missing / not `Account Type = Posting` / blocked, or no open VAT entries match the filters. Report-time failures additionally include `callstack`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.VAT.CalcAndPostSettlement`.

#### `Finance.VATStatement.Preview`

Reproduces standard BC page 474 *VAT Statement Preview*. Returns the calculated Column Amount per VAT Statement Line via report 12 `"VAT Statement".CalcLineTotal` — same API page 474 uses, so values match. Read-only, no posting.

```json
{ "specversion": "1.0", "type": "Finance.VATStatement.Preview", "source": "MyApp",
  "data": { "templateName": "DEFAULT", "name": "DEFAULT",
            "selection": "Open and Closed", "periodSelection": "Within Period",
            "dateFilter": "01/01/25..31/01/25", "countryRegionFilter": "",
            "rowNoFilter": "", "showAmountsInAddCurrency": false } }
```

Required: `templateName`, `name`. Optional: `selection` (`Open` / `Closed` / `Open and Closed`, default `Open and Closed`), `periodSelection` (`Within Period` / `Before and Within Period`, default `Within Period`), `dateFilter` (applied to `VAT Statement Name."Date Filter"` FlowFilter), `countryRegionFilter`, `rowNoFilter`, `showAmountsInAddCurrency`.

Success fields: `status`, `templateName`, `name`, `description`, `selection`, `periodSelection`, `dateFilter`, `countryRegionFilter`, `showAmountsInAddCurrency`, `lineCount`, `lines[]`. Each line: `lineNo`, `rowNo`, `description`, `type`, `amountType`, `genPostingType`, `vatBusPostingGroup`, `vatProdPostingGroup`, `accountTotaling`, `rowTotaling`, `print`, `printWith`, `newPage`, `boxNo`, `columnAmount`.

`columnAmount` is `false` (boolean) for `Description`-type rows or when `CalcLineTotal` returns no amount; otherwise a decimal. Rows with `printWith = Opposite Sign` have `columnAmount` already inverted to match page 474.

Validation errors (`status=Error`): missing `templateName` / `name`, invalid `selection` / `periodSelection`, template not found, or name not found within template.

Enumerate templates/names via `Data.Records.Get` against `VAT Statement Template` (256) or `VAT Statement Name` (257).

Detailed help: call `Help.Implementation.Get` with `name = Finance.VATStatement.Preview`.

#### VAT Settlement Workflow

`Finance.VATStatement.Preview` and `Finance.VAT.CalcAndPostSettlement` are the two halves of the BC VAT settlement workflow. Both read the same `VAT Entry` table but aggregate differently: Preview groups per `VAT Statement Line` (Row No.) using report 12 `CalcLineTotal`; CalcAndPostSettlement groups per `Type` + posting groups using report 20.

Standard sequence:
1. Post period transactions (each writes `VAT Entry` rows with `Closed=false`).
2. `Finance.VATStatement.Preview` — verify the VAT return per Statement Line.
3. `Finance.VAT.CalcAndPostSettlement` with `post=false` — verify the same totals aggregated per posting-group.
4. Reconcile: sum of VAT-amount rows in step 2 must equal `totals.vatAmount` from step 3 for the same period and filters. Discrepancy = wrong Statement Template definition.
5. `Finance.VAT.CalcAndPostSettlement` with `post=true` — closes the period's open VAT entries and posts the net to `settlementAccountNo`. Returns `glRegisterNo`, `fromVATEntryNo`, `toVATEntryNo`.
6. Retrieve the posted detail via `Data.Records.Get` against `VAT Entry` filtered by the returned `Entry No.` range, or against `G/L Register` by the returned `No.`.

Re-running the post for the same period without new entries fails with `No open VAT entries match the supplied filters.` (intended guard).

For the full end-to-end narrative (concepts, what the settlement actually posts, reconciliation rules), call `Help.Implementation.Get` with either message type name — both help texts include the shared *VAT Settlement Process (End-to-End)* section.

#### `Finance.Currency.AdjustExchangeRates`

Previews or posts BC codeunit 699 *Exch. Rate Adjmt. Process* for foreign-currency revaluation. Set `post=false` (default) for a rolled-back preview captured via the BC posting-preview framework; set `post=true` to commit and receive the new G/L Register number, the inclusive `G/L Entry."Entry No."` range, and a per-currency LCY breakdown.

```json
{ "specversion": "1.0", "type": "Finance.Currency.AdjustExchangeRates", "source": "MyApp",
  "data": { "endingDate": "2025-12-31", "postingDate": "2025-12-31",
            "documentNo": "FX-2025-12", "currencyCode": "USD|EUR",
            "adjustCustomers": true, "adjustVendors": true, "adjustEmployees": false,
            "adjustBankAccounts": true, "adjustGLAccounts": true, "post": true } }
```

Required: `endingDate`, `postingDate`, `documentNo`. Optional: `post` (default `false`), `currencyCode` (BC-style filter expression, default = all FCY), `postingDescription` (default `Exchange rate adjustment <currencyCode-filter> <endingDate>`), and the five toggles `adjustCustomers` / `adjustVendors` / `adjustEmployees` / `adjustBankAccounts` / `adjustGLAccounts` (each default `true`). At least one toggle must be `true`. `adjustVATEntries` is intentionally **not** exposed — use `Finance.VAT.CalcAndPostSettlement` for VAT settlement.

Preview success fields: `status`, `posted=false`, `rollback=true`, `postingDate`, `endingDate`, `documentNo`, `postingDescription`, `currencyFilter`, all five `adjust*` toggle echoes, `lcyCode`, `totals` (`balanced`, `totalDebitLCY`, `totalCreditLCY`), `preview[]` (one element per ledger table touched: `tableId`, `tableCaption`, `entryCount`, `entries[]` with curated field projection via `Preview Helper ori.AddTableToPreview`), `durationMs`.

Post success adds: `posted=true`, `totals.netLCY`, `totals.newGLEntryCount`, `byCurrency[]` (per FCY currency: `currencyCode`, `adjustedBaseLCY`, `adjustedAmtLCY`, `registerCount` — sourced from `Exch. Rate Adjmt. Reg.` via `CalcSums`), `glRegisterNo`, `fromGLEntryNo`, `toGLEntryNo`, `newGLEntryCount`. Individual `G/L Entry` rows are omitted; retrieve them via `Data.Records.Get` against `G/L Entry` filtered by `Entry No.` between the returned bounds, or against `Exch. Rate Adjmt. Reg.` to inspect per-Account-Type / Posting-Group splits.

Both branches enforce the `Posting Gate ori` for posting type `G/L`. Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Denial returns `status=Error` with `Posting denied: missing 'BIFROST GL Post ori' permission set.`; the gate runs before parameters are populated so no preview or post is attempted.

**Currency master prerequisites** (BC codeunit 699 enforces these on every active currency in the company, not just the ones in `currencyCode`):
- Fields 6/7/8/9 `Unrealized Gains Acc.` / `Unrealized Losses Acc.` / `Realized Gains Acc.` / `Realized Losses Acc.` — required for any run.
- Fields 40/41 `Realized G/L Gains Account` / `Realized G/L Losses Account` — required only when `adjustGLAccounts=true`, but validated on **all** currencies regardless of filter. Set `adjustGLAccounts=false` for ledger-only revaluation when fields 40/41 are not configured everywhere.

Missing values surface as `Unrealized Gains Acc. must have a value in Currency: Code=XYZ.` (or the field-40/41 variant). Re-running with the same payload succeeds once the Currency Card is populated.

Validation errors (`status=Error`): missing required field, all `adjust*` toggles false, posting gate denied. Engine-time failures (post branch only) additionally include `callstack`. Engine failures during posting are isolated via `Codeunit.Run` so the outer message-processing transaction is preserved.

**Operational notes for AI callers**:
- `adjustedBaseLCY` is `0.00` when the underlying open entries already net to zero LCY in the source currency (e.g. recently posted clearing transactions); only `adjustedAmtLCY` carries the FX delta. Do not flag as an error.
- `byCurrency` is `[]` and `newGLEntryCount` is `0` on no-op runs (no open entries in the date window); `status` stays `Success`.
- Preview rollback is total: nothing remains in `Exch. Rate Adjmt. Reg.`, `G/L Entry`, or any Detailed Ledger Entry table.
- For line-level detail of a posted run, follow up with `Data.Records.Get` against `G/L Entry` filtered by `Entry No.` between `fromGLEntryNo` and `toGLEntryNo`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.Currency.AdjustExchangeRates`.

---

### 7.5b FIXED ASSET JOURNAL OPERATIONS

**Identification:** Fixed Asset journals use the same three identification modes as general journals: pipe-form `"TEMPLATE|BATCH"`, SystemId via `Format(SystemId, 0, 4)`, or JSON `{"templateName": "FA", "batchName": "DEFAULT"}` (JSON has precedence).

**Workflow:** `Finance.FAJournal.SetupNewLine` → `Data.Records.Set` → `Finance.FAJournal.Check` → `Finance.FAJournal.Post` (or `Finance.FAJournal.PreviewPost` for a dry run).

#### `Finance.FAJournal.SetupNewLine`

Creates a new FA Journal Line with defaults from template/batch via BC `SetUpNewLine`. Returns the new line in `Data.Records.Get` shape with `primaryKey { JournalTemplateName, JournalBatchName, LineNo_ }`.

```json
{ "specversion": "1.0", "type": "Finance.FAJournal.SetupNewLine", "source": "MyApp", "subject": "FA|DEFAULT" }
```

Optional: `fieldNumbers` (int[]), `noOfLines` (1–100), `clearExistingLines` (boolean).

#### `Finance.FAJournal.Check`

Validates an FA journal batch without posting. Zero-amount lines produce **warnings** (non-blocking).

```json
{ "specversion": "1.0", "type": "Finance.FAJournal.Check", "source": "MyApp", "subject": "FA|DEFAULT" }
```

Response: `status`, `validationResult` (`Ready` / `ReadyWithWarnings` / `NotReady`), `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalAmount`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Finance.FAJournal.Post`

Posts the batch via BC `FA Jnl.-Post Batch`. Wrapped in an isolated codeunit so errors return a built response with `callstack`.

```json
{ "specversion": "1.0", "type": "Finance.FAJournal.Post", "source": "MyApp", "subject": "FA|BATCH001" }
```

Response (success): `status`, `templateName`, `batchName`, `batchDescription`, `linesPosted`, `postingDate`, `totalQuantity` (typically 0 — amount-driven), `totalAmount`, `faRegisterNo`, `faRegisterId`, `fromEntryNo`, `toEntryNo`.

#### `Finance.FAJournal.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). Same identification (`subject` = `TEMPLATE|BATCH` or SystemId GUID; or `templateName`/`batchName` in `data`).

Drives BC `FA Jnl.-Post` headlessly via `Gen. Jnl.-Post Preview.SetContext + Run()` and rolls back. Tables most commonly captured: `Maintenance Ledger Entry` (5625), and for G/L-integrating posting types also `FA Ledger Entry` (5601), `G/L Entry` (17), `VAT Entry` (254) and bal-account movements.

```json
{ "specversion": "1.0", "type": "Finance.FAJournal.PreviewPost", "source": "MyApp", "subject": "FA|DEFAULT" }
```

Response uses the same envelope as `Finance.GeneralJournal.PreviewPost` (`rollback`, `summary`, `totals`, `preview[]`). Each `preview[]` entry exposes per-row `id` (SystemId), `primaryKey` and `fields` objects, and a `tableCaption` alongside `tableId`/`tableName`. Document numbers BC has not yet allocated appear as `"***"` in `predictedDocumentNos` and inside row `fields`.

**FA G/L Integration routing (critical):** Each `G/L Integration - {Type}` flag on the FA Depreciation Book controls whether postings of that type **must** go through the **general journal** rather than the FA journal.
- When `G/L Integration - Acquisition Cost = true` (BC default), Acquisition Cost lines with `Account Type = Fixed Asset` must be posted via `Finance.GeneralJournal.PreviewPost` / `Finance.GeneralJournal.Post`. Attempting this in the FA journal returns: `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...`. The same applies to Depreciation, Disposal, Maintenance, etc.
- **CRONUS demo caveat:** on the `FYRIRTÆKI` depreciation book, all `G/L Integration - {Type}` flags default to `true`, so the only FA posting type that succeeds in the FA journal is one whose flag is `false`. To exercise FA Journal against CRONUS, temporarily flip the appropriate flag to `false`.
- **Recommendation for G/L-integrating types:** use the general journal route — `Finance.GeneralJournal.PreviewPost` with `Account Type = Fixed Asset` and `FA Posting Type = {Acquisition Cost | Depreciation | Disposal}`.

---

### 7.5c ITEM JOURNAL OPERATIONS

**Identification:** Same three modes as general journals (pipe-form, SystemId, JSON `{templateName, batchName}` with JSON precedence).

**Workflow:** `Inventory.ItemJournal.SetupNewLine` → `Data.Records.Set` → `Inventory.ItemJournal.Check` → `Inventory.ItemJournal.Post` (or `Inventory.ItemJournal.PreviewPost` for a dry run).

#### `Inventory.ItemJournal.SetupNewLine`

```json
{ "specversion": "1.0", "type": "Inventory.ItemJournal.SetupNewLine", "source": "MyApp", "subject": "ITEM|DEFAULT" }
```

Returns the new Item Journal Line with `primaryKey { JournalTemplateName, JournalBatchName, LineNo_ }`. Optional: `fieldNumbers`, `noOfLines`, `clearExistingLines`.

#### `Inventory.ItemJournal.Check`

```json
{ "specversion": "1.0", "type": "Inventory.ItemJournal.Check", "source": "MyApp", "subject": "ITEM|DEFAULT" }
```

Response: `status`, `validationResult`, `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalQuantity`, `totalAmount`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Inventory.ItemJournal.Post`

Posts via BC `Item Jnl.-Post Batch` (isolated). Response (success): + `linesPosted`, `postingDate`, `itemRegisterNo`, `itemRegisterId`, `fromEntryNo`, `toEntryNo`.

#### `Inventory.ItemJournal.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). Same identification as `Post`.

Drives BC `Item Jnl.-Post` headlessly via `Gen. Jnl.-Post Preview.SetContext + Run()` and rolls back. Tables most commonly captured: `Item Ledger Entry` (32), `Value Entry` (5802), and for runs that produce G/L impact also `G/L Entry` (17) and `VAT Entry` (254).

```json
{ "specversion": "1.0", "type": "Inventory.ItemJournal.PreviewPost", "source": "MyApp", "subject": "ITEM|DEFAULT" }
```

Response: same envelope as the other PreviewPost types (`rollback`, `summary`, `totals`, `preview[]` with per-row `id` + `primaryKey` + `fields` + `tableCaption`). `predictedDocumentNos` may contain `"***"` when BC masks an unallocated number-series value.

**Operational notes:**
- **Prefer inserting lines through the BC UI / `Insert(true)` when possible** — AL `OnValidate` triggers populate downstream fields (posting groups, location, costing method) automatically. When lines are inserted via OData/MCP `set_records`, every field BC needs to post must be supplied; `set_records` does **not** fire `OnValidate`.
- Preview rolls back ledger entries but does not roll back side effects on locks (e.g. batch description).

---

### 7.5c.1 TRANSFER ORDER OPERATIONS

Transfer orders use the `Transfer Header` (table 5740) and `Transfer Line` (table 5741) tables.

**Identification (for actions on existing orders):** `subject` field — GUID → SystemId, plain text → Transfer Header `No.`. `data` JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

**Workflow:** `Inventory.TransferOrder.Create` → `Data.Records.Set` (Transfer Line) → `Inventory.TransferOrder.Release` → `Inventory.TransferOrder.Post` (Ship, then Receive for non-direct).

#### `Inventory.TransferOrder.Create`

Creates a Transfer Header. Required: `transferFromCode`, `transferToCode`. Required when `directTransfer = false`: `inTransitCode`. Optional: `directTransfer`, `postingDate` (defaults to WORKDATE), `shipmentDate`, `receiptDate`, `externalDocumentNo`.

```json
{ "specversion": "1.0", "type": "Inventory.TransferOrder.Create", "source": "MyApp",
  "data": { "transferFromCode": "BLUE", "transferToCode": "RED", "inTransitCode": "OUT. LOG." } }
```

Response: `status`, `documentNo`, `systemId`, `transferFromCode`, `transferToCode`, `inTransitCode`, `directTransfer`, `postingDate`, `shipmentDate`, `receiptDate`, `externalDocumentNo`, `statusAfter` (= `"Open"`).

#### `Inventory.TransferOrder.Release`

Calls codeunit 5708 `Release Transfer Document`. Response: `status`, `documentNo`, `transferFromCode`, `transferToCode`, `directTransfer`, `statusBefore`, `statusAfter`. Already-released orders return Success with both = `"Released"`.

#### `Inventory.TransferOrder.Reopen`

Calls codeunit 5708 `Release Transfer Document`.Reopen. Same response shape as `Release` but with status transition Released → Open. Already-open orders return Success with both = `"Open"`.

#### `Inventory.TransferOrder.Post`

Calls codeunit 5706 `TransferOrder-Post (Yes/No)`. Request: `postingType` = `"Ship"` or `"Receive"` (case-insensitive). Required for non-direct transfers; ignored for direct transfers (BC's Inventory Setup `Direct Transfer Posting` decides Receipt+Shipment vs. single Direct Transfer).

Response: `status`, `documentNo`, `postingType`, `directTransfer`, `postedShipmentNo`, `postedReceiptNo`, `postingDate`. Posted numbers are populated by diffing `Last Shipment No.` / `Last Receipt No.` on the Transfer Header before and after posting.

#### `Inventory.TransferOrder.PreviewPost`

Simulates posting via `Gen. Jnl.-Post Preview` and rolls back. Same request fields as `Post`. Response:

- `preview[]` — one element per captured BC table, each with `rows[]`.
- `predictedNumbers` — next document number(s) BC would assign: `postedShipmentNo` (non-direct Ship), `postedReceiptNo` (non-direct Receive), or `postedDirectTransferNo` (direct).
- `totals` — `balanced`, `totalDebitLCY`, `totalCreditLCY`.

#### `Inventory.TransferOrder.Statistics`

Mirrors Page 5755 `Transfer Statistics`. Read-only. Response includes header fields plus `totals { lineCount, quantity, parcels, netWeight, grossWeight, volume }`. Derived lines (`Derived From Line No. <> 0`) are excluded.

---

### 7.5c.2 ASSEMBLY ORDER OPERATIONS

Assembly orders use the `Assembly Header` (table 900) and `Assembly Line` (table 901) tables. Document Type is always `Order`.

**Identification (for actions on existing orders):** `subject` field — GUID → SystemId, plain text → Assembly Header `No.`. `data` JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`. The lookup is constrained to Document Type = Order via the helper `Argument.FindAssemblyHeader(...)` on the message argument table.

**Workflow:** `Inventory.AssemblyOrder.Create` (refreshes BOM by default) → optional `Data.Records.Set` on Assembly Line → optional `Inventory.AssemblyOrder.RefreshLines` after header field changes → `Inventory.AssemblyOrder.Release` → `Inventory.AssemblyOrder.Post`.

#### `Inventory.AssemblyOrder.Create`

Creates an Assembly Header (Document Type = Order). Required: `itemNo`, `quantity` (> 0). Optional: `variantCode`, `locationCode`, `binCode`, `unitOfMeasureCode`, `description`, `postingDate` (defaults to WORKDATE), `dueDate`, `startingDate`, `endingDate`, `quantityToAssemble`, `refreshLines` (default `true`).

Response: `status`, `documentNo`, `systemId`, `itemNo`, `variantCode`, `description`, `locationCode`, `binCode`, `unitOfMeasureCode`, `quantity`, `quantityToAssemble`, `postingDate`, `dueDate`, `startingDate`, `endingDate`, `statusAfter` (= `"Open"`), `lineCount`.

#### `Inventory.AssemblyOrder.RefreshLines`

Refreshes BOM component lines on an existing assembly order. Use this after editing `Item No.`, `Quantity`, `Variant Code`, `Location Code`, or `Unit of Measure Code` on the header. Response: `status`, `documentNo`, `linesBefore`, `linesAfter`, `statusAfter`. Errors if the header is Released.

**Cloud-safe implementation:** `RefreshBOM` is `[Scope('OnPrem')]` in BC27. The implementation calls `AssemblyHeader.Validate("Item No.", AssemblyHeader."Item No.")` which triggers the same BOM-refresh path via the table's `OnValidate("Item No.")` trigger.

#### `Inventory.AssemblyOrder.Release`

Calls codeunit 414 `Release Assembly Document`. Response: `status`, `documentNo`, `itemNo`, `statusBefore`, `statusAfter`. Already-released orders return Success with both = `"Released"`.

#### `Inventory.AssemblyOrder.Reopen`

Calls codeunit 414 `Release Assembly Document`.Reopen via an isolated process codeunit (`Asm. Order Reopen Process ori`, `Codeunit.Run` pattern) so BC errors return as a structured Error response. Same response shape as `Release` with Released → Open. Already-open orders return Success with both = `"Open"`.

#### `Inventory.AssemblyOrder.Post`

Calls codeunit 900 `Assembly-Post`. Request: optional `postingDate` overrides the header value.

Response: `status`, `documentNo`, `postedDocumentNo`, `postedSystemId`, `postedQuantity`, `assembleToOrder`, `postingDate`. `assembleToOrder` is `true` when the source is a sales order (Assemble-to-Order); in that case the source sales line is updated. `postedSystemId` is the SystemId of the resulting `Posted Assembly Header` (table 910).

#### `Inventory.AssemblyOrder.PreviewPost`

Simulates posting via `Gen. Jnl.-Post Preview` and rolls back. Same request fields as `Post`. Response:

- `preview[]` — one element per captured BC table (Item Ledger, Value Entry, Capacity Ledger, G/L Entry), each with `rows[]`.
- `predictedNumbers` — `postedDocumentNo` (the next Posted Assembly Order No. BC would assign).
- `totals` — `balanced`, `totalDebitLCY`, `totalCreditLCY`.

#### `Inventory.AssemblyOrder.Statistics`

Mirrors Page 920 `Assembly Order Statistics`. Read-only. Response includes header fields plus a `cost` object: `expectedMaterialCost`, `expectedResourceCost`, `expectedResourceOverheadCost`, `expectedAssemblyOverheadCost`, `expectedTotalCost`, and the matching `actual*` fields. Expected costs are summed from `Cost Amount` on assembly lines; actual costs are computed via `CalcActualCosts` from Item Ledger / Capacity Ledger entries.

---

### 7.5c.3 WAREHOUSE SHIPMENT OPERATIONS

**Subject identification:** Warehouse Shipment `No.` or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `shipmentNo`, `no` (SystemId/GUID variants resolve first).

**Posting gate:** `Warehouse.Shipment.Post` is gated by `Warehouse Posting ori` always and by `G/L Posting ori` when `invoice = true`. `Warehouse.Shipment.Create` is not gated (creating a shipment is not a posting operation).

#### `Warehouse.Shipment.Create`

Creates one `Warehouse Shipment Header` per supplied source via BC codeunit 5752 `Get Source Doc. Outbound`. Supported sources: `SalesOrder`, `TransferOrder` (outbound side). BC does **not** merge multiple sources into one shipment automatically — each source produces its own header.

Request:

```json
{
  "sourceDocuments": [
    { "sourceType": "SalesOrder",     "documentNo": "SO-0001" },
    { "sourceType": "TransferOrder",  "documentNo": "TO-0007" }
  ],
  "locationCode":   "BLUE",      // optional; if set, every source must match
  "assignedUserId": "PICKER01",  // optional; applied to each created header after creation
  "postingDate":    "2025-11-15" // optional; applied to each created header after creation
}
```

Response:

```json
{
  "status": "Success",
  "noOfShipments": 1,
  "shipments": [
    {
      "recordSystemId":   "<guid>",
      "no":               "WS-0001",
      "locationCode":     "BLUE",
      "assignedUserId":   "PICKER01",
      "sourceType":       "SalesOrder",
      "sourceDocumentNo": "SO-0001",
      "linesCreated":     2
    }
  ]
}
```

Errors: no sources supplied; unsupported `sourceType`; source document is not `Released`; source location does not have `Require Shipment` = true; no lines were available to ship (already on an open shipment or already being picked); `Location Code` field is write-restricted by `Field Access ori`.

#### `Warehouse.Shipment.Post`

Posts the shipment via BC codeunit 5763 `Whse.-Post Shipment`.

Request:

```json
{ "shipmentNo": "WS-0001", "invoice": true }
```

`invoice` defaults to `false`. When `true`, BC also invoices the underlying source documents (for those source types that support it, e.g. Sales Order).

Response:

```json
{
  "status": "Success",
  "shipmentNo": "WS-0001",
  "invoice": true,
  "postedWhseShipmentNo": "PWS-0001",
  "postedWhseShipmentSystemId": "<guid>",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Sales Shipment",
      "postedSourceNo":       "S-SHP-0001",
      "sourceDocument":       "Sales Order",
      "sourceNo":             "SO-0001"
    }
  ]
}
```

`postedDocuments` is derived from `Posted Whse. Shipment Line` (filtered by the posted shipment `No.`) and de-duplicated by `(postedSourceDocument, postedSourceNo)`. This generalizes across source types (sales, transfer, etc.).

Errors: missing `Warehouse Posting ori` (or `G/L Posting ori` when `invoice = true`); shipment has no lines; any error raised by `Whse.-Post Shipment` (e.g. `Qty. to Ship` = 0).

#### `Warehouse.Pick.Create`

Creates a Warehouse Pick (`Warehouse Activity Header.Type = Pick`) from a Warehouse Shipment. Wraps BC report 7318 `Whse.-Shipment - Create Pick`. The report call is isolated in codeunit 10078140 `Whse Pick Create Process ori` (`TableNo = "Warehouse Shipment Header"`) so report-time errors surface as Error responses without aborting the outer message-task transaction. Not a posting action — no posting gate.

**Subject identification:** Warehouse Shipment `No.` or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `whseShipmentNo`, `shipmentNo`, `no` (SystemId/GUID variants resolve first).

**Prerequisites:** the shipment's `Location Code` must have `Require Pick = true`; the shipment must have at least one line; available stock must exist for BC to build pick lines.

Request:

```json
{
  "whseShipmentNo": "WS-0001",
  "assignedUserId": "PICKER01", // optional; applied to created pick after creation
  "sortingMethod":  "Bin Ranking" // optional; one of enum "Whse. Activity Sorting Method" names (case-insensitive). On BC 27 the valid names are: None, Item, Document, Shelf or Bin, Due Date, Ship-To, Bin Ranking, Action Type. Error response lists the authoritative set for your build. When omitted, response returns sortingMethod = "None".
}
```

Response:

```json
{
  "status": "Success",
  "whseShipmentNo":   "WS-0001",
  "pickNo":           "WPK-0001",
  "pickSystemId":     "<guid>",
  "locationCode":     "WHITE",
  "assignedUserId":   "PICKER01",
  "sortingMethod":    "Bin Ranking",
  "totalPickLines":   4,
  "totalQtyToHandle": 12,
  "message":          "Warehouse Pick WPK-0001 created from Shipment WS-0001 with 4 lines."
}
```

**Field restrictions:** `assignedUserId` and `sortingMethod` are gated by `Field Access ori.IsFieldWriteRestricted` on `Warehouse Activity Header."Assigned User ID"` and `"Sorting Method"` respectively. Supplying a restricted value returns an Error response (the pick is already created on disk at that point — rerun without the restricted parameter or unrestrict the field).

**Unsupported in this API version:** `setBreakbulkFilter = true` and `doNotFillQtyToHandle = true`. Sending either returns an Error response (avoids silent option-loss). The BC defaults (`false`) are honoured.

Errors: missing identifier; shipment does not exist; shipment has no lines; invalid `sortingMethod` (error lists valid names); field-restriction; unsupported option flag; no pick created (nothing to pick, pick already exists, or location does not require a pick); any error raised by BC report 7318.

#### `Warehouse.Pick.Register`

Registers a Warehouse Pick via BC codeunit 7307 `Whse.-Activity-Register` (invoked through `Codeunit.Run` so errors are caught). After registration the source `Warehouse Shipment Line` rows receive `Qty. Picked` / `Qty. to Ship`, the pick header moves to history as `Registered Whse. Activity Hdr.`, and the originating shipment becomes eligible for `Warehouse.Shipment.Post`.

**Posting gate:** `Warehouse Posting ori` (always).

**Subject identification:** Warehouse Pick `No.` (Type = Pick) or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `pickNo`, `no` (SystemId/GUID variants resolve first).

**Pre-condition:** lines must have `Qty. to Handle > 0`. `Warehouse.Pick.Create` populates this on every line (BC report default). To register a partial pick, first call `Data.Records.Set` on `Warehouse Activity Line` to set per-line `Qty. to Handle`.

Request:

```json
{ "pickNo": "WPK-0001" }
```

Response:

```json
{
  "status": "Success",
  "pickNo":              "WPK-0001",
  "linesRegistered":     4,
  "totalQtyRegistered":  12,
  "shipmentNo":          "WS-0001",
  "shipmentSystemId":    "<guid>",
  "registeredPickNo":    "RWPK-0001",
  "registeredPickSystemId": "<guid>",
  "shipmentLines": [
    {
      "shipmentNo":     "WS-0001",
      "lineNo":         10000,
      "sourceDocument": "Sales Order",
      "sourceNo":       "SO-0001",
      "sourceLineNo":   10000,
      "itemNo":         "1896-S",
      "qty":            2,
      "qtyPicked":      2,
      "qtyToShip":      2,
      "qtyOutstanding": 2
    }
  ],
  "message": "Warehouse Pick WPK-0001 (4 lines) registered against Warehouse Shipment WS-0001."
}
```

`qtyOutstanding` mirrors `Warehouse Shipment Line."Qty. Outstanding"` (= `Quantity - Qty. Shipped`); pick registration does not ship, so it stays equal to line `Quantity` until `Warehouse.Shipment.Post` runs.

After a successful register the source `Warehouse Activity Header` row is deleted (moved to `Registered Whse. Activity Hdr.`). A second `Warehouse.Pick.Register` against the same `pickNo` therefore returns `Warehouse Pick {n} does not exist.` — that is the success indicator, not a failure. Look the registered pick up via `Data.Records.Get` on table `Registered Whse. Activity Hdr.` filtered by `Whse. Activity No.`.

`shipmentLines` is omitted (empty array) when the pick was not created from a Warehouse Shipment (e.g. inventory pick). `registeredPickNo` is resolved from `Registered Whse. Activity Hdr.` filtered by the original `Whse. Activity No.`.

Errors: missing identifier; pick does not exist or is not Type = Pick; pick has no lines; `Nothing to register.` (all lines have `Qty. to Handle = 0`); missing `Warehouse Posting ori`; any error raised by `Whse.-Activity-Register`.

**Workflow chain:** `Sales.Document.Release` → `Warehouse.Shipment.Create` → `Warehouse.Pick.Create` → `Warehouse.Pick.Register` → `Warehouse.Shipment.Post`.

#### `Warehouse.Putaway.Create`

Ensures a Warehouse Put-away (`Warehouse Activity Header.Type = Put-away`) exists for a **Posted** Whse. Receipt and returns it. Wraps BC report 7305 `Whse.-Source - Create Document` via `SetPostedWhseReceiptLine` (with `Quantity > 0` and `Status <> Completely Put Away` filters — mirroring `PostedWhseReceiptLine.CreatePutAwayDoc` in BC base app). Report call is isolated in codeunit 10078143 `Whse Putaway Create Proc. ori` (`TableNo = "Posted Whse. Receipt Header"`) so report-time errors surface as Error responses. Not a posting action — no posting gate.

**Idempotent / auto-create behaviour (read this first):** whether posting the receipt already created the put-away is governed by base app codeunit 5760 `Whse.-Post Receipt`: `ShouldCreatePutAway := "Require Put-away" AND NOT "Use Put-away Worksheet"`. On a standard `Require Put-away` location (`Use Put-away Worksheet = false` — the BC default, e.g. demo locations GULUR/HVÍTUR) posting **auto-creates** the put-away; report 7305 then has nothing left and raises `There is nothing to handle.` The implementation detects the already-existing put-away and returns it as `Success` with `alreadyExisted = true` (verified live). Only on a `Use Put-away Worksheet = true` location does this message type create the put-away itself (`alreadyExisted = false`). A repeat call against an unregistered put-away likewise returns the same one — safe to retry.

**Subject identification:** Posted Whse. Receipt `No.` or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `postedWhseReceiptNo`, `receiptNo`, `no` (SystemId/GUID variants resolve first).

**Prerequisites:** the receipt's `Location Code` must have `Require Put-away = true`; at least one Posted Whse. Receipt Line must have `Quantity > 0` and `Status <> Completely Put Away`. The Warehouse Receipt must already be posted (call `Warehouse.Receipt.Post` first).

Request:

```json
{
  "postedWhseReceiptNo": "PWR000123",
  "assignedUserId":      "ADMIN",         // optional; applied after creation
  "sortingMethod":       "Bin Ranking"    // optional; same enum + naming as Warehouse.Pick.Create
}
```

Response (verified live, BC 27 / CRONUS IS, worksheet location `CEPUT`, 5 × item `1896-S`):

```json
{
  "status": "Success",
  "postedWhseReceiptNo":       "R_000030",
  "postedWhseReceiptSystemId": "<guid>",
  "putawayNo":                 "PU000025",
  "putawaySystemId":           "<guid>",
  "locationCode":              "CEPUT",
  "assignedUserId":            "",
  "sortingMethod":             "None",
  "alreadyExisted":            false,        // true when posting (or a prior call) already created it
  "totalPutawayLines":         1,            // 1 per source line on non-bin; Take+Place pairs (≈ ×2) on bin/directed locations
  "totalQtyToHandle":          5,
  "message": "Warehouse Put-away PU000025 created from Posted Receipt R_000030 with 1 lines."
}
```

**Field restrictions:** same as `Warehouse.Pick.Create` — `assignedUserId` and `sortingMethod` are gated by `Field Access ori.IsFieldWriteRestricted` on `Warehouse Activity Header."Assigned User ID"` and `"Sorting Method"`.

**Unsupported in this API version:** `setBreakbulkFilter = true` and `doNotFillQtyToHandle = true`. Sending either returns an Error response.

Errors: missing identifier; receipt does not exist; receipt has no lines to put away (every line `Completely Put Away` or `Quantity = 0`); invalid `sortingMethod`; field-restriction; unsupported option flag; `No Warehouse Put-away was created for ...` (report 7305 ran but produced no header AND none pre-existed — e.g. location does not actually require put-away, or cross-dock consumed the lines); any error raised by BC report 7305 (e.g. `No available bin ...` on directed put-away locations without a bin policy). Note: `There is nothing to handle.` (report 7305 when a put-away already exists) is **not** surfaced — it is converted to a `Success` with `alreadyExisted = true`.

#### `Warehouse.Putaway.Register`

Registers a Warehouse Put-away via BC codeunit 7307 `Whse.-Activity-Register` (same codeunit as Pick). After registration the source `Posted Whse. Receipt Line` rows receive `Qty. Put Away` (transitioning Status to `Completely Put Away` on full registration), bin contents are updated (stock moves from receive bin to storage bin), and the put-away header moves to history as `Registered Whse. Activity Hdr.` (the source `Warehouse Activity Header` row is deleted).

**Posting gate:** `Warehouse Posting ori` (always).

**Subject identification:** Warehouse Put-away `No.` (Type = Put-away) or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `putawayNo`, `no` (SystemId/GUID variants resolve first).

**Pre-condition:** lines must have `Qty. to Handle > 0`. `Warehouse.Putaway.Create` populates this on every line. To register a partial put-away, first call `Data.Records.Set` on `Warehouse Activity Line` to set per-line `Qty. to Handle`. On `Bin Mandatory` / `Directed Put-away and Pick` locations put-away lines come in **Take + Place pairs** — update both rows to the same value or BC rejects with `Qty. to Handle (Base) in the line must be equal to ...`. On a **non-bin** location (`Bin Mandatory = false`) there is a single line per source line and no pairing (verified live: a 1-line receipt → 1 put-away line, `linesRegistered = 1`).

Request:

```json
{ "putawayNo": "WPA000456" }
```

Response:

```json
{
  "status": "Success",
  "putawayNo":                  "WPA000456",
  "linesRegistered":            6,
  "totalQtyRegistered":         25,
  "postedWhseReceiptNo":        "PWR000123",
  "postedWhseReceiptSystemId":  "<guid>",
  "registeredPutawayNo":        "RPA000456",
  "registeredPutawaySystemId":  "<guid>",
  "receiptLines": [
    {
      "postedWhseReceiptNo": "PWR000123",
      "lineNo":              10000,
      "sourceDocument":      "Purchase Order",
      "sourceNo":            "106001",
      "sourceLineNo":        10000,
      "itemNo":              "1896-S",
      "qty":                 5,
      "qtyPutAway":          5,
      "qtyOutstanding":      0,
      "status":              "Completely Put Away"
    }
  ],
  "message": "Warehouse Put-away WPA000456 (6 lines) registered against Posted Whse. Receipt PWR000123."
}
```

After a successful register the source `Warehouse Activity Header` row is deleted (moved to `Registered Whse. Activity Hdr.`). A second `Warehouse.Putaway.Register` against the same `putawayNo` therefore returns `Warehouse Put-away {n} does not exist.` — that is the success indicator, not a failure. Look the registered put-away up via `Data.Records.Get` on table `Registered Whse. Activity Hdr.` filtered by `Whse. Activity No.`.

`receiptLines` is omitted (empty array) when the put-away was not sourced from a Posted Whse. Receipt. `registeredPutawayNo` is resolved from `Registered Whse. Activity Hdr.` filtered by the original `Whse. Activity No.`.

Errors: missing identifier; put-away does not exist or is not Type = Put-away; put-away has no lines; `Nothing to register.` (all lines have `Qty. to Handle = 0`); missing `Warehouse Posting ori`; any error raised by `Whse.-Activity-Register` (e.g. Take/Place pair mismatch).

**Workflow chain:** `Purchase.Order.Release` (or `Sales.ReturnOrder.Release`) → `Warehouse.Receipt.Create` → `Warehouse.Receipt.Post` → `Warehouse.Putaway.Create` → `Warehouse.Putaway.Register`.

---

### 7.5c.4 WAREHOUSE RECEIPT OPERATIONS

**Subject identification:** Warehouse Receipt `No.` or `SystemId`. Also accepts request JSON keys `systemId`, `recordSystemId`, `id`, `receiptNo`, `no` (SystemId/GUID variants resolve first).

**Posting gate:** `Warehouse.Receipt.Post` is gated by `Warehouse Posting ori`. There is no invoice option and no G/L posting gate (warehouse receipts only post receipt of goods). `Warehouse.Receipt.Create` and `Warehouse.Receipt.Post.Preview` are not gated.

#### `Warehouse.Receipt.Create`

Creates one `Warehouse Receipt Header` per supplied source via BC codeunit 5751 `Get Source Doc. Inbound`. Supported sources: `PurchaseOrder`, `SalesReturnOrder`, `TransferOrder` (inbound side — `Transfer-to Code`).

Request:

```json
{
  "sourceDocuments": [
    { "sourceType": "PurchaseOrder",    "documentNo": "PO-0001" },
    { "sourceType": "TransferOrder",    "documentNo": "TO-0007" }
  ],
  "locationCode":   "BLUE",        // optional; if set, every source must receive here
  "assignedUserId": "RECEIVER01",  // optional; applied to each created header after creation
  "postingDate":    "2025-11-15"   // optional; applied to each created header after creation
}
```

Response:

```json
{
  "status": "Success",
  "noOfReceipts": 1,
  "receipts": [
    {
      "recordSystemId":   "<guid>",
      "no":               "WR-0001",
      "locationCode":     "BLUE",
      "assignedUserId":   "RECEIVER01",
      "sourceType":       "PurchaseOrder",
      "sourceDocumentNo": "PO-0001",
      "linesCreated":     2
    }
  ]
}
```

Location source per type: `PurchaseOrder` uses `Purchase Header."Location Code"`, `SalesReturnOrder` uses `Sales Header."Location Code"`, `TransferOrder` uses `Transfer Header."Transfer-to Code"`.

Errors: no sources supplied; unsupported `sourceType`; source document not `Released` (exact: `Purchase Order '<no>' is not Released. Release it before creating a Warehouse Receipt.`, or per-type equivalents); receiving location does not have `Require Receive` = true; bundled `No Warehouse Receipt was created for <sourceType> '<no>' — already on an open receipt, no lines remain to receive, or put-away already started.`; `Location Code` field write-restricted by `Field Access ori`.

**Discovery:** to enumerate receipt-required locations, call `Data.Records.Get` on `Location` (table 14) with `tableView = "WHERE(Require Receive=CONST(true))"`. Inspect `RequirePutaway`, `DirectedPutawayandPick`, and `BinMandatory` to anticipate downstream put-away or bin behaviour.

#### `Warehouse.Receipt.Post`

Posts the receipt via BC codeunit 5760 `Whse.-Post Receipt`. No invoice option. After a successful post BC deletes the `Warehouse Receipt Header`.

Request:

```json
{ "receiptNo": "WR-0001" }
```

Or via subject (GUID or text).

Response:

```json
{
  "status": "Success",
  "receiptNo": "RE000010",
  "postedWhseReceiptNo": "R_000005",
  "postedWhseReceiptSystemId": "<guid>",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Receipt",
      "postedSourceNo":       "107242",
      "sourceDocument":       "Purchase Order",
      "sourceNo":             "106031"
    }
  ]
}
```

Numbers are example only — `postedWhseReceiptNo` comes from the location's `Whse. Receipt Nos.` series, `postedSourceNo` from the source's posting series. `postedSourceDocument` is one of `Posted Receipt`, `Posted Return Shipment`, `Posted Transfer Receipt`. `postedDocuments` is derived from `Posted Whse. Receipt Line` and de-duplicated by `(postedSourceDocument, postedSourceNo)`.

Errors: missing identifier; missing `Warehouse Posting ori`; receipt has no lines; `The Warehouse Receipt Header does not exist.` (re-posting an already-posted identifier); any error raised by `Whse.-Post Receipt` (e.g. quantity to receive zero, item tracking incomplete, posting date locked, missing Bin Code on a directed put-away/pick location).

#### `Warehouse.Receipt.Post.Preview`

Simulates posting via `Whse.-Post Receipt (Yes/No)` (codeunit 5761) bound with `EventSubscriberInstance = Manual`. The wrapper's `OnRunPreview` subscriber sets preview mode on `Whse.-Post Receipt` (5760), and `Gen. Jnl.-Post Preview.SetContext + Run()` rolls back the transaction. Returns `predictedNumbers`, `totals`, `preview[]` per captured table.

Request: same identifier shape as `Warehouse.Receipt.Post`.

Captured tables (BC's preview whitelist): `Item Ledger Entry` (32) and `Value Entry` (5802) are always present (one per receipt line). `G/L Entry` (17) only appears if cost adjustment runs inline. `Posted Whse. Receipt Header` (7320) is **not** captured — `predictedNumbers.postedWhseReceiptNo` is always emitted but always empty.

Number redaction: BC's preview replaces assigned numbers with `***` to signal rollback. Affects `predictedNumbers.postedPurchaseReceiptNo` / `postedReturnReceiptNo` / `postedTransferReceiptNo` and `preview[].rows[].DocumentNo_` on Item Ledger / Value Entry rows.

Response:

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Warehouse Receipt RE000010 at GULUR preview produced 2 entries (balanced).",
  "receiptNo": "RE000010",
  "locationCode": "GULUR",
  "sourceDocuments": [
    { "sourceDocument": "Purchase Order", "sourceNo": "106031" }
  ],
  "lcyCode": "ISK",
  "predictedNumbers": {
    "postedWhseReceiptNo": "",
    "postedPurchaseReceiptNo": "***"
  },
  "totals": { "balanced": true, "totalDebitLCY": 0, "totalCreditLCY": 0 },
  "preview": [
    { "tableName": "Item Ledger Entry", "tableNo": 32, "rowCount": 1, "rows": [ /* DocumentNo_ = "***" */ ] },
    { "tableName": "Value Entry",       "tableNo": 5802, "rowCount": 1, "rows": [ /* DocumentNo_ = "***" */ ] }
  ]
}
```

`predictedNumbers` key set varies by source type: `postedPurchaseReceiptNo` (PO), `postedReturnReceiptNo` (sales return), `postedTransferReceiptNo` (inbound transfer) — each value is always `***` in preview. `postedWhseReceiptNo` is always emitted but always empty. Warehouse receipts have no direct G/L impact — `balanced` is `true` with zero totals. Use `Warehouse.Receipt.Post` to obtain real numbers.

Errors: missing identifier; receipt has no lines; any error raised by `Whse.-Post Receipt` (same conditions as the real post).

#### `Warehouse.Shipment.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). Same identification as `Post`.

Drives BC `Whse.-Post Shipment (Yes/No)` headlessly via `Gen. Jnl.-Post Preview.SetContext + Run()` and rolls back. Tables most commonly captured: `Item Ledger Entry` (32), `Value Entry` (5802), `Posted Whse. Shipment Header/Line` (7322/7323), `Sales Shipment Header/Line` (110/111), and for the invoice side `Sales Invoice Header/Line` (112/113), `G/L Entry` (17), `VAT Entry` (254), `Cust. Ledger Entry` (21).

**The invoice flag is forced.** The BC `Whse.-Post Shipment (Yes/No)` preview subscriber forces `Invoice = true`. The response `invoice` field is therefore **always `true`** — to preview shipment-only behaviour, drive the source document's preview type (e.g. `Sales.Document.PreviewPost`) instead.

```json
{ "specversion": "1.0", "type": "Warehouse.Shipment.PreviewPost", "source": "MyApp", "subject": "WS-0001" }
```

Response uses the same envelope as other PreviewPost types. Notable:
- `shipmentNo` / `locationCode` identify the header.
- `invoice` is always `true`.
- `linesToPost` is the number of Warehouse Shipment Lines submitted to preview.
- `predictedNumbers` enumerates predicted `Document No.` values (e.g. the next sales invoice number). May contain `"***"`.

**Operational notes:**
- **WMS locations require a registered pick first.** On a location with `Require Pick = true` (e.g. CRONUS `WHITE` / `GULUR`), a freshly created Warehouse Shipment Line starts with `Qty. to Ship = 0`. A Warehouse Pick must be **created and registered** before preview will produce any output — pick registration is what writes `Qty. to Ship` back onto the line.
- **Locations with `Require Shipment = true` and `Require Pick = false`** behave like a direct shipment flow: `Qty. to Ship` is populated when the line is created, and preview runs immediately without a pick.
- The forced-invoice behaviour means `G/L Posting ori` would also be required for the equivalent live post, but preview does not enforce permission gates.

---

### 7.5d PROJECT JOURNAL OPERATIONS

**Identification:** Same three modes (pipe-form, SystemId, JSON `{templateName, batchName}` with JSON precedence). Targets BC Job Journal Lines (project = job in BC terminology).

**Workflow:** `Projects.ProjectJournal.SetupNewLine` → `Data.Records.Set` → `Projects.ProjectJournal.Check` → `Projects.ProjectJournal.Post`.

#### `Projects.ProjectJournal.SetupNewLine`

```json
{ "specversion": "1.0", "type": "Projects.ProjectJournal.SetupNewLine", "source": "MyApp", "subject": "PROJECT|DEFAULT" }
```

#### `Projects.ProjectJournal.Check`

Response includes: `status`, `validationResult`, `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalQuantity`, `totalLineAmount`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Projects.ProjectJournal.Post`

Posts via BC `Job Jnl.-Post Batch` (isolated). Response (success): + `linesPosted`, `postingDate`, `totalQuantity`, `totalLineAmount`, `jobRegisterNo`, `jobRegisterId`, `fromEntryNo`, `toEntryNo`.

#### `Projects.ProjectJournal.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). Same identification as `Post`.

Drives BC `Job Jnl.-Post` headlessly via `Gen. Jnl.-Post Preview.SetContext + Run()` and rolls back. Tables most commonly captured: `Job Ledger Entry` (169), and for lines that produce G/L impact also `G/L Entry` (17), `VAT Entry` (254), `Item Ledger Entry` (32), `Value Entry` (5802) (when Line Type is `Item`).

```json
{ "specversion": "1.0", "type": "Projects.ProjectJournal.PreviewPost", "source": "MyApp", "subject": "PROJECT|DEFAULT" }
```

Response uses the same envelope as other PreviewPost types. Notable:
- `DimensionSetID` is returned as an **array of `{DimensionCode, DimensionValueCode}` pairs**, not as an integer. Project journal entries typically capture every dimension on the line.
- `predictedDocumentNos` may contain `"***"` when BC masks an unallocated number.

**Operational notes:**
- **`Line Type` must not be blank.** BC requires a non-blank `Line Type` (`Schedule`, `Billable`, or `Both Schedule and Contract`). A new line created by `SetupNewLine` starts with blank `Line Type` — set it before previewing.
- Item lines additionally produce `Item Ledger Entry` / `Value Entry` rows.

---

### 7.5e RESOURCE JOURNAL OPERATIONS

**Identification:** Same three modes (pipe-form, SystemId, JSON `{templateName, batchName}` with JSON precedence).

**Workflow:** `Resources.ResourceJournal.SetupNewLine` → `Data.Records.Set` → `Resources.ResourceJournal.Check` → `Resources.ResourceJournal.Post`.

#### `Resources.ResourceJournal.SetupNewLine`

```json
{ "specversion": "1.0", "type": "Resources.ResourceJournal.SetupNewLine", "source": "MyApp", "subject": "RESOURCE|DEFAULT" }
```

#### `Resources.ResourceJournal.Check`

Response: `status`, `validationResult`, `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalQuantity`, `totalCost`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Resources.ResourceJournal.Post`

Posts via BC `Res. Jnl.-Post Batch` (isolated). Response (success): `status`, `templateName`, `batchName`, `batchDescription`, `linesPosted`, `postingDate`, `totalQuantity`, `totalCost`.

**Conditional register fields:** `resourceRegisterNo`, `resourceRegisterId`, `fromEntryNo`, `toEntryNo` are present **only when a Resource Register row is created** for the posting. Consumers must treat them as optional. (A Resource Register entry is not always created — depends on the BC posting outcome.)

---

### 7.6 CHANGELOG OPERATIONS

All three types use the BC Change Log Entry table (405). Authorization checks respect `Field Access ori` restrictions and the `ChangeLog Write Guard` setting in Bifrost Setup.

#### `ChangeLog.Field.History` — browse field change history

Direction: **Outbound**

Returns the current live field value (as a synthetic `entryNo=0` entry) followed by all Change Log Entry records for the field, newest first.

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.History",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"recordSystemId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"fieldNo\":2}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table — name or number |
| `recordSystemId` / `systemId` / `id` | Yes* | SystemId (GUID) of the record. May also be sent as GUID in the Bifrost `subject` field. |
| `fieldNo` / `fieldId` / `fieldName` | Yes | The field to retrieve history for |

*If missing from `data`, the Bifrost `subject` attribute is used as a GUID fallback.

Response:
```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldType": "Text",
  "history": [
    { "entryNo": 0, "dateAndTime": "2026-03-28T14:22:00.000Z", "typeOfChange": "Current", "oldValue": "", "newValue": "Contoso Ltd.", "userId": "ADMIN" },
    { "entryNo": 56789, "dateAndTime": "2026-03-10T09:00:00.000Z", "typeOfChange": "Modification", "oldValue": "Contoso Inc.", "newValue": "Contoso Ltd.", "userId": "ADMIN" }
  ],
  "totalCount": 2
}
```

History entry fields:

| Field | Description |
|---|---|
| `entryNo` | Change Log Entry No. `0` = current live value (synthetic — not a real entry). Use `entryNo > 0` with `ChangeLog.Field.Restore`. |
| `dateAndTime` | ISO 8601 timestamp. For `entryNo=0` this is `SystemModifiedAt`. |
| `typeOfChange` | `Current` (index 0), `Insertion`, `Modification`, or `Deletion` |
| `oldValue` | Value before the change. Empty for `entryNo=0`. |
| `newValue` | Value after the change. For `entryNo=0` this is the live field value. |
| `userId` | Who made the change. For `entryNo=0` resolved from `SystemModifiedBy` GUID. |

**Errors:** Table not found · `recordSystemId or a subject GUID is required` · `Field identifier required` · Field read-restricted · Record not found

---

#### `ChangeLog.Field.Restore` — write a previous value back to a live record

Direction: **Inbound (Write)**

Supports two modes. The `Old Value` from the resolved Change Log entry is written back using `Validate()` + `Modify(true)`.

**Mode 1 — by entry number:**
```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Restore",
  "source": "MyApp v1.0",
  "data": "{\"entryNo\":56789}"
}
```

**Mode 2 — by point-in-time:**
```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Restore",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"recordSystemId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"fieldNo\":2,\"restoreToDateTime\":\"2026-02-10T09:15:00Z\"}"
}
```

| Parameter | Mode | Required | Description |
|---|---|---|---|
| `entryNo` | 1 | Yes | Change Log Entry No. from `ChangeLog.Field.History` |
| `tableName` / `tableNumber` | 2 | Yes | Target table |
| `recordSystemId` | 2 | Yes | SystemId (GUID) of the record |
| `fieldNo` / `fieldId` / `fieldName` | 2 | Yes | Field to restore |
| `restoreToDateTime` | 2 | Yes | ISO 8601 — finds most recent Modification at or before this time |

Response:
```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "fieldName": "Name",
  "previousValue": "Contoso Ltd.",
  "restoredValue": "Contoso Inc.",
  "fromEntryNo": 56789,
  "entryDateTime": "2026-02-10T09:15:00.000Z"
}
```

**Safety guards:**
- Only `Modification` entries can be restored (Insertion/Deletion entries rejected)
- Target record must exist; field must be writable (not FlowField/FlowFilter)
- Field must not be write-restricted (Field Access ori)
- Table must not be restricted from writes (Bifrost Setup)
- Field must be allowed by the ChangeLog Write Guard
- Current value ≠ restore value (no-op returns error)

**Key errors:** `Change log entry not found` · `Only Modification entries can be restored` · `Record not found` · `Field is write-restricted` · `Field already has the value — nothing to restore` · `Field is not allowed by the change log write guard` · `Provide either entryNo or tableName + recordSystemId + fieldNo + restoreToDateTime`

---

#### `ChangeLog.Field.Enabled` — check if a field is tracked by Change Log

Direction: **Outbound**

Returns whether the BC Change Log feature is globally active and whether the specified field is covered by Change Log Setup for modification tracking.

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Enabled",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"fieldNo\":2}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table |
| `fieldNo` / `fieldId` / `fieldName` | Yes | Field to check |

Response:
```json
{
  "status": "Success",
  "changeLogEnabled": true,
  "changelogWriteGuardEnabled": true,
  "tableNo": 18,
  "tableName": "Customer",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldCovered": true,
  "fieldWriteGuardBypassed": false
}
```

| Field | Description |
|---|---|
| `changeLogEnabled` | Whether BC Change Log is activated globally |
| `changelogWriteGuardEnabled` | `false` = Open mode (no enforcement); `true` = Blocked or Via Force |
| `fieldCovered` | Whether the field is tracked in Change Log Setup for modification logging |
| `fieldWriteGuardBypassed` | `true` if this field has a Bypass entry in Field Access ori, allowing writes regardless of Change Log coverage |

**Errors:** Table not found · `Field identifier required` · `Field type is not supported for change log tracking`

---

#### `ChangeLog.Records.Delta` — distinct SystemIds of records changed in a time window

Direction: **Outbound**

Returns the distinct `SystemId`s of records in a table that were **Inserted** or **Modified** in the Change Log within a date/time range. Optionally narrows the search to specific fields. Deletions are not returned (use `Deleted.RecordIds.Get`). Designed as the source for incremental sync: get the changed ids, then fetch full payloads via `Data.Records.Get`.

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Records.Delta",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"tableName\":\"Customer\",\"fieldNumbers\":[2,3],\"startDateTime\":\"2026-03-01T00:00:00Z\",\"endDateTime\":\"2026-03-31T23:59:59Z\"}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Target table (falls back to `subject`) |
| `fieldNumbers` | No | Integer array of field numbers to restrict the search to. Empty array is rejected. Omit to include any tracked field. |
| `startDateTime` | No | Inclusive lower bound. Default `0DT`. |
| `endDateTime` | No | Inclusive upper bound. Default = message `Date & Time`. |

Response:
```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "fieldNumbers": [2, 3],
  "startDateTime": "2026-03-01T00:00:00.000Z",
  "endDateTime": "2026-03-31T23:59:59.000Z",
  "totalCount": 42,
  "systemIds": ["a1b2c3d4-...", "e5f6a7b8-..."]
}
```

**Errors:** Table not found · `fieldNumbers must contain at least one integer when supplied.`

---

#### ChangeLog Write Guard (`ChangeLog Write Guard` field in Bifrost Setup)

Controls which fields `Data.Records.Set` may write to. Evaluated per-field before every write.

| Mode | Caption | Behaviour |
|---|---|---|
| 0 | Open | All fields writable — same as pre-guard behaviour |
| 1 | Blocked | Only fields covered by Change Log Modification tracking may be written |
| 2 | Via force | Same as Blocked but bypassed when `"force": true` is in the request **and** the caller has the `Force Access ori` permission set |

The `force` flag is a top-level boolean in the `data` JSON:
```json
{ "data": [...], "force": true }
```

Check coverage first with `ChangeLog.Field.Enabled`; browse history with `ChangeLog.Field.History`; restore with `ChangeLog.Field.Restore`.

---

### 7.7 INCOMING DOCUMENT OPERATIONS

Five message types cover the full Incoming Document lifecycle: Create → (Attach) → Process → Get, plus SetDefault for re-ordering attachments.

| Type | Direction | Purpose |
|---|---|---|
| `Incoming.Document.Create` | Inbound | Create a new Incoming Document with a main attachment |
| `Incoming.Document.Attach` | Inbound | Add supplemental attachments to an existing Incoming Document |
| `Incoming.Document.Process` | Inbound | Process an Incoming Document to create a purchase invoice or journal line |
| `Incoming.Document.Get` | Outbound | Retrieve header fields and all attachments from an Incoming Document |
| `Incoming.Document.SetDefault` | Inbound | Set the default (main) attachment by re-ordering attachments |

All five types identify the target document via the **subject** field (Entry No. as text, or SystemId GUID). `Incoming.Document.Create` does not require a subject.

---

#### `Incoming.Document.Create` — create Incoming Document with main attachment

Direction: **Inbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Create",
  "source": "MyApp v1.0",
  "data": "{\"fileName\":\"invoice.pdf\",\"fileContent\":\"<base64>\"}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `fileName` | Yes | File name including extension |
| `fileContent` | Yes | Base64-encoded file content |

Response:
```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineNo": 10000,
  "description": "",
  "documentDate": "2026-04-01",
  "dueDate": "",
  "vendorNo": "",
  "vendorName": "",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": {},
  "error": []
}
```

Response includes the full Incoming Document header fields (same shape as `Incoming.Document.Get`). `lineNo` is the attachment line number.

---

#### `Incoming.Document.Attach` — add supplemental attachment

Direction: **Inbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Attach",
  "source": "MyApp v1.0",
  "subject": "1001",
  "data": "{\"fileName\":\"delivery-note.xml\",\"fileContent\":\"<base64>\"}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `fileName` | Yes | File name including extension |
| `fileContent` | Yes | Base64-encoded file content |

Response:
```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineNo": 20000,
  "description": "Purchase from Fabrikam",
  "documentDate": "2026-04-01",
  "dueDate": "2026-04-30",
  "vendorNo": "V10000",
  "vendorName": "Fabrikam Inc.",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": {},
  "error": []
}
```

Response includes the full Incoming Document header fields (same shape as `Incoming.Document.Get`). `lineNo` is the new attachment line number.

---

#### `Incoming.Document.Process` — process to purchase document

Direction: **Inbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Process",
  "source": "MyApp v1.0",
  "subject": "1001"
}
```

Response:
```json
{ "status": "Success", "record": { "tableNo": 38, "tableName": "Purchase Header", "tableCaption": "Purchase Header", "recordSystemId": "c3d4e5f6-a1b2-7890-abcd-ef1234567890" }, "entryNo": 1001, "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
```

`status` is `"Success"` when `Incoming Document.Status = Created` after processing, and a `record` object contains table metadata (`tableNo`, `tableName`, `tableCaption`, `recordSystemId`) for the **linked BC document** (e.g. Purchase Header) created from the Incoming Document. On failure, `status` is `"Error"` and an `error` array contains BC error message objects.

**Error message object fields:**

| Field | Type | Description |
|---|---|---|
| `id` | Integer | Error message ID |
| `message` | Text | Error message text |
| `type` | Text | Message type caption (e.g. `"Error"`, `"Warning"`) |
| `table` | Object | Source table — `{ "id": <tableNo>, "name": "<tableName>" }` |
| `field` | Object | Source field — `{ "id": <fieldNo>, "name": "<fieldName>" }` |
| `context` | Object | Context — `{ "tableNumber": <int>, "fieldNumber": <int>, "fieldName": "<text>" }` |
| `additionalInformation` | Text | Additional information from the error message |

The same `error` array schema is returned by `Incoming.Document.Get`, `Incoming.Document.Create`, and `Incoming.Document.Attach`.

The request body is not used — only `subject` is required.

---

#### `Incoming.Document.Get` — retrieve document with attachments

Direction: **Outbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Get",
  "source": "MyApp v1.0",
  "subject": "1001"
}
```

Response:
```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "description": "Purchase from Fabrikam",
  "documentDate": "2026-04-01",
  "dueDate": "2026-04-30",
  "vendorNo": "V10000",
  "vendorName": "Fabrikam Inc.",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": { "tableNo": 38, "tableName": "Purchase Header", "tableCaption": "Purchase Header", "recordSystemId": "c3d4e5f6-..." },
  "error": [],
  "mainAttachment": {
    "lineNo": 10000,
    "fileName": "invoice.pdf",
    "fileContent": "<base64-encoded content>"
  },
  "additionalAttachments": [
    {
      "lineNo": 20000,
      "fileName": "delivery-note.xml",
      "fileContent": "<base64-encoded content>"
    }
  ]
}
```

**Header fields:**

| Field | Type | Description |
|---|---|---|
| `record` | Object | Linked BC document metadata (`tableNo`, `tableName`, `tableCaption`, `recordSystemId`). Empty object when no document is linked |
| `error` | Array | BC error messages from the Incoming Document. Empty array when no errors |

**Attachment fields** (same shape for `mainAttachment` and each `additionalAttachments` entry):

| Field | Type | Description |
|---|---|---|
| `lineNo` | Integer | Attachment line number (10000, 20000, …) |
| `fileName` | Text | File name + extension (e.g. `invoice.pdf`) — BC `Name` + `"." ` + `"File Extension"` |
| `fileContent` | Text | Base64-encoded file content — caller must decode before use |

**Notes:**
- `mainAttachment` is **omitted** when the Incoming Document has no main attachment.
- `additionalAttachments` is always present but may be an empty array `[]`.
- `record` contains table metadata for the linked BC document (e.g. Purchase Header) when one exists.
- `error` contains BC error messages saved against the Incoming Document.
- Subject accepts Entry No. (integer as text) or SystemId GUID (with or without braces).

**Key errors:** `Incoming Document X not found.`

---

#### `Incoming.Document.SetDefault` — set default attachment

Direction: **Inbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.SetDefault",
  "source": "MyApp v1.0",
  "subject": "1001",
  "data": "{\"lineNo\": 20000}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `lineNo` | Yes | Line No. of the attachment to set as the default (main) attachment |

Response:
```json
{ "status": "Success", "entryNo": 1001, "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
```

Response includes the full Incoming Document header fields (same shape as `Incoming.Document.Create` / `Incoming.Document.Attach`).

**Notes:**
- Requires at least 2 attachments on the document.
- All attachments are deleted and re-inserted: specified `lineNo` becomes Line No. 10000 (`Main Attachment = true`), the rest follow at 20000, 30000, etc. in their original order.
- BLOB content is preserved during re-ordering.

**Key errors:** `lineNo is required.` · `Attachment with lineNo X not found.` · `At least 2 attachments are required to set a default.` · `Incoming Document X not found.`

---

### 7.8 APPROVAL OPERATIONS

| Type | Direction | Purpose |
|---|---|---|
| `Document.Approval.Get` | Inbound | Retrieve approval log entries with linked active and posted approval entries |
| `Document.Approval.Send` | Inbound | Create approval entries for a document with approver assignments and amount calculation |
| `Document.Approval.Approve` | Inbound | Approve one or more open approval entries with optional comment |
| `Document.Approval.Reject` | Inbound | Reject one or more open approval entries with optional comment |
| `Document.Approval.Me` | Outbound | Retrieve approval entries assigned to calling user with pagination and permission filtering |
| `Document.Approval.Delegate` | Inbound | Delegate one or more open approval entries to another user |
| `Document.Approval.Cancel` | Inbound | Cancel all open approval entries for a document and reopen it |

**Tables:**
- `Approval Log ori` (10077885) — stores approval workflow events. PK: `Entry No.` (AutoIncrement). Fields: `Table ID` (Integer), `Record ID to Approve` (RecordId), `Record SystemId to Approve` (Guid), `Approval Code` (Code[20]), `Request` (Blob), `Approval Type` (Enum "Approval Type ori").
- `Approval Type ori` (Enum 10077885) — values: `Send` (0), `Approve` (2), `Reject` (3), `Delegate` (4), `Cancel` (5).

#### `Document.Approval.Get` — retrieve approval log entries

```json
{
  "type": "Document.Approval.Get",
  "data": { "skip": 0, "take": 50, "tableView": "SORTING(Entry No.) WHERE(Table ID=CONST(36))" }
}
```

**Request parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| skip | Integer | No | Records to skip (default: 0) |
| take | Integer | No | Max records to return (default: 100) |
| tableView | Text | No | AL table view filter expression on Approval Log ori |

**Response shape:**

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-...",
      "lastModified": "2025-01-15T10:30:00Z",
      "approvalType": "Send",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "e5f6g7h8-...",
      "approvalCode": "CE00000000001",
      "request": { },
      "linkedApprovalEntries": [
        {
          "entryNo": 1, "sequenceNo": 1, "documentType": "Order",
          "documentNo": "S-ORD-1001", "status": "Open", "approverId": "ADMIN",
          "dueDate": "2025-02-01", "currency": "USD",
          "amount": "5000.00", "amountLCY": "5000.00",
          "comments": [],
          "lastModified": "2025-01-15T10:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [
        {
          "entryNo": 2, "sequenceNo": 1,
          "documentNo": "S-INV-1001", "status": "Approved", "approverId": "ADMIN",
          "dueDate": "2025-02-01", "currency": "USD",
          "amount": "5000.00", "amountLCY": "5000.00",
          "lastModified": "2025-01-15T10:30:00Z"
        }
      ]
    }
  ]
}
```

**Response fields (per result element):**

| Field | Type | Description |
|---|---|---|
| id | GUID | SystemId of the approval log entry (Format 4) |
| lastModified | DateTime | Last modified timestamp (Format 9) |
| approvalType | Text | Approval action type (enum name via Names/Ordinals) |
| tableId | Integer | Table ID of the record under approval |
| tableName | Text | Table name from AllObjWithCaption |
| tableCaption | Text | Localized table caption |
| recordSystemId | GUID | SystemId of the record under approval (Format 4) |
| approvalCode | Code[20] | Auto-generated workflow identifier (e.g. `CE00000000001`) |
| request | Object | Original request JSON stored with the approval entry |
| linkedApprovalEntries | Array | Active approval entries matching Table ID, Record ID, and Approval Code |
| linkedPostedApprovalEntries | Array | Posted (historical) approval entries matching Table ID, Record ID, and Approval Code |

**Linked entry fields** (shared by both arrays):

| Field | Type | Description |
|---|---|---|
| entryNo | Integer | Entry number |
| sequenceNo | Integer | Sequence within the approval workflow |
| documentType | Text | Document type enum name. **Active entries only** — not present in posted entries |
| documentNo | Text | Document number |
| status | Text | Approval status (e.g. `Open`, `Approved`, `Rejected`) |
| approverId | Text | Approver user ID |
| lastModified | DateTime | Last modification timestamp (Format 9) |
| dueDate | Date | Due date (Format 9) |
| currency | Code[10] | Currency code (falls back to GLSetup."LCY Code") |
| amount | Decimal | Amount in document currency (Format 9) |
| amountLCY | Decimal | Amount in local currency (Format 9) |
| comments | Array | String array of approval comments linked to the entry |

**Permission filtering:** Each record is checked against the user's read permission on the related table (Table ID) and record-level permission filter. `noOfRecords` returns the total count before permission filtering. Linked entries are only populated if the user has ReadPermission on the respective Approval Entry / Posted Approval Entry tables.

**Key errors:** Unsupported message version → `AssertVersion1()` error. Invalid `tableView` → standard BC `SetView()` error.

#### `Document.Approval.Send` — create approval entries for a document

```json
{
  "type": "Document.Approval.Send",
  "data": {
    "tableId": 36,
    "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "approvals": [
      { "approverUserId": "JOHN", "sequenceNo": 1, "dueDate": "2025-01-15" },
      { "approverUserId": "JANE", "sequenceNo": 2, "lineNumbers": [10000, 20000] }
    ]
  }
}
```

**Request parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| tableId / tableNumber / tableName | Integer or Text | Yes | Identifies the table containing the document (supported: 36, 38, 130) |
| recordSystemId | GUID | Yes | SystemId of the document record |
| approvals | Array | Yes | Array of approval assignment objects |

**Approval array element fields:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| approverUserId | Text | Yes | — | User ID of the approver (must exist in User Setup ori) |
| sequenceNo | Integer | No | 1 | Sequence number for approval ordering |
| dueDate | Date | No | Document due date | Override approval due date |
| lineNumbers | Integer[] | No | All lines | Document line numbers to include in amount calculation. NOT supported for Incoming Documents |

**Amount calculation:**
- **Sales Header / Purchase Header**: Uses BC's `SumSalesLines` / `SumPurchaseLines` to calculate `Amount Including VAT`. If `lineNumbers` is specified, only those lines are included. Invoice discount is recalculated if setup requires.
- **Incoming Document**: Uses `Amount Incl. VAT` directly. `lineNumbers` not supported (error). Foreign currency → LCY conversion via current exchange rate.

**Side effects:**
1. Creates one `Approval Log ori` entry (Approval Type = `Send`)
2. Creates one `Approval Entry` per element in `approvals` array
3. Sets document status to Pending Approval via `ApprovalsMgmt.SetStatusToPendingApproval()`
4. Stores original request JSON in Approval Log `Request` blob

**Response shape:** Same format as `Document.Approval.Get` — returns the created log entry with `linkedApprovalEntries` and `linkedPostedApprovalEntries` arrays.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2025-01-10T12:00:00Z",
      "approvalType": "Send",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "document-system-id",
      "approvalCode": "CE00000000001",
      "request": { },
      "linkedApprovalEntries": [ { "entryNo": 1, "sequenceNo": 1, "documentType": "Order", "documentNo": "S-ORD-001", "status": "Open", "approverId": "JOHN", "dueDate": "2025-01-15", "currency": "ISK", "amount": "50000", "amountLCY": "50000", "comments": [], "lastModified": "2025-01-10T12:00:00Z" } ],
      "linkedPostedApprovalEntries": []
    }
  ]
}
```

**Key errors:** Unsupported table → error listing 36/38/130. Record not found → error with SystemId + table ID. Missing `approvals` array → error. Missing `approverUserId` → error with element index. `lineNumbers` on Incoming Document → error. Document already Released/Pending Prepayment → status validation error. Process codeunit failure → returns `{ "status": "Error", "error": "...", "callstack": "..." }`.

#### `Document.Approval.Approve` — approve open approval entries

```json
{
  "type": "Document.Approval.Approve",
  "subject": "5",
  "data": {
    "comment": "Approved per budget review."
  }
}
```

**Request parameters:**

Entry resolution priority: `entries` array > `entryNo`/`systemId` in request JSON > `subject` field.

| Field | Type | Required | Description |
|---|---|---|---|
| subject | Text | No | Entry number (integer) or SystemId (GUID) of a single entry |
| entries | Array | No | Array of entry objects for batch processing |
| entries[].entryNo | Integer | No | Approval entry number |
| entries[].systemId | String (GUID) | No | Approval entry SystemId |
| entryNo | Integer | No | Entry number in request JSON |
| systemId | String (GUID) | No | SystemId in request JSON |
| comment | String | No | Optional comment stored as Approval Comment Line(s) |

**Behavior:**
- Calls `ApprovalsMgmt.ApproveApprovalRequests()` for each resolved entry
- Entry must have Status = Open; otherwise error
- If approval completes the chain, document is automatically released via BC standard logic
- Comment (if provided) is stored as Approval Comment Lines; long text auto-split

**Response shape:**

Each result element uses the approval log wrapper (same as Get/Send) with action-specific fields added.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2025-01-10T14:00:00Z",
      "approvalType": "Approve",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-...",
      "approvalCode": "CE00000001",
      "request": { },
      "linkedApprovalEntries": [
        {
          "entryNo": 5, "sequenceNo": 1, "documentType": "Order",
          "documentNo": "SO-001", "status": "Approved", "approverId": "ADMIN",
          "dueDate": "2025-01-15", "currency": "ISK",
          "amount": "150000", "amountLCY": "150000",
          "comments": [],
          "lastModified": "2025-01-10T14:00:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "entryNo": 5,
      "statusBefore": "Open"
    }
  ]
}
```

**Log wrapper fields:** Same as `Document.Approval.Get` (id, lastModified, approvalType, tableId, tableName, tableCaption, recordSystemId, approvalCode, request, linkedApprovalEntries, linkedPostedApprovalEntries). See Get section for field definitions.

**Action-specific fields (per result element):**

| Field | Type | Description |
|---|---|---|
| entryNo | Integer | Approval Entry No. that was approved |
| statusBefore | Text | Status before action (always `"Open"`) |

**Key errors:** No entries resolved → error. Entry not found → error with entry number. Entry not open → error with current status. Unauthorized caller → BC authorization error with callstack. Process codeunit failure → `{ "status": "Error", "error": "...", "callstack": "..." }`.

#### `Document.Approval.Reject` — reject open approval entries

```json
{
  "type": "Document.Approval.Reject",
  "data": {
    "entries": [{"entryNo": 5}],
    "comment": "Amount exceeds budget limit."
  }
}
```

**Request parameters:**

Same entry resolution and parameters as `Document.Approval.Approve` (see above).

**Behavior:**
- Calls `ApprovalsMgmt.RejectApprovalRequests()` for each resolved entry
- Entry must have Status = Open; otherwise error
- Document status may revert based on BC standard rejection logic
- Comment (if provided) is stored as Approval Comment Lines

**Response shape:** Same log-wrapped structure as Approve, with `approvalType` = `"Reject"` and linked entry `status` = `"Rejected"` after action.

**Key errors:** Same as Approve — no entries resolved, entry not found, entry not open, unauthorized caller, process codeunit failure.

#### `Document.Approval.Me` — retrieve entries assigned to calling user

```json
{
  "type": "Document.Approval.Me",
  "data": { "skip": 0, "take": 50 }
}
```

**Request parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| skip | Integer | No | Records to skip (default: 0) |
| take | Integer | No | Max records to return (0 = all) |

**Behavior:**
- Filters `Approval Entry` to `Approver ID = UserId()` (always enforced, cannot be overridden)
- Applies `SetPermissionFilter()` for record-level security
- Only entries where caller has read permission on the related source record are included
- Records without accessible source are silently excluded
- Falls back to GLSetup."LCY Code" when currency is blank

**Response shape:**

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "entryNo": 1,
      "sequenceNo": 1,
      "documentType": "Invoice",
      "documentNo": "SI-001",
      "status": "Open",
      "approverId": "ADMIN",
      "dueDate": "2025-01-31",
      "currency": "ISK",
      "amount": "150000",
      "amountLCY": "150000",
      "comments": [],
      "approvalCode": "APPR-001",
      "lastModified": "2025-01-15T10:30:00Z",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-..."
    }
  ]
}
```

**Response fields (per result element):**

| Field | Type | Description |
|---|---|---|
| entryNo | Integer | Approval Entry No. |
| sequenceNo | Integer | Sequence within the approval chain |
| documentType | Text | Document type |
| documentNo | Text | Document number |
| status | Text | Approval status (Open, Approved, etc.) |
| approverId | Text | Approver user ID (always calling user) |
| dueDate | Date | Due date (Format 9) |
| currency | Code[10] | Currency code (falls back to GLSetup."LCY Code") |
| amount | Decimal | Amount in document currency (Format 9) |
| amountLCY | Decimal | Amount in local currency (Format 9) |
| comments | Array | String array of approval comments linked to the entry |
| approvalCode | Code[20] | Approval workflow identifier |
| lastModified | DateTime | Last modified timestamp (Format 9) |
| tableId | Integer | Source table ID (only if caller has read permission) |
| tableName | Text | Source table name |
| tableCaption | Text | Source table caption (localized) |
| recordSystemId | GUID | SystemId of related record (Format 4) |

**Key behaviors:** `noOfRecords` reflects total matching entries before skip/take. Empty result (no entries) returns `{"status":"Success","noOfRecords":0,"result":[]}` (not an error).

#### `Document.Approval.Delegate` — delegate entries to another user

```json
{
  "type": "Document.Approval.Delegate",
  "subject": "5",
  "data": {
    "delegateToUserId": "JANE"
  }
}
```

**Request parameters:**

Entry resolution priority: `entries` array > `entryNo`/`systemId` in request JSON > `subject` field.

| Field | Type | Required | Description |
|---|---|---|---|
| delegateToUserId | String | Yes | User ID (from User Setup) to delegate to |
| subject | Text | No | Entry number or SystemId of a single entry |
| entries | Array | No | Array of entry objects for batch processing |
| entries[].entryNo | Integer | No | Approval entry number |
| entries[].systemId | String (GUID) | No | Approval entry SystemId |
| entryNo | Integer | No | Entry number in request JSON |
| systemId | String (GUID) | No | SystemId in request JSON |
| comment | String | No | Optional comment stored as Approval Comment Line(s) |

**Behavior:**
- Does NOT use `ApprovalsMgmt` — directly modifies the Approval Entry
- Sets `Approver ID` to the target user; entry status remains **Open**
- Target user must exist in User Setup table
- The new approver can then approve, reject, or further delegate
- Comment stored same as Approve/Reject

**Response shape:**

Same log-wrapped structure as Approve, with `approvalType` = `"Delegate"`. The linked entry `status` remains `"Open"` (delegation reassigns, does not change status).

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2025-01-10T14:30:00Z",
      "approvalType": "Delegate",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-...",
      "approvalCode": "CE00000001",
      "request": { },
      "linkedApprovalEntries": [
        {
          "entryNo": 5, "sequenceNo": 1, "documentType": "Order",
          "documentNo": "SO-001", "status": "Open", "approverId": "JANE",
          "dueDate": "2025-01-15", "currency": "ISK",
          "amount": "150000", "amountLCY": "150000",
          "comments": [],
          "lastModified": "2025-01-10T14:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "entryNo": 5,
      "statusBefore": "Open",
      "delegatedTo": "JANE"
    }
  ]
}
```

**Action-specific fields:** Same as Approve, plus:

| Field | Type | Description |
|---|---|---|
| delegatedTo | Text | User ID the entry was delegated to (only present on delegate responses) |

Note: `status` remains `"Open"` (delegation reassigns, does not change status).

**Key errors:** Missing `delegateToUserId` → `"The delegateToUserId field is required for delegation."`. Target user not found → `"User Setup for delegate target user X not found."`. No entries resolved → error. Entry not found → error. Entry not open → error. Process codeunit failure → `{ "status": "Error", "error": "...", "callstack": "..." }`.

#### `Document.Approval.Cancel` — cancel all open approval entries for a document

```json
{
  "type": "Document.Approval.Cancel",
  "data": {
    "tableId": 36,
    "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

**Request parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| tableId / tableNumber / tableName | Integer or Text | Yes | Identifies the table containing the document (supported: 36, 38, 130) |
| recordSystemId | GUID | Yes | SystemId of the document record |

**Behavior:**
- Sets **all** open Approval Entry records for the document to Status = Canceled
- Reopens the document (reverts Pending Approval → Open) via BC standard `SalesHeader.SetStatusToOpen()` / `PurchaseHeader.SetStatusToOpen()` / `IncomingDocument.SetStatusToOpen()`
- Creates a `Approval Log ori` entry (Approval Type = `Cancel`)
- Supported tables: Sales Header (36), Purchase Header (38), Incoming Document (130)

**Response shape:**

Same log-wrapped structure as Get/Send, with `approvalType` = `"Cancel"` and an additional `cancelledEntries` count.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2025-01-10T15:00:00Z",
      "approvalType": "Cancel",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-...",
      "approvalCode": "CE00000001",
      "request": { },
      "linkedApprovalEntries": [],
      "linkedPostedApprovalEntries": [],
      "cancelledEntries": 2
    }
  ]
}
```

**Action-specific fields:**

| Field | Type | Description |
|---|---|---|
| cancelledEntries | Integer | Number of approval entries that were set to Canceled |

**Key errors:** Unsupported table → `"Table ID N is not supported..."` (lists 36/38/130). Missing `recordSystemId` → `"recordSystemId is required..."`. Record not found → `"Record with SystemId X not found in table Y."`. No open entries → `"No open approval entries found..."`. Process codeunit failure → `{ "status": "Error", "error": "...", "callstack": "..." }`.

---

### 7.9 MEMORY OPERATIONS

Four message types provide key-value memory storage at two scopes: company-wide and per-user.

| Type | Direction | Purpose |
|---|---|---|
| `Memory.Company.Get` | Outbound | Retrieve company-scoped memory records with optional skip/take pagination |
| `Memory.Company.List` | Outbound | List company-scoped memory records (id and description only, no memory blob) |
| `Memory.Company.Set` | Inbound | Upsert company-scoped memory records from a JSON `data` array |
| `Memory.User.Get` | Outbound | Retrieve user-scoped memory records (filtered to current user) |
| `Memory.User.List` | Outbound | List user-scoped memory records (id and description only, no memory blob) |
| `Memory.User.Set` | Inbound | Upsert user-scoped memory records for the current user |

**Tables:**
- `Memory ori` (10077893) — company-scoped. PK: `Id` (Guid). Fields: `Description` (Text[2048]), `Memory` (Blob).
- `User Memory ori` (10077894) — user-scoped. PK: `User Name` (Code[50]) + `Id` (Guid). Automatically filtered to `UserId()` via FilterGroup(2).

**Permission set:** `BIFROST CoMem ori` (10077891) grants RIMD on Bifrost Memory, Translation ori, and Bifrost Storage.

#### `Memory.Company.Get` — retrieve company memory

```json
{
  "type": "Memory.Company.Get",
  "data": "{\"skip\":0,\"take\":50}"
}
```

**Optional request fields:** `skip` (Integer, default 0), `take` (Integer, default 100; 0 = all), `tableView` (Text — SetView filter).

**Response:**
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    { "id": "a1b2c3d4-...", "description": "My note", "memory": "Full text content" }
  ]
}
```

#### `Memory.Company.List` — list company memory (lightweight)

```json
{
  "type": "Memory.Company.List",
  "data": "{\"skip\":0,\"take\":50}"
}
```

**Optional request fields:** `skip` (Integer, default 0), `take` (Integer, default 100; 0 = all), `tableView` (Text — SetView filter).

**Response** (no `memory` field):
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    { "id": "a1b2c3d4-...", "description": "My note" }
  ]
}
```

#### `Memory.Company.Set` — upsert company memory

```json
{
  "type": "Memory.Company.Set",
  "data": "{\"data\":[{\"id\":\"a1b2c3d4-...\",\"description\":\"My note\",\"memory\":\"Content\"}]}"
}
```

Each item in the `data` array requires `id` (Guid). `description` and `memory` are optional on update. If the `id` exists, the record is modified; otherwise inserted.

**Response:**
```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [
    { "id": "a1b2c3d4-...", "description": "My note", "memory": "Content" }
  ]
}
```

#### `Memory.User.Get` / `Memory.User.Set`

Same request/response shapes as the Company variants. The difference:
- Records are automatically filtered to the current user (`UserId()`) via FilterGroup(2).
- Each record's `User Name` is set automatically on insert.

#### `Memory.User.List` — list user memory (lightweight)

Same as `Memory.Company.List` but user-scoped. Returns only `id` and `description` (no `memory` field). Records are automatically filtered to the current user.

---

### 7.10 NOTIFICATION OPERATIONS

In-app notification system for user-to-user messaging. All operations are scoped to the current user via FilterGroup(2) — users can only read their own notifications and cannot access other users' data.

#### `User.Notification.Count` — get notification counts

Direction: **Outbound**

No data parameters required.

**Request:**

```json
{
  "type": "User.Notification.Count"
}
```

**Response:**

```json
{
  "status": "Success",
  "total": 42,
  "unread": 5,
  "read": 37
}
```

**Response fields:**

- `total` — total number of notifications for the current user
- `unread` — number of notifications with `Is Read = false`
- `read` — number of notifications with `Is Read = true`

**Security:** Automatically filtered to the current user. No data from other users is accessible.

---

#### `User.Notification.Get` — retrieve notifications

Direction: **Outbound**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | Integer | `0` | Number of records to skip (pagination) |
| `take` | Integer | `50` | Number of records to return |
| `tableView` | Text | *(none)* | Optional BC-style filter/sort string |

**Request:**

```json
{
  "type": "User.Notification.Get",
  "data": {
    "skip": 0,
    "take": 20
  }
}
```

**Response:**

```json
{
  "status": "Success",
  "noOfRecords": 42,
  "result": [
    {
      "entryNo": 1001,
      "threadId": "a1b2c3d4-...",
      "parentEntryNo": 0,
      "recipientUserId": "JOHN.DOE",
      "senderUserId": "JANE.SMITH",
      "relatedTableId": 36,
      "relatedRecordSystemId": "RECORD-GUID",
      "approvalEntryNo": 0,
      "subject": "Order approved",
      "body": "Sales Order 1042 has been approved.",
      "isRead": false,
      "sourceEntrySystemId": "SOURCE-GUID",
      "systemId": "NOTIFICATION-GUID",
      "systemCreatedAt": "2025-01-15T10:30:00Z",
      "systemModifiedAt": "2025-01-15T10:30:00Z",
      "notificationType": "New Record"
    }
  ]
}
```

**Response fields:**

- `entryNo` — unique notification entry number
- `threadId` — GUID linking related notifications in a conversation thread
- `parentEntryNo` — entry number of the parent notification (0 if top-level)
- `recipientUserId` — Code[50] user name of the recipient (BC User ID)
- `senderUserId` — Code[50] user name of the user who sent the notification
- `relatedTableId` — table ID of the related BC record (e.g., 36 for Sales Header)
- `relatedRecordSystemId` — SystemId of the related BC record
- `approvalEntryNo` — linked approval entry number (0 if not approval-related)
- `subject` — notification subject line
- `body` — notification body text
- `isRead` — whether the notification has been read
- `sourceEntrySystemId` — SystemId of the source notification entry
- `systemId` — SystemId of this notification record
- `systemCreatedAt` — UTC timestamp when created
- `systemModifiedAt` — UTC timestamp when last modified
- `notificationType` — type of notification ("New Record", "Approval", "Overdue")

**Security:** Automatically filtered to the current user via FilterGroup(2). Only notifications where the current user is the recipient are returned.

**Related:** `User.Notification.Count`, `User.Notification.Read`

---

#### `User.Notification.Read` — mark notifications as read/unread

Direction: **Inbound**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `entryNos` | Integer[] | *(required)* | Array of notification entry numbers to update |
| `isRead` | Boolean | `true` | Set to `false` to mark as unread |

**Request:**

```json
{
  "type": "User.Notification.Read",
  "data": {
    "entryNos": [1001, 1002, 1005],
    "isRead": true
  }
}
```

**Response:**

Only modified records are returned in the response. Entries that do not belong to the current user are silently skipped — no error is raised.

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "entryNo": 1001,
      "isRead": true
    }
  ]
}
```

**Security:** Silently skips any entry numbers that do not belong to the current user. This prevents enumeration of other users' notifications.

**Related:** `User.Notification.Get`, `User.Notification.Count`

---

#### `User.Notification.Send` — send a notification to a user

Direction: **Inbound**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `recipientUserId` | Code[50] | *(required)* | BC User ID (user name) of the recipient |
| `subject` | Text | *(required)* | Notification subject line |
| `body` | Text | *(optional)* | Notification body text |
| `threadId` | GUID | *(optional)* | Thread ID to group related notifications |
| `parentEntryNo` | Integer | *(optional)* | Parent entry number (required if `threadId` is set) |
| `relatedTableId` | Integer | *(optional)* | Table ID of the related BC record |
| `relatedRecordSystemId` | GUID | *(optional)* | SystemId of the related BC record |
| `notificationType` | Text | *(optional)* | Type of notification ("New Record", "Approval", "Overdue") |

**Request:**

```json
{
  "type": "User.Notification.Send",
  "data": {
    "recipientUserId": "JOHN.DOE",
    "subject": "Order requires review",
    "body": "Sales Order 1042 needs your attention.",
    "relatedTableId": 36,
    "relatedRecordSystemId": "RECORD-GUID"
  }
}
```

**Thread reply example:**

```json
{
  "type": "User.Notification.Send",
  "data": {
    "recipientUserId": "JOHN.DOE",
    "subject": "Re: Order requires review",
    "body": "I've updated the discount. Please check again.",
    "threadId": "THREAD-GUID",
    "parentEntryNo": 1001
  }
}
```

**Response:**

Returns the created notification record with all fields populated, including the auto-assigned `senderUserId` (set to the calling user's BC User ID).

```json
{
  "status": "Success",
  "result": [
    {
      "entryNo": 1006,
      "threadId": "THREAD-GUID",
      "parentEntryNo": 1001,
      "recipientUserId": "JOHN.DOE",
      "senderUserId": "JANE.SMITH",
      "subject": "Re: Order requires review",
      "body": "I've updated the discount. Please check again.",
      "isRead": false,
      "systemId": "NEW-NOTIFICATION-GUID",
      "systemCreatedAt": "2025-01-15T14:22:00Z"
    }
  ]
}
```

**Constraints:**

- `recipientUserId` and `subject` are required — omitting either produces an error
- `parentEntryNo` is required when `threadId` is provided
- `senderUserId` is automatically set to the calling user — cannot be overridden

**Related:** `User.Notification.Get`, `User.Notification.Thread`

---

#### `Email.Draft.Set` — create email draft in outbox (no send)

Direction: **Inbound**

Creates an email draft in the standard Business Central Email Outbox. This operation does not send email.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `to` | Text or Text[] | *(required)* | Recipient email address(es). Supports `;`/`,` delimited string or array. |
| `subject` | Text | *(required)* | Email subject line |
| `htmlBody` | Text | *(optional)* | HTML body content |
| `body` | Text | *(optional)* | Fallback body when htmlBody is omitted |
| `cc` | Text or Text[] | *(optional)* | CC recipient(s) |
| `bcc` | Text or Text[] | *(optional)* | BCC recipient(s) |
| `emailScenario` | Text | *(optional)* | Explicit Email Scenario enum name |
| `relatedTableId` | Integer | *(optional)* | Used for scenario best-guess when emailScenario is omitted |
| `attachments` | Object[] | *(optional)* | URL-based attachments (`fileName`, optional `contentType`, required `url` or `contentUrl`) |

**Request:**

```json
{
  "type": "Email.Draft.Set",
  "data": {
    "to": ["buyer@contoso.com"],
    "subject": "PO 1005",
    "htmlBody": "<p>Please review attached files.</p>",
    "relatedTableId": 38,
    "attachments": [
      {
        "fileName": "spec.pdf",
        "contentType": "application/pdf",
        "url": "https://example.com/spec.pdf"
      }
    ]
  }
}
```

**Response:**

```json
{
  "status": "Success",
  "messageId": "d8f0f4d7-2f8b-4a4c-90e2-9f5c2d9d0f42",
  "outboxSystemId": "26d55e6d-8b76-4d96-9f8c-2fb0fcf7e6a5",
  "outboxUrl": "https://businesscentral...",
  "emailScenarioResolved": "Purchasing"
}
```

**Scenario resolution order:**

1. Explicit `emailScenario`
2. Best-guess from `relatedTableId`
3. `Default`
4. First available value in enum `Email Scenario`

**Notes:**

- Standard BC email permissions and account setup apply.
- Attachment URLs must be reachable from the BC server environment.

**Related:** `User.Notification.Send`, `Help.WhoAmI.Get`

---

#### `User.Notification.Thread` — retrieve a full notification thread

Direction: **Outbound**

The `subject` field in the request envelope must be set to the thread GUID.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | Integer | *(optional)* | Number of records to skip |
| `take` | Integer | *(all)* | Number of records to return (defaults to all thread entries) |

**Request:**

```json
{
  "type": "User.Notification.Thread",
  "subject": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "data": {}
}
```

**Response:**

Returns ALL notifications in the thread from all participants, ordered by `entryNo`. The current user must be a recipient of at least one notification in the thread.

```json
{
  "status": "Success",
  "noOfRecords": 4,
  "result": [
    {
      "entryNo": 1001,
      "threadId": "a1b2c3d4-...",
      "parentEntryNo": 0,
      "recipientUserId": "JOHN.DOE",
      "senderUserId": "JANE.SMITH",
      "subject": "Order requires review",
      "body": "Sales Order 1042 needs your attention.",
      "isRead": true,
      "systemCreatedAt": "2025-01-15T10:30:00Z"
    },
    {
      "entryNo": 1002,
      "threadId": "a1b2c3d4-...",
      "parentEntryNo": 1001,
      "recipientUserId": "JANE.SMITH",
      "senderUserId": "JOHN.DOE",
      "subject": "Re: Order requires review",
      "body": "I've updated the discount.",
      "isRead": false,
      "systemCreatedAt": "2025-01-15T14:22:00Z"
    }
  ]
}
```

**Key difference from `User.Notification.Get`:** Thread retrieval returns notifications from ALL participants in the thread (not just the current user's notifications), enabling full conversation view. However, the current user must be a recipient of at least one entry in the thread to access it.

**Security:** Access is gated — the current user must be a recipient of at least one notification in the requested thread. If not, no records are returned.

**Related:** `User.Notification.Send`, `User.Notification.Get`

---

### 7.11 WEBHOOK INBOUND OPERATIONS

The inbound side of webhooks: external systems push events into BC through the Bifrost website,
which forwards them as Bifrost tasks. Subscriber extensions handle the domain logic.

This is the **inbound counterpart** to the outbound External Business Events documented in §13.

#### `Webhook.Inbound.Receive` — receive a forwarded webhook and fan out to subscribers

Direction: **Inbound** (external system → BC)

The Bifrost website receives a webhook at `/api/webhook?companyId={guid}`, validates the
`X-Webhook-Secret` header, allowlists forwardable HTTP headers, and POSTs a Bifrost task
to BC with `type: "Webhook.Inbound.Receive"`.

**Envelope mapping:**

| Envelope field | Used for |
|---|---|
| `source` | Source system identifier, e.g. `"scale/v23"`. Defaults to `"webhook/inbound"` when empty. Propagated to the integration event as `EventSource`. |
| `subject` | Event type, e.g. `"shipment.confirmed"`. Falls back to `data.eventType` when empty. Propagated as `EventType`. |
| `data` | JSON object with shape `{ eventType, source, headers, body }`. |

**data field shape:**

| Field | Type | Description |
|---|---|---|
| `eventType` | string | Mirrors envelope `subject`. |
| `source` | string | Mirrors envelope `source`. |
| `headers` | object | Allowlisted HTTP headers (lowercase keys). |
| `body` | object \| array \| null | Original webhook request body, parsed as JSON. |

**Request:**

```json
{
  "specversion": "1.0",
  "type": "Webhook.Inbound.Receive",
  "source": "scale/v23",
  "subject": "shipment.confirmed",
  "data": {
    "eventType": "shipment.confirmed",
    "source": "scale/v23",
    "headers": {
      "x-webhook-id": "evt_01HX9F2G7B",
      "x-webhook-source": "scale/v23"
    },
    "body": {
      "shipmentNo": "S-2026-00042",
      "orderNo": "SO-105988",
      "confirmedAt": "2026-05-27T09:14:22Z"
    }
  }
}
```

**Response:**

```json
{
  "status": "Success",
  "acknowledged": true,
  "handled": true
}
```

| Field | Description |
|---|---|
| `status` | `"Success"` when the event dispatched. `"Error"` if a subscriber raised. |
| `acknowledged` | Always `true` — confirms BC consumed the message. |
| `handled` | `true` when at least one subscriber set `Handled := true`. `false` means no subscriber claimed the event. |

**Subscriber pattern (AL):**

Subscriber extensions hook into `Codeunit::"Webhook Inbound Events"` and filter by source:

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"Webhook Inbound Events",
    'OnWebhookReceived', '', false, false)]
local procedure HandleScaleWebhook(
    EventSource: Text; EventType: Text;
    HeadersJson: Text; BodyJson: Text; var Handled: Boolean)
var
    Body: JsonObject;
begin
    if not EventSource.StartsWith('scale/') then
        exit;
    if BodyJson <> 'null' then
        Body.ReadFrom(BodyJson);
    case EventType of
        'shipment.confirmed': ProcessShipmentConfirmed(Body);
        'receipt.confirmed':  ProcessReceiptConfirmed(Body);
        else
            exit;
    end;
    Handled := true;
end;
```

**Notes:**

- A response of `acknowledged: true, handled: false` is a useful diagnostic during integration
  testing — confirms the webhook reached BC but no domain handler matched.
- Header keys are lowercased by the receiver. Always look up headers in lowercase.
- Webhooks may be delivered more than once. Track an event ID from headers (`x-webhook-id`)
  or the body and skip duplicates inside your subscriber.
- If a subscriber raises, the error propagates through `ExecuteBifrostTask` and the task
  is recorded as failed. Wrap risky logic in `if Codeunit.Run(...)` to isolate failures.
- Authentication, header allowlisting, and secret rotation are configured on the Bifrost
  website, not in BC.

**Related:** `Help.MessageTypes.Get`, `Help.Implementation.Get`. For outbound webhooks BC raises
to external subscribers (`BifrostMessageCompleted`, `BifrostMessageFailed`), see §13.

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

## 9. Special Field Conversions

### Currency Code (blank = LCY)

BC stores blank `Currency Code` to mean Local Currency.

- **Get** → blank is returned as the LCY currency code from G/L Setup, e.g. `"ISK"` or `"USD"`
- **Set** → send that same LCY code string back; API converts it to blank automatically
- Round-trip safe: use the value you received from Get directly in Set

### Dimension Set ID (field 480)

- **Get** → integer is expanded to an array:
  ```json
  "DimensionSetID": [
    { "DimensionCode": "DEPT", "DimensionValueCode": "SALES" }
  ]
  ```
- **Set** → send the same array back; API resolves it to the integer automatically
- Empty array = blank (0) dimension set

### BLOB Fields

- **Get** → plain Base64 string: `"ValueBLOB": "dGhpcyBpcyB0ZXN0..."`
- **Set** → send the same Base64 string

### Media (single image)

- **Get** → `{ "Id": "{GUID}", "Value": "base64string" }`
- **Set** → send the same object

### MediaSet (multiple images)

- **Get** → `{ "Id": "{GUID}", "Media": [{ "Id": "…", "Value": "…" }] }`
- **Set** → send the same object

---

## 10. Enum / Option Handling

**Get** returns the **display caption** for the requested `lcid`.  
Set accepts **any** of:
- AL name (always English): `"Ship"`, `"Invoice"`, `"All"`
- Display caption (localised): `"Afhenda"` (Icelandic for Ship)
- Ordinal as string: `"1"`

Use `Help.Fields.Get` to discover valid values. `enum[].value` = AL name, `enum[].caption` = localised caption.

`Customer.Blocked` example: `" "` (single space string) = not blocked (blank option).

---

## 11. tableView Filter Syntax

`tableView` uses BC's AL table view syntax. Use the **`name`** from `Help.Fields.Get` (not `jsonName`) in WHERE clauses.

```
WHERE(FieldName=CONST(value))                                   ← exact match
WHERE(FieldName=FILTER(>1000))                                  ← comparison
WHERE(FieldName=FILTER(>0&<10000))                              ← range
WHERE(FieldName=FILTER(@*Corp*))                                ← case-insensitive contains (*)
WHERE(FieldName=FILTER(DEPT|SALES))                            ← OR
WHERE(Blocked=CONST( ))                                         ← blank/empty option
WHERE(Posting Date=FILTER(>=2026-01-01&<=2026-12-31))
WHERE(Blocked=CONST( ),Balance (LCY)=FILTER(>0))               ← multiple fields with AND
```

Operators: `CONST` (exact), `FILTER` (pattern/range), `>` `<` `>=` `<=`, `&` (AND on same field), `|` (OR), `*` (wildcard), `@` (case-insensitive), `..` (range).

### Sorting and paging within tableView

Prepend a `SORTING(...)` clause (using BC **field names**, not JSON keys) and an `ORDER(...)` clause before the `WHERE` clause. Combine with `skip` and `take` to fetch a specific slice in a controlled order.

```
SORTING(Field1,Field2,Field3) ORDER(Ascending) WHERE(...)
SORTING(Field1,Field2,Field3) ORDER(Descending) WHERE(...)
```

**Get the single most-recent record matching a filter** (skip:0, take:1, ORDER Descending):

```json
{
  "tableName": "Integration ori",
  "tableView": "SORTING(Source,Table Id,Date & Time) ORDER(Descending) WHERE(Source=CONST(MyApp),Table Id=CONST(18),Reversed=CONST(false))",
  "skip": 0,
  "take": 1
}
```

**Get the 5 oldest customer ledger entries for a customer** (skip:0, take:5, ORDER Ascending):

```json
{
  "tableName": "Cust. Ledger Entry",
  "tableView": "SORTING(Customer No.,Posting Date) ORDER(Ascending) WHERE(Customer No.=CONST(10000))",
  "skip": 0,
  "take": 5
}
```

Key rules:
- `SORTING(...)` field names use BC field names (same as `WHERE` clauses), not JSON keys.
- `ORDER(Ascending)` is the default — omit or include explicitly.
- `ORDER(Descending)` reverses the sort. Combined with `take:1` and `skip:0` this efficiently retrieves the latest entry.
- The `SORTING` + `ORDER` clause is evaluated **server-side by BC** — it is not client-side sorting in the MCP layer.
- You can sort by multiple fields: `SORTING(Field1,Field2)` — BC uses them left to right.

---

### 11a. Customer and item lookup patterns

To look up a customer by number or name, send `Data.Records.Get` with `tableName: "Customer"`
and a `tableView` filter. To look up an item, use `tableName: "Item"`.

For a ready-to-use, instance-accurate guide with live field names for *this* BC instance,
invoke the MCP prompts:

- `customer_lookup_pattern` — returns filter examples and the full Customer field table
- `item_lookup_pattern` — returns filter examples and the full Item field table

Both prompts fetch live field metadata and substitute it into the guide, so the field
numbers and `jsonName` values are guaranteed accurate for the connected BC instance.

---

## 12. Creating Sales Orders Workflow

There is no dedicated "create order" message type. Use `Data.Records.Set` for all steps.

### Step 1 — Create Sales Header

### Step 2 — Add Sales Lines (one call per line)

Increment `LineNo_` by 10000 for each additional line.

### Step 3 — Release

For a ready-to-use workflow description pre-populated with the live `jsonName` values and
field table for *this* BC instance, invoke the MCP prompt `sales_order_creation_workflow`.
It calls `get_table_fields` for both `Sales Header` and `Sales Line` and injects the results
into a step-by-step guide.

---

## 13. Webhooks (External Business Events)

> **Outbound direction.** This section covers webhooks BC raises **out** to external subscribers.
> For the **inbound** direction (external systems pushing events **into** BC), see §7.11
> (`Webhook.Inbound.Receive`).

BC raises two native external events:

| Event | Raised when |
|---|---|
| `BifrostMessageCompleted` | Message processes successfully |
| `BifrostMessageFailed` | Message processing fails |

Subscribe via BC's Event Subscriptions page. Webhook payload (minimal by design):

```json
{
  "MessageId": "a8f5f167-8f2c-4a42-9b3e-5c6c7d8e9f0a",
  "MessageType": "Customer.CreditLimit.Get",
  "ResponseContentLink": "/api/origo/bifrost/v1.0/responses(a8f5f167-…)/data",
  "Timestamp": "2026-03-08T14:30:22Z"
}
```

After receiving the webhook, GET `ResponseContentLink` (with Bearer token) to retrieve the full result.

---

## 14. Language Support (LCID)

Set `lcid` at the message envelope level (not inside `data`) to receive captions in a specific language.

| LCID | Language |
|---|---|
| 1033 | English (US) |
| 1039 | Icelandic |
| 1030 | Danish |
| 1031 | German |
| 1036 | French |
| 1034 | Spanish |
| 1043 | Dutch |
| 1053 | Swedish |
| 1044 | Norwegian (Bokmål) |

If omitted, uses the Default Language Code from Bifrost Setup.

---

## 15. JavaScript/TypeScript Helper Pattern

```typescript
const BASE = `https://api.businesscentral.dynamics.com/v2.0/${TENANT}/${ENV}/api/origo/bifrost/v1.0`;

async function cePost(companyId: string, message: object, token: string) {
  const res = await fetch(`${BASE}/companies(${companyId})/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ specversion: '1.0', source: 'MyApp v1.0', ...message }),
  });
  const task = await res.json();
  // Direct error (PDF types, some inbound)
  if (task.status === 'Error') throw new Error(task.error);
  // Two-step: fetch the data URL
  if (task.data) {
    const dataRes = await fetch(task.data, { headers: { Authorization: `Bearer ${token}` } });
    const result = await dataRes.json();
    if (result.status === 'Error') throw new Error(`${result.error}\n${result.callStack}`);
    return result;
  }
  return task;
}

// Read records example
const customers = await cePost(companyId, {
  type: 'Data.Records.Get',
  data: JSON.stringify({ tableName: 'Customer', fieldNumbers: [1, 2, 5, 7], take: 100 }),
}, token);

// Write record example
await cePost(companyId, {
  type: 'Data.Records.Set',
  subject: 'Customer',
  data: JSON.stringify({ data: [{ id: systemId, fields: { Address: 'New Road 1' } }] }),
}, token);

// Get field metadata
const fields = await cePost(companyId, {
  type: 'Help.Fields.Get',
  data: JSON.stringify({ tableName: 'Customer' }),
  lcid: 1033,
}, token);
```

---

## 16. Common Mistakes to Avoid

1. **`data` must be a JSON string** — `"data": "{\"tableName\":\"Customer\"}"` not `"data": {"tableName": "Customer"}`. Failing to stringify is the most common error.

2. **Tenant GUID in returned data URLs** — the URL in `task.data` uses the internal tenant GUID, not the named tenant. Use it verbatim, or if constructing from a known message ID use the named-tenant form (both are accepted).

3. **Field values in `Data.Records.Set` must be strings** — even numbers and booleans: `"Quantity": "5"` not `"Quantity": 5`.

4. **FlowFields are blank unless `fieldNumbers` is specified** in `Data.Records.Get`.

5. **`noOfRecords` does not change with pagination** — it is always the total matching-filter count. Don't re-request it per page.

6. **Primary key fields must never appear in `fields`** in `Data.Records.Set` — put them in `primaryKey` only.

7. **PDF response is binary** — do not try to JSON-parse it. Use `response.arrayBuffer()` or `response.blob()`.

8. **`tableView` field names differ from JSON keys** — use the `name` from `Help.Fields.Get` in WHERE clauses, not `jsonName`.

9. **Enum/Option values in `tableView`** must use the AL name (always English), not the localised caption.

10. **`subject` can accept a GUID** (the record's SystemId) for most typed message types — useful for document lookups when you don't have the document number.

11. **Posting message types are permission-gated per domain** — every `*.Post` and `*.Reverse` message type that writes ledger entries requires one of five permission sets:
    - `G/L Posting ori` — `Finance.GeneralJournal.Post`, `Finance.GeneralJournal.ReverseRegister`, `Finance.GeneralJournal.ReverseTransaction`, `Finance.BankReconciliation.Post`, `Finance.VAT.CalcAndPostSettlement`, `Customer.Application.Post`, `Customer.Application.Reverse`, `Vendor.Application.Post`, `Vendor.Application.Reverse`, `Sales.Document.Post`, `Purchase.Document.Post`
    - `Item Posting ori` — `Inventory.ItemJournal.Post`, `Inventory.TransferOrder.Post`, `Inventory.AssemblyOrder.Post`
    - `FA Posting ori` — `FixedAssets.FAJournal.Post`
    - `Job Posting ori` — `Projects.ProjectJournal.Post`
    - `Resource Posting ori` — `Resources.ResourceJournal.Post`

    These sets are **standalone** and not included in `BIFROST Read ori` or `BIFROST Full ori`. A missing permission produces the response:
    ```json
    { "status": "Error", "error": "Posting denied: missing '<permission set name>' permission set (BIFROST GL Post ori, BIFROST ItemPost ori, BIFROST FA Post ori, BIFROST Job Post ori, BIFROST Res Post ori or BIFROST WhsePost ori)." }
    ```
    `Sales.Document.Post` and `Purchase.Document.Post` are gated to `G/L Posting ori` only, even though they may write item entries downstream.

---

## 17. Dynamic Schema Discovery

The preferred discovery path is the **MCP server** (see Requirement 8), which wraps these
calls and exposes results as Tools and Resources. The raw `Help.*` Bifrost calls
documented here remain valid for production integrations where MCP is not available.

### 17.1 Listing all tables

Use the MCP server tool `list_tables` or read the `bc://tables` resource for a live,
instance-accurate table catalogue. Both return `{ id, name, caption }` for every table in
the targeted BC company.

To narrow the result:
- Pass `filter` (substring match on name/caption) to reduce response size.
- Pass `take` / `skip` for paging (default: first 200 tables).

> The static snapshot file `bc-metadata-all-tables-is.md` previously referenced here is
> superseded by the MCP server and should not be consulted for field numbers or table IDs.

### 17.2 Fields for a specific table

Use the MCP tool `get_table_fields` (or resource `bc://tables/{tableName}`) to retrieve all
fields for a table. Each field entry includes:

| Property | Description |
|---|---|
| `number` | BC field number (use in `fieldNumbers` arrays) |
| `name` | AL field name |
| `jsonName` | The JSON key used in Bifrost `fields` payloads |
| `type` | BC data type |
| `isPartOfPrimaryKey` | Boolean |
| `hasTableRelation` | Boolean — `true` if field has a table relation (`RelationTableNo > 0`); useful for detecting lookup/reference fields |
| `readRestricted` | Boolean — `true` when the current user is blocked from reading the field via `Field Access ori`. Read-restricted fields are silently dropped from `Data.Records.Get` responses (PK fields are always returned). |
| `writeRestricted` | Boolean — `true` when the current user is blocked from writing the field via `Field Access ori`. Write-restricted fields are rejected by `Data.Records.Set` and excluded from “Did you mean” hints. |
| `enum` | Present for Option/Enum fields; lists all captions and values |

To get field numbers for the most commonly needed fields, call:
`get_table_fields({ table: "Customer" })` (or "Item", "Sales Header", etc.)

There is no need to hard-code field number constants — the MCP server provides live,
version-accurate values for the specific BC instance being integrated.

### 17.3 Field Metadata Caching Pattern

Field metadata is stable within a session but **must be re-fetched when the language
changes** (captions are language-specific).

```javascript
const fieldMetaCache = {};  // keyed: "{companyId}:{lcid}:{tableName}"

async function getFieldMeta(companyId, tableName, lcid, fieldNumbers = []) {
  const key = `${companyId}:${lcid}:${tableName}`;
  if (fieldMetaCache[key]) return fieldMetaCache[key];
  
  const res = await cePost(companyId, {
    type: 'Help.Fields.Get',
    data: JSON.stringify({
      tableName,
      ...(fieldNumbers.length ? { fieldNumbers } : {})
    }),
    lcid
  });
  
  fieldMetaCache[key] = res.result || [];
  return fieldMetaCache[key];
}

// Invalidate on company or language change
function clearFieldMetaCache() { Object.keys(fieldMetaCache).forEach(k => delete fieldMetaCache[k]); }
```

### 17.4 Discover Available Message Types

Use the MCP tool `list_message_types` (or resource `bc://message-types`) to retrieve the
full message catalogue for the targeted BC instance. Pass an optional `filter` string for
substring matching. The underlying Bifrost call is `Help.MessageTypes.Get`.

### 17.5 Check User Permissions Before Attempting Writes

```javascript
async function checkTablePermissions(companyId, tableName) {
  const res = await cePost(companyId, {
    type: 'Help.Permissions.Get',
    subject: tableName
  });
  return { read: res.readPermission, write: res.writePermission };
}

const perms = await checkTablePermissions(companyId, 'Customer');
if (!perms.write) {
  showError('You do not have write permissions for the Customer table.');
  return;
}
```

---

## 18. Selecting Only the Fields You Need

Always specify `fieldNumbers` instead of requesting all fields. Benefits:
- Dramatically reduces response payload size
- Enables FlowField calculation (FlowFields are **only calculated** when `fieldNumbers` is specified)
- Improves BC-side performance (fewer field reads)
- Reduces transfer time

### Pattern: Declare field lists as named constants

```javascript
// Declare once — use everywhere
const CUSTOMER_LIST_FIELDS   = [2, 7, 35, 39, 59, 83, 102, 140];
// Field 2  = Name
// Field 7  = City
// Field 35 = Country/Region Code
// Field 39 = Blocked (enum — fetch metadata for caption)
// Field 59 = Balance (LCY)  [FlowField — only returned when fieldNumbers present]
// Field 83 = Location Code
// Field 102 = E-Mail
// Field 140 = Image (Media)

const CUSTOMER_DETAIL_FIELDS = [2, 4, 5, 7, 8, 9, 10, 17, 21, 27, 30, 35, 38, 39,
                                 54, 59, 61, 82, 84, 85, 86, 91, 92, 95, 102, 107,
                                 108, 110, 116, 140];

const POST_CODE_FIELDS       = [1, 2, 4, 5];
// Field 1 = Code (PK)
// Field 2 = City
// Field 4 = Country/Region Code
// Field 5 = County

const CUST_LEDGER_FIELDS     = [4, 5, 6, 7, 13, 14, 36];
```

### Pattern: Parallel loading of records + field metadata

Load data and field metadata simultaneously so captions are ready when data arrives:

```javascript
const [recordsRes, fieldMetaRes] = await Promise.all([
  cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableName: 'Customer',
      fieldNumbers: CUSTOMER_LIST_FIELDS,
      skip: 0,
      take: 50
    })
  }),
  getFieldMeta(companyId, 'Customer', userLcid, [39])  // Only need Blocked enum captions
]);

// Map enum ordinal → caption for the Blocked field
const blockedField = fieldMetaRes.find(f => f.id === 39);
const blockedCaption = val => blockedField?.enum?.find(e => e.value === val)?.caption ?? val;

// Render
for (const rec of recordsRes.result) {
  const name    = rec.fields.Name;
  const blocked = blockedCaption(rec.fields.Blocked);  // " " → "Not blocked" in user's language
  const balance = rec.fields.BalanceLCY;               // FlowField — present because fieldNumbers was set
}
```

### Pattern: Build a generic field-driven form from metadata

```javascript
async function buildForm(companyId, tableName, lcid) {
  const fields = await getFieldMeta(companyId, tableName, lcid);
  
  for (const field of fields) {
    if (field.isPartOfPrimaryKey) continue;  // PK fields shown separately
    if (field.class === 'FlowField') continue;  // Read-only calculated fields
    
    const label = field.caption;  // Localised
    let control;
    
    switch (field.type) {
      case 'Option':
        // Build <select> from enum[]
        control = buildSelect(field.enum.map(e => ({ value: e.value, label: e.caption })));
        break;
      case 'Boolean':
        control = buildCheckbox();
        break;
      case 'Date':
        control = buildDateInput();
        break;
      case 'Decimal':
      case 'Integer':
      case 'BigInteger':
        control = buildNumberInput();
        break;
      case 'Blob':
        // BLOB — file upload; value is a plain Base64 string
        control = buildFileInput({ encoding: 'base64', returnAs: 'string' });
        break;
      case 'Media':
        // Single image — value is { Id: "{GUID}", Value: "base64string" }
        control = buildFileInput({ encoding: 'base64', returnAs: 'mediaObject' });
        break;
      case 'MediaSet':
        // Multiple images — value is { Id: "{GUID}", Media: [{ Id: "…", Value: "…" }] }
        control = buildFileInput({ encoding: 'base64', returnAs: 'mediaSetObject', multiple: true });
        break;
      default:
        // Text, Code
        control = buildTextInput(field.len);
    }
    
    addFormRow(label, control, field.jsonName);
  }
}
```

### 17.6 Binary Field Types — Blob, Media, MediaSet

These three field types carry binary content (files, images). They are handled
differently from all other field types — each has its own JSON shape on read and write.

#### Blob

A raw binary field (e.g. `Value BLOB` on table 823 Name/Value Buffer). Identified in
`Help.Fields.Get` response as `"type": "Blob"`.

**Read (`Data.Records.Get`):**
Returned as a plain Base64-encoded string.
```json
"ValueBLOB": "dGhpcyBpcyB0ZXN0IGRhdGE="
```

**Write (`Data.Records.Set`):**
Send the same plain Base64 string back in the `fields` object.
```json
"fields": {
  "ValueBLOB": "dGhpcyBpcyB0ZXN0IGRhdGE="
}
```

**JavaScript — encode a file for write:**
```javascript
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);  // strip data-URL prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const base64 = await fileToBase64(fileInputElement.files[0]);
// Send: fields: { ValueBLOB: base64 }
```

**JavaScript — decode a Blob value for display/download:**
```javascript
function base64ToBlob(base64, mimeType = 'application/octet-stream') {
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return new Blob([bytes], { type: mimeType });
}

const blob = base64ToBlob(rec.fields.ValueBLOB, 'application/pdf');
const url  = URL.createObjectURL(blob);
```

---

#### Media (single image)

A single image field (e.g. `Image` on table 18 Customer). Identified as `"type": "Media"`.

**Read (`Data.Records.Get`):**
Returned as a JSON object with a GUID identifier and the Base64-encoded image.
```json
"Image": {
  "Id": "{D6E0EA8A-88A5-4F03-BC75-A5FBC2806FB1}",
  "Value": "/9j/4AAQSkZJRgABAQAA..."
}
```
- `Id` — the media GUID in BC (curly-braced uppercase)
- `Value` — Base64-encoded image bytes

**Write (`Data.Records.Set` — update existing):**
Send the same object back. BC replaces the image.
```json
"fields": {
  "Image": {
    "Id": "{D6E0EA8A-88A5-4F03-BC75-A5FBC2806FB1}",
    "Value": "/9j/4AAQ..."  
  }
}
```

**Write (`Data.Records.Set` — new image, no existing GUID):**
Generate a new GUID and supply it as `Id`. Use all uppercase and include curly braces.
```javascript
function newMediaGuid() {
  // Generate RFC4122 v4 UUID wrapped in braces, uppercase
  return '{' + crypto.randomUUID().toUpperCase() + '}';
}

const base64Image = await fileToBase64(fileInputElement.files[0]);
const imageField  = { Id: newMediaGuid(), Value: base64Image };
// Send: fields: { Image: imageField }
```

**Display in browser:**
```javascript
function mediaToDataUrl(mediaObj, mimeType = 'image/jpeg') {
  if (!mediaObj?.Value) return null;
  return `data:${mimeType};base64,${mediaObj.Value}`;
}

imgElement.src = mediaToDataUrl(rec.fields.Image);
```

---

#### MediaSet (multiple images)

A collection of images (rare on standard tables). Identified as `"type": "MediaSet"`.

**Read (`Data.Records.Get`):**
Returned as a JSON object with a set GUID and an array of individual media items.
```json
"Pictures": {
  "Id": "{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}",
  "Media": [
    { "Id": "{GUID-1}", "Value": "base64string1" },
    { "Id": "{GUID-2}", "Value": "base64string2" }
  ]
}
```

**Write (`Data.Records.Set`):**
Send the same object back. Each item in `Media` needs its own GUID and Base64 value.
To add a new image, append a new entry to `Media` with a freshly generated GUID.
To replace all images, reconstruct the `Media` array.
```javascript
const existingSet = rec.fields.Pictures; // from a prior Data.Records.Get

// Add a new image to the set
const newFile = fileInputElement.files[0];
const newBase64 = await fileToBase64(newFile);
existingSet.Media.push({ Id: newMediaGuid(), Value: newBase64 });

// Send back
// fields: { Pictures: existingSet }
```

**Round-trip rule:** Always read the current value first, then modify and send it back.
Never send a partial `Media` array unless you intentionally want to remove entries.

---

## 19. tableView — Filtering and Sorting in BC Style

`tableView` is a Business Central AL table view string. It is the **only supported
server-side filtering mechanism** in `Data.Records.Get` and `Data.RecordIds.Get`.

### 19.1 Filtering Syntax

Use the **`name`** from `Help.Fields.Get` (original BC field name, may contain spaces
and punctuation) — not the `jsonName`.

```
WHERE(FieldName=OPERATOR(value))
WHERE(Field1=OPERATOR(val1),Field2=OPERATOR(val2))    ← AND (comma-separated)
```

**Operators:**

| Operator | Meaning | Example |
|---|---|---|
| `CONST(value)` | Exact match — single value | `WHERE(No.=CONST(10000))` |
| `FILTER(value)` | Pattern/range match | `WHERE(Balance (LCY)=FILTER(>1000))` |
| `FILTER(v1\|v2)` | OR — multiple values | `WHERE(Type=FILTER(Item\|Resource))` |
| `FILTER(lo..hi)` | Inclusive range | `WHERE(No.=FILTER(10000..20000))` |
| `FILTER(>val)` | Greater than | `WHERE(Balance (LCY)=FILTER(>0))` |
| `FILTER(>=val)` | Greater than or equal | `WHERE(Posting Date=FILTER(>=2026-01-01))` |
| `FILTER(<val)` | Less than | `WHERE(Credit Limit (LCY)=FILTER(<10000))` |
| `FILTER(lo&hi)` | Combined conditions on same field | `WHERE(Balance (LCY)=FILTER(>0&<50000))` |
| `FILTER(@*text*)` | Case-insensitive contains | `WHERE(Name=FILTER(@*Corporation*))` |
| `FILTER(text*)` | Starts with | `WHERE(No.=FILTER(C*))` |

**Blank/empty option values** — use `CONST( )` with a single space:
```
WHERE(Blocked=CONST( ))         ← not blocked customers
WHERE(Document Type=CONST(Order),Status=CONST(Open))
```

**Dynamic values in template literals:**
```javascript
// Exact match from variable
const tableView = `WHERE(Registration Number=CONST(${regNo}))`;

// Numeric range from variables
const tableView = `WHERE(Balance (LCY)=FILTER(>${minBalance}&<${maxBalance}))`;

// Date range (use BC date format YYYY-MM-DD in FILTER)
const tableView = `WHERE(Posting Date=FILTER(>=${fromDate}&<=${toDate}))`;

// Multiple conditions (AND)
const tableView = `WHERE(Customer No.=CONST(${customerNo}),Open=CONST(true))`;

// OR values
const tableView = `WHERE(Document Type=FILTER(Order|Invoice))`;
```

**Special characters in values** — most separator characters are safe inside `CONST()`.
For `FILTER()`, avoid embedding `&`, `|`, `.."` as they are filter operators.

### 19.2 Sorting Syntax

`tableView` also supports sorting via an `ORDER BY` clause appended after `WHERE`.
BC sorts results using the BC-side key ordering — you can specify the key fields and direction.

```
SORTING(FieldName1,FieldName2) ORDER(Ascending|Descending)
WHERE(Blocked=CONST( )) SORTING(Name) ORDER(Ascending)
SORTING(Posting Date,Entry No.) ORDER(Descending)
```

Full combined example:
```javascript
const tableView = `WHERE(Customer No.=CONST(${custNo}),Open=CONST(true)) SORTING(Due Date) ORDER(Ascending)`;
```

> **Important:** SORTING field names use the **original BC field name** (with spaces),
> same as WHERE clauses. Not the `jsonName`. Example: `SORTING(Due Date)` not `SORTING(DueDate)`.

**Common sort patterns:**

```javascript
// Customers A–Z
tableView: 'SORTING(Name) ORDER(Ascending)'

// Most recent entries first
tableView: 'WHERE(Customer No.=CONST(10000)) SORTING(Posting Date,Entry No.) ORDER(Descending)'

// Items by No. ascending
tableView: 'SORTING(No.) ORDER(Ascending)'

// Active customers sorted by balance (highest first)
tableView: 'WHERE(Blocked=CONST( )) SORTING(Balance (LCY)) ORDER(Descending)'
```

### 19.3 tableView Quick Reference

```javascript
// Only active (non-blocked) customers
tableView: "WHERE(Blocked=CONST( ))"

// Specific customer's open ledger entries
tableView: `WHERE(Customer No.=CONST(${custNo}),Open=CONST(true))`

// Sales orders (not invoices) for a customer
tableView: `WHERE(Document Type=CONST(Order),Sell-to Customer No.=CONST(${custNo}))`

// Items with quantity on hand
tableView: "WHERE(Inventory=FILTER(>0))"

// Records modified in date range (combine with startDateTime/endDateTime for SystemModifiedAt)
// Note: tableView date filters apply to regular BC date fields; startDateTime/endDateTime targets SystemModifiedAt
tableView: `WHERE(Posting Date=FILTER(>=${fromDate}&<=${toDate}))`

// Post Code table lookup
tableView: `WHERE(Code=CONST(${postCode}))`

// Check for duplicate customer by registration number
tableView: `WHERE(Registration Number=CONST(${regNo}))`

// Payment Terms table — look up by code
tableView: `WHERE(Code=CONST(${paymentTermsCode}))`

// Gen. Business Posting Group — all unblocked groups
tableView: "WHERE(Blocked=CONST(false))"
```

### 19.4 Client-Side vs Server-Side Sorting

`tableView` SORTING pushes sorting to BC (efficient for large datasets). For small
result sets already in memory, client-side sorting is simpler:

```javascript
function sortRecords(records, jsonFieldName, direction = 'asc') {
  return [...records].sort((a, b) => {
    const valA = a.fields?.[jsonFieldName] ?? a.primaryKey?.[jsonFieldName] ?? '';
    const valB = b.fields?.[jsonFieldName] ?? b.primaryKey?.[jsonFieldName] ?? '';
    
    // Numeric sort
    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA;
    }
    
    // String sort
    const cmp = String(valA).localeCompare(String(valB));
    return direction === 'asc' ? cmp : -cmp;
  });
}

// Usage
const sorted = sortRecords(salesHistory, 'quantity', 'desc');
```

Use **server-side SORTING** when:
- Fetching large datasets with pagination (sort affects which records land on each page)
- You need the BC-native key ordering

Use **client-side sorting** when:
- All records are already loaded (no pagination)
- Sorting by a computed or display value not matching a BC field directly
- User is clicking table column headers after initial load

---

## 20. UI Translations via BC Translation Table

The Bifrost extension includes a `Translation ori` table that enables
**web or integration UIs to store and retrieve their own translatable strings directly
in Business Central**. This means your integration can be fully multi-lingual without
maintaining a separate translation file or service.

### 20.1 How It Works

The translation table has three primary key fields:
- `Source` — identifies the application (e.g. `"BC Portal"`, `"MyWebApp v1"`)
- `Windows Language ID` — the LCID integer as a `Code[10]` string (e.g. `"1039"`)
- `Source Text` — the English string to translate

And one value field:
- `Target Text` — the translated string

Business users fill in translations directly in BC. Your app reads them at runtime.

### 20.2 Fetching UI Translations

```javascript
const UI_STRINGS = [
  'Loading...',
  'Customers',
  'Customer Number',
  'Name',
  'City',
  'Balance',
  'Blocked',
  'Active',
  'Save',
  'Cancel',
  'Search...',
  'No records found',
  // add all UI labels here
];

let uiTranslations = {};

async function loadUiTranslations(companyId, lcid, appSource = 'MyApp') {
  uiTranslations = {};
  if (lcid === 1033) return;  // English — no translation needed
  
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableName: 'Translation ori',
      tableView: `WHERE(Windows Language ID=CONST(${lcid}),Source=CONST(${appSource}))`,
      take: UI_STRINGS.length + 50
    })
  });
  
  for (const rec of (res.result || [])) {
    const src = rec.primaryKey?.SourceText;
    const tgt = rec.fields?.TargetText;
    if (src && tgt) uiTranslations[src] = tgt;
  }
}

// Translation helper with English fallback
function t(s) {
  return uiTranslations[s] || s;
}
```

### 20.3 Auto-Creating Placeholder Records for Missing Translations

When a language is selected but some strings are not yet translated in BC, create
placeholder records automatically. Business users can then fill them in via the standard
BC UI.

```javascript
async function ensureTranslationPlaceholders(companyId, lcid, appSource = 'MyApp') {
  // Find which strings are missing
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableName: 'Translation ori',
      tableView: `WHERE(Windows Language ID=CONST(${lcid}),Source=CONST(${appSource}))`,
      take: UI_STRINGS.length + 50
    })
  });
  
  const existing = new Set((res.result || []).map(r => r.primaryKey?.SourceText));
  const missing  = UI_STRINGS.filter(s => !existing.has(s));
  
  if (!missing.length) return;
  
  // Insert placeholder records with empty TargetText
  await cePost(companyId, {
    type: 'Data.Records.Set',
    subject: 'Translation ori',
    data: JSON.stringify({
      data: missing.map(s => ({
        primaryKey: {
          Source: appSource,
          WindowsLanguageID: String(lcid),
          SourceText: s
        },
        fields: { TargetText: '' }
      }))
    })
  });
}
```

### 20.4 Applying Translations to HTML

Use `data-t` and `data-tp` (placeholder) attributes on HTML elements:

```html
<!-- Text content -->
<span data-t="Customers">Customers</span>
<button data-t="Save">Save</button>
<h2 data-t="Customer Number">Customer Number</h2>

<!-- Input placeholder -->
<input data-tp="Search..." placeholder="Search...">
```

Apply after loading:
```javascript
function applyUiTranslations() {
  document.querySelectorAll('[data-t]').forEach(el => {
    el.textContent = t(el.dataset.t);
  });
  document.querySelectorAll('[data-tp]').forEach(el => {
    el.placeholder = t(el.dataset.tp);
  });
}
```

### 20.5 Language Selector

Use the **`Allowed Language`** table (3563) — not the `Language` table — to get the
languages that are enabled for use in this BC environment.

| Field No. | BC Field Name | `jsonName` | Description |
|---|---|---|---|
| 1 | `Language Id` | `LanguageId` | Windows Language ID (LCID integer) — matches `Windows Language ID` on the Language table |
| 2 | `Language` | `Language` | Display name (e.g. `"English"`, `"Icelandic"`) |

```javascript
async function loadLanguages(companyId) {
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableNumber: 3563,   // Allowed Language
      fieldNumbers: [1, 2] // Language Id (LCID), Language (display name)
    })
  });

  return (res.result || []).map(rec => ({
    lcid: rec.primaryKey.LanguageId ?? parseInt(rec.fields.LanguageId, 10),
    name: rec.fields.Language ?? ''
  }));
}
```

> The `Language Id` value from `Allowed Language` is the Windows Language ID (LCID)
> and maps directly to the `lcid` field used in Bifrost message envelopes and to
> the `Windows Language ID` field on the `Language` table (8).
```

### 20.6 Full Language-Change Workflow

```javascript
let selectedLcid = 1033;
let fieldMetaCache = {};
let uiTranslations = {};

async function onLanguageChange(newLcid, companyId) {
  selectedLcid = newLcid;
  
  // Clear caches — captions and translations are language-specific
  fieldMetaCache = {};
  uiTranslations = {};
  
  // Reload translations and refresh UI
  await loadUiTranslations(companyId, newLcid);
  await ensureTranslationPlaceholders(companyId, newLcid);
  applyUiTranslations();
  
  // Reload any data that shows captions (e.g. enum fields, table captions)
  await refreshCurrentView();
}
```

### 20.7 Using Field Captions as Column Headers

After calling `Help.Fields.Get` with a `lcid`, the `caption` for each field is the
localised column header. This means column headers in your UI automatically match the
BC field label in the user's language:

```javascript
async function buildTableHeaders(companyId, tableName, fieldNumbers, lcid) {
  const meta = await getFieldMeta(companyId, tableName, lcid, fieldNumbers);
  
  // meta[i].caption is already in the user's language
  return fieldNumbers
    .map(no => meta.find(f => f.id === no))
    .filter(Boolean)
    .map(f => ({ fieldNo: f.id, jsonName: f.jsonName, caption: f.caption }));
}

// Example output for Customer fields [1, 2, 7, 102] with lcid=1039 (Icelandic):
// [
//   { fieldNo: 1,   jsonName: "No_",  caption: "Nr." },
//   { fieldNo: 2,   jsonName: "Name", caption: "Heiti" },
//   { fieldNo: 7,   jsonName: "City", caption: "Bær" },
//   { fieldNo: 102, jsonName: "EMail", caption: "Tölvupóstur" }
// ]
```

---

## 21. Looking Up Reference Data (Dropdowns / Lookup Tables)

Many BC fields have table relations — the field value is a code that references another
table. Use `Data.Records.Get` with specific `fieldNumbers` to populate dropdowns.

### Common Lookup Table Reference

```javascript
const LOOKUP_TABLES = {
  paymentTerms: { tableNo: 3,   fields: [1, 5],        pkField: 'Code',        labelField: 'Description' },
  currency:     { tableNo: 4,   fields: [1, 15],       pkField: 'Code',        labelField: 'Description' },
  language:     { tableNo: 8,   fields: [1, 2, 3],     pkField: 'Code',        labelField: 'Name' },
  salesperson:  { tableNo: 13,  fields: [1, 2],        pkField: 'Code',        labelField: 'Name' },
  location:     { tableNo: 14,  fields: [1, 2],        pkField: 'Code',        labelField: 'Name' },
  customerPostingGroup: { tableNo: 92,  fields: [1, 20], pkField: 'Code',      labelField: 'Description' },
  postCode:     { tableNo: 225, fields: [1, 2, 4, 5],  pkField: 'Code',        labelField: 'City' },
  genBusPostingGroup: { tableNo: 250, fields: [1, 2, 3], pkField: 'Code',      labelField: 'Description' },
  paymentMethod: { tableNo: 289, fields: [1, 2],       pkField: 'Code',        labelField: 'Description' },
  vatBusPostingGroup: { tableNo: 323, fields: [1, 2],  pkField: 'Code',        labelField: 'Description' },
};

async function loadLookup(companyId, def) {
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({ tableNumber: def.tableNo, fieldNumbers: def.fields, take: 500 })
  });
  return (res.result || []).map(rec => ({
    value: rec.primaryKey[def.pkField] ?? rec.primaryKey[Object.keys(rec.primaryKey)[0]],
    label: rec.fields[def.labelField] ?? '',
    raw: rec
  }));
}

// Load all lookups in parallel
const [payTerms, currencies, locations] = await Promise.all([
  loadLookup(companyId, LOOKUP_TABLES.paymentTerms),
  loadLookup(companyId, LOOKUP_TABLES.currency),
  loadLookup(companyId, LOOKUP_TABLES.location),
]);
```

### Post Code Auto-Fill Pattern

```javascript
async function onPostCodeBlur(companyId, postCode) {
  if (!postCode) return;
  
  const res = await cePost(companyId, {
    type: 'Data.Records.Get',
    data: JSON.stringify({
      tableNumber: 225,  // Post Code
      fieldNumbers: [1, 2, 4, 5],  // Code, City, Country/Region Code, County
      tableView: `WHERE(Code=CONST(${postCode}))`
    })
  });
  
  if (res.result?.length) {
    const rec = res.result[0];
    return {
      city:          rec.fields.City2 ?? rec.fields.City ?? '',   // check jsonName via Help.Fields.Get
      countryCode:   rec.fields.CountryRegionCode ?? '',
      county:        rec.fields.County ?? ''
    };
  }
  return null;
}
```

### Gen. Bus. Posting Group → VAT Bus. Posting Group Auto-Fill

```javascript
// Load Gen. Bus. Posting Groups with field 3 (Def. VAT Bus. Posting Group)
const genBusGroups = await loadLookup(companyId, LOOKUP_TABLES.genBusPostingGroup);
const genBusToVATMap = Object.fromEntries(
  genBusGroups.map(g => [g.value, g.raw.fields.Def_VATBusPostingGroup ?? ''])
);

function onGenBusChange(selectedCode) {
  const vatCode = genBusToVATMap[selectedCode] || '';
  document.getElementById('vat-bus-posting-group').value = vatCode;
}
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

---

## 23. BC Metadata MCP Server

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
