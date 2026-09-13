---
id: landsbankinn-card-ledgerkeygroups
title: "Landsbankinn.Card.LedgerKeyGroups"
sidebar_label: "Landsbankinn.Card.LedgerKeyGroups"
sidebar_position: 83
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.LedgerKeyGroups Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists ledger key groups frá the Landsbankinn Cards portal.
Groups organize ledger keys í top-level accounting categories.

**Stefna:** Outbound  
**API-endapunktur:** `GET /LedgerKeyGroups`  
**Efnisgerð:** text/json

## Beiðni
```json
{ "skip": 0, "take": 100 }
```

## Svar
```json
{
  "totalCount": 1,
  "ledgerKeyGroups": [
    {
      "id": "2b2fe8c3-4ee7-4aa2-b8be-9282768073bd",
      "companyNationalId": "6306251060",
      "created": "2026-07-16T11:03:07",
      "createdBy": "L630625B2B11",
      "identifier": "OPEX",
      "description": "Operating Expenses"
    }
  ]
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Groups eru the top level of the ledger key hierarchy: Group → SubGroup → Key.
Notaðu Landsbankinn.Card.LedgerKeyGroupCreate til create new groups.
Notaðu Landsbankinn.Card.LedgerKeyGroupDelete með the `id` (GUID) til remove.


