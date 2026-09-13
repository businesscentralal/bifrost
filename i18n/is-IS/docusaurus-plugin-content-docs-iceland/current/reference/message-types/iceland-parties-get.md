---
id: iceland-parties-get
title: "Iceland.Parties.Get"
sidebar_label: "Iceland.Parties.Get"
sidebar_position: 41
description: "Beiðni- og svarsamningur fyrir Iceland.Parties.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir fyrirtæki parties (board members, auditors, founders, etc.).

## Endapunktur
- Aðferð: `POST`
- Slóð: `/api/Parties`

## Beiðni
- **Beiðni Body (JSON)**:\n  - `CompanyID` (nauðsynlegt): 10-digit kennitala of a **fyrirtæki**.\n  - `TypesOfRoles` (valfrjálst): Array of role Gerð IDs til filter.\n    Values: `1` Stjórn, `2` Endurskoðandi, `3` Eigandi, `4` Framkvæmdastjórn, `5` Prókúruhafi, `6` Stofnandi, `7` Útibússtjóri, `8` Umboðsaðili, `9` Varastjórn.\n  - Dæmi: `{"CompanyID": "4112032630", "TypesOfRoles": ["1", "5"]}`

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: Listi of parties (board members, auditors, founders, etc.) fyrir the fyrirtæki.

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Parties.Get",
    "path": "/api/Parties",
    "description": "Gets company parties (board members, auditors, founders, etc.).",
    "payload": { ... }
  }
}
```


