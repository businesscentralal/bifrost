---
id: date-input-dialog
title: "Select Start Date"
sidebar_label: "Select Start Date"
sidebar_position: 8
---

**Select Start Date** is the small dialog that opens when you import a bank statement from Landsbankinn, Arion banki or Sparisjóður and the connector cannot work out for itself where the statement should begin.

That happens the first time you import for a bank account, and after a gap — there is no previously posted statement whose closing date the import could continue from.

## The field

| Field | Description |
|---|---|
| **Start Date** | The first date to fetch transactions from. The import asks the bank for everything from this date up to today. |

The date must be filled in, and it must be in the past. Confirming with an empty or future date is refused, because neither can produce a statement the bank will return.

## Choosing a date

Pick the day after the last transaction you have already reconciled. Everything from that date onwards is imported, so:

- Too early and you re-import transactions that are already in Business Central. You will see them again as unmatched reconciliation lines.
- Too late and you leave a gap. The opening balance will not agree with the bank's, and the [import summary](./statement-import-summary.md) warns you about it.

When the connector already knows where to continue, this dialog does not appear at all — the import runs straight from the last posted statement date.

## Related

- [Statement Import Summary](./statement-import-summary.md) — what the import found
