---
id: arion
title: "Arion banki"
sidebar_label: "Arion banki"
sidebar_position: 2
description: "What Bifröst Iceland Treasury does with Arion banki: statements, accounts, bills, credit cards, claims, domestic and foreign payments, foreign-currency accounts, electronic documents and currency rates."
---

This page is for the finance team and the Business Central administrator at a company that banks
with Arion banki. It explains what the Arion connector in
[Bifröst Iceland Treasury](/iceland-treasury/) does, what you set up, and what you see in Business
Central afterwards.

## What it does for you

- **Statements into a reconciliation.** Import an Arion account statement straight into **Bank Acc.
  Reconciliation**, or read a statement for any account and period. Credit card transactions can be
  imported the same way.
- **Accounts.** List the accounts your bank user may see, look one up, list the accounts a kennitala
  owns, and verify that a kennitala owns a given account before you pay to it.
- **Bills and credit cards.** See outstanding bills (*seðlar*) and their detail, your credit cards,
  and card transactions by period or due month.
- **Claims (*innheimtukröfur*).** Find claims and the payments received against them, and follow a
  claim through its life. Create, change and cancel claims in batches: the bank confirms the batch
  first and reports the outcome afterwards.
- **Payments.** Send a batch of domestic ISK payments and collect the result per line. Send foreign
  payments, see the active batches and fetch the receipts.
- **Foreign-currency accounts.** See your foreign-currency accounts with their transactions and
  statements.
- **Electronic documents.** Upload a PDF or XML document for delivery to the recipient's online
  bank, and check that it was processed.
- **Currency rates.** Arion's buy and sell rates for any date. No permission set is needed for rates.

You, a scheduled routine or an AI assistant can ask for any of these. The installed operations and
their contracts are read from Business Central itself: the MCP tools `list_message_types` and
`describe_message_type`, or the Bifrost Message Types page.

## What you set up

1. **An agreement with Arion banki** for the services you use, with a B2B user name, a password and
   a client signing certificate (a `.pfx` file with its own password).
2. **The Arion row on Bifrost Iceland Treasury Setup**: leave it enabled, enter the company user
   name, then use **Set Company Password** and **Set Certificate**. See the
   [setup page help](/help/iceland-treasury/treasury-setup/) and [Draupnir signers](../reference/draupnir-signers.md).
3. **Personal credentials, if your users have their own login at the bank.** Each user enters their
   own user name and password on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).
4. **Statement import.** On the Business Central bank account, choose the Arion bank statement
   format as **Bank Statement Import Format**. For a credit card, create a bank account whose
   account number is the card id and choose the Arion card format.
5. **Claims.** On each Payment Method used for collection, enter the **Arion Claim Identifier** from
   your collection agreement. **Arion Last Claim No.** keeps the numbering going. See
   [Payment Methods](/help/iceland-treasury/payment-methods/).
6. **Permissions.** Assign the permission sets below.

| Credential | Kept for | Notes |
| --- | --- | --- |
| Company password | The company | Used when the calling user has no personal password. |
| User password | Each user | Set by the user on Bifrost User Setup. Used together with the user's own user name. |
| Client certificate and its password | The company | Signs every request. Its expiry date shows on the setup page. |

Arion needs no API key and no bank certificate. All values are entered in masked dialogs and never
shown again; see [Bank secrets](/help/iceland-treasury/treasury-secrets/).

## What you see in Business Central

- **Import Bank Statement** on a Bank Acc. Reconciliation fetches the statement from Arion. The
  first time, it asks for a [start date](/help/iceland-treasury/date-input-dialog/); afterwards it
  continues from the last posted statement. A
  [Statement Import Summary](/help/iceland-treasury/statement-import-summary/) then shows the lines
  imported and the opening and closing balances, and warns when they do not agree with the bank.
- **Payment Methods** show the Arion claim identifier and last claim number.
- The **Customer Ledger Entry** FactBox shows the claim account and claim date registered with Arion,
  for users who may read claims. See the
  [customer ledger FactBox](/help/iceland-treasury/customer-ledger-factbox/).
- Every call to the bank is logged on the **Bifrost Request Log**, with credentials masked.

## Permission sets

Each area that reads or moves money has its own permission set, so a user can read statements
without being able to pay.

| Permission set | Grants |
| --- | --- |
| `BIFROST ABStmt ori` | Statements |
| `BIFROST ABAcct ori` | Account lookups and verification |
| `BIFROST ABBill ori` | Bills |
| `BIFROST ABCard ori` | Credit cards and card transactions |
| `BIFROST ABClmPmt ori` | Claim lookups, claim payments and claim history |
| `BIFROST ABClmCrt ori` | Creating, changing and cancelling claims |
| `BIFROST ABPaymt ori` | Domestic payments and their results |
| `BIFROST ABFrgPay ori` | Foreign payments and receipts |
| `BIFROST ABFStmt ori` | Foreign-currency accounts, transactions and statements |
| `BIFROST ABDoc ori` | Electronic documents |

`BIFROST ABFull ori` extends Foundation's `BIFROST Full ori`, and `BIFROST ABRdClm ori` extends
`BIFROST Read ori` with read access to claims. A user who holds Foundation's full or read set gets
them automatically.

## Moving from Origo Cloud Events Arionbanki

Install Bifröst Iceland Treasury beside the old app. On first install it takes over the Arion data
(claims, batches, the claim fields on Payment Methods, the Arion settings and the users' permission
set assignments), then you can remove the old app. Data already in the new app is never overwritten.

**Passwords and certificates do not carry over.** Enter them once after the switch. Enter
Landsbankinn's again too: the old apps could mix up the two banks' stored values, so neither is
carried over.

## Where to go next

- [Iceland Treasury overview](/iceland-treasury/)
- [Draupnir signers](../reference/draupnir-signers.md): the client certificate
- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
