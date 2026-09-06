---
id: metadata
title: "Metadata and help message types"
sidebar_position: 2
---

This document describes the Metadata (Help) message types available in the Bifrost API for retrieving system metadata and documentation.

**Parent Document:** [API_Reference.md](/foundation/reference/api/)

**Implementation Folder:** `app/src/Message Type/Implementations/Metadata/` and `app/src/Message Type/Implementations/Field/`

---

## Overview

Metadata message types provide operations for discovering and understanding the Business Central database structure, available message types, field metadata, and user permissions. These message types are essential for building dynamic integrations that adapt to the database schema and available functionality.

**Available Message Types:**

| Message Type | Description | Direction |
|--------------|-------------|-----------|
| Help.Tables.Get | Returns a list of all available tables with their ID, name, caption, dataPerCompany flag, namespace, and read/write restriction flags | Outbound |
| Help.Fields.Get | Retrieves field metadata for a specified table | Outbound |
| Help.MessageTypes.Get | Returns a list of all available message types with metadata | Outbound |
| Help.Implementation.Get | Returns help documentation for a specified message type | Outbound |
| Help.Permissions.Get | Retrieves current user's permissions for a specified table | Outbound |
| Help.NextLineNo.Get | Returns the next available line number for a table whose last PK field is an Integer | Outbound |
| Help.PageUrl.Get | Returns the Business Central web URL for the card page of a specific record | Outbound |
| Help.TableRelations.Get | Returns all foreign-key relationships for a table field including conditional relation branches and reverse relations (fields referencing this field) | Outbound |
| Help.Bifrost.Get | Returns a short directory of the Help.* discovery endpoints and points the caller to Help.Implementation.Get for the full Bifrost API how-to guide | Outbound |
| Field.Translation.Get | Retrieves BC system translations for a specific record field | Outbound |
| Field.Translation.Set | Writes or deletes BC system translations for a record field | Inbound |
| Field.Translations.Get | Retrieves BC system translations for all fields (or a specific field) on a record | Outbound |
| Help.WhoAmI.Get | Returns comprehensive user profile: identity, roles, linked records, and per-user system prompt | Outbound |

---

## 1. Help.Tables.Get {#helptablesget}

**Purpose:** Retrieve a list of all available tables in the database.

**Description:** Returns a list of all available tables in the database with their ID, name, caption, and namespace.

**Message Direction:** Outbound

**Input Parameters:**

No parameters are required. Optionally filter to a specific table using any of these methods:

- `tableName` in the data payload (e.g., `"Customer"`)
- `tableNumber` in the data payload (e.g., `18`)
- `tableNo` in the data payload (alias for `tableNumber`)
- `tableId` in the data payload (alias for `tableNumber`)
- `subject` field in the Bifrost envelope — table name or number

When a table is specified, only that table is returned. When omitted, all available tables are returned.

**Language Support:**

To retrieve captions in a specific language, set the `lcid` field (Windows Language ID) at the Bifrost message level (not in the data payload).

**Common LCID Values:**

| LCID | Language |
|------|----------|
| 1033 | English (United States) |
| 1030 | Danish (Denmark) |
| 1031 | German (Germany) |
| 1036 | French (France) |
| 1034 | Spanish (Spain) |
| 1043 | Dutch (Netherlands) |
| 1053 | Swedish (Sweden) |
| 1044 | Norwegian (Bokmål) |
| 1039 | Icelandic (Iceland) |

**Response Format:**

```json
{
  "status": "Success",
  "result": [
    {
      "id": 18,
      "name": "Customer",
      "caption": "Customer",
      "dataPerCompany": true,
      "namespace": "Microsoft.Sales.Customer",
      "readRestricted": false,
      "writeRestricted": false
    },
    {
      "id": 23,
      "name": "Vendor",
      "caption": "Vendor",
      "dataPerCompany": true,
      "namespace": "Microsoft.Purchases.Vendor",
      "readRestricted": false,
      "writeRestricted": false
    }
  ]
}
```

**Response Fields:**

- `id`: Numeric table ID
- `name`: Table name
- `caption`: Table caption in the requested language (or default language from Bifrost Setup if lcid not specified)
- `dataPerCompany`: Boolean — `true` if the table stores data per company; `false` for shared (global) tables
- `namespace`: AL namespace of the table (e.g., `"Microsoft.Sales.Customer"`) — empty string for tables without a namespace
- `readRestricted`: Boolean — `true` when the table is blocked from `Data.Records.Get`. Internal Bifrost / Change Log system tables and non-normal table types are read-restricted.
- `writeRestricted`: Boolean — `true` when the table is blocked from `Data.Records.Set`. Covers all read-restricted tables plus `Message ori` (read-allowed, write-blocked).

**Notes:**

- Returns all tables in the system
- If lcid field is provided at the message level, captions will be returned in the specified language
- If lcid is not specified, the Default Language Code from Bifrost Setup is used
- The system will temporarily switch to the requested language, retrieve captions, then restore the previous language
- Message Direction: Outbound
- Filter Table No: 0

**Usage Examples:**

*Example 1 — Return all tables (no table filter required):*
```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0"
}
```

*Example 2 — Filter to a specific table via `tableName` in data:*
```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "data": {
    "tableName": "Customer"
  }
}
```

*Example 3 — Filter to a specific table via `subject` field:*
```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "subject": "Customer"
}
```

*Example 4 — All tables with a specific language:*
```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "lcid": 1033
}
```

**Use Cases:**

- **Schema Discovery**: Discover available tables in the database
- **Dynamic UI Generation**: Build dynamic user interfaces based on available tables
- **Multi-Language Support**: Retrieve table captions in user's preferred language
- **Documentation**: Generate system documentation automatically

---

## 2. Help.Fields.Get {#helpfieldsget}

**Purpose:** Retrieve field metadata for a specified table.

**Description:** Retrieves field metadata for a specified table including field number, name, caption, type, length, and primary key status.

**Message Direction:** Outbound

**Input Parameters (Option 1 - via data, tableName):**

```json
{
  "tableName": "Customer"
}
```

**Input Parameters (Option 2 - via data, tableNumber / tableNo / tableId):**

```json
{
  "tableNumber": 18
}
```

**Input Parameters (Option 3 - via subject):**

Set the `subject` field to the table name or number (e.g., `"Customer"` or `"18"`)

**Input Parameters (Option 4 - specific fields):**

```json
{
  "tableName": "Customer",
  "fieldNumbers": [1, 2, 21, 61]
}
```

**Parameters:**

