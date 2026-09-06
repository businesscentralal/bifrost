---
id: sparisjodir-claim-markbatchforseccollection
title: "Sparisjodir.Claim.MarkBatchForSecCollection"
sidebar_label: "Sparisjodir.Claim.MarkBatchForSecCollection"
sidebar_position: 146
description: "Request and response contract for the Sparisjodir.Claim.MarkBatchForSecCollection Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a batch of Sparisjóður claim keys for async secondary collection marking.
Poll the result with **Sparisjodir.Claim.GetOperationResult**.

**Direction:** Inbound  
**Content-Type:** text/json

## AI note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message to mark many claims for secondary collection asynchronously. Each key object must contain `claimant`, `account`, and `claimDate`.

## Request
```json
{
  "keys": [
    {
      "claimant": "1234567",
      "account":  "0101-26-123456",
      "claimDate":  "2026-06-15"
    }
  ]
}
```

## Response
Returns `status`, `operationId`, `batchStatus`, `logEntryNo`, and a `results` array.
Poll `Sparisjodir.Claim.GetOperationResult` with `operationId` for the final per-claim results.

## Errors
- `Missing required 'keys' array`
- `Key entry at index N is invalid`

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

