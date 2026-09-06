---
id: finance-currency-adjustexchangerates
title: "Finance.Currency.AdjustExchangeRates"
sidebar_label: "Finance.Currency.AdjustExchangeRates"
sidebar_position: 39
description: "Request and response contract for the Finance.Currency.AdjustExchangeRates Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Runs BC 'Exch. Rate Adjmt. Process' (codeunit 699) for foreign-currency revaluation. When `post=false` (default) the response contains the simulated entries that would be created if the run were committed (G/L Entry, Detailed Customer/Vendor/Employee Ledger Entry, Bank Account Ledger Entry) - captured via the BC posting-preview framework and rolled back. When `post=true` the run is performed inside an isolated `Codeunit.Run`, and the response contains the new G/L Register together with the resulting entry range plus a per-currency breakdown of adjusted LCY amounts.

## Direction
Inbound

## Response Content Type
`text/json`

## Request Parameters
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

At least one of `adjustCustomers`, `adjustVendors`, `adjustEmployees`, `adjustBankAccounts`, `adjustGLAccounts` must be true; otherwise the request fails validation.

## Posting Gate
Calling this message type requires the `BIFROST GL Post ori` permission set in addition to `BIFROST API ori`. Both preview and post enforce the `Bifrost Posting Gate` for posting type `G/L`; the gate is checked before parameters are populated, so a denial never reaches the BC adjustment engine. Without the permission set the request returns: `Posting denied: missing 'BIFROST GL Post ori' permission set.` `status=Error` is returned, no preview entries are produced, and no G/L Register is created.

## Request Example (Post)
```json
{
  "type": "Finance.Currency.AdjustExchangeRates",
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

## Request Example (Preview)
```json
{
  "type": "Finance.Currency.AdjustExchangeRates",
  "data": {
    "endingDate": "2025-12-31",
    "postingDate": "2025-12-31",
    "documentNo": "FX-2025-12-PREVIEW",
    "post": false
  }
}
```

## Response Shape - Post
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

## Response Shape - Preview
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
      "entries": ["...curated field projection per row..."]
    },
    {
      "tableId": 379,
      "tableCaption": "Detailed Cust. Ledg. Entry",
      "entryCount": 6,
      "entries": ["..."]
    }
  ],
  "durationMs": 287
}
```