- **Table identification** (one of the following is required):
  - `tableName`: Name of the table (e.g., `"Customer"`, `"Item"`)
  - `tableNumber`: Table ID number (e.g., `18` for Customer)
  - `tableNo`: Table ID number (alias for `tableNumber`)
  - `tableId`: Table ID number (alias for `tableNumber`)
  - `subject` in Bifrost envelope: Table name or number
  - Evaluated in this order: `tableName` → `tableNumber` → `tableNo` → `tableId` → `subject`
- `fieldNumbers` (optional): Array of field numbers to return. When specified, only the listed fields are returned. When omitted, all Normal, FlowField, and FlowFilter class fields are returned.

**Language Support:**

To retrieve captions in a specific language, set the `lcid` field (Windows Language ID) at the Bifrost message level (not in the data payload).

**Common LCID Values:**

| LCID | Language |
|------|----------|
| 1033 | English (United States) |
| 1030 | Danish (Denmark) |
| 1031 | German (Germany) |
| 1036 | French (France) |
| 1034 | Spanish (Spain) |
| 1043 | Dutch (Netherlands) |
| 1053 | Swedish (Sweden) |
| 1044 | Norwegian (Bokmål) |

**Response Format:**

```json
{
  "status": "Success",
  "result": [
    {
      "id": 1,
      "name": "No.",
      "jsonName": "No_",
      "caption": "No.",
      "class": "Normal",
      "type": "Code",
      "len": 20,
      "isPartOfPrimaryKey": true,
      "readRestricted": false,
      "writeRestricted": false
    },
    {
      "id": 2,
      "name": "Name",
      "jsonName": "Name",
      "caption": "Name",
      "class": "Normal",
      "type": "Text",
      "len": 100,
      "isPartOfPrimaryKey": false,
      "readRestricted": false,
      "writeRestricted": false
    },
    {
      "id": 21,
      "name": "Balance (LCY)",
      "jsonName": "BalanceLCY",
      "caption": "Balance (LCY)",
      "class": "FlowField",
      "type": "Decimal",
      "len": 0,
      "isPartOfPrimaryKey": false,
      "readRestricted": false,
      "writeRestricted": true
    },
    {
      "id": 35,
      "name": "Date Filter",
      "jsonName": "DateFilter",
      "caption": "Date Filter",
      "class": "FlowFilter",
      "type": "Date",
      "len": 0,
      "isPartOfPrimaryKey": false,
      "readRestricted": false,
      "writeRestricted": false
    },
    {
      "id": 3,
      "name": "Blocked",
      "jsonName": "Blocked",
      "caption": "Blocked",
      "class": "Normal",
      "type": "Option",
      "len": 0,
      "isPartOfPrimaryKey": false,
      "readRestricted": false,
      "writeRestricted": false,
      "enum": [
        { "value": " ", "caption": " ", "ordinal": 0 },
        { "value": "Ship", "caption": "Ship", "ordinal": 1 },
        { "value": "Invoice", "caption": "Invoice", "ordinal": 2 },
        { "value": "All", "caption": "All", "ordinal": 3 }
      ]
    }
  ]
}
```

**Field Metadata:**

- `id`: Field number
- `name`: Field name
- `jsonName`: Normalized field name used in JSON responses (special characters replaced with underscores)
- `caption`: Field caption in the requested language (or default language from Bifrost Setup if lcid not specified)
- `class`: Field class — `"Normal"` for regular fields, `"FlowField"` for calculated fields, `"FlowFilter"` for filter-dimension fields (used in `tableView`)
- `type`: Field data type
- `len`: Field length (0 for numeric, option, and FlowField fields)
- `isPartOfPrimaryKey`: Whether the field is part of the primary key
- `readRestricted`: Whether the current user is read-restricted on this field via `Field Access ori` (restriction type `Both` or `Read`, or a matching wildcard). When `true`, `Data.Records.Get` silently drops this field from the response.
- `writeRestricted`: Whether the current user is write-restricted on this field via `Field Access ori` (restriction type `Both` or `Write`, or a matching wildcard). When `true`, `Data.Records.Set` rejects writes to this field.
- `enum` (only for Option fields): Array of enum values, each with `value` (internal name), `caption` (display text), and `ordinal` (integer value)

**Notes:**

- Returns enabled, non-obsolete Normal, FlowField, and FlowFilter class fields
- When `fieldNumbers` is specified, only the listed fields are returned
- Table can be specified via data payload (`tableName`, `tableNumber`, `tableNo`, `tableId`) or `subject` field in the Bifrost envelope
- FlowFields are included in all results and are identified by `class: "FlowField"`
- FlowFilter fields are included in all results and are identified by `class: "FlowFilter"`. These are filter-dimension fields — use them in `tableView` WHERE clauses, not in field value lists
- Option fields include an `enum` array describing all valid values with their internal name, display caption, and ordinal
- If lcid field is provided at the message level, captions will be returned in the specified language
- If lcid is not specified, the Default Language Code from Bifrost Setup is used
- The system will temporarily switch to the requested language, retrieve captions, then restore the previous language
- Message Direction: Outbound
- Filter Table No: 0

**Example Request:**

```json
{
  "specversion": "1.0",
  "type": "Help.Fields.Get",
  "source": "MyIntegrationApp v1.0",
  "subject": "Customer",
  "lcid": 1033
}
```

**Use Cases:**

- **Dynamic Form Generation**: Build forms dynamically based on field metadata
- **Data Validation**: Understand field types, lengths, and constraints
- **Mapping Configuration**: Map external system fields to Business Central fields
- **Query Builder**: Build dynamic queries with proper field types
- **Multi-Language UI**: Display field captions in user's preferred language

---

## 3. Help.MessageTypes.Get {#helpmessagetypesget}

**Purpose:** Retrieve a list of all available message types with their metadata.

**Description:** Returns a list of all available message types with their metadata including filter table number, description, and message direction.

**Message Direction:** Outbound

**Input Parameters:**

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|----------|-------------|
| `subject` | Bifrost field | Text | No | When set, returns only the message type matching this exact name. Omit to return all. |
| `onlyEnabled` | data (JSON body) | Boolean | No | When `true`, returns only message types enabled for the current user. Default: `false` (returns all). |

**Request — single message type by name:**

```json
{
  "type": "Help.MessageTypes.Get",
  "subject": "Data.Records.Get"
}
```

**Request — only enabled types:**

```json
{
  "type": "Help.MessageTypes.Get",
  "data": { "onlyEnabled": true }
}
```

**Response Format:**

