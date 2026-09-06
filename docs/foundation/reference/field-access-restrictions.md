---
id: field-access-restrictions
title: "Field access restrictions"
sidebar_position: 4
---

## Overview

The Field Access Restrictions feature provides granular, user-level control over field visibility and modification rights for data operations performed through the Bifrost API. This security layer allows administrators to restrict read and/or write access to specific fields on a per-user basis, ensuring sensitive data is protected while maintaining API functionality.

**Namespace:** `Origo.Bifrost`  
**Main Table:** `Field Access ori` (Table 10077889)  
**Management Page:** `Field Accesses ori` (Page 10077888)  
**Management Codeunit:** `Field Access ori` (Codeunit 10077895)

---

## Architecture

### Components

The field access restriction system consists of four primary objects:

1. **Field Access ori Table** (10077889) - Stores restriction rules per user/table/field combination
2. **Field Accesses ori Page** (10077894) - Administrative UI for managing restrictions
3. **Restriction Type ori Enum** (10077905) - Defines restriction types (Both, Read, Write, Bypass)
4. **Field Access ori Codeunit** (10077935) - Public API for checking restrictions

### Design Principles

- **User-Granular**: Restrictions are defined per User Security ID, allowing different access levels for different users
- **Field-Specific**: Each restriction targets a specific field in a specific table
- **Wildcard Support**: Table No. = 0 and Field No. = 0 act as wildcards covering all tables or all fields
- **Type-Flexible**: Four restriction types (Both, Read, Write, Bypass) provide precise control
- **Integrated**: Automatically enforced in `Data.Records.Get` and `Data.Records.Set` message types
- **Non-Breaking**: Fields without restrictions behave normally; only specified restrictions are enforced

---

## Restriction Types

The system supports four types of field access restrictions:

| Restriction Type | Value | Caption | Description | Blocks Read | Blocks Write |
|------------------|-------|---------|-------------|-------------|--------------|
| **Both** | 0 | Both | Most restrictive - blocks both read and write operations | ✓ | ✓ |
| **Read** | 1 | Read | Blocks read operations only - field will not appear in GET responses | ✓ | ✗ |
| **Write** | 2 | Write | Blocks write operations only - field can be read but not modified | ✗ | ✓ |
| **Bypass** | 3 | Bypass | Write Guard bypass - field is excluded from all restriction checks; the ChangeLog Write Guard allows writes to this field regardless of Change Log coverage | ✗ | ✗ |

### Restriction Logic

**Both Restriction:**
- Field is excluded from `Data.Records.Get` responses
- Field modifications in `Data.Records.Set` are rejected with an error
- Most secure option for highly sensitive fields

**Read Restriction:**
- Field is excluded from `Data.Records.Get` responses
- Field CAN still be modified via `Data.Records.Set`
- Use case: Fields that should be updated programmatically but not visible to users

**Write Restriction:**
- Field IS included in `Data.Records.Get` responses
- Field modifications in `Data.Records.Set` are rejected with an error
- Use case: Read-only fields like calculated balances or historical data

**Bypass:**
- Field IS included in `Data.Records.Get` responses (no read restriction)
- Field CAN be modified via `Data.Records.Set` (no write restriction)
- The ChangeLog Write Guard (modes: Blocked, Via force) will **allow writes** to this field even if it has no Change Log coverage
- The bypass is field-scoped (not user-scoped): if a field has a Bypass entry the Write Guard allows writes for all callers
- Use case: Allow a specific field to be written through the API without requiring Change Log activation on that field

---

## Wildcard Rules

The system supports two wildcard values to apply restrictions broadly without creating per-field or per-table entries:

| Wildcard | Meaning | Validation rule |
|----------|---------|----------------|
| **Field No. = 0** | All fields in the specified table | Table No. must be a valid table (or 0) |
| **Table No. = 0** | All tables for the user | Field No. is forced to 0 (cannot specify a field without a table) |

### Resolution Order (Fallback Chain)

When checking whether a field is restricted, the system evaluates entries in this order:

1. **Specific entry** — exact match on User + Table + Field
2. **All-fields wildcard** — User + Table + Field No. = 0
3. **All-tables wildcard** — User + Table No. = 0 + Field No. = 0

The first match wins. If no entry is found at any level, the field is unrestricted.

**Example:** A user has:
- Table 18 (Customer), Field 2 (Name) → Restriction Type: Read
- Table 18 (Customer), Field 0 (all fields) → Restriction Type: Write
- Table 0 (all tables), Field 0 → Restriction Type: Both

