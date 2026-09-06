---
id: approval
title: "Approval message types"
sidebar_position: 9
---

**Parent Document:** [API_Reference.md](/foundation/reference/api/)  
**Implementation Folder:** `app/src/Message Type/Implementations/Approval/`

---

## Overview

This document describes the Approval message types in the Bifrost API. These message types provide operations for creating and retrieving approval entries and their linked approval workflows from Business Central.

| Message Type | Direction | Purpose | Related Table(s) |
| ------------ | --------- | ------- | ---------------- |
| Document.Approval.Get | Inbound | Retrieve approval log entries with linked approval entries and per-row permission checks | Approval Log ori (10077885), Approval Entry, Posted Approval Entry |
| Document.Approval.Send | Inbound | Create approval entries for a document with approver assignments and amount calculation | Sales Header (36), Purchase Header (38), Incoming Document (130) |
| Document.Approval.Approve | Inbound | Approve one or more open approval entries with optional comment | Approval Entry (455), Approval Comment Line (455) |
| Document.Approval.Reject | Inbound | Reject one or more open approval entries with optional comment | Approval Entry (455), Approval Comment Line (455) |
| Document.Approval.Me | Outbound | Retrieve approval entries assigned to the calling user with pagination and permission filtering | Approval Entry (455) |
| Document.Approval.Delegate | Inbound | Delegate one or more open approval entries to another user | Approval Entry (455), User Setup |
| Document.Approval.Cancel | Inbound | Cancel all open approval entries for a document and reopen it | Approval Entry (455), Sales Header (36), Purchase Header (38), Incoming Document (130) |

---

## Document.Approval.Get

**Purpose:** Retrieve approval log entries from the Approval Log ori with linked active and posted approval entries.

**Description:** Returns approval log entries with per-row permission checks. Each entry references a related BC table (e.g., Sales Header, Purchase Header). The caller only receives entries for records they have read permission on — entries where the caller lacks permission are silently excluded. Each entry includes linked active approval entries and posted (historical) approval entries matched by Table ID, Record ID, and Approval Code.

**Message Direction:** Inbound

**Input Parameters:**

```json
{
  "skip": 0,
  "take": 50,
  "tableView": "SORTING(Entry No.) WHERE(Table ID=CONST(36))"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| skip | Integer | No | Number of records to skip (default: 0) |
| take | Integer | No | Maximum number of records to return (default: 100) |
| tableView | Text | No | AL table view filter expression applied to the Approval Log ori table |

**Response Format:**

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "lastModified": "2025-01-15T10:30:00Z",
      "approvalType": "Send",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "e5f6g7h8-i9j0-1234-abcd-ef1234567890",
      "approvalCode": "CE00000000001",
      "request": {
        "customerNo": "10000",
        "amount": 5000.00
      },
      "linkedApprovalEntries": [
        {
          "entryNo": 1,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "S-ORD-1001",
          "status": "Open",
          "approverId": "ADMIN",
          "dueDate": "2025-02-01",
          "currency": "USD",
          "amount": "5000.00",
          "amountLCY": "5000.00",
          "comments": [],
          "lastModified": "2025-01-15T10:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [
        {
          "entryNo": 2,
          "sequenceNo": 1,
          "documentNo": "S-INV-1001",
          "status": "Approved",
          "approverId": "ADMIN",
          "dueDate": "2025-02-01",
          "currency": "USD",
          "amount": "5000.00",
          "amountLCY": "5000.00",
          "comments": [],
          "lastModified": "2025-01-15T10:30:00Z"
        }
      ]
    }
  ]
}
```

**Response Fields:**

### Top-Level

| Field | Type | Description |
| ----- | ---- | ----------- |
| status | Text | Processing status (`"Success"` or `"Error"`) |
| noOfRecords | Integer | Total count of approval log entries before permission filtering |
| result | Array | Array of approval log entry objects |

