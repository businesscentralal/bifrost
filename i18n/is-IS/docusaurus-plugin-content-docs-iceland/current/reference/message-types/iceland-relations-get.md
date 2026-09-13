---
id: iceland-relations-get
title: "Iceland.Relations.Get"
sidebar_label: "Iceland.Relations.Get"
sidebar_position: 53
description: "Beiðni- og svarsamningur fyrir Iceland.Relations.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir family relations og fyrirtæki relations by ID.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/Relations/{id}`

## Beiðni
- **Subject**: 10-digit Icelandic social ID (kennitala) of a **person**.\n  - Skilar family relations og fyrirtæki relations fyrir the person.\n  - Dæmi: `1102713369`.

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `Person` details, `FamilyRelations` array (spouse, family members), og `CompanyRelations` array (companies where the person has a role).

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Relations.Get",
    "path": "/api/Relations/{id}",
    "description": "Gets family relations and company relations by ID.",
    "payload": { ... }
  }
}
```


