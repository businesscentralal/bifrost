---
id: iceland-addressinfo-get
title: "Iceland.AddressInfo.Get"
sidebar_label: "Iceland.AddressInfo.Get"
sidebar_position: 6
description: "Request and response contract for the Iceland.AddressInfo.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets address information for a social ID.

## Endpoint
- Method: `GET`
- Path: `/api/AddressInfo/{id}`

## Request
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person or company.\n  - Returns the registered address for the given ID.\n  - Example: `1102713369` (person) or `4112032630` (company).

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `SocialID`, `Name`, `Street`, `PostCode`, `PostAddress` for the subject.

## Example Wrapper
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

