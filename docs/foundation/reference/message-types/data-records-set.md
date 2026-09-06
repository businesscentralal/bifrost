---
id: data-records-set
title: "Data.Records.Set"
sidebar_label: "Data.Records.Set"
sidebar_position: 19
description: "Request and response contract for the Data.Records.Set Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Inserts or updates one or more BC records using the Data Shipping standard JSON shape (`{id, primaryKey, fields}`). The response uses the **same shape** as `Data.Records.Get`, so the output of one is valid input to the other after editing `fields`.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

## Idempotency / Safety Notes

- **Not idempotent on insert** unless the table has a unique primary key in `primaryKey` — re-sending the same insert against an auto-number table creates a new record.
- The whole batch runs inside an isolated `Codeunit.Run` (`Data Records Set Process`, 65328). On any failure, the entire batch rolls back and the response contains `error` and `callstack`.
- Ledger-entry edit tables (`G/L Entry-Edit`, `Cust. Entry-Edit`, etc.) are routed automatically so writes go through the supported BC paths.
- Pending-approval changes are blocked by `PreventPendingApprovalChanges`.

## Identifier Resolution Order (table)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject` envelope attribute (name or number).

## Per-Record Lookup Order

For each entry in `data[]`:
1. **`id` only** → SystemId lookup. Found → update. Not found + `identityInsert:true` → insert with that SystemId. Not found otherwise → error.
2. **`id` + `primaryKey`** → SystemId lookup, then verify `primaryKey` matches; mismatch → error.
3. **`primaryKey` only** → set PK fields and `Find('=')`. Found → update; not found → insert.
4. **Neither** → insert. PK must be auto-numbered or it will fail.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `data` | object[] | Yes | Array of record objects. |
| `data[].id` | GUID (no braces) | No | SystemId; triggers update path. |
| `data[].primaryKey` | object | No | Primary key field(s). Required for insert unless auto-numbered. |
| `data[].fields` | object | No | Non-PK fields. PK fields here are **ignored** — they must be in `primaryKey`. |
| `data[].identityInsert` | bool | No | Allow insert with caller-supplied SystemId. |
| `force` | bool | No | Top-level. Only honoured when `ChangeLog Write Guard = Via force` **and** the caller has the `BIFROST Force ori` permission set. Ignored in Open / Blocked modes. |

### Request Example
```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "No_": "10000" },
      "fields": { "Name": "Contoso Ltd.", "City": "Atlanta" }
    }
  ],
  "force": false
}
```

## Response Shape

```json
{
  "status": "Success",
  "insertedCount": 5,
  "modifiedCount": 3,
  "result": [
    { "id": "...", "primaryKey": { "No_": "10000" }, "fields": { "Name": "Contoso Ltd." } }
  ]
}
```

## Discovery Workflow

Before writing to an unfamiliar table:
1. `Help.Tables.Get` — confirm the table is writable (not internal).
2. `Help.Fields.Get` — list field numbers, types, options/enums, write-restrictions.
3. `Data.Records.Get` with `take: 1` — get a template record with exact normalized key names.
4. Edit `fields` from the template, send back via `Data.Records.Set`.

## Field Name Normalization

Same rule as `Data.Records.Get`: `%`, `.`, `"`, `\`, `/`, `'` → `_`, then strip remaining non-alphanumerics. Use the keys exactly as returned by `Data.Records.Get` (e.g. `No_`, `SelltoCustomerNo_`, `BalanceLCY`).

## Value Format

All values are validated via `RecRef.Field(n).Validate()`. Use culture-invariant formats:
- **Date / DateTime**: ISO 8601 (`2026-02-19` / `2026-02-19T14:30:00Z`)
- **Decimal / Integer**: `1250.50` (dot decimal)
- **Boolean**: `true` / `false`
- **GUID**: bare, no braces
- **Option / Enum**: send the **display caption** (matches what `Data.Records.Get` returns)
- **BLOB / Media / MediaSet**: Base64
- **FlowFields / system fields (SystemId, SystemCreatedAt, ...)** are ignored.

## Field Validation Order

**Fields in `fields` are validated in the exact order they appear in the JSON object.** BC's `Validate()` trigger runs immediately for each field as it is processed, so a field's valid values or table relations are determined by the state of the record *at that moment* — not by all fields in the batch combined.

**Rule: place any enum/option field that controls a table relation or restricts another field's valid values *before* the dependent field in the JSON object.**

If you send the dependent field first, it validates against the record's *current* (old) value of the controlling enum — which may silently clear the dependent field or raise a validation error even though your intended combination is valid.

### Common dependent pairs in BC journals

| Send this first (enum) | Then send this (dependent value) | Why |
|---|---|---|
| `AccountType` | `AccountNo_` | Lookup table changes (G/L Account / Customer / Vendor / Bank Account / Fixed Asset / Employee) |
| `Bal_AccountType` | `Bal_AccountNo_` | Same — lookup table for balancing account depends on type |
| `DocumentType` | `AppliestoDoc_No_` | Valid document numbers depend on document type (Invoice / Credit Memo / …) |
| `AppliestoDoc_Type` | `AppliestoDoc_No_` | Same — lookup filtered by applies-to type |
| `GenPostingType` | `GenBusPostingGroup`, `GenProdPostingGroup` | Posting group combinations validated against posting matrix |
| `Type` (Sales/Purchase line) | `No_` | Item / G/L Account / Resource / Fixed Asset / Charge lookup |