### Approval Log Entry

| Field | Type | Description |
| ----- | ---- | ----------- |
| id | GUID | SystemId of the approval log entry |
| lastModified | DateTime | Last modification timestamp (ISO 8601, Format 9) |
| approvalType | Text | Name of the approval action type. Possible values: `Send`, `Approve`, `Reject`, `Delegate`, `Cancel` |
| tableId | Integer | Table ID of the record being approved. Only present if the caller has read permission on the related table |
| tableName | Text | Name of the related table (e.g., `"Sales Header"`) |
| tableCaption | Text | Localized caption of the related table |
| recordSystemId | GUID | SystemId of the record being approved |
| approvalCode | Code[20] | Auto-generated approval workflow code (format: `CE00000000001`) |
| request | Object | The original request JSON payload stored with the approval log entry |
| linkedApprovalEntries | Array | Active approval entries linked to this record and approval code. Empty array if no entries exist or if the caller lacks read permission on the Approval Entry table |
| linkedPostedApprovalEntries | Array | Posted (historical) approval entries linked to this record and approval code. Empty array if no entries exist or if the caller lacks read permission on the Posted Approval Entry table |

### Linked Approval Entry Fields

These fields are shared by both `linkedApprovalEntries` and `linkedPostedApprovalEntries` unless noted.

| Field | Type | Description |
| ----- | ---- | ----------- |
| entryNo | Integer | Entry number |
| sequenceNo | Integer | Sequence number within the approval workflow |
| documentType | Text | Approval document type name. **Active entries only** — not present on posted entries |
| documentNo | Text | Document number |
| status | Text | Approval status name (e.g., `Open`, `Approved`, `Rejected`, `Canceled`, `Created`) |
| approverId | Text | Approver user ID |
| lastModified | DateTime | Last modification timestamp (ISO 8601, Format 9) |
| dueDate | Date | Approval due date (ISO 8601, Format 9) |
| currency | Code[10] | Currency code. Falls back to the LCY Code from General Ledger Setup when the entry has no currency code |
| amount | Decimal | Amount in document currency (Format 9) |
| amountLCY | Decimal | Amount in local currency (Format 9) |
| comments | Array | String array of approval comments linked to the entry |

---

## Permission Filtering

The implementation applies two layers of permission filtering:

1. **Table-level permission check:** For each approval log entry, the implementation verifies that the caller has `ReadPermission()` on the related table (identified by Table ID). Entries referencing tables the caller cannot read are excluded.

2. **Record-level permission check:** After confirming table-level access, the implementation applies `SetPermissionFilter()` on the related table and verifies the specific record is accessible. This ensures row-level security (e.g., dimension-based filters) is respected.

3. **Linked entry permission check:** The `linkedApprovalEntries` and `linkedPostedApprovalEntries` arrays are only populated if the caller has `ReadPermission()` on the respective Approval Entry / Posted Approval Entry tables.

The `noOfRecords` field returns the total count from the approval log table (including entries that may be filtered out by permission checks), providing a way to detect that permission filtering is occurring.

---

## Approval Log ori Table

The `Approval Log ori` (table 10077885) stores approval workflow events. Each record captures:

| Field | Type | Description |
| ----- | ---- | ----------- |
| Entry No. | Integer | Auto-incremented primary key |
| Table ID | Integer | BC table ID of the record being approved |
| Record ID to Approve | RecordId | Full BC record identifier |
| Record SystemId to Approve | GUID | SystemId of the record being approved |
| Approval Code | Code[20] | Auto-generated workflow identifier (format: `CE00000000001`) |
| Request | Blob | Original request JSON payload |
| Approval Type | Enum | The approval action type (see values below) |

### Approval Type Values

| Value | Ordinal | Description |
| ----- | ------- | ----------- |
| Send | 0 | Approval request has been created and sent |
| Approve | 2 | Request has been approved |
| Reject | 3 | Request has been rejected |
| Delegate | 4 | Request has been delegated to another approver |
| Cancel | 5 | Approval request has been cancelled |

