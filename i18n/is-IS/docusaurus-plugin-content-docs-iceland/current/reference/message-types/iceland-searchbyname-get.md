---
id: iceland-searchbyname-get
title: "Iceland.SearchByName.Get"
sidebar_label: "Iceland.SearchByName.Get"
sidebar_position: 56
description: "Beiðni- og svarsamningur fyrir Iceland.SearchByName.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir search results by Heiti.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/SearchByName/{id}`

## Beiðni
- **Subject**: A person eða fyrirtæki Heiti til search fyrir.\n  - Free-text Heiti search in the national registry.\n  - Dæmi: `Gunnar` eða `Kappi ehf`.

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `MembersCount`, `SearchString`, og `Members` array með matching persons/companies (SocialID, Heiti, Address, PostCode, PostAddress).

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.SearchByName.Get",
    "path": "/api/SearchByName/{id}",
    "description": "Gets search results by name.",
    "payload": { ... }
  }
}
```


