---
id: landsbankinn-card-ledgerkeycreate
title: "Landsbankinn.Card.LedgerKeyCreate"
sidebar_label: "Landsbankinn.Card.LedgerKeyCreate"
sidebar_position: 79
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.LedgerKeyCreate Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a new ledger key in the Landsbankinn Cards portal.
Ledger keys eru used til categorize card færslur fyrir accounting.

**Stefna:** Outbound  
**API-endapunktur:** `POST /LedgerKeys`  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "identifier": "6100",          // (required) Ledger key identifier prefix
  "description": "Office Supplies" // (required) Ledger key description
}
```

## Svar
The created ledger key object as returned by the bank API.
```json
{
  "id": "6c9f4fc8-4b46-478e-a90d-e0ea93fe575c",
  "companyId": "6306251060",
  "created": "2026-07-16T11:03:17",
  "createdBy": "L630625B2B11",
  "identifier": "6100",
  "description": "Office Supplies",
  "logEntryNo": 94
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this til sync G/L reikningur mappings frá BC til the Landsbankinn Cards portal.
The `identifier` typically corresponds til the G/L reikningur number.
The returned `id` (GUID) er used fyrir TransactionUpdate og LedgerKeyDelete.

**Ledger key setup Verkflæði:**
1. LedgerKeyGroupCreate → create a group (e.g. "OPEX")
2. LedgerKeySubGroupCreate → create a sub-group (e.g. "OFFICE")
3. **LedgerKeyCreate** → create a key (e.g. G/L 6100) (this Endapunktur)
4. LedgerKeys → verify the key was created

**Cleanup (reverse order):** LedgerKeyDelete → LedgerKeySubGroupDelete → LedgerKeyGroupDelete


