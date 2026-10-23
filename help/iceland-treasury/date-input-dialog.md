---
id: date-input-dialog
title: "Select Start Date"
---

**Select Start Date** opens when you import a bank statement into a bank account reconciliation and
Bifröst cannot tell where the statement should start. It is for the accountant who reconciles the bank
account.

That happens the first time you import a statement for a bank account: there is no posted statement yet
to continue from. Afterwards the import starts the day after the last posted statement and this dialog
does not open.

## Field

| Field | Description |
| --- | --- |
| **Start Date** | The first day to fetch transactions from. The statement runs from this day to the statement date of the reconciliation, and never later than yesterday. |

## Choosing a date

Choose the day after the last transaction you have already reconciled in Business Central.

- Too early, and transactions that are already in Business Central are imported again as unmatched lines.
- Too late, and transactions are missing; the opening balance then does not agree with the bank, and the
  [Statement Import Summary](/help/iceland-treasury/statement-import-summary/) warns you.

When the import runs in the background, for example from a routine, it cannot ask: it starts one year
before the statement date.