Resolution:
- Customer.Name → **Read** (specific entry wins)
- Customer.Address → **Write** (all-fields wildcard wins)
- Item.Description → **Both** (all-tables wildcard wins)
- Any other table/field → **Both** (all-tables wildcard wins)

### Validation Constraints

- When Table No. is set to 0, Field No. is **automatically set to 0** and the field name displays `<All Fields>`
- Attempting to set Field No. to a non-zero value when Table No. = 0 raises an error: *"Field No. must be 0 when Table No. is 0 (all tables)."*
- The Field No. lookup is disabled when Table No. = 0

### Write Guard Bypass with Wildcards

The `IsFieldWriteGuardBypassed` check follows the same fallback chain:
1. Specific table + specific field
2. Specific table + Field No. = 0 (all fields in that table)
3. Table No. = 0 + Field No. = 0 (all tables, all fields)

A Bypass entry at the all-tables level exempts **every field in every table** from the Write Guard.

---

## Setup and Configuration

### Accessing the Page

1. Open Business Central
2. Search for "Field Accesses ori"
3. The page opens with a user filter section at the top

### Page Layout

The page is divided into two sections:

#### User Filter Section (Top)
- **User Name**: Displays the currently selected user's name
- **Lookup**: Opens the User/App Lookup ori page to select a different user
- **Purpose**: Filters the list below to show only restrictions for the selected user

#### Restrictions List (Bottom - Repeater)
- **Table No.**: The table number (with lookup to All Objects with Caption)
- **Table Name**: FlowField displaying the table name (read-only)
- **Field No.**: The field number (with lookup to Field Lookup page)
- **Field Name**: The field name (read-only, populated on validation)
- **Restriction Type**: The type of restriction (Both, Read, or Write)

### Adding a Restriction

1. **Select User**: If the page opens with no user selected, or to change users:
   - Click the lookup button (three dots) next to User Name
   - Select a user from the User/App Buffer ori (includes active users and AAD applications)
   - The repeater will enable for editing

2. **Create New Line**: Click "+ New" or press F3 to create a new restriction

3. **Select Table**:
   - Enter a table number directly, OR
   - Click lookup (three dots) to browse all tables
   - Table Name will auto-populate

4. **Select Field**:
   - Enter a field number directly, OR
   - Click lookup (three dots) to browse fields for the selected table
   - Field Name will auto-populate
   - Only enabled, normal fields are shown in the lookup

5. **Choose Restriction Type**:
   - Select **Both**, **Read**, **Write**, or **Bypass** from the dropdown
   - Default is "Both" (most restrictive)
   - Use **Bypass** to exempt a field from the ChangeLog Write Guard without granting read/write restrictions

6. **Save**: The record is automatically saved when you move to the next field or line

### User Selection Behavior

- **On Page Open**: If restrictions exist, the first user with restrictions is automatically selected
- **Filter Persistence**: The selected user filter is saved with page state
- **Repeater Enabling**: The restrictions list is only editable when a user is selected

### Validation Rules

- **User Security ID**: Must be a valid active user or AAD application (validated against User/App Buffer ori)
- **Table No.**: Must be a valid table in Business Central, or 0 for all tables
- **Field No.**: Must be a valid enabled field in the selected table, or 0 for all fields. Must be 0 when Table No. is 0
- **Primary Key**: User Security ID + Table No. + Field No. (prevents duplicate restrictions)

---

## Integration with Message Types

### Data.Records.Get Message Type

**Integration Points:** 3 locations in `DataRecordsGetImpl.Codeunit.al`

**Behavior:**
- Before including a field in the response JSON, the system checks: `FieldRestrictionMgt.IsFieldReadRestricted(TableNo, FieldNo)`
- If restriction exists (Read or Both type), the field is **excluded** from the response
- No error is raised; the field simply doesn't appear in the `fields` object
- User receives valid JSON with only permitted fields

**Example Scenario:**

Given restrictions:
- Customer.Name: Read restriction
- Customer.Address: Both restriction

Request:
```json
{
  "specversion": "1.0",
  "type": "Data.Records.Get",
  "subject": "Customer",
  "data": "{\"fieldNumbers\":[1,2,5]}"
}
```

Response (without restrictions):
```json
{
  "status": "Success",
  "result": [
    {
      "id": "...",
      "primaryKey": { "No_": "10000" },
      "fields": {
        "No_": "10000",
        "Name": "Adatum Corporation",
        "Address": "192 Market Square"
      }
    }
  ]
}
```

