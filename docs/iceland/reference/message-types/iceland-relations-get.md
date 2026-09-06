---
id: iceland-relations-get
title: "Iceland.Relations.Get"
sidebar_label: "Iceland.Relations.Get"
sidebar_position: 53
description: "Request and response contract for the Iceland.Relations.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets family relations and company relations by ID.

## Endpoint
- Method: `GET`
- Path: `/api/Relations/{id}`

## Request
- **Subject**: 10-digit Icelandic social ID (kennitala) of a **person**.\n  - Returns family relations and company relations for the person.\n  - Example: `1102713369`.

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `Person` details, `FamilyRelations` array (spouse, family members), and `CompanyRelations` array (companies where the person has a role).

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Relations.Get",
    "path": "/api/Relations/{id}",
    "description": "Gets family relations and company relations by ID.",
    "payload": { ... }
  }
}
```

