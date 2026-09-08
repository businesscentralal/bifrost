---
id: statement-import-summary
title: "Statement Import Summary"
sidebar_label: "Import Summary"
sidebar_position: 9
---

**Statement Import Summary** opens as soon as a bank statement has been imported from Landsbankinn, Arion banki or Sparisjóður. It reports what arrived and how the figures add up, so you can check the import before you start matching lines.

Everything on it is read-only. Closing it does not undo the import.

## Result

| Field | Description |
|---|---|
| **Bank Account No.** | The Business Central bank account the statement was imported to. |
| **Statement No.** | The reconciliation statement the lines were created under. |
| **Lines Imported** | How many bank account reconciliation lines the import created. |

## Warning

A warning band appears only when something does not agree — most often when the calculated opening balance does not match the closing balance of the previous statement. That normally means the import began on the wrong date, or a statement was imported twice.

The lines are still there. Review them, correct the date range and re-import if the balances are wrong.

## Balances

| Field | Description |
|---|---|
| **Calc Starting Balance** | The opening balance worked out from the statement itself: the balance on the first row less that row's amount. |
| **Calc Ending Balance** | The closing balance worked out from the statement: the balance on the last row. |
| **Bank-Reported Balance** | The closing balance the bank stated in the statement header. |
| **Available Amount** | The amount available on the account, as the bank reported it. |
| **Overdraft** | The overdraft facility on the account. |
| **Total Amount Waiting** | The total of transactions the bank is holding but has not yet posted. |

**Calc Ending Balance** and **Bank-Reported Balance** are derived two different ways and should agree. If they do not, the statement is incomplete — usually because a date range cut it short.

**Available Amount** legitimately differs from the closing balance: it accounts for the overdraft facility and for amounts still waiting.

## Account

The account section repeats what the bank sent in the statement header — account number, IBAN, currency, the owner's kennitala, any custom name set on the account, its status, and any additional information the bank returned. Use it to confirm that the statement is for the account you meant.

## Related

- [Select Start Date](./date-input-dialog.md) — how the date range is decided
