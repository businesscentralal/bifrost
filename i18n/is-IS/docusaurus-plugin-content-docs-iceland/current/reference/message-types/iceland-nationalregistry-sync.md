---
id: iceland-nationalregistry-sync
title: "Iceland.NationalRegistry.Sync"
sidebar_label: "Iceland.NationalRegistry.Sync"
sidebar_position: 39
description: "Beiðni- og svarsamningur fyrir Iceland.NationalRegistry.Sync Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Syncs the fulla national registry í Bifrost Umsja Registry Entry (fulla replace).

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/NationalRegistry?FileType=Flat`

## Beiðni
- **Engin JSON-beiðni er nauðsynleg** fyrir Þessi aðgerð.

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `{ "recordsSynced": N }` — the count of færslur imported.\n- eftir sync, read data using `Data.Records.Get` on table `Bifrost Umsja Registry Entry`.

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.NationalRegistry.Sync",
    "path": "/api/NationalRegistry?FileType=Flat",
    "description": "Syncs the full national registry into Bifrost Umsja Registry Entry (full replace).",
    "payload": { ... }
  }
}
```


