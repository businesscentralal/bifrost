---
id: landsbankinn-card-list
title: "Landsbankinn.Card.List"
sidebar_label: "Landsbankinn.Card.List"
sidebar_position: 88
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists Allt corporate cards registered fyrir the fyrirtæki at Landsbankinn.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "skip": 0,   // (optional) items to skip
  "take": 50   // (optional) max items to return (0 = all)
}
```

## Svar
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

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this til discover which cards eru available áður en querying færslur.
Pagination er valfrjálst fyrir small card sets.

**Card færsla Verkflæði:**
1. **Card.Listi** → Sækja card IDs (this Endapunktur)
2. Card.færslur → Sækja færslur fyrir a card + date range
3. Card.LedgerKeys → Listi available accounting keys
4. Card.TransactionUpdate → assign a ledger key til categorize each færsla
5. Card.Attachment → download receipt images fyrir specific færslur


