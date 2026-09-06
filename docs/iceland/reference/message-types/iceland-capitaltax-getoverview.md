---
id: iceland-capitaltax-getoverview
title: "Iceland.CapitalTax.GetOverview"
sidebar_label: "Iceland.CapitalTax.GetOverview"
sidebar_position: 8
description: "Request and response contract for the Iceland.CapitalTax.GetOverview Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a yearly overview of all capital tax submissions using FaYfirlit.

**Direction:** Outbound
**RSK Operation:** FaYfirlit

## Use case
Call to see all submissions for a year: submission numbers, dates, totals.
Useful for verifying what RSK has on record after Submit or Correction.

## Request
```json
{ "year": 2025 }
```

## Response fields
| Field | Description |
|---|---|
| numerSendingar | Submission number |
| timabil | Quarter (1-4) |
| skiladDags | Filing date |
| skiladAf | Filed by (kennitala) |
| tegund | Type (A=new, B=correction) |

## Credentials
FTS Password (or Payroll Password fallback) + Company Registration No.

## Troubleshooting
- Request Log: LogType=Capital Tax, Operation=FaYfirlit