---

## Error Handling

| Scenario | Behavior |
| -------- | -------- |
| Unsupported message version | Error raised by `AssertVersion1()` |
| Invalid tableView expression | Standard BC error from `SetView()` |
| No records found | Returns `"status": "Success"` with empty `result` array and `noOfRecords: 0` |
| All records filtered by permissions | Returns `"status": "Success"` with empty `result` array; `noOfRecords` shows the unfiltered count |

---

## Document.Approval.Send

**Purpose:** Create approval entries for a document from a JSON request containing approver assignments with optional per-line amount calculation.

**Description:** Accepts an array of approval assignments for a specific document. Each element creates one Approval Entry linked to a shared Approval Log ori record. The document status is set to Pending Approval after entries are created. Amounts are calculated automatically from document lines — the caller does not provide amounts.

**Message Direction:** Inbound

**Supported Tables:**

| Table ID | Table Name |
| -------- | ---------- |
| 36 | Sales Header |
| 38 | Purchase Header |
| 130 | Incoming Document |

**Prerequisites:**

| Requirement | Details |
| ----------- | ------- |
| Permission Set | The calling user must have the **Approval Access ori** (10077891) permission set assigned. Without it, the request is rejected with: `User <ID> does not have permissions to send documents to approval via Bifrost.` |
| User Setup ori | Each `approverUserId` must exist in User Setup ori with a valid Salesperson Code |

**Input Parameters:**

```json
{
  "tableId": 36,
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "approvals": [
    {
      "approverUserId": "JOHN",
      "sequenceNo": 1,
      "dueDate": "2025-01-15"
    },
    {
      "approverUserId": "JANE",
      "sequenceNo": 2,
      "lineNumbers": [10000, 20000]
    }
  ]
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| tableId / tableNumber / tableName | Integer or Text | Yes | Identifies the table containing the document |
| recordSystemId | GUID | Yes | SystemId of the document record |
| approvals | Array | Yes | Array of approval assignment objects (see below) |

**Approval Array Element:**

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| approverUserId | Text | Yes | — | User ID of the approver (must exist in User Setup ori for Salesperson Code lookup) |
| sequenceNo | Integer | No | 1 | Sequence number to control approval ordering |
| dueDate | Date | No | Document due date | Override the approval due date |
| lineNumbers | Integer[] | No | All lines | Document line numbers to include in amount calculation. **Not supported for Incoming Documents** |

---

### Amount Calculation

Amounts are derived from the document, not provided by the caller.

**Sales Header / Purchase Header:**
- Calculates `Amount Including VAT` using BC's posting summary codeunits (`SumSalesLines` / `SumPurchaseLines`)
- If the Sales & Receivables Setup (or Purchases & Payables Setup) requires `Calc. Inv. Discount`, invoice discount is calculated first
- If `lineNumbers` is specified, only those document lines are included in the sum
- Currency code and factor are taken from the document header
- `Amount (LCY)` is calculated using the document's currency factor

**Incoming Document:**
- Uses `Amount Incl. VAT` directly from the Incoming Document record
- `lineNumbers` is **NOT supported** — specifying them produces an error
- If the document has a foreign currency, `Amount (LCY)` is calculated using the current exchange rate

---

### Document Status Change

After approval entries are created, the document status is set to **Pending Approval** via `ApprovalsMgmt.SetStatusToPendingApproval()`.

**Preconditions:**
- **Sales Header / Purchase Header**: Document must have lines and must NOT be in status `Released` or `Pending Prepayment`
- **Incoming Document**: Document must NOT be in status `Posted`, `Rejected`, or `Released`

---

### Response Format

Returns the created Approval Log entry with its linked Approval Entries, using the same format as Document.Approval.Get.

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
      "request": { "...original request..." },
      "linkedApprovalEntries": [
        {
          "entryNo": 1,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "S-ORD-001",
          "status": "Open",
          "approverId": "JOHN",
          "dueDate": "2025-01-15",
          "currency": "ISK",
          "amount": "50000",
          "amountLCY": "50000",
          "comments": [],
          "lastModified": "2025-01-10T12:00:00Z"
        }
      ],
      "linkedPostedApprovalEntries": []
    }
  ]
}
```

