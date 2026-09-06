---
id: memory-user-list
title: "Memory.User.List"
sidebar_label: "Memory.User.List"
sidebar_position: 100
description: "Request and response contract for the Memory.User.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Lists user-scoped memory records with `userName`, `id`, and `description` only. The `memory` blob is omitted. Use before `Memory.User.Get` to choose which item to load.

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
    { "userName": "JANE", "id": "a1b2c3d4-...", "description": "My personal notes" }
  ]
}
```

## Related Message Types
- `Memory.User.Get`
- `Memory.User.Set`
- `Memory.Company.List`