Response (with restrictions applied):
```json
{
  "status": "Success",
  "result": [
    {
      "id": "...",
      "primaryKey": { "No_": "10000" },
      "fields": {
        "No_": "10000"
      }
    }
  ]
}
```

### Data.Records.Set Message Type

**Integration Points:** 
- Field list validation in `DataRecordsSetProcess.Codeunit.al` (GetFieldsAsList method)
- Write operation validation before setting field values

**Behavior:**
- When building the valid field list, the system checks: `FieldRestrictionMgt.IsFieldWriteRestricted(TableNo, FieldNo)`
- If restriction exists (Write or Both type), attempting to modify the field results in an **Error** status
- The entire operation fails; no records are inserted or modified
- User receives error response with details

**Example Scenario:**

Given restrictions:
- Customer.Name: Write restriction

Request:
```json
{
  "specversion": "1.0",
  "type": "Data.Records.Set",
  "subject": "Customer",
  "data": {
    "data": [
      {
        "primaryKey": { "No_": "TEST001" },
        "fields": {
          "Name": "New Customer Name",
          "Address": "123 Main Street"
        }
      }
    ]
  }
}
```

Response (with write restriction):
```json
{
  "status": "Error",
  "message": "Invalid field \"Name\" in fields object. Field does not exist in the target table. Valid field names: No_, Address, City, ..."
}
```

**Note:** The error message indicates the field is invalid because it's been filtered out of the valid field list due to the write restriction. The trailing `Valid field names: ...` enumeration lists the JSON keys actually accepted for the current caller (after both schema normalisation and any field-access restrictions). When the supplied key normalises to a real field name — for example sending `"No."` for a field BC exposes as `"No_"` — the error is prefixed with `Did you mean "No_"?` to make self-correction trivial.

---

## API Reference

### Table: Field Access ori (10077889)

**Primary Key:** User Security ID + Table No. + Field No.

**Fields:**

| Field No. | Field Name | Type | Description |
|-----------|------------|------|-------------|
| 1 | User Security ID | Guid | Identifies the user or AAD application |
| 2 | Table No. | Integer | Target table number |
| 3 | Field No. | Integer | Target field number |
| 10 | Restriction Type | Enum | Type of restriction (Both, Read, Write, Bypass) |
| 20 | User Name | Text[250] | User's friendly name (auto-populated, read-only) |
| 21 | Table Name | Text[250] | Table's caption (FlowField, read-only) |
| 22 | Field Name | Text[30] | Field's name (auto-populated, read-only) |

**Methods:**

```al
procedure IsFieldRestricted(UserSecurityId: Guid; TableNo: Integer; FieldNo: Integer; RestrictType: Enum "Restriction Type ori"): Boolean
```
Checks if a specific field is restricted for a user based on restriction type.  
Uses the three-level fallback chain: specific field → all-fields wildcard (Field 0) → all-tables wildcard (Table 0, Field 0).

```al
procedure GetRestrictedFields(UserSecurityId: Guid; TableNo: Integer; RestrictType: Enum "Restriction Type ori"): List of [Integer]
```
Returns a list of all restricted field numbers for a table and restriction type. Includes entries from both the specific table and the all-tables wildcard (Table 0). Bypass entries are excluded from this list.

```al
procedure IsFieldWriteGuardBypassed(TableNo: Integer; FieldNo: Integer): Boolean
```
Checks whether a Bypass entry exists for the given table/field combination (field-scoped, ignores User Security ID).  
Uses the three-level fallback: specific field → all-fields wildcard (Field 0) → all-tables wildcard (Table 0, Field 0).

### Codeunit: Field Access ori (10077935)

**Public Methods:**

```al
procedure IsFieldReadRestricted(TableNo: Integer; FieldNo: Integer): Boolean
```
Checks if a field is read-restricted for the current user (UserSecurityId()).  
Returns true if restriction type is Read or Both.

```al
procedure IsFieldWriteRestricted(TableNo: Integer; FieldNo: Integer): Boolean
```
Checks if a field is write-restricted for the current user (UserSecurityId()).  
Returns true if restriction type is Write or Both.

```al
procedure IsFieldWriteGuardBypassed(TableNo: Integer; FieldNo: Integer): Boolean
```
Checks whether a Bypass entry exists for the given table/field combination (field-scoped, all users).  
The ChangeLog Write Guard checks this before evaluating Change Log coverage.

---

## Use Cases and Examples

### Use Case 1: Protect Sensitive Customer Data

**Scenario:** External integration should access customer records but not see credit card information.

