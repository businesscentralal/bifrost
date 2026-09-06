---
id: document-approval-reject
title: "Document.Approval.Reject"
sidebar_label: "Document.Approval.Reject"
sidebar_position: 29
description: "Request and response contract for the Document.Approval.Reject Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Rejects one or more open Approval Entry records using BC standard `Approvals Mgmt.` When a required entry is rejected, BC removes the remaining open entries and reopens the underlying document.

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
| entries | Array | No | Batch of entry references (`entryNo` or `systemId`) |
| entryNo | Integer | No | Single-entry mode |
| systemId | GUID | No | Single-entry mode |
| comment | Text | No | Stored as Approval Comment Line, word-wrapped if long |

## Request Example
```json
{
  "type": "Document.Approval.Reject",
  "data": {
    "entries": [{"entryNo": 5}],
    "comment": "Budget exceeded — please revise."
  }
}
```

## Response Shape
Each `result` element is an approval log wrapper (same as `Document.Approval.Get`) with `approvalType` `Reject` and these extra fields:
| Field | Type | Description |
|-------|------|-------------|
| entryNo | Integer | Approval Entry No. that was rejected |
| statusBefore | Text | Always `Open` |

## Errors
| Condition | Error message |
|-----------|---------------|
| No entries resolved | `No approval entries could be resolved from the request. Provide entryNo or systemId via subject, request JSON, or entries array.` |
| Entry not found | `Approval Entry {entryNo} not found.` |
| SystemId not found | `Approval Entry with SystemId {systemId} not found.` |
| Entry not Open | `Approval Entry {entryNo} has status {status}. Only entries with status Open can be rejected.` |

## Related Message Types
- `Document.Approval.Approve`
- `Document.Approval.Delegate`
- `Document.Approval.Cancel`
- `Document.Approval.Get`
- `Document.Approval.Me`

