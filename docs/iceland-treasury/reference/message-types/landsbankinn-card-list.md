---
id: landsbankinn-card-list
title: "Landsbankinn.Card.List"
sidebar_label: "Landsbankinn.Card.List"
sidebar_position: 88
description: "Request and response contract for the Landsbankinn.Card.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists all corporate cards registered for the company at Landsbankinn.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "skip": 0,   // (optional) items to skip
  "take": 50   // (optional) max items to return (0 = all)
}
```

## Response
```json
{
  "totalCount": 12,
  "cards": [
    {
      "cardId": 123,
      "lastFourDigits": "1234",
      "cardHolderName": "Jón Jónsson",
      "status": "Active"
    }
  ]
}
```

## AI/Agent playbook
Use this to discover which cards are available before querying transactions.
Pagination is optional for small card sets.

**Card transaction workflow:**
1. **Card.List** → get card IDs (this endpoint)
2. Card.Transactions → get transactions for a card + date range
3. Card.LedgerKeys → list available accounting keys
4. Card.TransactionUpdate → assign a ledger key to categorize each transaction
5. Card.Attachment → download receipt images for specific transactions

