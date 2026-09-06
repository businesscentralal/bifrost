---
id: document-approval-delegate
title: "Document.Approval.Delegate"
sidebar_label: "Document.Approval.Delegate"
sidebar_position: 26
description: "Request and response contract for the Document.Approval.Delegate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Delegates one or more open Approval Entry records to another approver. The target user must already be set up as a Substitute in BC standard User Setup; otherwise the call fails.

## Direction
Inbound

## Response Content Type
`text/json`

## Idempotency
Not idempotent. Once delegated, the Approver ID changes and the original entry is no longer addressable by the original approver.

## Identifier Resolution
1. `entries` array in request JSON
2. `entryNo` or `systemId` in request JSON
3. Bifrost `subject` (integer Entry No. or GUID SystemId)

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| delegateToUserId | Text | Yes | User ID of the substitute approver |
| entries | Array | No | Batch of entry references (`entryNo` or `systemId`) |
| entryNo | Integer | No | Single-entry mode |
| systemId | GUID | No | Single-entry mode |
| comment | Text | No | Stored as Approval Comment Line |

## Request Example
```json
{
  "type": "Document.Approval.Delegate",
  "data": {
    "entries": [{"entryNo": 5}],
    "delegateToUserId": "JANE",
    "comment": "Out of office until Friday."
  }
}
```

## Response Shape
Each `result` element is an approval log wrapper (same as `Document.Approval.Get`) with `approvalType` `Delegate` and these extra fields:
| Field | Type | Description |
|-------|------|-------------|
| entryNo | Integer | Approval Entry No. that was delegated |
| statusBefore | Text | Always `Open` |
| delegatedTo | Text | New Approver ID after delegation |

## Errors
| Condition | Error message |
|-----------|---------------|
| Missing delegateToUserId | `The delegateToUserId field is required for delegation.` |
| Target user missing User Setup | `User Setup for delegate target user {userId} not found.` |
| No entries resolved | `No approval entries could be resolved from the request. Provide entryNo or systemId via subject, request JSON, or entries array.` |
| Entry not found | `Approval Entry {entryNo} not found.` |
| SystemId not found | `Approval Entry with SystemId {systemId} not found.` |
| Entry not Open | `Approval Entry {entryNo} has status {status}. Only entries with status Open can be delegated.` |

## Related Message Types
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Get`
- `Document.Approval.Me`

