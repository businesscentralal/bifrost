---
id: finance-currency-adjustexchangerates
title: "Finance.Currency.AdjustExchangeRates"
sidebar_label: "Finance.Currency.AdjustExchangeRates"
sidebar_position: 39
description: "Beiðni- og svarsamningur fyrir Finance.Currency.AdjustExchangeRates Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Runs BC 'Exch. Rate Adjmt. Process' (codeunit 699) fyrir foreign-currency revaluation. þegar `post=false` (Sjálfgefið) Svarið contains the simulated færslur that would be created ef the run were committed (G/L færsla, Detailed viðskiptamanni/birgi/Employee bók færsla, Bank Account bók færsla) - captured via the BC posting-preview framework og rolled back. þegar `post=true` the run er performed inside an isolated `Codeunit.Run`, og Svarið contains the ný G/L Register together með the resulting færsla range plus a per-currency breakdown of adjusted LCY amounts.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| endingDate | dagsetning | Yes | síðasta posting dagsetning considered fyrir adjustment. All opið bók færslur með posting dagsetning on eða áður en this dagsetning eru evaluated. |
| postingDate | dagsetning | Yes | Posting dagsetning fyrir the adjustment G/L færslur. |
| documentNo | Code[20] | Yes | skjal númer on the adjustment G/L færslur. |
| post | sanngildi | No (Sjálfgefið false) | `true` til run og commit; `false` fyrir preview aðeins. |
| currencyCode | Text | No | BC-style filter expression (e.g. `USD` eða `USD\|EUR`). Defaults til all foreign currencies set up in BC. |
| adjustCustomers | sanngildi | No (Sjálfgefið true) | Adjust Detailed viðskiptamanni bók færslur. |
| adjustVendors | sanngildi | No (Sjálfgefið true) | Adjust Detailed birgi bók færslur. |
| adjustEmployees | sanngildi | No (Sjálfgefið true) | Adjust Detailed Employee bók færslur. |
| adjustBankAccounts | sanngildi | No (Sjálfgefið true) | Adjust Bank Account bók færslur. |
| adjustGLAccounts | sanngildi | No (Sjálfgefið true) | Adjust G/L Account currency balances. |
| postingDescription | Text[100] | No | Lýsing on the adjustment G/L lines. Sjálfgefið: `Exchange rate adjustment <currencyCode-filter-or-blank> <endingDate>`. |