### Correct vs. wrong key order

```json
// ✅ CORRECT — Bal_AccountType comes before Bal_AccountNo_ in the JSON object
// BC validates Bal_AccountType first (switches lookup to Bank Account table),
// then validates Bal_AccountNo_ against that new lookup → "CHECKING" is found.
{
  "fields": {
    "AccountType": "Vendor",
    "AccountNo_": "10000",
    "Bal_AccountType": "Bank Account",
    "Bal_AccountNo_": "CHECKING"
  }
}

// ❌ WRONG — Bal_AccountNo_ appears before Bal_AccountType
// BC validates Bal_AccountNo_ first, while Bal_AccountType is still "G/L Account"
// → "CHECKING" not found in G/L Account table → field silently cleared or error.
{
  "fields": {
    "Bal_AccountNo_": "CHECKING",
    "Bal_AccountType": "Bank Account"
  }
}
```

> **Agent tip**: when building the `fields` object, always construct it enum-first. If you are unsure which fields have dependencies, call `Help.Fields.Get` and look at the `tableRelation` property — any field with a conditional table relation (e.g. filtered by another field) is a dependent field and must come after its controlling enum.

## Field Access Restrictions

Per-user field-level write restrictions are enforced via `Bifrost Field Access` (codeunit 65350). When a field carries restriction type `Both` or `Write` for the current user (or a wildcard entry matches), the write is rejected and the field is omitted from the `Did you mean` / valid-field hints. This check is **independent of** and runs **before** the ChangeLog Write Guard.

Wildcards: `Field No. = 0` covers all fields on a table; `Table No. = 0` covers all tables for the user. Resolution order: specific entry → all-fields wildcard → all-tables wildcard. First match wins.

A separate `Bypass` restriction type **opts a field out** of the ChangeLog Write Guard — see the ChangeLog Write Guard section below.

## ChangeLog Write Guard

Restricts which fields may be written, based on the **Bifrost Setup > ChangeLog Write Guard** field:

| Mode | Behaviour |
|---|---|
| `Open` (default) | All writable fields allowed. |
| `Blocked` | Only fields covered by Change Log modification logging are writable. |
| `Via force` | Same as `Blocked`, but caller may send `"force": true` if they hold the `BIFROST Force ori` permission set. |

### Change Log field-enabled check

A field is considered *covered by Change Log* when either:

- The field's `Change Log Setup (Table)` entry has `Log Modification = All Fields`, **or**
- A `Change Log Setup (Field)` entry exists for the field with `Log Modification = true`.

A field with a `Bypass` entry in `Bifrost Field Access` is also considered allowed in `Blocked` / `Via force` mode regardless of its Change Log coverage (field-scoped, not user-scoped).

When `Change Log Activated` is `false` in `Change Log Setup`, the guard treats the entire system as uncovered: in `Blocked` mode every non-bypassed field is rejected.

### Block response
```json
{
  "status": "Error",
  "error": "The following fields are not covered by Change Log...",
  "blockedFields": [ { "fieldNo": 2, "fieldCaption": "Name" } ],
  "guardMode": "Blocked",
  "forceAvailable": false
}
```
When `forceAvailable: true`, retry with `"force": true`.

## Examples

### Insert a new customer (subject = "Customer")
```json
{
  "data": [
    {
      "primaryKey": { "No_": "XTEST-12345" },
      "fields": { "Name": "Test Customer", "Address": "1 Test St", "City": "Atlanta" }
    }
  ]
}
```

### Update by SystemId
```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "fields": { "Address": "789 New Street", "City": "Portland" }
    }
  ]
}
```

### Update by primary key
```json
{
  "data": [
    { "primaryKey": { "No_": "10000" }, "fields": { "Balance": 2500.75 } }
  ]
}
```

### Mixed batch (update + insert)
```json
{
  "data": [
    { "id": "<guid>", "fields": { "City": "Boston" } },
    { "primaryKey": { "No_": "CUST-NEW" }, "fields": { "Name": "Fresh Customer", "City": "Miami" } }
  ]
}
```

## Errors

| Condition | Message |
|---|---|
| Missing `data` array | `Missing required 'data' array in request.` |
| Table not found | `Table {name} not found.` |
| Record missing for SystemId without `identityInsert` | `Record with SystemId {guid} not found. Use "identityInsert": true to insert a new record with this SystemId.` |
| PK mismatch | `Primary key does not match the record with SystemId {guid}` |
| Field validate failed | `Failed to set field {name} ({n}) with value {v}` |
| Unknown field key | `Invalid field "{name}" in {object} object. Field does not exist in the target table. Did you mean "{suggestion}"? Valid field names: ...`. The "Did you mean" hint appears when the supplied key matches a real field after normalization — use the suggestion verbatim. |
| ChangeLog Write Guard block | See block response above (`blockedFields`, `guardMode`, `forceAvailable`). |
| Pending approval | Error from `PreventPendingApprovalChanges`. |

On any error the response also includes a `callstack` field (captured via `GetLastErrorCallStack`).

## Related Message Types

- **Data.Records.Get** — same JSON shape; use to get a template record before editing.
- **Data.Notes.Set** — for adding notes (Record Link table) instead of field values.
- **Help.Fields.Get** — discover field numbers, types, and write restrictions.

