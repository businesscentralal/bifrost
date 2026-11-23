---
id: index
title: "Bifröst Iceland Treasury"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Your Icelandic banks in Business Central, from an assistant or an integration: statements and bank reconciliation, payment batches, foreign payments, claims (kröfur) and their payments, at Arion banki, Íslandsbanki, Kvika banki, Landsbankinn and the savings banks, and claims at the claim collection agencies Gjaldskil and InKasso."
---

# Bifröst Iceland Treasury

**Work with your Icelandic banks from Business Central, and from the assistant or system you already
use.** Bifröst Iceland Treasury lets an integration, a scheduled routine or an AI assistant read
statements into bank reconciliation, register payment batches at the bank, create and
follow claims (*kröfur*), and confirm from the bank statement that a payment has been paid, at Arion
banki, Íslandsbanki, Kvika banki, Landsbankinn and the savings banks (*sparisjóðir*). Claims can also be
created and followed at the claim collection agencies Gjaldskil and InKasso.

This page is for the finance team and the Business Central administrator who decide whether to use the
app and set it up. Every bank and agency works the same way through Bifröst, and you set up only the ones
you use.

*An additional app on [Bifröst Foundation](/foundation/), for companies in Iceland. New to Bifröst? Start
with [How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Bring statements into bank reconciliation.** Each bank has its own bank statement import format.
  Set it on a Business Central bank account and **Import Bank Statement** fetches the statement from the
  bank and shows a summary of the lines and balances. Card transactions at Arion banki and Landsbankinn
  are imported the same way.
- **Read statements, accounts and rates.** Read a statement for any account and period, verify an
  account before you pay to it, and fetch the bank's currency rates.
- **Register payment batches.** Register domestic (ISK) payment batches at Arion banki, Íslandsbanki,
  Kvika banki, Landsbankinn and the savings banks, and foreign payment batches at Arion banki, Íslandsbanki and
  Landsbankinn. At Arion banki, Íslandsbanki and Landsbankinn a person at your company approves and pays each batch in
  the online bank; at Kvika banki and the savings banks that depends on the rights the bank gives your
  web-service user.
- **Know when a payment is paid.** When the statement of the paying account shows the payment, Bifröst
  marks it paid. Every statement you read or import is checked this way.
- **Create and follow claims (*kröfur*).** Create claims for open customer ledger entries, change or
  cancel them, and register the payments the bank reports, so each claim shows what is paid and what
  is still open. At the claim collection agencies Gjaldskil and InKasso, claims are handled the same way.
- **Follow everything in one place.** Payment batches, payments and their charges, claims, claim
  batches, claim payments and a log of every action at a bank are kept in Business Central, the same
  way for every bank.
- **Use what each bank offers.** For example card transactions and ledger keys, portfolios, electronic
  documents and card acquiring at Landsbankinn, and bills, credit cards and foreign-currency accounts at
  Arion banki. See the bank pages below.

## Capabilities

| Domain | Capabilities |
|---|---|
| **Arionbanki** | Statements and bank reconciliation import, accounts and account verification, bills, credit cards and their transactions, domestic and foreign payment batches with their results and receipts, foreign-currency accounts and statements, claims created, changed and cancelled in batches, with their history and payments, currency rates |
| **Islandsbanki** | Statements and bank reconciliation import, account verification, unpaid invoices, domestic payment batches with their check and result, foreign payment batches with the bank's quote and result, claims created, changed and cancelled in batches, with their payments and reactivation, currency rates |
| **Kvikabanki** | Statements and bank reconciliation import, domestic payment batches with their results, claims created, changed and cancelled in batches, with their payments, currency rates |
| **Sparisjodir** | Statements and bank reconciliation import, account verification, domestic payment batches with their results, claims created, changed and cancelled in batches, with their payments, currency rates |
| **Gjaldskil** | Claims created, changed and cancelled in batches, with their payments |
| **Inkasso** | Claims created, changed and cancelled in batches, with their payments |
| **Landsbankinn** | Accounts, transactions and end-of-day balances, statement and card transaction import, domestic and foreign payment batches, unpaid invoices and payment slips, claims and claim templates, claim batches and claim payments, corporate cards and card ledger keys, portfolios, electronic documents, card acquiring, currency and interest rates, fees and fund data |
| **IcelandTreasury** | Payment batches, foreign payment batches and claims at every bank and agency in one list each, with their status refreshed from the bank or agency |

## Get it

Install **Bifrost Iceland Treasury** next to Bifröst Foundation, from AppSource or through your Business
Central partner. It is for companies in Iceland. It needs Business Central 28.0 or later, Essentials or
Premium, and Bifröst Foundation 28.0.2.523 or later. For the price, contact your Business Central partner.

You also need an agreement with each bank for the web services you use, and the user name, password and
client certificate the bank issues for them (and an API key at Landsbankinn). The claim collection
agencies Gjaldskil and InKasso issue only a user name and password.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Make an agreement with each bank for its web services, and get the user name, password, client certificate and certificate password it issues. Landsbankinn also issues an API key. Gjaldskil and InKasso issue only a user name and password. | Finance, with the bank or agency |
| 2 | Install Bifröst Foundation and complete its setup, then install **Bifrost Iceland Treasury**. In the [Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/), allow outgoing HTTP requests for Bifröst apps. Nothing reaches a bank until they are allowed. | Business Central administrator |
| 3 | Run **Bifrost Iceland Treasury - Bank Setup** from **Assisted Setup**, or open **Bifrost Iceland Treasury Setup** from **Bifrost Setup**. Enter the user name and secrets of each bank you use, and turn off the banks you do not use. | Business Central administrator with `BIFROST TAdmin ori` |
| 4 | For bank reconciliation, set the bank's import format as **Bank Statement Import Format** on each Business Central bank account, with the bank's account number in **Bank Account No.** | Accountant or administrator |
| 5 | For claims, set the bank's claim identifier on a **Payment Method** for each collection agreement. | Accountant or administrator |
| 6 | Give each user or service the permission sets for what they may do at the bank (see [Permissions](#permissions)). Users who have their own login at a bank enter it on **Bifrost User Setup**, or with **Set My Bank Authorization** on **Bifrost Iceland Treasury Setup**. | Business Central administrator, then each user |

On **Bifrost Iceland Treasury Setup**, the **Information** FactBox keeps the secure connection status line
and shows **User name**, **My authorization** and **Authentication** for the selected bank. The user name
is your own or the company default, and a password is not shown. **Set My Bank Authorization** asks for
your user name and your authorization together. A blank user name keeps the company default. **Clear My
Bank Authorization** can also clear that user name. **SOAP Signer** can be changed only for Íslandsbanki,
Kvika banki and Sparisjóðir; on other rows it is read-only. Leave it blank unless the bank tells you
to use WSE2 or WSE3. Administrators can
