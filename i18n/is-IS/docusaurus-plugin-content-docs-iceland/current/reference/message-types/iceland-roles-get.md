---
id: iceland-roles-get
title: "Iceland.Roles.Get"
sidebar_label: "Iceland.Roles.Get"
sidebar_position: 54
description: "Beiðni- og svarsamningur fyrir Iceland.Roles.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir fyrirtæki roles held by a person.

## Endapunktur
- Aðferð: `POST`
- Slóð: `/api/Roles`

## Beiðni
- **Beiðni Body (JSON)**:\n  - `SocialID` (nauðsynlegt): 10-digit kennitala of a **person**.\n  - `TypesOfRoles` (valfrjálst): Array of role Gerð IDs til filter.\n    Values: `1` Stjórn, `2` Endurskoðandi, `3` Eigandi, `4` Framkvæmdastjórn, `5` Prókúruhafi, `6` Stofnandi, `7` Útibússtjóri, `8` Umboðsaðili, `9` Varastjórn.\n  - Dæmi: `{"SocialID": "1102713369", "TypesOfRoles": ["1", "4"]}`

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: Listi of fyrirtæki roles (board seats, ownership, management) held by the person.

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Roles.Get",
    "path": "/api/Roles",
    "description": "Gets company roles held by a person.",
    "payload": { ... }
  }
}
```


