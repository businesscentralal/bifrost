---
id: iceland-capitaltax-getsubmittableperiods
title: "Iceland.CapitalTax.GetSubmittablePeriods"
sidebar_label: "Iceland.CapitalTax.GetSubmittablePeriods"
sidebar_position: 11
description: "Request and response contract for the Iceland.CapitalTax.GetSubmittablePeriods Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves periods currently open for submission using FaSkilanlegTimabil.

**Direction:** Outbound
**RSK Operation:** FaSkilanlegTimabil

## Workflow position
```
GetTypes -> >>> GetSubmittablePeriods <<< -> entries -> Submit
```
Call before Submit to verify the target quarter is still open.

## Request
```json
{ "year": 2025 }
```

## Response
Same structure as GetPeriods but filtered to submittable only.
Empty = all periods closed for that year.

## Credentials
FTS Password (or Payroll Password fallback) + Company Registration No.

## Troubleshooting
- Request Log: LogType=Capital Tax, Operation=FaSkilanlegTimabil

