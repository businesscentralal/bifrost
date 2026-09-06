---
id: user-notification-read
title: "User.Notification.Read"
sidebar_label: "User.Notification.Read"
sidebar_position: 139
description: "Request and response contract for the User.Notification.Read Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Marks one or more notification notes as read or unread. Only notes where the current `UserId()` is the recipient are affected. Entries that are already in the requested state, or that belong to other users, are silently ignored. The response lists the records that were actually changed.

## Direction
Inbound

## Response Content Type
`text/json`

## Idempotency
Idempotent: re-sending the same payload produces no further changes.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entryNos | Array of Integer | Yes | `Entry No.` values to update |
| isRead | Boolean | No | Target state (default `true`) |

## Request Example
```json
{ "type": "User.Notification.Read", "data": { "entryNos": [101, 102, 103], "isRead": true } }
```

## Response Shape
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": ["...one object per modified record..."]
}
```

## Errors
| Condition | Error message |
|-----------|---------------|
| Missing or non-array entryNos | `Missing required field 'entryNos' (array of integers) in request.` |

## Related Message Types
- `User.Notification.Get`
- `User.Notification.Count`

