---
id: finance-generaljournal-previewpost
title: "Finance.GeneralJournal.PreviewPost"
sidebar_label: "Finance.GeneralJournal.PreviewPost"
sidebar_position: 47
description: "Beiðni- og svarsamningur fyrir Finance.GeneralJournal.PreviewPost Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Simulates posting a Gen. dagbók Batch og Skilar the bók færslur that **would** be produced — án writing anything til the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow, captures the in-memory færslur via `Posting Preview Event Handler`, then enumerates every populated tafla úr `FillDocumentEntry`. hver row er serialized through `Bifrost Preview Helper` (með the `OnGetPreviewFieldNames` og `OnPrecalculateFlowFields` integration events) so consumers getur pick which fields they care about.

Skilar `rollback: true` so callers know the database was untouched. einnig pre-computes the LCY balance og the distinct G/L `Document No.` values that would appear on the register.

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
| `templateName` | strengur | Sjá above | Gen. dagbók template (Code[10]). |
| `batchName` | strengur | No | Gen. dagbók batch (Code[10]). |

### Dæmi um beiðni
```json
{ "templateName": "GENERAL", "batchName": "DEFAULT" }
```

## Uppbygging svars

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Previewed 2 lines in GENERAL|DEFAULT — 4 G/L entries, 2 VAT entries, balanced.",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedDocumentNos": ["G00042"],
  "totals": { "balanced": true, "totalDebitLCY": 500.0, "totalCreditLCY": 500.0 },
  "preview": [
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "entryCount": 4,
      "entries": [
        { "EntryNo_": 0, "GLAccountNo_": "1100", "DocumentNo_": "G00042", "Amount": 500.0, "AmountLCY": 500.0 }
      ]
    },
    {
      "tableId": 254,
      "tableName": "VAT Entry",
      "entryCount": 2,
      "entries": [ ]
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
| `predictedDocumentNos` | strengur[] | Distinct `Document No.` values across the previewed G/L færslur. The actual skjal numbers BC would assign — useful þegar a No. Series er configured. |
| `totals.balanced` | bool | `true` þegar `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. |
| `totals.totalDebitLCY` / `totalCreditLCY` | tugabrot | Aggregated úr the previewed G/L færslur. |
| `preview[]` | fylki | One element per populated bók / dagbók tafla that BC would skrifa til (G/L færsla, VAT færsla, Cust. bók færsla, birgi bók færsla, Bank Account bók færsla, FA bók færsla, Employee bók færsla, etc.). |
| `preview[].tableId` / `tableName` | int / strengur | BC tafla identification. |
| `preview[].entryCount` | int | númer of færslur that would be inserted í this tafla. |
| `preview[].entries[]` | fylki | Reitur values. Reitur names follow the sama normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). Subscribe til `OnGetPreviewFieldNames` til control which fields appear; subscribe til `OnPrecalculateFlowFields` til pre-compute FlowFields áður en serialization. |

## Dæmi (úr einingaprófum)

úr `Gen. Jnl. Prev. Post Tests` (codeunit 95389):
- `PreviewPost_BalancedBatch_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, `totals.balanced: true`, og that the dagbók lines eru **still present** eftir the preview (no commit).
- `PreviewPost_BalancedBatch_DoesNotCreateGLRegister` — verifies no `G/L Register` row er created (the preview er in-memory aðeins).
- `PreviewPost_BalancedBatch_ReturnsBatchContextAndPreviewArray` — verifies the batch context fields (`templateName`, `batchName`, `linesToPost`) og that `preview[]` contains a populated `G/L Entry` element.

## Villur

| Villa | Orsök |
|---|---|
| `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |
| `Journal batch {template}\|{batch} has no lines to post.` | Batch er empty. |
| `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` | The BC posting engine raised during preview — usually means the sama Villa would occur during a real post. Run `Finance.GeneralJournal.Check` til enumerate the underlying validation failures. |

## Tengdar skilaboðategundir

- `Finance.GeneralJournal.Check` — get the validation results that would gate the post.
- `Finance.GeneralJournal.Post` — commit the actual post.
- `Finance.GeneralJournal.ReverseRegister` — undo a register eftir a real post.

