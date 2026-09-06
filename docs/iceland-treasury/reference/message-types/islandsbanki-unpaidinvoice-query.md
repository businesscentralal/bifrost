---
id: islandsbanki-unpaidinvoice-query
title: "Islandsbanki.UnpaidInvoice.Query"
sidebar_label: "Islandsbanki.UnpaidInvoice.Query"
sidebar_position: 59
description: "Request and response contract for the Islandsbanki.UnpaidInvoice.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the unpaid items owed by a kennitala at Islandsbanki (SaekjaOgreiddaReikninga):
claims, giro slips, promissory notes and bills of exchange.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need the outstanding items a customer/payer owes before paying or reconciling.

## Request
```json
{
  "kennitala": "1234567890"            // (required) national ID of the payer
}
```

## Response
```json
{
  "status": "Success",
  "kennitala": "1234567890",
  "counts": { "claims": 2, "giroSlips": 0, "promissoryNotes": 0, "billsOfExchange": 0 },
  "claims": [ { "banki": "133", "hofudbok": "26", "krofunumer": "...", "gjalddagi": "...", "upphaedTilGreidslu": "...", ... } ],
  "giroSlips": [ ... ],
  "promissoryNotes": [ ... ],
  "billsOfExchange": [ ... ],
  "logEntryNo": 42
}
```

### Response field notes
- Each array element is a faithful projection of the bank's record: every field the bank returns is included as a JSON string property (Icelandic field name, first letter lower-cased), so amounts and dates are the bank's raw text. Parse them on the consumer side.
- The four item types carry different fields. Common keys include `banki`, `hofudbok`, `gjalddagi`, `upphaedTilGreidslu`, `kennitalaKrofuhafa`, `kennitalaGreidanda`.
- Empty arrays mean the payer owes nothing of that type — a normal result, not an error.

## Errors
- `Missing required 'kennitala'` - the `kennitala` property is missing.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Islandsbanki was blocked ...`, enable **Allow HttpClient Requests** for the extension in Extension Management, and allow `https://ws.isb.is` if your environment uses an endpoint allowlist.

