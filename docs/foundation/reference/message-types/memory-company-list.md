---
id: memory-company-list
title: "Memory.Company.List"
sidebar_label: "Memory.Company.List"
sidebar_position: 97
description: "Request and response contract for the Memory.Company.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Lists company-scoped memory records with `id` and `description` only — the `memory` blob is omitted. Use this for browsing or selection screens before fetching content via `Memory.Company.Get`.

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
  "noOfRecords": 2,
  "result": [
    { "id": "a1b2c3d4-...", "description": "Pricing rules" },
    { "id": "e5f6a7b8-...", "description": "Discount policies" }
  ]
}
```

## Required Permissions
Read access is granted by `BIFROST API ori` (the base API permission set) plus the inherent permission on the implementation codeunit. No additional permission set is required to list company memory.

## Related Message Types
- `Memory.Company.Get`
- `Memory.Company.Set`
- `Memory.User.List`

