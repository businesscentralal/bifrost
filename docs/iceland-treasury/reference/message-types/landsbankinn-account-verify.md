---
id: landsbankinn-account-verify
title: "Landsbankinn.Account.Verify"
sidebar_label: "Landsbankinn.Account.Verify"
sidebar_position: 75
description: "Request and response contract for the Landsbankinn.Account.Verify Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Checks whether an account exists at Landsbankinn via the Landsbankaskema `LI_Fyrirspurn_er_reikningur_til` operation.

**Direction:** Outbound  
**Content-Type:** text/json  
**Schema:** Landsbankaskema `LI_Fyrirspurn_er_reikningur_til` (process.ashx)

## Use when
- You need to validate an account number before posting a payment or claim against it.

## AI/Agent playbook
Use one account and one kennitala pair per call. Normalize dashes and spaces before sending, and treat a false/failed response as a verification result rather than a formatting exception unless the bank explicitly returns an input error.

Pre-check policy for payment batches: use this verify call for **transfer lines** before `Landsbankinn.Payment.Batch`.
For claim/payment-slip lines, use `Landsbankinn.UnpaidInvoice.Query` + `Landsbankinn.PaymentSlip.Query` (not account-verify) as the primary pre-check path.

## Request
```json
{
  "account":   "0133-26-019507", // (required) branch-ledger-number; dashes optional
  "kennitala": "6306251060"       // (required) account owner registration number; dashes optional
}
```

## Response
```json
{
  "status": "Success",
  "account": "0133-26-019507",
  "exists": true
}
```

## Errors
- `Missing required 'account'` - the `account` property is missing.
- `'account' must be ... branch-ledger-number` - the account could not be split into 4-2-6 parts.
- `The bank rejected the LI_Fyrirspurn_er_reikningur_til request ...` - the bank returned a fault.

## Authentication
Landsbankaskema uses a session login with the same username and password configured for the other Landsbankinn services. The session token is acquired and cached automatically.