**Setup:**
1. Create restriction for User: IntegrationAppUser
2. Table: Customer (18)
3. Field: Credit Card No.
4. Restriction Type: Both

**Result:** Integration can read and write customer data, but Credit Card No. field is never exposed in GET responses and cannot be modified via SET operations.

---

### Use Case 2: Read-Only Financial Fields

**Scenario:** Integration needs to see customer balances but should never modify them (calculated fields).

**Setup:**
1. Create restriction for User: IntegrationAppUser
2. Table: Customer (18)
3. Field: Balance (LCY)
4. Restriction Type: Write

**Result:** Integration can read Balance (LCY) in GET responses but cannot modify it through SET operations.

---

### Use Case 3: Write-Only Audit Fields

**Scenario:** Integration should be able to update internal notes but not read them (privacy compliance).

**Setup:**
1. Create restriction for User: IntegrationAppUser
2. Table: Customer (18)
3. Field: Internal Notes
4. Restriction Type: Read

**Result:** Integration cannot see Internal Notes in GET responses but can update them via SET operations.

---

### Use Case 5: Write Guard Bypass — Allow API Writes Without Change Log Coverage

**Scenario:** An integration needs to write a specific field via `Data.Records.Set` but activating the Change Log for that field is not feasible or desirable. The ChangeLog Write Guard is set to Blocked.

**Setup:**
1. Create a restriction for the field (user can be any active user or app; the bypass is field-scoped)
2. Table: Customer (18)
3. Field: External System Key (custom field)
4. Restriction Type: **Bypass**

**Result:** The ChangeLog Write Guard allows writes to this field regardless of whether it is covered by the Change Log. No read or write restrictions are applied — the Bypass entry solely affects the Write Guard evaluation.

---

### Use Case 4: Hide System Fields

**Scenario:** Hide all SystemModifiedAt/SystemModifiedBy fields from specific integration users.

**Setup:** Create Both restrictions for multiple tables and fields:
- Customer.SystemModifiedAt - Both
- Customer.SystemModifiedBy - Both
- Vendor.SystemModifiedAt - Both
- Vendor.SystemModifiedBy - Both
- Item.SystemModifiedAt - Both
- Item.SystemModifiedBy - Both

**Result:** System audit fields are completely hidden from the integration user.

---

### Use Case 6: Block All API Access for a User (All Tables Wildcard)

**Scenario:** Completely block a user from reading or writing any data via the Bifrost API.

**Setup:**
1. Create restriction for User: TemporaryBlockedUser
2. Table No.: **0** (all tables)
3. Field No.: **0** (automatically set when Table No. = 0)
4. Restriction Type: Both

**Result:** The user cannot read any field from any table via `Data.Records.Get`, and all `Data.Records.Set` operations are rejected. This is equivalent to a full API lockout for the user without removing their BC user account.

---

### Use Case 7: Read-Only API Access Across All Tables

**Scenario:** An integration user should be able to query data from any table but must never modify records.

**Setup:**
1. Create restriction for User: ReadOnlyIntegration
2. Table No.: **0** (all tables)
3. Field No.: **0** (automatically set)
4. Restriction Type: Write

**Result:** The user can read all fields from all tables via `Data.Records.Get` but any `Data.Records.Set` operation is rejected.

---

## Permission Requirements

### To Manage Restrictions (Administrators)

Users managing field restrictions need:
- **BIFROST Full ori** permission set (10077885), which includes:
  - Read, Insert, Modify, Delete permissions on Field Access ori table
  - Execute permission on Field Accesses ori page
  - Read permission on User/App Buffer ori

### To Be Subject to Restrictions (API Users)

- Field restrictions are automatically enforced based on the user's Security ID
- The calling user's Security ID is obtained from `UserSecurityId()` or `SystemCreatedBy` in message queue records
- No special permissions are needed; restrictions simply limit what fields are accessible

---

## Best Practices

### Security Strategy

1. **Principle of Least Privilege**: Start with the most restrictive setting (Both) and relax as needed
2. **Audit Trail**: Keep track of why each restriction was created (consider adding documentation)
3. **Regular Review**: Periodically audit restrictions to ensure they're still necessary
4. **Test Integration Impact**: Before deploying restrictions, test with sample data to verify integration behavior

### Performance Considerations

1. **Minimal Overhead**: Restriction checks are simple GUID+Integer primary key lookups (very fast)
2. **Caching Opportunity**: Consider caching restriction lists if making many calls for the same user/table
3. **Bulk Operations**: Restrictions are checked per-field, not per-record, so bulk operations scale well

