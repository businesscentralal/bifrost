---
id: iceland-deltamonthly-sync
title: "Iceland.DeltaMonthly.Sync"
sidebar_label: "Iceland.DeltaMonthly.Sync"
sidebar_position: 26
description: "Beiðni- og svarsamningur fyrir Iceland.DeltaMonthly.Sync Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Syncs the monthly delta feed í Bifrost Umsja Registry Entry (upsert by Social ID).

## Endapunktur
- Aðferð: `GET`
- Slóð: `/api/DeltaMonthly?Month={month}&FileType=Flat`

## Beiðni
- **Subject**: Month number (1-12).\n  - Syncs registry changes fyrir that month í `Bifrost Umsja Registry Entry`.\n  - Dæmi: `6` (June).\n  - **Recommended**: Notaðu `queue_message_type` (not `call_message_type`) as this getur take significant time.\n  - Do NOT Notaðu the Bifrost tasks API-endapunktur.

## Svar
- Tengingin wraps the Umsja Svar in a staðlaða JSON envelope með `status` og `result`.
- Skilar: `{ "recordsSynced": N }` — the count of færslur upserted.\n- eftir sync, read data using `Data.Records.Get` on table `Bifrost Umsja Registry Entry`.

## Dæmi Wrapper
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


