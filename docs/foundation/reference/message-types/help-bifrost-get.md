---
id: help-bifrost-get
title: "Help.Bifrost.Get"
sidebar_label: "Help.Bifrost.Get"
sidebar_position: 52
description: "Request and response contract for the Help.Bifrost.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Technical know-how for working with the Bifrost API against Business Central. These are practical, verified recipes for the most common data tasks: counting records, aggregating totals, reading FlowFields, filtering, writing records, and handling currency, binary fields, the Change Log Write Guard and language (LCID). Use this as a quick technical reference before composing requests.

## Direction
Outbound

## Response Content Type
- As a message task (`call_message_type` with `type = "Help.Bifrost.Get"`): `text/json` — returns a **short Markdown directory** of the `Help.*` discovery endpoints and instructs the caller how to fetch this full guide.
- As implementation help (`Help.Implementation.Get` with `subject = "Help.Bifrost.Get"`): `text/markdown` — returns this full technical Markdown body.

## Request Example
```json
{ "specversion": "1.0", "type": "Help.Bifrost.Get", "source": "MyApp" }
```

## Response Shape (message task — short directory)
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
The `markdown` field on the task response is a short directory of the `Help.*` endpoints. To retrieve the full technical body (sections 1-11 below), call `Help.Implementation.Get` with `subject = "Help.Bifrost.Get"`.

## Response Shape (Help.Implementation.Get — full guide)
```json
{ "markdown": "# Help.Bifrost.Get\\n## Overview\\nTechnical know-how ..." }
```

---

## Session Bootstrap — Required Sequence
Every AI session against a BC Bifrost endpoint **must** run these three steps in order before composing any data query or write. Skipping steps leads to wrong language, missing identity context, and preventable API errors.

**Step 1 — Identity (`who_am_i` / `Help.WhoAmI.Get`)**
Call `who_am_i` (MCP dedicated tool, no args) or `Help.WhoAmI.Get`. Read and retain:
- `personalization.languageId` → session LCID. Pass to **every** subsequent MCP call that accepts `lcid`.
- `personalization.company` → confirm you are in the right company.
- `canUpdateCompanyMemory` → gate for company memory writes.
- `unreadNotifications` → **Array** of `{ sender, subject, threadId }`. Surface proactively if non-empty.
- `pendingApprovals` → **Array** of `{ documentType, documentNo, amountLCY, dueDate }`. Surface proactively if non-null and non-empty.
- All identity sections (user, employee, salesperson, companyInfo) → personalise "my …" queries.
- `systemPrompt` → if non-empty, treat as admin-injected behavioural instructions for this user+company.

**Step 2 — API primer (`Help.Bifrost.Get` + `Help.Implementation.Get`)**
Call `Help.Bifrost.Get` (MCP: `call_message_type` with `type = "Help.Bifrost.Get"`). This returns a short directory of the `Help.*` discovery endpoints. Then call `Help.Implementation.Get` with `subject = "Help.Bifrost.Get"` (MCP: `get_message_type_help`) to retrieve this full technical guide. Load it once per session to avoid common query and write mistakes.

**Step 3 — On failure**
If Step 1 fails, surface the error and stop. Never proceed without identity. On company switch, repeat Steps 1–2 with the new `companyId` and adopt the new LCID immediately.

---

## 0. MCP Tool Calls — Canonical Parameter Names
When invoking Bifrost through the **BC Metadata MCP Server** (`call_message_type`, `queue_message_type`, `get_message_type_help`), use these EXACT parameter names. Other names are silently dropped unless they are listed as an alias.

| MCP parameter | Type | Canonical name | Accepted aliases |
|---|---|---|---|
| Message type | string | `type` | `messageType`, `messageTypeName`, `name`, `messagetype` |
| Bifrost subject | string | `subject` | none — must be `subject` |
| Data payload (JSON object) | object | `data` | `requestData`, `payload`, `body`, `input`, `params`, `parameters` |
| Language LCID | integer | `lcid` | none |

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
- **`data` is a JSON object, NOT a string.** Pass `"data": { "invoiceNo": "X" }` — never `"data": "{\"invoiceNo\":\"X\"}"`. The MCP wrapper stringifies the object for transport; if you pre-stringify, the BC side fails to parse.
- **`requestData` is an alias only.** Older examples and habit may suggest `requestData` — it now works (aliased to `data`), but `data` is canonical and shorter help text uses it.
- **`subject` must be the Bifrost subject** — typically a document number, customer number, or SystemId GUID. Per-type help (`get_message_type_help`) tells you exactly which value goes here.
- **The type name is case-sensitive and not always symmetric.** Always confirm with `list_message_types` before calling — for example, the family is `Sales.SalesInvoice.Pdf`, `Sales.SalesShipment.Pdf`, `Sales.SalesCreditMemo.Pdf`, but the return-receipt sibling is `Sales.ReturnReceipt.Pdf` (no second `Sales`).
- **Prefer dedicated tools when they exist.** `get_records`, `set_records`, `search_records`, `get_record_count`, `get_decimal_total` wrap `Data.*` types with simpler arguments and avoid `data`-envelope mistakes entirely.

