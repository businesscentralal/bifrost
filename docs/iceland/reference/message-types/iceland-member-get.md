---
id: iceland-member-get
title: "Iceland.Member.Get"
sidebar_label: "Iceland.Member.Get"
sidebar_position: 38
description: "Request and response contract for the Iceland.Member.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets a specific member or company from the registry.

## Endpoint
- Method: `GET`
- Path: `/api/Member/{id}`

## Request
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person or company.\n  - Use a **person** ID for full personal details (birth date, marital status, family, legal address).\n  - Use a **company** ID for company registry details (ISAT, agents, stakeholders).\n  - Example: `1102713369` (person) or `4112032630` (company).

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: Full registry record including `Name`, `Address`, `BornDate`, `Extention` (family/spouse), `FullExtention` (citizenship, old addresses), and `CompanyExtention` (if company).

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Member.Get",
    "path": "/api/Member/{id}",
    "description": "Gets a specific member or company from the registry.",
    "payload": { ... }
  }
}
```

