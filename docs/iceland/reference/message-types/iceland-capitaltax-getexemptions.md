---
id: iceland-capitaltax-getexemptions
title: "Iceland.CapitalTax.GetExemptions"
sidebar_label: "Iceland.CapitalTax.GetExemptions"
sidebar_position: 7
description: "Request and response contract for the Iceland.CapitalTax.GetExemptions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves capital income tax exemptions using TskFaUndanthagur.

**Direction:** Outbound
**RSK Operation:** TskFaUndanthagur

## Request
```json
{ "tekjuar": 2025, "timabil": 202503 }
```
Note: timabil format is YYYYQQ for this operation.

## Use case
Check available exemptions before submitting a return.

## Credentials
FTS Password (or Payroll Password fallback) + Company Registration No.

## Troubleshooting
- Request Log: LogType=Capital Tax, Operation=TskFaUndanthagur
- RSK may return HTTP 500 for invalid period combinations

