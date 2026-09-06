# Finance

General journal preparation, validation, posting, preview-posting and reversal; bank reconciliation from import to posting; VAT settlement and VAT statement preview; exchange-rate adjustment; and the fixed asset journal.

[← back to SKILL.md](../SKILL.md) · originally sections 7.5, 7.5a, 7.5b of the single-file skill.

---
### 7.5 FINANCE OPERATIONS

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

---

### 7.5a BANK RECONCILIATION OPERATIONS

**Identification:** `subject` should be reconciliation SystemId GUID for `Match`, `Reset`, and `Post`. For `Create`, `subject` may be Bank Account No. or Bank Account SystemId GUID. JSON fallback fields are supported per message type.

**Workflow:** `Finance.BankReconciliation.Create` → `Finance.BankReconciliation.Match` (or `Finance.BankReconciliation.Reset` + `Finance.BankReconciliation.Match`) → `Finance.BankReconciliation.Post`.

**Data-flow mechanism (important for query/verification):**
- Header: `Bank Acc. Reconciliation` with `Statement Type = Bank Reconciliation`.
- Lines: `Bank Acc. Reconciliation Line`.
- `Match` stamps `Bank Account Ledger Entry` with `Statement No.`, `Statement Line No.`, and `Statement Status = Bank Acc. Entry Applied` (via BC helper `Bank Acc. Entry Set Recon.-No.`). Many-to-one matches add rows to `Bank Acc. Rec. Match Buffer`. Auto-match calls `Match Bank Rec. Lines.BankAccReconciliationAutoMatch`.
- `Reset` calls `Match Bank Rec. Lines.RemoveMatchesFromRecLines`, which reverses the BLE stamps and zeroes line `Applied Amount`/`Applied Entries`/`Difference`.
- `Post` runs `Bank Acc. Reconciliation Post`: closes matched BLEs (`Open=false`, `Statement Status=Closed`), posts G/L entries, deletes the header, writes `Posted Bank Acc. Reconciliation` history.
- **This flow never writes `Applied Payment Entry` rows.** That table exists only for Statement Type = `Payment Application`. To verify a match externally, read `Bank Account Ledger Entry` filtered by the reconciliation `Statement No.` -- not `Applied Payment Entry`.

#### `Finance.BankReconciliation.Create`

Creates a new bank reconciliation (`Statement Type = Bank Reconciliation`) or reuses an existing empty one for the bank account, then attempts statement import.

```json
{ "specversion": "1.0", "type": "Finance.BankReconciliation.Create", "source": "MyApp", "subject": "BANK-MAIN", "data": { "statementDate": "2026-05-30" } }
```

Success fields: `status`, `reused`, `bankAccountNo`, `statementNo`, `statementDate`, `systemId`, `lineCount`, optional `warning`.

Important behavior:
- Missing `statementDate` + reused reconciliation -> statement date reset to `0D`.
- Import failures are returned as `warning`; `status` remains `Success`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.BankReconciliation.Create`.

#### `Finance.BankReconciliation.Match`

Resolves reconciliation and computes match mode from `statementLines` and `ledgerEntries` arrays. Empty arrays trigger auto-match execution.

```json
{ "specversion": "1.0", "type": "Finance.BankReconciliation.Match", "source": "MyApp", "subject": "<reconciliation-guid>", "data": { "statementLines": [10000, 20000], "ledgerEntries": [30000, 40000], "strict": true } }
```

Success fields: `status`, `mode`, `strict`, `statementLinesCount`, `ledgerEntriesCount`, `bankAccountNo`, `statementNo`, `reconciliationSystemId`.

Validation rules:
- N-N is only allowed with `strict=true`.
- Strict N-N requires equal array lengths.

Detailed help: call `Help.Implementation.Get` with `name = Finance.BankReconciliation.Match`.

#### `Finance.BankReconciliation.Reset`

Removes all applied matches across all lines for a reconciliation.

```json
{ "specversion": "1.0", "type": "Finance.BankReconciliation.Reset", "source": "MyApp", "subject": "<reconciliation-guid>", "data": {} }
```

Success fields: `status`, `mode` (`ResetAll`), `resetLineCount`, `bankAccountNo`, `statementNo`, `reconciliationSystemId`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.BankReconciliation.Reset`.

#### `Finance.BankReconciliation.Post`

Posts reconciliation through BC codeunit `Bank Acc. Reconciliation Post`.

```json
{ "specversion": "1.0", "type": "Finance.BankReconciliation.Post", "source": "MyApp", "subject": "<reconciliation-guid>", "data": {} }
```

Success fields: `status`, `bankAccountNo`, `statementNo`, `reconciliationSystemId`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.BankReconciliation.Post`.

#### `Finance.VAT.CalcAndPostSettlement`

Previews or posts a VAT settlement via report 20 *Calc. and Post VAT Settlement*. Set `post=false` (default) to inspect aggregated totals; set `post=true` to post and receive the resulting G/L Register number plus the inclusive `VAT Entry."Entry No."` range.

```json
{ "specversion": "1.0", "type": "Finance.VAT.CalcAndPostSettlement", "source": "MyApp",
  "data": { "startingDate": "2026-01-01", "endingDate": "2026-01-31",
            "postingDate": "2026-02-01", "documentNo": "VAT-2026-01",
            "settlementAccountNo": "2150", "post": true,
            "vatBusPostingGroup": "DOMESTIC", "vatProdPostingGroup": "VAT24",
            "type": "Sale", "showAmountsInAddCurrency": false } }
