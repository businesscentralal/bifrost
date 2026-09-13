---
id: sparisjodir-creditcard-transactions
title: "Sparisjodir.CreditCard.Transactions"
sidebar_label: "Sparisjodir.CreditCard.Transactions"
sidebar_position: 154
description: "Beiðni- og svarsamningur fyrir Sparisjodir.CreditCard.færslur Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir færslur on a credit card, paged. One message Gerð covers Allt three bank queries; Tengingin routes by the valfrjálst filters you supply:
- `dueDate` (yyyymm) present -> færslur fyrir that due month (GetCreditCardTransactionsByDueDate)
- otherwise `dateFrom`/`dateTo` present -> færslur in that date range (GetCreditCardTransactionsByDate)
- otherwise -> Allt færslur (GetCreditCardTransactions)

**Requires:** `Spar Card Gate` permission set.

## Beiðni

| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| `cardId` | number | Yes | Numeric card identifier (frá `Sparisjodir.CreditCard.Get`) |
| `dateFrom` | string | No | Range start `YYYY-MM-DD` (færsla date) |
| `dateTo` | string | No | Range end `YYYY-MM-DD` (færsla date) |
| `dueDate` | string | No | Due month `yyyymm`, e.g. `202605`. Takes precedence over dateFrom/dateTo |
| `pageNumber` | number | No | 1-based page number (default 1) |
| `pageSize` | number | No | færslur per page (default 200) |

```json
{ "cardId": 123456789, "dateFrom": "2026-05-01", "dateTo": "2026-05-31", "pageNumber": 1, "pageSize": 200 }
```

## Svar

Skilar `{ "status": "Success", "cardId": ..., "count": N, "paging": { "pageNumber", "pageSize", "totalPages", "totalRecords" }, "transactions": [ ... ] }`. Each færsla carries `transactionDate`, `amount` (domestic ISK, **negative fyrir purchases / positive fyrir greiðslur**) + `amountCurrency`, `foreignAmount` (same sign convention) + `foreignAmountCurrency`, `currencyCode`, `dueDate` (yyyymm), `merchantName`/`merchantCity`/`merchantCountryCode`, `transactionKey`, `authorizationNumber`.

## Usage notes (fyrir automation)

- Sækja `cardId` frá `Sparisjodir.CreditCard.Get`. The bank does not allow fetching Allt færslur in one Kallaðu á — always page (read `paging.totalPages` og iterate `pageNumber`).
- An empty window Skilar `status: Success` með `count: 0` (not an error).
- This message Gerð er read-Aðeins JSON. til bring card færslur í BC as posted/reconcilable bank statement lines, Notaðu the bank-reconciliation import below instead (do not re-key this JSON by hand).

## Importing card færslur í Business Central (bank reconciliation)

A credit card er reconciled in BC as a **bankareikningur**, using the staðlaða bank-reconciliation flow. Tengingin fetches the card færslur fyrir you — you do **not** pass `cardId`, `dateFrom`, eða `dateTo` til the import.

**Step 1 — one-time setup of the card as a bankareikningur.** Create (eða update) a BC `Bank Account` með:
- `Bank Account No.` = the numeric `cardId` (digits Aðeins, e.g. `4731814`). The import reads the cardId frá these digits.
- `Bank Statement Import Format` = `SPAR-CARD-FEED-IN` (installed by this extension).
- `Currency Code` = the card's currency (usually `ISK`).

You getur do this með `Data.Records.Set` (subject `Bank Account`):
```json
{ "data": [ { "primaryKey": { "No_": "SPAR-CC-4731814" },
  "fields": { "Name": "Spar Visa 4731814", "BankAccountNo_": "4731814",
              "BankStatementImportFormat": "SPAR-CARD-FEED-IN", "CurrencyCode": "ISK" } } ] }
```

**Step 2 — create the reconciliation og import lines.** Kallaðu á `Finance.BankReconciliation.Create` með `subject` = the bankareikningur `No.` og an valfrjálst `data.statementDate`:
```json
{ "subject": "SPAR-CC-4731814", "data": { "statementDate": "2026-06-20" } }
```
This Býr til a `Bank Acc. Reconciliation` (Statement Gerð = Bank Reconciliation) og imports every card færsla in the window as `Bank Acc. Reconciliation Line` rows. Then run `Finance.BankReconciliation.Match` og `Finance.BankReconciliation.Post` (see their help).

**Date window (computed sjálfkrafa):**
- Lower bound = the day eftir the most recent **posted** statement fyrir the reikningur; on the first-ever import there er none, so it defaults til one year áður en the upper bound.
- Upper bound = `statementDate`, capped at **yesterday** (Spar never Skilar færslur dated today; any future-dated rows eru dropped og excluded frá balances).
- Run the import **monthly** til anchor each statement on the previous one; the first run spans a year, so its opening balance mun look large.

**Signs (bank-statement convention).** Both this message Gerð's JSON `amount` og the imported reconciliation lines Notaðu bank-statement signs: a card purchase er money **out** (negative `amount` / `Statement Amount`) og a greiðsla/credit til the card er money **in** (positive). The card's outstanding balance er an amount owed, so `balance` og the imported ending balance eru **negative** (a liability). Credit limits, available credit, turnover, og usage keep their native positive sign.

**Balances og statement date (set by the import):**
- `Statement Ending Balance` = the **negative** of the card's current outstanding balance (frá `Sparisjodir.CreditCard.GetOne`) — e.g. a balance owed of 2,500 imports as −2,500.
- `Balance Last Statement` (opening) = ending balance − Σ(imported line amounts); it reconciles exactly með the imported lines.
- `Statement Date` = the latest imported færsla date (≤ yesterday).
- Ef a previous posted statement exists, its ending balance er used as the opening balance og a warning er logged Þegar it does not match the computed opening.

**Requires:** `Spar Card Gate` permission set (the import calls the same CreditCardService operations as this message Gerð).