### Required workflow before composing a call
1. `list_message_types` — find the exact type name (asymmetries above).
2. `get_message_type_help` with `type = <name>` — read the implementation guide for required `subject` and `data` fields.
3. `call_message_type` (or a dedicated tool) with the exact shape above.

---

## 1. Count records in a table
The `Table Information` virtual table is **not** available in cloud BC. To get the total number of records cheaply, ask for a single record and read `noOfRecords` from the response:
```json
{ "type": "Data.Records.Get", "tableName": "G/L Entry", "fieldNumbers": [1], "skip": 0, "take": 1 }
```
- `fieldNumbers: [1]` is always safe — field 1 need not exist; `noOfRecords` is returned regardless.
- `noOfRecords` is the **total** count for the filter, independent of `take`.
- `take: 1` minimises the payload. You can batch many such probes in parallel to size several tables at once.
- Never fetch all rows just to count them.

## 2. Aggregate (SUM) server-side — never sum client-side
Use `Data.Totals.Get` (BC `CalcSums`) for any SUM over a filtered table when you do not need the individual rows. Server-side aggregation is orders of magnitude faster and transfers no record payload.
```json
{ "type": "Data.Totals.Get", "tableName": "G/L Entry", "fieldNumbers": [17],
  "tableView": "WHERE(G/L Account No.=FILTER(6120|6610|6700|6710|6810),Posting Date=FILTER(2026-01-01..2026-01-31))" }
```
- `fieldNumbers` must reference **Normal Decimal fields** (not FlowFields). FlowFields cannot be summed — use Data.Records.Get with fieldNumbers to calculate FlowFields individually.
- Income/revenue accounts have a credit natural balance, so the returned Amount is negative — multiply by -1 for a positive figure.
- For a monthly breakdown, dispatch one `Data.Totals.Get` per month **in parallel**, not sequentially.

### Anti-patterns
- Do not fetch all rows and sum them in code.
- Do not loop over rows to accumulate — use `Data.Totals.Get`.
- Do not fetch rows just to count them — see section 1.

## 3. Totals only work on Normal Decimal fields (not FlowFields)
`Data.Totals.Get` can only sum **Normal Decimal** fields — never FlowFields. Summing a FlowField raises *"Cannot calculate a sum ... not normal numeric fields"*.
Example: on table 112 (Sales Invoice Header) both `Amount` (60) and `Amount Including VAT` (61) are FlowFields and will fail. Sum the **line** table 113 (Sales Invoice Line) instead, where the amounts are Normal Decimal:

| Field | No. (table 113) | Type |
|-------|-----------------|------|
| Sell-to Customer No. | 2 | Normal |
| Amount | 29 | Normal Decimal |
| Amount Including VAT | 30 | Normal Decimal |

## 4. Read FlowFields and drive them with FlowFilters
When you list a FlowField by number in `fieldNumbers` of `Data.Records.Get`, it comes back **calculated** (not 0). FlowFilter fields placed in `tableView` change how the FlowField is calculated — enabling period movement, dimension, budget and consolidation filtering directly.
```json
{ "type": "Data.Records.Get", "tableName": "G/L Account",
  "tableView": "WHERE(No.=FILTER(62210|62240),Date Filter=FILTER(2025-01-01..2025-12-31))",
  "fieldNumbers": [1, 2, 32, 36] }
```
- `NetChange` (32) returns movement within the `Date Filter`; `Balance` (36) is the full balance, unaffected by `Date Filter`.
- For balance as of a date use `BalanceatDate` (31) with `Date Filter=FILTER(..<date>)`.

