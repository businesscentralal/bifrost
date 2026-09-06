# Help and discovery

How an agent finds out what an environment actually offers before it calls anything: the `Help.*` message types (tables, fields, message types, implementation docs, permissions, next line number, page URLs, table relations, who am I) and the dynamic schema-discovery patterns built on them, including field-metadata caching.

[← back to SKILL.md](../SKILL.md) · originally sections 7.2, 17 of the single-file skill.

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
