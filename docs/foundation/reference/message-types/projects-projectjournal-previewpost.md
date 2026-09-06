---
id: projects-projectjournal-previewpost
title: "Projects.ProjectJournal.PreviewPost"
sidebar_label: "Projects.ProjectJournal.PreviewPost"
sidebar_position: 106
description: "Request and response contract for the Projects.ProjectJournal.PreviewPost Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Simulates posting a project (job) journal batch and returns the ledger entries that **would** be produced — without writing anything to the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `Job Jnl.-Post` subscriber, captures the in-memory entries via `Posting Preview Event Handler`, then enumerates every populated table from `FillDocumentEntry`. Typical previewed tables include `Job Ledger Entry`, `Item Ledger Entry`, `Value Entry`, and (when the line affects G/L) `G/L Entry` and `VAT Entry`. Each row is serialized through `Bifrost Preview Helper` so consumers can pick which fields they care about.

Returns `rollback: true` so callers know the database was untouched. Also pre-computes the LCY balance (from any captured G/L entries) and the distinct G/L `Document No.` values that would appear on the register.

**Direction**: Inbound (read-only — all changes rolled back)  **Content-Type**: `text/markdown`

Response is wrapped as a markdown document around a fenced ```json``` block so it renders inline in chat clients; the JSON inside is the structured payload below.

## Batch Identification Order

First match wins:
1. `data.templateName` (+ optional `data.batchName`).
2. `subject` envelope attribute is a GUID → batch SystemId.
3. `subject` envelope attribute contains a `|` → `TEMPLATE|BATCH`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `templateName` | string | See above | Project journal template (Code[10]). |
| `batchName` | string | No | Project journal batch (Code[10]). |

### Request Example
```json
{ "templateName": "JOB", "batchName": "DEFAULT" }
```

## Response Shape

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

### Response Fields

| Field | Type | Notes |
|---|---|---|
| `rollback` | bool | Always `true` for this message type. |
| `summary` | string | One-line human-readable recap. |
| `linesToPost` | int | Journal lines fed into the preview. |
| `postingDate` | string | `Posting Date` of the first line. |
| `lcyCode` | string | `GLSetup."LCY Code"`. |
| `batchDescription` | string | The batch's `Description` field. May be empty when the batch has no description. |
| `predictedDocumentNos` | string[] | Distinct `Document No.` values across the previewed G/L entries. May contain the literal `"***"` when BC's preview engine masks an unassigned number-series value. Empty when the line does not produce G/L impact (e.g. Resource Usage without billing). |
| `totals.balanced` | bool | `true` when `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. Always true when no G/L entries are produced. |
| `totals.totalDebitLCY` / `totalCreditLCY` | decimal | Aggregated from the previewed G/L entries (zero when none). |
| `preview[]` | array | One element per populated ledger / journal table that BC would write to. For Resource lines: `Job Ledger Entry` (169) + `Res. Ledger Entry` (203). For Item lines: `Job Ledger Entry` + `Item Ledger Entry` (32) + `Value Entry` (5802). Billable usage may also produce `G/L Entry` (17) + `VAT Entry` (254). |
| `preview[].tableId` / `tableName` | int / string | BC table identification. |
| `preview[].tableCaption` | string | BC `RecordRef.Caption` for the table. For Job Ledger Entry this is `Project Ledger Entry` (BC v25 rename). |
| `preview[].entryCount` | int | Number of entries that would be inserted into this table. |
| `preview[].entries[]` | array | Per-entry objects with `id` (placeholder SystemId GUID), `primaryKey` (object of PK field-name → value), and `fields` (all serialized fields). Field names follow the same normalization as `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, strip remaining non-alphanumerics). `DocumentNo_` values inside `fields` are commonly `"***"` when BC masks an unassigned number-series. `DimensionSetID` is expanded to an **array** of `{ "DimensionCode": "...", "DimensionValueCode": "..." }` objects (NOT the raw integer set id). Subscribe to `OnGetPreviewFieldNames` to control which fields appear; subscribe to `OnPrecalculateFlowFields` to pre-compute FlowFields before serialization. |

## Examples (from unit tests)

From `Project Jnl. Prev. Post Tests` (codeunit 95438):
- `PreviewPost_PostableBatch_ReturnsSuccessAndRollback` — verifies `status: "Success"`, `rollback: true`, and that the journal lines are **still present** after the preview (no commit).
- `PreviewPost_PostableBatch_DoesNotCreateJobLedgerEntry` — verifies no `Job Ledger Entry` row is actually persisted.
- `PreviewPost_PostableBatch_ReturnsBatchContextAndPreviewArray` — verifies the batch context fields and that `preview[]` contains at least one populated table.

## Errors

**BC validation errors propagate verbatim** to the caller. BC may also raise CONFIRM dialogs at post time (see Operational Notes) which surface as errors because headless callers cannot answer them.

| Error | Cause |
|---|---|
| `Project journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification was supplied. |
| `Project journal batch {template}\|{batch} not found.` | Identification did not match an existing batch. |
| `Project journal batch {template}\|{batch} has no lines to post.` | Batch is empty. |
| `Microsoft Dynamics 365 Business Central Data Services attempted to issue a client callback to show a confirmation dialog box: Usage will not be linked to the project planning line because the Line Type field is empty. Do you want to continue? (CodeUnit 1026 Job Link Usage). Client callbacks are not supported on Microsoft Dynamics 365 Business Central Data Services.` | **Critical** — the line has `Line Type = " "` (blank). BC raises a CONFIRM dialog at post time which headless callers cannot answer. Set `Line Type` to `Schedule`, `Budget`, `Billable`, or `Both Budget and Billable` before previewing. |
| `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` | Rare catch-all — only fires when the BC subscriber completes without raising but writes no entries. Run `Projects.ProjectJournal.Check` to enumerate the underlying validation failures. |

## Operational Notes

- **`Line Type` must be non-blank for headless previews.** BC's `Job Link Usage` (codeunit 1026) raises a CONFIRM dialog when `Line Type = " "`. Headless callers (MCP, scheduled task, web service) cannot answer it, so the preview errors out. Allowed values: `Schedule`, `Budget`, `Billable`, `Both Budget and Billable`.
- **Resource Usage alone produces no G/L impact.** A pure `EntryType = Usage` resource line writes only `Job Ledger Entry` + `Res. Ledger Entry`; G/L is touched only when the line is billable and produces a customer/invoice posting. Expect `totals` and `predictedDocumentNos` to be empty for usage-only previews.
- **`DimensionSetID` is expanded** to an array of `{ DimensionCode, DimensionValueCode }` rather than the raw integer set id (this also applies on read/write through `Data.Records.Get` and `Data.Records.Set`).

## Related Message Types

- `Projects.ProjectJournal.Check` — get the validation results that would gate the post.
- `Projects.ProjectJournal.Post` — commit the actual post.
- `Finance.GeneralJournal.PreviewPost` — same pattern for the general journal.

