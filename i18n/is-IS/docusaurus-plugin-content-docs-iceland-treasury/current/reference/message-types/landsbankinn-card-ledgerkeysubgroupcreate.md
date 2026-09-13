---
id: landsbankinn-card-ledgerkeysubgroupcreate
title: "Landsbankinn.Card.LedgerKeySubGroupCreate"
sidebar_label: "Landsbankinn.Card.LedgerKeySubGroupCreate"
sidebar_position: 85
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.LedgerKeySubGroupCreate Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a new ledger key sub-group in the Landsbankinn Cards portal.
Sub-groups Gefðu upp finer-grained categorization within a group.

**Stefna:** Outbound  
**API-endapunktur:** `POST /LedgerKeySubGroups`  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "identifier": "OFFICE",             // (required) Sub-group identifier
  "description": "Office supplies"    // (required) Sub-group description
}
```

## Svar
The created ledger key sub-group object as returned by the bank API.
```json
{
  "id": "9bc1a4a5-488c-4e4d-befe-23f07b42a074",
  "companyNationalId": "6306251060",
  "created": "2026-07-16T11:03:13",
  "createdBy": "L630625B2B11",
  "identifier": "OFFICE",
  "description": "Office related expenses",
  "logEntryNo": 93
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Create the parent group first using Landsbankinn.Card.LedgerKeyGroupCreate.
The returned `id` (GUID) er used fyrir LedgerKeySubGroupDelete.

**Ledger key setup Verkflæði:**
1. LedgerKeyGroupCreate → create a group
2. **LedgerKeySubGroupCreate** → create a sub-group (this Endapunktur)
3. LedgerKeyCreate → create a key
4. LedgerKeys → verify the key was created


