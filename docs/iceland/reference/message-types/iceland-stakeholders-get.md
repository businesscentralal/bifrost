---
id: iceland-stakeholders-get
title: "Iceland.Stakeholders.Get"
sidebar_label: "Iceland.Stakeholders.Get"
sidebar_position: 60
description: "Request and response contract for the Iceland.Stakeholders.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets stakeholders for a company.

## Endpoint
- Method: `GET`
- Path: `/api/Stakeholders/{id}`

## Request
- **Subject**: 10-digit Icelandic social ID (kennitala) of a **company**.\n  - Returns stakeholders (board members, agents) for the company.\n  - Do NOT use a person ID — use `Iceland.Relations.Get` for person-to-company lookups.\n  - Example: `4112032630` (company).

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `SocialID`, `Name` of the company, and `Stakeholders` array with each person's name, address, and `Role` (e.g., Agent, Chairman of board).

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Stakeholders.Get",
    "path": "/api/Stakeholders/{id}",
    "description": "Gets stakeholders for a company.",
    "payload": { ... }
  }
}
```