```json
{
  "status": "Success",
  "result": [
    {
      "name": "Data.RecordIds.Get",
      "isEnabled": true,
      "filterTableNo": 0,
      "description": "Retrieves record IDs and modification timestamps for records in a specified table within a date/time range.",
      "messageDirection": "Outbound"
    },
    {
      "name": "Help.Tables.Get",
      "isEnabled": true,
      "filterTableNo": 0,
      "description": "Returns a list of all available tables in the database with their ID and name.",
      "messageDirection": "Outbound"
    },
    {
      "name": "Help.Fields.Get",
      "isEnabled": true,
      "filterTableNo": 0,
      "description": "Retrieves field metadata for a specified table including field number, name, type, length, and primary key status.",
      "messageDirection": "Outbound"
    },
    {
      "name": "Help.MessageTypes.Get",
      "isEnabled": true,
      "filterTableNo": 0,
      "description": "Returns a list of all available message types with their metadata including filter table number, description, and message direction.",
      "messageDirection": "Outbound"
    }
  ]
}
```

**Metadata Fields:**

- `name`: Message type name
- `isEnabled`: `true` if the current user has permission to use this message type
- `filterTableNo`: Table number filter (if applicable, 0 means applies to all tables)
- `description`: Description of the message type
- `messageDirection`: Direction of the message (Inbound/Outbound/Both)

**Notes:**

- Returns all message types defined in the BifrostMessageType enum
- Calls interface methods to retrieve metadata for each message type
- Pass `subject` to retrieve metadata for a single message type by exact name (result array contains at most one element)
- Pass `onlyEnabled: true` to filter out message types the user lacks permission for
- `isEnabled` reflects whether the user has the required table/posting permissions for that type
- Both `subject` and `onlyEnabled` can be combined
- Includes both built-in and custom message types (if extensions are installed)
- Message Direction: Outbound
- Filter Table No: 0

**Example Request:**

```json
{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0"
}
```

**Use Cases:**

- **API Discovery**: Discover all available message types dynamically
- **Integration Configuration**: Build configuration UI showing available operations
- **Documentation Generation**: Automatically generate API documentation
- **Capability Detection**: Determine which features are available in the current system
- **Version Management**: Compare available message types across different environments

---

## 4. Help.Implementation.Get {#helpimplementationget}

**Purpose:** Retrieve the help documentation for a specified message type.

**Description:** Returns the help documentation for a specified message type. Specify the message type name in the subject field.

**Message Direction:** Outbound

**Input Parameters:**

The message type name must be specified in the **subject** field:

```json
{
  "subject": "Help.Tables.Get"
}
```

**Response Format:**

Returns the help documentation in **text/markdown** format. The response contains detailed documentation including:

- Overview of the message type functionality
- Request format and parameters
- Response structure
- Examples
- Error cases
- Best practices

**Example Usage:**

Request help for Help.Fields.Get:

```json
{
  "specversion": "1.0",
  "type": "Help.Implementation.Get",
  "subject": "Help.Fields.Get",
  "source": "MyIntegrationApp v1.0"
}
```

**Error Cases:**

1. **Missing Subject Field**
   - Error: "Subject field must contain the message type name (e.g., 'Help.Tables.Get')"
   - Occurs when subject field is empty or not provided

2. **Invalid Message Type**
   - Error: "Message type '&#123;name&#125;' is not valid or not found."
   - Occurs when the specified message type does not exist

**Notes:**

- Use **Help.MessageTypes.Get** to discover all available message types first
- Cache help documentation on the client side to reduce API calls
- Response content type is set to `text/markdown`
- Documentation is generated from help codeunits implementing the message type interface
- Message Direction: Outbound
- Filter Table No: 0

**Use Cases:**

- **Self-Documenting API**: Provide inline documentation to developers
- **Developer Portal**: Build interactive API documentation portals
- **Code Generation**: Generate client code based on message type documentation
- **Training Materials**: Extract documentation for training and onboarding
- **Integration Testing**: Use documentation to validate request/response formats

---

## 5. Help.Permissions.Get {#helppermissionsget}

**Purpose:** Retrieve current user's read and write permissions for a specified table.

**Description:** Retrieves current user's read and write permissions for a specified table using RecordRef.ReadPermission() and RecordRef.WritePermission() methods.

**Message Direction:** Outbound

**Input Parameters (Option 1 - via data, tableName):**

```json
{
  "tableName": "Customer"
}
```

**Input Parameters (Option 2 - via data, tableNumber / tableNo / tableId):**

```json
{
  "tableNumber": 18
}
```

**Input Parameters (Option 3 - via subject):**

Set the `subject` field to the table name or number (e.g., `"Customer"` or `"18"`)

**Parameters:**

- **Table identification** (one of the following is required):
  - `tableName`: Name of the table (e.g., `"Customer"`, `"Item"`)
  - `tableNumber`: Table ID number (e.g., `18` for Customer)
  - `tableNo`: Table ID number (alias for `tableNumber`)
  - `tableId`: Table ID number (alias for `tableNumber`)
  - `subject` in Bifrost envelope: Table name or number
  - Evaluated in this order: `tableName` → `tableNumber` → `tableNo` → `tableId` → `subject`

**Response Format:**

```json
{
  "status": "Success",
  "permissions": {
    "read": true,
    "write": false
  }
}
```

**Permission Fields:**

- `read`: Boolean indicating if the current user has read permission for the table
- `write`: Boolean indicating if the current user has write (insert/modify/delete) permission for the table

**Notes:**

- Returns current user's actual permissions at the time of the request
- Table can be specified via data payload (`tableName`, `tableNumber`, `tableNo`, `tableId`) or `subject` field in the Bifrost envelope
- Read permission checks if user can read from the table
- Write permission checks if user can insert, modify, or delete records
- Permissions are based on the authenticated user making the API call
- Message Direction: Outbound
- Filter Table No: 0

### Permission Layers

Data access through the Bifrost API is gated by **two independent layers**. A request only succeeds when both layers allow it.

1. **BC permission** (reported by this message type)
   - Source: BC permission sets assigned to the user, plus `InherentPermissions` on AL objects.
   - Scope: whole table (read / insert / modify / delete).
   - When denied: `Data.Records.*` returns a permission error from the BC platform.
2. **Bifrost restrictions** (configured per user in `Field Access ori`)
   - Source: the `Field Access ori` table maintained by Bifrost administrators.
   - Scope: per table **and** per field, with restriction types `Read`, `Write`, `Both`, or `Bypass`.
   - When denied: `Data.Records.Get` silently drops the field from the response; `Data.Records.Set` rejects the write with an error; Create message types (`Sales.Document.Create`, `Purchase.Document.Create`, `Inventory.AssemblyOrder.Create`, `Inventory.TransferOrder.Create`, `Finance.BankReconciliation.Create`) refuse to create the record when the principal field is write-restricted.

