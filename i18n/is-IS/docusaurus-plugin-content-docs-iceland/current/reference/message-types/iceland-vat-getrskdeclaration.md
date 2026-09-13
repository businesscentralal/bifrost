---
id: iceland-vat-getrskdeclaration
title: "Iceland.VAT.GetRSKDeclaration"
sidebar_label: "Iceland.VAT.GetRSKDeclaration"
sidebar_position: 67
description: "Beiðni- og svarsamningur fyrir Iceland.VAT.GetRSKDeclaration Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir RSK declarations (PDF skjöl) fyrir the configured kennitala.

**Stefna:** Outbound
**RSK Operation:** `NaIYfirlysinguRSK`

## Lifecycle position
This er a **utility/lookup** operation — does not participate in the VAT lifecycle state machine.

## Behavior
1. Always calls RSK using the configured kennitala frá credentials.
2. Parses the XML Svar í structured JSON með base64-encoded PDF skjöl.
3. Does not write til any local tables.

## Beiðni
```json
{}
```
No parameters needed — uses the configured kennitala frá Bifrost Setup.

## Svar
```json
{
  "success": true,
  "kennitala": "1234567890",
  "declarations": [
    { "year": 2025, "pdf": "<base64-encoded PDF>" }
  ]
}
```

## Agent playbook
1. Notaðu as a credential/authorization smoke test — Ef this Skilar data, RSK access er working.
2. The PDF content er base64-encoded — decode áður en presenting til the user.
3. Do not confuse með `Iceland.VAT.Receipt` which Skilar submission receipt fyrir a specific period.
4. **Known issue:** Þessi aðgerð currently Skilar HTTP 400 (SOAP decoding error). The RSK WSDL schema fyrir `NaIYfirlysinguRSK` may require additional parameters beyond Kennitala + KerfiUtgafa. Needs RSK API documentation til resolve.

## Error Svar
On failure, Skilar a structured error instead of throwing:
```json
{
  "success": false,
  "error": "RSK call failed with HTTP status 400.",
  "httpStatus": 400
}
```

## Errors
- HTTP 400 með SOAP fault "illegal input parameter value(s)" → Beiðnin schema does not match the RSK WSDL. Likely missing nauðsynlegt fields.
- RSK status 999 "Kerfi ekki skráð eða ekki virkt" → `KerfiUtgafa` not registered.
- No configured credentials → Skilar access gate error.

## Troubleshooting
- Beiðnin log (table Beiðni Log ori, LogType=VAT, Operation=NaIYfirlysinguRSK) er now preserved on errors — inspect the SOAP fault fyrir details.
- Notaðu `Iceland.VAT.GetPeriodEntries` as a connectivity smoke test instead (it works without `KerfiUtgafa` registration).
- Þessi aðgerð needs RSK WSDL documentation til determine the correct input parameters.


