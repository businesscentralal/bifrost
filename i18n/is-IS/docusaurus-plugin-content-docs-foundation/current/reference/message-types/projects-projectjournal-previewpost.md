---
id: projects-projectjournal-previewpost
title: "Projects.ProjectJournal.PreviewPost"
sidebar_label: "Projects.ProjectJournal.PreviewPost"
sidebar_position: 106
description: "Beiðni- og svarsamningur fyrir Projects.ProjectJournal.PreviewPost Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Simulates posting a project (job) dagbók batch og Skilar the bók færslur that **would** be produced — án writing anything til the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `Job Jnl.-Post` subscriber, captures the in-memory færslur via `Posting Preview Event Handler`, then enumerates every populated tafla úr `FillDocumentEntry`. Typical previewed töflur include `Job Ledger Entry`, `Item Ledger Entry`, `Value Entry`, og (þegar the line affects G/L) `G/L Entry` og `VAT Entry`. hver row er serialized through `Bifrost Preview Helper` so consumers getur pick which fields they care about.

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
| `templateName` | strengur | Sjá above | Project dagbók template (Code[10]). |
| `batchName` | strengur | No | Project dagbók batch (Code[10]). |

### Dæmi um beiðni
```json
{ "templateName": "JOB", "batchName": "DEFAULT" }
```

