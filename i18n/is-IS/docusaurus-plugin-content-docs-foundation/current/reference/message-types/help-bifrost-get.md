---
id: help-bifrost-get
title: "Help.Bifrost.Get"
sidebar_label: "Help.Bifrost.Get"
sidebar_position: 52
description: "Beiðni- og svarsamningur fyrir Help.Bifrost.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Technical know-how fyrir working með the Bifrost API against Business Central. These eru practical, verified recipes fyrir the most common data tasks: counting færslur, aggregating totals, reading FlowFields, filtering, writing færslur, og handling currency, binary fields, the Change Log skrifa Guard og language (LCID). nota this as a quick technical reference áður en composing requests.

## Stefna
Útgående

## Response Content Gerð
- As a message task (`call_message_type` með `type = "Help.Bifrost.Get"`): `text/json` — Skilar a **short Markdown directory** of the `Help.*` discovery endpoints og instructs Kallandinn how til fetch this full guide.
- As implementation help (`Help.Implementation.Get` með `subject = "Help.Bifrost.Get"`): `text/markdown` — Skilar this full technical Markdown body.

## Dæmi um beiðni
```json
{ "specversion": "1.0", "type": "Help.Bifrost.Get", "source": "MyApp" }
```

## Uppbygging svars (message task — short directory)
```json
{
  "status": "Success",
  "result": {
    "messageType": "Help.Bifrost.Get",
    "format": "markdown",
    "markdown": "# Bifrost API - Help endpoints ...",
    "fullHelpInstructions": "Call Help.Implementation.Get with subject=\"Help.Bifrost.Get\" to retrieve the full technical Bifrost API how-to guide as Markdown."
  }
}
```
The `markdown` Reitur on the task response er a short directory of the `Help.*` endpoints. til retrieve the full technical body (sections 1-11 below), call `Help.Implementation.Get` með `subject = "Help.Bifrost.Get"`.

## Uppbygging svars (Help.Implementation.Get — full guide)
```json
{ "markdown": "# Help.Bifrost.Get\\n## Overview\\nTechnical know-how ..." }
```

---

## Session Bootstrap — áskilið Sequence
Every AI session against a BC Bifrost endpoint **verður að** run these three steps in order áður en composing hvaða data query eða skrifa. Skipping steps leads til wrong language, vantar identity context, og preventable API Villur.

**Step 1 — Identity (`who_am_i` / `Help.WhoAmI.Get`)**
Call `who_am_i` (MCP dedicated tool, no args) eða `Help.WhoAmI.Get`. lesa og retain:
- `personalization.languageId` → session LCID. Pass til **every** subsequent MCP call that accepts `lcid`.
- `personalization.company` → confirm you eru in the right company.
- `canUpdateCompanyMemory` → gate fyrir company memory writes.
- `unreadNotifications` → **fylki** of `{ sender, subject, threadId }`. Surface proactively ef non-empty.
- `pendingApprovals` → **fylki** of `{ documentType, documentNo, amountLCY, dueDate }`. Surface proactively ef non-null og non-empty.
- All identity sections (user, employee, salesperson, companyInfo) → personalise "my …" queries.
- `systemPrompt` → ef non-empty, treat as admin-injected behavioural instructions fyrir this user+company.

**Step 2 — API primer (`Help.Bifrost.Get` + `Help.Implementation.Get`)**
Call `Help.Bifrost.Get` (MCP: `call_message_type` með `type = "Help.Bifrost.Get"`). This Skilar a short directory of the `Help.*` discovery endpoints. Then call `Help.Implementation.Get` með `subject = "Help.Bifrost.Get"` (MCP: `get_message_type_help`) til retrieve this full technical guide. Load it once per session til avoid common query og skrifa mistakes.

**Step 3 — On Mistókst**
ef Step 1 fails, surface the Villa og stop. Never proceed án identity. On company switch, repeat Steps 1–2 með the ný `companyId` og adopt the ný LCID immediately.

---

