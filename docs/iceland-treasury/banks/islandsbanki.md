---
id: islandsbanki
title: "Íslandsbanki"
sidebar_label: "Íslandsbanki"
sidebar_position: 2
description: "What Bifröst Iceland Treasury does with Íslandsbanki: statements into bank reconciliation, currency rates, account verification, unpaid invoices, domestic and foreign payment batches and claims."
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
- **Domestic payments.** Register domestic (ISK) payment batches, made up of transfers and claim
  payments, on Íslandsbanki's own payment service. A person at your company approves and pays the batch in
  the online bank. Before that you can check the batch at the bank and read its result. The bank takes the
  batch total from the paying account in one withdrawal.
- **Foreign payments.** Register foreign payment batches for approval at the bank, with a numeric Central
  Bank category key for each payment, get the bank's quote for a batch (rate and charges), and follow its
  status. A batch has one payer, the company unless the batch names another.
- **Claims (*kröfur*).** Create, change and cancel claims in batches: the bank accepts the batch first
  and reports each claim's outcome afterwards. Look a claim up, list claims for a period, see the
  payments received against them, and reactivate a cancelled claim.

Bifröst never approves or pays a batch. A batch name has at most 20 characters, and a transfer's
reference at most 7: the bank's limits, checked before the bank is called. Once a batch is approved, the
bank no longer lets the web-service user read it, so its status in Business Central becomes **Unknown**.
The statement of the paying account then shows when its payments are paid.

## What you set up

1. **An agreement with Íslandsbanki** for the web services you use, with a user name, a password and a
   client certificate (a `.pfx` file with its own password).
2. **The Íslandsbanki row on [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)**:
   leave it enabled, enter the company user name, then use **Set Company Password** and **Set
   Certificate**. **Secrets** shows **Complete** when both are stored. Leave **SOAP Signer** blank unless
   the bank tells you to use WSE2 or WSE3. You can change the field only for
   Íslandsbanki, Kvika banki and Sparisjóðir; on other rows it is read-only.
