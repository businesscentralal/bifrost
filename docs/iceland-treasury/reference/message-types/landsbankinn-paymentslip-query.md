---
id: landsbankinn-paymentslip-query
title: "Landsbankinn.PaymentSlip.Query"
sidebar_label: "Landsbankinn.PaymentSlip.Query"
sidebar_position: 129
description: "Request and response contract for the Landsbankinn.PaymentSlip.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Queries payment slips from Landsbankinn via Landsbankaskema `LI_Fyrirspurn_greidslusedill`.

**Direction:** Outbound  
**Content-Type:** text/json  
**Schema:** Landsbankaskema `LI_Fyrirspurn_greidslusedill` (process.ashx)

## Request
Required fields: `account`, `kennitala`, and `gjalddagi`.

```json
{
  "account": "0301-66-534428",
  "kennitala": "7001692789",
  "gjalddagi": "2026-01-15"
}
```

## Input contract details
- `account`: bank account key for the claim (`banki`+`hofudbok`+`numer`). Dashed and non-dashed forms are accepted.
- `kennitala`: claimant kennitala (typically `kt_krofuhafa` from unpaid invoice row).
- `gjalddagi`: due date in `YYYY-MM-DD` format (must match unpaid row key date).
- Key-date learning: `gjalddagi` is the lookup key date. Do not substitute `eindagi` when they differ.

## Agent workflow (recommended)
1. Discover candidate invoices via `Landsbankinn.UnpaidInvoice.Query`.
2. Pick a row and map fields:
   - `account` = `<banki><hofudbok><numer>`
   - `kennitala` = `kt_krofuhafa`
   - `gjalddagi` = `gjalddagi`
3. Call `Landsbankinn.PaymentSlip.Query` for detailed amount breakdown before payment/posting.
4. When creating `Landsbankinn.Payment.Batch` claim lines, keep JSON `kind = PaymentSlip`; connector maps this to wire `Claim`.

## Response
Returns `responseXml` from the bank together with `httpStatus` and `logEntryNo`.

Typical fields in `responseXml` include `upphaed_til_greidslu`, `drattarvextir`, fee components, and `samtals`.

## Authentication
The connector logs in to Landsbankaskema (`LI_Innskra`) and reuses the session token automatically.

