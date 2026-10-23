---
id: arion
title: "Arion banki"
sidebar_label: "Arion banki"
sidebar_position: 1
description: "What Bifröst Iceland Treasury does with Arion banki: statements and credit card transactions into bank reconciliation, accounts, bills, credit cards, payment and foreign payment batches, claims, foreign-currency accounts and currency rates."
---

# Arion banki

This page is for the finance team and the Business Central administrator at a company that banks with
Arion banki. It explains what [Bifröst Iceland Treasury](/iceland-treasury/) does with Arion banki,
what you set up, and what you see in Business Central afterwards.

## What it does for you

- **Statements into bank reconciliation.** Import an Arion banki account statement straight into a bank
  account reconciliation, or read a statement for any account and period. Credit card transactions are
  imported the same way.
- **Accounts.** List the accounts your bank user may see, look one up, list the accounts a kennitala
  owns, and verify that a kennitala owns an account before you pay to it.
- **Bills and credit cards.** See bills (*seðlar*) addressed to the company and their details, your
  credit cards, and card transactions by period or due month.
- **Payment batches.** Register domestic (ISK) payment batches for approval at the bank and read the
  result of each payment.
- **Foreign payments.** Register foreign payment batches for approval at the bank, with a numeric Central
  Bank category key for each payment, see your batches and their payments, and fetch the receipts.
- **Foreign-currency accounts.** See your foreign-currency accounts with their transactions and
  statements.
- **Claims (*kröfur*).** Create, change and cancel claims in batches: the bank accepts the batch first
  and reports each claim's outcome afterwards. Find claims, follow a claim through its history, and see
  the payments received against them.
- **Currency rates.** Arion banki's buying and selling rates for a date.

## What you set up

1. **An agreement with Arion banki** for the web services you use, with a user name, a password and a
   client certificate (a `.pfx` file with its own password).
2. **The Arion banki row on [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)**:
   leave it enabled, enter the company user name, then use **Set Company Password** and **Set
   Certificate**. **Secrets** shows **Complete** when both are stored.
3. **Personal logins, if your users have their own at the bank.** Each user enters their own user name
   and password on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).
4. **Bank reconciliation.** On the Business Central bank account, set **Bank Account No.** to the Arion
   banki account and **Bank Statement Import Format** to `ARION-FEED-IN`. For a credit card, use a bank
   account whose **Bank Account No.** is the card id and the format `ARION-CARD-FEED-IN`.
5. **Claims.** Set the claim identifier from your collection agreement and the last claim number used on
   a [Payment Method](/help/iceland-treasury/payment-methods/) for each collection agreement.
6. **Permissions.** Assign the [permission sets](/iceland-treasury/#permissions) for what each user may
   do.

## What you see in Business Central

- **Import Bank Statement** on a bank account reconciliation fetches the statement from Arion banki.
  The period starts the day after the last posted statement; the first time, it asks for a
  [start date](/help/iceland-treasury/date-input-dialog/). The
  [Statement Import Summary](/help/iceland-treasury/statement-import-summary/) then shows the lines
  imported and the balances, and warns when they do not agree with the bank.
- Payment batches, claims, claim batches and claim payments appear on the tracking pages reached from
  **Bifrost Iceland Treasury Setup**; see [Payments and claims](/iceland-treasury/payments-and-claims/).
- The **Customer Ledger Entry Details** FactBox shows the claim that collects an entry.
- Every call to the bank is logged on the **Bifrost Request Log**, with passwords masked.

## Moving from Origo's earlier Arion banki app

Install Bifröst Iceland Treasury next to the earlier app. On install it takes over the Arion banki data:
claims, batches, the claim fields on Payment Methods, the Arion banki settings and the users' permission
assignments, which move to the matching permission sets of this app. Then you can remove the earlier
app. Data already in Bifröst Iceland Treasury is never overwritten.

Passwords and certificates do not carry over. Enter them once after the switch.

## Next steps

- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
- [Payments and claims](/iceland-treasury/payments-and-claims/)
- [Iceland Treasury overview](/iceland-treasury/)
