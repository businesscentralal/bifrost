---
id: landsbankinn-claimpayment-list
title: "Landsbankinn.ClaimPayment.List"
sidebar_label: "Landsbankinn.ClaimPayment.List"
sidebar_position: 103
description: "Request and response contract for the Landsbankinn.ClaimPayment.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a paged list of all claim payments via the REST API.

**Direction:** Outbound  
**Content-Type:** text/json

## Date mapping (IMPORTANT)
| BC field | REST API field | Meaning |
|---|---|---|
| `claimDate` | `dueDate` | Claim key date |
| `dueDate` | `finalDueDate` | Final due date / eindagi |

This message type accepts BC naming and translates automatically.

## Filters (all optional)

| Field | Type | Maps to bank | Description |
|---|---|---|---|
| `claimDateFrom` | date | `dueDateFrom` | Claims with due date on or after this date |
| `claimDateTo` | date | `dueDateTo` | Claims with due date up to and including this date |
| `paidFrom` | date-time | `paidFrom` | Payments made on or after this date/time |
| `paidTo` | date-time | `paidTo` | Payments made up to and including this date/time |
| `claimantNationalId` | string | `claimantNationalId` | Filter by claimant kennitala |
| `payorNationalId` | string | `payorNationalId` | Filter by payor kennitala |
| `templateCode` | string | `templateCode` | Filter by claim template code |
| `sortBy` | string | `sortBy` | Sort expression, e.g. `paid desc` |
| `skip` | integer | — | Number of records to skip (default 0) |
| `take` | integer | — | Number of records to return (default 1000) |

If no filters are provided, the bank defaults to the calling user's claimant.

## Request
```json
{
  "claimDateFrom":      "2026-01-01",
  "claimDateTo":        "2026-12-31",
  "paidFrom":           "2026-06-01",
  "paidTo":             "2026-06-30",
  "claimantNationalId": "6306252530",
  "payorNationalId":    "1101012220",
  "templateCode":       "37",
  "sortBy":             "paid desc",
  "skip":               0,
  "take":               100
}
```

## Response
Returns `data` (array), `noOfRecords` (count returned), `page`, `perPage`, `totalItems` (total on server), `logEntryNo`.

## SOAP equivalent
`Landsbankinn.Claim.QueryPayments` — the legacy SOAP-era name, superseded by this REST endpoint. Only this REST type is registered in Bifrost Iceland Treasury.

