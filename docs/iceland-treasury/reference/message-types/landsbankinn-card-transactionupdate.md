---
id: landsbankinn-card-transactionupdate
title: "Landsbankinn.Card.TransactionUpdate"
sidebar_label: "Landsbankinn.Card.TransactionUpdate"
sidebar_position: 92
description: "Request and response contract for the Landsbankinn.Card.TransactionUpdate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Updates a card transaction with a ledger key assignment and/or comment.
Use this to categorize card transactions for accounting by assigning a
ledger key from the Landsbankinn Cards portal.

**Direction:** Outbound  
**API endpoint:** `PATCH /Transactions/{id}`  
**Content-Type:** text/json

## Request
```json
{
  "transactionId": "512879917",  // (required) Transaction ID (int64)
  "ledgerKeyId": "6c9f4fc8-...", // (optional) GUID from LedgerKeys
  "comment": "Office supplies"   // (optional) Comment for the transaction
}
```

## Response
On success the bank returns the updated transaction object.
On 404 the transaction ID does not exist.
```json
{
  "transactionId": "512879917",
  "ledgerKeyId": "6c9f4fc8-...",
  "comment": "Office supplies",
  "logEntryNo": 42
}
```

## AI/Agent playbook
Both ledgerKeyId and comment are optional — send only the fields you want to update.
Get ledger key GUIDs from Landsbankinn.Card.LedgerKeys first.
Get transaction IDs from Landsbankinn.Card.Transactions.

**Transaction categorization workflow:**
1. Card.List → get card IDs
2. Card.Transactions → get unsorted transactions
3. Card.LedgerKeys → list available accounting keys
4. **Card.TransactionUpdate** → assign a key per transaction (this endpoint)

