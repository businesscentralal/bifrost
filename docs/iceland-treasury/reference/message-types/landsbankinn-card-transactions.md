---
id: landsbankinn-card-transactions
title: "Landsbankinn.Card.Transactions"
sidebar_label: "Landsbankinn.Card.Transactions"
sidebar_position: 91
description: "Request and response contract for the Landsbankinn.Card.Transactions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves card transactions for a specific card over a date range.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "cardId": 123,                        // (required) Card ID
  "dateFrom": "2026-01-01",             // (required) ISO date
  "dateTo": "2026-06-30",               // (required) ISO date
  "type": "settled",                    // (optional) all|settled
  "dateFilter": "registrationDay",      // (optional) purchaseDay|registrationDay
  "skip": 0,                            // (optional)
  "take": 100                           // (optional)
}
```

## Response
```json
{
  "totalCount": 847,
  "transactions": [
    {
      "transactionId": "512879917",
      "cardId": 123,
      "purchaseDay": "2026-03-15T14:32:00",
      "amount": -12500.00,
      "merchant": "Hagkaup",
      "city": "Reykjavík",
      "country": "IS"
    }
  ],
  "logEntryNo": 42
}
```

## AI/Agent playbook
Always provide cardId, dateFrom, and dateTo. Use type=settled and 
dateFilter=registrationDay for accounting (only finalized transactions).
Use skip/take for large result sets.

**Card transaction workflow:**
1. Card.List → get card IDs
2. **Card.Transactions** → get transactions (this endpoint)
3. Card.LedgerKeys → list available accounting keys
4. Card.TransactionUpdate → assign a ledger key to each transaction
5. Card.Attachment → download receipt for transactions with hasAttachments=true