## Uppbygging svars

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting project journal batch JOB|DEFAULT (1 lines) would create 1 ledger entries across 1 tables. G/L impact is balanced.",
  "templateName": "JOB",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 1,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedDocumentNos": [],
  "totals": { "balanced": true, "totalDebitLCY": 0.0, "totalCreditLCY": 0.0 },
  "preview": [
    {
      "tableId": 169,
      "tableName": "Job Ledger Entry",
      "tableCaption": "Project Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": {
            "JobNo_": "J0001", "JobTaskNo_": "110", "DocumentNo_": "***",
            "Type": "Resource", "No_": "RES01", "Quantity": "2", "TotalCost": "16800",
            "EntryType": "Usage", "LedgerEntryType": "Resource",
            "DimensionSetID": [
              { "DimensionCode": "AREA", "DimensionValueCode": "30" },
              { "DimensionCode": "CUSTOMERGROUP", "DimensionValueCode": "M" }
            ]
          }
        }
      ]
    },
    {
      "tableId": 203,
      "tableName": "Res. Ledger Entry",
      "tableCaption": "Res. Ledger Entry",
      "entryCount": 1,
      "entries": []
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
| `predictedDocumentNos` | strengur[] | Distinct `Document No.` values across the previewed G/L færslur. May contain the literal `"***"` þegar BC's preview engine masks an unassigned númer-series Gildi. Empty þegar the line does ekki produce G/L impact (e.g. Resource Usage án billing). |
| `totals.balanced` | bool | `true` þegar `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. Always true þegar no G/L færslur eru produced. |
| `totals.totalDebitLCY` / `totalCreditLCY` | tugabrot | Aggregated úr the previewed G/L færslur (zero þegar none). |
| `preview[]` | fylki | One element per populated bók / dagbók tafla that BC would skrifa til. fyrir Resource lines: `Job Ledger Entry` (169) + `Res. Ledger Entry` (203). fyrir vöru lines: `Job Ledger Entry` + `Item Ledger Entry` (32) + `Value Entry` (5802). Billable usage may einnig produce `G/L Entry` (17) + `VAT Entry` (254). |
| `preview[].tableId` / `tableName` | int / strengur | BC tafla identification. |
| `preview[].tableCaption` | strengur | BC `RecordRef.Caption` fyrir the tafla. fyrir Job bók færsla this er `Project Ledger Entry` (BC v25 rename). |
| `preview[].entryCount` | int | númer of færslur that would be inserted í this tafla. |
| `preview[].entries[]` | fylki | Per-færsla objects með `id` (placeholder SystemId GUID), `primaryKey` (hlutur of PK Reitur-Heiti → Gildi), og `fields` (all serialized fields). Reitur names follow the sama normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). `DocumentNo_` values inside `fields` eru commonly `"***"` þegar BC masks an unassigned númer-series. `DimensionSetID` er expanded til an **fylki** of `{ "DimensionCode": "...", "DimensionValueCode": "..." }` objects (ekki the raw heiltala set id). Subscribe til `OnGetPreviewFieldNames` til control which fields appear; subscribe til `OnPrecalculateFlowFields` til pre-compute FlowFields áður en serialization. |

## Dæmi (úr einingaprófum)

úr `Project Jnl. Prev. Post Tests` (codeunit 95438):
- `PreviewPost_PostableBatch_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, og that the dagbók lines eru **still present** eftir the preview (no commit).
- `PreviewPost_PostableBatch_DoesNotCreateJobLedgerEntry` — verifies no `Job Ledger Entry` row er actually persisted.
- `PreviewPost_PostableBatch_ReturnsBatchContextAndPreviewArray` — verifies the batch context fields og that `preview[]` contains at least one populated tafla.

## Villur

**BC validation Villur propagate verbatim** til Kallandinn. BC may einnig raise CONFIRM dialogs at post time (Sjá Operational Athugasemdir) which surface as Villur because headless callers getur ekki answer them.

| Villa | Orsök |
|---|---|
| `Project journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Project journal batch {template}\|{batch} not found.` | Identification did ekki match an fyrirliggjandi batch. |
| `Project journal batch {template}\|{batch} has no lines to post.` | Batch er empty. |
| `Microsoft Dynamics 365 Business Central Data Services attempted to issue a client callback to show a confirmation dialog box: Usage will not be linked to the project planning line because the Line Type field is empty. Do you want to continue? (CodeUnit 1026 Job Link Usage). Client callbacks are not supported on Microsoft Dynamics 365 Business Central Data Services.` | **Critical** — the line has `Line Type = " "` (blank). BC raises a CONFIRM dialog at post time which headless callers getur ekki answer. Set `Line Type` til `Budget`, `Billable`, eða `Both Budget and Billable` áður en previewing (BC `Job Line Type` enum; blank er ógilt fyrir headless). Option captions eru localized — e.g. Icelandic (LCID 1039) shows Billable as `Reikningshæft`. |
| `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` | Rare catch-all — aðeins fires þegar the BC subscriber completes án raising but writes no færslur. Run `Projects.ProjectJournal.Check` til enumerate the underlying validation failures. |

## Operational Athugasemdir

- **`Line Type` verður að be non-blank fyrir headless previews.** BC's `Job Link Usage` (codeunit 1026) raises a CONFIRM dialog þegar `Line Type = " "`. Headless callers (MCP, scheduled task, web service) getur ekki answer it, so the preview Villur out. Allowed non-blank values (BC `Job Line Type` enum names): `Budget`, `Billable`, `Both Budget and Billable`. Captions eru localized — e.g. Billable appears as `Reikningshæft` on LCID 1039.
- **Resource Usage alone produces no G/L impact.** A pure `EntryType = Usage` resource line writes aðeins `Job Ledger Entry` + `Res. Ledger Entry`; G/L er touched aðeins þegar the line er billable og produces a viðskiptamanni/reikningur posting. Expect `totals` og `predictedDocumentNos` til be empty fyrir usage-aðeins previews.
- **`DimensionSetID` er expanded** til an fylki of `{ DimensionCode, DimensionValueCode }` rather than the raw heiltala set id (this einnig applies on lesa/skrifa through `Data.Records.Get` og `Data.Records.Set`).

## Tengdar skilaboðategundir

- `Projects.ProjectJournal.Check` — get the validation results that would gate the post.
- `Projects.ProjectJournal.Post` — commit the actual post.
- `Finance.GeneralJournal.PreviewPost` — sama pattern fyrir the general dagbók.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

