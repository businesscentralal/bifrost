---
id: sparisjodir-claim-recreatebatch
title: "Sparisjodir.Claim.ReCreateBatch"
sidebar_label: "Sparisjodir.Claim.ReCreateBatch"
sidebar_position: 151
description: "Request and response contract for the Sparisjodir.Claim.ReCreateBatch Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a batch of previously cancelled or expired Sparisjóður claims for async recreation.
Poll the result with **Sparisjodir.Claim.GetOperationResult**.

**Direction:** Inbound  
**Content-Type:** text/json

## AI note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message to recreate many previously cancelled or expired claims asynchronously. Each claim object uses the standard claim schema (claimant, account, claimDate, amount, identifier).

## Request
```json
{
  "claims": [
    {
      "claimant":   "1234567",
      "account":    "0101-26-123456",
      "claimDate":  "2026-09-30",
      "amount":     15000.00,
      "identifier": "INV-2026-0001"
    }
  ]
}
```

Claim objects follow the standard claim schema (claimant, account, claimDate, amount, identifier).

## Async flow
The response contains `operationId`. Poll `Sparisjodir.Claim.GetOperationResult` with that value for per-claim success or error details.

## Response
Returns `status`, `operationId`, `batchStatus`, `logEntryNo`, and a `results` array.

## Errors
- `Missing required 'claims' array`
- `Claim entry at index N is invalid`

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

