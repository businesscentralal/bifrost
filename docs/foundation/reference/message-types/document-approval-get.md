---
id: document-approval-get
title: "Document.Approval.Get"
sidebar_label: "Document.Approval.Get"
sidebar_position: 27
description: "Request and response contract for the Document.Approval.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns Bifrost Approval Log entries — the audit trail for every approval action processed by Bifrost (Send, Approve, Reject, Delegate, Cancel). Each entry includes the original request payload, the linked open Approval Entry rows, and any Posted Approval Entry rows that resulted.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skip | Integer | No | Pagination offset (default 0) |
| take | Integer | No | Page size (default 50, max 1000) |
| tableView | Text | No | BC-style filter against `Bifrost Approval Log` (e.g. `WHERE(Field1=FILTER(Value))`) |

## Permission Filtering
Each row is filtered against the caller's read permission for the underlying record (resolved via tableId + recordSystemId). When the caller lacks permission, `tableId`, `tableName` and `tableCaption` are omitted from that row.

## Request Example
```json
{
  "type": "Document.Approval.Get",
  "data": { "skip": 0, "take": 50 }
}
```

## Response Shape
```json
{
  "status": "Success", "noOfRecords": 1,
  "result": [{
    "id": "...", "lastModified": "2024-06-10T14:30:00Z",
    "approvalType": "Approve",
    "tableId": 36, "tableName": "Sales Header", "tableCaption": "Sales Header",
    "recordSystemId": "...", "approvalCode": "CE00000000001",
    "request": { "...": "original Bifrost payload" },
    "linkedApprovalEntries": [{
      "entryNo": 5, "sequenceNo": 1, "documentNo": "SO-100",
      "status": "Open", "approverId": "JANE",
      "dueDate": "2024-06-15", "currency": "USD",
      "amount": 1000.0, "amountLCY": 1000.0,
      "lastModified": "2024-06-10T14:30:00Z"
    }],
    "linkedPostedApprovalEntries": [{
      "entryNo": 5, "sequenceNo": 1, "documentNo": "SO-100",
      "status": "Approved", "approverId": "JANE",
      "dueDate": "2024-06-15", "currency": "USD",
      "amount": 1000.0, "amountLCY": 1000.0,
      "lastModified": "2024-06-10T14:35:00Z"
    }]
  }]
}
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| id | GUID | Approval log SystemId |
| lastModified | DateTime | Approval log SystemModifiedAt |
| approvalType | Text | One of Send, Approve, Reject, Delegate, Cancel |
| tableId / tableName / tableCaption | Int / Text / Text | Document table (omitted if no permission) |
| recordSystemId | GUID | Document SystemId |
| approvalCode | Code | Bifrost sequential code (e.g. `CE00000000001`) |
| request | Object | Original Bifrost JSON |
| linkedApprovalEntries | Array | Open Approval Entry rows for the document |
| linkedPostedApprovalEntries | Array | Posted Approval Entry rows for the document |

## Related Message Types
- `Document.Approval.Send`
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Delegate`
- `Document.Approval.Cancel`
- `Document.Approval.Me`

