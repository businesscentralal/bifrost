---
id: iceland-searchbyname-get
title: "Iceland.SearchByName.Get"
sidebar_label: "Iceland.SearchByName.Get"
sidebar_position: 56
description: "Request and response contract for the Iceland.SearchByName.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets search results by name.

## Endpoint
- Method: `GET`
- Path: `/api/SearchByName/{id}`

## Request
- **Subject**: A person or company name to search for.\n  - Free-text name search in the national registry.\n  - Example: `Gunnar` or `Kappi ehf`.

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `MembersCount`, `SearchString`, and `Members` array with matching persons/companies (SocialID, Name, Address, PostCode, PostAddress).

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.SearchByName.Get",
    "path": "/api/SearchByName/{id}",
    "description": "Gets search results by name.",
    "payload": { ... }
  }
}
```

