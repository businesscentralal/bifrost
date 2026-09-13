---
id: iceland-isat-get
title: "Iceland.Isat.Get"
sidebar_label: "Iceland.Isat.Get"
sidebar_position: 34
description: "Beiðni- og svarsamningur fyrir Iceland.Isat.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir the ISAT table, eða ISAT codes fyrir a specific subject (kennitala).

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/Isat or /api/Isat/{id}`

## Beiðni
- **Subject** (valfrjálst): 10-digit kennitala.\n  - Ef provided: Skilar ISAT codes registered fyrir that person/fyrirtæki.\n  - Ef omitted: Skilar fulla ISAT classification table.\n  - Dæmi: `4112032630` (fyrirtæki)

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: ISAT codes með Icelandic og English descriptions.

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Isat.Get",
    "path": "/api/Isat or /api/Isat/{id}",
    "description": "Gets the ISAT table, or ISAT codes for a specific subject (kennitala).",
    "payload": { ... }
  }
}
```


