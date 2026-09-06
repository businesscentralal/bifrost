---
id: document-approval-me
title: "Document.Approval.Me"
sidebar_label: "Document.Approval.Me"
sidebar_position: 28
description: "Request and response contract for the Document.Approval.Me Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns the calling user's open Approval Entry records. The filter `Approver ID = UserId()` is applied unconditionally — any caller-supplied filter on Approver ID is ignored.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skip | Integer | No | Pagination offset (default 0) |
| take | Integer | No | Page size (default 50, max 1000) |

## Request Example
```json
{
  "type": "Document.Approval.Me",
  "data": { "skip": 0, "take": 50 }
}
```

## Response Shape
Each `result` element wraps one Approval Entry. Fields prefixed with `record*` describe the document being approved.
```json
{
  "status": "Success", "noOfRecords": 1,
  "result": [{
    "entryNo": 5, "sequenceNo": 1, "documentNo": "SO-100",
    "status": "Open", "approverId": "ME",
    "dueDate": "2024-06-15", "currency": "USD",
    "amount": 1000.0, "amountLCY": 1000.0,
    "lastModified": "2024-06-10T14:30:00Z",
    "approvalCode": "CE00000000001",
    "tableId": 36, "tableName": "Sales Header", "tableCaption": "Sales Header",
    "recordSystemId": "..."
  }]
}
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| entryNo | Integer | Approval Entry No. |
| sequenceNo | Integer | Sequence within the approval chain |
| documentNo | Code | Document No. |
| status | Text | Always `Open` for results returned by Me |
| approverId | Text | Always the calling user |
| dueDate | Date | Approval Entry Due Date |
| currency | Code | Currency Code (LCY if blank in BC) |
| amount | Decimal | Amount in document currency |
| amountLCY | Decimal | Amount in local currency |
| lastModified | DateTime | Approval Entry SystemModifiedAt |
| approvalCode | Code | Bifrost approval log code, if a log entry exists |
| tableId / tableName / tableCaption / recordSystemId | mixed | Document being approved |

## Related Message Types
- `Document.Approval.Get`
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Delegate`

