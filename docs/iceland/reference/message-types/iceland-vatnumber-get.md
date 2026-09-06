---
id: iceland-vatnumber-get
title: "Iceland.VatNumber.Get"
sidebar_label: "Iceland.VatNumber.Get"
sidebar_position: 71
description: "Request and response contract for the Iceland.VatNumber.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets VAT numbers for a company.

## Endpoint
- Method: `GET`
- Path: `/api/VatNumber/{id}`

## Request
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person or company.\n  - Returns VAT registration numbers and ISAT industry codes.\n  - Works for both companies and individuals who have VAT registrations.\n  - Example: `4112032630` (company) or `1202432179` (person with VAT).

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: Primary `VatNumber`, `Isat` code, `Description` (Icelandic), `English_Description`, `Open` status, and `VatNumbers` array if multiple registrations exist.

## Example Wrapper
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

