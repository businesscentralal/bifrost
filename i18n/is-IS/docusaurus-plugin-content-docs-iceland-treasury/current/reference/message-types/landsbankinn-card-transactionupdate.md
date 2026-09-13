---
id: landsbankinn-card-transactionupdate
title: "Landsbankinn.Card.TransactionUpdate"
sidebar_label: "Landsbankinn.Card.TransactionUpdate"
sidebar_position: 92
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.TransactionUpdate Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Uppfærir a card færsla með a ledger key assignment og/eða comment.
Notaðu this til categorize card færslur fyrir accounting by assigning a
ledger key frá the Landsbankinn Cards portal.

**Stefna:** Outbound  
**API-endapunktur:** `PATCH /Transactions/{id}`  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "transactionId": "512879917",  // (required) Transaction ID (int64)
  "ledgerKeyId": "6c9f4fc8-...", // (optional) GUID from LedgerKeys
  "comment": "Office supplies"   // (optional) Comment for the transaction
}
```

## Svar
On success the bank Skilar updated færsla object.
On 404 the færsla ID does not exist.
```json
{
  "transactionId": "512879917",
  "ledgerKeyId": "6c9f4fc8-...",
  "comment": "Office supplies",
  "logEntryNo": 42
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Both ledgerKeyId og comment eru valfrjálst — send Aðeins the fields you want til update.
Sækja ledger key GUIDs frá Landsbankinn.Card.LedgerKeys first.
Sækja færsla IDs frá Landsbankinn.Card.færslur.

**færsla categorization Verkflæði:**
1. Card.Listi → Sækja card IDs
2. Card.færslur → Sækja unsorted færslur
3. Card.LedgerKeys → Listi available accounting keys
4. **Card.TransactionUpdate** → assign a key per færsla (this Endapunktur)


