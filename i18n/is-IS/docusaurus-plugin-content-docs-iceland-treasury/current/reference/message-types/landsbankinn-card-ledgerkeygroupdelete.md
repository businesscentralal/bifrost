---
id: landsbankinn-card-ledgerkeygroupdelete
title: "Landsbankinn.Card.LedgerKeyGroupDelete"
sidebar_label: "Landsbankinn.Card.LedgerKeyGroupDelete"
sidebar_position: 82
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.LedgerKeyGroupDelete Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Eyðir a ledger key group frá the Landsbankinn Cards portal.

**Stefna:** Outbound  
**API-endapunktur:** `DELETE /LedgerKeyGroups/{id}`  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "id": "2b2fe8c3-4ee7-4aa2-b8be-9282768073bd"  // (required) GUID from LedgerKeyGroups
}
```

## Svar
```json
{
  "status": "Deleted",
  "id": "2b2fe8c3-4ee7-4aa2-b8be-9282768073bd",
  "logEntryNo": 103
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Sækja the GUID `id` frá Landsbankinn.Card.LedgerKeyGroups first.
Delete ledger keys og sub-groups that reference this group áður en deleting the group.

**Cleanup order:** LedgerKeyDelete → LedgerKeySubGroupDelete → **LedgerKeyGroupDelete**


