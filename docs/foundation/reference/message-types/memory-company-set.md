---
id: memory-company-set
title: "Memory.Company.Set"
sidebar_label: "Memory.Company.Set"
sidebar_position: 98
description: "Request and response contract for the Memory.Company.Set Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Inserts or updates company-scoped memory records in `Bifrost Memory`. Each item in `data` is keyed by `id` (GUID). If the record exists it is modified; otherwise it is inserted. Supplying `memory` replaces the blob; an empty string clears it. Each record is processed individually — a single failing item does not stop the batch.

## Direction
Inbound

## Response Content Type
`text/json`

## Idempotency
Idempotent per `id`: re-sending the same payload yields the same final state.

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| data | Array | Yes | One or more memory records (see below) |

### Memory Record Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | GUID | Yes | Primary key |
| description | Text | No | Short description |
| memory | Text | No | Full memory blob (UTF-8); empty string clears the blob |

## Request Example
The payload (the Bifrost `data` attribute) may be **either** a bare JSON array of records, **or** an object with a `data` array property. Both are accepted.

Bare array (recommended via the `call_message_type` MCP tool — pass this as the tool's `data` argument):
```json
[
  { "id": "a1b2c3d4-...", "description": "Pricing rules", "memory": "..." }
]
```

Object form (data attribute wraps a `data` array):
```json
{ "data": [ { "id": "a1b2c3d4-...", "description": "Pricing rules", "memory": "..." } ] }
```

`id` is optional — omit it to insert a new record (a GUID is assigned and returned); supply it to update an existing record.

## Response Shape
```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [ { "id": "a1b2c3d4-...", "description": "Pricing rules", "memory": "..." } ]
}
```

## Errors
| Condition | Error message |
|-----------|---------------|
| Missing data array | `Missing record data. Provide a JSON array of records as the payload, or an object with a "data" array property.` |
| Per-record failure | `Error processing record {n}` |
| Nothing applied | `status: Error` with `No records were inserted or updated. Please check the data and try again.` |
| Write permission denied | `You do not have permission to write to company memory. The 'BIFROST CoMem ori' permission set is required in addition to 'BIFROST API ori'.` |

## Required Permissions
Writing company memory requires the `BIFROST CoMem ori` permission set in addition to the base `BIFROST API ori`. Without it the request returns the write-permission error above; the `Help.WhoAmI.Get` response also exposes a `canUpdateCompanyMemory` flag callers can check up front.

## Related Message Types
- `Memory.Company.Get`
- `Memory.Company.List`
- `Memory.User.Set`