## Response Fields
| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` or `Error`. |
| posted | Boolean | `true` when the adjustment actually ran and committed (i.e. `post=true` and the run succeeded). |
| rollback | Boolean | Only present in preview responses; always `true`. Indicates that no database changes remain visible after the call. |
| postingDate / endingDate | Date | Echoes the input. |
| documentNo | Code[20] | Document number on the adjustment lines. |
| postingDescription | Text[100] | Description on the adjustment lines (input or default). |
| currencyFilter | Text | Filter applied to currency selection (input or empty for "all"). |
| adjustCustomers / adjustVendors / adjustEmployees / adjustBankAccounts / adjustGLAccounts | Boolean | Echoes the input toggles. |
| lcyCode | Code[10] | LCY code from General Ledger Setup, for context. |
| totals | Object | LCY totals across all entries written by the run. Preview adds `balanced`; post adds `netLCY` and `newGLEntryCount`. |
| byCurrency | Array | Post only. Per-currency breakdown of adjusted LCY amounts and register counts. One element per currency that produced at least one adjustment register. |
| preview | Array | Preview only. One element per ledger table touched (G/L Entry, Detailed Cust./Vendor/Empl. Ledg. Entry, Bank Account Ledger Entry, etc.), each with the simulated entries projected to a curated field set. |
| glRegisterNo | Integer | Post only. G/L Register number created by the run. |
| fromGLEntryNo / toGLEntryNo | Integer | Post only. Range of G/L entries written by the adjustment. |
| newGLEntryCount | Integer | Post only. Number of G/L entries in the new register. `0` when no adjustment was needed. |
| durationMs | BigInteger | Wall-clock time spent inside the BC engine (excludes parsing and response build). |

## Processing Flow
Preview and post share the parsing, validation, and posting-gate phases. They diverge only on the engine invocation.

### 1. Request Parsing
- `AssertVersion1` confirms the message envelope is supported.
- Request JSON is parsed into local variables: dates, document no., posting description, currency filter, the five `adjust*` toggles (each defaulting to `true`), and `post`.
- A typed value parse failure (e.g. an unparseable date) returns `status=Error` immediately.

### 2. Posting Gate
Both branches call `Bifrost Posting Gate.AssertCanPost` for posting type `G/L`. A denial writes the error response and stops the run.

### 3. Input Validation
Checks run in order; the first failure short-circuits the request with `status=Error`.
1. `endingDate` is present.
2. `postingDate` is present.
3. `documentNo` is present.
4. At least one `adjust*` toggle is true.
5. If `postingDescription` is blank, the default `Exchange rate adjustment <currencyFilter> <endingDate>` is substituted.

### 4a. Preview Branch (`post=false`)
1. Populate a temporary `"Exch. Rate Adjmt. Parameters"` record (table 596) with the parsed inputs, `"Hide UI"=true`, `"Preview Posting"=true`, and the optional currency filter.
2. `BindSubscription` codeunit 699 `"Exch. Rate Adjmt. Process"` (declared `EventSubscriberInstance = Manual`; its `OnRunPreview` event subscriber receives the parameter record).
3. `GenJnlPostPreview.SetContext` + `GenJnlPostPreview.Run` invoke the BC posting-preview engine headlessly. The engine raises `Error('')` after capturing entries, which is the expected signal.
4. `GenJnlPostPreview.GetPreviewHandler` returns the populated `Posting Preview Event Handler`.
5. `FillDocumentEntry` enumerates the populated tables. `Bifrost Preview Helper.AddTableToPreview` projects each table to a curated field set; extensions can extend the projection via `OnGetPreviewFieldNames`.
6. `ComputeGLTotals` aggregates LCY debits/credits from the captured G/L Entry rows, and `balanced` is derived (`Round(diff, 0.01) = 0`).
7. The response is written via `SetResponseJson`. No database changes remain visible after the call.

### 4b. Post Branch (`post=true`)
1. Snapshot the current last `G/L Register."No."` and last `Exch. Rate Adjmt. Reg."No."`.
2. Delegate the actual run to an isolated codeunit (`Codeunit.Run` with `TableNo = "Bifrost Message Argument ori"`). The isolated codeunit re-parses the request via `GetRequestJson`, populates the same temporary parameter record (this time with `"Preview Posting"=false`), and calls `Codeunit.Run(Codeunit::"Exch. Rate Adjmt. Process", ExchRateAdjmtParameters)`.
3. If the isolated run fails, the error JSON is built from `GetLastErrorText` and `GetLastErrorCallStack`. The outer transaction is preserved so the message-processing pipeline can record the failure.
4. On success, the new `G/L Register` (with `No.` greater than the snapshot) is located via `SetLoadFields("No.", "From Entry No.", "To Entry No.", "Creation Date")`. `ComputeGLTotals` calls `CalcSums("Debit Amount", "Credit Amount")` over that entry range.
5. `Exch. Rate Adjmt. Reg.` records with `"No." > snapshot` are walked once to collect distinct currency codes, then per-currency `CalcSums("Adjusted Base (LCY)", "Adjusted Amt. (LCY)")` builds the `byCurrency` array.
6. `glRegisterNo`, `fromGLEntryNo`, `toGLEntryNo`, `newGLEntryCount`, and `durationMs` are added to the response. It is written via `SetResponseJson` with `Content Type = text/json`.

### Notes on the Response
- Individual `G/L Entry` rows are intentionally not embedded in the post response. Use `Data.Records.Get` against `G/L Entry` filtered by `Entry No.` between `fromGLEntryNo` and `toGLEntryNo` when line-level detail is needed.
- The `byCurrency` array uses `Exch. Rate Adjmt. Reg.` (table 86) as the source. Each register represents one (Account Type x Posting Group x Currency) tuple; the per-currency view collapses Account Type and Posting Group via `CalcSums`.
- `adjustVATEntries` is intentionally **not** exposed. VAT entries are settled through the `Finance.VAT.CalcAndPostSettlement` message type.
- Dimensions are inherited from the source ledger entries (BC default); they cannot be overridden via the request.
- No locale-specific behaviour is applied. Iceland uses the BC standard FX revaluation rules.

## Error Handling
Validation errors return `status=Error` and an `error` field describing the failure. Errors raised by the underlying adjustment engine during posting include a `callstack` field for diagnostics. Validated conditions:
- All required fields present (`endingDate`, `postingDate`, `documentNo`)
- At least one `adjust*` toggle is true
- Posting gate `G/L` granted

## Observed Behavior (Validated via MCP)

### Empty Exposure - Preview
When no open foreign-currency ledger entries match the filter, the preview response is still `status=Success`:
```json
{
  "status": "Success",
  "posted": false,
  "rollback": true,
  "postingDate": "2026-06-06",
  "endingDate": "2026-06-06",
  "documentNo": "FXADJ-T2",
  "postingDescription": "Exchange rate adjustment USD 2026-06-06",
  "currencyFilter": "USD",
  "adjustCustomers": true,
  "adjustVendors": true,
  "adjustEmployees": true,
  "adjustBankAccounts": true,
  "adjustGLAccounts": false,
  "lcyCode": "ISK",
  "totals": { "balanced": true, "totalDebitLCY": 0, "totalCreditLCY": 0 },
  "preview": [],
  "durationMs": 510
}
```
Note: `preview` is `[]` (not omitted) and `totals.balanced` is `true` with zero debit/credit.

### Empty Exposure - Post
When the engine has nothing to revalue, no G/L Register is created and the register-related fields are omitted:
```json
{
  "status": "Success",
  "posted": true,
  "postingDate": "2026-06-06",
  "endingDate": "2026-06-06",
  "documentNo": "FXADJ-T3",
  "postingDescription": "Exchange rate adjustment USD 2026-06-06",
  "currencyFilter": "USD",
  "adjustCustomers": true,
  "adjustVendors": true,
  "adjustEmployees": true,
  "adjustBankAccounts": true,
  "adjustGLAccounts": false,
  "lcyCode": "ISK",
  "totals": { "totalDebitLCY": 0, "totalCreditLCY": 0, "netLCY": 0, "newGLEntryCount": 0 },
  "byCurrency": [],
  "newGLEntryCount": 0,
  "durationMs": 132
}
```
Note: `glRegisterNo`, `fromGLEntryNo`, `toGLEntryNo` are **omitted** when no register is created. Callers should treat their absence as "nothing to adjust" rather than an error. `byCurrency` is `[]` (not omitted).

### Validation Error - Missing postingDate
Request omitting `postingDate` returns:
```json
{ "status": "Error", "error": "postingDate is required." }
```

### Validation Error - All Toggles False
Setting every `adjust*` toggle to `false` returns:
```json
{ "status": "Error", "error": "At least one of adjustCustomers, adjustVendors, adjustEmployees, adjustBankAccounts, adjustGLAccounts must be true." }
```

### Performance Baseline
On an empty-exposure test (no foreign-currency open entries):
- Preview branch: ~500 ms (posting-preview framework has higher per-call overhead).
- Post branch: ~130 ms (direct `Codeunit.Run` of codeunit 699).

Real-world runs scale with the number of open foreign-currency entries and the number of currencies in the filter. Plan timeouts accordingly; for very large month-end runs prefer the queue endpoint (`queue_message_type`) over the synchronous one.

### Full Test - USD customer invoice + EUR vendor invoice, ~10% rate drift
End-to-end validation against Icelandic Cronus (LCY=ISK). Seed data posted via `Finance.GeneralJournal.Post` on 2025-01-15:
- Customer 30000 (FLYTJA UT): Invoice USDFX-001, 1,000 USD at rate 100/6519.9591 -> Cust. Ledger Entry Amount(LCY) = 65,199.59 ISK.
- Vendor 10000 (ERLENT): Invoice EURFX-001, 500 EUR at rate 1/64.8936 -> Vendor Ledger Entry Amount(LCY) = -32,446.80 ISK.
Both journal lines balanced through G/L 2340 (clearing). New rates inserted at 2025-06-01: USD 100/7,172.00 (+10.0%), EUR 1/71.383 (+10.0%). Adjustment ran with `endingDate=2025-06-30`, `postingDate=2025-06-30`, `currencyCode="USD|EUR"`, `adjustGLAccounts=false`.

Preview response (`post=false`) - 4 G/L entries, balanced totals:
```json
{
  "status": "Success",
  "posted": false,
  "rollback": true,
  "currencyFilter": "USD|EUR",
  "lcyCode": "ISK",
  "totals": { "balanced": true, "totalDebitLCY": 9765.11, "totalCreditLCY": 9765.11 },
  "preview": [
    { "tableId": 17,  "tableCaption": "G/L Entry",                     "entryCount": 4 },
    { "tableId": 384, "tableCaption": "Exch. Rate Adjmt. Ledger Entry", "entryCount": 2 },
    { "tableId": 379, "tableCaption": "Detailed Cust. Ledg. Entry",     "entryCount": 1 },
    { "tableId": 380, "tableCaption": "Detailed Vendor Ledg. Entry",    "entryCount": 1 }
  ],
  "durationMs": 437
}
```
G/L Entry rows (curated projection):
| G/L Account | Description                  | Debit    | Credit   |
|-------------|------------------------------|----------|----------|
| 2320        | FX revaluation 2025-06-30    | 6,520.41 |        0 |  &lt;- customer receivable (USD) up
| 6700        | FX revaluation 2025-06-30    |        0 | 6,520.41 |  &lt;- unrealised gain (USD)
| 5420        | FX revaluation 2025-06-30    |        0 | 3,244.70 |  &lt;- vendor payable (EUR) up
| 7250        | FX revaluation 2025-06-30    | 3,244.70 |        0 |  &lt;- unrealised loss (EUR)

Post response (`post=true`) - same payload, `byCurrency` populated:
```json
{
  "status": "Success",
  "posted": true,
  "currencyFilter": "USD|EUR",
  "lcyCode": "ISK",
  "totals": { "totalDebitLCY": 9765.11, "totalCreditLCY": 9765.11, "netLCY": 0, "newGLEntryCount": 4 },
  "byCurrency": [
    { "currencyCode": "USD", "adjustedBaseLCY":  65199.59, "adjustedAmtLCY":  6520.41, "registerCount": 1 },
    { "currencyCode": "EUR", "adjustedBaseLCY": -32446.80, "adjustedAmtLCY": -3244.70, "registerCount": 1 }
  ],
  "glRegisterNo": 1119,
  "fromGLEntryNo": 4369,
  "toGLEntryNo": 4372,
  "newGLEntryCount": 4,
  "durationMs": 328
}
```
Observations:
- `adjustedBaseLCY` is the **signed** LCY base of open entries before revaluation (customer positive, vendor negative).
- `adjustedAmtLCY` is the **signed** LCY adjustment (gain positive, loss negative). Net across currencies = 6,520.41 - 3,244.70 = 3,275.71 ISK net gain on this run.
- `registerCount` is 1 per currency in this test - each currency produces one Exch. Rate Adjmt. Reg. entry.
- Preview vs post duration ratio (~1.3x) matches the empty-exposure baseline; preview overhead is dominated by the preview-framework `BindSubscription` + `Run` round-trip rather than the entry count at this scale.
- Currency master must have `Unrealized Gains Acc.` / `Unrealized Losses Acc.` / `Realized Gains Acc.` / `Realized Losses Acc.` populated for every currency in the filter, or BC errors with `Unrealized Gains Acc. must have a value in Currency: Code=<XYZ>`. This is **separate** from the `Realized G/L Gains Account` validation (which only triggers when `adjustGLAccounts=true`, see gotcha below).
- The receivables / payables G/L accounts (2320 / 5420 in this test) are inferred from each customer/vendor's Posting Group, not from the request.

## Known Gotchas

### G/L Account adjustment requires "Realized G/L Gains Account" on ALL currencies
BC codeunit 699 validates the `Realized G/L Gains Account` and `Realized G/L Losses Account` fields on **every configured currency** before running the G/L Account adjustment phase - the `currencyCode` filter is **not** consulted for this validation. If any currency is missing those accounts, the call fails with:
```
Realized G/L Gains Account must have a value in Currency: Code=<XYZ>. It cannot be zero or empty.
```
even if `<XYZ>` was excluded from `currencyCode`.

Two ways to work around this:
1. Set `adjustGLAccounts: false` in the request (recommended when you only need to revalue ledger entries, not G/L account balances). This bypasses the G/L account phase entirely and lets the customer/vendor/employee/bank phases run normally.
2. Populate `Realized G/L Gains Account` and `Realized G/L Losses Account` on every active currency in the Currency Card. This is the correct production fix when G/L account revaluation is needed.

Note: `Realized Gains Acc.` / `Realized Losses Acc.` (the legacy/customer-ledger pair) and `Realized G/L Gains Account` / `Realized G/L Losses Account` (the G/L-balance pair) are **different** Currency fields. The currency may have the first pair set but still fail the second-pair validation.

### Currency filter scope
The `currencyCode` filter is applied during customer/vendor/employee/bank entry selection inside codeunit 699. The G/L Account adjustment phase iterates all currencies (see gotcha above). It also drives the per-currency breakdown in the post response (`byCurrency`), so passing an explicit filter is the cleanest way to scope a run.

### postingDescription default format
When `postingDescription` is blank, the substituted value is `Exchange rate adjustment <currencyFilter> <endingDate>` with a single space between each token. When `currencyCode` is also blank, the result is `Exchange rate adjustment  <endingDate>` (note the double space). Callers that pattern-match descriptions should treat the currency token as optional.

### G/L Entry rows are not embedded in post responses
The post response intentionally returns the entry-number range only (`fromGLEntryNo`, `toGLEntryNo`). To get the actual G/L lines, follow up with `Data.Records.Get` on `G/L Entry` filtered by `Entry No.` between those bounds. This keeps the post response small even for large registers.

### Isolation guarantees
- Preview path: `GenJnlPostPreview.Run` raises `Error('')` after capturing entries, which rolls back the in-memory write set. No persistent changes survive a preview call, even if the request triggered hundreds of simulated entries.
- Post path: the actual adjustment runs inside `Codeunit.Run`. If the engine errors, the outer transaction (message-processing pipeline) is preserved and a `callstack` field is returned. If it succeeds, the new register is committed independently of any caller-side cleanup.

## AI Caller Guidance
Practical tips for LLM-driven callers (Copilot, agents, M365 plugins):
- **Always run preview first** for unfamiliar data sets. The `preview` array shows exactly what would be posted; only call `post=true` after confirming the entries and totals.
- **Scope every run with `currencyCode`** when possible. It limits the customer/vendor/employee/bank phase and yields a focused `byCurrency` breakdown.
- **Set `adjustGLAccounts: false`** unless the user explicitly asked to revalue G/L account balances. This avoids the cross-currency `Realized G/L Gains Account` validation trap described above.
- **Pick `documentNo` deterministically**, e.g. `FXADJ-<YYYY-MM>` or `FX-<YYYY-MM>-PREVIEW`. The G/L Register is searchable by this value afterwards.
- **Empty result is success, not failure.** If `newGLEntryCount` is `0` (post) or `preview` is `[]` (preview), tell the user "no adjustment needed" rather than reporting an error.
- **Use `endingDate` = month-end** for normal periodic revaluation; `postingDate` is usually the same date but can differ for back-dated postings.
- **For large month-end runs**, switch from `call_message_type` to `queue_message_type` to avoid synchronous timeouts; poll with `queue_get_status`.
- **After a successful post**, use `Data.Records.Get` on `G/L Entry` with `Entry No.` between `fromGLEntryNo` and `toGLEntryNo` to fetch line-level detail. Use `Data.Records.Get` on `Exch. Rate Adjmt. Reg.` filtered by `No.` `>fromGLEntryNo-style snapshot` for register-level detail.
- **Currency filter syntax** mirrors BC: single value (`USD`), alternatives (`USD|EUR|GBP`), wildcards (`U*`). Quotes around the filter value are **not** required.

## Related Message Types
- `Finance.VAT.CalcAndPostSettlement` - settles VAT entries (a separate, complementary periodic close step).
- `Finance.GeneralJournal.PreviewPost` / `Finance.GeneralJournal.Post` - manual currency-related entries via journals.
- `Data.Records.Get` - fetch the individual `G/L Entry` rows in the returned `fromGLEntryNo..toGLEntryNo` range, or the `Exch. Rate Adjmt. Reg.` records to inspect Account Type / Posting Group splits.

