---
id: memory-company-get
title: "Memory.Company.Get"
sidebar_label: "Memory.Company.Get"
sidebar_position: 96
description: "Request and response contract for the Memory.Company.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns company-scoped memory records from `Bifrost Memory` (filtered to the current company). Includes the `memory` text blob.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skip | Integer | No | Number of records to skip (paging) |
| take | Integer | No | Page size (0 = no limit) |
| tableView | Text | No | BC `SetView` filter expression |

## Request Example
```json
{ "type": "Memory.Company.Get", "data": { "skip": 0, "take": 50 } }
```

## Response Shape
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    { "id": "a1b2c3d4-...", "description": "Pricing rules",      "memory": "..." },
    { "id": "e5f6a7b8-...", "description": "Discount policies",  "memory": "..." }
  ]
}
```

## Result Fields
| Field | Type | Description |
|-------|------|-------------|
| id | GUID | Memory record primary key |
| description | Text | Short description |
| memory | Text | Full memory blob (UTF-8) |

## Required Permissions
Read access is granted by `BIFROST API ori` (the base API permission set) plus the inherent permission on the implementation codeunit. No additional permission set is required to read company memory.

## Related Message Types
- `Memory.Company.List`
- `Memory.Company.Set`
- `Memory.User.Get`

