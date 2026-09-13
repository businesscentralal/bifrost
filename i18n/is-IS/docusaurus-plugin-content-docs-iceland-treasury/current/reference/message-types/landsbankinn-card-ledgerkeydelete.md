---
id: landsbankinn-card-ledgerkeydelete
title: "Landsbankinn.Card.LedgerKeyDelete"
sidebar_label: "Landsbankinn.Card.LedgerKeyDelete"
sidebar_position: 80
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.LedgerKeyDelete Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Eyðir a ledger key frá the Landsbankinn Cards portal.

**Stefna:** Outbound  
**API-endapunktur:** `DELETE /LedgerKeys/{id}`  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "id": "6c9f4fc8-4b46-478e-a90d-e0ea93fe575c"  // (required) GUID from LedgerKeys
}
```

## Svar
```json
{
  "status": "Deleted",
  "id": "6c9f4fc8-4b46-478e-a90d-e0ea93fe575c",
  "logEntryNo": 101
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Sækja the GUID `id` frá Landsbankinn.Card.LedgerKeys first.
This er a destructive operation — the key cannot be recovered eftir deletion.

**Cleanup order:** Delete keys áður en sub-groups, sub-groups áður en groups.