## 0. MCP Tool Calls — Canonical Færibreyta Names
þegar invoking Bifrost through the **BC Metadata MCP Server** (`call_message_type`, `queue_message_type`, `get_message_type_help`), nota these EXACT Færibreyta names. Other names eru silently dropped unless they eru listed as an alias.

| MCP Færibreyta | Gerð | Canonical Heiti | Accepted aliases |
|---|---|---|---|
| skilaboðategund | strengur | `type` | `messageType`, `messageTypeName`, `name`, `messagetype` |
| Bifrost subject | strengur | `subject` | none — verður að be `subject` |
| Data payload (JSON hlutur) | hlutur | `data` | `requestData`, `payload`, `body`, `input`, `params`, `parameters` |
| Language LCID | heiltala | `lcid` | none |

### Canonical MCP call shape
```json
{
  "type": "Sales.SalesInvoice.Pdf",
  "subject": "PS-INV103001",
  "data": { "invoiceNo": "PS-INV103001" },
  "lcid": 1033
}
```

### Common pitfalls (AI-agent traps)
- **`data` er a JSON hlutur, ekki a strengur.** Pass `"data": { "invoiceNo": "X" }` — never `"data": "{\"invoiceNo\":\"X\"}"`. The MCP wrapper stringifies the hlutur fyrir transport; ef you pre-stringify, the BC side fails til parse.
- **`requestData` er an alias aðeins.** Older examples og habit may suggest `requestData` — it now works (aliased til `data`), but `data` er canonical og shorter help text uses it.
- **`subject` verður að be the Bifrost subject** — typically a skjal númer, viðskiptamanni númer, eða SystemId GUID. Per-Gerð help (`get_message_type_help`) tells you exactly which Gildi goes here.
- **The Gerð Heiti er case-sensitive og ekki always symmetric.** Always confirm með `list_message_types` áður en calling — fyrir example, the family er `Sales.SalesInvoice.Pdf`, `Sales.SalesShipment.Pdf`, `Sales.SalesCreditMemo.Pdf`, but the return-receipt sibling er `Sales.ReturnReceipt.Pdf` (no second `Sales`).
- **Prefer dedicated tools þegar they exist.** `get_records`, `set_records`, `search_records`, `get_record_count`, `get_decimal_total` wrap `Data.*` types með simpler arguments og avoid `data`-envelope mistakes entirely.

### áskilið workflow áður en composing a call
1. `list_message_types` — find the exact Gerð Heiti (asymmetries above).
2. `get_message_type_help` með `type = <name>` — lesa the implementation guide fyrir áskilið `subject` og `data` fields.
3. `call_message_type` (eða a dedicated tool) með the exact shape above.

---

## 1. Count færslur in a tafla
The `Table Information` virtual tafla er **ekki** available in cloud BC. til get the total númer of færslur cheaply, ask fyrir a single færsla og lesa `noOfRecords` úr Svarið:
```json
{ "type": "Data.Records.Get", "tableName": "G/L Entry", "fieldNumbers": [1], "skip": 0, "take": 1 }
```
- `fieldNumbers: [1]` er always safe — Reitur 1 need ekki exist; `noOfRecords` er returned regardless.
- `noOfRecords` er the **total** count fyrir the filter, independent of `take`.
- `take: 1` minimises the payload. You getur batch many such probes in parallel til size several töflur at once.
- Never fetch all rows just til count them.

## 2. Aggregate (SUM) server-side — never sum client-side
nota `Data.Totals.Get` (BC `CalcSums`) fyrir hvaða SUM over a filtered tafla þegar you do ekki need the individual rows. Server-side aggregation er orders of magnitude faster og transfers no færsla payload.
```json
{ "type": "Data.Totals.Get", "tableName": "G/L Entry", "fieldNumbers": [17],
  "tableView": "WHERE(G/L Account No.=FILTER(6120|6610|6700|6710|6810),Posting Date=FILTER(2026-01-01..2026-01-31))" }
```
- `fieldNumbers` verður að reference **Normal tugabrot fields** (ekki FlowFields). FlowFields getur ekki be summed — nota Data.Records.Get með fieldNumbers til calculate FlowFields individually.
- Income/revenue accounts have a credit natural balance, so the returned upphæð er negative — multiply með -1 fyrir a positive figure.
- fyrir a monthly breakdown, dispatch one `Data.Totals.Get` per month **in parallel**, ekki sequentially.

