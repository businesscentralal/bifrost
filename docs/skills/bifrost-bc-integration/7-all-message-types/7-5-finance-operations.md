---
id: 7-5-finance-operations
title: "7.5 Finance operations"
sidebar_label: "7.5 Finance operations"
sidebar_position: 5
---

#### `Finance.GeneralJournal.Check`

Direction: **Outbound**. `subject` = `TEMPLATE|BATCH` (pipe-separated) or SystemId GUID. Or pass `templateName`/`batchName` in `data`.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.Check", "source": "MyApp", "subject": "GENERAL|DEFAULT" }
```

Validates a general journal batch without posting. Returns readiness status with comprehensive validation results.

Response (Ready):
```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "lineCount": 4,
  "isBalanced": true,
  "totalAmountLCY": 0.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

Response (Not Ready):
```json
{
  "status": "Success",
  "validationResult": "NotReady",
  "templateName": "GENERAL",
  "batchName": "INVALID",
  "lineCount": 2,
  "isBalanced": false,
  "totalAmountLCY": 1500.0,
  "errorCount": 3,
  "warningCount": 0,
  "errors": [
    "Journal is not balanced: Total LCY = 1500.00 (should be 0.00).",
    "Line 10000: Document No. is required.",
    "Line 20000: G/L Account 44000 does not allow direct posting."
  ],
  "warnings": []
}
```

**Validation states:**
- `Ready` — no errors, no warnings — safe to post
- `ReadyWithWarnings` — no errors, has warnings (e.g., future posting dates, zero amounts) — posting allowed
- `NotReady` — has blocking errors — posting will fail

Uses BC Error Message Management framework with codeunit 11 "Gen. Jnl.-Check Line" to collect **all** validation errors (not just the first).

#### `Finance.GeneralJournal.Post`

Direction: **Inbound**. `subject` = `TEMPLATE|BATCH` or SystemId GUID. Or pass `templateName`/`batchName` in `data`.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.Post", "source": "MyApp", "subject": "GENERAL|BATCH001" }
```

Posts a general journal batch. All lines are cleared from the batch after successful posting.

Success:
```json
{
  "status": "Success",
  "templateName": "GENERAL",
  "batchName": "BATCH001",
  "batchDescription": "Default Journal Batch",
  "linesPosted": 6,
  "postingDate": "2024-01-15",
  "totalAmountLCY": 0.0,
  "glRegisterNo": 42,
  "glRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 1001,
  "toEntryNo": 1006,
  "fromVATEntryNo": 501,
  "toVATEntryNo": 502
}
```

Error (with callstack):
```json
{
  "status": "Error",
  "error": "Journal batch is not balanced.",
  "callstack": "Gen. Jnl.-Post Batch(CodeUnit 80).OnRun..."
}
```

Uses "Gen. Jnl.-Post Batch" codeunit 80 for posting. Returns G/L Register details including entry ranges for audit trail. All journal lines are cleared after successful posting.

**Workflow:** Prepare lines with `Finance.GeneralJournal.SetupNewLine`, populate fields with `Data.Records.Set`, validate with `Finance.GeneralJournal.Check`, then post with `Finance.GeneralJournal.Post`.

#### `Finance.GeneralJournal.PreviewPost`

Direction: **Inbound** (simulates posting; no data modification). `subject` = `TEMPLATE|BATCH` or SystemId GUID. Or pass `templateName`/`batchName` in `data`.

Simulates posting a general journal batch and returns the resulting ledger entries (G/L Entry, VAT Entry, Customer/Vendor/Bank/Employee Ledger Entry, FA Ledger Entry, Job Ledger Entry, plus any extension-registered tables) **without committing changes**. The full `Gen. Jnl.-Post` routine runs inside a transaction that is rolled back after capturing the simulated entries.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.PreviewPost", "source": "MyApp", "subject": "GENERAL|DEFAULT" }
```

Success:
```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting general journal batch GENERAL|DEFAULT (3 lines) would create 6 ledger entries across 2 tables. Transaction is balanced.",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 3,
  "postingDate": "2024-01-15",
  "lcyCode": "USD",
  "predictedDocumentNos": ["DOC-001", "DOC-002"],
  "totals": { "balanced": true, "totalDebitLCY": 1500.00, "totalCreditLCY": 1500.00 },
  "preview": [
    { "tableId": 17, "tableName": "G/L Entry", "entryCount": 6, "entries": [ /* ... */ ] }
  ]
}
```

**Identification methods (first match wins):**
1. Subject `TEMPLATE|BATCH` (pipe-separated names)
2. Subject SystemId GUID of the journal batch
3. Data `templateName` + `batchName`

