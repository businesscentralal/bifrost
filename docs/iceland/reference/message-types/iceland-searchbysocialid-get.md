---
id: iceland-searchbysocialid-get
title: "Iceland.SearchBySocialID.Get"
sidebar_label: "Iceland.SearchBySocialID.Get"
sidebar_position: 57
description: "Request and response contract for the Iceland.SearchBySocialID.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets search results by social ID.

## Endpoint
- Method: `GET`
- Path: `/api/SearchBySocialID/{id}`

## Request
- **Subject**: 10-digit Icelandic social ID (kennitala) of a person or company.\n  - Searches the registry for entries matching this social ID.\n  - May return multiple results (e.g., current + historical records).\n  - Example: `1102713369` (person) or `4112032630` (company).

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `MembersCount`, `SearchString`, and `Members` array with matching entries (SocialID, Name, Address, PostCode, PostAddress).

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.SearchBySocialID.Get",
    "path": "/api/SearchBySocialID/{id}",
    "description": "Gets search results by social ID.",
    "payload": { ... }
  }
}
```

