---
id: landsbankinn-card-transactions
title: "Landsbankinn.Card.Transactions"
sidebar_label: "Landsbankinn.Card.Transactions"
sidebar_position: 91
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.færslur Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir card færslur fyrir a specific card over a date range.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
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

## Svar
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

## Leiðbeiningar fyrir gervigreind/umboð
Always Gefðu upp cardId, dateFrom, og dateTo. Notaðu Gerð=settled og 
dateFilter=registrationDay fyrir accounting (Aðeins finalized færslur).
Notaðu skip/take fyrir large result sets.

**Card færsla Verkflæði:**
1. Card.Listi → Sækja card IDs
2. **Card.færslur** → Sækja færslur (this Endapunktur)
3. Card.LedgerKeys → Listi available accounting keys
4. Card.TransactionUpdate → assign a ledger key til each færsla
5. Card.Attachment → download receipt fyrir færslur með hasAttachments=true


