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


Returns request log entries that belong to the calling user.
Supports skip/take paging and an optional AL table-view pre-filter.

**Direction:** Outbound  
**Content-Type:** text/json  
**Chargeable:** Yes

## Use when
- You want to inspect which HTTP calls your user session has made.
- You need to diagnose a service error (HTTP status, error text, or raw bodies).
- You want to page through a large request history.

## Security
This message type **always** filters by `SystemCreatedBy = UserSecurityId()` and
returns only the calling user's own entries. There is no override.

## Request
```json
{
  "skip":      0,                    // (optional) records to skip, default 0
  "take":      20,                   // (optional) records to return, 1-100, default 20
  "tableView": "SORTING(Sent At)"   // (optional) AL table view string
}
```

## Response
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

## Paging example

Get the 10 most-recent failed calls:
```json
{
  "take":      10,
  "tableView": "SORTING(Sent At) ORDER(Descending) WHERE(Success=CONST(0))"
}
```

## Filter by service
```json
{
  "tableView": "WHERE(Service Name=CONST(Arion))"
}
```

