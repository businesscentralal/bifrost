---
id: iceland-isat-get
title: "Iceland.Isat.Get"
sidebar_label: "Iceland.Isat.Get"
sidebar_position: 34
description: "Request and response contract for the Iceland.Isat.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets the ISAT table, or ISAT codes for a specific subject (kennitala).

## Endpoint
- Method: `GET`
- Path: `/api/Isat or /api/Isat/{id}`

## Request
- **Subject** (optional): 10-digit kennitala.\n  - If provided: returns ISAT codes registered for that person/company.\n  - If omitted: returns the full ISAT classification table.\n  - Example: `4112032630` (company)

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: ISAT codes with Icelandic and English descriptions.

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Isat.Get",
    "path": "/api/Isat or /api/Isat/{id}",
    "description": "Gets the ISAT table, or ISAT codes for a specific subject (kennitala).",
    "payload": { ... }
  }
}
```

