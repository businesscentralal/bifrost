---
id: kvika
title: "Kvika banki"
sidebar_label: "Kvika banki"
sidebar_position: 3
description: "What Bifröst Iceland Treasury does with Kvika banki: statements into bank reconciliation, currency rates, domestic payment batches and claims."
---

# Kvika banki

This page is for the finance team and the Business Central administrator at a company that banks with
Kvika banki. It explains what [Bifröst Iceland Treasury](/iceland-treasury/) does with Kvika banki, what
you set up, and what you see in Business Central afterwards.

## What it does for you

- **Statements into bank reconciliation.** Import a Kvika banki account statement straight into a bank
  account reconciliation, or read a statement for any account and period.
- **Currency rates.** The bank's exchange rates for a date.
- **Domestic payment batches.** Register domestic (ISK) payment batches at Kvika banki and read each
  batch's result. Whether a batch waits for a person to approve it in the online bank depends on the
  rights Kvika banki gives your web-service user: confirm this with the bank before you register real
  payments.
- **Claims (*kröfur*).** Create, change and cancel claims in batches: the bank accepts the batch first
  and reports each claim's outcome afterwards. Look a claim up, list claims for a period and see the
  payments received against them. Kvika banki has to grant your web-service user the claim rights for
  the claimant's kennitala.

Bifröst does not register foreign payment batches at Kvika banki.

## What you set up

1. **An agreement with Kvika banki** for the web services you use, with a user name, a password and a
   client certificate (a `.pfx` file with its own password).
2. **The Kvika banki row on [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)**:
   leave it enabled, enter the company user name, then use **Set Company Password** and **Set
   Certificate**. **Secrets** shows **Complete** when both are stored. Leave **SOAP Signer** blank unless
   the bank asks for another profile.
3. **Personal logins, if your users have their own at the bank.** Each user enters their own user name
   and password on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).
4. **Bank reconciliation.** On the Business Central bank account, set **Bank Account No.** to the Kvika
   banki account and **Bank Statement Import Format** to `KVIKA-FEED-IN`.
5. **Claims.** A claim at Kvika banki is created under a claim template code from the bank. Set that code
   as the claim identifier, and the last claim number used, on a
   [Payment Method](/help/iceland-treasury/payment-methods/) for each collection agreement.
6. **Permissions.** Assign the [permission sets](/iceland-treasury/#permissions) for what each user may
   do. Registering payment batches needs `BIFROST TPay ori`.

## What you see in Business Central

- **Import Bank Statement** on a bank account reconciliation fetches the statement from Kvika banki. The
  period starts the day after the last posted statement; the first time, it asks for a
  [start date](/help/iceland-treasury/date-input-dialog/). The
  [Statement Import Summary](/help/iceland-treasury/statement-import-summary/) then shows the lines
  imported and the balances, and warns when they do not agree with the bank.
- Payment batches, claims, claim batches and claim payments appear on the tracking pages reached from
  **Bifrost Iceland Treasury Setup**; see [Payments and claims](/iceland-treasury/payments-and-claims/).
  A statement that shows a payment marks it paid.
- The **Customer Ledger Entry Details** FactBox shows the claim that collects an entry.
- Every call to the bank is logged on the **Bifrost Request Log**, with passwords masked.

## Next steps

- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
- [Payments and claims](/iceland-treasury/payments-and-claims/)
- [Iceland Treasury overview](/iceland-treasury/)
