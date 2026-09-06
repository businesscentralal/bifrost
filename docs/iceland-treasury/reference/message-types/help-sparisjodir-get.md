---
id: help-sparisjodir-get
title: "Help.Sparisjodir.Get"
sidebar_label: "Help.Sparisjodir.Get"
sidebar_position: 36
description: "Request and response contract for the Help.Sparisjodir.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a short Markdown overview of the Spar Banki Connector, listing all available message types with purpose and direction.
The overview also explains how Icelandic claims (`Innheimtukrofur`) differ from immediate transfers.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need to discover the Spar message types exposed by this connector.
- You want a short Markdown index before requesting a full per-message guide.
- You are building an AI assistant and need the next `Help.Implementation.Get` subject to request.
- You need a compact domain model for payment rails: transfer, payment slip, and claims (`Innheimtukrofur`).

## Request
No request body is required. You may pass an empty JSON object `{}` or omit the body entirely.

## Response
Returns a `result` object with the following fields:

| Field | Type | Description |
|---|---|---|
| `messageType` | string | Always `"Help.Sparisjodir.Get"`. |
| `format` | string | Always `"markdown"`. |
| `markdown` | string | Markdown table of all message types with direction and descriptions. |
| `fullHelpInstructions` | string | How to retrieve per-type technical guides. |

## Claim model (Innheimtukrofur)
`Innheimtukrofur` should be treated as Icelandic direct debit with a future value date and payer action in the loop.

- The creditor (claimant) registers a claim with due date and amount (`Sparisjodir.Claim.CreateBatch`).
- The payer can approve, schedule, reject, or ignore in online banking before due date.
- Settlement is not guaranteed at creation time. Money movement is confirmed later through claim payments and transactions.
- Operational pattern for agents: create/alter/cancel -> poll operation result -> query payments/transactions for evidence.
- Do not model claims as immediate account-to-account transfers.

### Agent-safe interpretation
- `CreateBatch` success means "request accepted", not "payer charged".
- "Pending" is a normal business state until payer action and due-date processing occur.
- Reconciliation should use `Sparisjodir.Claim.QueryPayments` and `Sparisjodir.Claim.QueryTransactions` as source-of-truth for settlement status.

## Getting per-type technical guides

To get the full technical guide for any Spar Banki message type, call `Help.Implementation.Get` with `subject` set to the message type name:

```json
{
  "subject": "Sparisjodir.Statement.Get"
}
```

## Setup before calling Sparisjóður

Before calling bank message types, verify these setup items in Business Central:

1. Search for **Bifrost Setup** and open the **Sparisjóður** section.
2. Set `Spar Username` to the company-default B2B username.
3. Run **Set Company Password** to store the company-default B2B password in IsolatedStorage.
4. Run **Set Certificate** to store the PFX signing certificate and certificate password in IsolatedStorage.
5. Leave `Spar Transport` = `Live` in production. Test extensions may add other transport values.
6. Use `Bifrost Setup -> Request Debug Mode` only during short support sessions. It logs signed SOAP envelopes without password redaction.

Per-user override: search for **Bifrost User Setup**, open the user setup editor, then use the **Sparisjóður** section to set a personal username and **Set My Spar Password**. Blank per-user username/password means the company default is used.

If authentication fails, check that the username, password, certificate, and certificate password are stored before retrying the bank call. The request log records transport errors and SOAP faults.

## Errors
This message type does not call Spar Banki and cannot produce transport errors.
The only error possible is an unsupported message version (must be `"1.0"`).

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

