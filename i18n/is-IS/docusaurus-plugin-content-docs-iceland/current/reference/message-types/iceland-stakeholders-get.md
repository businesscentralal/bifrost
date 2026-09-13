---
id: iceland-stakeholders-get
title: "Iceland.Stakeholders.Get"
sidebar_label: "Iceland.Stakeholders.Get"
sidebar_position: 60
description: "Beiðni- og svarsamningur fyrir Iceland.Stakeholders.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir stakeholders fyrir a fyrirtæki.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/Stakeholders/{id}`

## Beiðni
- **Subject**: 10-digit Icelandic social ID (kennitala) of a **fyrirtæki**.\n  - Skilar stakeholders (board members, agents) fyrir the fyrirtæki.\n  - Do NOT Notaðu a person ID — Notaðu `Iceland.Relations.Get` fyrir person-til-fyrirtæki lookups.\n  - Dæmi: `4112032630` (fyrirtæki).

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `SocialID`, `Name` of the fyrirtæki, og `Stakeholders` array með each person's Heiti, address, og `Role` (e.g., Agent, Chairman of board).

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Stakeholders.Get",
    "path": "/api/Stakeholders/{id}",
    "description": "Gets stakeholders for a company.",
    "payload": { ... }
  }
}
```