**Notes:**
- The `totals` object reports only LCY totals because a journal batch can mix multiple currencies across lines. Per-entry currency context (`CurrencyCode`, `Amount`, `AmountLCY`) remains available inside each captured entry in the `preview` array.
- `predictedDocumentNos` is informational only — No. Series state may change between preview and actual post.
- Field-level access restrictions from `Field Access ori` are honoured: read-restricted fields are omitted from `preview[].entries`.
- Uses BC codeunit `Gen. Jnl.-Post Preview` to drive `Gen. Jnl.-Post` headlessly via `SetContext + Run()`. Tables are enumerated dynamically via `Posting Preview Event Handler.FillDocumentEntry()`, so any extension-registered ledger tables also appear in the `preview` array.

#### `Finance.GeneralJournal.SetupNewLine` — create a new journal line with defaults

Direction: **Inbound** (creates a record). `subject` = `TEMPLATE|BATCH` (pipe-separated) or SystemId GUID. Or pass `templateName`/`batchName` in `data`. Optional: `fieldNumbers` to limit response fields. Optional: `clearExistingLines` (Boolean, default `false`) — when `true`, deletes all existing lines in the batch before creating the new line (line numbering restarts at 10000).

This is the default way to prepare a general journal line. It creates and inserts a new line pre-populated with defaults from BC's `SetUpNewLine` procedure. Default values inherited from the template and batch include Bal. Account Type, Bal. Account No., Document Type, and Posting Date. If a No. Series is configured on the journal batch, the Document No. is automatically populated from the next number in the series.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.SetupNewLine", "source": "MyApp", "subject": "GENERAL|DEFAULT" }
```

Response (same format as `Data.Records.Get` — single record):
```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
      "primaryKey": {
        "JournalTemplateName": "GENERAL",
        "JournalBatchName": "DEFAULT",
        "LineNo_": 10000
      },
      "fields": {
        "PostingDate": "2026-04-15",
        "DocumentNo_": "GJ-00001",
        "DocumentType": " ",
        "AccountType": "G/L Account",
        "BalAccountType": "G/L Account",
        "BalAccountNo_": "29900"
      }
    }
  ]
}
```

**Typical workflow:**
1. `Finance.GeneralJournal.SetupNewLine` — create line with defaults
2. `Data.Records.Set` — populate Account No., Amount, etc. using the returned SystemId
3. Repeat 1–2 for each line
4. `Finance.GeneralJournal.Check` — validate
5. `Finance.GeneralJournal.Post` — post

#### `Finance.GeneralJournal.ReverseRegister` — reverse all entries in a G/L Register

Direction: **Inbound** (modifies data). `subject` = G/L Register No. (integer) or SystemId GUID of the G/L Register record.

Reverses all G/L entries belonging to a specific G/L Register. Uses BC's `Reversal Entry` table with `ReverseRegister` method and dialog suppression. The reversal is executed in an isolated codeunit for clean error handling.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.ReverseRegister", "source": "MyApp", "subject": "42" }
```

Success:
```json
{
  "status": "Success",
  "reversedRegisterNo": 42,
  "fromEntryNo": 1001,
  "toEntryNo": 1006
}
```

Error (already reversed):
```json
{
  "status": "Error",
  "error": "G/L Register 42 has already been reversed."
}
```

Error (reversal failure with callstack):
```json
{
  "status": "Error",
  "error": "The transaction cannot be reversed because...",
  "callstack": "Reversal-Post(CodeUnit 179).OnRun..."
}
```

**Validation rules:**
- Subject is required — returns error if empty
- Subject must be a valid integer or GUID — returns error if unparseable
- G/L Register must exist — returns error if not found
- G/L Register must not already be reversed — returns error if `Reversed = true`

#### `Finance.GeneralJournal.ReverseTransaction` — reverse all entries by transaction number

Direction: **Inbound** (modifies data). `subject` = Transaction No. (integer) or SystemId GUID of any G/L Entry in the transaction.

Reverses all G/L entries sharing a specific transaction number. Uses BC's `Reversal Entry` table with `ReverseTransaction` method and dialog suppression. The reversal is executed in an isolated codeunit for clean error handling.

```json
{ "specversion": "1.0", "type": "Finance.GeneralJournal.ReverseTransaction", "source": "MyApp", "subject": "157" }
```

Success:
```json
{
  "status": "Success",
  "reversedTransactionNo": 157,
  "entriesReversed": 4
}
```

Error (already reversed):
```json
{
  "status": "Error",
  "error": "Transaction No. 157 has already been reversed."
}
```

Error (reversal failure with callstack):
```json
{
  "status": "Error",
  "error": "The transaction cannot be reversed because...",
  "callstack": "Reversal-Post(CodeUnit 179).OnRun..."
}
```

**Validation rules:**
- Subject is required — returns error if empty
- Subject must be a valid integer or GUID — returns error if unparseable
- At least one G/L entry must exist for the transaction number — returns error if none found
- The entries must not already be reversed — returns error if `Reversed = true`

**Reversal workflow (both types):**
1. Identify entries to reverse (by register or transaction number)
2. Call `Finance.GeneralJournal.ReverseRegister` or `Finance.GeneralJournal.ReverseTransaction`
3. BC creates new offsetting entries with the next available entry numbers
4. Original entries are marked as `Reversed = true`
