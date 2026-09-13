---
id: landsbankinn-card-ledgerkeysubgroups
title: "Landsbankinn.Card.LedgerKeySubGroups"
sidebar_label: "Landsbankinn.Card.LedgerKeySubGroups"
sidebar_position: 87
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.LedgerKeySubGroups Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists ledger key sub-groups frá the Landsbankinn Cards portal.
Sub-groups Gefðu upp finer categorization within a group.

**Stefna:** Outbound  
**API-endapunktur:** `GET /LedgerKeySubGroups`  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "groupId": "2b2fe8c3-...",  // (optional) GUID — filter by group
  "skip": 0,
  "take": 100
}
```

## Svar
```json
{
  "totalCount": 1,
  "ledgerKeySubGroups": [
    {
      "id": "9bc1a4a5-488c-4e4d-befe-23f07b42a074",
      "companyNationalId": "6306251060",
      "created": "2026-07-16T11:03:13",
      "createdBy": "L630625B2B11",
      "identifier": "OFFICE",
      "description": "Office related expenses"
    }
  ]
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Sub-groups sit between groups og keys in the hierarchy: Group → SubGroup → Key.
Notaðu Landsbankinn.Card.LedgerKeySubGroupCreate til create new sub-groups.
Notaðu Landsbankinn.Card.LedgerKeySubGroupDelete með the `id` (GUID) til remove.