### Anti-patterns
- Do ekki fetch all rows og sum them in code.
- Do ekki loop over rows til accumulate — nota `Data.Totals.Get`.
- Do ekki fetch rows just til count them — Sjá section 1.

## 3. Totals aðeins work on Normal tugabrot fields (ekki FlowFields)
`Data.Totals.Get` getur aðeins sum **Normal tugabrot** fields — never FlowFields. Summing a FlowField raises *"getur ekki calculate a sum ... ekki normal numeric fields"*.
Example: on tafla 112 (Sales reikningur Header) both `Amount` (60) og `Amount Including VAT` (61) eru FlowFields og mun fail. Sum the **line** tafla 113 (Sales reikningur Line) instead, where the amounts eru Normal tugabrot:

| Reitur | No. (tafla 113) | Gerð |
|-------|-----------------|------|
| Sell-til viðskiptamanni No. | 2 | Normal |
| upphæð | 29 | Normal tugabrot |
| upphæð þar á meðal VAT | 30 | Normal tugabrot |

## 4. lesa FlowFields og drive them með FlowFilters
þegar you list a FlowField með númer in `fieldNumbers` of `Data.Records.Get`, it comes back **calculated** (ekki 0). FlowFilter fields placed in `tableView` change how the FlowField er calculated — enabling period movement, dimension, budget og consolidation filtering directly.
```json
{ "type": "Data.Records.Get", "tableName": "G/L Account",
  "tableView": "WHERE(No.=FILTER(62210|62240),Date Filter=FILTER(2025-01-01..2025-12-31))",
  "fieldNumbers": [1, 2, 32, 36] }
```
- `NetChange` (32) Skilar movement within the `Date Filter`; `Balance` (36) er the full balance, unaffected með `Date Filter`.
- fyrir balance as of a dagsetning nota `BalanceatDate` (31) með `Date Filter=FILTER(..<date>)`.

Key G/L Account fields: NetChange 32, Balance 36, BalanceatDate 31, DebitAmount 47, CreditAmount 48, BudgetedAmount 33. FlowFilters: dagsetning Filter 28, Global Dimension 1 Filter 29, Global Dimension 2 Filter 30, Budget Filter 35, Business Unit Filter 42.

viðskiptamanni (18) / birgi (23): dagsetning Filter 55 (FlowFilter), Balance (LCY) 59, Net Change (LCY) 61, Balance Due (LCY) 67 — `Balance Due (LCY)` uses `UPPERLIMIT(Date Filter)`, which makes aged-balance buckets possible með a stepped `Date Filter`.

Consequence: there er no need fyrir dedicated balance/aging tools — `Data.Records.Get` með the right FlowFields og FlowFilters covers account balances, trial balance per period, og aged receivables/payables.

## 5. tableView filter syntax — CONST vs FILTER
- **CONST** takes a SINGLE Gildi aðeins, og its max length er the Reitur length (e.g. a Code 20 Reitur allows 20 chars). Never put a pipe-list inside CONST — `CONST(a|b|c)` fails með a *"strengur length"* Villa.
- **FILTER** er fyrir hvaða multi-Gildi eða expression filter: Sýnir lista yfir `FILTER(6120|6610|9410)`, ranges `FILTER(2026-01-01..2026-01-31)`, wildcards `FILTER(*Sala*)`, comparisons `FILTER(>1000)`, og combinations `FILTER(6120|6700..6810)`.

| Want | Correct |
|------|---------|
| One Gildi | `WHERE(No.=CONST(K00234))` |
| Many values | `WHERE(No.=FILTER(6120\|6610\|6810))` |
| dagsetning range | `WHERE(Posting Date=FILTER(2026-01-01..2026-01-31))` |

