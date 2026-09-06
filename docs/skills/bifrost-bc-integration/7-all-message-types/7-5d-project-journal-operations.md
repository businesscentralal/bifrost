---
id: 7-5d-project-journal-operations
title: "7.5d Project journal operations"
sidebar_label: "7.5d Project journal operations"
sidebar_position: 13
---

**Identification:** Same three modes (pipe-form, SystemId, JSON `{templateName, batchName}` with JSON precedence). Targets BC Job Journal Lines (project = job in BC terminology).

**Workflow:** `Projects.ProjectJournal.SetupNewLine` → `Data.Records.Set` → `Projects.ProjectJournal.Check` → `Projects.ProjectJournal.Post`.

#### `Projects.ProjectJournal.SetupNewLine`

```json
{ "specversion": "1.0", "type": "Projects.ProjectJournal.SetupNewLine", "source": "MyApp", "subject": "PROJECT|DEFAULT" }
```

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
- **`Line Type` must not be blank.** BC requires a non-blank `Line Type` (`Schedule`, `Billable`, or `Both Schedule and Contract`). A new line created by `SetupNewLine` starts with blank `Line Type` — set it before previewing.
- Item lines additionally produce `Item Ledger Entry` / `Value Entry` rows.

---
