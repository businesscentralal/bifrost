---
id: user-notification-thread
title: "User.Notification.Thread"
sidebar_label: "User.Notification.Thread"
sidebar_position: 141
description: "Request and response contract for the User.Notification.Thread Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Retrieves all notification notes that belong to a specific thread. Visibility check: the current user must have at least one note in the thread (as recipient); if so, the full thread is returned regardless of which users sent or received each individual note.

## Direction
Outbound

## Response Content Type
`text/json`

## Identifier Resolution
The Bifrost `subject` field MUST contain the Thread ID as a GUID.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skip | Integer | No | Number of records to skip |
| take | Integer | No | Page size (0 = no limit) |

## Response Shape
```json
{
  "status": "Success",
  "noOfRecords": 4,
  "result": ["...one object per Bifrost Note in the thread..."]
}
```

## Errors
| Condition | Error message |
|-----------|---------------|
| Subject is not a GUID | `The subject must contain the Thread ID (GUID) to retrieve.` |
| Caller has no note in this thread | `No notifications found for the specified Thread ID and current user.` |

## Related Message Types
- `User.Notification.Get`
- `User.Notification.Send`