Note: Reitur names inside `tableView`/`WHERE` nota the **display** form með spaces og dots (e.g. `Document Type`, `No.`).

### Option/Enum fields in CONST — always nota heiltala ordinals
BC resolves Option og Enum captions inside `CONST`/`FILTER` úr the **system language** of the BC instance, ekki úr the session LCID. On an Icelandic BC environment `WHERE(Document Type=CONST(Order))` fails — the system expects `"Pöntun"`. The safe, language-neutral approach er til **always nota the heiltala ordinal**: `WHERE(Document Type=CONST(1))`. Ordinals eru stable across all languages og BC versions.

| skjal Gerð caption (en-US) | Icelandic caption | heiltala ordinal |
|---|---|---|
| Quote | Tilboð | 0 |
| Order | Pöntun | 1 |
| reikningur | Reikningur | 2 |
| Blanket Order | Rammasamningur | 3 |
| Credit Memo | Kreditreikningur | 4 |
| Return Order | Skilapöntun | 5 |

This applies til **hvaða** Option eða Enum Reitur in hvaða `tableView` filter — ekki just `Document Type`. þegar in doubt, inspect the ordinal via `Help.Fields.Get` og nota the heiltala in CONST.

## 6. Primary-key form: jsonKey vs display Heiti
Two contexts nota different forms fyrir the sama Reitur:

| Context | Form | Example |
|---------|------|---------|
| `primaryKey` / `fields` objects (Data.Records.Set, Help.NextLineNo.Get) | **jsonKey** — no spaces/punctuation, aðeins `[A-Za-z0-9_]` | `{ "DocumentType": 4, "No_": "K00234" }` |
| `tableView` / `WHERE` filters | **display Heiti** með spaces/dots | `WHERE(Document Type=CONST(4),No.=CONST(K00234))` |

Mixing them up raises `Invalid field "Document Type" in primaryKey object ... Did you mean "DocumentType"?` eða `Missing value for primary key field ...`. Discover the jsonKey form með `Help.Fields.Get` (hver Reitur exposes both a display `name` og a `jsonKey`). þegar a schema Villa fires once, STOP og look up the schema — do ekki loop on cosmetic guesses.

skjal Gerð enum (Purchase/Sales Line): 0 Quote, 1 Order, 2 reikningur, 3 Blanket Order, 4 Credit Memo, 5 Return Order. Line numbers increment með 10000 (BC standard).

## 7. Writing færslur — Data.Records.Set er always UPSERT
`Data.Records.Set` always behaves as an upsert keyed on the primary key (eða `recordId`/`$systemId` þegar supplied):
- PK exists → the færsla er **updated** með the supplied fields.
- PK does ekki exist → a ný færsla er **inserted**.

The `mode` flag (`insert`/`modify`/`delete`/`upsert`) er effectively **ignored** server-side; the PK decides insert vs update. Consequences:
- There er **no delete** through Bifrost. `mode: "delete"` Skilar Tókst og Les the færsla back, but deletes nothing.
- Do ekki rely on `insert` failing þegar the PK exists, eða on `modify` failing þegar it does ekki — both just upsert.
- Calls eru endurtekningarþolið: re-sending the sama fields on the sama PK er safe.

Validate runs on **every** Reitur you send (even þegar the Gildi equals the Sjálfgefið), so the normal Reitur set auto-calculates derived amounts. til emulate a delete, soft-delete instead (e.g. set `Quantity = 0` on a line) eða remove the row in the BC client.

## 8. Currency Code og CurrencyFactor
þegar the local currency er ISK, Bifrost translates the `Currency Code` Reitur both ways: a stored blank (LCY) Les back as `"ISK"`, og writing `"ISK"` stores a blank. So `Data.Records.Get` / `Help.WhoAmI.Get` always show `ISK` on LCY skjöl even though the stored Gildi er blank — this er ekki a bug. ISK er ekki a row in the `Currency` tafla, og `CurrencyFactor = 0` on LCY skjöl er correct. Do ekki try til "fix" either; leave Currency Code untouched on LCY skjöl.