#### Effective access matrix

| BC `read` | Bifrost read restriction | Effective read |
|-----------|-------------------------------|----------------|
| true | none | Field is returned |
| true | `Read` or `Both` | Field is dropped from response (silently) |
| false | any | Whole request fails with BC permission error |

| BC `write` | Bifrost write restriction | Effective write |
|------------|--------------------------------|-----------------|
| true | none | Value is written |
| true | `Write` or `Both` | Write is rejected with an error mentioning the field and value |
| false | any | Whole request fails with BC permission error |

### How to Resolve the Full Picture

To know whether the current user can actually read or write a given table or field, query all three sources and combine them:

1. **BC permission on the table** — call `Help.Permissions.Get` (this message type). Reads `permissions.read` and `permissions.write`.
2. **Bifrost restriction on the table** — call `Help.Tables.Get` with the table identifier. Each table in the result includes `readRestricted` and `writeRestricted` table-level flags.
3. **Bifrost restriction on individual fields** — call `Help.Fields.Get` with the table identifier. Each field in the result includes `readRestricted` and `writeRestricted` flags resolved against the **current user**.

Combine the layers:

- `canReadField = Help.Permissions.Get.permissions.read AND NOT Help.Tables.Get.readRestricted AND NOT Help.Fields.Get.readRestricted`
- `canWriteField = Help.Permissions.Get.permissions.write AND NOT Help.Tables.Get.writeRestricted AND NOT Help.Fields.Get.writeRestricted`

**Example Requests:**

Using a simple table name:
```json
{
  "specversion": "1.0",
  "type": "Help.Permissions.Get",
  "source": "MyIntegrationApp v1.0",
  "subject": "Customer"
}
```

Table names with special characters (spaces, `/`) work directly in `subject`:
```json
{
  "specversion": "1.0",
  "type": "Help.Permissions.Get",
  "source": "MyIntegrationApp v1.0",
  "subject": "G/L Account"
}
```

Response for a user with full access:
```json
{
  "status": "Success",
  "permissions": {
    "read": true,
    "write": true
  }
}
```

**Use Cases:**

- **Security Validation**: Verify user has necessary permissions before attempting operations
- **UI Customization**: Show/hide features based on user permissions
- **Audit Trail**: Log permission checks for security audit purposes
- **Pre-flight Checks**: Validate permissions before bulk operations
- **Role-Based Access**: Implement role-based UI elements dynamically
- **Error Prevention**: Prevent users from attempting unauthorized operations

**Error Messages:**

- **Table Not Found**: "Table &#123;tableName&#125; not found."

---

## 6. Help.NextLineNo.Get {#helpnextlinenoget}

**Purpose:** Return the next available Line No. for any table whose last primary key field is an Integer.

**Description:** Given parent primary key values (via a `primaryKey` JSON object or a `SystemId`), the implementation filters on those parent fields, calls `FindLast`, and returns the next value as `lastLineNo + increment`. The response contains a complete `primaryKey` object that can be passed directly to `Data.Records.Set`.

**Message Direction:** Outbound

**Input Parameters:**

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Text / Integer | Target table (standard table identification) |
| `primaryKey` | Yes* | Object | Parent PK field values (all except last Integer field) |
| `id` | Yes* | GUID | SystemId of an existing record in the table |
| `increment` | No | Integer | Value to add to last line no. Default: 10000. Must be > 0 |

\* Exactly one of `primaryKey` or `id` must be provided. If both are present, `id` takes precedence.

**Response Format:**

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

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Success"` or `"Error"` |
| `primaryKey` | Object | Complete primary key with all parent fields plus the last field set to next value |

**Usage Example (primaryKey):**

```json
{
  "specversion": "1.0",
  "type": "Help.NextLineNo.Get",
  "source": "external",
  "id": "nextlineno-001",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Sales Line",
    "primaryKey": {
      "DocumentType": "Order",
      "DocumentNo": "S-ORD-001"
    },
    "increment": 10000
  }
}
```

**Usage Example (SystemId):**

```json
{
  "specversion": "1.0",
  "type": "Help.NextLineNo.Get",
  "source": "external",
  "id": "nextlineno-002",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Sales Line",
    "id": "a0e2b3c4-d5e6-7890-abcd-ef1234567890"
  }
}
```

**Error Messages:**

- **Table Not Found**: "Table &#123;tableName&#125; not found."
- **Last PK Not Integer**: "The last primary key field of table '&#123;tableName&#125;' (&#123;fieldName&#125;) is not an Integer field."
- **Too Few PK Fields**: "Table '&#123;tableName&#125;' must have at least two primary key fields."
- **Missing Input**: "Either 'primaryKey' or 'id' must be provided."
- **Missing PK Field Value**: "Missing value for primary key field '&#123;fieldName&#125;'."
- **Record Not Found by Id**: "Record with SystemId '&#123;id&#125;' not found in table '&#123;tableName&#125;'."
- **Invalid Increment**: "Increment must be greater than zero."
- **No Read Permission**: "You do not have read permission on table '&#123;tableName&#125;'."

---

## Help.PageUrl.Get

**Purpose:** Return the Business Central web URL for the card page of a specific record.

**Description:** Resolves a table and a record SystemId using the standard argument-table request formats, determines the conditional card page via codeunit `Page Management`, and returns the resolved web URL. The response is only successful when a non-empty URL is returned.

**Message Direction:** Outbound

**Input Parameters:**

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes* | Text / Integer | Target table (standard table identification) |
| `subject` | Yes* / Yes** | Text | May contain either the table identifier or a record SystemId GUID |
| `id` / `systemId` / `recordId` / `recordSystemId` | Yes** | GUID | SystemId of the target record |

\* A table identifier is required.
\*\* A record identifier is required.

**Response Format:**

**Response Content Type:** `text/json`

```json
{
  "status": "Success",
  "url": "https://businesscentral.dynamics.com/..."
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Success"` when a non-empty page URL was resolved |
| `url` | String | Resolved card page URL |

**Usage Example (table in data, record id in data):**

```json
{
  "specversion": "1.0",
  "type": "Help.PageUrl.Get",
  "source": "external",
  "id": "pageurl-001",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Customer",
    "id": "a0e2b3c4-d5e6-7890-abcd-ef1234567890"
  }
}
```

**Usage Example (table in subject, recordSystemId in data):**

```json
{
  "specversion": "1.0",
  "type": "Help.PageUrl.Get",
  "source": "external",
  "subject": "Customer",
  "datacontenttype": "application/json",
  "data": {
    "recordSystemId": "a0e2b3c4-d5e6-7890-abcd-ef1234567890"
  }
}
```

