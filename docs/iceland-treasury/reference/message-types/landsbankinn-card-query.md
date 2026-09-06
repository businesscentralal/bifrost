---
id: landsbankinn-card-query
title: "Landsbankinn.Card.Query"
sidebar_label: "Landsbankinn.Card.Query"
sidebar_position: 89
description: "Request and response contract for the Landsbankinn.Card.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Queries card details/status from Landsbankinn via Landsbankaskema `LI_Fyrirspurn_kort`.

**Direction:** Outbound  
**Content-Type:** text/json  
**Schema:** Landsbankaskema `LI_Fyrirspurn_kort` (process.ashx)

## Request
At least one selector is required: `account`, `kennitala`, or `cardNo`.

```json
{
  "account": "0133-26-019507",   // optional
  "kennitala": "5012345679",    // optional
  "cardNo": "1234123412341234", // optional
  "dateFrom": "2026-01-01",      // optional
  "dateTo": "2026-01-31",        // optional
  "recordFrom": 1,                 // optional
  "recordTo": 100                  // optional
}
```

## Response
Returns `responseXml` from the bank together with `httpStatus` and `logEntryNo`.

## Agent notes
- Use this query for card-specific lookup workflows.
- For invoice payment decision workflows, prefer `Landsbankinn.UnpaidInvoice.Query` followed by `Landsbankinn.PaymentSlip.Query`.
- For transfer pre-check workflows, use `Landsbankinn.Account.Verify` (this message does not verify transfer destination ownership).
- Keep selectors minimal: start with one strong key, then narrow by date/paging only when needed.

## Authentication
The connector logs in to Landsbankaskema (`LI_Innskra`) and reuses the session token automatically.