At least one of `adjustCustomers`, `adjustVendors`, `adjustEmployees`, `adjustBankAccounts`, `adjustGLAccounts` verður að be true; otherwise Beiðnin fails validation.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. Both preview og post enforce the `Bifrost Posting Gate` fyrir posting Gerð `G/L`; the gate er checked áður en parameters eru populated, so a denial never reaches the BC adjustment engine. án the heimild set Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.` `status=Error` er returned, no preview færslur eru produced, og no G/L Register er created.

## Dæmi um beiðni (Post)
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

## Dæmi um beiðni (Preview)
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

## Uppbygging svars - Post
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

## Uppbygging svars - Preview
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

## Svarreitir
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status | Text | `Success` eða `Error`. |
| posted | sanngildi | `true` þegar the adjustment actually ran og committed (i.e. `post=true` og the run succeeded). |
| rollback | sanngildi | aðeins present in preview responses; always `true`. Indicates that no database changes remain visible eftir the call. |
| postingDate / endingDate | dagsetning | Echoes the input. |
| documentNo | Code[20] | skjal númer on the adjustment lines. |
| postingDescription | Text[100] | Lýsing on the adjustment lines (input eða Sjálfgefið). |
| currencyFilter | Text | Filter applied til currency selection (input eða empty fyrir "all"). |
| adjustCustomers / adjustVendors / adjustEmployees / adjustBankAccounts / adjustGLAccounts | sanngildi | Echoes the input toggles. |
| lcyCode | Code[10] | LCY code úr General bók Setup, fyrir context. |
| totals | hlutur | LCY totals across all færslur written með the run. Preview adds `balanced`; post adds `netLCY` og `newGLEntryCount`. |
| byCurrency | fylki | Post aðeins. Per-currency breakdown of adjusted LCY amounts og register counts. One element per currency that produced at least one adjustment register. |
| preview | fylki | Preview aðeins. One element per bók tafla touched (G/L færsla, Detailed Cust./birgi/Empl. Ledg. færsla, Bank Account bók færsla, etc.), hver með the simulated færslur projected til a curated Reitur set. |
| glRegisterNo | heiltala | Post aðeins. G/L Register númer created með the run. |
| fromGLEntryNo / toGLEntryNo | heiltala | Post aðeins. Range of G/L færslur written með the adjustment. |
| newGLEntryCount | heiltala | Post aðeins. númer of G/L færslur in the ný register. `0` þegar no adjustment was needed. |
| durationMs | BigInteger | Wall-clock time spent inside the BC engine (excludes parsing og response build). |

## Processing Flow
Preview og post share the parsing, validation, og posting-gate phases. They diverge aðeins on the engine invocation.

### 1. Request Parsing
- `AssertVersion1` confirms the message envelope er stutt.
- Request JSON er parsed í local variables: dates, skjal no., posting Lýsing, currency filter, the five `adjust*` toggles (hver defaulting til `true`), og `post`.
- A typed Gildi parse Mistókst (e.g. an unparseable dagsetning) Skilar `status=Error` immediately.

### 2. Bókunarheimild
Both branches call `Bifrost Posting Gate.AssertCanPost` fyrir posting Gerð `G/L`. A denial writes the Villa response og stops the run.

### 3. Input Validation
Athugar run in order; the fyrsta Mistókst short-circuits Beiðnin með `status=Error`.
1. `endingDate` er present.
2. `postingDate` er present.
3. `documentNo` er present.
4. At least one `adjust*` toggle er true.
5. ef `postingDescription` er blank, the Sjálfgefið `Exchange rate adjustment <currencyFilter> <endingDate>` er substituted.

### 4a. Preview Branch (`post=false`)
1. Populate a temporary `"Exch. Rate Adjmt. Parameters"` færsla (tafla 596) með the parsed inputs, `"Hide UI"=true`, `"Preview Posting"=true`, og the valfrjálst currency filter.
2. `BindSubscription` codeunit 699 `"Exch. Rate Adjmt. Process"` (declared `EventSubscriberInstance = Manual`; its `OnRunPreview` event subscriber receives the Færibreyta færsla).
3. `GenJnlPostPreview.SetContext` + `GenJnlPostPreview.Run` invoke the BC posting-preview engine headlessly. The engine raises `Error('')` eftir capturing færslur, which er the expected signal.
4. `GenJnlPostPreview.GetPreviewHandler` Skilar the populated `Posting Preview Event Handler`.
5. `FillDocumentEntry` enumerates the populated töflur. `Bifrost Preview Helper.AddTableToPreview` projects hver tafla til a curated Reitur set; extensions getur extend the projection via `OnGetPreviewFieldNames`.
6. `ComputeGLTotals` aggregates LCY debits/credits úr the captured G/L færsla rows, og `balanced` er derived (`Round(diff, 0.01) = 0`).
7. Svarið er written via `SetResponseJson`. No database changes remain visible eftir the call.

### 4b. Post Branch (`post=true`)
1. Snapshot the current síðasta `G/L Register."No."` og síðasta `Exch. Rate Adjmt. Reg."No."`.
2. Delegate the actual run til an isolated codeunit (`Codeunit.Run` með `TableNo = "Bifrost Message Argument ori"`). The isolated codeunit re-parses Beiðnin via `GetRequestJson`, populates the sama temporary Færibreyta færsla (this time með `"Preview Posting"=false`), og calls `Codeunit.Run(Codeunit::"Exch. Rate Adjmt. Process", ExchRateAdjmtParameters)`.
3. ef the isolated run fails, villu-JSON er byggt úr `GetLastErrorText` (kóði `BusinessCentralError`). The outer transaction er preserved so the message-processing pipeline getur færsla the Mistókst.
4. On Tókst, the ný `G/L Register` (með `No.` greater than the snapshot) er located via `SetLoadFields("No.", "From Entry No.", "To Entry No.", "Creation Date")`. `ComputeGLTotals` calls `CalcSums("Debit Amount", "Credit Amount")` over that færsla range.
5. `Exch. Rate Adjmt. Reg.` færslur með `"No." > snapshot` eru walked once til collect distinct currency codes, then per-currency `CalcSums("Adjusted Base (LCY)", "Adjusted Amt. (LCY)")` builds the `byCurrency` fylki.
6. `glRegisterNo`, `fromGLEntryNo`, `toGLEntryNo`, `newGLEntryCount`, og `durationMs` eru added til Svarið. It er written via `SetResponseJson` með `Content Type = text/json`.

### Athugasemdir on Svarið
- Individual `G/L Entry` rows eru intentionally ekki embedded in the post response. nota `Data.Records.Get` against `G/L Entry` filtered með `Entry No.` between `fromGLEntryNo` og `toGLEntryNo` þegar line-level detail er needed.
- The `byCurrency` fylki uses `Exch. Rate Adjmt. Reg.` (tafla 86) as the Uppruni. hver register represents one (Account Gerð x Posting Group x Currency) tuple; the per-currency view collapses Account Gerð og Posting Group via `CalcSums`.
- `adjustVATEntries` er intentionally **ekki** exposed. VAT færslur eru settled through the `Finance.VAT.CalcAndPostSettlement` skilaboðategund.
- Dimensions eru inherited úr the Uppruni bók færslur (BC Sjálfgefið); they getur ekki be overridden via Beiðnin.
- No locale-specific behaviour er applied. Iceland uses the BC standard FX revaluation rules.

## Villa Handling
Validation Villur return `status=Error` og an `error` Reitur describing the Mistókst. Villur raised með the underlying adjustment engine during posting er skilað með kóða `BusinessCentralError`. Validated conditions:
- All áskilið fields present (`endingDate`, `postingDate`, `documentNo`)
- At least one `adjust*` toggle er true
- Bókunarheimild `G/L` granted

## Observed Behavior (Validated via MCP)

### Empty Exposure - Preview
þegar no opið foreign-currency bók færslur match the filter, the preview response er still `status=Success`:
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
Note: `preview` er `[]` (ekki omitted) og `totals.balanced` er `true` með zero debit/credit.

### Empty Exposure - Post
þegar the engine has nothing til revalue, no G/L Register er created og the register-related fields eru omitted:
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
Note: `glRegisterNo`, `fromGLEntryNo`, `toGLEntryNo` eru **omitted** þegar no register er created. Callers should treat their absence as "nothing til adjust" rather than an Villa. `byCurrency` er `[]` (ekki omitted).

### Validation Villa - vantar postingDate
Request omitting `postingDate` Skilar:
```json
{ "status": "Error", "error": "postingDate is required." }
```

### Validation Villa - All Toggles False
Setting every `adjust*` toggle til `false` Skilar:
```json
{ "status": "Error", "error": "At least one of adjustCustomers, adjustVendors, adjustEmployees, adjustBankAccounts, adjustGLAccounts must be true." }
```

### Performance Baseline
On an empty-exposure test (no foreign-currency opið færslur):
- Preview branch: ~500 ms (posting-preview framework has higher per-call overhead).
- Post branch: ~130 ms (direct `Codeunit.Run` of codeunit 699).

Real-world runs scale með the númer of opið foreign-currency færslur og the númer of currencies in the filter. Plan timeouts accordingly; fyrir very large month-end runs prefer the queue endpoint (`queue_message_type`) over the synchronous one.

### Full Test - USD viðskiptamanni reikningur + EUR birgi reikningur, ~10% rate drift
End-til-end validation against Icelandic Cronus (LCY=ISK). Seed data posted via `Finance.GeneralJournal.Post` on 2025-01-15:
- viðskiptamanni 30000 (FLYTJA UT): reikningur USDFX-001, 1,000 USD at rate 100/6519.9591 -> Cust. bók færsla upphæð(LCY) = 65,199.59 ISK.
- birgi 10000 (ERLENT): reikningur EURFX-001, 500 EUR at rate 1/64.8936 -> birgi bók færsla upphæð(LCY) = -32,446.80 ISK.
Both dagbók lines balanced through G/L 2340 (clearing). ný rates inserted at 2025-06-01: USD 100/7,172.00 (+10.0%), EUR 1/71.383 (+10.0%). Adjustment ran með `endingDate=2025-06-30`, `postingDate=2025-06-30`, `currencyCode="USD|EUR"`, `adjustGLAccounts=false`.

Preview response (`post=false`) - 4 G/L færslur, balanced totals:
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
G/L færsla rows (curated projection):
| G/L Account | Lýsing                  | Debit    | Credit   |
|-------------|------------------------------|----------|----------|
| 2320        | FX revaluation 2025-06-30    | 6,520.41 |        0 |  &lt;- viðskiptamanni receivable (USD) up
| 6700        | FX revaluation 2025-06-30    |        0 | 6,520.41 |  &lt;- unrealised gain (USD)
| 5420        | FX revaluation 2025-06-30    |        0 | 3,244.70 |  &lt;- birgi payable (EUR) up
| 7250        | FX revaluation 2025-06-30    | 3,244.70 |        0 |  &lt;- unrealised loss (EUR)

Post response (`post=true`) - sama payload, `byCurrency` populated:
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
- `adjustedBaseLCY` er the **signed** LCY base of opið færslur áður en revaluation (viðskiptamanni positive, birgi negative).
- `adjustedAmtLCY` er the **signed** LCY adjustment (gain positive, loss negative). Net across currencies = 6,520.41 - 3,244.70 = 3,275.71 ISK net gain on this run.
- `registerCount` er 1 per currency in this test - hver currency produces one Exch. Rate Adjmt. Reg. færsla.
- Preview vs post duration ratio (~1.3x) matches the empty-exposure baseline; preview overhead er dominated með the preview-framework `BindSubscription` + `Run` round-trip rather than the færsla count at this scale.
- Currency master verður að have `Unrealized Gains Acc.` / `Unrealized Losses Acc.` / `Realized Gains Acc.` / `Realized Losses Acc.` populated fyrir every currency in the filter, eða BC Villur með `Unrealized Gains Acc. must have a value in Currency: Code=<XYZ>`. This er **separate** úr the `Realized G/L Gains Account` validation (which aðeins triggers þegar `adjustGLAccounts=true`, Sjá gotcha below).
- The receivables / payables G/L accounts (2320 / 5420 in this test) eru inferred úr hver viðskiptamanni/birgi's Posting Group, ekki úr Beiðnin.

## Known Gotchas

### G/L Account adjustment requires "Realized G/L Gains Account" on ALL currencies
BC codeunit 699 validates the `Realized G/L Gains Account` og `Realized G/L Losses Account` fields on **every configured currency** áður en running the G/L Account adjustment phase - the `currencyCode` filter er **ekki** consulted fyrir this validation. ef hvaða currency er vantar those accounts, the call fails með:
```
Realized G/L Gains Account must have a value in Currency: Code=<XYZ>. It cannot be zero or empty.
```
even ef `<XYZ>` was excluded úr `currencyCode`.

Two ways til work around this:
1. Set `adjustGLAccounts: false` in Beiðnin (recommended þegar you aðeins need til revalue bók færslur, ekki G/L account balances). This bypasses the G/L account phase entirely og lets the viðskiptamanni/birgi/employee/bank phases run normally.
2. Populate `Realized G/L Gains Account` og `Realized G/L Losses Account` on every virkt currency in the Currency Card. This er the correct production fix þegar G/L account revaluation er needed.

Note: `Realized Gains Acc.` / `Realized Losses Acc.` (the legacy/viðskiptamanni-bók pair) og `Realized G/L Gains Account` / `Realized G/L Losses Account` (the G/L-balance pair) eru **different** Currency fields. The currency may have the fyrsta pair set but still fail the second-pair validation.

### Currency filter scope
The `currencyCode` filter er applied during viðskiptamanni/birgi/employee/bank færsla selection inside codeunit 699. The G/L Account adjustment phase iterates all currencies (Sjá gotcha above). It einnig drives the per-currency breakdown in the post response (`byCurrency`), so passing an explicit filter er the cleanest way til scope a run.

### postingDescription Sjálfgefið format
þegar `postingDescription` er blank, the substituted Gildi er `Exchange rate adjustment <currencyFilter> <endingDate>` með a single space between hver token. þegar `currencyCode` er einnig blank, the result er `Exchange rate adjustment  <endingDate>` (note the double space). Callers that pattern-match descriptions should treat the currency token as valfrjálst.

### G/L færsla rows eru ekki embedded in post responses
The post response intentionally Skilar the færsla-númer range aðeins (`fromGLEntryNo`, `toGLEntryNo`). til get the actual G/L lines, follow up með `Data.Records.Get` on `G/L Entry` filtered með `Entry No.` between those bounds. This keeps the post response small even fyrir large registers.

### Isolation guarantees
- Preview path: `GenJnlPostPreview.Run` raises `Error('')` eftir capturing færslur, which rolls back the in-memory skrifa set. No persistent changes survive a preview call, even ef Beiðnin triggered hundreds of simulated færslur.
- Bókunarleið: sjálf leiðréttingin keyrir í einangraðri færslu. ef the engine Villur, the outer transaction (message-processing pipeline) er preserved og villunni er skilað með kóða `BusinessCentralError`. ef it succeeds, the ný register er committed independently of hvaða Kallandi-side cleanup.

## AI Kallandi Guidance
Practical tips fyrir LLM-driven callers (Copilot, agents, M365 plugins):
- **Always run preview fyrsta** fyrir unfamiliar data Stillir. The `preview` fylki shows exactly what would be posted; aðeins call `post=true` eftir confirming the færslur og totals.
- **Scope every run með `currencyCode`** þegar possible. It limits the viðskiptamanni/birgi/employee/bank phase og yields a focused `byCurrency` breakdown.
- **Set `adjustGLAccounts: false`** unless the user skýrt asked til revalue G/L account balances. This avoids the cross-currency `Realized G/L Gains Account` validation trap described above.
- **Pick `documentNo` deterministically**, e.g. `FXADJ-<YYYY-MM>` eða `FX-<YYYY-MM>-PREVIEW`. The G/L Register er searchable með this Gildi afterwards.
- **Empty result er Tókst, ekki Mistókst.** ef `newGLEntryCount` er `0` (post) eða `preview` er `[]` (preview), tell the user "no adjustment needed" rather than reporting an Villa.
- **nota `endingDate` = month-end** fyrir normal periodic revaluation; `postingDate` er usually the sama dagsetning but getur differ fyrir back-dated postings.
- **fyrir large month-end runs**, switch úr `call_message_type` til `queue_message_type` til avoid synchronous timeouts; poll með `queue_get_status`.
- **eftir a tókst post**, nota `Data.Records.Get` on `G/L Entry` með `Entry No.` between `fromGLEntryNo` og `toGLEntryNo` til fetch line-level detail. nota `Data.Records.Get` on `Exch. Rate Adjmt. Reg.` filtered með `No.` `>fromGLEntryNo-style snapshot` fyrir register-level detail.
- **Currency filter syntax** mirrors BC: single Gildi (`USD`), alternatives (`USD|EUR|GBP`), wildcards (`U*`). Quotes around the filter Gildi eru **ekki** áskilið.

## Tengdar skilaboðategundir
- `Finance.VAT.CalcAndPostSettlement` - settles VAT færslur (a separate, complementary periodic close step).
- `Finance.GeneralJournal.PreviewPost` / `Finance.GeneralJournal.Post` - manual currency-related færslur via journals.
- `Data.Records.Get` - fetch the individual `G/L Entry` rows in the returned `fromGLEntryNo..toGLEntryNo` range, eða the `Exch. Rate Adjmt. Reg.` færslur til inspect Account Gerð / Posting Group splits.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