**Error Messages:**

- **Missing Table Identifier**: "Table identifier is required. Provide tableName, tableNumber, tableNo, tableId, or subject."
- **Missing Record Identifier**: "Record identifier is required. Provide id, systemId, recordId, recordSystemId, or a GUID subject."
- **Record Not Found**: "Record not found in table &#123;tableId&#125; with SystemId &#123;guid&#125;."
- **No Card Page URL**: "No card page URL could be resolved for table '&#123;tableCaption&#125;' and record &#123;guid&#125;."

---

## 7. Field.Translation.Get {#fieldtranslationget}

**Purpose:** Retrieve BC system translations for a specific field on a record.

**Description:** Retrieves a stored translation for a record field using codeunit 3711 "Translation". Requires a specific language (lcid). Returns a flat JSON response with the translation value.

**Message Direction:** Outbound

**Input Parameters:**

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Text / Integer | Target table (standard table identification) |
| `systemId` / `id` | Yes* | GUID | Record SystemId (* or use subject field as GUID) |
| `fieldId` / `fieldNo` | Yes | Integer | Target field ID on the table |
| `lcid` | Yes | Integer | Windows Language ID (required). |

**Note:** The `lcid` parameter must be provided in the request JSON data payload, not at the Bifrost message level.

**Record Identification:** The record is identified by its SystemId (GUID). Provide `systemId` or `id` in the data payload. Both parameter names are accepted as aliases.

**Response Format:**

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

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | Text | `"Success"` or `"Error"` |
| `tableId` | Integer | Table number |
| `systemId` | GUID | Record SystemId (no braces) |
| `fieldId` | Integer | Field ID |
| `lcid` | Integer | Windows Language ID |
| `value` | Text | Translated value (blank if no translation exists) |

**Usage Examples:**

*Example — Get translation for a specific language:*
```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Get",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": {
    "systemId": "12345678-1234-1234-1234-123456789012",
    "fieldId": 3,
    "lcid": 1030
  }
}
```

**Error Messages:**

| Condition | Error Message |
|-----------|---------------|
| Missing table identification | Standard `EvaluateTableId` error |
| Missing record identification | "Request must specify systemId or id parameter (record SystemId as GUID)." |
| Missing field identification | "Request must specify fieldId or fieldNo parameter." |
| Missing lcid parameter | "Request must specify lcid parameter (language identifier)." |
| Record not found | "Record not found in table &#123;tableId&#125; with SystemId &#123;systemId&#125;." |

---

## 8. Field.Translation.Set {#fieldtranslationset}

**Purpose:** Write or delete a BC system translation for a specific field on a record.

**Description:** Writes a single translation for a record field using codeunit 3711 "Translation". To delete a translation, send a blank value for the specified language.

**Message Direction:** Inbound

**Input Parameters:**

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Text / Integer | Target table (standard table identification) |
| `systemId` / `id` | Yes | GUID | Record SystemId (provided in data payload) |
| `fieldId` / `fieldNo` | Yes | Integer | Target field ID on the table |
| `lcid` | Yes | Integer | Windows Language ID |
| `value` | No | Text | Translated value (max 2048 chars). Blank or omitted deletes the translation. |

**Record Identification:** Same as Field.Translation.Get — provide `systemId` or `id` in the data payload.

**Response Format:**

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

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | Text | `"Success"` or `"Error"` |
| `tableId` | Integer | Table number |
| `systemId` | GUID | Record SystemId (no braces) |
| `fieldId` | Integer | Field ID |
| `lcid` | Integer | Windows Language ID that was set |
| `value` | Text | Value that was written (blank if deleted) |

**Usage Examples:**

*Example 1 — Set translation for a field (Danish):*
```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Set",
  "source": "MyApp v1.0",
  "data": {
    "tableName": "Item",
    "systemId": "12345678-1234-1234-1234-123456789012",
    "fieldId": 3,
    "lcid": 1030,
    "value": "Skrivebord i trae"
  }
}
```

*Example 2 — Delete translation (send blank value):*
```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Set",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": {
    "systemId": "12345678-1234-1234-1234-123456789012",
    "fieldId": 3,
    "lcid": 1030,
    "value": ""
  }
}
```

**Error Messages:**

| Condition | Error Message |
|-----------|---------------|
| Missing table identification | Standard `EvaluateTableId` error |
| Missing record identification | "Request must specify systemId or id parameter (record SystemId as GUID)." |
| Missing field identification | "Request must specify fieldId or fieldNo parameter." |
| Missing lcid | "Request must specify lcid parameter (language identifier)." |
| Record not found | "Record not found in table &#123;tableId&#125; with SystemId &#123;systemId&#125;." |

---

## 9. Field.Translations.Get {#fieldtranslationsget}

**Purpose:** Retrieve BC system translations for all fields (or a specific field) on a record.

**Description:** Retrieves all stored translations for a record using codeunit 3711 "Translation". Unlike Field.Translation.Get (singular), this endpoint returns translations across multiple fields, with each entry including the `fieldId`. Optionally filters by field and/or language.

**Message Direction:** Outbound

**Input Parameters:**

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Text / Integer | Target table (standard table identification) |
| `systemId` / `id` | Yes | GUID | Record SystemId (provided in data payload) |
| `fieldId` / `fieldNo` | No | Integer | Target field ID. When omitted or 0, returns translations for ALL fields. |
| `lcid` | No | Integer | Windows Language ID filter. Omit to get all languages. |

**Record Identification:** Provide `systemId` or `id` in the data payload. Both parameter names are accepted as aliases.

**Response Format:**

```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "translationCount": 4,
  "translations": [
    { "fieldId": 3, "languageId": 1030, "value": "Skrivebord" },
    { "fieldId": 3, "languageId": 1040, "value": "Scrivania" },
    { "fieldId": 5, "languageId": 1030, "value": "Trae" },
    { "fieldId": 5, "languageId": 1040, "value": "Legno" }
  ]
}
```

When a specific `fieldId` is requested, the response includes `fieldId` at the root level:

