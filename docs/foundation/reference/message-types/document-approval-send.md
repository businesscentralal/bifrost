---
id: document-approval-send
title: "Document.Approval.Send"
sidebar_label: "Document.Approval.Send"
sidebar_position: 30
description: "Request and response contract for the Document.Approval.Send Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Sends a document to approval by creating Approval Entry rows directly (bypassing BC standard approval workflow definitions). The caller fully specifies the approver chain. Only callable by users granted permission in Bifrost Setup. Restricted to a fixed set of supported document tables.

## Direction
Inbound

## Response Content Type
`text/json`

## Idempotency
Not idempotent. Re-sending while open entries already exist creates a parallel approval chain.

## Supported Tables
- 36 Sales Header
- 38 Purchase Header
- 130 Incoming Document

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int or Text | Yes | Identifies the document table |
| recordSystemId | GUID | Yes | SystemId of the document |
| approvals | Array | Yes | One or more approval lines (see below) |
| comment | Text | No | Stored as Approval Comment Line on each entry |

### Approval Line Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| approverUserId | Text | Yes | User ID of the approver |
| sequenceNo | Integer | No | Order within the chain (defaults to line index) |
| dueDate | Date | No | Approval Due Date |
| lineNumbers | Array | No | Subset of document line numbers to approve (partial approval); omit for the whole document |

## Request Example
```json
{
  "type": "Document.Approval.Send",
  "data": {
    "tableId": 36,
    "recordSystemId": "a1b2c3d4-...",
    "approvals": [
      { "approverUserId": "JANE", "sequenceNo": 1, "dueDate": "2024-06-15" },
      { "approverUserId": "BOB",  "sequenceNo": 2 }
    ]
  }
}
```

## Partial Approval
When `lineNumbers` is supplied on any approval line, the amount and quantity for that entry are summed only across the selected lines. A note is added to the response describing the coverage:
> `Approval covers {N} of {M} lines ({Pct}%), {AmountPct}% of total amount.`

## Response Shape
Returns an approval log wrapper of `approvalType` `Send` with `linkedApprovalEntries` populated for each created entry.

## Errors
| Condition | Error message |
|-----------|---------------|
| Missing approvals array | `Missing required 'approvals' array in request.` |
| Missing approver on line | `Missing required 'approverUserId' in approval line {n}.` |
| Unsupported table | `Table {tableId} ({tableName}) is not supported for Document.Approval.Send. Supported tables: Sales Header (36), Purchase Header (38), Incoming Document (130).` |
| Missing recordSystemId | `Missing required 'recordSystemId' in request.` |
| Permission denied | `User {userId} does not have permissions to send documents to approval via Bifrost.` |
| Nothing to approve | `There is nothing to approve for {tableId} {recordSystemId}.` |

## Related Message Types
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Delegate`
- `Document.Approval.Cancel`
- `Document.Approval.Get`