### Troubleshooting

**Symptom:** Field not appearing in Data.Records.Get response

**Possible Causes:**
1. Read or Both restriction exists for the user/field
2. Field doesn't exist in the table
3. Field is not enabled or is obsolete
4. User lacks read permission on the table

**Diagnosis:** Check Field Accesses ori page for the user in question.

---

**Symptom:** Data.Records.Set returns error "Invalid field"

**Possible Causes:**
1. Write or Both restriction exists for the user/field
2. Field doesn't exist in the table
3. Field is not a normal field (FlowField, FlowFilter)
4. User lacks write permission on the table

**Diagnosis:** Check Field Accesses ori page for the user in question.

---

## Administrative Actions

### Delete All Restrictions for a User

The page includes an action "Delete All for User":
1. Select the user using the User Name filter
2. Click Actions → Delete All for User
3. Confirm the deletion
4. All restrictions for that user are removed

### Bulk Setup via AL Code

For programmatic setup of restrictions:

```al
var
    FieldAccess: Record "Field Access ori";
begin
    FieldAccess.Init();
    FieldAccess."User Security ID" := IntegrationUserSecurityId;
    FieldAccess."Table No." := Database::Customer;
    FieldAccess."Field No." := 2; // Name field
    FieldAccess."Restriction Type" := FieldAccess."Restriction Type"::Read;
    FieldAccess.Insert(true); // Validates and populates User Name, Field Name
end;
```

---

## Technical Implementation Details

### How Restrictions Are Enforced

**Data.Records.Get (Read Enforcement):**

```al
// Pseudo-code from DataRecordsGetImpl
foreach Field in RequestedFields do begin
    if not FieldRestrictionMgt.IsFieldReadRestricted(TableNo, Field."No.") then
        AddFieldToJson(ResponseJson, Field);
    // Restricted fields are silently omitted
end;
```

**Data.Records.Set (Write Enforcement):**

```al
// Pseudo-code from DataRecordsSetProcess
local procedure GetFieldsAsList(TableId: Integer; FieldList: List of [Text])
begin
    foreach Field in Table do begin
        if not FieldRestrictionMgt.IsFieldWriteRestricted(TableId, Field."No.") then
            FieldList.Add(Field.FieldName);
    end;
    // Restricted fields are excluded from valid field list
    // Later validation rejects fields not in valid field list
end;
```

### User Identification

Field restrictions use the calling user's Security ID:
- **Synchronous (Task API)**: `UserSecurityId()` of the web service caller
- **Asynchronous (Queue API)**: `SystemCreatedBy` field of the message queue record

### Buffer Table Integration

The User/App Buffer ori (Table 10077890) combines:
- Active User records (from User table)
- Active AAD applications (from Azure AD Application table)

This allows restrictions to be applied to both human users and application service principals.

---

## Extensibility

### Extending Restriction Types

The `Restriction Type ori` enum is marked as `Extensible = true`:

```al
enumextension 50100 "My Restriction Types" extends "Restriction Type ori"
{
    value(50100; "Custom Restriction")
    {
        Caption = 'Custom Restriction';
    }
}
```

**Note:** Custom restriction types require custom logic implementation as the core system only recognizes Both, Read, and Write.

### Subscribing to Restriction Events

Currently, the system does not publish events when restrictions are applied. Consider adding integration events if you need to:
- Log when a field access is denied
- Notify administrators of restriction violations
- Implement custom restriction logic

---

## Related Documentation

- [API Reference](/foundation/reference/api/) - Bifrost API endpoint documentation
- [Data Message Types](/foundation/message-types/data/) - Data.Records.Get and Data.Records.Set documentation
- [Setup Reference](/foundation/reference/setup/) - Bifrost Setup configuration

---

## Summary

Field Access Restrictions provide fine-grained security control for Bifrost API operations by:
- Restricting field visibility in Data.Records.Get responses (Read restrictions)
- Preventing field modifications in Data.Records.Set operations (Write restrictions)
- Supporting wildcards: Field No. = 0 (all fields in a table) and Table No. = 0 (all tables) for broad restrictions
- Using a three-level fallback chain (specific → all-fields → all-tables) with first-match-wins semantics
- Operating on a per-user basis with minimal performance impact
- Integrating transparently without breaking existing integrations
- Supporting both user accounts and AAD application service principals

This feature enables administrators to meet compliance requirements, protect sensitive data, and implement principle of least privilege while maintaining API flexibility.
