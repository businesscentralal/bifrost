---
id: sparisjodir
title: "Sparisjóðir"
sidebar_label: "Sparisjóðir"
sidebar_position: 5
description: "What Bifröst Iceland Treasury does with the Icelandic savings banks: statements, claims and claim batches, payments, accounts, bills, credit cards, currency rates and statement import."
---

This page is for the finance team and the Business Central administrator at a company that banks
with one of the Icelandic savings banks (Sparisjóðir). It explains what the Sparisjóðir connector in
[Bifröst Iceland Treasury](/iceland-treasury/) does, what you set up, and what you see in Business
Central afterwards.

The savings banks offer the same services, each from its own address. A Business Central company
works with one savings bank, chosen through the statement import format (see below).

## What it does for you

- **Statements into a reconciliation.** Import a statement straight into **Bank Acc.
  Reconciliation**, or read a statement for any account and period.
- **Claims (*innheimtukröfur*).** Find claims, see the payments received against them and follow a
  claim through its life.
- **Claim batches.** Create, change, cancel and re-create claims in batches, and send a batch to
  secondary collection. The bank confirms the batch first and reports the outcome afterwards. A
  confirmed batch does not mean the payer has paid: check the claim payments for that.
- **Payments.** Send a payment batch and collect its result.
- **Accounts.** The accounts your bank user reaches, the accounts a kennitala owns, one account's
  detail, and verification that an owner and an account belong together.
- **Bills and credit cards.** Outstanding bills and their detail; your credit cards and their
  transactions.
- **Currency rates.** The savings bank's published rates.

You, a scheduled routine or an AI assistant can ask for any of these. The installed operations and
their contracts are read from Business Central itself: the MCP tools `list_message_types` and
`describe_message_type`, or the Bifrost Message Types page.

## What you set up

1. **An agreement with your savings bank** for the services you use, with a B2B user name, a password
   and a client signing certificate (a `.pfx` file with its own password).
2. **The Sparisjóðir row on Bifrost Iceland Treasury Setup**: leave it enabled, enter the company
   user name, then use **Set Company Password** and **Set Certificate**. See the
   [setup page help](/help/iceland-treasury/treasury-setup/) and
   [Draupnir signers](../reference/draupnir-signers.md).
3. **Personal credentials, if your users have their own login at the bank.** Each user enters their
   own user name and password on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).
4. **Statement import, which also selects the savings bank.** On the Business Central bank account,
   choose your savings bank's format as **Bank Statement Import Format**: `SPAR-IN-SPARAUST`,
   `SPAR-IN-SPTHIN`, `SPAR-IN-SPSTR` or `SPAR-IN-SPSH`. There is no separate bank field on the setup
   page. Changes you make to these formats are kept when the app is reinstalled or upgraded.
5. **Claims.** On each Payment Method used for collection, enter the **Spar Claim Identifier** the
   bank assigned to that collection agreement. **Spar Last Claim No.** keeps the numbering going. The
   claimant kennitala is read from Company Information. See
   [Payment Methods](/help/iceland-treasury/payment-methods/).
6. **Permissions.** Assign the permission sets below.

| Credential | Kept for | Notes |
| --- | --- | --- |
| Company password | The company | The company-default B2B password. |
| User password | Each user | Used together with the user's own user name. |
| Client certificate and its password | The company | Signs every request. Its expiry date shows on the setup page. |

All values are entered in masked dialogs and never shown again; see
[Bank secrets](/help/iceland-treasury/treasury-secrets/).

## What you see in Business Central

- **Import Bank Statement** on a Bank Acc. Reconciliation fetches the statement from the savings
  bank. When there is no earlier posted statement to continue from, it asks for a
  [start date](/help/iceland-treasury/date-input-dialog/). A
  [Statement Import Summary](/help/iceland-treasury/statement-import-summary/) then shows the account,
  currency, IBAN, the lines imported and the opening and closing balances, and warns when they do not
  agree with the bank.
- **Payment Methods** show the Spar claim identifier and last claim number.
- The **Customer Ledger Entry** FactBox shows the Sparisjóður claim account and claim date, for users
  who may read claims. See the
  [customer ledger FactBox](/help/iceland-treasury/customer-ledger-factbox/).
- Every call to the bank is logged on the **Bifrost Request Log**, with credentials masked.

## Permission sets

Each area has its own permission set, so a user can read statements without being able to pay.

| Permission set | Grants |
| --- | --- |
| `BIFROST SPStmt ori` | Statements |
| `BIFROST SPAcct ori` | Account lookups and verification |
| `BIFROST SPBill ori` | Bills |
| `BIFROST SPCard ori` | Credit cards and card transactions |
| `BIFROST SPClmPmt ori` | Finding claims, claim payments and claim history |
| `BIFROST SPClmCrt ori` | Claim batches and their results |
| `BIFROST SPPaymt ori` | Payment batches and their results |

`BIFROST SPFull ori` extends Foundation's `BIFROST Full ori`, so anyone with full Bifröst access
reaches all of Sparisjóðir. `BIFROST SPRdClm ori` extends `BIFROST Read ori` with read access to
claims.

## Moving from Cloud Events Sparisjóðir

Install Bifröst Iceland Treasury beside the old app. On first install it takes over the Sparisjóðir
data (claims, claim and payment batches, the claim fields on Payment Methods, the users' Sparisjóðir
settings, the company user name and the users' permission set assignments), then you can remove the
old app. Data already in the new app is never overwritten.

**The password, certificate and certificate password do not carry over.** Enter them once after the
switch.

## Where to go next

- [Iceland Treasury overview](/iceland-treasury/)
- [Draupnir signers](../reference/draupnir-signers.md): the client certificate
- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
