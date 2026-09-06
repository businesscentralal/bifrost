---
id: iceland-address-get
title: "Iceland.Address.Get"
sidebar_label: "Iceland.Address.Get"
sidebar_position: 5
description: "Request and response contract for the Iceland.Address.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets all members and companies at an address identified by social ID.

## Endpoint
- Method: `GET`
- Path: `/api/Address/{id}`

## Request
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person or company.\n  - Use a **person** ID to find everyone registered at that person's address.\n  - Use a **company** ID to find everyone at the company's registered address.\n  - Example: `1102713369` (person) or `4112032630` (company).

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `Street`, `PostCode`, `PostAddress`, and a `Members` array with all persons/companies at that address.

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Address.Get",
    "path": "/api/Address/{id}",
    "description": "Gets all members and companies at an address identified by social ID.",
    "payload": { ... }
  }
}
```

