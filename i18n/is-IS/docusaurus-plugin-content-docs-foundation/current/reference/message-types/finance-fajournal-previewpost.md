---
id: finance-fajournal-previewpost
title: "Finance.FAJournal.PreviewPost"
sidebar_label: "Finance.FAJournal.PreviewPost"
sidebar_position: 42
description: "Beiðni- og svarsamningur fyrir Finance.FAJournal.PreviewPost Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Simulates posting an FA dagbók Batch og Skilar the bók færslur that **would** be produced — án writing anything til the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `FA. Jnl.-Post` subscriber, captures the in-memory færslur via `Posting Preview Event Handler`, then enumerates every populated tafla úr `FillDocumentEntry`. Typical previewed töflur include `FA Ledger Entry`, `Maintenance Ledger Entry`, og (þegar the depreciation book Bókar til G/L) `G/L Entry` og `VAT Entry`. hver row er serialized through `Bifrost Preview Helper` so consumers getur pick which fields they care about.

Skilar `rollback: true` so callers know the database was untouched. einnig pre-computes the LCY balance (úr hvaða captured G/L færslur) og the distinct G/L `Document No.` values that would appear on the register.

**Stefna**: Innkomandi (lesa-aðeins — all changes rolled back)  **Efnisgerð**: `text/markdown`

Response er wrapped as a markdown skjal around a fenced ```json``` block so it renders inline in chat clients; the JSON inside er the structured payload below.

## Batch Identification Order

fyrsta match wins:
1. `data.templateName` (+ valfrjálst `data.batchName`).
2. `subject` envelope attribute er a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `templateName` | strengur | Sjá above | FA dagbók template (Code[10]). |
| `batchName` | strengur | No | FA dagbók batch (Code[10]). |

### Dæmi um beiðni
```json
{ "templateName": "ASSETS", "batchName": "DEFAULT" }
```

## Uppbygging svars

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting fixed asset journal batch ASSETS|DEFAULT (1 lines) would create 2 ledger entries across 2 tables. G/L impact is balanced.",
  "templateName": "ASSETS",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 1,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedDocumentNos": [],
  "totals": { "balanced": true, "totalDebitLCY": 0.0, "totalCreditLCY": 0.0 },
  "preview": [
    {
      "tableId": 5625,
      "tableName": "Maintenance Ledger Entry",
      "tableCaption": "Maintenance Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "FANo_": "FA000010", "DocumentNo_": "***", "Amount": "5000", "DepreciationBookCode": "COMPANY" }
        }
      ]
    }
  ]
}
```

### Svarreitir

| Reitur | Gerð | Athugasemdir |
|---|---|---|
| `rollback` | bool | Always `true` fyrir this skilaboðategund. |
| `summary` | strengur | One-line human-readable recap. |
| `linesToPost` | int | dagbók lines fed í the preview. |
| `postingDate` | strengur | `Posting Date` of the fyrsta line. |
| `lcyCode` | strengur | `GLSetup."LCY Code"`. |
| `batchDescription` | strengur | The batch's `Description` Reitur. May be empty þegar the batch has no Lýsing. |
| `predictedDocumentNos` | strengur[] | Distinct `Document No.` values across the previewed G/L færslur. May contain the literal `"***"` þegar BC's preview engine masks an unassigned númer-series Gildi. Empty þegar the depreciation book does ekki post til G/L fyrir the line's FA Posting Gerð (Sjá Operational Athugasemdir). |
| `totals.balanced` | bool | `true` þegar `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. Always true þegar no G/L færslur eru produced. |
| `totals.totalDebitLCY` / `totalCreditLCY` | tugabrot | Aggregated úr the previewed G/L færslur (zero þegar no G/L integration applies). |
| `preview[]` | fylki | One element per populated bók / dagbók tafla that BC would skrifa til (`FA Ledger Entry`, `Maintenance Ledger Entry`, `G/L Entry`, `VAT Entry`, etc.). |
| `preview[].tableId` / `tableName` | int / strengur | BC tafla identification. |
| `preview[].tableCaption` | strengur | BC `RecordRef.Caption` fyrir the tafla (display Heiti). |
| `preview[].entryCount` | int | númer of færslur that would be inserted í this tafla. |
| `preview[].entries[]` | fylki | Per-færsla objects með `id` (placeholder SystemId GUID), `primaryKey` (hlutur of PK Reitur-Heiti → Gildi), og `fields` (all serialized fields). Reitur names follow the sama normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). `DocumentNo_` values inside `fields` eru commonly `"***"` þegar BC masks an unassigned númer-series. Subscribe til `OnGetPreviewFieldNames` til control which fields appear; subscribe til `OnPrecalculateFlowFields` til pre-compute FlowFields áður en serialization. |

