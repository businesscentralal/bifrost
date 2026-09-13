---
id: landsbankinn-card-transactionget
title: "Landsbankinn.Card.TransactionGet"
sidebar_label: "Landsbankinn.Card.TransactionGet"
sidebar_position: 90
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.TransactionGet Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir stakan card færsla með fulla detail þar á meðal ledger key assignment, comment, og attachment metadata.

**Stefna:** Outbound  
**API-endapunktur:** `GET /cards/{cardId}/Transactions/{id}`  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "cardId": 2987258,              // (required) Card ID from Card.List
  "transactionId": "552257516"    // (required) Transaction ID from Card.Transactions
}
```

## Svar
Skilar fulla færsla object as-er frá the bank API, þar á meðal:
- `ledgerKey` — assigned accounting key (Ef any)
- `comment` — user-entered comment
- `attachments` — array of attachment metadata (receipt images)
- Allt staðlaða fields frá the Listi Endapunktur (amount, currency, Lýsing, dates, etc.)

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

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this til verify ledger key assignments og comments eftir TransactionUpdate.
Notaðu this til Sækja attachment IDs áður en calling Card.Attachment til download receipts.
The Listi Endapunktur (Card.færslur) does NOT return ledgerKey eða comment fields.


