---
id: memory-user-get
title: "Memory.User.Get"
sidebar_label: "Memory.User.Get"
sidebar_position: 99
description: "Beiðni- og svarsamningur fyrir Memory.User.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
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
| take | Integer | No | Page size (default 100, hard maximum 1000) |
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

## Pagination Limits
`skip` defaults to 0 and rejects negative values. `take` defaults to 100 when omitted or zero, rejects negative values, and is clamped to the hard maximum of 1000.

## Errors

| Code | Error | Cause |
|---|---|---|
| `InvalidFilterField` | `Invalid tableView: field "{token}" does not exist in table 10077894. Did you mean "{field}"? Valid field names: ...` | `tableView` names a field that does not exist. `parameter` is `tableView`, `received` the field token, `nextStep` the suggestion. Nothing is returned. |
| `InvalidFilterField` | `Invalid tableView: unbalanced parentheses.` | The parentheses in `tableView` do not balance. Nothing is returned. |

## Related Message Types
- `Memory.User.List`
- `Memory.User.Set`
- `Memory.Company.Get`

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

