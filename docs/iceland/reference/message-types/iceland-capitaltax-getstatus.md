---
id: iceland-capitaltax-getstatus
title: "Iceland.CapitalTax.GetStatus"
sidebar_label: "Iceland.CapitalTax.GetStatus"
sidebar_position: 10
description: "Request and response contract for the Iceland.CapitalTax.GetStatus Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Checks the processing status of a submitted capital tax return using FaStodu.

**Direction:** Both
**RSK Operation:** FaStodu

## Workflow position
```
GetTypes -> GetSubmittablePeriods -> entries -> Submit -> >>> GetStatus <<<
```
Call AFTER a successful Submit to poll RSK processing status.

## Tables updated
| Table | Fields updated |
|---|---|
| Iceland CapTax Period ori | Stada Sendingar (RSK status enum) |

## RSK Status values
| Value | Meaning |
|---|---|
| Received | RSK received the submission |
| Processing | RSK is processing |
| Completed | Accepted |
| Rejected | Submission was rejected |

## Request
```json
{ "year": 2025, "quarter": 1 }
```

## Credentials
FTS Password (or Payroll Password fallback) + Company Registration No.

## Troubleshooting
- Request Log: LogType=Capital Tax, Operation=FaStodu
- Requires a local Iceland CapTax Period ori record with NumerSendingar > 0

