---
id: sparisjodir
title: "Sparisjóðir"
sidebar_label: "Sparisjóðir"
sidebar_position: 5
description: "What Bifröst Iceland Treasury does with the savings banks (sparisjóðir): statements into bank reconciliation, currency rates, account verification, domestic payment batches and claims."
---

# Sparisjóðir

This page is for the finance team and the Business Central administrator at a company that banks with a
savings bank (*sparisjóður*). It explains what [Bifröst Iceland Treasury](/iceland-treasury/) does with
the savings banks, what you set up, and what you see in Business Central afterwards.

Bifröst connects to these savings banks:

| Savings bank | Bank number |
|---|---|
| Sparisjóður Austurlands | 1106 |
| Sparisjóður Suður-Þingeyinga | 1110 |
| Sparisjóður Strandamanna | 1161 |
| Sparisjóður Höfðhverfinga | 1187 |

They share one **Sparisjóðir** row in setup. Bifröst picks the savings bank from the first four digits of
the account in each request: the account a statement is for, the account a batch is paid from, or the
claim account.

## What it does for you

- **Statements into bank reconciliation.** Import a savings bank account statement straight into a bank
  account reconciliation, or read a statement for any account and period.
- **Currency rates.** The savings bank's exchange rates for a date.
- **Account checks.** Verify that an account exists before you pay to it, and that it belongs to a given
  kennitala.
- **Domestic payment batches.** Register domestic (ISK) payment batches at the savings bank and read each
  batch's result. Whether a batch waits for a person to approve it in the online bank depends on the
  rights the savings bank gives your web-service user: confirm this with the savings bank before you
  register real payments.
- **Claims (*kröfur*).** Create, change and cancel claims in batches: the savings bank accepts the batch
  first and reports each claim's outcome afterwards. Look a claim up, list claims for a period and see
  the payments received against them. The savings bank has to grant your web-service user the claim
  rights for the claimant's kennitala.

Bifröst does not register foreign payment batches at the savings banks.

## What you set up

1. **An agreement with your savings bank** for the web services you use, with a user name, a password and
   a client certificate (a `.pfx` file with its own password).
2. **The Sparisjóðir row on [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)**:
   leave it enabled, enter the company user name, then use **Set Company Password** and **Set
   Certificate**. **Secrets** shows **Complete** when both are stored. Leave **SOAP Signer** blank: the
   savings banks sign with WSE3. Choose **WSE2** only if the savings bank asks for it.
3. **Personal logins, if your users have their own at the savings bank.** Each user enters their own user
   name and password on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).
4. **Bank reconciliation.** On the Business Central bank account, set **Bank Account No.** to the savings
   bank account and **Bank Statement Import Format** to `SPAR-FEED-IN`. The same format serves all four
   savings banks.
5. **Claims.** A claim at a savings bank is created under a claim template code from the savings bank. Set
   that code as the claim identifier, and the last claim number used, on a
   [Payment Method](/help/iceland-treasury/payment-methods/) for each collection agreement. The claim
   account is the claimant's savings bank account: the bank number, the ledger `66` and the claim number.
6. **Permissions.** Assign the [permission sets](/iceland-treasury/#permissions) for what each user may
   do. Registering payment batches needs `BIFROST TPay ori`.

## What you see in Business Central

- **Import Bank Statement** on a bank account reconciliation fetches the statement from the savings bank.
  The period starts the day after the last posted statement; the first time, it asks for a
  [start date](/help/iceland-treasury/date-input-dialog/). The
  [Statement Import Summary](/help/iceland-treasury/statement-import-summary/) then shows the lines
  imported and the balances, and warns when they do not agree with the bank.
- Payment batches, claims, claim batches and claim payments appear on the tracking pages reached from
  **Bifrost Iceland Treasury Setup**, with **Sparisjóðir** as the bank; see
  [Payments and claims](/iceland-treasury/payments-and-claims/). A statement that shows a payment marks it
  paid.
- The **Customer Ledger Entry Details** FactBox shows the claim that collects an entry.
- Every call to the savings bank is logged on the **Bifrost Request Log**, with passwords masked.

## Next steps

- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
- [Payments and claims](/iceland-treasury/payments-and-claims/)
- [Iceland Treasury overview](/iceland-treasury/)
