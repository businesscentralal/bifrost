---
id: iceland-search-get
title: "Iceland.Search.Get"
sidebar_label: "Iceland.Search.Get"
sidebar_position: 55
description: "Beiðni- og svarsamningur fyrir Iceland.Search.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir search results by search string, Heiti, address, eða postal address.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/Search/{id}`

## Beiðni
- **Subject**: Any search text — Heiti, social ID, address, eða postal address.\n  - Free-text search across the national registry.\n  - Dæmi: `1102713369` eða `Gunnar` eða `Eyrartúni 4`.

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `MembersCount`, `SearchString`, og `Members` array með matching persons/companies (SocialID, Heiti, Address, PostCode, PostAddress).

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Search.Get",
    "path": "/api/Search/{id}",
    "description": "Gets search results by search string, name, address, or postal address.",
    "payload": { ... }
  }
}
```


