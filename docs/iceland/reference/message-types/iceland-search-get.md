---
id: iceland-search-get
title: "Iceland.Search.Get"
sidebar_label: "Iceland.Search.Get"
sidebar_position: 55
description: "Request and response contract for the Iceland.Search.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets search results by search string, name, address, or postal address.

## Endpoint
- Method: `GET`
- Path: `/api/Search/{id}`

## Request
- **Subject**: Any search text — name, social ID, address, or postal address.\n  - Free-text search across the national registry.\n  - Example: `1102713369` or `Gunnar` or `Eyrartúni 4`.

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `MembersCount`, `SearchString`, and `Members` array with matching persons/companies (SocialID, Name, Address, PostCode, PostAddress).

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Search.Get",
    "path": "/api/Search/{id}",
    "description": "Gets search results by search string, name, address, or postal address.",
    "payload": { ... }
  }
}
```

