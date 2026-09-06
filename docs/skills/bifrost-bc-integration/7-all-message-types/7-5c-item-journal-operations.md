---
id: 7-5c-item-journal-operations
title: "7.5c Item journal operations"
sidebar_label: "7.5c Item journal operations"
sidebar_position: 8
---

**Identification:** Same three modes as general journals (pipe-form, SystemId, JSON `{templateName, batchName}` with JSON precedence).

**Workflow:** `Inventory.ItemJournal.SetupNewLine` → `Data.Records.Set` → `Inventory.ItemJournal.Check` → `Inventory.ItemJournal.Post` (or `Inventory.ItemJournal.PreviewPost` for a dry run).

#### `Inventory.ItemJournal.SetupNewLine`

```json
{ "specversion": "1.0", "type": "Inventory.ItemJournal.SetupNewLine", "source": "MyApp", "subject": "ITEM|DEFAULT" }
```

Returns the new Item Journal Line with `primaryKey { JournalTemplateName, JournalBatchName, LineNo_ }`. Optional: `fieldNumbers`, `noOfLines`, `clearExistingLines`.

#### `Inventory.ItemJournal.Check`

```json
{ "specversion": "1.0", "type": "Inventory.ItemJournal.Check", "source": "MyApp", "subject": "ITEM|DEFAULT" }
```

Response: `status`, `validationResult`, `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalQuantity`, `totalAmount`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Inventory.ItemJournal.Post`

Posts via BC `Item Jnl.-Post Batch` (isolated). Response (success): + `linesPosted`, `postingDate`, `itemRegisterNo`, `itemRegisterId`, `fromEntryNo`, `toEntryNo`.

#### `Inventory.ItemJournal.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). Same identification as `Post`.

Drives BC `Item Jnl.-Post` headlessly via `Gen. Jnl.-Post Preview.SetContext + Run()` and rolls back. Tables most commonly captured: `Item Ledger Entry` (32), `Value Entry` (5802), and for runs that produce G/L impact also `G/L Entry` (17) and `VAT Entry` (254).

```json
{ "specversion": "1.0", "type": "Inventory.ItemJournal.PreviewPost", "source": "MyApp", "subject": "ITEM|DEFAULT" }
```

Response: same envelope as the other PreviewPost types (`rollback`, `summary`, `totals`, `preview[]` with per-row `id` + `primaryKey` + `fields` + `tableCaption`). `predictedDocumentNos` may contain `"***"` when BC masks an unallocated number-series value.

**Operational notes:**
- **Prefer inserting lines through the BC UI / `Insert(true)` when possible** — AL `OnValidate` triggers populate downstream fields (posting groups, location, costing method) automatically. When lines are inserted via OData/MCP `set_records`, every field BC needs to post must be supplied; `set_records` does **not** fire `OnValidate`.
- Preview rolls back ledger entries but does not roll back side effects on locks (e.g. batch description).

---
