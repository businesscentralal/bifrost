---
id: kvikabanki-statement-get
title: "Kvikabanki.Statement.Get"
sidebar_label: "Kvikabanki.Statement.Get"
sidebar_position: 70
description: "Request and response contract for the Kvikabanki.Statement.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a Kvika banki account statement (the IOBS bank import/export format) for an account over a date span. All bank pages are merged; `skip`/`take` page the merged transaction lines.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "account":  "0133-26-012345", // required
  "dateFrom": "2026-01-01",     // required (ISO)
  "dateTo":   "2026-01-31",     // required (ISO)
  "skip":     0,                // optional: lines to skip
  "take":     100               // optional: max lines to return (0 = all)
}
```

## Response
Returns `status`, a `header` object (account balances and metadata), `totalLines`, `skip`, `take`, `returned`, a `lines` array of transactions, and `logEntryNo`. Each line carries `transactionId`, `transactionDate`, `valueDate`, `amount`, `balance`, `reference`, `category`, `payorId`, and more.

## Errors
- `Missing required 'account' in the request`
- `'dateFrom' and 'dateTo' (ISO YYYY-MM-DD) are required`
- `Kvika banki returned no statement for the supplied account and date span`