```

Required: `startingDate`, `endingDate`, `postingDate`, `documentNo`, `settlementAccountNo`. Optional filters: `vatBusPostingGroup`, `vatProdPostingGroup`, `vatRegistrationNo`, `type` (`Purchase` / `Sale` / `Purchase|Sale`).

Preview success fields: `status`, `posted=false`, `documentNo`, `postingDate`, `settlementAccountNo`, `startingDate`, `endingDate`, `showAmountsInAddCurrency`, `lcyCode`, `totals` (`vatBase`, `vatAmount`, `vatBaseACY`, `vatAmountACY`, `entryCount`), `byPostingGroup[]` (per `Type` + `VAT Bus.`/`Prod. Posting Group` combination).

Post success adds: `posted=true`, `glRegisterNo`, `fromVATEntryNo`, `toVATEntryNo`, `settlementVATEntryCount`. Individual VAT entries are omitted; retrieve them via `Data.Records.Get` against `VAT Entry` filtered by `Entry No.` between the returned bounds.

Validation errors (`status=Error`): missing required field, `endingDate < startingDate`, settlement account missing / not `Account Type = Posting` / blocked, or no open VAT entries match the filters. Report-time failures additionally include `callstack`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.VAT.CalcAndPostSettlement`.

#### `Finance.VATStatement.Preview`

Reproduces standard BC page 474 *VAT Statement Preview*. Returns the calculated Column Amount per VAT Statement Line via report 12 `"VAT Statement".CalcLineTotal` — same API page 474 uses, so values match. Read-only, no posting.

```json
{ "specversion": "1.0", "type": "Finance.VATStatement.Preview", "source": "MyApp",
  "data": { "templateName": "DEFAULT", "name": "DEFAULT",
            "selection": "Open and Closed", "periodSelection": "Within Period",
            "dateFilter": "01/01/25..31/01/25", "countryRegionFilter": "",
            "rowNoFilter": "", "showAmountsInAddCurrency": false } }
```

Required: `templateName`, `name`. Optional: `selection` (`Open` / `Closed` / `Open and Closed`, default `Open and Closed`), `periodSelection` (`Within Period` / `Before and Within Period`, default `Within Period`), `dateFilter` (applied to `VAT Statement Name."Date Filter"` FlowFilter), `countryRegionFilter`, `rowNoFilter`, `showAmountsInAddCurrency`.

Success fields: `status`, `templateName`, `name`, `description`, `selection`, `periodSelection`, `dateFilter`, `countryRegionFilter`, `showAmountsInAddCurrency`, `lineCount`, `lines[]`. Each line: `lineNo`, `rowNo`, `description`, `type`, `amountType`, `genPostingType`, `vatBusPostingGroup`, `vatProdPostingGroup`, `accountTotaling`, `rowTotaling`, `print`, `printWith`, `newPage`, `boxNo`, `columnAmount`.

`columnAmount` is `false` (boolean) for `Description`-type rows or when `CalcLineTotal` returns no amount; otherwise a decimal. Rows with `printWith = Opposite Sign` have `columnAmount` already inverted to match page 474.

Validation errors (`status=Error`): missing `templateName` / `name`, invalid `selection` / `periodSelection`, template not found, or name not found within template.

Enumerate templates/names via `Data.Records.Get` against `VAT Statement Template` (256) or `VAT Statement Name` (257).

Detailed help: call `Help.Implementation.Get` with `name = Finance.VATStatement.Preview`.

#### VAT Settlement Workflow

`Finance.VATStatement.Preview` and `Finance.VAT.CalcAndPostSettlement` are the two halves of the BC VAT settlement workflow. Both read the same `VAT Entry` table but aggregate differently: Preview groups per `VAT Statement Line` (Row No.) using report 12 `CalcLineTotal`; CalcAndPostSettlement groups per `Type` + posting groups using report 20.

Standard sequence:
1. Post period transactions (each writes `VAT Entry` rows with `Closed=false`).
2. `Finance.VATStatement.Preview` — verify the VAT return per Statement Line.
3. `Finance.VAT.CalcAndPostSettlement` with `post=false` — verify the same totals aggregated per posting-group.
4. Reconcile: sum of VAT-amount rows in step 2 must equal `totals.vatAmount` from step 3 for the same period and filters. Discrepancy = wrong Statement Template definition.
5. `Finance.VAT.CalcAndPostSettlement` with `post=true` — closes the period's open VAT entries and posts the net to `settlementAccountNo`. Returns `glRegisterNo`, `fromVATEntryNo`, `toVATEntryNo`.
6. Retrieve the posted detail via `Data.Records.Get` against `VAT Entry` filtered by the returned `Entry No.` range, or against `G/L Register` by the returned `No.`.

