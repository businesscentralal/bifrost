---
id: gjaldskil
title: "Gjaldskil"
sidebar_label: "Gjaldskil"
sidebar_position: 1
description: "What Bifröst Iceland Treasury does with the claim collection agency Gjaldskil (Debitum): claims created, changed and cancelled in batches, and the payments received against them."
---

# Gjaldskil

This page is for the finance team and the Business Central administrator at a company that collects its
claims (*kröfur*) through Gjaldskil, also known as Debitum. It explains what
[Bifröst Iceland Treasury](/iceland-treasury/) does with Gjaldskil, what you set up, and what you see in
Business Central afterwards.

Gjaldskil is a claim collection agency, not a bank: Bifröst handles claims there, and nothing else.

## What it does for you

- **Claims (*kröfur*).** Create, change and cancel claims in batches: Gjaldskil accepts the batch first
  and reports each claim's outcome afterwards. Look a claim up, list claims for a period and see the
  payments received against them.

Bifröst does not register payments, read statements or fetch currency rates at Gjaldskil.

## What you set up

1. **An agreement with Gjaldskil** for its web service, with a user name and a password. No certificate
   is needed.
2. **The Gjaldskil row on [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)**:
   leave it enabled, enter the company user name, then use **Set Company Password**. **Secrets** shows
   **Complete** when the password is stored. **Set Certificate** is not available for Gjaldskil.
3. **Personal logins, if your users have their own at Gjaldskil.** Each user enters their own user name
   and password in the **Gjaldskil** group on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).
4. **Claims.** A claim at Gjaldskil is created under a claim template code from Gjaldskil. Set that code
   as the claim identifier, and the last claim number used, on a
   [Payment Method](/help/iceland-treasury/payment-methods/) for each collection agreement. The claim
   account has 12 digits and starts with the bank number `08`: the bank number (4 digits), the ledger
   (2) and the claim number (6). A claim whose account starts with another bank number is refused before
   anything is sent.
5. **Permissions.** Assign the same [permission sets](/iceland-treasury/#permissions) as for claims at a
   bank: `BIFROST TClmEdit ori` to create, change and cancel claims and read a batch's result, and
   `BIFROST TClmPmt ori` to read claims and their payments.

## What you see in Business Central

- Claims, claim batches and claim payments appear on the tracking pages reached from **Bifrost Iceland
  Treasury Setup**, with **Gjaldskil** as the bank, exactly like claims at a bank; see
  [Payments and claims](/iceland-treasury/payments-and-claims/).
- The **Customer Ledger Entry Details** FactBox shows the claim that collects an entry.
- Every call to Gjaldskil is logged on the **Bifrost Request Log**, with the password masked.

## Next steps

- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
- [Payments and claims](/iceland-treasury/payments-and-claims/)
- [InKasso](/iceland-treasury/agencies/inkasso/), the other claim collection agency