```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "fieldId": 3,
  "translationCount": 2,
  "translations": [
    { "fieldId": 3, "languageId": 1030, "value": "Skrivebord" },
    { "fieldId": 3, "languageId": 1040, "value": "Scrivania" }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | Text | `"Success"` or `"Error"` |
| `tableId` | Integer | Table number |
| `systemId` | GUID | Record SystemId (no braces) |
| `fieldId` | Integer | Field ID (only present when specific field requested) |
| `lcid` | Integer | Language filter (only present when requested) |
| `translationCount` | Integer | Number of translation entries returned |
| `translations` | Array | Array of translation objects |
| `translations[].fieldId` | Integer | Field ID (always included in plural Get) |
| `translations[].languageId` | Integer | Windows Language ID |
| `translations[].value` | Text | Translated value |

**Usage Examples:**

*Example 1 — Get all translations for all fields:*
```json
{
  "specversion": "1.0",
  "type": "Field.Translations.Get",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": {
    "systemId": "12345678-1234-1234-1234-123456789012"
  }
}
```

*Example 2 — Get translations for a specific field:*
```json
{
  "specversion": "1.0",
  "type": "Field.Translations.Get",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": {
    "systemId": "12345678-1234-1234-1234-123456789012",
    "fieldId": 3
  }
}
```

*Example 3 — Get all fields for a specific language:*
```json
{
  "specversion": "1.0",
  "type": "Field.Translations.Get",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": {
    "systemId": "12345678-1234-1234-1234-123456789012",
    "lcid": 1030
  }
}
```

**Error Messages:**

| Condition | Error Message |
|-----------|---------------|
| Missing table identification | Standard `EvaluateTableId` error |
| Missing record identification | "Request must specify systemId or id parameter (record SystemId as GUID)." |
| Record not found | "Record not found in table &#123;tableId&#125; with SystemId &#123;systemId&#125;." |

**Note:** Missing field identification is not an error — fieldId defaults to 0 (all fields).

---

## Integration Patterns

### Pattern 1: Schema Discovery Workflow

**Step 1: Get all tables**
```json
{
  "type": "Help.Tables.Get"
}
```

**Step 2: Get fields for a specific table**
```json
{
  "type": "Help.Fields.Get",
  "subject": "Customer"
}
```

**Step 3: Check user permissions**
```json
{
  "type": "Help.Permissions.Get",
  "subject": "Customer"
}
```

**Step 4: Retrieve data if permitted**
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Customer"
  }
}
```

### Pattern 2: API Capability Discovery

**Step 1: Get all message types**
```json
{
  "type": "Help.MessageTypes.Get"
}
```

**Step 2: Get documentation for specific message type**
```json
{
  "type": "Help.Implementation.Get",
  "subject": "Data.Records.Get"
}
```

### Pattern 3: Multi-Language Application

**Step 1: Get tables in English**
```json
{
  "type": "Help.Tables.Get",
  "lcid": 1033
}
```

**Step 2: Get fields in Icelandic**
```json
{
  "type": "Help.Fields.Get",
  "subject": "Customer",
  "lcid": 1039
}
```

---

## 10. Help.TableRelations.Get {#helptablerelationsget}

**Purpose:** Return all foreign-key relationships defined on a specific table field, including conditional relation branches and reverse relations (fields in other tables that reference this field).

**Description:** Reads from the `Table Relations Metadata` system table (2000000140) to return every relation branch defined for a source table field, plus a `relatedTo` array listing reverse relations — fields in other tables that reference the specified table and field as their foreign-key target. Both table and field identification are required. Fields with multiple conditional relations appear as multiple rows with full condition details.

**Message Direction:** Outbound

**Input Parameters:**

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Yes | Text / Integer | Source table (standard table identification) |
| `fieldId` / `fieldNo` | Yes* | Integer | Field number |
| `fieldName` | Yes* | Text | Field name (used only if `fieldId`/`fieldNo` not supplied) |

\* One of `fieldId`, `fieldNo`, or `fieldName` is required.

**Response Format:**

```json
{
  "status": "Success",
  "tableId": 37,
  "tableName": "Sales Line",
  "relationCount": 2,
  "relations": [
    {
      "tableId": 37,
      "fieldNo": 6,
      "fieldName": "No.",
      "fieldJsonName": "No_",
      "relationNo": 1,
      "relatedTableId": 15,
      "relatedTableName": "G/L Account",
      "relatedFieldNo": 0,
      "relatedFieldName": "(Primary Key)",
      "relatedFieldJsonName": "PrimaryKey",
      "conditionType": "Const",
      "conditionFieldNo": 5,
      "conditionFieldName": "Type",
      "conditionFieldJsonName": "Type",
      "conditionValue": " "
    },
    {
      "tableId": 37,
      "fieldNo": 6,
      "fieldName": "No.",
      "fieldJsonName": "No_",
      "relationNo": 2,
      "relatedTableId": 27,
      "relatedTableName": "Item",
      "relatedFieldNo": 0,
      "relatedFieldName": "(Primary Key)",
      "relatedFieldJsonName": "PrimaryKey",
      "conditionType": "Const",
      "conditionFieldNo": 5,
      "conditionFieldName": "Type",
      "conditionFieldJsonName": "Type",
      "conditionValue": "Item"
    }
  ],
  "relatedToCount": 0,
  "relatedTo": []
}
```

> **Note:** In this example (Sales Line field "No."), `relatedTo` is empty because no other table points to Sales Line.No. as a foreign-key target. For a field like Customer."No.", the `relatedTo` array would contain entries from Sales Header, Sales Line, and other tables that reference Customer.

**Response Fields (envelope):**

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Success"` or `"Error"` |
| `tableId` | Integer | Source table number |
| `tableName` | String | Source table name |
| `relationCount` | Integer | Total number of relation rows returned |
| `relations` | Array | Array of relation objects |
| `relatedToCount` | Integer | Number of reverse relation rows |
| `relatedTo` | Array | Array of reverse relation objects (other fields referencing this field) |

**Relation Object Fields:**

Both `relations` and `relatedTo` arrays use the same object structure:

| Field | Type | Description |
|-------|------|-------------|
| `tableId` | Integer | Source table ID (the table that owns the foreign key) |
| `fieldNo` | Integer | Field number of the source field |
| `fieldName` | String | Name of the source field |
| `fieldJsonName` | String | Source field name as a JSON key (as used by `Data.Records.Get`) |
| `relationNo` | Integer | Branch number distinguishing multiple conditional branches on the same field |
| `relatedTableId` | Integer | Table number of the related table |
| `relatedTableName` | String | Name of the related table |
| `relatedFieldNo` | Integer | Field number in the related table. `0` means the primary key. |
| `relatedFieldName` | String | Name of the related field, or `"(Primary Key)"` when `relatedFieldNo = 0`. |
| `relatedFieldJsonName` | String | Related field name as a JSON key |
| `conditionType` | String | Condition type (see table below) |
| `conditionFieldNo` | Integer | Field number of the condition field (0 if none) |
| `conditionFieldName` | String | Name of the condition field (empty if none) |
| `conditionFieldJsonName` | String | Condition field name as a JSON key (empty if none) |
| `conditionValue` | String | Value that triggers this relation branch |

