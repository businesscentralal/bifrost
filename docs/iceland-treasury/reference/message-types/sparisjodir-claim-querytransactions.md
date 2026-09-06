---
id: sparisjodir-claim-querytransactions
title: "Sparisjodir.Claim.QueryTransactions"
sidebar_label: "Sparisjodir.Claim.QueryTransactions"
sidebar_position: 150
description: "Request and response contract for the Sparisjodir.Claim.QueryTransactions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns all lifecycle transactions for a single Sparisjóður claim.

**Direction:** Outbound  
**Content-Type:** text/json

## AI note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

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
If a call fails with `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission to change `Allow HttpClient Requests` and then enable it in Extension Management.

### Check permission before changing the setting
- Verify you have permission to update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) and to manage extension settings.
- If you do not have permission, ask a BC administrator to perform the change.

### Steps to resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://<bank>-iobs.heimabanki.is`.

