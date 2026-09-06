---
id: user-notification-get
title: "User.Notification.Get"
sidebar_label: "User.Notification.Get"
sidebar_position: 138
description: "Request and response contract for the User.Notification.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns notification notes from `Bifrost Note` where the current `UserId()` is the recipient. Includes the `Body` blob.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skip | Integer | No | Number of records to skip |
| take | Integer | No | Page size (0 = no limit) |
| tableView | Text | No | BC `SetView` filter expression (additional filter on top of recipient filter) |

## Response Shape
```json
{
  "status": "Success",
  "noOfRecords": 5,
  "result": ["...one object per Bifrost Note record..."]
}
```

## Related Message Types
- `User.Notification.Count`
- `User.Notification.Thread`
- `User.Notification.Read`
- `User.Notification.Send`

