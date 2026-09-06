---
id: islandsbanki-account-verify
title: "Islandsbanki.Account.Verify"
sidebar_label: "Islandsbanki.Account.Verify"
sidebar_position: 37
description: "Request and response contract for the Islandsbanki.Account.Verify Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Checks whether an Islandsbanki account exists (ErReikningurTil), optionally validating it against a kennitala.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need to confirm a payee account number is valid before creating a payment.
- You need to confirm a kennitala and account belong together.

## Request
```json
{
  "account": "0133-26-019507",         // (required*) bank-ledger-account
  "kennitala": "1234567890"            // (optional) validate the account belongs to this national ID
}
```

\* Instead of `account`, you may pass the three numeric parts: `banki`, `hofudbok`, `reikningsnumer`.

## Response
```json
{
  "status": "Success",
  "exists": true,
  "logEntryNo": 42
}
```

### Response field notes
- `exists = false` is a normal negative answer (the account or account+kennitala pair does not exist), not an error.

## Errors
- `Missing required 'account' ...` - no account was supplied.
- `'account' is not in the expected Islandsbanki format ...` - the account string could not be parsed.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Islandsbanki was blocked ...`, enable **Allow HttpClient Requests** for the extension in Extension Management, and allow `https://ws.isb.is` if your environment uses an endpoint allowlist.

