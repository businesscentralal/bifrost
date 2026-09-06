---
id: 7-5b-fixed-asset-journal-operations
title: "7.5b Fixed asset journal operations"
sidebar_label: "7.5b Fixed asset journal operations"
sidebar_position: 7
---

**Identification:** Fixed Asset journals use the same three identification modes as general journals: pipe-form `"TEMPLATE|BATCH"`, SystemId via `Format(SystemId, 0, 4)`, or JSON `{"templateName": "FA", "batchName": "DEFAULT"}` (JSON has precedence).

**Workflow:** `Finance.FAJournal.SetupNewLine` → `Data.Records.Set` → `Finance.FAJournal.Check` → `Finance.FAJournal.Post` (or `Finance.FAJournal.PreviewPost` for a dry run).

#### `Finance.FAJournal.SetupNewLine`

Creates a new FA Journal Line with defaults from template/batch via BC `SetUpNewLine`. Returns the new line in `Data.Records.Get` shape with `primaryKey { JournalTemplateName, JournalBatchName, LineNo_ }`.

```json
{ "specversion": "1.0", "type": "Finance.FAJournal.SetupNewLine", "source": "MyApp", "subject": "FA|DEFAULT" }
```

Optional: `fieldNumbers` (int[]), `noOfLines` (1–100), `clearExistingLines` (boolean).

#### `Finance.FAJournal.Check`

Validates an FA journal batch without posting. Zero-amount lines produce **warnings** (non-blocking).

```json
{ "specversion": "1.0", "type": "Finance.FAJournal.Check", "source": "MyApp", "subject": "FA|DEFAULT" }
```

Response: `status`, `validationResult` (`Ready` / `ReadyWithWarnings` / `NotReady`), `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalAmount`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Finance.FAJournal.Post`

Posts the batch via BC `FA Jnl.-Post Batch`. Wrapped in an isolated codeunit so errors return a built response with `callstack`.

```json
{ "specversion": "1.0", "type": "Finance.FAJournal.Post", "source": "MyApp", "subject": "FA|BATCH001" }
```

Response (success): `status`, `templateName`, `batchName`, `batchDescription`, `linesPosted`, `postingDate`, `totalQuantity` (typically 0 — amount-driven), `totalAmount`, `faRegisterNo`, `faRegisterId`, `fromEntryNo`, `toEntryNo`.

#### `Finance.FAJournal.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). Same identification (`subject` = `TEMPLATE|BATCH` or SystemId GUID; or `templateName`/`batchName` in `data`).

Drives BC `FA Jnl.-Post` headlessly via `Gen. Jnl.-Post Preview.SetContext + Run()` and rolls back. Tables most commonly captured: `Maintenance Ledger Entry` (5625), and for G/L-integrating posting types also `FA Ledger Entry` (5601), `G/L Entry` (17), `VAT Entry` (254) and bal-account movements.

```json
{ "specversion": "1.0", "type": "Finance.FAJournal.PreviewPost", "source": "MyApp", "subject": "FA|DEFAULT" }
```

Response uses the same envelope as `Finance.GeneralJournal.PreviewPost` (`rollback`, `summary`, `totals`, `preview[]`). Each `preview[]` entry exposes per-row `id` (SystemId), `primaryKey` and `fields` objects, and a `tableCaption` alongside `tableId`/`tableName`. Document numbers BC has not yet allocated appear as `"***"` in `predictedDocumentNos` and inside row `fields`.

**FA G/L Integration routing (critical):** Each `G/L Integration - {Type}` flag on the FA Depreciation Book controls whether postings of that type **must** go through the **general journal** rather than the FA journal.
- When `G/L Integration - Acquisition Cost = true` (BC default), Acquisition Cost lines with `Account Type = Fixed Asset` must be posted via `Finance.GeneralJournal.PreviewPost` / `Finance.GeneralJournal.Post`. Attempting this in the FA journal returns: `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...`. The same applies to Depreciation, Disposal, Maintenance, etc.
- **CRONUS demo caveat:** on the `FYRIRTÆKI` depreciation book, all `G/L Integration - {Type}` flags default to `true`, so the only FA posting type that succeeds in the FA journal is one whose flag is `false`. To exercise FA Journal against CRONUS, temporarily flip the appropriate flag to `false`.
- **Recommendation for G/L-integrating types:** use the general journal route — `Finance.GeneralJournal.PreviewPost` with `Account Type = Fixed Asset` and `FA Posting Type = {Acquisition Cost | Depreciation | Disposal}`.

---
