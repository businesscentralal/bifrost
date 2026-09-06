---
id: finance
title: "Finance message types"
sidebar_position: 5
---

This document describes the Finance-related message types in Bifröst Foundation.

## Overview

Finance message types provide functionality for working with general journals, including validation and posting.

## Message Type List

| Message Type | Direction | Purpose |
|--------------|-----------|---------|
| [Finance.GeneralJournal.Check](#financegeneraljournalcheck) | Outbound | Validates a general journal batch and returns readiness status |
| [Finance.GeneralJournal.Post](#financegeneraljournalpost) | Inbound | Posts a general journal batch and returns posting statistics |
| [Finance.GeneralJournal.PreviewPost](#financegeneraljournalpreviewpost) | Inbound | Simulates posting a general journal batch and returns the resulting ledger entries without committing changes |
| [Finance.GeneralJournal.ReverseRegister](#financegeneraljournalreverseregister) | Inbound | Reverses all entries in a G/L Register |
| [Finance.GeneralJournal.ReverseTransaction](#financegeneraljournalreversetransaction) | Inbound | Reverses all entries in a G/L transaction |
| [Finance.GeneralJournal.SetupNewLine](#financegeneraljournalsetupnewline) | Inbound | Creates a new journal line with defaults — the default way to prepare a journal line |
| [Finance.FAJournal.SetupNewLine](#financefajournalsetupnewline) | Inbound | Creates a new fixed asset journal line with defaults |
| [Finance.FAJournal.Check](#financefajournalcheck) | Outbound | Validates a fixed asset journal batch and returns readiness status |
| [Finance.FAJournal.Post](#financefajournalpost) | Inbound | Posts a fixed asset journal batch and returns posting statistics |
| [Finance.FAJournal.PreviewPost](#financefajournalpreviewpost) | Inbound | Simulates posting a fixed asset journal batch and returns predicted ledger entries (rolled back) |
| [Finance.BankReconciliation.Create](#financebankreconciliationcreate) | Inbound | Creates or reuses a bank reconciliation and imports statement lines |
| [Finance.BankReconciliation.Match](#financebankreconciliationmatch) | Inbound | Resolves match mode and applies auto/strict matching rules |
| [Finance.BankReconciliation.Reset](#financebankreconciliationreset) | Inbound | Removes all matches from a bank reconciliation |
| [Finance.BankReconciliation.Post](#financebankreconciliationpost) | Inbound | Posts a bank reconciliation |
| [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement) | Inbound | Previews or posts a VAT settlement via report 20 and returns the resulting G/L Register and VAT entry range |
| [Finance.VATStatement.Preview](#financevatstatementpreview) | Inbound | Reproduces page 474 "VAT Statement Preview" and returns the calculated Column Amount per VAT Statement Line |
| [Finance.Currency.AdjustExchangeRates](#financecurrencyadjustexchangerates) | Inbound | Previews or posts a foreign-currency revaluation via codeunit 699 and returns either the simulated entries or the new G/L Register, entry range, and per-currency breakdown |

---

## Finance.GeneralJournal.Check

**Direction**: Outbound (validation only, no data modification)

**Purpose**: Validates a general journal batch without posting. Returns comprehensive readiness status and detailed validation results.

### Create Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "GENERAL|DEFAULT",
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "time": "2024-01-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Journal Batch Identification

The journal batch can be identified in three ways:

1. **Pipe-separated in subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId in subject**: `"subject": "guid-without-braces"`
3. **JSON data parameters**:
```json
{
  "data": {
    "templateName": "GENERAL",
    "batchName": "DEFAULT"
  }
}
```

JSON data parameters take precedence over the subject field.

### Response Format

#### Ready (no errors, no warnings)
```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "lineCount": 4,
  "isBalanced": true,
  "requiresBalance": true,
  "totalAmount": 0.0,
  "totalAmountLCY": 0.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

#### ReadyWithWarnings
```json
{
  "status": "Success",
  "validationResult": "ReadyWithWarnings",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "lineCount": 2,
  "isBalanced": true,
  "requiresBalance": true,
  "totalAmountLCY": 0.0,
  "errorCount": 0,
  "warningCount": 2,
  "errors": [],
  "warnings": [
    "Line 10000: Posting Date is in the future (2025-12-31).",
    "Line 20000: Customer C00010 is blocked (Payment)."
  ]
}
```

#### NotReady (validation errors)
```json
{
  "status": "Success",
  "validationResult": "NotReady",
  "templateName": "GENERAL",
  "batchName": "INVALID",
  "lineCount": 2,
  "isBalanced": false,
  "requiresBalance": true,
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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "Success" for validation (even if journal not ready) |
| `validationResult` | string | "Ready", "ReadyWithWarnings", or "NotReady" |
| `templateName` | string | Journal template name |
| `batchName` | string | Journal batch name |
| `batchDescription` | string | Journal batch description |
| `lineCount` | integer | Number of journal lines in batch |
| `isBalanced` | boolean | True if total LCY = 0 |
| `requiresBalance` | boolean | True if template requires balance |
| `totalAmount` | decimal | Sum of Amount on all lines |
| `totalAmountLCY` | decimal | Sum of Amount (LCY) on all lines |
| `errorCount` | integer | Number of blocking errors |
| `warningCount` | integer | Number of non-blocking warnings |
| `errors` | array | List of error messages (prevent posting) |
| `warnings` | array | List of warning messages (posting allowed) |

### Validation Rules

**Validation Method**: Uses BC Error Message Management framework with codeunit 11 "Gen. Jnl.-Check Line" to collect ALL validation errors in a single pass.

**Rules Applied**:
1. **Balance** (batch-level): General journal templates require total LCY = 0
2. **Lines** (batch-level): Batch must contain at least one line
3. **Per-Line Validation** (via Gen. Jnl.-Check Line):
   - Required fields: Posting Date, Document No., Account Type/No.
   - Posting period: Date must be within allowed posting period
   - G/L Accounts: Must exist, allow Direct Posting, not be Blocked
   - Customers/Vendors: Must exist and be allowed for posting
   - Balancing accounts: Validated if specified
   - Dimensions: Required dimensions must be present and valid
   - Currency: Currency codes must exist if specified
   - VAT: VAT calculations must be valid
   - Application: Application rules enforced
4. **Additional Warnings** (non-blocking):
   - Zero amounts generate warnings
   - Future posting dates (after work date) generate warnings

### Error Handling

| Error | Cause |
|-------|-------|
| Missing identification | No subject or data parameters provided |
| Batch not found | Template/batch combination does not exist |
| No lines | Batch exists but contains no journal lines |

### Notes

- **Non-Destructive**: This endpoint does NOT modify any data
- **Error Collection**: Leverages BC's Error Message framework to collect all validation errors (not just the first error)
- **Continue on Error**: Validation continues even after errors are found to provide complete error context

### Related Message Types

- [Finance.GeneralJournal.SetupNewLine](#financegeneraljournalsetupnewline) - Create a new journal line with defaults
- [Finance.GeneralJournal.Post](#financegeneraljournalpost) - Post validated journal batch
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget) - Retrieve journal lines
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset) - Create or update journal lines
- [Help.Tables.Get](/foundation/message-types/metadata/#helptablesget) - Get metadata about Gen. Journal Line table

---

## Finance.BankReconciliation.Create

**Direction**: Inbound

**Purpose**: Creates a new bank reconciliation for a bank account or reuses an existing empty one, then imports statement lines.

### Bank Reconciliation Workflow

This message type is the first step in the bank reconciliation cycle:

1. `Finance.BankReconciliation.Create` -- create or reuse the reconciliation header (`Bank Acc. Reconciliation` with `Statement Type = Bank Reconciliation`) and import statement lines into `Bank Acc. Reconciliation Line`.
2. `Finance.BankReconciliation.Match` -- pair statement lines with `Bank Account Ledger Entry` (BLE) rows. Match stamps the BLE with `Statement No.`, `Statement Line No.`, and `Statement Status = Bank Acc. Entry Applied` via standard BC helper `Bank Acc. Entry Set Recon.-No.`. Many-to-one matches also write rows to `Bank Acc. Rec. Match Buffer`.
3. `Finance.BankReconciliation.Reset` (optional) -- clear all match stamps to redo the match plan.
4. `Finance.BankReconciliation.Post` -- run codeunit `Bank Acc. Reconciliation Post`, close matched BLEs (`Open=false`, `Statement Status=Closed`), and delete the reconciliation header.

This flow does **not** create `Applied Payment Entry` rows. That table is only populated for Statement Type = `Payment Application`, which is not exposed by this extension.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Finance.BankReconciliation.Create",
  "source": "MyIntegrationApp v1.0",
  "subject": "BANK-MAIN",
  "data": {
    "statementDate": "2026-05-30"
  }
}
```

Identifier resolution order:

1. `subject` as GUID -> Bank Account SystemId
2. `subject` as text -> Bank Account No.
3. JSON keys: `bankAccountNo`, `bankAccountId`, `id`, `systemId`, `recordSystemId`

### Create Response Format

```json
{
  "status": "Success",
  "reused": true,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "statementDate": "2026-05-30",
  "systemId": "<guid>",
  "lineCount": 3,
  "warning": "<optional import warning>"
}
```

### Create Error Handling

If no bank account identifier can be resolved, the endpoint returns:

```json
{
  "status": "Error",
  "error": "Bank account identifier must be specified..."
}
```

### Create Notes

- If `statementDate` is omitted and an existing reconciliation is reused, statement date is reset to `0D` (blank in JSON response).
- Import failures are returned as `warning`; `status` remains `Success`.

---

## Finance.BankReconciliation.Match

**Direction**: Inbound

**Purpose**: Resolves matching mode (`Auto`, `0-N`, `1-1`, `1-N`, `N-1`, `N-N-Strict`, `Custom`) and applies strict validation for N-N mode.

### Match Data Effects

For every BLE matched to a statement line, the standard BC helpers `Match Bank Rec. Lines` and `Bank Acc. Entry Set Recon.-No.` write:

- `Bank Account Ledger Entry."Statement No."` = reconciliation `Statement No.`
- `Bank Account Ledger Entry."Statement Line No."` = matched statement line number
- `Bank Account Ledger Entry."Statement Status"` = `Bank Acc. Entry Applied`
- For 1-N and N-1, additional `Bank Acc. Rec. Match Buffer` rows track multi-entry relations

On each matched `Bank Acc. Reconciliation Line`: `Applied Amount`, `Applied Entries`, and `Difference` are updated.

`Auto` mode runs `Match Bank Rec. Lines.BankAccReconciliationAutoMatch(BankAccReconciliation, 0)`. No `Applied Payment Entry` rows are written by any mode.

### Match Request Format

```json
{
  "specversion": "1.0",
  "type": "Finance.BankReconciliation.Match",
  "source": "MyIntegrationApp v1.0",
  "subject": "<reconciliation-systemid>",
  "data": {
    "statementLines": [10000, 20000],
    "ledgerEntries": [30000, 40000],
    "strict": true
  }
}
```

### Match Response Format

```json
{
  "status": "Success",
  "mode": "N-N-Strict",
  "strict": true,
  "statementLinesCount": 2,
  "ledgerEntriesCount": 2,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

### Match Error Handling

- Raises error if reconciliation cannot be resolved.
- Raises error for N-N matching when `strict` is not true.
- Raises error when strict N-N lists have different lengths.

---

## Finance.BankReconciliation.Reset

**Direction**: Inbound

**Purpose**: Removes all match stamps from every line in a bank reconciliation by invoking the standard BC helper `Match Bank Rec. Lines.RemoveMatchesFromRecLines`.

### Reset Data Effects

For every BLE previously stamped by `Match`:

- `Bank Account Ledger Entry."Statement No."` -> blank
- `Bank Account Ledger Entry."Statement Line No."` -> 0
- `Bank Account Ledger Entry."Statement Status"` -> `Open`
- Any `Bank Acc. Rec. Match Buffer` rows for the line are removed

For each affected `Bank Acc. Reconciliation Line`:

- `Applied Amount` -> 0
- `Applied Entries` -> 0
- `Difference` -> `Statement Amount`

### Reset Request Format

```json
{
  "specversion": "1.0",
  "type": "Finance.BankReconciliation.Reset",
  "source": "MyIntegrationApp v1.0",
  "subject": "<reconciliation-systemid>",
  "data": {}
}
```

### Reset Response Format

```json
{
  "status": "Success",
  "mode": "ResetAll",
  "resetLineCount": 0,
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

### Reset Error Handling

Raises error if reconciliation cannot be resolved.

---

## Finance.BankReconciliation.Post

**Direction**: Inbound

**Purpose**: Posts a bank reconciliation using standard Business Central posting logic (codeunit `Bank Acc. Reconciliation Post`).

### Post Data Effects

- Validates that `Statement Ending Balance` equals the bank account balance after the reconciliation.
- For every matched `Bank Account Ledger Entry`: sets `Open = false` and `Statement Status = Closed` (the `Statement No.` / `Statement Line No.` stamps remain for audit).
- Posts G/L entries for reconciliation lines with offsetting accounts.
- Deletes the `Bank Acc. Reconciliation` header and all of its `Bank Acc. Reconciliation Line` rows.
- Writes a `Posted Bank Acc. Reconciliation` history record (look up by `Bank Account No.` + `Statement No.`).

### Post Request Format

```json
{
  "specversion": "1.0",
  "type": "Finance.BankReconciliation.Post",
  "source": "MyIntegrationApp v1.0",
  "subject": "<reconciliation-systemid>",
  "data": {}
}
```

### Post Response Format

```json
{
  "status": "Success",
  "bankAccountNo": "BANK-MAIN",
  "statementNo": "STMT-000123",
  "reconciliationSystemId": "<guid>"
}
```

### Post Error Handling

- Raises error if reconciliation cannot be resolved.
- Raises error when posting preconditions fail in standard posting routines.

---

## Finance.GeneralJournal.Post

**Direction**: Inbound (modifies data — posts journal and clears lines)

**Purpose**: Posts a fully validated general journal batch to create ledger entries.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.Post",
  "source": "MyIntegrationApp v1.0",
  "subject": "GENERAL|BATCH001",
  "id": "b2c3d4e5-6789-01bc-def2-234567890abc",
  "time": "2024-01-15T14:20:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Journal Batch Identification

The journal batch can be identified in three ways:

1. **Pipe-separated in subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId in subject**: `"subject": "guid-without-braces"`
3. **JSON data parameters**:
```json
{
  "data": {
    "templateName": "GENERAL",
    "batchName": "BATCH001"
  }
}
```

JSON data parameters take precedence over the subject field.

### Response Format

#### Success
```json
{
  "status": "Success",
  "templateName": "GENERAL",
  "batchName": "BATCH001",
  "batchDescription": "Default Journal Batch",
  "linesPosted": 6,
  "postingDate": "2024-01-15",
  "totalAmount": 0.0,
  "totalAmountLCY": 0.0,
  "glRegisterNo": 42,
  "glRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 1001,
  "toEntryNo": 1006,
  "fromVATEntryNo": 501,
  "toVATEntryNo": 502
}
```

#### Error Response
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
| `totalAmount` | decimal | Total Amount posted |
| `totalAmountLCY` | decimal | Total Amount (LCY) posted |
| `glRegisterNo` | integer | G/L Register number created by posting |
| `glRegisterId` | string | G/L Register SystemId (GUID without braces) |
| `fromEntryNo` | integer | First G/L Entry No. in register |
| `toEntryNo` | integer | Last G/L Entry No. in register |
| `fromVATEntryNo` | integer | First VAT Entry No. in register (0 if none) |
| `toVATEntryNo` | integer | Last VAT Entry No. in register (0 if none) |
| `error` | string | Error message (only on Error status) |
| `callstack` | string | Error callstack (only on Error status) |

### Error Handling

**Common errors:**
- Journal batch not found
- No lines to post in the batch
- Posting validation errors (balance check, required dimensions, etc.)
- Missing journal batch identification
- Nothing posted (posting completed but no register created)

### Notes

- Uses the "Gen. Jnl.-Post Batch" codeunit (80) for posting
- All journal lines are cleared from the batch after successful posting
- The batch record itself remains (only lines are deleted)
- Posting validates all lines before posting (balance check, required fields, dimensions)
- The G/L Register record contains the full audit trail of the posting
- For balanced journals (debits = credits), `totalAmount` and `totalAmountLCY` will be 0.00
- Entry ranges in the G/L Register allow direct retrieval of all posted entries

### Workflow

1. Validate journal batch existence
2. Validate that lines exist in the batch
3. Call "Gen. Jnl.-Post Batch" (codeunit 80) to post all lines
4. Verify G/L Register was created
5. On success: return G/L Register statistics
6. On error: return error message with callstack

**Recommended approach:** Validate with `Finance.GeneralJournal.Check` first, then post with `Finance.GeneralJournal.Post`.

### Security Considerations

- Posting general journals requires specific permissions in BC
- All posted entries maintain `Journal Batch Name` for traceability
- Consider adding field restrictions for sensitive fields (e.g., posting dates, account numbers)

### Related Message Types

- [Finance.GeneralJournal.SetupNewLine](#financegeneraljournalsetupnewline) - Create a new journal line with defaults
- [Finance.GeneralJournal.Check](#financegeneraljournalcheck) - Validate before posting
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget) - Retrieve journal lines before posting
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset) - Create or update journal lines
- [Help.Tables.Get](/foundation/message-types/metadata/#helptablesget) - Get metadata about Gen. Journal Line table

---

## Finance.GeneralJournal.PreviewPost

**Direction**: Inbound (simulates posting; no data modification)

**Purpose**: Simulates posting a general journal batch and returns the resulting ledger entries (G/L Entry, VAT Entry, Customer/Vendor/Bank/Employee Ledger Entry, FA Ledger Entry, Job Ledger Entry, and any other ledger table populated by the BC posting routine) **without committing changes**. The full `Gen. Jnl.-Post` routine runs inside a transaction that is rolled back at the end after the captured entries are read into temporary records.

Use this message type to:
- Validate that a general journal batch can be posted before actually posting it.
- Show an AI agent (or a user) the exact financial impact of posting the batch.
- Confirm that debits/credits balance and inspect the entries that would be created.

### Input Parameters

Journal batch identification (at least one method required). First matched wins:

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
  "summary": "Preview-posting general journal batch GENERAL|DEFAULT (3 lines) would create 6 ledger entries across 2 tables. Transaction is balanced.",
  "templateName": "GENERAL",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 3,
  "postingDate": "2024-01-15",
  "lcyCode": "USD",
  "predictedDocumentNos": ["DOC-001", "DOC-002"],
  "totals": {
    "balanced": true,
    "totalDebitLCY": 1500.00,
    "totalCreditLCY": 1500.00
  },
  "preview": [
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "tableCaption": "G/L Entry",
      "description": "General ledger entries posted as a result of this document",
      "entryCount": 6,
      "entries": [ /* one JSON object per captured G/L Entry */ ]
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always `"Success"` on a completed preview, `"Error"` otherwise. |
| `rollback` | boolean | Always `true` — confirms no data was persisted. |
| `summary` | string | One-line natural-language description of the simulated posting. |
| `templateName` | string | Journal template name. |
| `batchName` | string | Journal batch name. |
| `batchDescription` | string | Journal batch description. |
| `linesToPost` | integer | Number of journal lines that would be posted. |
| `postingDate` | string | Posting date from the first line (ISO format). |
| `lcyCode` | string | Local Currency code from General Ledger Setup. |
| `predictedDocumentNos` | string[] | Distinct Document Nos found in captured G/L Entry rows (informational only — No. Series state may change between preview and actual post). |
| `totals.balanced` | boolean | `true` when `totalDebitLCY = totalCreditLCY` (rounded to 0.01). |
| `totals.totalDebitLCY` / `totalCreditLCY` | decimal | Sum of G/L Entry Debit/Credit amounts in LCY. |
| `preview` | array | One element per ledger table populated by the BC posting routine. |
| `preview[].tableId` | integer | BC table number. |
| `preview[].tableName` | string | BC table name. |
| `preview[].entryCount` | integer | Number of entries captured. |
| `preview[].entries` | array | One JSON object per captured entry; field names follow the same mechanical PascalCase rules as `Data.Records.Get`. Restricted fields are omitted per `Field Access ori`. |

### Currency Handling

A general journal batch can contain lines in multiple currencies. The top-level `totals` object therefore reports only LCY totals. Per-entry currency context (`CurrencyCode`, `Amount`, `AmountLCY`) remains available inside the `preview` array on each individual ledger entry.

### Error Handling

Errors are reported as `{ "status": "Error", "error": "..." }` instead of throwing. Common errors:
- Missing journal batch identification.
- Journal batch not found.
- Journal batch has no lines to preview.
- Posting validation failed (unbalanced batch, missing G/L accounts, dimension errors, etc.) — the underlying BC error text is returned.

### Related Message Types

- [Finance.GeneralJournal.Check](#financegeneraljournalcheck) - Validates the batch without simulating the post.
- [Finance.GeneralJournal.Post](#financegeneraljournalpost) - Actually posts the batch (no rollback).
- [Sales.Document.PreviewPost](/foundation/message-types/sales/#salesdocumentpreviewpost) / [Purchase.Document.PreviewPost](/foundation/message-types/purchase/#purchasedocumentpreviewpost) - Document-level preview-post equivalents.

---

## Finance.GeneralJournal.ReverseRegister

**Direction**: Inbound (reverses posted entries)

**Purpose**: Reverses all G/L entries in a specified G/L Register. This creates new correcting entries that offset the original entries in the register.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.ReverseRegister",
  "source": "dynamics365/businesscentral",
  "subject": "42",
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "time": "2024-01-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Register Identification

The subject identifies the G/L Register to reverse:

1. **Register No. (integer)**: `"subject": "42"` — the G/L Register "No." field value
2. **SystemId (GUID)**: `"subject": "a1b2c3d4-5678-90ab-cdef-1234567890ab"` — the SystemId of the G/L Register record

### Response Format

**Success:**
```json
{
  "status": "Success",
  "reversedRegisterNo": 42,
  "fromEntryNo": 100,
  "toEntryNo": 105
}
```

**Error:**
```json
{
  "status": "Error",
  "error": "The register has already been reversed.",
  "callstack": "..."
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | Text | `Success` or `Error` |
| `reversedRegisterNo` | Integer | The G/L Register No. that was reversed |
| `fromEntryNo` | Integer | First entry number in the register |
| `toEntryNo` | Integer | Last entry number in the register |
| `error` | Text | Error message (only on failure) |
| `callstack` | Text | AL callstack (only on failure) |

### Validations

- Subject must be a valid integer or GUID
- G/L Register must exist (by No. or SystemId)
- G/L Register must not already be reversed

### Workflow

1. Identify G/L Register (by No. or SystemId lookup)
2. Validate register exists and is not already reversed
3. Execute reversal using isolated write codeunit (Codeunit.Run pattern)
4. On success: return register statistics
5. On error: return error message with callstack

### Related Message Types

- [Finance.GeneralJournal.ReverseTransaction](#financegeneraljournalreversetransaction) - Reverse by transaction number
- [Finance.GeneralJournal.Post](#financegeneraljournalpost) - Post a journal batch (creates registers)

---

## Finance.GeneralJournal.ReverseTransaction

**Direction**: Inbound (reverses posted entries)

**Purpose**: Reverses all G/L entries sharing a specified transaction number. This creates new correcting entries that offset the original transaction entries.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.ReverseTransaction",
  "source": "dynamics365/businesscentral",
  "subject": "1234",
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "time": "2024-01-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Transaction Identification

The subject identifies the transaction to reverse:

1. **Transaction No. (integer)**: `"subject": "1234"` — the transaction number
2. **SystemId (GUID)**: `"subject": "a1b2c3d4-5678-90ab-cdef-1234567890ab"` — the SystemId of any G/L Entry in the transaction; the Transaction No. is extracted from the entry

### Response Format

**Success:**
```json
{
  "status": "Success",
  "reversedTransactionNo": 1234,
  "entriesReversed": 4
}
```

**Error:**
```json
{
  "status": "Error",
  "error": "The transaction has already been reversed.",
  "callstack": "..."
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | Text | `Success` or `Error` |
| `reversedTransactionNo` | Integer | The transaction number that was reversed |
| `entriesReversed` | Integer | Number of G/L entries reversed |
| `error` | Text | Error message (only on failure) |
| `callstack` | Text | AL callstack (only on failure) |

### Validations

- Subject must be a valid integer or GUID
- At least one G/L Entry must exist for the transaction (by Transaction No. or SystemId lookup)
- Transaction must not already be reversed

### Workflow

1. Identify transaction (by Transaction No. or by looking up the G/L Entry via SystemId)
2. Validate entries exist and are not already reversed
3. Execute reversal using isolated write codeunit (Codeunit.Run pattern)
4. On success: return transaction statistics
5. On error: return error message with callstack

### Related Message Types

- [Finance.GeneralJournal.ReverseRegister](#financegeneraljournalreverseregister) - Reverse by register number
- [Finance.GeneralJournal.Post](#financegeneraljournalpost) - Post a journal batch (creates transactions)

---

## Finance.GeneralJournal.SetupNewLine

**Direction**: Inbound (creates a new journal line)

**Purpose**: Creates and inserts a new general journal line in the specified batch, pre-populated with defaults from BC's `SetUpNewLine` procedure. This is the default way to prepare a general journal line before populating business fields via `Data.Records.Set`.

Default values inherited from the template and batch include Bal. Account Type, Bal. Account No., Document Type, and Posting Date. If a No. Series is configured on the journal batch, the Document No. is automatically populated from the next number in the series.

The line is assigned the next available Line No. (last line + 10000, or 10000 if the batch is empty).

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Finance.GeneralJournal.SetupNewLine",
  "source": "MyIntegrationApp v1.0",
  "subject": "GENERAL|DEFAULT",
  "id": "c3d4e5f6-7890-12cd-ef34-567890abcdef",
  "time": "2026-04-15T10:00:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Journal Batch Identification

The journal batch can be identified in three ways:

1. **Pipe-separated in subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId in subject**: `"subject": "guid-without-braces"`
3. **JSON data parameters**:
```json
{
  "data": {
    "templateName": "GENERAL",
    "batchName": "DEFAULT"
  }
}
```

JSON data parameters take precedence over the subject field.

#### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fieldNumbers` | int[] | all fields | Field numbers to include in response. When omitted, all fields are returned. |

```json
{
  "data": {
    "templateName": "GENERAL",
    "batchName": "DEFAULT",
    "fieldNumbers": [1, 2, 3, 5, 8]
  }
}
```

### Response Format

The response uses the same format as `Data.Records.Get`: a single record in the `result` array with `id`, `primaryKey`, and `fields`.

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
        "BalAccountNo_": "29900",
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
| `noOfRecords` | integer | Always 1 on success |
| `result` | array | Single-element array containing the new journal line |
| `result[].id` | string | SystemId of the newly inserted journal line (GUID) |
| `result[].primaryKey` | object | Primary key fields: JournalTemplateName, JournalBatchName, LineNo_ |
| `result[].fields` | object | All non-PK fields (or only those in `fieldNumbers` if specified) |

### Behaviour

1. The batch is identified using one of the three methods above.
2. The last existing line in the batch is found (if any).
3. A new line is initialised with Template Name, Batch Name, and next Line No.
4. BC's `SetUpNewLine` is called, passing the last line as reference (or an empty line if the batch has no lines). This applies default values from the template and batch: Bal. Account Type, Bal. Account No., Document Type, Posting Date, etc. If a No. Series is configured on the batch, the Document No. is populated from the next number in the series.
5. The line is inserted with triggers.
6. The response returns the record in `Data.Records.Get` format.

### Typical Workflow

1. Call `Finance.GeneralJournal.SetupNewLine` to create a line with defaults.
2. Use the returned `id` (SystemId) with `Data.Records.Set` to populate Account No., Amount, etc.
3. Repeat steps 1–2 for each journal line.
4. Call `Finance.GeneralJournal.Check` to validate the batch.
5. Call `Finance.GeneralJournal.Post` to post.

### Error Handling

| Error | Cause |
|-------|-------|
| Missing identification | No template/batch, SystemId, or pipe-separated subject provided |
| Batch not found | The specified batch does not exist |

### Related Message Types

- [Finance.GeneralJournal.Check](#financegeneraljournalcheck) — Validate journal batch before posting
- [Finance.GeneralJournal.Post](#financegeneraljournalpost) — Post a validated journal batch
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset) — Update fields on the newly created line
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget) — Read journal lines (same response format)

---

## Finance.FAJournal.SetupNewLine

**Direction**: Inbound (creates a new journal line)

**Purpose**: Creates and inserts a new fixed asset journal line in the specified batch, pre-populated with defaults from BC's `SetUpNewLine` procedure. This is the default way to prepare a fixed asset journal line before populating business fields via `Data.Records.Set`.

Default values inherited from the template and batch include FA Posting Type, Posting Date, Depreciation Book Code, and Document No. (when a No. Series is configured). The line is assigned the next available Line No. (last line + 10000, or 10000 if the batch is empty).

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Finance.FAJournal.SetupNewLine",
  "source": "MyIntegrationApp v1.0",
  "subject": "ASSETS|DEFAULT",
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
    "templateName": "ASSETS",
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
        "JournalTemplateName": "ASSETS",
        "JournalBatchName": "DEFAULT",
        "LineNo_": 10000
      },
      "fields": {
        "PostingDate": "2026-04-15",
        "DocumentNo_": "FA-00001",
        "FAPostingType": "Acquisition Cost",
        "DepreciationBookCode": "COMPANY",
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

1. Call `Finance.FAJournal.SetupNewLine` to create lines with defaults.
2. Use the returned `id` with `Data.Records.Set` to populate FA No., Amount, etc.
3. Call `Finance.FAJournal.Check` to validate.
4. Call `Finance.FAJournal.Post` to post.

### Error Handling

| Error | Cause |
|-------|-------|
| Missing identification | No template/batch, SystemId, or pipe-separated subject provided |
| Batch not found | The specified batch does not exist |

### Related Message Types

- [Finance.FAJournal.Check](#financefajournalcheck)
- [Finance.FAJournal.Post](#financefajournalpost)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)

---

## Finance.FAJournal.Check

**Direction**: Outbound (validation only, no data modification)

**Purpose**: Validates a fixed asset journal batch without posting. Returns readiness status with detailed validation results.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Finance.FAJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "ASSETS|DEFAULT",
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
  "templateName": "ASSETS",
  "batchName": "DEFAULT",
  "batchDescription": "Default FA Batch",
  "lineCount": 2,
  "totalAmount": 25000.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

#### ReadyWithWarnings / NotReady

Same shape with `validationResult` set accordingly and populated `errors` / `warnings` arrays.

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "Success" for validation |
| `validationResult` | string | "Ready", "ReadyWithWarnings", or "NotReady" |
| `templateName` | string | Journal template name |
| `batchName` | string | Journal batch name |
| `batchDescription` | string | Journal batch description |
| `lineCount` | integer | Number of journal lines in batch |
| `totalAmount` | decimal | Sum of Amount on all lines |
| `errorCount` | integer | Number of blocking errors |
| `warningCount` | integer | Number of non-blocking warnings |
| `errors` | array | Error messages (prevent posting) |
| `warnings` | array | Warning messages (posting allowed) |

### Validation Rules

Uses BC's "FA Jnl.-Check Line" codeunit via the Error Message Management framework to collect all errors in a single pass.

**Per-Line Validation includes:**
- Required fields (Posting Date, Document No., FA No., FA Posting Type, Amount ≠ 0)
- Posting period
- Fixed Assets: Must exist, not be Blocked
- Depreciation Book: Must exist and be valid for the asset
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

- [Finance.FAJournal.SetupNewLine](#financefajournalsetupnewline)
- [Finance.FAJournal.Post](#financefajournalpost)
- [Help.Tables.Get](/foundation/message-types/metadata/#helptablesget)

---

## Finance.FAJournal.Post

**Direction**: Inbound (modifies data — posts journal and clears lines)

**Purpose**: Posts a validated fixed asset journal batch to create FA Ledger Entries.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Finance.FAJournal.Post",
  "source": "MyIntegrationApp v1.0",
  "subject": "ASSETS|BATCH001",
  "data": {}
}
```

Identification follows the same three-method pattern.

### Response Format

#### Success
```json
{
  "status": "Success",
  "templateName": "ASSETS",
  "batchName": "BATCH001",
  "batchDescription": "Default FA Batch",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 0.0,
  "totalAmount": 25000.0,
  "faRegisterNo": 11,
  "faRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 401,
  "toEntryNo": 402
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
| `totalQuantity` | decimal | Total Quantity posted (typically 0 for FA journals) |
| `totalAmount` | decimal | Total Amount posted |
| `faRegisterNo` | integer | FA Register number created (when register was produced) |
| `faRegisterId` | string | FA Register SystemId (GUID without braces) |
| `fromEntryNo` | integer | First FA Ledger Entry No. in register |
| `toEntryNo` | integer | Last FA Ledger Entry No. in register |
| `error` | string | Error message (only on Error status) |
| `callstack` | string | Error callstack (only on Error status) |

### Error Handling

**Common errors:**
- Journal batch not found
- No lines to post
- Posting validation errors (FA blocked, missing depreciation book, etc.)
- Missing journal batch identification

### Notes

- Uses BC's "FA Jnl.-Post Batch" codeunit for posting
- All journal lines are cleared from the batch after successful posting
- Posting is wrapped in an isolated codeunit so errors return a structured response with `callstack`

**Recommended approach:** Validate with `Finance.FAJournal.Check` first, then post with `Finance.FAJournal.Post`.

### Related Message Types

- [Finance.FAJournal.SetupNewLine](#financefajournalsetupnewline)
- [Finance.FAJournal.Check](#financefajournalcheck)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)

---

## Finance.FAJournal.PreviewPost

**Direction**: Inbound (simulates posting; no data modification)

**Purpose**: Simulates posting a Fixed Asset Journal batch and returns the ledger entries that **would** be produced — without writing anything to the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `FA Jnl.-Post` subscriber. Captured tables typically include `Maintenance Ledger Entry` and (for posting types that integrate to G/L) `FA Ledger Entry`, `G/L Entry`, `VAT Entry`, and ledger entries on the offset account.

### Input Parameters

FA Journal batch identification (first matched wins):

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
  "summary": "Preview-posting FA journal batch ASSETS|BATCH001 (1 line, type Maintenance) would create 1 ledger entry across 1 table. No G/L impact.",
  "templateName": "ASSETS",
  "batchName": "BATCH001",
  "batchDescription": "Default FA Batch",
  "linesToPost": 1,
  "postingDate": "2026-04-15",
  "lcyCode": "ISK",
  "predictedDocumentNos": [],
  "totals": { "balanced": true, "totalDebitLCY": 0.0, "totalCreditLCY": 0.0 },
  "preview": [
    {
      "tableId": 5625,
      "tableName": "Maintenance Ledger Entry",
      "tableCaption": "Maintenance Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "FANo_": "FA000010", "FAPostingType": "Maintenance", "Amount": "-2500", "DocumentNo_": "MNT-0001" }
        }
      ]
    }
  ]
}
```

For G/L-integrated postings (Acquisition Cost, Depreciation, Disposal, etc.) the `preview[]` array additionally contains `FA Ledger Entry` (5601), `G/L Entry` (17), and offset-account ledger entries, and `totals.totalDebitLCY/totalCreditLCY` reflect the G/L impact.

### Response Fields

Same envelope as `Inventory.ItemJournal.PreviewPost` (`rollback`, `summary`, `totals`, `preview[]` with `tableCaption` + per-entry `id`/`primaryKey`/`fields`). FA-specific notes:

| Field | Description |
|-------|-------------|
| `predictedDocumentNos` | Empty for Maintenance-only posting (no G/L Entries produced). Populated for G/L-integrated posting types. |
| `totals` | Always `balanced=true` with zero amounts for Maintenance-only posting. |

### Operational Notes

- **FA Posting Type routing is controlled by the Depreciation Book.** Each `G/L Integration - {Type}` flag on the FA Depreciation Book card determines whether postings of that type must go through the **General Journal** (when `true`) instead of the FA Journal.
  - When `G/L Integration - Acquisition Cost = true` (the BC default), `Account Type = Fixed Asset` lines for Acquisition Cost **must be posted via** `Finance.GeneralJournal.PreviewPost` / `Finance.GeneralJournal.Post`. Attempting to post them in the FA Journal returns: `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...`.
  - The same applies to Depreciation, Disposal, Maintenance, and other types whose `G/L Integration - {Type}` flag is enabled.
- **CRONUS demo caveat:** On the `FYRIRTAEKI` / `FYRIRTÆKI` depreciation book all `G/L Integration - {Type}` flags are enabled by default, so the only FA posting type that succeeds in the FA Journal is one whose G/L Integration flag is `false`. To exercise the FA Journal flow against CRONUS, temporarily set the relevant flag to `false`.
- **For G/L-integrated postings, prefer the General Journal route** — use `Finance.GeneralJournal.PreviewPost` with `Account Type = Fixed Asset` and `FA Posting Type = {Acquisition Cost \| Depreciation \| Disposal}`.
- The preview rolls back, but does not undo metadata changes made before the call (e.g. batch description updates).

### Errors

BC validation errors propagate verbatim. Common errors:
- `FA journal batch must be identified via subject (TEMPLATE|BATCH or SystemId) or data parameters (templateName, batchName).`
- `FA journal batch {template}|{batch} not found.`
- `FA journal batch {template}|{batch} has no lines to post.`
- `FA Posting Type {Type} must be posted in the general journal in FA Journal Line ...` — the depreciation book's `G/L Integration - {Type}` flag is `true`. Either flip the flag or use the General Journal route.
- `Posting preview failed and no entries were captured. The FA journal cannot be posted in its current state.` — rare catch-all.

### Related Message Types

- [Finance.FAJournal.Check](#financefajournalcheck) - Validate without simulating the post.
- [Finance.FAJournal.Post](#financefajournalpost) - Actually post.
- [Finance.GeneralJournal.PreviewPost](#financegeneraljournalpreviewpost) - The recommended path for G/L-integrated FA postings.

---

## Implementation Details

### Object IDs

| Object Type | Object ID | Object Name |
|-------------|-----------|-------------|
| Enum Value | 10077935 | Finance.GeneralJournal.Check |
| Implementation Codeunit | 10078105 | Gen. Journal Check Impl ori |
| Help Codeunit | 10077955 | Gen. Journal Check Help ori |
| Enum Value | 10077936 | Finance.GeneralJournal.Post |
| Implementation Codeunit | 10078106 | Gen. Journal Post Impl ori |
| Help Codeunit | 10077956 | Gen. Journal Post Help ori |
| Enum Value | 10077937 | Finance.GeneralJournal.SetupNewLine |
| Implementation Codeunit | 10078104 | Gen. Jnl. SetupLine Impl ori |
| Help Codeunit | 10077954 | Gen. Jnl. SetupLine Help ori |
| Enum Value | 10077938 | Finance.GeneralJournal.ReverseRegister |
| Implementation Codeunit | 10078107 | Gen. Jnl. Reverse Reg Impl ori |
| Help Codeunit | 10077952 | Gen. Jnl. Reverse Reg Help ori |
| Enum Value | 10077939 | Finance.GeneralJournal.ReverseTransaction |
| Implementation Codeunit | 10078108 | Gen. Jnl. Reverse Trx Impl ori |
| Help Codeunit | 10077953 | Gen. Jnl. Reverse Trx Help ori |
| Helper Codeunit | 10078103 | Gen. Jnl. Reverse Process ori |
| Enum Value | 10078088 | Finance.FAJournal.SetupNewLine |
| Implementation Codeunit | 10078099 | FA Jnl. SetupLine Impl ori |
| Help Codeunit | 10077948 | FA Jnl. SetupLine Help ori |
| Enum Value | 10078089 | Finance.FAJournal.Check |
| Implementation Codeunit | 10078100 | FA Journal Check Impl ori |
| Help Codeunit | 10077949 | FA Journal Check Help ori |
| Enum Value | 10078090 | Finance.FAJournal.Post |
| Implementation Codeunit | 10078101 | FA Journal Post Impl ori |
| Help Codeunit | 10077950 | FA Journal Post Help ori |
| Enum Value | 10078124 | Finance.FAJournal.PreviewPost |
| Implementation Codeunit | 10078098 | FA Jnl. Preview Post Impl ori |
| Help Codeunit | 10077947 | FA Jnl. Preview Post Help ori |

### File Locations

```
app/src/Message Type/
  Implementations/Finance/
    GenJournalCheckImpl.Codeunit.al
    GenJournalPostImpl.Codeunit.al
    GenJnlSetupLineImpl.Codeunit.al
    GenJournalReverseRegisterImpl.Codeunit.al
    GenJournalReverseTransImpl.Codeunit.al
    GenJournalReverseProcess.Codeunit.al
  Help/Finance/
    GenJournalCheckHelp.Codeunit.al
    GenJournalPostHelp.Codeunit.al
    GenJnlSetupLineHelp.Codeunit.al
    GenJnlReverseRegisterHelp.Codeunit.al
    GenJnlReverseTransHelp.Codeunit.al
    FAJnlSetupLineHelp.Codeunit.al
    FAJournalCheckHelp.Codeunit.al
    FAJournalPostHelp.Codeunit.al
```

FA implementations:
```
app/src/Message Type/
  Implementations/Finance/
    FAJnlSetupLineImpl.Codeunit.al
    FAJournalCheckImpl.Codeunit.al
    FAJournalPostImpl.Codeunit.al
    FAJnlPreviewPostImpl.Codeunit.al
  Help/Finance/
    FAJnlPreviewPostHelp.Codeunit.al
```

---

## Testing

Test codeunits:
- **95334**: Gen. Journal Check Tests
- **95335**: Gen. Journal Post Tests
- **95379**: Gen. Journal Reverse Tests

Test coverage includes:
- All three identification methods (pipe-separated, SystemId, JSON parameters)
- Ready / ReadyWithWarnings / NotReady states
- Balanced and unbalanced journals
- Success and error scenarios
- Batch not found and missing lines scenarios
- Posting validation errors
- Register reversal (by No. and by SystemId)
- Transaction reversal (by No. and by SystemId)
- Already-reversed and not-found error handling

---

## See Also

- [API Reference](/foundation/reference/api/)
- [Data Message Types](/foundation/message-types/data/)
- [Setup Reference](/foundation/reference/setup/)



---

## Finance.VAT.CalcAndPostSettlement

**Direction**: Inbound

**Purpose**: Calculates and optionally posts a VAT settlement by invoking report 20 *Calc. and Post VAT Settlement*. Preview (`post=false`) returns the aggregated VAT entries that would be settled. Post (`post=true`) performs the posting through the standard report and returns the new G/L Register number plus the resulting VAT entry range.

### Settlement Workflow

1. Caller sends a preview request (`post=false`, the default) to inspect the totals and per-posting-group breakdown for a given period and account.
2. Caller reviews the aggregated `totals` and `byPostingGroup` arrays; no posting has occurred.
3. Caller sends the same request with `post=true` to actually post. The implementation:
   - Snapshots the current last `G/L Register."No."`.
   - Delegates posting to an isolated codeunit that sets the parameters through report 20's typed `InitializeRequest` API and runs it headless via `SaveAs` to a discarded stream. (Report 20 has a layout, so `RunModal` would attempt a client download callback that is unsupported in the web-service session; `SaveAs` processes and posts without it.) Errors raised by the report are captured into the response without rolling back the surrounding transaction.
   - After the report run, finds the new `G/L Register` (No. greater than the snapshot) and returns its `No.`, `From VAT Entry No.`, and `To VAT Entry No.`.
4. The settlement transfers the open VAT entries onto the `settlementAccountNo` G/L account and closes them. Individual VAT entries are intentionally excluded from the response — use `Data.Records.Get` against `VAT Entry` filtered by the returned entry-no. range when line-level detail is needed.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Finance.VAT.CalcAndPostSettlement",
  "source": "MyIntegrationApp v1.0",
  "data": {
    "startingDate": "2026-01-01",
    "endingDate": "2026-01-31",
    "postingDate": "2026-02-01",
    "documentNo": "VAT-2026-01",
    "settlementAccountNo": "2150",
    "post": true,
    "showAmountsInAddCurrency": false,
    "vatBusPostingGroup": "DOMESTIC|EU",
    "vatProdPostingGroup": "VAT24",
    "vatRegistrationNo": "",
    "type": "Sale"
  }
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `startingDate` | date (ISO 8601) | Yes | First posting date included in the settlement range. |
| `endingDate` | date (ISO 8601) | Yes | Last posting date included. Must be on or after `startingDate`. |
| `postingDate` | date (ISO 8601) | Yes | Posting date for the settlement G/L entry. |
| `documentNo` | Code[20] | Yes | Document number for the settlement G/L entry. |
| `settlementAccountNo` | Code[20] | Yes | Target G/L account. Must exist, be Posting type, and not blocked. |
| `post` | boolean | No (default `false`) | `true` runs the report and posts; `false` returns aggregation only. |
| `showAmountsInAddCurrency` | boolean | No (default `false`) | Passes the corresponding option to the report. |
| `vatBusPostingGroup` | text | No | Optional VAT Entry filter expression. |
| `vatProdPostingGroup` | text | No | Optional VAT Entry filter expression. |
| `vatRegistrationNo` | text | No | Optional VAT Entry filter expression. |
| `type` | text | No | Optional VAT Entry filter on `Type` (`Purchase`, `Sale`, or `Purchase\|Sale`). Defaults to both. |

### Response Format

**Success — preview (`post=false`)**

```json
{
  "status": "Success",
  "posted": false,
  "documentNo": "VAT-2026-01",
  "postingDate": "2026-02-01",
  "settlementAccountNo": "2150",
  "startingDate": "2026-01-01",
  "endingDate": "2026-01-31",
  "showAmountsInAddCurrency": false,
  "lcyCode": "ISK",
  "totals": {
    "vatBase": 1000000.00,
    "vatAmount": 240000.00,
    "vatBaseACY": 0.00,
    "vatAmountACY": 0.00,
    "entryCount": 42
  },
  "byPostingGroup": [
    {
      "type": "Sale",
      "vatBusPostingGroup": "DOMESTIC",
      "vatProdPostingGroup": "VAT24",
      "entryCount": 15,
      "vatBase": 600000.00,
      "vatAmount": 144000.00,
      "vatBaseACY": 0.00,
      "vatAmountACY": 0.00
    }
  ]
}
```

**Success — posted (`post=true`)**

Adds the four posting fields below the preview shape:

```json
{
  "status": "Success",
  "posted": true,
  "glRegisterNo": 1234,
  "fromVATEntryNo": 5678,
  "toVATEntryNo": 5720,
  "settlementVATEntryCount": 43
}
```

**Error**

```json
{
  "status": "Error",
  "error": "Settlement G/L Account 2150 must have Account Type = Posting.",
  "callstack": "..."
}
```

`callstack` is present only when the failure originated inside the isolated report run.

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `Success` or `Error`. |
| `posted` | boolean | `true` only when `post=true` was requested *and* the report run succeeded. |
| `documentNo`, `postingDate`, `settlementAccountNo` | — | Echo of the input used for the settlement. |
| `startingDate`, `endingDate` | date | Echo of the settled posting-date range. |
| `showAmountsInAddCurrency` | boolean | Echo of input. |
| `lcyCode` | Code[10] | LCY code from General Ledger Setup. |
| `totals.vatBase` / `vatAmount` | decimal | Sums across the entire filtered range, in LCY. |
| `totals.vatBaseACY` / `vatAmountACY` | decimal | Sums in the additional reporting currency. |
| `totals.entryCount` | integer | Number of open VAT entries that match the filters. |
| `byPostingGroup[]` | array | One entry per `Type` + `VAT Bus. Posting Group` + `VAT Prod. Posting Group` combination. |
| `byPostingGroup[].type` | string | `Purchase` or `Sale`. |
| `byPostingGroup[].vatBusPostingGroup` / `vatProdPostingGroup` | Code[20] | Group keys. |
| `byPostingGroup[].entryCount` | integer | Number of VAT entries in that group. |
| `byPostingGroup[].vatBase` / `vatAmount` / `vatBaseACY` / `vatAmountACY` | decimal | Group sums. |
| `glRegisterNo` | integer | *Posted only.* `G/L Register."No."` created by the report. |
| `fromVATEntryNo` / `toVATEntryNo` | integer | *Posted only.* Inclusive range of `VAT Entry."Entry No."` written by the settlement. |
| `settlementVATEntryCount` | integer | *Posted only.* `toVATEntryNo - fromVATEntryNo + 1`. |

### Validation Rules

| Check | Error Message |
|-------|---------------|
| `startingDate` present | `startingDate is required.` |
| `endingDate` present | `endingDate is required.` |
| `postingDate` present | `postingDate is required.` |
| `documentNo` present | `documentNo is required.` |
| `settlementAccountNo` present | `settlementAccountNo is required.` |
| `endingDate >= startingDate` | `endingDate (X) must be on or after startingDate (Y).` |
| Settlement account exists | `Settlement G/L Account X does not exist.` |
| Account `"Account Type" = Posting` | `Settlement G/L Account X must have Account Type = Posting.` |
| Account not blocked | `Settlement G/L Account X is blocked.` |
| At least one open VAT entry matches the filters | `No open VAT entries match the supplied filters.` |

### Error Handling

Validation errors return `status=Error` with an `error` field. Errors raised during the actual report run additionally include a `callstack` field for diagnostics. The isolated posting codeunit ensures a failed report run does not roll back the message-processing transaction.

### Notes

- Open VAT entries are identified using `SetRange(Closed, false)` combined with the supplied filters. The same filter is passed to the report so the entries previewed and the entries posted match exactly.
- Aggregation uses `CalcSums(Base, Amount, "Additional-Currency Base", "Additional-Currency Amount")` against the filtered `VAT Entry` record set.
- The per-group breakdown sorts by `Type, VAT Bus. Posting Group, VAT Prod. Posting Group` and accumulates one JSON object per distinct combination.
- Individual VAT entries are deliberately omitted from the response to keep the payload bounded. Retrieve them with `Data.Records.Get` against `VAT Entry` filtered by `Entry No.` between `fromVATEntryNo` and `toVATEntryNo`.
- For a per-VAT-Statement-Line preview of the same underlying VAT entries, use [Finance.VATStatement.Preview](#financevatstatementpreview). See [VAT Settlement Process](#vat-settlement-process) for how the two message types relate.

### Related Message Types

- [Finance.VATStatement.Preview](#financevatstatementpreview) — read-only preview grouped per VAT Statement Line.
- [Finance.GeneralJournal.Post](#financegeneraljournalpost)
- [Finance.GeneralJournal.PreviewPost](#financegeneraljournalpreviewpost)

---

## Finance.VATStatement.Preview

**Direction**: Inbound (read-only)

**Purpose**: Reproduces the standard BC page 474 *VAT Statement Preview* for a given VAT Statement Template/Name. Iterates the VAT Statement Line rows and returns the calculated Column Amount per line via report 12 `"VAT Statement".CalcLineTotal` — the exact same API page 474 uses, so values match. No posting and no database writes.

To enumerate templates and names, call `Data.Records.Get` against `VAT Statement Template` (table 256) or `VAT Statement Name` (table 257).

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Finance.VATStatement.Preview",
  "source": "MyIntegrationApp v1.0",
  "data": {
    "templateName": "DEFAULT",
    "name": "DEFAULT",
    "selection": "Open and Closed",
    "periodSelection": "Within Period",
    "dateFilter": "01/01/25..31/01/25",
    "countryRegionFilter": "",
    "rowNoFilter": "",
    "showAmountsInAddCurrency": false
  }
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `templateName` | Code[10] | Yes | VAT Statement Template name. Must exist. |
| `name` | Code[10] | Yes | VAT Statement Name within the template. Must exist. |
| `selection` | text | No (default `Open and Closed`) | `Open`, `Closed`, or `Open and Closed`. Maps to the page 474 Selection field. |
| `periodSelection` | text | No (default `Within Period`) | `Within Period` or `Before and Within Period`. Maps to the page 474 Period Selection field. |
| `dateFilter` | text | No | Filter expression applied to the VAT Statement Name `Date Filter` FlowFilter (e.g. `01/01/25..31/01/25`). |
| `countryRegionFilter` | text | No | Filter expression for the report `Country/Region Filter` parameter. |
| `rowNoFilter` | text | No | Optional filter on `Row No.` to return a subset of lines (e.g. `100..199`). |
| `showAmountsInAddCurrency` | boolean | No (default `false`) | When `true`, amounts are calculated in the additional reporting currency. |

### Response Format

**Success**

```json
{
  "status": "Success",
  "templateName": "DEFAULT",
  "name": "DEFAULT",
  "description": "Default VAT Statement",
  "selection": "Open and Closed",
  "periodSelection": "Within Period",
  "dateFilter": "01/01/25..31/01/25",
  "countryRegionFilter": "",
  "showAmountsInAddCurrency": false,
  "lineCount": 12,
  "lines": [
    {
      "lineNo": 10000,
      "rowNo": "100",
      "description": "VAT Sales 24%",
      "type": "VAT Entry Totaling",
      "amountType": "Amount",
      "genPostingType": "Sale",
      "vatBusPostingGroup": "DOMESTIC",
      "vatProdPostingGroup": "VAT24",
      "accountTotaling": "",
      "rowTotaling": "",
      "print": true,
      "printWith": "Sign",
      "newPage": false,
      "boxNo": "",
      "columnAmount": 240000.00
    }
  ]
}
```

**Error**

```json
{
  "status": "Error",
  "error": "VAT Statement Name DEFAULT does not exist in template DEFAULT."
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `Success` or `Error`. |
| `templateName` / `name` | Code[10] | Echo of the request. |
| `description` | Text[100] | Description of the VAT Statement Name. |
| `selection` / `periodSelection` | string | Echo of the resolved enum values. |
| `dateFilter` / `countryRegionFilter` | text | Echo of the request filters. |
| `showAmountsInAddCurrency` | boolean | Echo of the request. |
| `lineCount` | integer | Number of VAT Statement Line rows returned. |
| `lines[]` | array | One entry per VAT Statement Line. |
| `lines[].lineNo` | integer | VAT Statement Line `Line No.`. |
| `lines[].rowNo` | Code[10] | VAT Statement Line `Row No.`. |
| `lines[].description` | Text[100] | Row description. |
| `lines[].type` | string | `Account Totaling`, `VAT Entry Totaling`, `Row Totaling`, or `Description`. |
| `lines[].amountType` | string | `Amount`, `Base`, `Unrealized Amount`, `Unrealized Base`, `Full Amount`, `Full Base`, or empty. |
| `lines[].genPostingType` | string | `Purchase`, `Sale`, ` ` (blank), or `Settlement`. |
| `lines[].vatBusPostingGroup` / `vatProdPostingGroup` | Code[20] | VAT posting groups. |
| `lines[].accountTotaling` | Text[30] | G/L account filter expression for `Account Totaling` rows. |
| `lines[].rowTotaling` | Text[50] | Row number filter expression for `Row Totaling` rows. |
| `lines[].print` | boolean | Whether the row is printed. |
| `lines[].printWith` | string | `Sign` or `Opposite Sign`. When `Opposite Sign`, `columnAmount` is already inverted. |
| `lines[].newPage` | boolean | Whether a new page is started before the row. |
| `lines[].boxNo` | Text[30] | Box number used by external VAT reports. |
| `lines[].columnAmount` | decimal \| false | Calculated Column Amount. `false` for `Description` rows or when `CalcLineTotal` returns no amount. |

### Validation Rules

| Check | Error Message |
|-------|---------------|
| `templateName` present | `templateName is required.` |
| `name` present | `name is required.` |
| `selection` is one of `Open`, `Closed`, `Open and Closed` | `selection must be one of: Open, Closed, Open and Closed.` |
| `periodSelection` is one of `Within Period`, `Before and Within Period` | `periodSelection must be one of: Before and Within Period, Within Period.` |
| VAT Statement Template exists | `VAT Statement Template X does not exist.` |
| VAT Statement Name exists within the template | `VAT Statement Name X does not exist in template Y.` |

### Notes

- The implementation calls `Report "VAT Statement".InitializeRequest` once with the resolved options, then iterates `VAT Statement Line` records in `Row No.` order and calls `CalcLineTotal` per row.
- `Description` rows skip the calculation and report `columnAmount = false`.
- Lines whose `Print with = Opposite Sign` get their `columnAmount` inverted to match page 474.
- `dateFilter` is applied to the `Date Filter` FlowFilter on `VAT Statement Name`, which the BC page also does before invoking the report.

### Related Message Types

- [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement) — calculate and post the actual VAT settlement. Same VAT entries, grouped per posting-group instead of per Statement Line. See [VAT Settlement Process](#vat-settlement-process) for the end-to-end workflow.
- [Data.Records.Get](/foundation/message-types/data/) — enumerate `VAT Statement Template` (256) or `VAT Statement Name` (257).

---

## VAT Settlement Process

End-to-end workflow that ties [Finance.VATStatement.Preview](#financevatstatementpreview) and [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement) together. Both message types read the same `VAT Entry` table; they differ in how they aggregate it and what they do with the result.

### Concepts

- **VAT Entry** (table 254): one row per posted VAT-bearing transaction. Has `Type` (`Purchase` / `Sale` / `Settlement`), `Posting Date`, `Base`, `Amount`, `Closed`, `Closed by Entry No.`, and the posting-group keys.
- **Open vs. Closed**: a VAT Entry is *open* while `Closed = false`. The settlement closes the period's open entries and stamps `Closed by Entry No.` with the new Settlement entry number.
- **VAT Statement** (tables 256/257/258): user-defined report layout that groups open and/or closed VAT entries into rows. Used for the VAT return submitted to the tax authority.
- **Settlement G/L Account**: the G/L account that receives the net VAT to pay or reclaim. Must be of type `Posting` and not blocked.
- **Report 20 "Calc. and Post VAT Settlement"**: BC standard report that performs the settlement. Inserts new `Type=Settlement` VAT entries that offset the open ones, marks the open entries as closed, and writes the G/L entries.
- **Report 12 "VAT Statement"**: BC standard report that calculates per-line Column Amounts for a VAT Statement. Page 474 "VAT Statement Preview" calls `Report 12.CalcLineTotal` per row.

### Standard BC Workflow

1. **Post the period's transactions** — sales invoices, purchase invoices, etc. Each posts one or more `VAT Entry` rows with `Closed = false`.
2. **Preview the VAT return** via the VAT Statement. *Bifrost equivalent: `Finance.VATStatement.Preview`.*
3. **Preview the settlement aggregates**. *Bifrost equivalent: `Finance.VAT.CalcAndPostSettlement` with `post=false`.*
4. **Resolve discrepancies**: if step 2 and step 3 disagree, the Statement Template is wrong — fix it and repeat from step 2.
5. **Post the settlement**. *Bifrost equivalent: `Finance.VAT.CalcAndPostSettlement` with `post=true`.*
6. **Submit the VAT return** using the Column Amounts from step 2.
7. **Pay or reclaim** the net amount on the settlement G/L account.

### Two Different Aggregations of the Same Data

| Aspect | `Finance.VATStatement.Preview` | `Finance.VAT.CalcAndPostSettlement` |
|--------|-------------------------------|------------------------------------|
| Grouping | Per VAT Statement Line (Row No.) | Per VAT Bus. + VAT Prod. Posting Group |
| Filter source | `VAT Statement Line` row definition | Request JSON filters on `VAT Entry` |
| Selection | Open / Closed / Open and Closed | Open entries only (`Closed = false`) |
| Date scope | `Date Filter` FlowFilter on the VAT Statement Name | `Posting Date` range |
| Side effect | None (read-only) | None if `post=false`; closes entries + posts G/L if `post=true` |
| Underlying report | Report 12 `CalcLineTotal` per line | Report 20 `Execute` for the whole settlement |

### Reconciliation Rule

For a correctly-defined VAT Statement, the sum of the VAT-amount rows of `Finance.VATStatement.Preview` for a given period equals `totals.vatAmount` returned by `Finance.VAT.CalcAndPostSettlement` for the same period and posting-group filters. When they disagree:

- The Statement Template is missing a posting-group combination that exists in the VAT entries, or
- A row uses `Print with = Opposite Sign` incorrectly, or
- A row's `Account Totaling` / `Row Totaling` filter is wrong.

### What the Settlement Posts

Report 20 produces exactly one G/L Register containing:

- One `G/L Entry` per affected VAT account, debiting/crediting to zero out the open VAT.
- One `G/L Entry` on the `settlementAccountNo` carrying the net amount (positive = payable, negative = receivable).
- One new `VAT Entry` per affected posting-group combination with `Type = Settlement` and a negative copy of the closed amounts. The closed source entries are stamped with `Closed by Entry No.` pointing at the new Settlement entry.

The `Finance.VAT.CalcAndPostSettlement` post response returns the bounding `G/L Register No.`, `fromVATEntryNo`, and `toVATEntryNo` so the caller can retrieve the rows via `Data.Records.Get`.

### Idempotency

Re-running a successful posted settlement for the same period (without new postings in between) fails with `No open VAT entries match the supplied filters.` This is the intended guard: a settlement is allowed once per period per filter combination.

---

## Finance.Currency.AdjustExchangeRates

**Direction**: Inbound

**Purpose**: Runs BC `Exch. Rate Adjmt. Process` (codeunit 699) for foreign-currency revaluation. Two modes:

- `post=false` (default): preview only — captures the simulated G/L, customer, vendor, employee, and bank-account entries via the BC posting-preview framework and rolls back. No database state changes.
- `post=true`: performs the run inside an isolated `Codeunit.Run`. The response contains the new G/L Register, the resulting G/L Entry range, and a per-currency breakdown of adjusted LCY amounts.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Finance.Currency.AdjustExchangeRates",
  "source": "dynamics365/businesscentral",
  "id": "<event-guid>",
  "time": "2025-12-31T00:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "endingDate": "2025-12-31",
    "postingDate": "2025-12-31",
    "documentNo": "FX-2025-12",
    "currencyCode": "USD|EUR",
    "adjustCustomers": true,
    "adjustVendors": true,
    "adjustEmployees": false,
    "adjustBankAccounts": true,
    "adjustGLAccounts": true,
    "post": true
  }
}
```

### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endingDate | Date | Yes | Last posting date considered for adjustment. All open ledger entries with posting date on or before this date are evaluated. |
| postingDate | Date | Yes | Posting date for the adjustment G/L entries. |
| documentNo | Code[20] | Yes | Document number on the adjustment G/L entries. |
| post | Boolean | No (default false) | `true` to run and commit; `false` for preview only. |
| currencyCode | Text | No | BC-style filter expression (e.g. `USD` or `USD\|EUR`). Defaults to all foreign currencies set up in BC. |
| adjustCustomers | Boolean | No (default true) | Adjust Detailed Customer Ledger Entries. |
| adjustVendors | Boolean | No (default true) | Adjust Detailed Vendor Ledger Entries. |
| adjustEmployees | Boolean | No (default true) | Adjust Detailed Employee Ledger Entries. |
| adjustBankAccounts | Boolean | No (default true) | Adjust Bank Account Ledger Entries. |
| adjustGLAccounts | Boolean | No (default true) | Adjust G/L Account currency balances. |
| postingDescription | Text[100] | No | Description on the adjustment G/L lines. Default: `Exchange rate adjustment <currencyCode-filter-or-blank> <endingDate>`. |

At least one `adjust*` toggle must be true; otherwise the request fails validation.

### Posting Gate

Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Both preview and post enforce the `Posting Gate ori` for posting type `G/L`; the gate is checked before parameters are populated, so a denial never reaches the BC adjustment engine. Without the permission set the request returns `status=Error` with `Posting denied: missing 'BIFROST GL Post ori' permission set.` — no preview entries are produced and no G/L Register is created.

### Currency Master Setup

BC codeunit 699 requires several account fields on every currency that takes part in a run, **including any currency the filter excludes when `adjustGLAccounts=true`** (the G/L-balance validation iterates all currencies, not just the filtered ones). Populate the Currency Card before the first run:

| Currency field | Used by | When validated |
|---|---|---|
| `Unrealized Gains Acc.` / `Unrealized Losses Acc.` | All adjust phases | Every run that revalues entries in this currency |
| `Realized Gains Acc.` / `Realized Losses Acc.` | Detailed ledger entry revaluation | Customer / vendor / employee / bank phases |
| `Realized G/L Gains Account` / `Realized G/L Losses Account` (fields 40/41) | G/L Account balance revaluation | Only when `adjustGLAccounts=true` — but validated on **all** currencies regardless of the `currencyCode` filter |

Missing `Unrealized Gains Acc.` errors with `Unrealized Gains Acc. must have a value in Currency: Code=<XYZ>.` Missing `Realized G/L Gains Account` errors the same way and is the most common surprise — set `adjustGLAccounts=false` for ledger-only revaluation, or populate fields 40/41 on every active currency.

### Response Format — Post (post=true)

```json
{
  "status": "Success",
  "posted": true,
  "postingDate": "2025-12-31",
  "endingDate": "2025-12-31",
  "documentNo": "FX-2025-12",
  "postingDescription": "Exchange rate adjustment USD|EUR 2025-12-31",
  "currencyFilter": "USD|EUR",
  "adjustCustomers": true,
  "adjustVendors": true,
  "adjustEmployees": false,
  "adjustBankAccounts": true,
  "adjustGLAccounts": true,
  "lcyCode": "ISK",
  "totals": {
    "totalDebitLCY": 152034.55,
    "totalCreditLCY": 152034.55,
    "netLCY": 0.00,
    "newGLEntryCount": 18
  },
  "byCurrency": [
    {
      "currencyCode": "USD",
      "adjustedBaseLCY": 84020.10,
      "adjustedAmtLCY": 1024.55,
      "registerCount": 3
    },
    {
      "currencyCode": "EUR",
      "adjustedBaseLCY": 68014.45,
      "adjustedAmtLCY": -510.30,
      "registerCount": 2
    }
  ],
  "glRegisterNo": 4321,
  "fromGLEntryNo": 98765,
  "toGLEntryNo": 98782,
  "newGLEntryCount": 18,
  "durationMs": 412
}
```

### Response Format — Preview (post=false)

```json
{
  "status": "Success",
  "posted": false,
  "rollback": true,
  "postingDate": "2025-12-31",
  "endingDate": "2025-12-31",
  "documentNo": "FX-2025-12-PREVIEW",
  "postingDescription": "Exchange rate adjustment  2025-12-31",
  "currencyFilter": "",
  "adjustCustomers": true,
  "adjustVendors": true,
  "adjustEmployees": true,
  "adjustBankAccounts": true,
  "adjustGLAccounts": true,
  "lcyCode": "ISK",
  "totals": {
    "balanced": true,
    "totalDebitLCY": 152034.55,
    "totalCreditLCY": 152034.55
  },
  "preview": [
    {
      "tableId": 17,
      "tableCaption": "G/L Entry",
      "entryCount": 18,
      "entries": [ /* curated field projection per row */ ]
    },
    {
      "tableId": 379,
      "tableCaption": "Detailed Cust. Ledg. Entry",
      "entryCount": 6,
      "entries": [ /* ... */ ]
    }
  ],
  "durationMs": 287
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` or `Error`. |
| posted | Boolean | `true` when the adjustment actually ran and committed. |
| rollback | Boolean | Preview only; always `true`. Indicates no database changes remain visible after the call. |
| postingDate / endingDate | Date | Echoes the input. |
| documentNo | Code[20] | Document number on the adjustment lines. |
| postingDescription | Text[100] | Description on the adjustment lines (input or default). |
| currencyFilter | Text | Filter applied to currency selection (input or empty for "all"). |
| adjustCustomers / adjustVendors / adjustEmployees / adjustBankAccounts / adjustGLAccounts | Boolean | Echoes the input toggles. |
| lcyCode | Code[10] | LCY code from General Ledger Setup, for context. |
| totals | Object | LCY totals across all entries written by the run. Preview adds `balanced`; post adds `netLCY` and `newGLEntryCount`. |
| byCurrency | Array | Post only. Per-currency breakdown of adjusted LCY amounts and register counts. |
| preview | Array | Preview only. One element per ledger table touched, each with the simulated entries projected to a curated field set. |
| glRegisterNo | Integer | Post only. G/L Register number created by the run. |
| fromGLEntryNo / toGLEntryNo | Integer | Post only. Range of G/L entries written by the adjustment. |
| newGLEntryCount | Integer | Post only. Number of G/L entries in the new register. `0` when no adjustment was needed. |
| durationMs | BigInteger | Wall-clock time spent inside the BC engine (excludes parsing and response build). |

### Notes

- Individual `G/L Entry` rows are intentionally not embedded in the post response. Use `Data.Records.Get` against `G/L Entry` filtered by `Entry No.` between `fromGLEntryNo` and `toGLEntryNo` when line-level detail is needed.
- `byCurrency` collapses Account Type and Posting Group via `CalcSums` on `Exch. Rate Adjmt. Reg.` (table 86). Each register row represents one (Account Type x Posting Group x Currency) tuple in BC.
- `adjustVATEntries` is **not** exposed. VAT entries are settled through [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement).
- Dimensions are inherited from the source ledger entries (BC default); they cannot be overridden via the request.
- The preview branch uses the standard BC posting-preview framework: `BindSubscription(ExchRateAdjmtProcess) + GenJnlPostPreview.SetContext + Run`. The captured entries are exposed through `Posting Preview Event Handler` and projected via `Preview Helper ori.AddTableToPreview`.
- The post branch isolates the run in `Codeunit "Curr. Adj Exch Rates Proc oriess"` (TableNo = "Message Argument ori") so errors raised by codeunit 699 surface as `status=Error` without rolling back the outer message-processing transaction.

### Error Handling

Validation errors return `status=Error` and an `error` field describing the failure. Errors raised by the underlying adjustment engine during posting include a `callstack` field for diagnostics. Validated conditions:
- All required fields present (`endingDate`, `postingDate`, `documentNo`)
- At least one `adjust*` toggle is true
- Posting gate `G/L` granted

Common engine-time errors (post and preview branches both surface these as `status=Error`):

| Error message | Root cause | Fix |
|---|---|---|
| `Unrealized Gains Acc. must have a value in Currency: Code=XYZ.` | Currency master missing fields 6/7/8/9 | Populate the four Unrealized/Realized Gains/Losses Acc. fields on the Currency Card |
| `Realized G/L Gains Account must have a value in Currency: Code=XYZ.` | `adjustGLAccounts=true` against a currency lacking fields 40/41 | Populate fields 40/41 on every active currency, or set `adjustGLAccounts=false` |
| `You must specify a Posting Date.` | `postingDate` missing or invalid | Send ISO-8601 date (`YYYY-MM-DD`) |
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Caller lacks `BIFROST GL Post ori` | Assign the permission set; the gate runs before the engine |

### Observed Behavior

End-to-end validation with USD + EUR on a BC 27 on-prem container (LCY = ISK, ARC = EUR), seeded with two open journal lines (USD 50.00 / EUR 25.00, both balanced through a clearing account), produced consistent and reversible results:

**Preview (`post=false`)** — 4 simulated G/L entries, balanced, no database changes:

```json
{
  "status": "Success", "posted": false, "rollback": true,
  "currencyFilter": "USD|EUR", "lcyCode": "ISK",
  "totals": { "balanced": true, "totalDebitLCY": 9765.11, "totalCreditLCY": 9765.11 },
  "preview": [ { "tableId": 17, "tableCaption": "G/L Entry", "entryCount": 4, "entries": [ /* ... */ ] } ],
  "durationMs": 437
}
```

| G/L Account | Debit (LCY) | Credit (LCY) | Description |
|---|---:|---:|---|
| 2320 (USD Unrealized Gains) | 6,520.41 |  | USD ledger revaluation |
| 6700 (USD Unrealized Losses) |  | 6,520.41 | USD offset |
| 5420 (EUR Unrealized Gains) |  | 3,244.70 | EUR ledger revaluation |
| 7250 (EUR Unrealized Losses) | 3,244.70 |  | EUR offset |

**Post (`post=true`)** — same shape, materialised as G/L Register 1119, entries 4369–4372:

```json
{
  "status": "Success", "posted": true,
  "glRegisterNo": 1119, "fromGLEntryNo": 4369, "toGLEntryNo": 4372,
  "newGLEntryCount": 4,
  "totals": { "totalDebitLCY": 9765.11, "totalCreditLCY": 9765.11, "netLCY": 0.00, "newGLEntryCount": 4 },
  "byCurrency": [
    { "currencyCode": "USD", "adjustedBaseLCY": 0.00, "adjustedAmtLCY":  6520.41, "registerCount": 1 },
    { "currencyCode": "EUR", "adjustedBaseLCY": 0.00, "adjustedAmtLCY": -3244.70, "registerCount": 1 }
  ],
  "durationMs": 328
}
```

Notable: `adjustedBaseLCY` is `0.00` when the underlying open entries already net to zero LCY in the source currency (typical for newly-posted clearing transactions); only `adjustedAmtLCY` reflects the FX delta. `byCurrency` totals reconcile to `totals.totalDebitLCY - totals.totalCreditLCY = 0` because each per-currency adjustment posts a balanced unrealized gain/loss pair.

### Known Gotchas

- **Currency-master gate runs first**: A missing `Unrealized Gains Acc.` on **any** currency in the BC company aborts the run with a per-currency error before the filter is applied. The `currencyCode` parameter narrows what gets adjusted, not what gets validated.
- **`adjustGLAccounts` widens the validation surface**: Setting it `true` adds the fields-40/41 check to every active currency, not just those in `currencyCode`. Prefer `false` for ledger-only revaluation when fields 40/41 are not configured everywhere.
- **Preview rollback is total**: The preview branch rolls back inside the engine's posting transaction; no `Exch. Rate Adjmt. Reg.` row, no G/L Entry, no Detailed Ledger Entry remains. Use it freely for what-if analysis.
- **`byCurrency` is empty on no-op runs**: If no open entries fell into the date window, `byCurrency` is `[]` and `newGLEntryCount` is `0`; `status` stays `Success`.
- **`durationMs` excludes parsing**: It measures only the wrapped `Codeunit.Run` for posting or `Run` for preview. The shared message overhead (~10–30 ms) is not included.

### AI Caller Guidance

- Run `post=false` first to inspect the simulated G/L entries and the `balanced` flag. Reject the run on any unbalanced or unexpected account combination.
- When showing results to a human, summarise `byCurrency[]` per currency (`adjustedAmtLCY` is the FX delta in LCY) and link `glRegisterNo` to the G/L Register page via `Help.Page.Get` if a clickable navigation is needed.
- For line-level detail of a posted run, follow up with `Data.Records.Get` against `G/L Entry` filtered by `Entry No.` between `fromGLEntryNo` and `toGLEntryNo`. The post response intentionally omits line rows to keep the payload bounded.
- Treat `adjustedBaseLCY = 0` as expected for short-lived FCY balances closed in the same period; do not flag it as an error.
- If the call returns `Unrealized Gains Acc. must have a value in Currency: Code=...`, fix the Currency Card first — re-running the message with the same payload will succeed once the master data is complete.

### Related Message Types

- [Finance.VAT.CalcAndPostSettlement](#financevatcalcandpostsettlement) — separate periodic close step for VAT entries.
- [Finance.GeneralJournal.PreviewPost](#financegeneraljournalpreviewpost) / [Finance.GeneralJournal.Post](#financegeneraljournalpost) — manual currency-related entries via journals.
- [Data.Records.Get](/foundation/message-types/data/) — fetch the individual `G/L Entry` rows in the returned `fromGLEntryNo..toGLEntryNo` range, or the `Exch. Rate Adjmt. Reg.` records to inspect Account Type / Posting Group splits.
