---
id: iceland-addressinfo-get
title: "Iceland.AddressInfo.Get"
sidebar_label: "Iceland.AddressInfo.Get"
sidebar_position: 6
description: "Beiðni- og svarsamningur fyrir Iceland.AddressInfo.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir address information fyrir a social ID.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/AddressInfo/{id}`

## Beiðni
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person eða fyrirtæki.\n  - Skilar registered address fyrir the given ID.\n  - Dæmi: `1102713369` (person) eða `4112032630` (fyrirtæki).

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `SocialID`, `Name`, `Street`, `PostCode`, `PostAddress` fyrir the subject.

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.AddressInfo.Get",
    "path": "/api/AddressInfo/{id}",
    "description": "Gets address information for a social ID.",
    "payload": { ... }
  }
}
```


