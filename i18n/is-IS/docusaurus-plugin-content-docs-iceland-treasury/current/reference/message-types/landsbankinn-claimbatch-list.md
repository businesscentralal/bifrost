---
id: landsbankinn-claimbatch-list
title: "Landsbankinn.ClaimBatch.List"
sidebar_label: "Landsbankinn.ClaimBatch.List"
sidebar_position: 101
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimBatch.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a paged Listi of claim batch operations submitted til Landsbankinn.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
Notaðu this message til Listi previously submitted batch operations (create, update, cancel). Each batch contains a status og summary of the actions performed.
Notaðu `Landsbankinn.ClaimBatch.Get` til retrieve details fyrir a specific batch, eða `Landsbankinn.ClaimBatch.Actions` til see the individual action results.

## nauðsynlegt parameter
`createdFrom` er nauðsynlegt by the bank API. Beiðnin mun fail without it.

## Beiðni
```json
{
  "createdFrom": "2026-01-01",
  "createdTo":   "2026-12-31",
  "sortBy":      "createdDate desc",
  "skip":        0,
  "take":        100
}
```

| Reitur | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `createdFrom` | date | **Yes** | Sækja batches created on eða eftir this date. |
| `createdTo` | date | No | Sækja batches created up til og þar á meðal this date. |
| `sortBy` | string | No | Sort expression, e.g. `createdDate desc`. |
| `skip` | integer | No | Number of færslur til skip (default 0). |
| `take` | integer | No | Number of færslur til return (default 100, max 1000). |

## Svar
Skilar `data` (array of batch objects), `page`, `perPage`, `totalItems`, og `logEntryNo`.

Each batch object contains:
- `id` — batch identifier
- `method` — action Aðferð (create, update, cancel)
- `status` — batch status
- `createdDate` — Þegar the batch was submitted
- `results` — summary counts

## Paging
The bank API uses `page`/`perPage` Fyrirspurn parameters með `X-Paging-TotalItems` og `X-Paging-TotalPages` Svar headers.
The Bifrost interface translates `skip`/`take` til the bank's `page`/`perPage` model sjálfkrafa.


