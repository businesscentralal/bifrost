---
id: islandsbanki
title: "Íslandsbanki"
sidebar_label: "Íslandsbanki"
sidebar_position: 2
description: "What Bifröst Iceland Treasury does with Íslandsbanki: statements into bank reconciliation, currency rates, account verification, unpaid invoices, foreign payment batches and claims."
---

# Íslandsbanki

This page is for the finance team and the Business Central administrator at a company that banks with
Íslandsbanki. It explains what [Bifröst Iceland Treasury](/iceland-treasury/) does with Íslandsbanki,
what you set up, and what you see in Business Central afterwards.

## What it does for you

- **Statements into bank reconciliation.** Import an Íslandsbanki account statement straight into a
  bank account reconciliation, or read a statement for any account and period.
- **Currency rates.** The bank's exchange rates for a date.
- **Account checks.** Verify that an account exists before you pay to it, and list the unpaid invoices
  addressed to a kennitala.
- **Foreign payments.** Register foreign payment batches for approval at the bank, with a numeric Central
  Bank category key for each payment, get the bank's quote for a batch (rate and charges), and follow its
  status. A batch has one payer, the company unless the batch names another.
- **Claims (*kröfur*).** Create, change and cancel claims in batches: the bank accepts the batch first
  and reports each claim's outcome afterwards. Look a claim up, list claims for a period, see the
  payments received against them, and reactivate a cancelled claim.

Bifröst does not register domestic (ISK) payment batches at Íslandsbanki. Register them in the bank's
online banking.

## What you set up

1. **An agreement with Íslandsbanki** for the web services you use, with a user name, a password and a
   client certificate (a `.pfx` file with its own password).
2. **The Íslandsbanki row on [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)**:
   leave it enabled, enter the company user name, then use **Set Company Password** and **Set
   Certificate**. **Secrets** shows **Complete** when both are stored.
3. **Personal logins, if your users have their own at the bank.** Each user enters their own user name
   and password on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).
4. **Bank reconciliation.** On the Business Central bank account, set **Bank Account No.** to the
   Íslandsbanki account and **Bank Statement Import Format** to `ISB-FEED-IN`.
5. **Claims.** A claim at Íslandsbanki is created under a claim template code from the bank's online
   banking. Set that code as the claim identifier, and the last claim number used, on a
   [Payment Method](/help/iceland-treasury/payment-methods/) for each collection agreement. The claim
   account is the template's branch, the ledger `66` and the claim number.
6. **Permissions.** Assign the [permission sets](/iceland-treasury/#permissions) for what each user may
   do.

## What you see in Business Central

- **Import Bank Statement** on a bank account reconciliation fetches the statement from Íslandsbanki.
  The period starts the day after the last posted statement; the first time, it asks for a
  [start date](/help/iceland-treasury/date-input-dialog/). The
  [Statement Import Summary](/help/iceland-treasury/statement-import-summary/) then shows the lines
  imported and the balances, and warns when they do not agree with the bank.
- Foreign payment batches, claims, claim batches and claim payments appear on the tracking pages reached
  from **Bifrost Iceland Treasury Setup**; see [Payments and claims](/iceland-treasury/payments-and-claims/).
- The customer ledger entry FactBox shows the claim that collects an entry.
- Every call to the bank is logged on the **Bifrost Request Log**, with passwords masked.

## Next steps

- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
- [Payments and claims](/iceland-treasury/payments-and-claims/)
- [Iceland Treasury overview](/iceland-treasury/)
