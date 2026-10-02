---
id: landsbankinn
title: "Landsbankinn"
sidebar_label: "Landsbankinn"
sidebar_position: 1
description: "What Bifröst Iceland Treasury does with Landsbankinn: claims, corporate cards, accounts, portfolios, electronic documents, acquiring, payments, rates and statement import."
---

This page is for the finance team and the Business Central administrator at a company that banks
with Landsbankinn. It explains what the Landsbankinn connector in
[Bifröst Iceland Treasury](/iceland-treasury/) does, what you set up, and what you see in Business
Central afterwards. Landsbankinn is the bank with the widest coverage in the app.

## What it does for you

- **Statements and card transactions into a reconciliation.** Import a Landsbankinn account
  statement, or the transactions of a corporate card, straight into **Bank Acc. Reconciliation**.
- **Accounts.** List your accounts, see one account's detail and transactions, read the end-of-day
  balance and accrued interest, and verify that an account exists before you pay to it.
- **Claims (*kröfur*).** Create, read, change and cancel claims one at a time, or send a batch of
  claim actions and follow its result. See the payments received, for the company or for one claim.
- **Claim templates.** Manage the collection agreements claims are created under, see which accesses
  a claimant holds, and check what a claimant still has to fulfil.
- **Corporate cards.** See your cards, their transactions and receipts, and keep the ledger key
  structure (keys, groups and sub-groups), including assigning a ledger key and comment to a
  transaction.
- **Portfolios.** Portfolios, holdings, gains and losses, and asset transactions such as trades and
  dividends.
- **Electronic documents.** Upload documents one at a time or in a batch, list and download the
  documents you have received, and link documents to the records they belong to.
- **Acquiring.** Settlement batches and the transactions behind them, if you take card payments
  through Landsbankinn.
- **Payments.** Send domestic payment batches and collect the result, look up unpaid invoices and
  payment slips, and send foreign payments and follow their status.
- **Rates and reference data.** Exchange rates, deposit and lending interest rates, bank fees and
  Landsbréf fund data. These need no permission set of their own.

You, a scheduled routine or an AI assistant can ask for any of these. The installed operations and
their contracts are read from Business Central itself: the MCP tools `list_message_types` and
`describe_message_type`, or the Bifrost Message Types page.

## What you set up

1. **An agreement with Landsbankinn** for the services you use, with a B2B user name and password, a
   client signing certificate (a `.pfx` file with its own password) and an API key.
2. **The Landsbankinn row on Bifrost Iceland Treasury Setup**: leave it enabled, enter the company
   user name, then use **Set Company Password**, **Set Certificate** and **Set API Key**. See the
   [setup page help](/help/iceland-treasury/treasury-setup/) and
   [Draupnir signers](../reference/draupnir-signers.md).
3. **Personal credentials, if your users have their own login at the bank.** Each user enters their
   own user name, password and API key on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).
4. **Statement import.** On the Business Central bank account, choose `LBI-FEED-IN` as **Bank
   Statement Import Format** for an account, or `LBI-CARD-IN` for a corporate card (on a bank account
   whose account number holds the card id).
5. **Claims.** On each Payment Method used for collection, enter the **Landsbankinn Claim
   Identifier** the bank assigned to that collection agreement. **Landsbankinn Last Claim No.**
   keeps the numbering going. The claimant kennitala is read from Company Information. See
   [Payment Methods](/help/iceland-treasury/payment-methods/).
6. **Permissions.** Assign the permission sets below.

| Credential | Kept for | Notes |
| --- | --- | --- |
| Company password | The company | The company-default B2B password. |
| User password | Each user | Used together with the user's own user name. |
| Client certificate and its password | The company | Signs the requests that need a signature. Its expiry date shows on the setup page. |
| API key | The company | Used by Landsbankinn's newer services. |
| User API key | Each user | Overrides the company API key for that user. |

All values are entered in masked dialogs and never shown again; see
[Bank secrets](/help/iceland-treasury/treasury-secrets/).

## What you see in Business Central

- **Import Bank Statement** on a Bank Acc. Reconciliation fetches the statement or card transactions
  from Landsbankinn. The period starts at the reconciliation's statement date or the day after the
  last posted statement; when there is none, it asks for a
  [start date](/help/iceland-treasury/date-input-dialog/). A
  [Statement Import Summary](/help/iceland-treasury/statement-import-summary/) then shows the lines
  imported and the opening and closing balances, and warns when they do not agree with the bank.
- **Payment Methods** show the Landsbankinn claim identifier and last claim number.
- The **Customer Ledger Entry** FactBox shows the Landsbankinn claim account and claim date, for
  users who may read claims. See the
  [customer ledger FactBox](/help/iceland-treasury/customer-ledger-factbox/).
- Every call to the bank is logged on the **Bifrost Request Log**, with credentials masked.

## Permission sets

Areas that move money or change something at the bank have their own permission set, so a user can
be allowed to read card transactions without being able to pay.

| Permission set | Grants |
| --- | --- |
| `BIFROST LBStmt ori` | Accounts, transactions and end-of-day balance; reading received electronic documents |
| `BIFROST LBCards ori` | Corporate cards, including ledger keys, groups and sub-groups |
| `BIFROST LBAssets ori` | Portfolios, holdings, returns and asset transactions |
| `BIFROST LBClmPmt ori` | Claim payments |
| `BIFROST LBClmCrt ori` | Claim batches and their results |
| `BIFROST LBPaymt ori` | Domestic payments, payment results and unpaid invoices |
| `BIFROST LBFrgPay ori` | Foreign payments and their status |
| `BIFROST LBEDoc ori` | Uploading electronic documents, document types and links |

`BIFROST LBFull ori` extends Foundation's `BIFROST Full ori`, so anyone with full Bifröst access
reaches all of Landsbankinn. `BIFROST LBRdClm ori` extends `BIFROST Read ori` with read access to
claims and claim payments. Single claims, claim templates, acquiring, rates, account verification
and payment slips need only general Bifröst access.

## Moving from Origo Cloud Events Landsbankinn

Install Bifröst Iceland Treasury beside the old app. On first install it takes over the Landsbankinn
data (claims and claim payments, claim and payment batches, the claim fields on Payment Methods, the
users' Landsbankinn settings and their permission set assignments), then you can remove the old app.
Data already in the new app is never overwritten.

**Passwords, certificates and API keys do not carry over.** Enter them once after the switch. Enter
Arion banki's again too: the old apps could mix up the two banks' stored values, so neither is
carried over.

## Where to go next

- [Iceland Treasury overview](/iceland-treasury/)
- [Draupnir signers](../reference/draupnir-signers.md): the client certificate
- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
