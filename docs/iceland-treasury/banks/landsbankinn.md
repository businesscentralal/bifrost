---
id: landsbankinn
title: "Landsbankinn"
sidebar_label: "Landsbankinn"
sidebar_position: 4
description: "What Bifröst Iceland Treasury does with Landsbankinn: statements and card transactions into bank reconciliation, accounts, payment and foreign payment batches, claims and claim templates, corporate cards, portfolios, electronic documents, acquiring and rates."
---

# Landsbankinn

This page is for the finance team and the Business Central administrator at a company that banks with
Landsbankinn. It explains what [Bifröst Iceland Treasury](/iceland-treasury/) does with Landsbankinn,
what you set up, and what you see in Business Central afterwards.

## What it does for you

- **Statements and card transactions into bank reconciliation.** Import a Landsbankinn account
  statement, or the transactions of a corporate card, straight into a bank account reconciliation.
- **Accounts.** List your accounts, see an account's details and transactions, read the end-of-day
  balance, and verify an account before you pay to it.
- **Payment batches.** Register domestic (ISK) payment batches for approval at the bank and read their
  result, and look up unpaid invoices and payment slips addressed to the company.
- **Foreign payments.** Register foreign payment batches for approval at the bank, with a three-letter
  Central Bank category key for each payment, and follow their status.
- **Claims (*kröfur*).** Create a claim under one of your claim templates, read, change and delete
  claims, list them by due date, and see the payments received, for the company or for one claim.
  Claim batches send many claim actions at once and report the result afterwards.
- **Claim templates.** Manage the templates claims are created under, see the claimant's accesses, and
  check what the claimant still has to accept at the bank before claims can be created.
- **Corporate cards.** Your cards, their transactions and receipts, and the card ledger keys, groups
  and sub-groups, including setting the ledger key and comment of a transaction.
- **Portfolios.** Portfolios, holdings, returns and asset transactions such as trades and dividends.
- **Electronic documents.** Upload documents one at a time or in a batch, list and download the
  documents you have received, and link documents to each other.
- **Card acquiring.** Settlements and the transactions behind them, if you take card payments through
  Landsbankinn.
- **Rates.** Currency rates, deposit and lending interest rates, bank fees and fund data.

## What you set up

1. **An agreement with Landsbankinn** for the web services you use, with a user name and password, a
   client certificate (a `.pfx` file with its own password) and an API key.
2. **The Landsbankinn row on [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)**:
   leave it enabled, enter the company user name, then use **Set Company Password**, **Set Certificate**
   and **Set API Key**. **Secrets** shows **Complete** when all are stored.
3. **Personal logins, if your users have their own at the bank.** Each user enters their own user name,
   password and API key on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).
4. **Bank reconciliation.** On the Business Central bank account, set **Bank Account No.** to the
   Landsbankinn account and **Bank Statement Import Format** to `LBI-FEED-IN`. For a corporate card, use
   a bank account whose **Bank Account No.** is the card id and the format `LBI-CARD-IN`.
5. **Claims.** The claimant must have accepted Landsbankinn's claim terms in the online bank. Create a
   claim template there or through Bifröst, and set the claim identifier and last claim number on a
   [Payment Method](/help/iceland-treasury/payment-methods/) for each collection agreement. The claimant's
   kennitala is read from **Company Information**.
6. **Permissions.** Assign the [permission sets](/iceland-treasury/#permissions) for what each user may
   do.

## What you see in Business Central

- **Import Bank Statement** on a bank account reconciliation fetches the statement or the card
  transactions. The period starts the day after the last posted statement; the first time, it asks for
  a [start date](/help/iceland-treasury/date-input-dialog/). The
  [Statement Import Summary](/help/iceland-treasury/statement-import-summary/) then shows the lines
  imported and the balances, and warns when they do not agree with the bank.
- Payment batches, claims and claim payments appear on the tracking pages reached from **Bifrost
  Iceland Treasury Setup**; see [Payments and claims](/iceland-treasury/payments-and-claims/).
- The **Customer Ledger Entry Details** FactBox shows the claim that collects an entry.
- Every call to the bank is logged on the **Bifrost Request Log**, with passwords and keys masked.

## Moving from Origo's earlier Landsbankinn app

Install Bifröst Iceland Treasury next to the earlier app. On install it takes over the Landsbankinn
data: claims and claim payments, claim and payment batches, the claim fields on Payment Methods, the
users' Landsbankinn settings and their permission assignments, which move to the matching permission
sets of this app. Then you can remove the earlier app. Data already in Bifröst Iceland Treasury is never
overwritten.

Passwords, certificates and API keys do not carry over. Enter them once after the switch.

## Next steps

- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
- [Payments and claims](/iceland-treasury/payments-and-claims/)
- [Iceland Treasury overview](/iceland-treasury/)
