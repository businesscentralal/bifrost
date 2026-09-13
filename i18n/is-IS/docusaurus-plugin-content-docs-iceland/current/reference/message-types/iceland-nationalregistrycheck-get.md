---
id: iceland-nationalregistrycheck-get
title: "Iceland.NationalRegistryCheck.Get"
sidebar_label: "Iceland.NationalRegistryCheck.Get"
sidebar_position: 40
description: "Beiðni- og svarsamningur fyrir Iceland.NationalRegistryCheck.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Checks whether the fulla national registry file exists og contains data.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/NationalRegistryCheck`

## Beiðni
- **Engin JSON-beiðni er nauðsynleg** fyrir Þessi aðgerð.

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `FileExist` (boolean) og `FileLength` (file size in bytes).\n  - A healthy registry file er typically ~220 MB. Ef `FileExist` er false eða `FileLength` er 0, do not run `Iceland.NationalRegistry.Sync`.

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.NationalRegistryCheck.Get",
    "path": "/api/NationalRegistryCheck",
    "description": "Checks whether the full national registry file exists and contains data.",
    "payload": { ... }
  }
}
```


