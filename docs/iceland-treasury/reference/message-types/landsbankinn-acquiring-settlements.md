---
id: landsbankinn-acquiring-settlements
title: "Landsbankinn.Acquiring.Settlements"
sidebar_label: "Landsbankinn.Acquiring.Settlements"
sidebar_position: 76
description: "Request and response contract for the Landsbankinn.Acquiring.Settlements Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists acquiring settlement batches. Defaults to past month if no dates specified.

## Request
```json
{
  "dateFrom": "2026-07-01",        // optional
  "dateTo": "2026-07-22",          // optional
  "contractNumber": "...",          // optional — merchant contract
  "skip": 0, "take": 100           // optional
}
```

## Response
Returns `data` (array of settlements), `page`, `perPage`, `totalItems`, `logEntryNo`.

