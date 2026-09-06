---
id: user-notification-send
title: "User.Notification.Send"
sidebar_label: "User.Notification.Send"
sidebar_position: 140
description: "Request and response contract for the User.Notification.Send Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Creates a new notification note in `Bifrost Note`. The sender is always set to the current `UserId()`. Use `threadId` + `parentEntryNo` to append to an existing thread, or omit both to start a new conversation. Optional `relatedTableId` + `relatedRecordSystemId` link the note to a BC record.

## Direction
Inbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| recipientUserId | Code[50] | Yes | Recipient user (the BC user name) |
| subject | Text[250] | Yes | Notification subject |
| body | Text | No | Body content stored in the Body blob |
| threadId | GUID | No | Existing thread to append to |
| parentEntryNo | Integer | Required when `threadId` is supplied | Entry No. of the parent note |
| relatedTableId | Integer | No | Linked BC table ID |
| relatedRecordSystemId | GUID | No | Linked BC record SystemId |
| notificationType | Text | No | Name of a `Notification Entry Type` enum value |

## Request Example
```json
{
  "type": "User.Notification.Send",
  "data": {
    "recipientUserId": "JANE",
    "subject": "Please review SO-1023",
    "body": "Customer asked about shipping date.",
    "relatedTableId": 36,
    "relatedRecordSystemId": "a1b2c3d4-..."
  }
}
```

## Response Shape
The created Bifrost Note record serialized to JSON (no wrapping `status`/`result` envelope).

## Errors
| Condition | Error message |
|-----------|---------------|
| Missing recipientUserId | `Missing required field 'recipientUserId' in request.` |
| Missing or empty subject | `Missing required field 'subject' in request.` |
| threadId without parentEntryNo | `Missing required field 'parentEntryNo' when 'threadId' is specified.` |

## Related Message Types
- `User.Notification.Get`
- `User.Notification.Thread`
- `User.Notification.Read`

