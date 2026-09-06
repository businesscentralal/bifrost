---
id: landsbankinn-claim-create
title: "Landsbankinn.Claim.Create"
sidebar_label: "Landsbankinn.Claim.Create"
sidebar_position: 93
description: "Request and response contract for the Landsbankinn.Claim.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a single claim via the Claims REST API (POST /Claims).
Omitted optional values inherit from the template.

## Date mapping
| This message type | Bank API field | Meaning |
|---|---|---|
| `claimDate` | `dueDate` | Claim key date (gjalddagi) |
| `dueDate` | `finalDueDate` | Final due date / eindagi (must be >= today and >= claimDate) |

## Request (minimum required)
```json
{
  "payorNationalId": "<10-digit kennitala>",
  "claimDate": "<ISO date>",
  "dueDate": "<ISO date, >= today, >= claimDate>",
  "templateId": "<bank 4-digit + 3-char code>",
  "principalAmount": 200
}
```

## Defaults from Company Information
- `templateId`: If only 7 chars (bank+code), the company Registration No. is prepended automatically.
- `claimantNationalId`: Defaults to Company Information "Registration No." if omitted.

## templateId format
Either 7-char short form (bank code 4 + template code 3) or full 17-char (kennitala 10 + bank 4 + code 3).

## Optional fields (inherit from template if omitted)
autoCancellation, billNumber, referenceNumber, customerNumber,
description, number, isPartialPaymentAllowed, paymentSequenceType,
defaultCharge, discount, noticeAndPaymentFee, notifications, secondaryCollection

## Response
Returns the created claim ID from the bank API, plus `logEntryNo`.