**Condition Types:**

| Value | Meaning |
|-------|---------|
| `""` (blank) | Unconditional — relation applies regardless of other field values |
| `"TableFilter"` | Relation is active when condition field matches a table filter |
| `"Const"` | Relation is active when condition field equals a constant value |
| `"Filter"` | Relation is active when condition field matches a filter expression |
| `"Field"` | Relation is active when condition field matches another field value |

**Error Handling:**

A field not referenced by other tables returns `relatedToCount: 0` and an empty `relatedTo` array. A field with no outgoing relations returns `relationCount: 0` and an empty `relations` array.

**Usage Example (filter by field name):**

```json
{
  "specversion": "1.0",
  "type": "Help.TableRelations.Get",
  "source": "external",
  "id": "tablerel-001",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Sales Line",
    "fieldName": "No."
  }
}
```

**Usage Example (filter by field number):**

```json
{
  "specversion": "1.0",
  "type": "Help.TableRelations.Get",
  "source": "external",
  "id": "tablerel-002",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Customer",
    "fieldNo": 35
  }
}
```

**Usage Example (filter by table number and field ID):**

```json
{
  "specversion": "1.0",
  "type": "Help.TableRelations.Get",
  "source": "external",
  "id": "tablerel-003",
  "datacontenttype": "application/json",
  "data": {
    "tableNumber": 18,
    "fieldId": 1
  }
}
```
```
{
  "specversion": "1.0",
  "type": "Help.TableRelations.Get",
  "source": "external",
  "id": "tablerel-003",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Customer",
    "fieldId": 35
  }
}
```

**Error Messages:**

- **Table Not Found**: "Table &#123;tableName&#125; not found."
- **Field Required**: "A field identifier (fieldId, fieldNo, or fieldName) is required."
- **Field Not Found**: "Field '&#123;fieldName&#125;' not found in table &#123;tableId&#125;."

---

## Help.WhoAmI.Get

**Implementation:** `HelpWhoAmIGetImpl` (Codeunit 10078023)
**Help Codeunit:** `HelpWhoAmIGetHelp` (Codeunit 10078024)
**Direction:** Outbound

### Purpose

Returns a comprehensive user profile for the calling user. The response includes BC configuration, role assignments, linked employee/resource/salesperson records, company information, optional linked business records (customer, vendor, contact, G/L account), and an optional per-user system prompt stored in the User Setup ori table.

External AI systems use this to discover who they are talking to and to retrieve user-specific context.

### Request Format

No request data fields are required. The message type uses the caller's session context.

```json
{
  "specversion": "1.0",
  "type": "Help.WhoAmI.Get",
  "source": "external",
  "id": "whoami-001",
  "datacontenttype": "application/json",
  "data": {}
}
```

### Response Format

