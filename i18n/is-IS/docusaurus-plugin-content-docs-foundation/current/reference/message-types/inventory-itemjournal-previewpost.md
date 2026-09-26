---
id: inventory-itemjournal-previewpost
title: "Inventory.ItemJournal.PreviewPost"
sidebar_label: "Inventory.ItemJournal.PreviewPost"
sidebar_position: 86
description: "Beiðni- og svarsamningur fyrir Inventory.ItemJournal.PreviewPost Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Simulates posting an vöru dagbók Batch og Skilar the bók færslur that **would** be produced — án writing anything til the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `Item Jnl.-Post` subscriber, captures the in-memory færslur via `Posting Preview Event Handler`, then enumerates every populated tafla úr `FillDocumentEntry`. Typical previewed töflur include `Item Ledger Entry`, `Value Entry`, og (fyrir journals that generate G/L impact) `G/L Entry` og `VAT Entry`. hver row er serialized through `Bifrost Preview Helper` so consumers getur pick which fields they care about.

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
| `templateName` | strengur | Sjá above | vöru dagbók template (Code[10]). |
| `batchName` | strengur | No | vöru dagbók batch (Code[10]). |

### Dæmi um beiðni
```json
{ "templateName": "ITEM", "batchName": "DEFAULT" }
```

## Uppbygging svars

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting item journal batch ITEM|DEFAULT (2 lines) would create 4 ledger entries across 2 tables. G/L impact is balanced.",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedDocumentNos": ["T00042"],
  "totals": { "balanced": true, "totalDebitLCY": 254500.0, "totalCreditLCY": 254500.0 },
  "preview": [
    {
      "tableId": 32,
      "tableName": "Item Ledger Entry",
      "tableCaption": "Item Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "ItemNo_": "1000", "DocumentNo_": "***", "Quantity": "10", "LocationCode": "MAIN" }
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
| `predictedDocumentNos` | strengur[] | Distinct `Document No.` values across the previewed G/L færslur. May contain the literal `"***"` þegar BC's preview engine masks an unassigned númer-series Gildi. Empty þegar the dagbók does ekki produce G/L impact. |
| `totals.balanced` | bool | `true` þegar `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. Always true þegar no G/L færslur eru produced. |
| `totals.totalDebitLCY` / `totalCreditLCY` | tugabrot | Aggregated úr the previewed G/L færslur (zero þegar none). |
| `preview[]` | fylki | One element per populated bók / dagbók tafla that BC would skrifa til (`Item Ledger Entry`, `Value Entry`, `G/L Entry`, `VAT Entry`, etc.). |
| `preview[].tableId` / `tableName` | int / strengur | BC tafla identification. |
| `preview[].tableCaption` | strengur | BC `RecordRef.Caption` fyrir the tafla (display Heiti, may differ úr `tableName` eftir BC renames — e.g. `Job Ledger Entry` → `Project Ledger Entry`). |
| `preview[].entryCount` | int | númer of færslur that would be inserted í this tafla. |
| `preview[].entries[]` | fylki | Per-færsla objects með `id` (placeholder SystemId GUID — never persisted because the preview rolls back), `primaryKey` (hlutur of PK Reitur-Heiti → Gildi), og `fields` (all serialized fields). Reitur names follow the sama normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). `DocumentNo_` values inside `fields` eru commonly `"***"` þegar BC masks an unassigned númer-series. Subscribe til `OnGetPreviewFieldNames` til control which fields appear; subscribe til `OnPrecalculateFlowFields` til pre-compute FlowFields áður en serialization. |

## Dæmi (úr einingaprófum)

úr `Item Jnl. Prev. Post Tests` (codeunit 95436):
- `PreviewPost_PostableBatch_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, og that the dagbók lines eru **still present** eftir the preview (no commit).
- `PreviewPost_PostableBatch_DoesNotCreateItemLedgerEntry` — verifies that no `Item Ledger Entry` row er actually persisted (the preview er in-memory aðeins).
- `PreviewPost_PostableBatch_ReturnsBatchContextAndPreviewArray` — verifies the batch context fields (`templateName`, `batchName`, `linesToPost`) og that `preview[]` contains at least one populated tafla.

## Villur

**BC validation Villur propagate verbatim** til Kallandinn — most failures surface með the underlying BC message (e.g. vantar posting groups, ógilt vöru, blocked location). The catch-all below er aðeins notað þegar the preview subscriber runs cleanly but produces zero captured færslur.

| Villa | Orsök |
|---|---|
| `Item journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Item journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |
| `Item journal batch {template}\|{batch} has no lines to post.` | Batch er empty. |
| `Gen. Prod. Posting Group must have a value in Item Journal Line: ...` | Standard BC validation — the line er vantar posting groups. Common þegar the line was inserted via OData/MCP `set_records` (which does **ekki** run OnValidate), so derived fields like `Gen. Prod. Posting Group`, `Inventory Posting Group`, `Location Code` verður að be supplied skýrt. |
| `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` | Rare catch-all — aðeins fires þegar the BC subscriber completes án raising but writes no færslur. Run `Inventory.ItemJournal.Check` til enumerate the underlying validation failures. |

## Operational Athugasemdir

- **Insert lines via the BC client þegar possible** — the AL `Insert(true)` og OnValidate triggers populate derived fields (posting groups, location, costing method) automatically. þegar inserting via OData/MCP `set_records`, supply every Reitur BC needs til post; `set_records` does ekki call OnValidate.
- The preview rolls back, but it does **ekki** roll back metadata changes made áður en the call (e.g. updated batch headers). aðeins the captured bók inserts eru discarded.

## Tengdar skilaboðategundir

- `Inventory.ItemJournal.Check` — get the validation results that would gate the post.
- `Inventory.ItemJournal.Post` — commit the actual post.
- `Finance.GeneralJournal.PreviewPost` — sama pattern fyrir the general dagbók.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

