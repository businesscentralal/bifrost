---
id: help-permissions-get
title: "Help.Permissions.Get"
sidebar_label: "Help.Permissions.Get"
sidebar_position: 68
description: "Request and response contract for the Help.Permissions.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns the current user's **Business Central permission** for a specified table. The flags reflect `RecordRef.ReadPermission()` and `RecordRef.WritePermission()`, which resolve standard BC permission sets (such as `D365 BASIC`, `D365 READ`, `D365 BUS FULL ACCESS`) plus any `InherentPermissions` declared on AL objects.

## Direction
Outbound

## Response Content Type
`text/json`

## Identifier Resolution (table required)
1. Request JSON: `tableName`, `tableNumber`, `tableNo`, `tableId` (in that order)
2. Bifrost `subject`
Errors if no table can be resolved.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text or Integer | Yes (via JSON or subject) | Target table |

## Request Example
```json
{ "type": "Help.Permissions.Get", "subject": "Customer" }
```

## Response Shape
```json
{
  "status": "Success",
  "permissions": { "read": true, "write": false }
}
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| permissions.read | Boolean | True when BC grants read permission on the table to the current user (from permission sets and inherent permissions). |
| permissions.write | Boolean | True when BC grants insert/modify/delete permission on the table to the current user. |

## Permission Layers
Data access through the Bifrost API is gated by **two independent layers**. A request only succeeds when both layers allow it.

1. **BC permission** (this message type)
   - Source: BC permission sets assigned to the user, plus `InherentPermissions` on AL objects.
   - Scope: whole table (read / insert / modify / delete).
   - When denied: `Data.Records.*` returns a permission error from the BC platform.
2. **Bifrost restrictions** (configured per user in `Bifrost Field Access`)
   - Source: the `Bifrost Field Access` table maintained by Bifrost administrators.
   - Scope: per table **and** per field, with restriction types `Read`, `Write`, `Both`, or `Bypass`.
   - When denied: `Data.Records.Get` silently drops the field from the response; `Data.Records.Set` rejects the write with an error; Create message types (`Sales.Document.Create`, `Purchase.Document.Create`, `Inventory.AssemblyOrder.Create`, `Inventory.TransferOrder.Create`, `Finance.BankReconciliation.Create`) refuse to create the record when the principal field is write-restricted.

### Effective access matrix
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

## How to Resolve the Full Picture
To know whether the current user can actually read or write a given table or field, query all three sources and combine them:

1. **BC permission on the table** — call `Help.Permissions.Get` (this message type). Reads `permissions.read` and `permissions.write`.
2. **Bifrost restriction on the table** — call `Help.Tables.Get` with the table identifier. Each table in the result includes `readRestricted` and `writeRestricted` table-level flags. When `readRestricted=true` the table is blocked from `Data.Records.Get` entirely; when `writeRestricted=true` the table is blocked from `Data.Records.Set` entirely.
3. **Bifrost restriction on individual fields** — call `Help.Fields.Get` with the table identifier. Each field in the result includes `readRestricted` and `writeRestricted` flags resolved against the **current user**. Use these to decide which fields to request in `Data.Records.Get` and which to send in `Data.Records.Set`.

### Combine the layers
- `canReadField = Help.Permissions.Get.permissions.read AND NOT Help.Tables.Get.readRestricted AND NOT Help.Fields.Get.readRestricted`
- `canWriteField = Help.Permissions.Get.permissions.write AND NOT Help.Tables.Get.writeRestricted AND NOT Help.Fields.Get.writeRestricted`

### Resolution example
```text
// 1) BC permission on the Customer table
{ "type": "Help.Permissions.Get", "subject": "Customer" }
// → { "permissions": { "read": true, "write": true } }

// 2) Bifrost table-level restriction
{ "type": "Help.Tables.Get", "subject": "Customer" }
// → { "result": [ { "id": 18, "name": "Customer", "readRestricted": false, "writeRestricted": false } ] }

// 3) Bifrost field-level restrictions for the current user
{ "type": "Help.Fields.Get", "subject": "Customer", "data": { "fieldNumbers": [1, 2, 102] } }
// → result[*].readRestricted / writeRestricted flags
```

## Caveats
- This message type checks **only** the BC permission layer. Even when `permissions.read=true` and `permissions.write=true`, a Bifrost restriction can still block individual fields or the whole table.
- Bifrost restrictions are resolved against `UserSecurityId()` of the user that owns the bifrost message; they may differ between users in the same BC company.
- `Bifrost Field Access` also supports a `Bypass` restriction type that releases ChangeLog write-guard checks; it does not affect BC permissions.

## Related Message Types
- `Help.Tables.Get` — table-level Bifrost restriction flags
- `Help.Fields.Get` — per-field Bifrost restriction flags for the current user
- `Data.Records.Get` — consumer of the read layer
- `Data.Records.Set` — consumer of the write layer

