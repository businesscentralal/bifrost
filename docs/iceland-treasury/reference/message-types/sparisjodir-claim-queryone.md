---
id: sparisjodir-claim-queryone
title: "Sparisjodir.Claim.QueryOne"
sidebar_label: "Sparisjodir.Claim.QueryOne"
sidebar_position: 148
description: "Request and response contract for the Sparisjodir.Claim.QueryOne Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves the current state of a single Sparisjóður claim.

**Direction:** Outbound  
**Content-Type:** text/json

## AI note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message when the caller knows the exact `claimant + account + claimDate` key and needs the current claim state from Sparisjóður.

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
- `Sparisjóður returned no claim for the supplied keys`

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

