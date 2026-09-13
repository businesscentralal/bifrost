---
id: iceland-vatnumber-get
title: "Iceland.VatNumber.Get"
sidebar_label: "Iceland.VatNumber.Get"
sidebar_position: 71
description: "Beiðni- og svarsamningur fyrir Iceland.VatNumber.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir VAT numbers fyrir a fyrirtæki.

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/VatNumber/{id}`

## Beiðni
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person eða fyrirtæki.\n  - Skilar VAT registration numbers og ISAT industry codes.\n  - Works fyrir both companies og individuals who have VAT registrations.\n  - Dæmi: `4112032630` (fyrirtæki) eða `1202432179` (person með VAT).

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: Primary `VatNumber`, `Isat` code, `Description` (Icelandic), `English_Description`, `Open` status, og `VatNumbers` array Ef multiple registrations exist.

## Dæmi Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.VatNumber.Get",
    "path": "/api/VatNumber/{id}",
    "description": "Gets VAT numbers for a company.",
    "payload": { ... }
  }
}
```


