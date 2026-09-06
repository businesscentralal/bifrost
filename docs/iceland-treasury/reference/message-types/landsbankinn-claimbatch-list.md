---
id: landsbankinn-claimbatch-list
title: "Landsbankinn.ClaimBatch.List"
sidebar_label: "Landsbankinn.ClaimBatch.List"
sidebar_position: 101
description: "Request and response contract for the Landsbankinn.ClaimBatch.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a paged list of claim batch operations submitted to Landsbankinn.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
Use this message to list previously submitted batch operations (create, update, cancel). Each batch contains a status and summary of the actions performed.
Use `Landsbankinn.ClaimBatch.Get` to retrieve details for a specific batch, or `Landsbankinn.ClaimBatch.Actions` to see the individual action results.

## Required parameter
`createdFrom` is required by the bank API. The request will fail without it.

## Request
```json
{
  "createdFrom": "2026-01-01",
  "createdTo":   "2026-12-31",
  "sortBy":      "createdDate desc",
  "skip":        0,
  "take":        100
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `createdFrom` | date | **Yes** | Get batches created on or after this date. |
| `createdTo` | date | No | Get batches created up to and including this date. |
| `sortBy` | string | No | Sort expression, e.g. `createdDate desc`. |
| `skip` | integer | No | Number of records to skip (default 0). |
| `take` | integer | No | Number of records to return (default 100, max 1000). |

## Response
Returns `data` (array of batch objects), `page`, `perPage`, `totalItems`, and `logEntryNo`.

Each batch object contains:
- `id` — batch identifier
- `method` — action method (create, update, cancel)
- `status` — batch status
- `createdDate` — when the batch was submitted
- `results` — summary counts

## Paging
The bank API uses `page`/`perPage` query parameters with `X-Paging-TotalItems` and `X-Paging-TotalPages` response headers.
The Bifrost interface translates `skip`/`take` to the bank's `page`/`perPage` model automatically.

