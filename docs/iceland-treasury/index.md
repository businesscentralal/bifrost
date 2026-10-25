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
- **Register payment batches.** Register domestic (ISK) payment batches at Arion banki, Kvika banki,
  Landsbankinn and the savings banks, and foreign payment batches at Arion banki, Íslandsbanki and
  Landsbankinn. At Arion banki and Landsbankinn a person at your company approves and pays each batch in
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
| **Islandsbanki** | Statements and bank reconciliation import, account verification, unpaid invoices, foreign payment batches with the bank's quote and result, claims created, changed and cancelled in batches, with their payments and reactivation, currency rates |
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
| 6 | Give each user or service the permission sets for what they may do at the bank (see [Permissions](#permissions)). Users who have their own login at a bank enter it on **Bifrost User Setup**. | Business Central administrator, then each user |

The help of each page has the details: [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/),
the [setup wizard](/help/iceland-treasury/treasury-setup-wizard/),
[Bank secrets](/help/iceland-treasury/treasury-secrets/),
[Bank credentials for your user](/help/iceland-treasury/bank-user-setup/) and
[Payment Methods](/help/iceland-treasury/payment-methods/).

What each bank covers and needs: [Arion banki](/iceland-treasury/banks/arion/), [Íslandsbanki](/iceland-treasury/banks/islandsbanki/),
[Kvika banki](/iceland-treasury/banks/kvika/), [Landsbankinn](/iceland-treasury/banks/landsbankinn/) and
[Sparisjóðir](/iceland-treasury/banks/sparisjodir/). The claim collection agencies:
[Gjaldskil](/iceland-treasury/agencies/gjaldskil/) and [InKasso](/iceland-treasury/agencies/inkasso/). How a payment and a claim are followed from start to finish:
[Payments and claims](/iceland-treasury/payments-and-claims/).

## Permissions

Each kind of work has its own permission set, the same for every bank and agency, so a user can read statements
without being allowed to pay. Each set includes read access to the tracking pages. Rates need no set of their
own.

| Permission set | For | Included in `BIFROST Full ori` | Included in `BIFROST Read ori` |
|---|---|---|---|
| `BIFROST TPay ori` | Domestic payment batches and their results | No | No |
| `BIFROST TFrgPay ori` | Foreign payment batches, quotes, results and receipts | No | No |
| `BIFROST TClmEdit ori` | Creating, changing and cancelling claims, claim batches and Landsbankinn claim templates | Yes | No |
| `BIFROST TClmPmt ori` | Reading claims, claim payments and claim templates | Yes | Yes |
| `BIFROST TStmt ori` | Statements, accounts, foreign-currency statements and received electronic documents at Landsbankinn | Yes | Yes |
| `BIFROST TBill ori` | Unpaid invoices, bills and payment slips | Yes | No |
| `BIFROST TCard ori` | Cards, card ledger keys and card acquiring | Yes | No |
| `BIFROST TDoc ori` | Electronic documents | Yes | No |
| `BIFROST TAsset ori` | Portfolios and asset transactions | Yes | No |
| `BIFROST TAdmin ori` | Changing the bank setup and the company's bank secrets | No | No |

Payments always need `BIFROST TPay ori` or `BIFROST TFrgPay ori`, given on purpose, even to a user with
`BIFROST Full ori`. Only a holder of `BIFROST TAdmin ori` can change **Bifrost Iceland Treasury Setup**;
for everyone else it opens read-only. Users enter their own bank password and API key without that set.

## Good to know

- **Bifröst does not approve payments.** A payment batch is registered at the bank. At Arion banki and
  Landsbankinn it waits there until a person approves and pays it in the bank's online banking; at Kvika
  banki and the savings banks that depends on the rights the bank gives your web-service user. A batch whose name contains
  *STP* is refused.
- **Start the batch name with `*`.** The online bank shows a batch registered through the web service
  only to the web service user, unless its name starts with `*`. Then every user of the company's online
  bank sees it, including the person who approves payments. A batch cannot be renamed: register it again.
- **It acts as you.** A call uses the user's own bank login when they have entered one, and the
  company's otherwise. Every call runs with the caller's own Business Central permissions and is logged
  on **Bifrost Messages**, and every call to a bank is logged on the **Bifrost Request Log** with the
  passwords masked.
- **Secrets stay in protected storage.** Passwords, certificates and API keys are entered once in a
  masked dialog and never shown again; the setup page only says whether they are stored and when the
  certificate expires.
- **Tracking is written by Bifröst.** The tracking pages are read-only. They have fields for posting in
  Business Central (document number, posting date, journal), which Bifröst does not fill: Bifröst does
  not post payments or claim payments.
- **Moving from Origo's earlier apps for Arion banki or Landsbankinn?** Install Bifröst Iceland Treasury
  next to the earlier app. Its claims, batches, settings and permission assignments are taken over on
  install, then you can remove it. Stored passwords and certificates do not carry over: enter them again.
- **Message types.** The operations this app adds are listed with all the others by the MCP tools
  (`list_domains`, `describe_domains`, `describe_message_type`) and on the **Bifrost Message Types**
  page, and each explains itself through `Help.Implementation.Get`.

## Next steps

- [Payments and claims](/iceland-treasury/payments-and-claims/): how a payment and a claim are followed
- [Arion banki](/iceland-treasury/banks/arion/) · [Íslandsbanki](/iceland-treasury/banks/islandsbanki/) · [Kvika banki](/iceland-treasury/banks/kvika/) · [Landsbankinn](/iceland-treasury/banks/landsbankinn/) · [Sparisjóðir](/iceland-treasury/banks/sparisjodir/)
- Claim collection agencies: [Gjaldskil](/iceland-treasury/agencies/gjaldskil/) · [InKasso](/iceland-treasury/agencies/inkasso/)
- [AppSource user scenarios](/iceland-treasury/user-scenarios/) · [AppSource listing text](/iceland-treasury/listing/)
