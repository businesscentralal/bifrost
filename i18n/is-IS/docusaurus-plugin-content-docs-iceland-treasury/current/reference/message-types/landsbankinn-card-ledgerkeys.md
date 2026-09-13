---
id: landsbankinn-card-ledgerkeys
title: "Landsbankinn.Card.LedgerKeys"
sidebar_label: "Landsbankinn.Card.LedgerKeys"
sidebar_position: 84
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.LedgerKeys Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists ledger key mappings configured in the Landsbankinn Cards portal.
Ledger keys categorize card færslur fyrir accounting (e.g. G/L reikningur codes).

**Stefna:** Outbound  
**API-endapunktur:** `GET /LedgerKeys`  
**Efnisgerð:** text/json

## Beiðni
```json
{ "skip": 0, "take": 100 }
```

## Svar
```json
{
  "totalCount": 1,
  "ledgerKeys": [
    {
      "id": "6c9f4fc8-4b46-478e-a90d-e0ea93fe575c",
      "companyId": "6306251060",
      "created": "2026-07-16T11:03:17",
      "createdBy": "L630625B2B11",
      "identifier": "6100",
      "description": "Office Supplies"
    }
  ]
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this til discover available ledger keys áður en assigning one til a færsla 
via Landsbankinn.Card.TransactionUpdate. The `id` Reitur (GUID) er the value til 
pass as `ledgerKeyId`. til create new keys, Notaðu Landsbankinn.Card.LedgerKeyCreate.

**Typical Verkflæði:**
1. LedgerKeyGroups → Listi groups
2. LedgerKeySubGroups → Listi sub-groups
3. **LedgerKeys** → Listi keys (this Endapunktur)
4. Card.færslur → Sækja færslur
5. Card.TransactionUpdate → assign a ledger key til each færsla