```json
{
  "status": "Success",
  "user": {
    "userSecurityId": "a1b2c3d4-...",
    "userName": "DOMAIN\\USER",
    "fullName": "John Smith",
    "contactEmail": "john@example.com",
    "authenticationEmail": "john@example.com"
  },
  "personalization": {
    "profileId": "BUSINESS MANAGER",
    "languageId": 1033,
    "localeId": 1033,
    "company": "CRONUS International Ltd.",
    "timeZone": "UTC"
  },
  "userSetup": {
    "userId": "JOHN",
    "salesPurchCode": "JS",
    "approverId": "MANAGER1",
    "salesRespCtrFilter": "",
    "purchaseRespCtrFilter": "",
    "serviceRespCtrFilter": "",
    "allowPostingFrom": "2025-01-01",
    "allowPostingTo": "2025-12-31",
    "timeSheetAdmin": false,
    "email": "john@example.com"
  },
  "approvalSetup": {
    "approverId": "MANAGER1",
    "approvalAdministrator": false,
    "unlimitedSalesApproval": false,
    "unlimitedPurchaseApproval": false,
    "unlimitedRequestApproval": false,
    "salesAmountApprovalLimit": 10000,
    "purchaseAmountApprovalLimit": 5000,
    "requestAmountApprovalLimit": 5000,
    "substitute": "JOHN2"
  },
  "notificationSetup": [
    {
      "notificationType": "New Record",
      "notificationMethod": "Email",
      "recurrence": "Daily",
      "time": "08:00:00",
      "dailyFrequency": "Weekday"
    }
  ],
  "resource": {
    "no": "JS",
    "name": "John Smith",
    "type": "Person"
  },
  "salesperson": {
    "code": "JS",
    "name": "John Smith",
    "email": "john@example.com",
    "phoneNo": "+354 555 1234"
  },
  "employee": {
    "no": "EMP001",
    "firstName": "John",
    "lastName": "Smith",
    "socialSecurityNo": "010180-1234",
    "email": "john@example.com",
    "phoneNo": "+354 555 1234",
    "jobTitle": "Developer",
    "managerNo": "EMP002",
    "resourceNo": "JS"
  },
  "manager": {
    "no": "EMP002",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phoneNo": "+354 555 5678",
    "jobTitle": "Team Lead"
  },
  "companyInfo": {
    "name": "CRONUS International Ltd.",
    "name2": "",
    "address": "123 Main Street",
    "city": "Reykjavik",
    "postCode": "101",
    "countryRegionCode": "IS",
    "phoneNo": "+354 555 0000",
    "email": "info@company.com",
    "homePage": "https://company.com",
    "vatRegistrationNo": "123456-7890",
    "registrationNo": "1234567890"
  },
  "warehouseLocations": [
    { "locationCode": "BLUE", "default": true, "adcsUser": false },
    { "locationCode": "GREEN", "default": false, "adcsUser": false }
  ],
  "responsibilityCenters": {
    "salesRespCtrFilter": "MAIN",
    "purchaseRespCtrFilter": "",
    "serviceRespCtrFilter": ""
  },
  "dueFromToOwner": {
    "glAccountNo": "33050",
    "name": "Arður",
    "balanceAtDate": 150000.00,
    "netChange": 25000.00
  },
  "customer": {
    "no": "10000",
    "name": "Contoso Ltd.",
    "address": "123 Main Street",
    "city": "Reykjavik",
    "postCode": "101",
    "phoneNo": "+354 555 1234",
    "email": "info@contoso.com",
    "creditLimitLCY": 500000.00,
    "balanceLCY": 120000.00,
    "balanceDueLCY": 15000.00
  },
  "vendor": {
    "no": "20000",
    "name": "Fabrikam Inc.",
    "address": "456 Oak Avenue",
    "city": "Akureyri",
    "postCode": "600",
    "phoneNo": "+354 555 5678",
    "email": "ap@fabrikam.com",
    "balanceLCY": 85000.00,
    "balanceDueLCY": 10000.00
  },
  "contact": {
    "no": "CT000001",
    "name": "Anna Jónsdóttir",
    "address": "789 Elm Road",
    "city": "Reykjavik",
    "postCode": "105",
    "phoneNo": "+354 555 9012",
    "email": "anna@example.com",
    "type": "Person",
    "companyNo": "CT000000",
    "companyName": "Contoso Ltd."
  },
  "systemPrompt": "You are a helpful assistant for our sales team...",
  "unreadNotifications": [
    {
      "sender": "ADMIN",
      "subject": "Follow up on order",
      "threadId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }
  ],
  "canUpdateCompanyMemory": true,
  "canSendAndCancelApprovalRequests": true
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `Success` |
| `user` | Object/null | User record from the system User table |
| `personalization` | Object/null | User Personalization (profile, language, locale, time zone) |
| `userSetup` | Object/null | User Setup (sales/purchase code, approver, posting dates) |
| `approvalSetup` | Object/null | Approval limits and administration flags |
| `notificationSetup` | Array/null | Notification Setup entries (type, method, recurrence, time, daily frequency) |
| `resource` | Object/null | Resource linked via Time Sheet Owner — or User Setup ori override |
| `salesperson` | Object/null | Salesperson/Purchaser linked via User Setup — or User Setup ori override |
| `employee` | Object/null | Employee linked via Resource No. — or User Setup ori override |
| `manager` | Object/null | Manager of the linked employee |
| `companyInfo` | Object/null | Company Information for the current company |
| `warehouseLocations` | Array/null | Warehouse Employee location assignments |
| `responsibilityCenters` | Object/null | Responsibility center filters from User Setup |
| `dueFromToOwner` | Object/null | G/L Account linked via User Setup ori |
| `customer` | Object/null | Customer linked via User Setup ori |
| `vendor` | Object/null | Vendor linked via User Setup ori |
| `contact` | Object/null | Contact linked via User Setup ori |
| `systemPrompt` | String/null | Per-user, per-company system prompt (standard UTF-8 text) |
| `unreadNotifications` | Array | Unread notification threads for the current user. Each object contains: `sender` (User ID who sent the notification), `subject` (notification subject text), `threadId` (GUID of the thread). Empty array when no unread notifications exist. |
| `canUpdateCompanyMemory` | Boolean | Whether the caller can use the `Memory.Company.Set` message type (has write permission to the Bifrost Memory table) |
| `canSendAndCancelApprovalRequests` | Boolean | Whether the caller can use `Document.Approval.Send` and `Document.Approval.Cancel` message types (has write permission to the Approval Access ori table) |

Any field returns `null` when the corresponding record does not exist or the user lacks read permission.

### Linked Record Overrides (User Setup ori)

The **User Setup ori** table can store per-user link fields that override the default lookup logic and add extra sections to the response:

| Link Field | Overrides | Default Lookup | When Empty |
|------------|-----------|----------------|------------|
| `Resource No.` | `resource` | Time Sheet Owner User ID | Falls back to Time Sheet Owner |
| `Salesperson Code` | `salesperson` | User Setup → Salespers./Purch. Code | Falls back to User Setup |
| `Employee No.` | `employee`, `manager` | Resource → Employee (via Resource No.) | Falls back to Resource→Employee chain |
| `G/L Account No.` | `dueFromToOwner` | *(no default)* | Section returns `null` |
| `Customer No.` | `customer` | *(no default)* | Section returns `null` |
| `Vendor No.` | `vendor` | *(no default)* | Section returns `null` |
| `Contact No.` | `contact` | *(no default)* | Section returns `null` |

See **[Setup_Reference.md](/foundation/reference/setup/)** → User Setup ori for configuration details.

### Error Handling

This message type does not raise errors for missing records. Each data section independently returns `null` when the corresponding record is not found or the user lacks read permission. The only error scenario is an unsupported message version (not `1.0`).

---

## Help.Bifrost.Get

**Direction**: Outbound
**Category**: Metadata

### Overview

Returns a short Markdown directory of every `Help.*` discovery endpoint and instructs the caller to fetch the full Bifrost API how-to guide via `Help.Implementation.Get` with `subject = "Help.Bifrost.Get"`. Use this when an AI agent or integrator needs a quick map of what is available without paying for the multi-kilobyte technical body up front.

### Request Example

```json
{
  "type": "Help.Bifrost.Get",
  "subject": "",
  "data": {}
}
```

No parameters. `subject` and `data` are ignored.

### Response Example

```json
{
  "status": "Success",
  "result": {
    "messageType": "Help.Bifrost.Get",
    "format": "markdown",
    "markdown": "# Bifrost API - Help endpoints\n\nThis response is a short directory. ...",
    "fullHelpInstructions": "Call Help.Implementation.Get with subject=\"Help.Bifrost.Get\" to retrieve the full technical Bifrost API how-to guide as Markdown."
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"Success"` |
| `result.messageType` | string | Always `"Help.Bifrost.Get"` |
| `result.format` | string | Always `"markdown"` |
| `result.markdown` | string | Short Markdown directory listing every `Help.*.Get` endpoint with one-line purposes |
| `result.fullHelpInstructions` | string | Plain-text instruction telling the caller to invoke `Help.Implementation.Get` with `subject="Help.Bifrost.Get"` for the full technical guide |

### How to get the full technical guide

```json
{
  "type": "Help.Implementation.Get",
  "subject": "Help.Bifrost.Get",
  "data": {}
}
```

The response `markdown` field contains the full technical reference: counting records, server-side totals, FlowFields/FlowFilters, `tableView` syntax, primary-key forms, upsert semantics, currency handling, binary fields, the Change Log Write Guard, and LCID handling.

### Related Message Types

- [Help.Implementation.Get](#helpimplementationget) — full per-message-type technical guide
- [Help.MessageTypes.Get](#helpmessagetypesget) — enumerate every message type
- [Help.Tables.Get](#helptablesget), [Help.Fields.Get](#helpfieldsget) — schema discovery

---

## Related Documentation

- **[API_Reference.md](/foundation/reference/api/)**: API endpoints and authentication
- **[Data_Message_Types.md](/foundation/message-types/data/)**: Data retrieval and manipulation message types
- **[Sales_Message_Types.md](/foundation/message-types/sales/)**: Sales and business logic message types
- **[Setup_Reference.md](/foundation/reference/setup/)**: Bifrost Setup configuration
