---
id: 17-dynamic-schema-discovery
title: "17. Dynamic Schema Discovery"
sidebar_label: "17. Dynamic Schema Discovery"
sidebar_position: 19
---

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
