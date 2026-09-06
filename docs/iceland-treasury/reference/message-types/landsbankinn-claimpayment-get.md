---
id: landsbankinn-claimpayment-get
title: "Landsbankinn.ClaimPayment.Get"
sidebar_label: "Landsbankinn.ClaimPayment.Get"
sidebar_position: 102
description: "Request and response contract for the Landsbankinn.ClaimPayment.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns payments for a single claim via the REST API.

**Direction:** Outbound  
**Content-Type:** text/json

## Date mapping (IMPORTANT)
| BC field | REST API field | Meaning |
|---|---|---|
| `claimDate` | `dueDate` | Claim key date |
| `dueDate` | `finalDueDate` | Final due date / eindagi |

## Required parameter
`claimId` — the unique claim identifier from the bank.

## Request
```json
{
  "claimId":  "abc123-...",
  "paidFrom": "2026-01-01",
  "paidTo":   "2026-12-31",
  "sortBy":   "paid desc",
  "skip":     0,
  "take":     100
}
```

## Response
Returns `data` (array of payment objects), `claimId`, `page`, `perPage`, `totalItems`, `logEntryNo`.

## SOAP equivalent
`Landsbankinn.Claim.QueryPayments` — the legacy SOAP-era name, superseded by this REST endpoint. Only this REST type is registered in Bifrost Iceland Treasury.

