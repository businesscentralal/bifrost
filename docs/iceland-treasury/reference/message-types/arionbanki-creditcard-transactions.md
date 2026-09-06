---
id: arionbanki-creditcard-transactions
title: "Arionbanki.CreditCard.Transactions"
sidebar_label: "Arionbanki.CreditCard.Transactions"
sidebar_position: 17
description: "Request and response contract for the Arionbanki.CreditCard.Transactions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves transactions on a credit card, paged. One message type covers all three bank queries; the connector routes by the optional filters you supply:
- `dueDate` (yyyymm) present -> transactions for that due month (GetCreditCardTransactionsByDueDate)
- otherwise `dateFrom`/`dateTo` present -> transactions in that date range (GetCreditCardTransactionsByDate)
- otherwise -> all transactions (GetCreditCardTransactions)

**Requires:** `Arion Card Gate` permission set.

## Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cardId` | number | Yes | Numeric card identifier (from `Arionbanki.CreditCard.Get`) |
| `dateFrom` | string | No | Range start `YYYY-MM-DD` (transaction date) |
| `dateTo` | string | No | Range end `YYYY-MM-DD` (transaction date) |
| `dueDate` | string | No | Due month `yyyymm`, e.g. `202605`. Takes precedence over dateFrom/dateTo |
| `pageNumber` | number | No | 1-based page number (default 1) |
| `pageSize` | number | No | Transactions per page (default 200) |

```json
{ "cardId": 123456789, "dateFrom": "2026-05-01", "dateTo": "2026-05-31", "pageNumber": 1, "pageSize": 200 }
```

## Response

Returns `{ "status": "Success", "cardId": ..., "count": N, "paging": { "pageNumber", "pageSize", "totalPages", "totalRecords" }, "transactions": [ ... ] }`. Each transaction carries `transactionDate`, `amount` (domestic ISK, **negative for purchases / positive for payments**) + `amountCurrency`, `foreignAmount` (same sign convention) + `foreignAmountCurrency`, `currencyCode`, `dueDate` (yyyymm), `merchantName`/`merchantCity`/`merchantCountryCode`, `transactionKey`, `authorizationNumber`.

## Usage notes (for automation)

- Get `cardId` from `Arionbanki.CreditCard.Get`. The bank does not allow fetching all transactions in one call — always page (read `paging.totalPages` and iterate `pageNumber`).
- An empty window returns `status: Success` with `count: 0` (not an error).
- This message type is read-only JSON. To bring card transactions into BC as posted/reconcilable bank statement lines, use the bank-reconciliation import below instead (do not re-key this JSON by hand).

## Importing card transactions into Business Central (bank reconciliation)

A credit card is reconciled in BC as a **Bank Account**, using the standard bank-reconciliation flow. The connector fetches the card transactions for you — you do **not** pass `cardId`, `dateFrom`, or `dateTo` to the import.

**Step 1 — one-time setup of the card as a Bank Account.** Create (or update) a BC `Bank Account` with:
- `Bank Account No.` = the numeric `cardId` (digits only, e.g. `4731814`). The import reads the cardId from these digits.
- `Bank Statement Import Format` = `ARION-CARD-FEED-IN` (installed by this extension).
- `Currency Code` = the card's currency (usually `ISK`).

You can do this with `Data.Records.Set` (subject `Bank Account`):
```json
{ "data": [ { "primaryKey": { "No_": "ARION-CC-4731814" },
  "fields": { "Name": "Arion Visa 4731814", "BankAccountNo_": "4731814",
              "BankStatementImportFormat": "ARION-CARD-FEED-IN", "CurrencyCode": "ISK" } } ] }
```

**Step 2 — create the reconciliation and import lines.** Call `Finance.BankReconciliation.Create` with `subject` = the Bank Account `No.` and an optional `data.statementDate`:
```json
{ "subject": "ARION-CC-4731814", "data": { "statementDate": "2026-06-20" } }
```
This creates a `Bank Acc. Reconciliation` (Statement Type = Bank Reconciliation) and imports every card transaction in the window as `Bank Acc. Reconciliation Line` rows. Then run `Finance.BankReconciliation.Match` and `Finance.BankReconciliation.Post` (see their help).

**Date window (computed automatically):**
- Lower bound = the day after the most recent **posted** statement for the account; on the first-ever import there is none, so it defaults to one year before the upper bound.
- Upper bound = `statementDate`, capped at **yesterday** (Arion never returns transactions dated today; any future-dated rows are dropped and excluded from balances).
- Run the import **monthly** to anchor each statement on the previous one; the first run spans a year, so its opening balance will look large.

**Signs (bank-statement convention).** Both this message type's JSON `amount` and the imported reconciliation lines use bank-statement signs: a card purchase is money **out** (negative `amount` / `Statement Amount`) and a payment/credit to the card is money **in** (positive). The card's outstanding balance is an amount owed, so `balance` and the imported ending balance are **negative** (a liability). Credit limits, available credit, turnover, and usage keep their native positive sign.

**Balances and statement date (set by the import):**
- `Statement Ending Balance` = the **negative** of the card's current outstanding balance (from `Arionbanki.CreditCard.GetOne`) — e.g. a balance owed of 2,500 imports as −2,500.
- `Balance Last Statement` (opening) = ending balance − Σ(imported line amounts); it reconciles exactly with the imported lines.
- `Statement Date` = the latest imported transaction date (≤ yesterday).
- If a previous posted statement exists, its ending balance is used as the opening balance and a warning is logged when it does not match the computed opening.

**Requires:** `Arion Card Gate` permission set (the import calls the same CreditCardService operations as this message type).

