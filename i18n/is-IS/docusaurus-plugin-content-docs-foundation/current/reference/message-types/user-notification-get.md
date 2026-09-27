---
id: user-notification-get
title: "User.Notification.Get"
sidebar_label: "User.Notification.Get"
sidebar_position: 138
description: "Beiðni- og svarsamningur fyrir User.Notification.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
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
| take | Integer | No | Page size (default 100, hard maximum 1000) |
| tableView | Text | No | BC `SetView` filter expression (additional filter on top of recipient filter) |

## Response Shape
```json
{
  "status": "Success",
  "noOfRecords": 5,
  "result": ["...one object per Bifrost Note record..."]
}
```

## Pagination Limits
`skip` defaults to 0 and rejects negative values. `take` defaults to 100 when omitted or zero, rejects negative values, and is clamped to the hard maximum of 1000.

## Errors

| Code | Error | Cause |
|---|---|---|
| `InvalidFilterField` | `Invalid tableView: field "{token}" does not exist in table 10077898. Did you mean "{field}"? Valid field names: ...` | `tableView` names a field that does not exist. `parameter` is `tableView`, `received` the field token, `nextStep` the suggestion. Nothing is returned. |
| `InvalidFilterField` | `Invalid tableView: unbalanced parentheses.` | The parentheses in `tableView` do not balance. Nothing is returned. |

## Related Message Types
- `User.Notification.Count`
- `User.Notification.Thread`
- `User.Notification.Read`
- `User.Notification.Send`

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