**Response Fields:**

The response follows the same structure as Document.Approval.Get. See the [Response Fields](#response-format) section above for field descriptions.

---

### Side Effects

| Action | Description |
| ------ | ----------- |
| Creates Approval Log entry | One `Approval Log ori` record with `Approval Type = Send` |
| Creates Approval Entries | One `Approval Entry` per element in the `approvals` array |
| Updates document status | Sets document to Pending Approval |
| Stores request JSON | The original request payload is stored in the Approval Log `Request` blob |

---

### Error Handling

| Scenario | Behavior |
| -------- | -------- |
| Unsupported table | Error listing supported tables (36, 38, 130) |
| Missing recordSystemId | Error: "Missing required 'recordSystemId' in request" |
| Record not found | Error with SystemId and table ID |
| Missing approvals array | Error: "Missing required 'approvals' array in request" |
| Missing approverUserId | Error with the line index of the offending element |
| lineNumbers on Incoming Document | Error: lineNumbers not supported |
| No document lines (Sales/Purchase) | Error from BC posting calculation |
| Document already Released/Pending Prepayment | Error from status validation |
| Process codeunit failure | Returns error JSON with `error` and `callstack` fields |

---

## Document.Approval.Approve

```json
{
  "type": "Document.Approval.Approve",
  "subject": "5",
  "data": {
    "comment": "Approved for Q2 budget allocation."
  }
}
```

Approves one or more open Approval Entry records using BC standard `Approvals Mgmt.` authorization and cascading.

**Message Direction:** Inbound

**Input Parameters:**

Entry identification follows a resolution priority: `entries` array > `entryNo`/`systemId` in request JSON > `subject` field.

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| subject | Text | No | Entry No. (integer) or SystemId (GUID) of a single approval entry |
| entries | Array | No | Array of entries to approve (batch mode) |
| entries[].entryNo | Integer | No | Entry No. of the approval entry |
| entries[].systemId | String (GUID) | No | SystemId of the approval entry |
| entryNo | Integer | No | Entry No. for single-entry mode (in request JSON) |
| systemId | String (GUID) | No | SystemId for single-entry mode (in request JSON) |
| comment | String | No | Approval comment (max 80 chars), stored as an Approval Comment Line |

**Response Format:**

The response uses the same log-wrapped structure as Document.Approval.Get. Each result element is a full approval log entry with linked entries, plus action-specific fields.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2024-06-10T14:30:00Z",
      "approvalType": "Approve",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "approvalCode": "CE00000001",
      "request": {},
      "linkedApprovalEntries": [
        {
          "entryNo": 5,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "SO-001234",
          "status": "Approved",
          "approverId": "JOHN",
          "dueDate": "2024-06-15",
          "currency": "ISK",
          "amount": "150000",
          "amountLCY": "150000",
          "comments": [],
          "lastModified": "2024-06-10T14:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "entryNo": 5,
      "statusBefore": "Open"
    }
  ]
}
```

**Response Fields:**

The response follows the same log-wrapped structure as Document.Approval.Get (see [Approval Log Entry](#approval-log-entry) and [Linked Approval Entry Fields](#linked-approval-entry-fields) above), with these additional action-specific fields at the result level:

| Field | Type | Description |
| ----- | ---- | ----------- |
| entryNo | Integer | The Approval Entry No. that was acted upon |
| statusBefore | String | Status before the action (always `"Open"`) |

---

### Cascading Behavior

When the last required approval entry for a document is approved, BC standard `Approvals Mgmt.` automatically releases the underlying document (Sales Order, Purchase Order, etc.). No additional API call is needed.

---

### Delegation

Supports approval delegation via BC standard User Setup substitutes. If the caller is configured as an approval substitute for the assigned approver, the approval succeeds.

---

### Usage Examples

**Approve single entry via subject:**

```json
{
  "type": "Document.Approval.Approve",
  "subject": "5"
}
```

**Approve with comment:**

```json
{
  "type": "Document.Approval.Approve",
  "data": {
    "entries": [{"entryNo": 5}],
    "comment": "Approved for Q2 budget allocation."
  }
}
```

**Approve multiple entries (batch):**

```json
{
  "type": "Document.Approval.Approve",
  "data": {
    "entries": [{"entryNo": 5}, {"entryNo": 6}, {"entryNo": 7}],
    "comment": "Batch approved."
  }
}
```

---

### Error Handling

| Scenario | Behavior |
| -------- | -------- |
| No entry resolved | `{"status":"Error","error":"No approval entries could be resolved..."}` |
| Entry not found | `{"status":"Error","error":"Approval Entry N not found."}` |
| Entry not open | `{"status":"Error","error":"Approval Entry N has status X. Only entries with status Open can be approved."}` |
| Unauthorized caller | `{"status":"Error","error":"...","callstack":"..."}` (BC standard authorization error from Approvals Mgmt.) |
| Process codeunit failure | Returns error JSON with `error` and `callstack` fields |

---

## Document.Approval.Reject

```json
{
  "type": "Document.Approval.Reject",
  "subject": "5",
  "data": {
    "comment": "Amount exceeds Q2 budget limit. Please resubmit with reduced quantities."
  }
}
```

Rejects one or more open Approval Entry records using BC standard `Approvals Mgmt.` authorization. Accepts optional `comment` field stored as Approval Comment Lines.

**Message Direction:** Inbound

**Input Parameters:**

Entry identification follows a resolution priority: `entries` array > `entryNo`/`systemId` in request JSON > `subject` field.

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| subject | Text | No | Entry No. (integer) or SystemId (GUID) of a single approval entry |
| entries | Array | No | Array of entries to reject (batch mode) |
| entries[].entryNo | Integer | No | Entry No. of the approval entry |
| entries[].systemId | String (GUID) | No | SystemId of the approval entry |
| entryNo | Integer | No | Entry No. for single-entry mode (in request JSON) |
| systemId | String (GUID) | No | SystemId for single-entry mode (in request JSON) |
| comment | String | No | Optional comment stored as Approval Comment Line. Long comments are word-wrapped across multiple lines |

---

### Comment Storage

When `comment` is provided, it is stored as an Approval Comment Line. Long comments are automatically word-wrapped across multiple lines.

---

**Response Format:**

Same log-wrapped structure as Document.Approval.Approve, with `approvalType` = `"Reject"` and linked entry status = `"Rejected"` after the action.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2024-06-10T14:30:00Z",
      "approvalType": "Reject",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "approvalCode": "CE00000001",
      "request": {},
      "linkedApprovalEntries": [
        {
          "entryNo": 5,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "SO-001234",
          "status": "Rejected",
          "approverId": "JOHN",
          "dueDate": "2024-06-15",
          "currency": "ISK",
          "amount": "150000",
          "amountLCY": "150000",
          "comments": [],
          "lastModified": "2024-06-10T14:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "entryNo": 5,
      "statusBefore": "Open"
    }
  ]
}
```

