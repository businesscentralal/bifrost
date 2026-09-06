---
id: memory-user-set
title: "Memory.User.Set"
sidebar_label: "Memory.User.Set"
sidebar_position: 101
description: "Request and response contract for the Memory.User.Set Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Inserts or updates user-scoped memory records in `Bifrost User Memory`. The current `UserId()` is forced as the owning user — records cannot be written for other users. Each item in `data` is keyed by `id` (GUID); existing rows are modified, new ones are inserted. Supplying `memory` replaces the blob; empty string clears it.

## Direction
Inbound

## Response Content Type
`text/json`

## Idempotency
Idempotent per `id`: re-sending the same payload yields the same final state.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| data | Array | Yes | One or more memory records |

### Memory Record Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | GUID | Yes | Primary key (within current user) |
| description | Text | No | Short description |
| memory | Text | No | Full memory blob (UTF-8); empty string clears the blob |

## Request Example
The payload (the Bifrost `data` attribute) may be **either** a bare JSON array of records, **or** an object with a `data` array property. Both are accepted.

Bare array (recommended via the `call_message_type` MCP tool — pass this as the tool's `data` argument):
```json
[
  { "id": "a1b2c3d4-...", "description": "My personal notes", "memory": "..." }
]
```

Object form (data attribute wraps a `data` array):
```json
{ "data": [ { "id": "a1b2c3d4-...", "description": "My personal notes", "memory": "..." } ] }
```

`id` is optional — omit it to insert a new record (a GUID is assigned and returned); supply it to update an existing record.

## Response Shape
```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [ { "userName": "JANE", "id": "a1b2c3d4-...", "description": "My personal notes", "memory": "..." } ]
}
```

## Errors
| Condition | Error message |
|-----------|---------------|
| Missing data array | `Missing record data. Provide a JSON array of records as the payload, or an object with a "data" array property.` |
| Per-record failure | `Error processing record {n}` |
| Nothing applied | `status: Error` with `No records were inserted or updated. Please check the data and try again.` |

## Related Message Types
- `Memory.User.Get`
- `Memory.User.List`
- `Memory.Company.Set`

