---
id: document-approval-approve
title: "Document.Approval.Approve"
sidebar_label: "Document.Approval.Approve"
sidebar_position: 24
description: "Request and response contract for the Document.Approval.Approve Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Approves one or more open Approval Entry records using BC standard `Approvals Mgmt.` Cascades automatically: when the last required entry is approved, BC releases the underlying document. Supports delegation via BC standard User Setup substitutes.

## Direction
Inbound

## Response Content Type
`text/json`

## Idempotency
Not idempotent. Re-running on an entry whose status is no longer `Open` returns an error.

## Identifier Resolution
1. `entries` array in request JSON
2. `entryNo` or `systemId` in request JSON
3. Bifrost `subject` (integer Entry No. or GUID SystemId)

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entries | Array | No | Batch of entry references, each with `entryNo` or `systemId` |
| entryNo | Integer | No | Single-entry mode |
| systemId | GUID | No | Single-entry mode |
| comment | Text | No | Stored as Approval Comment Line, word-wrapped if long |

## Request Examples
Single entry via subject:
```json
{ "type": "Document.Approval.Approve", "subject": "5" }
```
Batch with comment:
```json
{
  "type": "Document.Approval.Approve",
  "data": {
    "entries": [{"entryNo": 5}, {"entryNo": 6}],
    "comment": "Approved for Q2 budget."
  }
}
```

## Response Shape
Each `result` element is an approval log wrapper (same as `Document.Approval.Get`) extended with action-specific fields.
```json
{
  "status": "Success", "noOfRecords": 1,
  "result": [{
    "id": "f1e2...", "lastModified": "2024-06-10T14:30:00Z",
    "approvalType": "Approve",
    "tableId": 36, "tableName": "Sales Header", "tableCaption": "Sales Header",
    "recordSystemId": "a1b2...", "approvalCode": "CE00000000001",
    "request": { },
    "linkedApprovalEntries": ["...see Document.Approval.Get for shape..."],
    "linkedPostedApprovalEntries": [],
    "entryNo": 5, "statusBefore": "Open"
  }]
}
```

## Action-Specific Result Fields
| Field | Type | Description |
|-------|------|-------------|
| entryNo | Integer | Approval Entry No. that was approved |
| statusBefore | Text | Always `Open` |

## Errors
| Condition | Error message |
|-----------|---------------|
| No entries resolved | `No approval entries could be resolved from the request. Provide entryNo or systemId via subject, request JSON, or entries array.` |
| Entry not found | `Approval Entry {entryNo} not found.` |
| SystemId not found | `Approval Entry with SystemId {systemId} not found.` |
| Entry not Open | `Approval Entry {entryNo} has status {status}. Only entries with status Open can be approved.` |

## Related Message Types
- `Document.Approval.Send`
- `Document.Approval.Reject`
- `Document.Approval.Delegate`
- `Document.Approval.Cancel`
- `Document.Approval.Get`
- `Document.Approval.Me`

