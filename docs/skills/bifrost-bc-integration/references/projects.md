---
id: projects
title: "Projects and resources"
sidebar_label: "Projects and resources"
sidebar_position: 14
description: "The project (job) journal and the resource journal: preparing a line, checking it, posting it and previewing the posting."
---

The project (job) journal and the resource journal: preparing a line, checking it, posting it and previewing the posting.

[← back to SKILL.md](../index.md) · originally sections 7.5d, 7.5e of the single-file skill.

---

### 7.5d PROJECT JOURNAL OPERATIONS

**Identification:** Same three modes (pipe-form, SystemId, JSON `{templateName, batchName}` with JSON precedence). Targets BC Job Journal Lines (project = job in BC terminology).

**Workflow:** `Projects.ProjectJournal.Create` (with `lines`) → `Projects.ProjectJournal.Check` → `Projects.ProjectJournal.Post`.

#### `Projects.ProjectJournal.Create` — add lines to a batch

Direction: **Inbound** (creates records). `subject` = `TEMPLATE|BATCH` or the batch SystemId, or `templateName`/`batchName` in `data`. The batch must exist; it is never created.

Send the lines with their values in `lines` (at most 200). Every line is checked before anything is inserted and every problem is reported in one answer (`code: InvalidLine`, one `errors[]` entry per problem with `parameter` `lines[n].<field>`), so nothing is created when one line is wrong. Required on each line: jobNo, jobTaskNo, type, no, quantity. A field you leave out keeps its BC default.

```json
{ "specversion": "1.0", "type": "Projects.ProjectJournal.Create", "source": "MyApp", "subject": "PROJECT|DEFAULT",
  "data": { "lines": [
    { "jobNo": "JOB00010", "jobTaskNo": "1000", "type": "Resource", "no": "LINDA", "quantity": 2 }
  ] } }
```

Without `lines`, `noOfLines` (1-100, default 1) inserts blank lines with the BC defaults. `clearExistingLines: true` deletes every line in the batch first and is destructive. The response lists the inserted lines in the `Data.Records.Get` shape.

Full contract: [Projects.ProjectJournal.Create](https://businesscentralal.github.io/bifrost/en-us/foundation/reference/message-types/projects-projectjournal-create/).


#### `Projects.ProjectJournal.Check`

Response includes: `status`, `validationResult`, `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalQuantity`, `totalLineAmount`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Projects.ProjectJournal.Post`

Posts via BC `Job Jnl.-Post Batch` (isolated). Response (success): + `linesPosted`, `postingDate`, `totalQuantity`, `totalLineAmount`, `jobRegisterNo`, `jobRegisterId`, `fromEntryNo`, `toEntryNo`.

#### `Projects.ProjectJournal.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). Same identification as `Post`.

Drives BC `Job Jnl.-Post` headlessly via `Gen. Jnl.-Post Preview.SetContext + Run()` and rolls back. Tables most commonly captured: `Job Ledger Entry` (169), and for lines that produce G/L impact also `G/L Entry` (17), `VAT Entry` (254), `Item Ledger Entry` (32), `Value Entry` (5802) (when Line Type is `Item`).

```json
{ "specversion": "1.0", "type": "Projects.ProjectJournal.PreviewPost", "source": "MyApp", "subject": "PROJECT|DEFAULT" }
```

Response uses the same envelope as other PreviewPost types. Notable:
- `DimensionSetID` is returned as an **array of `{DimensionCode, DimensionValueCode}` pairs**, not as an integer. Project journal entries typically capture every dimension on the line.
- `predictedDocumentNos` may contain `"***"` when BC masks an unallocated number.

**Operational notes:**
- **`Line Type` must not be blank.** BC requires a non-blank `Line Type` (`Schedule`, `Billable`, or `Both Schedule and Contract`). Send `lineType` on each line of `Projects.ProjectJournal.Create`; a blank line created without `lines` needs it set with `Data.Records.Set` before previewing.
- Item lines additionally produce `Item Ledger Entry` / `Value Entry` rows.

---

### 7.5e RESOURCE JOURNAL OPERATIONS

**Identification:** Same three modes (pipe-form, SystemId, JSON `{templateName, batchName}` with JSON precedence).

**Workflow:** `Resources.ResourceJournal.Create` (with `lines`) → `Resources.ResourceJournal.Check` → `Resources.ResourceJournal.Post`.

#### `Resources.ResourceJournal.Create` — add lines to a batch

Direction: **Inbound** (creates records). `subject` = `TEMPLATE|BATCH` or the batch SystemId, or `templateName`/`batchName` in `data`. The batch must exist; it is never created.

Send the lines with their values in `lines` (at most 200). Every line is checked before anything is inserted and every problem is reported in one answer (`code: InvalidLine`, one `errors[]` entry per problem with `parameter` `lines[n].<field>`), so nothing is created when one line is wrong. Required on each line: resourceNo, quantity. A field you leave out keeps its BC default.

```json
{ "specversion": "1.0", "type": "Resources.ResourceJournal.Create", "source": "MyApp", "subject": "RESOURCE|DEFAULT",
  "data": { "lines": [
    { "resourceNo": "LINDA", "quantity": 2 }
  ] } }
```

Without `lines`, `noOfLines` (1-100, default 1) inserts blank lines with the BC defaults. `clearExistingLines: true` deletes every line in the batch first and is destructive. The response lists the inserted lines in the `Data.Records.Get` shape.

Full contract: [Resources.ResourceJournal.Create](https://businesscentralal.github.io/bifrost/en-us/foundation/reference/message-types/resources-resourcejournal-create/).


#### `Resources.ResourceJournal.Check`

Response: `status`, `validationResult`, `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalQuantity`, `totalCost`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Resources.ResourceJournal.Post`

Posts via BC `Res. Jnl.-Post Batch` (isolated). Response (success): `status`, `templateName`, `batchName`, `batchDescription`, `linesPosted`, `postingDate`, `totalQuantity`, `totalCost`.

**Conditional register fields:** `resourceRegisterNo`, `resourceRegisterId`, `fromEntryNo`, `toEntryNo` are present **only when a Resource Register row is created** for the posting. Consumers must treat them as optional. (A Resource Register entry is not always created — depends on the BC posting outcome.)
