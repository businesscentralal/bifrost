---
id: statement-import-summary
title: "Statement Import Summary"
---

**Statement Import Summary** opens when a bank statement has been imported into a bank account
reconciliation. It shows what arrived and how the balances add up, so the accountant can check the
import before matching the lines.

Everything on it is read-only. Closing it does not undo the import.

## Result

| Field | Description |
| --- | --- |
| **Bank Account No.** | The Business Central bank account the statement was imported to. |
| **Statement No.** | The reconciliation's statement number. |
| **Lines Imported** | How many reconciliation lines the import created. |

## Warning

A warning appears when something does not agree, most often when the opening balance worked out from the
statement differs from the balance the reconciliation starts from. That usually means the import started
on the wrong day, or part of the period was imported before. The lines are still there: check them, and
import again for the right period if the balances are wrong.

## Balances

| Field | Description |
| --- | --- |
| **Calc Starting Balance** | The opening balance worked out from the statement: the balance of the first line less its amount. |
| **Calc Ending Balance** | The closing balance worked out from the statement: the balance of the last line. |
| **Bank-Reported Balance** | The closing balance the bank reported. |
| **Available Amount** | The amount available on the account, as the bank reported it. |
| **Overdraft** | The overdraft facility on the account. |
| **Total Amount Waiting** | The total of transactions waiting to be posted on the account. |

**Calc Ending Balance** and **Bank-Reported Balance** should agree. **Available Amount** can differ from
the closing balance, because it counts the overdraft and the amounts waiting.

## Account

The **Account** group repeats what the bank sent about the account: account number, IBAN, currency, the
owner's kennitala, the account's own name, its status and other information. Use it to check that the
statement is for the account you meant.

## Good to know

- Every imported statement is also checked against the open payments of the account. A payment the
  statement shows is marked paid on [Bank Payment Batches](/help/iceland-treasury/bank-payment-batches/).
- How the start of the period is chosen: [Select Start Date](/help/iceland-treasury/date-input-dialog/).
