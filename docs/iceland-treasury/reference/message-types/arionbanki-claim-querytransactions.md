---
id: arionbanki-claim-querytransactions
title: "Arionbanki.Claim.QueryTransactions"
sidebar_label: "Arionbanki.Claim.QueryTransactions"
sidebar_position: 14
description: "Request and response contract for the Arionbanki.Claim.QueryTransactions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns all lifecycle transactions for a single Arion banki claim.

**Direction:** Outbound  
**Content-Type:** text/json

## Note
`claimDate` is the BC/JSON claim key date and `dueDate` is the final due date. The bank SOAP/XML API uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message to inspect the lifecycle/payment transactions for one claim. The request identifies the claim by the natural key only.

## Request (all fields required)
```json
{
  "claimant": "1234567",
  "account":  "0101-26-123456",
  "claimDate":  "2026-06-15"
}
```

## Response
Returns `status`, `returned`, `totalCount`, `logEntryNo`, and a `transactions` array.
Each transaction object contains: `key` (claimant/account/claimDate), `transactionDate`,
`amount`, `type`, `reference`, `payorId`, `bookingDate`, `description`.
Use this response to reconcile what happened to a claim after creation, alteration, cancellation, payment, or collection handling.

## Errors
- `Missing required 'claimant', 'account' and 'claimDate' to identify the claim`
- `'claimDate' must be an ISO date YYYY-MM-DD`

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

