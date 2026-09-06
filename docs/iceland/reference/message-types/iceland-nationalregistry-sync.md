---
id: iceland-nationalregistry-sync
title: "Iceland.NationalRegistry.Sync"
sidebar_label: "Iceland.NationalRegistry.Sync"
sidebar_position: 39
description: "Request and response contract for the Iceland.NationalRegistry.Sync Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Syncs the full national registry into Bifrost Umsja Registry Entry (full replace).

## Endpoint
- Method: `GET`
- Path: `/api/NationalRegistry?FileType=Flat`

## Request
- **No request JSON is required** for this operation.

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `{ "recordsSynced": N }` — the count of records imported.\n- After sync, read data using `Data.Records.Get` on table `Bifrost Umsja Registry Entry`.

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.NationalRegistry.Sync",
    "path": "/api/NationalRegistry?FileType=Flat",
    "description": "Syncs the full national registry into Bifrost Umsja Registry Entry (full replace).",
    "payload": { ... }
  }
}
```

