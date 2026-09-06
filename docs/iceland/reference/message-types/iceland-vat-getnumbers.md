---
id: iceland-vat-getnumbers
title: "Iceland.VAT.GetNumbers"
sidebar_label: "Iceland.VAT.GetNumbers"
sidebar_position: 65
description: "Request and response contract for the Iceland.VAT.GetNumbers Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves all VAT numbers registered for the configured kennitala from Skatturinn.

**Direction:** Outbound
**RSK Operation:** `NaIVSKNumer`

## Lifecycle position
This is a **utility/lookup** operation — does not participate in the VAT lifecycle state machine.
Use it to discover available VSK numbers before calling GetInfo.

## Behavior
1. Always calls RSK (no caching).
2. Parses the XML response into structured JSON.
3. Does not write to any local tables.

## Request
```json
{
  "vat": {
    "vskNumer": "123456",
    "ar": 2026,
    "timabil": "01"
  }
}
```
All three fields are **required**.

## Response
```json
{
  "success": true,
  "numbers": [
    { "vskNumer": "123456", "nafn": "Company Name", "kennitala": "1234567890" }
  ]
}
```

## Agent playbook
1. Call this **first** if you don't know the VSK number for a company.
2. Use the returned `vskNumer` value in subsequent GetInfo/Validate/Submit calls.
3. Useful for multi-entity setups where one kennitala may have multiple VAT numbers.

## Error response
On failure, returns a structured error instead of throwing:
```json
{
  "success": false,
  "rskStatusCode": 999,
  "error": "Kerfi ekki skráð eða ekki virkt"
}
```

## Errors
- Missing `vat` object or required fields → error.
- RSK status 999 "Kerfi ekki skráð eða ekki virkt" → the `KerfiUtgafa` software identifier is not registered with Skatturinn. Contact RSK to register.
- HTTP non-200 → returns `success: false` with `httpStatus` and `error` fields.

## Troubleshooting
- This operation **requires** a registered `KerfiUtgafa` value at RSK. If you get status 999, the software is not yet registered.
- Check the Request Log (table Request Log ori, LogType=VAT) for full SOAP request/response bodies.
- The request log is preserved even on RSK errors — use it for diagnostics.