**Response Fields:**

Same as Document.Approval.Approve — see [Response Fields](#response-format) above. The action-specific fields are:

| Field | Type | Description |
| ----- | ---- | ----------- |
| entryNo | Integer | The Approval Entry No. that was acted upon |
| statusBefore | String | Status before the action (always `"Open"`) |

---

### Delegation

Supports rejection delegation via BC standard User Setup substitutes. If the caller is configured as an approval substitute for the assigned approver, the rejection succeeds.

---

### Usage Examples

**Reject single entry via subject:**

```json
{
  "type": "Document.Approval.Reject",
  "subject": "5"
}
```

**Reject with comment:**

```json
{
  "type": "Document.Approval.Reject",
  "data": {
    "entries": [{"entryNo": 5}],
    "comment": "Amount exceeds Q2 budget limit. Please resubmit with reduced quantities."
  }
}
```

**Reject multiple entries (batch):**

```json
{
  "type": "Document.Approval.Reject",
  "data": {
    "entries": [{"entryNo": 5}, {"entryNo": 6}],
    "comment": "Vendor not in approved list."
  }
}
```

---

### Error Handling

| Scenario | Behavior |
| -------- | -------- |
| No entry resolved | `{"status":"Error","error":"No approval entries could be resolved..."}` |
| Entry not found | `{"status":"Error","error":"Approval Entry N not found."}` |
| Entry not open | `{"status":"Error","error":"Approval Entry N has status X. Only entries with status Open can be rejected."}` |
| Unauthorized caller | `{"status":"Error","error":"...","callstack":"..."}` (BC standard authorization error from Approvals Mgmt.) |
| Process codeunit failure | Returns error JSON with `error` and `callstack` fields |

---

## Document.Approval.Me

```json
{
  "type": "Document.Approval.Me",
  "data": {
    "skip": 0,
    "take": 50
  }
}
```

Returns approval entries assigned to the calling user. Each entry includes the related record's System Id resolved via RecordRef, enabling callers to link approval tasks back to their source documents. Supports skip/take pagination. Only entries where the caller has read permission on the related source record are returned.

**Message Direction:** Outbound (read-only)

**Input Parameters:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| skip | Integer | No | Number of records to skip (default 0) |
| take | Integer | No | Maximum records to return (0 = all) |

The `Approver ID` filter is always enforced to the calling user and cannot be overridden.

---

**Response Format:**

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
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
| --- | --- | --- |
| status | String | "Success" or "Error" |
| noOfRecords | Integer | Total matching entries (before skip/take) |
| result | Array | Approval entry objects |
| entryNo | Integer | Approval Entry No. |
| sequenceNo | Integer | Sequence within the approval chain |
| documentType | String | Source document type (Invoice, Order, etc.) |
| documentNo | String | Source document number |
| status | String | Approval status (Open, Approved, Rejected, etc.) |
| approverId | String | Approver user ID (always the calling user) |
| dueDate | String | Approval due date (ISO 8601, Format 9) |
| currency | String | Currency code (falls back to LCY Code from G/L Setup if blank) |
| amount | String | Amount in document currency (Format 9) |
| amountLCY | String | Amount in local currency (Format 9) |
| approvalCode | String | Approval workflow code |
| lastModified | String | Last modification timestamp (ISO 8601, Format 9) |
| tableId | Integer | Source table ID of the document to approve (only present if caller has read permission) |
| tableName | String | Source table name |
| tableCaption | String | Source table caption (localized) |
| recordSystemId | String (GUID) | System Id of the record to approve |

---

### Permission Filtering

Entries are automatically filtered to the calling user's Approver ID. Only entries where the caller has read permission on the related source record are included in the result. If the related record does not exist or the caller lacks permission, the entry is silently excluded from the response.

---

### Usage Examples

**Get all pending approvals for current user:**

```json
{
  "type": "Document.Approval.Me",
  "data": {}
}
```

**Get with pagination:**

```json
{
  "type": "Document.Approval.Me",
  "data": {
    "skip": 0,
    "take": 25
  }
}
```

---

### Error Handling

| Scenario | Behavior |
| -------- | -------- |
| No entries found | Returns `{"status":"Success","noOfRecords":0,"result":[]}` (empty result, not an error) |
| Malformed request | Standard error response |
| No read permission on Approval Entry | BC standard authorization error |

---

## Document.Approval.Delegate

```json
{
  "type": "Document.Approval.Delegate",
  "subject": "5",
  "data": {
    "delegateToUserId": "NEWUSER"
  }
}
```

Delegates one or more open Approval Entry records to another user. The entry remains in Open status but the Approver ID is changed to the target user. The target user must exist in User Setup.

**Message Direction:** Inbound

**Input Parameters:**

Entry resolution follows the priority order: `entries` array > `entryNo`/`systemId` in request JSON > `subject` field.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| delegateToUserId | Text | Yes | The User ID (from User Setup) to delegate the approval to |
| subject | Text | No | Entry number (integer) or SystemId (GUID) of a single approval entry |
| entries | Array | No | Array of entries to delegate (batch processing) |
| entries[].entryNo | Integer | No | Approval entry number |
| entries[].systemId | String (GUID) | No | Approval entry SystemId |
| entryNo | Integer | No | Entry number for single entry (in request JSON) |
| systemId | String (GUID) | No | SystemId for single entry (in request JSON) |
| comment | String | No | Optional comment stored as Approval Comment Line. Long text is automatically split into multiple lines |

---

### Comment Storage

When `comment` is provided, it is stored as Approval Comment Line. Long text is automatically split into multiple lines.

---

**Response Format:**

Same log-wrapped structure as Document.Approval.Approve, with `approvalType` = `"Delegate"` and an additional `delegatedTo` field.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2024-06-10T14:30:00Z",
      "approvalType": "Delegate",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "approvalCode": "CE00000001",
      "request": {},
      "linkedApprovalEntries": [
        {
          "entryNo": 5,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "SO-001",
          "status": "Open",
          "approverId": "NEWUSER",
          "dueDate": "2024-01-15",
          "currency": "ISK",
          "amount": "150000",
          "amountLCY": "150000",
          "comments": [],
          "lastModified": "2024-06-10T14:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "entryNo": 5,
      "statusBefore": "Open",
      "delegatedTo": "NEWUSER"
    }
  ]
}
```

**Response Fields:**

Same as Document.Approval.Approve (log-wrapped structure), with these action-specific fields:

| Field | Type | Description |
| --- | --- | --- |
| entryNo | Integer | The Approval Entry No. that was acted upon |
| statusBefore | String | Status before the action (always `"Open"`) |
| delegatedTo | String | User ID the entry was delegated to |

---

### Delegation Behavior

Unlike Approve and Reject, delegation does NOT use `ApprovalsMgmt` codeunit. It directly modifies the Approval Entry:
- Sets `Approver ID` to the target user
- Entry status remains **Open** (not changed)
- The new approver can then approve, reject, or further delegate

---

### Substitute Approval

Supports delegation via BC standard User Setup. If the caller is defined as the substitute of the current approver, the delegation succeeds.

---

### Usage Examples

**Delegate a single entry via subject:**

```json
{
  "type": "Document.Approval.Delegate",
  "subject": "5",
  "data": {
    "delegateToUserId": "JANE"
  }
}
```

**Delegate with comment:**

```json
{
  "type": "Document.Approval.Delegate",
  "data": {
    "entries": [{"entryNo": 5}],
    "delegateToUserId": "JANE",
    "comment": "Out of office this week. Jane is handling these."
  }
}
```

**Delegate multiple entries (batch):**

```json
{
  "type": "Document.Approval.Delegate",
  "data": {
    "entries": [{"entryNo": 5}, {"entryNo": 6}],
    "delegateToUserId": "JANE"
  }
}
```

---

### Error Handling

| Scenario | Behavior |
| -------- | -------- |
| Missing delegateToUserId | `{"status":"Error","error":"The delegateToUserId field is required for delegation."}` |
| Target user not found | `{"status":"Error","error":"User Setup for delegate target user NEWUSER not found."}` |
| No entry resolved | `{"status":"Error","error":"No approval entries could be resolved..."}` |
| Entry not found | `{"status":"Error","error":"Approval Entry N not found."}` |
| Entry not open | `{"status":"Error","error":"Approval Entry N has status X. Only entries with status Open can be delegated."}` |
| Process codeunit failure | Returns error JSON with `error` and `callstack` fields |

---

## Document.Approval.Cancel

```json
{
  "type": "Document.Approval.Cancel",
  "data": {
    "tableId": 36,
    "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

Cancels all open approval entries for a document. Sets all open Approval Entries linked to the document to status **Canceled**, creates a Cancel log entry, and reopens the underlying document.

**Message Direction:** Inbound

**Supported Tables:**

| Table ID | Table Name |
| -------- | ---------- |
| 36 | Sales Header |
| 38 | Purchase Header |
| 130 | Incoming Document |

**Prerequisites:**

| Requirement | Details |
| ----------- | ------- |
| Permission Set | The calling user must have the **Approval Access ori** (10077891) permission set assigned. Without it, the request is rejected with: `User <ID> does not have permissions to cancel document approvals via Bifrost.` |

**Input Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| tableId / tableNumber / tableName | Integer or Text | Yes | Identifies the table containing the document |
| recordSystemId | GUID | Yes | SystemId of the document record |

---

### Behavior

1. Resolves the document record by table and SystemId
2. Finds the most recent Approval Log ori entry for the record
3. Sets all linked open Approval Entries to status **Canceled**
4. Creates a new Approval Log entry with `Approval Type = Cancel`
5. Reopens the document (removes Pending Approval status)

---

**Response Format:**

Returns the Cancel log entry with all linked entries (now showing Canceled status) and a `cancelledEntries` count.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2025-01-15T10:30:00Z",
      "approvalType": "Cancel",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "approvalCode": "CE00000001",
      "request": {},
      "linkedApprovalEntries": [
        {
          "entryNo": 5,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "SO-001234",
          "status": "Canceled",
          "approverId": "JOHN",
          "dueDate": "2025-01-31",
          "currency": "ISK",
          "amount": "150000",
          "amountLCY": "150000",
          "comments": [],
          "lastModified": "2025-01-15T10:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "cancelledEntries": 1
    }
  ]
}
```

**Response Fields:**

Same log-wrapped structure as other approval actions. Action-specific field:

| Field | Type | Description |
| ----- | ---- | ----------- |
| cancelledEntries | Integer | Number of approval entries that were set to Canceled |

---

### Error Handling

| Scenario | Behavior |
| -------- | -------- |
| Unsupported table | Error listing supported tables (36, 38, 130) |
| Missing recordSystemId | Error: "Missing required 'recordSystemId' in request" |
| Record not found | Error with SystemId and table ID |
| No approval log entry found | Error: "No approval log entry found for the record" |
| No open entries to cancel | Returns success with `cancelledEntries: 0` |
| Process codeunit failure | Returns error JSON with `error` and `callstack` fields |

---

## Related Message Types

- **[Document.Approval.Get](#documentapprovalget)** — Retrieve existing approval log entries
- **[Document.Approval.Send](#documentapprovalsend)** — Send a document for approval
- **[Document.Approval.Approve](#documentapprovalapprove)** — Approve open approval entries
- **[Document.Approval.Reject](#documentapprovalreject)** — Reject open approval entries
- **[Document.Approval.Cancel](#documentapprovalcancel)** — Cancel all open entries and reopen document
- **[Document.Approval.Me](#documentapprovalme)** — Get entries assigned to current user
- **[Document.Approval.Delegate](#documentapprovaldelegate)** — Delegate entries to another user
- **[Data.Records.Get](/foundation/message-types/data/#datarecordsget)** — Generic record retrieval from any BC table
