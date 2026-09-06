---
id: projects
title: "Projects message types"
sidebar_position: 7
---

This document describes the Projects-related message types in Bifröst Foundation. These operate on BC's Job Journal tables under the new "Projects" namespace.

## Overview

Projects message types provide functionality for working with project (job) journals, including line setup, validation and posting.

## Message Type List

| Message Type | Direction | Purpose |
|--------------|-----------|---------|
| [Projects.ProjectJournal.SetupNewLine](#projectsprojectjournalsetupnewline) | Inbound | Creates a new project journal line with defaults |
| [Projects.ProjectJournal.Check](#projectsprojectjournalcheck) | Outbound | Validates a project journal batch and returns readiness status |
| [Projects.ProjectJournal.Post](#projectsprojectjournalpost) | Inbound | Posts a project journal batch and returns posting statistics |
| [Projects.ProjectJournal.PreviewPost](#projectsprojectjournalpreviewpost) | Inbound | Simulates posting a project journal batch and returns predicted ledger entries (rolled back) |

---

## Projects.ProjectJournal.SetupNewLine

**Direction**: Inbound (creates a new journal line)

**Purpose**: Creates and inserts a new project (job) journal line in the specified batch, pre-populated with defaults from BC's `SetUpNewLine` procedure. This is the default way to prepare a project journal line before populating business fields via `Data.Records.Set`.

Default values inherited from the template and batch include Posting Date, Document No. (when a No. Series is configured), and template-driven fields. The line is assigned the next available Line No. (last line + 10000, or 10000 if the batch is empty).

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Projects.ProjectJournal.SetupNewLine",
  "source": "MyIntegrationApp v1.0",
  "subject": "PROJECT|DEFAULT",
  "id": "c3d4e5f6-7890-12cd-ef34-567890abcdef",
  "time": "2026-04-15T10:00:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Journal Batch Identification

1. **Pipe-separated in subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId in subject**: `"subject": "guid-without-braces"`
3. **JSON data parameters**:
```json
{
  "data": {
    "templateName": "PROJECT",
    "batchName": "DEFAULT"
  }
}
```

JSON data parameters take precedence over the subject field.

#### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fieldNumbers` | int[] | all fields | Field numbers to include in response |
| `noOfLines` | integer | 1 | Number of lines to create (1–100) |
| `clearExistingLines` | boolean | false | When true, deletes all existing lines in the batch first |

### Response Format

Uses the `Data.Records.Get` response shape.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
      "primaryKey": {
        "JournalTemplateName": "PROJECT",
        "JournalBatchName": "DEFAULT",
        "LineNo_": 10000
      },
      "fields": {
        "PostingDate": "2026-04-15",
        "DocumentNo_": "PJ-00001",
        "Type": "Resource",
        "..."
      }
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "Success" or "Error" |
| `noOfRecords` | integer | Number of lines created |
| `result[].id` | string | SystemId of the new journal line |
| `result[].primaryKey` | object | `JournalTemplateName`, `JournalBatchName`, `LineNo_` |
| `result[].fields` | object | All non-PK fields (or only those in `fieldNumbers`) |

### Typical Workflow

1. Call `Projects.ProjectJournal.SetupNewLine` to create one or more lines with defaults.
2. Use the returned `id` with `Data.Records.Set` to populate Project No., Quantity, Unit Cost, etc.
3. Call `Projects.ProjectJournal.Check` to validate.
4. Call `Projects.ProjectJournal.Post` to post.

### Error Handling

| Error | Cause |
|-------|-------|
| Missing identification | No template/batch, SystemId, or pipe-separated subject provided |
| Batch not found | The specified batch does not exist |

### Related Message Types

- [Projects.ProjectJournal.Check](#projectsprojectjournalcheck)
- [Projects.ProjectJournal.Post](#projectsprojectjournalpost)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)

---

## Projects.ProjectJournal.Check

**Direction**: Outbound (validation only)

**Purpose**: Validates a project journal batch without posting. Returns readiness status with detailed validation results.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Projects.ProjectJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "PROJECT|DEFAULT",
  "data": {}
}
```

Identification follows the same three-method pattern.

### Response Format

#### Ready
```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "PROJECT",
  "batchName": "DEFAULT",
  "batchDescription": "Default Project Batch",
  "lineCount": 2,
  "totalQuantity": 10.0,
  "totalLineAmount": 5000.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

#### ReadyWithWarnings / NotReady

Same shape as Ready but with `validationResult` set accordingly and populated `errors` / `warnings` arrays.

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "Success" for validation |
| `validationResult` | string | "Ready", "ReadyWithWarnings", or "NotReady" |
| `templateName` | string | Journal template name |
| `batchName` | string | Journal batch name |
| `batchDescription` | string | Journal batch description |
| `lineCount` | integer | Number of journal lines in batch |
| `totalQuantity` | decimal | Sum of Quantity on all lines |
| `totalLineAmount` | decimal | Sum of Line Amount on all lines |
| `errorCount` | integer | Number of blocking errors |
| `warningCount` | integer | Number of non-blocking warnings |
| `errors` | array | Error messages (prevent posting) |
| `warnings` | array | Warning messages (posting allowed) |

### Validation Rules

Uses BC's "Job Jnl.-Check Line" codeunit via the Error Message Management framework to collect all errors in a single pass.

**Per-Line Validation includes:**
- Required fields (Posting Date, Document No., Project No., Quantity ≠ 0)
- Posting period
- Projects: Must exist, status must allow posting
- Resources/Items/G-L accounts depending on Type
- Dimensions: Required dimensions must be present and valid

**Additional Warnings (non-blocking):**
- Future posting dates generate warnings

### Error Handling

| Error | Cause |
|-------|-------|
| Missing identification | No subject or data parameters provided |
| Batch not found | Template/batch combination does not exist |

### Notes

- **Non-Destructive**: Does NOT modify any data
- Collects all validation errors, not just the first

### Related Message Types

- [Projects.ProjectJournal.SetupNewLine](#projectsprojectjournalsetupnewline)
- [Projects.ProjectJournal.Post](#projectsprojectjournalpost)
- [Help.Tables.Get](/foundation/message-types/metadata/#helptablesget)

---

## Projects.ProjectJournal.Post

**Direction**: Inbound (modifies data — posts journal and clears lines)

**Purpose**: Posts a validated project journal batch to create Job Ledger Entries.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Projects.ProjectJournal.Post",
  "source": "MyIntegrationApp v1.0",
  "subject": "PROJECT|BATCH001",
  "data": {}
}
```

Identification follows the same three-method pattern.

### Response Format

#### Success
```json
{
  "status": "Success",
  "templateName": "PROJECT",
  "batchName": "BATCH001",
  "batchDescription": "Default Project Batch",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 10.0,
  "totalLineAmount": 5000.0,
  "jobRegisterNo": 17,
  "jobRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 501,
  "toEntryNo": 502
}
```

#### Error
```json
{
  "status": "Error",
  "error": "Error message text",
  "callstack": "Full error callstack from posting"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "Success" or "Error" |
| `templateName` | string | Journal template name |
| `batchName` | string | Journal batch name |
| `batchDescription` | string | Journal batch description |
| `linesPosted` | integer | Number of journal lines posted |
| `postingDate` | string | Posting date (ISO format) |
| `totalQuantity` | decimal | Total Quantity posted |
| `totalLineAmount` | decimal | Total Line Amount posted |
| `jobRegisterNo` | integer | Job Register number created (when register was produced) |
| `jobRegisterId` | string | Job Register SystemId (GUID without braces) |
| `fromEntryNo` | integer | First Job Ledger Entry No. in register |
| `toEntryNo` | integer | Last Job Ledger Entry No. in register |
| `error` | string | Error message (only on Error status) |
| `callstack` | string | Error callstack (only on Error status) |

### Error Handling

**Common errors:**
- Journal batch not found
- No lines to post
- Posting validation errors
- Missing journal batch identification

### Notes

- Uses BC's "Job Jnl.-Post Batch" codeunit for posting
- All journal lines are cleared from the batch after successful posting
- Posting is wrapped in an isolated codeunit so errors return a structured response with `callstack`
- Note: although the namespace is `Projects`, the underlying BC tables remain `Job Journal Batch`, `Job Journal Line`, `Job Register`, and `Job Ledger Entry`

**Recommended approach:** Validate with `Projects.ProjectJournal.Check` first, then post with `Projects.ProjectJournal.Post`.

### Related Message Types

- [Projects.ProjectJournal.SetupNewLine](#projectsprojectjournalsetupnewline)
- [Projects.ProjectJournal.Check](#projectsprojectjournalcheck)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)

---

## Projects.ProjectJournal.PreviewPost

**Direction**: Inbound (simulates posting; no data modification)

**Purpose**: Simulates posting a Project (Job) Journal batch and returns the ledger entries that **would** be produced — without writing anything to the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `Job Jnl.-Post` subscriber. Typical previewed tables include `Job Ledger Entry` (table 169, `tableCaption "Project Ledger Entry"` from BC v25 rename) and — when the line is `Type = Resource` — `Res. Ledger Entry` (table 203). G/L impact appears for Billable / Both Budget and Billable lines and for Item consumption.

### Input Parameters

Project journal batch identification (first matched wins):

| Method | Subject field | Data field |
|--------|---------------|------------|
| Pipe-separated names | `TEMPLATE\|BATCH` | — |
| SystemId GUID | `<guid>` (no braces) | — |
| Template + batch names | — | `templateName` + `batchName` |

### Response Format

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting project journal batch PROJECT|DEFAULT (1 line, Resource) would create 2 ledger entries across 2 tables. No G/L impact.",
  "templateName": "PROJECT",
  "batchName": "DEFAULT",
  "batchDescription": "Default Project Batch",
  "linesToPost": 1,
  "postingDate": "2026-04-15",
  "lcyCode": "ISK",
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
            "JobNo_": "FORÐI3",
            "Type": "Resource",
            "No_": "OLOF.J",
            "Quantity": "4",
            "LineType": "Budget",
            "DimensionSetID": [
              { "DimensionCode": "DEPARTMENT", "DimensionValueCode": "PROD" },
              { "DimensionCode": "PROJECT", "DimensionValueCode": "TOOLKIT" }
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
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "ResourceNo_": "OLOF.J", "Quantity": "4", "EntryType": "Usage" }
        }
      ]
    }
  ]
}
```

### Response Fields

Same envelope as `Inventory.ItemJournal.PreviewPost` (`rollback`, `summary`, `totals`, `preview[]` with `tableCaption` + per-entry `id`/`primaryKey`/`fields`). Project-specific notes:

| Field | Description |
|-------|-------------|
| `preview[].tableName` vs `tableCaption` | The BC table is still called `Job Ledger Entry` (169) internally; `tableCaption` returns the BC v25 display name `"Project Ledger Entry"`. |
| `fields.DimensionSetID` | Returned as an **array** of `{ DimensionCode, DimensionValueCode }` objects (not the raw integer ID). |
| `predictedDocumentNos` / `totals` | Empty / zero for Resource Usage lines (no G/L impact). Populated when the line type produces G/L entries (Billable, Both Budget and Billable, Item consumption). |

### Operational Notes

- **`Line Type` must be set.** A blank `Line Type` triggers a BC CONFIRM dialog from `Job Link Usage` (codeunit 1026) that headless callers cannot answer. Always set `Line Type ∈ {Schedule, Budget, Billable, Both Budget and Billable}` before previewing.
- **Resource Usage alone produces no G/L impact** — you will see only `Job Ledger Entry` and `Res. Ledger Entry`. To see G/L Entries in the preview, set `Line Type = Billable` (or `Both Budget and Billable`).
- The underlying BC tables remain `Job Journal Batch`, `Job Journal Line`, `Job Register`, and `Job Ledger Entry` even though the message namespace is `Projects`.
- The preview rolls back, but does not undo metadata changes made before the call.

### Errors

BC validation errors propagate verbatim. Common errors:
- `Project journal batch must be identified via subject (TEMPLATE|BATCH or SystemId) or data parameters (templateName, batchName).`
- `Project journal batch {template}|{batch} not found.`
- `Project journal batch {template}|{batch} has no lines to post.`
- `Do you want to allow usage on Project Task lines of type Posting only?` (CONFIRM dialog) — triggered when `Line Type` is blank. Set `Line Type` to a non-blank value on every line before previewing.
- `Posting preview failed and no entries were captured. The project journal cannot be posted in its current state.` — rare catch-all.

### Related Message Types

- [Projects.ProjectJournal.Check](#projectsprojectjournalcheck) - Validate without simulating the post.
- [Projects.ProjectJournal.Post](#projectsprojectjournalpost) - Actually post.
- [Finance.GeneralJournal.PreviewPost](/foundation/message-types/finance/#financegeneraljournalpreviewpost) - Same pattern for the general journal.

---

## Implementation Details

### Object IDs

| Object Type | Object ID | Object Name |
|-------------|-----------|-------------|
| Enum Value | 10078091 | Projects.ProjectJournal.SetupNewLine |
| Implementation Codeunit | 10078178 | Proj. Jnl. SetupLine Impl ori |
| Help Codeunit | 10078017 | Proj. Jnl. SetupLine Help ori |
| Enum Value | 10078092 | Projects.ProjectJournal.Check |
| Implementation Codeunit | 10078179 | Project Journal Check Impl ori |
| Help Codeunit | 10078018 | Project Journal Check Help ori |
| Enum Value | 10078093 | Projects.ProjectJournal.Post |
| Implementation Codeunit | 10078180 | Project Journal Post Impl ori |
| Help Codeunit | 10078019 | Project Journal Post Help ori |
| Enum Value | 10078125 | Projects.ProjectJournal.PreviewPost |
| Implementation Codeunit | 10078177 | Proj. Jnl. Prev. Post Impl ori |
| Help Codeunit | 10078016 | Proj. Jnl. Prev. Post Help ori |

### File Locations

```
app/src/Message Type/
  Implementations/Projects/
    ProjectJnlSetupLineImpl.Codeunit.al
    ProjectJournalCheckImpl.Codeunit.al
    ProjectJournalPostImpl.Codeunit.al
    ProjectJnlPreviewPostImpl.Codeunit.al
  Help/Projects/
    ProjectJnlSetupLineHelp.Codeunit.al
    ProjectJournalCheckHelp.Codeunit.al
    ProjectJournalPostHelp.Codeunit.al
    ProjectJnlPreviewPostHelp.Codeunit.al
```
