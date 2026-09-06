---
id: memory-user-get
title: "Memory.User.Get"
sidebar_label: "Memory.User.Get"
sidebar_position: 99
description: "Request and response contract for the Memory.User.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns user-scoped memory records from `Bifrost User Memory`, filtered to the current user. Includes the `memory` text blob.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skip | Integer | No | Number of records to skip |
| take | Integer | No | Page size (0 = no limit) |
| tableView | Text | No | BC `SetView` filter expression |

## Response Shape
```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    { "userName": "JANE", "id": "a1b2c3d4-...", "description": "My personal notes", "memory": "..." }
  ]
}
```

## Related Message Types
- `Memory.User.List`
- `Memory.User.Set`
- `Memory.Company.Get`

