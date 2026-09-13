---
id: landsbankinn-card-ledgerkeygroupcreate
title: "Landsbankinn.Card.LedgerKeyGroupCreate"
sidebar_label: "Landsbankinn.Card.LedgerKeyGroupCreate"
sidebar_position: 81
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.LedgerKeyGroupCreate Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a new ledger key group in the Landsbankinn Cards portal.
Groups organize ledger keys í accounting categories.

**Stefna:** Outbound  
**API-endapunktur:** `POST /LedgerKeyGroups`  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "identifier": "OPEX",                     // (required) Group identifier
  "description": "Operating Expenses"       // (required) Group description
}
```

## Svar
The created ledger key group object as returned by the bank API.
```json
{
  "id": "2b2fe8c3-4ee7-4aa2-b8be-9282768073bd",
  "companyNationalId": "6306251060",
  "created": "2026-07-16T11:03:07",
  "createdBy": "L630625B2B11",
  "identifier": "OPEX",
  "description": "Operating Expenses",
  "logEntryNo": 92
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Groups eru the top level of the hierarchy: Group → SubGroup → Key.
Create groups first, then sub-groups, then ledger keys.
The returned `id` (GUID) er used fyrir LedgerKeyGroupDelete.

**Ledger key setup Verkflæði:**
1. **LedgerKeyGroupCreate** → create a group (this Endapunktur)
2. LedgerKeySubGroupCreate → create a sub-group
3. LedgerKeyCreate → create a key (e.g. G/L reikningur code)
4. LedgerKeys → verify the key was created