Key G/L Account fields: NetChange 32, Balance 36, BalanceatDate 31, DebitAmount 47, CreditAmount 48, BudgetedAmount 33. FlowFilters: Date Filter 28, Global Dimension 1 Filter 29, Global Dimension 2 Filter 30, Budget Filter 35, Business Unit Filter 42.

Customer (18) / Vendor (23): Date Filter 55 (FlowFilter), Balance (LCY) 59, Net Change (LCY) 61, Balance Due (LCY) 67 — `Balance Due (LCY)` uses `UPPERLIMIT(Date Filter)`, which makes aged-balance buckets possible with a stepped `Date Filter`.

Consequence: there is no need for dedicated balance/aging tools — `Data.Records.Get` with the right FlowFields and FlowFilters covers account balances, trial balance per period, and aged receivables/payables.

## 5. tableView filter syntax — CONST vs FILTER
- **CONST** takes a SINGLE value only, and its max length is the field length (e.g. a Code 20 field allows 20 chars). Never put a pipe-list inside CONST — `CONST(a|b|c)` fails with a *"string length"* error.
- **FILTER** is for any multi-value or expression filter: lists `FILTER(6120|6610|9410)`, ranges `FILTER(2026-01-01..2026-01-31)`, wildcards `FILTER(*Sala*)`, comparisons `FILTER(>1000)`, and combinations `FILTER(6120|6700..6810)`.

| Want | Correct |
|------|---------|
| One value | `WHERE(No.=CONST(K00234))` |
| Many values | `WHERE(No.=FILTER(6120\|6610\|6810))` |
| Date range | `WHERE(Posting Date=FILTER(2026-01-01..2026-01-31))` |

Note: field names inside `tableView`/`WHERE` use the **display** form with spaces and dots (e.g. `Document Type`, `No.`).

### Option/Enum fields in CONST — always use integer ordinals
BC resolves Option and Enum captions inside `CONST`/`FILTER` from the **system language** of the BC instance, not from the session LCID. On an Icelandic BC environment `WHERE(Document Type=CONST(Order))` fails — the system expects `"Pöntun"`. The safe, language-neutral approach is to **always use the integer ordinal**: `WHERE(Document Type=CONST(1))`. Ordinals are stable across all languages and BC versions.

| Document Type caption (en-US) | Icelandic caption | Integer ordinal |
|---|---|---|
| Quote | Tilboð | 0 |
| Order | Pöntun | 1 |
| Invoice | Reikningur | 2 |
| Blanket Order | Rammasamningur | 3 |
| Credit Memo | Kreditreikningur | 4 |
| Return Order | Skilapöntun | 5 |

This applies to **any** Option or Enum field in any `tableView` filter — not just `Document Type`. When in doubt, inspect the ordinal via `Help.Fields.Get` and use the integer in CONST.

## 6. Primary-key form: jsonKey vs display name
Two contexts use different forms for the same field:

| Context | Form | Example |
|---------|------|---------|
| `primaryKey` / `fields` objects (Data.Records.Set, Help.NextLineNo.Get) | **jsonKey** — no spaces/punctuation, only `[A-Za-z0-9_]` | `{ "DocumentType": 4, "No_": "K00234" }` |
| `tableView` / `WHERE` filters | **display name** with spaces/dots | `WHERE(Document Type=CONST(4),No.=CONST(K00234))` |

Mixing them up raises `Invalid field "Document Type" in primaryKey object ... Did you mean "DocumentType"?` or `Missing value for primary key field ...`. Discover the jsonKey form with `Help.Fields.Get` (each field exposes both a display `name` and a `jsonKey`). When a schema error fires once, STOP and look up the schema — do not loop on cosmetic guesses.

Document Type enum (Purchase/Sales Line): 0 Quote, 1 Order, 2 Invoice, 3 Blanket Order, 4 Credit Memo, 5 Return Order. Line numbers increment by 10000 (BC standard).

## 7. Writing records — Data.Records.Set is always UPSERT
`Data.Records.Set` always behaves as an upsert keyed on the primary key (or `recordId`/`$systemId` when supplied):
- PK exists → the record is **updated** with the supplied fields.
- PK does not exist → a new record is **inserted**.

The `mode` flag (`insert`/`modify`/`delete`/`upsert`) is effectively **ignored** server-side; the PK decides insert vs update. Consequences:
- There is **no delete** through Bifrost. `mode: "delete"` returns success and reads the record back, but deletes nothing.
- Do not rely on `insert` failing when the PK exists, or on `modify` failing when it does not — both just upsert.
- Calls are idempotent: re-sending the same fields on the same PK is safe.

