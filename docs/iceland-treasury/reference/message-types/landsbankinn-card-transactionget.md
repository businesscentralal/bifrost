---
id: landsbankinn-card-transactionget
title: "Landsbankinn.Card.TransactionGet"
sidebar_label: "Landsbankinn.Card.TransactionGet"
sidebar_position: 90
description: "Request and response contract for the Landsbankinn.Card.TransactionGet Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a single card transaction with full detail including ledger key assignment, comment, and attachment metadata.

**Direction:** Outbound  
**API endpoint:** `GET /cards/{cardId}/Transactions/{id}`  
**Content-Type:** text/json

## Request
```json
{
  "cardId": 2987258,              // (required) Card ID from Card.List
  "transactionId": "552257516"    // (required) Transaction ID from Card.Transactions
}
```

## Response
Returns the full transaction object as-is from the bank API, including:
- `ledgerKey` — assigned accounting key (if any)
- `comment` — user-entered comment
- `attachments` — array of attachment metadata (receipt images)
- All standard fields from the list endpoint (amount, currency, description, dates, etc.)

```json
{
  "id": "552257516",
  "purchaseDay": "2026-07-18T00:00:00",
  "amount": -1500,
  "currency": "ISK",
  "description": "Icelandair",
  "ledgerKey": { "id": "...", "identifier": "6310", "description": "Travel" },
  "comment": "Business trip",
  "attachments": [{ "id": "abc-123", "fileName": "receipt.jpg" }],
  "logEntryNo": 42
}
```

## AI/Agent playbook
Use this to verify ledger key assignments and comments after TransactionUpdate.
Use this to get attachment IDs before calling Card.Attachment to download receipts.
The list endpoint (Card.Transactions) does NOT return ledgerKey or comment fields.

