---
id: iceland-capitaltax-gettypes
title: "Iceland.CapitalTax.GetTypes"
sidebar_label: "Iceland.CapitalTax.GetTypes"
sidebar_position: 12
description: "Request and response contract for the Iceland.CapitalTax.GetTypes Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves valid income types for capital income tax using FaTegundir.

**Direction:** Outbound
**RSK Operation:** FaTegundir

## Workflow position
```
>>> GetTypes <<< -> GetSubmittablePeriods -> entries -> Submit
```
Call first to discover valid Type Id values for period entries.

## Key dividend types
| id | heiti | Category |
|---|---|---|
| 11 | Hlutabref | Ardur (dividends) |
| 12 | Stofnfe | Ardur |
| 6 | Bankareikningur | Vextir (interest) |

## Request
```json
{}
```

## Credentials
FTS Password (or Payroll Password fallback) + Company Registration No.

## Troubleshooting
- Request Log: LogType=Capital Tax, Operation=FaTegundir

