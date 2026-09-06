---
id: iceland-nationalregistrycheck-get
title: "Iceland.NationalRegistryCheck.Get"
sidebar_label: "Iceland.NationalRegistryCheck.Get"
sidebar_position: 40
description: "Request and response contract for the Iceland.NationalRegistryCheck.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Checks whether the full national registry file exists and contains data.

## Endpoint
- Method: `GET`
- Path: `/api/NationalRegistryCheck`

## Request
- **No request JSON is required** for this operation.

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `FileExist` (boolean) and `FileLength` (file size in bytes).\n  - A healthy registry file is typically ~220 MB. If `FileExist` is false or `FileLength` is 0, do not run `Iceland.NationalRegistry.Sync`.

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.NationalRegistryCheck.Get",
    "path": "/api/NationalRegistryCheck",
    "description": "Checks whether the full national registry file exists and contains data.",
    "payload": { ... }
  }
}
```

