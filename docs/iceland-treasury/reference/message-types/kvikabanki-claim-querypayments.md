---
id: kvikabanki-claim-querypayments
title: "Kvikabanki.Claim.QueryPayments"
sidebar_label: "Kvikabanki.Claim.QueryPayments"
sidebar_position: 66
description: "Request and response contract for the Kvikabanki.Claim.QueryPayments Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a paged list of payments registered against Kvika banki claims within a transaction-date span.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "claimant":        "1234567",      // optional
  "identifier":      "INV-2026-0001", // optional
  "disposalAccount": "0133-26-012345",// optional
  "dateFrom":        "2026-01-01",   // required (transaction date span)
  "dateTo":          "2026-01-31",   // required (transaction date span)
  "entryFrom":       1,              // 1-based start row
  "entryTo":         100             // 1-based end row (inclusive)
}
```

`entryFrom` defaults to **1** and `entryTo` defaults to **100** when omitted.

## Response
Returns `status`, `returned`, `totalCount`, `entryFrom`, `entryTo`, `logEntryNo`, and a `payments` array.

## Errors
- `'dateFrom' and 'dateTo' (ISO YYYY-MM-DD) are required`

