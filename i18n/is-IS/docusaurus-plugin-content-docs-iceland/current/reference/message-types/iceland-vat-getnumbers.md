---
id: iceland-vat-getnumbers
title: "Iceland.VAT.GetNumbers"
sidebar_label: "Iceland.VAT.GetNumbers"
sidebar_position: 65
description: "Beiðni- og svarsamningur fyrir Iceland.VAT.GetNumbers Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Allt VAT numbers registered fyrir the configured kennitala frá Skatturinn.

**Stefna:** Outbound
**RSK Operation:** `NaIVSKNumer`

## Lifecycle position
This er a **utility/lookup** operation — does not participate in the VAT lifecycle state machine.
Notaðu it til discover available VSK numbers áður en calling GetInfo.

## Behavior
1. Always calls RSK (no caching).
2. Parses the XML Svar í structured JSON.
3. Does not write til any local tables.

## Beiðni
```json
{
  "vat": {
    "vskNumer": "123456",
    "ar": 2026,
    "timabil": "01"
  }
}
```
Allt three fields eru **nauðsynlegt**.

## Svar
```json
{
  "success": true,
  "numbers": [
    { "vskNumer": "123456", "nafn": "Company Name", "kennitala": "1234567890" }
  ]
}
```

## Agent playbook
1. Kallaðu á this **first** Ef you don't know the VSK number fyrir a fyrirtæki.
2. Notaðu the returned `vskNumer` value in subsequent GetInfo/Validate/Submit calls.
3. Useful fyrir multi-entity setups where one kennitala may have multiple VAT numbers.

## Error Svar
On failure, Skilar a structured error instead of throwing:
```json
{
  "success": false,
  "rskStatusCode": 999,
  "error": "Kerfi ekki skráð eða ekki virkt"
}
```

## Errors
- Missing `vat` object eða nauðsynlegt fields → error.
- RSK status 999 "Kerfi ekki skráð eða ekki virkt" → the `KerfiUtgafa` software identifier er not registered með Skatturinn. Contact RSK til register.
- HTTP non-200 → Skilar `success: false` með `httpStatus` og `error` fields.

## Troubleshooting
- Þessi aðgerð **requires** a registered `KerfiUtgafa` value at RSK. Ef you Sækja status 999, the software er not yet registered.
- Check Beiðnin Log (table Beiðni Log ori, LogType=VAT) fyrir fulla SOAP Beiðni/Svar bodies.
- Beiðnin log er preserved even on RSK errors — Notaðu it fyrir diagnostics.


