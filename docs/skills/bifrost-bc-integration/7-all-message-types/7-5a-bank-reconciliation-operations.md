---
id: 7-5a-bank-reconciliation-operations
title: "7.5a Bank reconciliation operations"
sidebar_label: "7.5a Bank reconciliation operations"
sidebar_position: 6
---

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
