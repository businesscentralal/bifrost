---
id: document-approval-cancel
title: "Document.Approval.Cancel"
sidebar_label: "Document.Approval.Cancel"
sidebar_position: 25
description: "Request and response contract for the Document.Approval.Cancel Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Cancels all open approval entries for a document by routing through BC standard `Approvals Mgmt.OnCancelDocumentApprovalRequest`. Only callable by users granted permission in Bifrost Setup. Restricted to a fixed set of supported document tables.

## Direction
Inbound

## Response Content Type
`text/json`

## Idempotency
Not idempotent. Re-running after all open entries are gone returns `No open approval entries found for this document.`

## Supported Tables
- 36 Sales Header
- 38 Purchase Header
- 130 Incoming Document

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int or Text | Yes | Identifies the document table |
| recordSystemId | GUID | Yes | SystemId of the document |

## Request Example
```json
{
  "type": "Document.Approval.Cancel",
  "data": { "tableId": 36, "recordSystemId": "a1b2c3d4-..." }
}
```

## Response Shape
Returns an approval log wrapper of `approvalType` `Cancel` with `linkedApprovalEntries` reflecting the canceled entries.
```json
{
  "status": "Success", "noOfRecords": 1,
  "result": [{
    "id": "...", "lastModified": "2024-06-10T14:30:00Z",
    "approvalType": "Cancel",
    "tableId": 36, "tableName": "Sales Header", "tableCaption": "Sales Header",
    "recordSystemId": "a1b2c3d4-...", "approvalCode": "CE00000000010",
    "request": {},
    "linkedApprovalEntries": [],
    "linkedPostedApprovalEntries": []
  }]
}
```

## Errors
| Condition | Error message |
|-----------|---------------|
| Unsupported table | `Table {tableId} ({tableName}) is not supported for Document.Approval.Cancel. Supported tables: Sales Header (36), Purchase Header (38), Incoming Document (130).` |
| Missing recordSystemId | `Missing required 'recordSystemId' in request.` |
| Permission denied | `User {userId} does not have permissions to cancel document approvals via Bifrost.` |
| Record not found | `Record with SystemId {systemId} not found in table {tableId}.` |
| No open entries | `No open approval entries found for this document.` |

## Related Message Types
- `Document.Approval.Send`
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Get`

