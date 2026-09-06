---
id: user-notification-count
title: "User.Notification.Count"
sidebar_label: "User.Notification.Count"
sidebar_position: 137
description: "Request and response contract for the User.Notification.Count Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns total, unread, and read counts of notification notes addressed to the current `UserId()` recipient. Inexpensive — does not load the body blob.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
None.

## Response Shape
```json
{ "status": "Success", "total": 12, "unread": 3, "read": 9 }
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| total | Integer | All notes addressed to the current user |
| unread | Integer | Notes where `Is Read` is false |
| read | Integer | total - unread |

## Related Message Types
- `User.Notification.Get`
- `User.Notification.Read`

