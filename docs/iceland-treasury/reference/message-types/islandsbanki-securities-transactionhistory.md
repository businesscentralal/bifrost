---
id: islandsbanki-securities-transactionhistory
title: "Islandsbanki.Securities.TransactionHistory"
sidebar_label: "Islandsbanki.Securities.TransactionHistory"
sidebar_position: 57
description: "Request and response contract for the Islandsbanki.Securities.TransactionHistory Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns the securities transaction history for an id number over a date span (GetTransactionHistory).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "idNumber": "1234567890",   // (optional) id number / kennitala
  "dateFrom": "2026-01-01",   // (required)
  "dateTo": "2026-12-31"      // (required)
}
```

## Response
```json
{ "status": "Success", "count": 8,
  "transactions": [ { "transactionNumber": "...", "ticker": "...", "isin": "...", "tradedate": "...", "nominalValue": "...", "price": "...", "total": "...", ... } ], "logEntryNo": 90 }
```
Records are projected faithfully as JSON strings (the bank's raw values).

