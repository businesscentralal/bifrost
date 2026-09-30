---
id: data-requestlog-get
title: "Data.RequestLog.Get"
sidebar_label: "Data.RequestLog.Get"
sidebar_position: 20
description: "Request and response contract for the Data.RequestLog.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns the request log entries (outbound HTTP calls made by Bifröst apps) that belong to the calling user, with skip/take paging and an optional table view.

**Direction:** Outbound  **Content-Type:** text/json

Use it to see which HTTP calls your session made, to diagnose a service error (HTTP status, error text, raw bodies) or to page through a long request history.

**Security:** the call always filters on `SystemCreatedBy = UserSecurityId()` and returns only your own entries. A `tableView` cannot widen that filter.

## Request Parameters

| Parameter | Type | Default | Notes |
|---|---|---|---|
| `skip` | int | 0 | Entries to skip. `>= 0`. A JSON integer or a string of digits. |
| `take` | int | 20 | Entries to return, `1` to `100`. A JSON integer or a string of digits. |
| `tableView` | text | — | A BC table view on the request log, for example `SORTING(Sent At) ORDER(Descending) WHERE(Success=CONST(0))`. Field names are the display names (`Sent At`, `Service Name`, `HTTP Status`, `Success`, `Log Type`). An unknown field or unbalanced parentheses is an error and nothing is returned. |

```json
{ "skip": 0, "take": 20, "tableView": "SORTING(Sent At)" }
```

## Response Shape
```json
{
  "skip":       0,
  "take":       20,
  "totalCount": 42,
  "count":      20,
  "entries": [
    {
      "entryNo":        1001,
      "sentAt":         "2026-06-13T10:30:00",
      "operation":      "Authentication",
      "serviceName":    "Umsja",
      "serviceBaseUrl": "https://apinreg.umsja.is",
      "fullUrl":        "https://apinreg.umsja.is/api/Authentication",
      "httpMethod":     "GET",
      "httpStatus":     200,
      "elapsedMs":      843,
      "success":        true,
      "errorText":      "",
      "userId":         "ADMIN",
      "logType":        "Umsja",
      "requestBody":    "",
      "responseBody":   "{ ... }"
    }
  ]
}
```

## Examples

The 10 most recent failed calls:
```json
{
  "take":      10,
  "tableView": "SORTING(Sent At) ORDER(Descending) WHERE(Success=CONST(0))"
}
```

Calls to one service:
```json
{
  "tableView": "WHERE(Service Name=CONST(Arion))"
}
```

## Errors

| Code | Error | Cause |
|---|---|---|
| `InvalidFilterField` | `Invalid tableView: field "{token}" does not exist in table 10078258. Did you mean "{field}"? Valid field names: ...` | `tableView` names a field the request log does not have. `parameter` is `tableView`, `received` the field token, `nextStep` the suggestion. |
| `InvalidFilterField` | `Invalid tableView: unbalanced parentheses.` | The parentheses in `tableView` do not balance. |
| `InvalidFilterField` | `tableView is not a valid AL table view string.` | BC could not apply the view. |
| `InvalidParameter` | `skip must be >= 0 and take must be between 1 and 100.` | `skip` or `take` is out of range; `parameter` names which. |
| `InvalidParameterFormat` | `Parameter "{name}" has value "{value}", which is not a valid Integer. Expected ...` | `skip` or `take` is not a whole number. Both are reported together. |

## Related Message Types

- `Help.Fields.Get`: the field names of the request log (table 10078258) for `tableView`.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