Validate runs on **every** field you send (even when the value equals the default), so the normal field set auto-calculates derived amounts. To emulate a delete, soft-delete instead (e.g. set `Quantity = 0` on a line) or remove the row in the BC client.

## 8. Currency Code and CurrencyFactor
When the local currency is ISK, Bifrost translates the `Currency Code` field both ways: a stored blank (LCY) reads back as `"ISK"`, and writing `"ISK"` stores a blank. So `Data.Records.Get` / `Help.WhoAmI.Get` always show `ISK` on LCY documents even though the stored value is blank — this is not a bug. ISK is not a row in the `Currency` table, and `CurrencyFactor = 0` on LCY documents is correct. Do not try to "fix" either; leave Currency Code untouched on LCY documents.

When you must set `CurrencyFactor` manually on a header, remember it is the **inverse** of the rate shown on the currency card:
> LCY = FCY / CurrencyFactor

| Rate on card | CurrencyFactor |
|--------------|----------------|
| 1 USD = 140 ISK | 0.00714286 (1/140) |
| 1 EUR = 150 ISK | 0.00666667 |

If the LCY amount looks far too small (e.g. divided instead of multiplied), the factor is inverted. Best practice: keep the Currency Exchange Rate table correct and let BC compute the factor when `CurrencyCode` is validated; set it by hand only as a stopgap.

## 9. Binary fields — Blob vs Media vs MediaSet
A `Media` field (e.g. `Image` on Employee 5200 or Resource 156) is **not** a plain Blob. Sending a bare base64 string stores text and the image will not render. Use the object form:
```json
"fields": { "Image": { "Id": "{2784EBA9-0991-45BC-B81E-348E184C164B}", "Value": "/9j/4AAQSkZJRg..." } }
```
- `Id` — an RFC4122 UUID in **uppercase**, wrapped in braces `{...}`.
- `Value` — base64 image (JPEG or PNG).

| Type | Read / Write JSON |
|------|-------------------|
| Blob | `"field": "base64..."` |
| Media | `"field": { "Id": "{GUID}", "Value": "base64..." }` |
| MediaSet | `"field": { "Id": "{GUID}", "Media": [ { ... }, ... ] }` |

If a related-table validation blocks the insert, insert without the value first, then modify to set it (two-step pattern).

## 10. Change Log Write Guard quirks
The Write Guard can reject **inserts** that include certain fields even when `ChangeLog.Field.Enabled` reports `fieldCovered: true`. Example: inserting a new G/L Account with `IRSNo_` (14602) and `AccountSubcategoryEntryNo_` (80) is rejected.
- **Workaround:** insert with only basic fields (Name, Account Type, Account Category, Income/Balance, Debit/Credit, Indentation, Direct Posting, etc.), then **modify** the same record to set the guarded fields — modifications are accepted under modification logging. The same pattern applies to other tables with incomplete insert tracking.
- Some fields cannot be written at all via the API. For instance, the `Name` field on G/L Account (table 15, field 2) cannot be modified — rename in the BC client, or create the account with the final name from the start.

## 11. Always pass LCID
Read the session LCID once from `Help.WhoAmI.Get` (`personalization.languageId`) and pass it to **every** subsequent call that accepts `lcid`. LCID is not just cosmetic — it controls returned caption/option strings (e.g. `Type` is "Inventory" at 1033, "Birgðir" at 1039), error-message language, and translated fields.
- Mixing LCIDs across calls produces inconsistent option strings and enum-mismatch errors on writes (e.g. when an enum value comes back translated).
- Do not default to 1033 unless the user's personalization is actually 1033. On a company switch, call `Help.WhoAmI.Get` again and adopt the new LCID.
- **Option/Enum `CONST` values in `tableView` are system-language-sensitive.** `WHERE(Document Type=CONST(Order))` fails on an Icelandic BC instance. Always use integer ordinals (`CONST(1)`) — see section 5 for the full table.

## Related Message Types
- `Data.Records.Get`, `Data.RecordIds.Get`, `Data.Totals.Get`, `Data.Records.Set`
- `Help.Namespaces.Get`, `Help.Tables.Get`, `Help.Fields.Get`, `Help.MessageTypes.Get`, `Help.Implementation.Get`, `Help.WhoAmI.Get`, `Help.NextLineNo.Get`