þegar you verður að set `CurrencyFactor` manually on a header, remember it er the **inverse** of the rate shown on the currency card:
> LCY = FCY / CurrencyFactor

| Rate on card | CurrencyFactor |
|--------------|----------------|
| 1 USD = 140 ISK | 0.00714286 (1/140) |
| 1 EUR = 150 ISK | 0.00666667 |

ef the LCY upphæð looks far too small (e.g. divided instead of multiplied), the factor er inverted. Best er að: keep the Currency Exchange Rate tafla correct og let BC compute the factor þegar `CurrencyCode` er validated; set it með hand aðeins as a stopgap.

## 9. Binary fields — Blob vs Media vs MediaSet
A `Media` Reitur (e.g. `Image` on Employee 5200 eða Resource 156) er **ekki** a plain Blob. Sending a bare base64 strengur stores text og the image mun ekki render. nota the hlutur form:
```json
"fields": { "Image": { "Id": "{2784EBA9-0991-45BC-B81E-348E184C164B}", "Value": "/9j/4AAQSkZJRg..." } }
```
- `Id` — an RFC4122 UUID in **uppercase**, wrapped in braces `{...}`.
- `Value` — base64 image (JPEG eða PNG).

| Gerð | lesa / skrifa JSON |
|------|-------------------|
| Blob | `"field": "base64..."` |
| Media | `"field": { "Id": "{GUID}", "Value": "base64..." }` |
| MediaSet | `"field": { "Id": "{GUID}", "Media": [ { ... }, ... ] }` |

ef a related-tafla validation blocks the insert, insert án the Gildi fyrsta, then modify til set it (two-step pattern).

## 10. Change Log skrifa Guard quirks
The skrifa Guard getur reject **inserts** that include certain fields even þegar `ChangeLog.Field.Enabled` reports `fieldCovered: true`. Example: inserting a ný G/L Account með `IRSNo_` (14602) og `AccountSubcategoryEntryNo_` (80) er rejected.
- **Workaround:** insert með aðeins basic fields (Heiti, Account Gerð, Account Category, Income/Balance, Debit/Credit, Indentation, Direct Posting, etc.), then **modify** the sama færsla til set the guarded fields — modifications eru accepted under modification logging. The sama pattern applies til other töflur með incomplete insert tracking.
- Some fields getur ekki be written at all via the API. fyrir instance, the `Name` Reitur on G/L Account (tafla 15, Reitur 2) getur ekki be modified — rename in the BC client, eða create the account með the final Heiti úr the start.

## 11. Always pass LCID
lesa the session LCID once úr `Help.WhoAmI.Get` (`personalization.languageId`) og pass it til **every** subsequent call that accepts `lcid`. LCID er ekki just cosmetic — it controls returned caption/option strings (e.g. `Type` er "Inventory" at 1033, "Birgðir" at 1039), Villa-message language, og translated fields.
- Mixing LCIDs across calls produces inconsistent option strings og enum-mismatch Villur on writes (e.g. þegar an enum Gildi comes back translated).
- Do ekki Sjálfgefið til 1033 unless the user's personalization er actually 1033. On a company switch, call `Help.WhoAmI.Get` again og adopt the ný LCID.
- **Option/Enum `CONST` values in `tableView` eru system-language-sensitive.** `WHERE(Document Type=CONST(Order))` fails on an Icelandic BC instance. Always nota heiltala ordinals (`CONST(1)`) — Sjá section 5 fyrir the full tafla.

## Tengdar skilaboðategundir
- `Data.Records.Get`, `Data.RecordIds.Get`, `Data.Totals.Get`, `Data.Records.Set`
- `Help.Namespaces.Get`, `Help.Tables.Get`, `Help.Fields.Get`, `Help.MessageTypes.Get`, `Help.Implementation.Get`, `Help.WhoAmI.Get`, `Help.NextLineNo.Get`

