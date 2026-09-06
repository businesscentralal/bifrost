---
id: iceland-deltamonthly-sync
title: "Iceland.DeltaMonthly.Sync"
sidebar_label: "Iceland.DeltaMonthly.Sync"
sidebar_position: 26
description: "Request and response contract for the Iceland.DeltaMonthly.Sync Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Syncs the monthly delta feed into Bifrost Umsja Registry Entry (upsert by Social ID).

## Endpoint
- Method: `GET`
- Path: `/api/DeltaMonthly?Month={month}&FileType=Flat`

## Request
- **Subject**: Month number (1-12).\n  - Syncs registry changes for that month into `Bifrost Umsja Registry Entry`.\n  - Example: `6` (June).\n  - **Recommended**: Use `queue_message_type` (not `call_message_type`) as this can take significant time.\n  - Do NOT use the Bifrost tasks API endpoint.

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: `{ "recordsSynced": N }` — the count of records upserted.\n- After sync, read data using `Data.Records.Get` on table `Bifrost Umsja Registry Entry`.

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.DeltaMonthly.Sync",
    "path": "/api/DeltaMonthly?Month={month}&FileType=Flat",
    "description": "Syncs the monthly delta feed into Bifrost Umsja Registry Entry (upsert by Social ID).",
    "payload": { ... }
  }
}
```