## Dæmi (úr einingaprófum)

úr `FA Jnl. Prev. Post Tests` (codeunit 95437):
- `PreviewPost_PostableBatch_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, og that the dagbók lines eru **still present** eftir the preview (no commit).
- `PreviewPost_PostableBatch_DoesNotCreateFALedgerEntry` — verifies no `FA Ledger Entry` row er actually persisted.
- `PreviewPost_PostableBatch_ReturnsBatchContextAndPreviewArray` — verifies the batch context fields og that `preview[]` contains at least one populated tafla.

## Villur

**BC validation Villur propagate verbatim** til Kallandinn. The catch-all below er aðeins notað þegar the preview subscriber runs cleanly but produces zero captured færslur.

| Villa | Orsök |
|---|---|
| `Fixed asset journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Fixed asset journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |
| `Fixed asset journal batch {template}\|{batch} has no lines to post.` | Batch er empty. |
| `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...` | **Critical** — BC blocks the FA dagbók þegar the depreciation book has `G/L Integration - {Type} = true` fyrir that FA Posting Gerð. Sjá Operational Athugasemdir below. |
| `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` | Rare catch-all — aðeins fires þegar the BC subscriber completes án raising but writes no færslur. Run `Finance.FAJournal.Check` til enumerate the underlying validation failures. |

## Operational Athugasemdir

- **FA dagbók vs. General dagbók routing.** BC requires that FA postings með `G/L Integration` enabled on the depreciation book go through the **general dagbók**, ekki the FA dagbók. The FA dagbók preview mun fail með `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...` fyrir every line whose depreciation book has `G/L Integration - {Type} = true`. Inspect `Depreciation Book` fields `G/L Integration - Acq. Cost`, `G/L Integration - Depreciation`, `G/L Integration - Write-Down`, `G/L Integration - Appreciation`, `G/L Integration - Custom 1`, `G/L Integration - Custom 2`, `G/L Integration - Disposal`, `G/L Integration - Maintenance` áður en previewing.
- **nota `Finance.GeneralJournal.PreviewPost` fyrir G/L-integrated FA postings** — set the dagbók line `Account Type = Fixed Asset` og supply the FA-specific fields (`FA Posting Type`, `Depreciation Book Code`, `Maintenance Code` þegar applicable). That route honours the G/L Integration setup.
- **Demo data caveat.** CRONUS demo databases typically ship með **every** G/L Integration flag enabled on the Sjálfgefið depreciation book, which means none of the FA dagbók posting types getur be previewed án fyrsta switching them off (og switching them back).
- **Maintenance færslur án G/L integration** populate `Maintenance Ledger Entry` (tafla 5625) aðeins — no G/L færsla, so `totals` og `predictedDocumentNos` eru empty/zero/balanced.

## Tengdar skilaboðategundir

- `Finance.FAJournal.Check` — get the validation results that would gate the post.
- `Finance.FAJournal.Post` — commit the actual post.
- `Finance.GeneralJournal.PreviewPost` — sama pattern fyrir the general dagbók.

