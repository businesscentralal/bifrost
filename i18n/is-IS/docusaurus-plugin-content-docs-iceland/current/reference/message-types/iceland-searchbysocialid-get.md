---
id: iceland-searchbysocialid-get
title: "Iceland.SearchBySocialID.Get"
sidebar_label: "Iceland.SearchBySocialID.Get"
sidebar_position: 57
description: "Beiðni- og svarsamningur fyrir Iceland.SearchBySocialID.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir search results by social ID.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/SearchBySocialID/{id}`

## Beiðni
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person eða fyrirtæki.\n  - Searches the registry fyrir entries matching this social ID.\n  - May return multiple results (e.g., current + historical færslur).\n  - Dæmi: `1102713369` (person) eða `4112032630` (fyrirtæki).

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `MembersCount`, `SearchString`, og `Members` array með matching entries (SocialID, Heiti, Address, PostCode, PostAddress).

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.SearchBySocialID.Get",
    "path": "/api/SearchBySocialID/{id}",
    "description": "Gets search results by social ID.",
    "payload": { ... }
  }
}
```


