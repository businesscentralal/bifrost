---
id: iceland-address-get
title: "Iceland.Address.Get"
sidebar_label: "Iceland.Address.Get"
sidebar_position: 5
description: "Beiðni- og svarsamningur fyrir Iceland.Address.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Allt members og companies at an address identified by social ID.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/Address/{id}`

## Beiðni
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person eða fyrirtæki.\n  - Notaðu a **person** ID til find everyone registered at that person's address.\n  - Notaðu a **fyrirtæki** ID til find everyone at the fyrirtæki's registered address.\n  - Dæmi: `1102713369` (person) eða `4112032630` (fyrirtæki).

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `Street`, `PostCode`, `PostAddress`, og a `Members` array með Allt persons/companies at that address.

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Address.Get",
    "path": "/api/Address/{id}",
    "description": "Gets all members and companies at an address identified by social ID.",
    "payload": { ... }
  }
}
```