Re-running the post for the same period without new entries fails with `No open VAT entries match the supplied filters.` (intended guard).

For the full end-to-end narrative (concepts, what the settlement actually posts, reconciliation rules), call `Help.Implementation.Get` with either message type name — both help texts include the shared *VAT Settlement Process (End-to-End)* section.

#### `Finance.Currency.AdjustExchangeRates`

Previews or posts BC codeunit 699 *Exch. Rate Adjmt. Process* for foreign-currency revaluation. Set `post=false` (default) for a rolled-back preview captured via the BC posting-preview framework; set `post=true` to commit and receive the new G/L Register number, the inclusive `G/L Entry."Entry No."` range, and a per-currency LCY breakdown.

```json
{ "specversion": "1.0", "type": "Finance.Currency.AdjustExchangeRates", "source": "MyApp",
  "data": { "endingDate": "2025-12-31", "postingDate": "2025-12-31",
            "documentNo": "FX-2025-12", "currencyCode": "USD|EUR",
            "adjustCustomers": true, "adjustVendors": true, "adjustEmployees": false,
            "adjustBankAccounts": true, "adjustGLAccounts": true, "post": true } }
```

Required: `endingDate`, `postingDate`, `documentNo`. Optional: `post` (default `false`), `currencyCode` (BC-style filter expression, default = all FCY), `postingDescription` (default `Exchange rate adjustment <currencyCode-filter> <endingDate>`), and the five toggles `adjustCustomers` / `adjustVendors` / `adjustEmployees` / `adjustBankAccounts` / `adjustGLAccounts` (each default `true`). At least one toggle must be `true`. `adjustVATEntries` is intentionally **not** exposed — use `Finance.VAT.CalcAndPostSettlement` for VAT settlement.

Preview success fields: `status`, `posted=false`, `rollback=true`, `postingDate`, `endingDate`, `documentNo`, `postingDescription`, `currencyFilter`, all five `adjust*` toggle echoes, `lcyCode`, `totals` (`balanced`, `totalDebitLCY`, `totalCreditLCY`), `preview[]` (one element per ledger table touched: `tableId`, `tableCaption`, `entryCount`, `entries[]` with curated field projection via `Preview Helper ori.AddTableToPreview`), `durationMs`.

Post success adds: `posted=true`, `totals.netLCY`, `totals.newGLEntryCount`, `byCurrency[]` (per FCY currency: `currencyCode`, `adjustedBaseLCY`, `adjustedAmtLCY`, `registerCount` — sourced from `Exch. Rate Adjmt. Reg.` via `CalcSums`), `glRegisterNo`, `fromGLEntryNo`, `toGLEntryNo`, `newGLEntryCount`. Individual `G/L Entry` rows are omitted; retrieve them via `Data.Records.Get` against `G/L Entry` filtered by `Entry No.` between the returned bounds, or against `Exch. Rate Adjmt. Reg.` to inspect per-Account-Type / Posting-Group splits.

Both branches enforce the `Posting Gate ori` for posting type `G/L`. Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Denial returns `status=Error` with `Posting denied: missing 'BIFROST GL Post ori' permission set.`; the gate runs before parameters are populated so no preview or post is attempted.

**Currency master prerequisites** (BC codeunit 699 enforces these on every active currency in the company, not just the ones in `currencyCode`):
- Fields 6/7/8/9 `Unrealized Gains Acc.` / `Unrealized Losses Acc.` / `Realized Gains Acc.` / `Realized Losses Acc.` — required for any run.
- Fields 40/41 `Realized G/L Gains Account` / `Realized G/L Losses Account` — required only when `adjustGLAccounts=true`, but validated on **all** currencies regardless of filter. Set `adjustGLAccounts=false` for ledger-only revaluation when fields 40/41 are not configured everywhere.

Missing values surface as `Unrealized Gains Acc. must have a value in Currency: Code=XYZ.` (or the field-40/41 variant). Re-running with the same payload succeeds once the Currency Card is populated.

Validation errors (`status=Error`): missing required field, all `adjust*` toggles false, posting gate denied. Engine-time failures (post branch only) additionally include `callstack`. Engine failures during posting are isolated via `Codeunit.Run` so the outer message-processing transaction is preserved.

**Operational notes for AI callers**:
- `adjustedBaseLCY` is `0.00` when the underlying open entries already net to zero LCY in the source currency (e.g. recently posted clearing transactions); only `adjustedAmtLCY` carries the FX delta. Do not flag as an error.
- `byCurrency` is `[]` and `newGLEntryCount` is `0` on no-op runs (no open entries in the date window); `status` stays `Success`.
- Preview rollback is total: nothing remains in `Exch. Rate Adjmt. Reg.`, `G/L Entry`, or any Detailed Ledger Entry table.
- For line-level detail of a posted run, follow up with `Data.Records.Get` against `G/L Entry` filtered by `Entry No.` between `fromGLEntryNo` and `toGLEntryNo`.

Detailed help: call `Help.Implementation.Get` with `name = Finance.Currency.AdjustExchangeRates`.

---

### 7.5b FIXED ASSET JOURNAL OPERATIONS

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
