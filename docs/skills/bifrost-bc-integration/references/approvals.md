---
id: approvals
title: "Document approvals"
sidebar_label: "Document approvals"
sidebar_position: 15
description: "The document approval workflow end to end: sending a document for approval, approving, rejecting, delegating and cancelling entries, listing the entries assigned to the calling user, and reading the approval log."
---

The document approval workflow end to end: sending a document for approval, approving, rejecting, delegating and cancelling entries, listing the entries assigned to the calling user, and reading the approval log.

[← back to SKILL.md](../index.md) · originally sections 7.8 of the single-file skill.

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
