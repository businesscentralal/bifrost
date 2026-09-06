---
id: iceland-vat-getrskdeclaration
title: "Iceland.VAT.GetRSKDeclaration"
sidebar_label: "Iceland.VAT.GetRSKDeclaration"
sidebar_position: 67
description: "Request and response contract for the Iceland.VAT.GetRSKDeclaration Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves RSK declarations (PDF documents) for the configured kennitala.

**Direction:** Outbound
**RSK Operation:** `NaIYfirlysinguRSK`

## Lifecycle position
This is a **utility/lookup** operation — does not participate in the VAT lifecycle state machine.

## Behavior
1. Always calls RSK using the configured kennitala from credentials.
2. Parses the XML response into structured JSON with base64-encoded PDF documents.
3. Does not write to any local tables.

## Request
```json
{}
```
No parameters needed — uses the configured kennitala from Bifrost Setup.

## Response
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
1. Use as a credential/authorization smoke test — if this returns data, RSK access is working.
2. The PDF content is base64-encoded — decode before presenting to the user.
3. Do not confuse with `Iceland.VAT.Receipt` which returns the submission receipt for a specific period.
4. **Known issue:** This operation currently returns HTTP 400 (SOAP decoding error). The RSK WSDL schema for `NaIYfirlysinguRSK` may require additional parameters beyond Kennitala + KerfiUtgafa. Needs RSK API documentation to resolve.

## Error response
On failure, returns a structured error instead of throwing:
```json
{
  "success": false,
  "error": "RSK call failed with HTTP status 400.",
  "httpStatus": 400
}
```

## Errors
- HTTP 400 with SOAP fault "illegal input parameter value(s)" → the request schema does not match the RSK WSDL. Likely missing required fields.
- RSK status 999 "Kerfi ekki skráð eða ekki virkt" → `KerfiUtgafa` not registered.
- No configured credentials → returns access gate error.

## Troubleshooting
- The request log (table Request Log ori, LogType=VAT, Operation=NaIYfirlysinguRSK) is now preserved on errors — inspect the SOAP fault for details.
- Use `Iceland.VAT.GetPeriodEntries` as a connectivity smoke test instead (it works without `KerfiUtgafa` registration).
- This operation needs RSK WSDL documentation to determine the correct input parameters.

