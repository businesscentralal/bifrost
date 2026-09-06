---
id: iceland-capitaltax-getperiods
title: "Iceland.CapitalTax.GetPeriods"
sidebar_label: "Iceland.CapitalTax.GetPeriods"
sidebar_position: 9
description: "Request and response contract for the Iceland.CapitalTax.GetPeriods Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves all valid periods for capital income tax using FaTimabil.

**Direction:** Outbound
**RSK Operation:** FaTimabil

## Request
```json
{ "year": 2025 }
```

## Response
Returns period records with start/end dates and names.
Use GetSubmittablePeriods to filter to only those still open.

## Credentials
FTS Password (or Payroll Password fallback) + Company Registration No.

## Troubleshooting
- Request Log: LogType=Capital Tax, Operation=FaTimabil
- Requires ForritUtgafa registration at RSK for non-public queries

