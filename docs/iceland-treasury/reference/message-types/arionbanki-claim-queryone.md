---
id: arionbanki-claim-queryone
title: "Arionbanki.Claim.QueryOne"
sidebar_label: "Arionbanki.Claim.QueryOne"
sidebar_position: 12
description: "Request and response contract for the Arionbanki.Claim.QueryOne Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves the current state of a single Arion banki claim.

**Direction:** Outbound  
**Content-Type:** text/json

## Note
`claimDate` is the BC/JSON claim key date and `dueDate` is the final due date. The bank SOAP/XML API uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message when the caller knows the exact `claimant + account + claimDate` key and needs the current claim state from Arion banki.

## Usage notes
Use exactly one claim key per call, keep the account and claimant values normalized, and keep the claim date in ISO format. Treat the returned claim object as read-only reference data for downstream workflows such as posting, cancellation, or status checks.
Persist `logEntryNo` when storing reconciliation evidence.

## Request
```json
{
  "claimant": "1234567",
  "account":  "0133260195661234",
  "claimDate":  "2026-06-30"
}
```

## Response
Returns `status`, `logEntryNo`, and a `claim` object with the full claim info row (or omits `claim` if not found).
The `claim` object uses `claimDate` for the key date and `dueDate` for the final due date.

## Errors
- `Missing required 'claimant' (5-7 digit Claimant ID)`
- `Missing required 'account' (Bank+Ledger+Account number string)`
- `Missing required 'claimDate' (ISO date YYYY-MM-DD)`
- `Arion banki returned no claim for the supplied keys`

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

