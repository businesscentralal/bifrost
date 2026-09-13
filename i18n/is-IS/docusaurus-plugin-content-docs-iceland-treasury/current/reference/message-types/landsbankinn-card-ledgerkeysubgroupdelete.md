---
id: landsbankinn-card-ledgerkeysubgroupdelete
title: "Landsbankinn.Card.LedgerKeySubGroupDelete"
sidebar_label: "Landsbankinn.Card.LedgerKeySubGroupDelete"
sidebar_position: 86
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.LedgerKeySubGroupDelete Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Eyðir a ledger key sub-group frá the Landsbankinn Cards portal.

**Stefna:** Outbound  
**API-endapunktur:** `DELETE /LedgerKeySubGroups/{id}`  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "id": "9bc1a4a5-488c-4e4d-befe-23f07b42a074"  // (required) GUID from LedgerKeySubGroups
}
```

## Svar
```json
{
  "status": "Deleted",
  "id": "9bc1a4a5-488c-4e4d-befe-23f07b42a074",
  "logEntryNo": 102
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Sækja the GUID `id` frá Landsbankinn.Card.LedgerKeySubGroups first.
Delete ledger keys that reference this sub-group áður en deleting it.

**Cleanup order:** LedgerKeyDelete → **LedgerKeySubGroupDelete** → LedgerKeyGroupDelete


