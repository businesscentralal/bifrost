---
id: iceland-member-get
title: "Iceland.Member.Get"
sidebar_label: "Iceland.Member.Get"
sidebar_position: 38
description: "Beiðni- og svarsamningur fyrir Iceland.Member.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir a specific member eða fyrirtæki frá the registry.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/Member/{id}`

## Beiðni
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person eða fyrirtæki.\n  - Notaðu a **person** ID fyrir fulla personal details (birth date, marital status, family, legal address).\n  - Notaðu a **fyrirtæki** ID fyrir fyrirtæki registry details (ISAT, agents, stakeholders).\n  - Dæmi: `1102713369` (person) eða `4112032630` (fyrirtæki).

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: fulla registry færsla þar á meðal `Name`, `Address`, `BornDate`, `Extention` (family/spouse), `FullExtention` (citizenship, old addresses), og `CompanyExtention` (Ef fyrirtæki).

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Member.Get",
    "path": "/api/Member/{id}",
    "description": "Gets a specific member or company from the registry.",
    "payload": { ... }
  }
}
```


