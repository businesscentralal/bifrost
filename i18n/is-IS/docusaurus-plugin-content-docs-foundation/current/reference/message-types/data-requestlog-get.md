---
id: data-requestlog-get
title: "Data.RequestLog.Get"
sidebar_label: "Data.RequestLog.Get"
sidebar_position: 20
description: "Beiðni- og svarsamningur fyrir Data.RequestLog.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar request log færslur that belong til the calling user.
styður skip/take paging og an valfrjálst AL tafla-view pre-filter.

**Stefna:** Útgående  
**Efnisgerð:** text/json  
**Chargeable:** Yes

## nota þegar
- You want til inspect which HTTP calls your user session has made.
- You need til diagnose a service Villa (HTTP status, Villa text, eða raw bodies).
- You want til page through a large request history.

## Security
This skilaboðategund **always** filters með `SystemCreatedBy = UserSecurityId()` og
Skilar aðeins the calling user's own færslur. There er no override.

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

Get the 10 most-recent mistókst calls:
```json
{
  "take":      10,
  "tableView": "SORTING(Sent At) ORDER(Descending) WHERE(Success=CONST(0))"
}
```

## Filter með service
```json
{
  "tableView": "WHERE(Service Name=CONST(Arion))"
}
```

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

