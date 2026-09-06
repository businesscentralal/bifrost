---
id: sparisjodir
title: "Sparisjóðir"
sidebar_label: "Sparisjóðir"
sidebar_position: 5
description: "Statements, claims, payments, accounts, bills and credit cards at the Icelandic savings banks, exposed as 24 Bifröst message types."
---

The Sparisjóðir module connects Business Central to the Icelandic savings banks over their shared Sambankaskema 2013 B2B services. It exposes 24 message types covering statements, claims and asynchronous claim batches, payments, accounts, bills, credit cards and currency rates, and it imports bank statements into Business Central's own Bank Acc. Reconciliation.

The savings banks share a service contract but not a host. One Business Central company integrates with exactly one savings bank, and which one is chosen by configuration rather than by code. See [Bank statement import](#bank-statement-import) below.

## What it covers

- **Statements.** Account statements for an account and date range, either as a message response or imported straight into a reconciliation.
- **Claims (*innheimtukröfur*).** Query claims, one claim or many; query the payments received against them and the transactions that make up a claim's lifecycle.
- **Claim batches.** Create, alter, cancel and re-create batches of claims, and mark a batch for secondary collection. These are asynchronous — see below.
- **Payments.** Submit a payment batch and poll for its result.
- **Accounts.** The accounts the credentials reach, accounts by owner registration number, a single account, and verification that an owner and an account belong together.
- **Bills and credit cards.** Outstanding bills and bill detail; the credit card list, one card with detail, and card transactions.
- **Currency rates.** The savings bank's published rates.

## Message types

The full request and response contract for each type — every field, every error — is in the generated [message type reference](../reference/message-types/). `Help.Sparisjodir.Get` returns the same index from inside Business Central.

### Statements

| Type | What it does |
| --- | --- |
| `Sparisjodir.Statement.Get` | Statement for one account over a date range |

### Claims

| Type | What it does |
| --- | --- |
| `Sparisjodir.Claim.Query` | Queries claims |
| `Sparisjodir.Claim.QueryOne` | Queries a single claim |
| `Sparisjodir.Claim.QueryPayments` | Payments received against claims |
| `Sparisjodir.Claim.QueryTransactions` | Claim lifecycle transactions |

### Claim batches

| Type | What it does |
| --- | --- |
| `Sparisjodir.Claim.CreateBatch` | Submits a batch of new claims |
| `Sparisjodir.Claim.AlterBatch` | Submits changes to existing claims |
| `Sparisjodir.Claim.CancelBatch` | Cancels a batch of claims |
| `Sparisjodir.Claim.ReCreateBatch` | Re-creates a batch of claims |
| `Sparisjodir.Claim.MarkBatchForSecCollection` | Marks a batch for secondary collection |
| `Sparisjodir.Claim.GetOperationResult` | Collects the result of a submitted batch operation |

### Payments

| Type | What it does |
| --- | --- |
| `Sparisjodir.Payment.Batch` | Submits a payment batch |
| `Sparisjodir.Payment.ResultBatch` | Polls a submitted payment batch |

### Accounts

| Type | What it does |
| --- | --- |
| `Sparisjodir.Account.Get` | Accounts for the authenticated user |
| `Sparisjodir.Account.GetByOwner` | Accounts belonging to one owner |
| `Sparisjodir.Account.GetOne` | One account by bank, ledger and account number |
| `Sparisjodir.Account.Verify` | Confirms that an owner and an account belong together |

### Bills

| Type | What it does |
| --- | --- |
| `Sparisjodir.Bill.Get` | Lists outstanding bills |
| `Sparisjodir.Bill.GetDetails` | One bill with its detail |

### Credit cards

| Type | What it does |
| --- | --- |
| `Sparisjodir.CreditCard.Get` | Lists credit cards |
| `Sparisjodir.CreditCard.GetOne` | One card with its detail |
| `Sparisjodir.CreditCard.Transactions` | Transactions on a card |

### Currency rates and help

| Type | What it does |
| --- | --- |
| `Sparisjodir.CurrencyRates.Get` | Published currency rates |
| `Help.Sparisjodir.Get` | Returns a Markdown index of every Sparisjóðir message type |

### Claim batches are asynchronous

A batch operation is not a transfer. The bank accepts the batch and returns an operation id; the outcome is collected afterwards with `Sparisjodir.Claim.GetOperationResult`. A caller submits the batch, keeps the operation id and polls — it does not block waiting for the bank, and a successful submission does not mean the payer has been charged. Use `Sparisjodir.Claim.QueryPayments` and `Sparisjodir.Claim.QueryTransactions` for settlement evidence.

## Setting up

All five bank modules share one setup page, with a row per bank. Open **Bifröst Iceland Treasury Setup**, select the Sparisjóðir row, and set the company-default user name. See the [in-product help](/help/iceland-treasury/treasury-setup/) for the page itself.

Sparisjóðir uses four secrets:

| Secret | Scope | Purpose |
| --- | --- | --- |
| Company password | Company | The company-default B2B password |
| User password | Per user | Overrides the company password for one user |
| Client certificate | Company | Signs the SOAP envelopes |
| Certificate password | Company | Opens the certificate |

Secrets are entered through masked dialogs and stored in Isolated Storage. They are never written to a table and never appear in a response. See [Treasury secrets](/help/iceland-treasury/treasury-secrets/).

A user who needs their own login sets a personal user name and password on their own record; leave those blank and the company defaults apply. See [Bank user setup](/help/iceland-treasury/bank-user-setup/).

## Bank statement import {#bank-statement-import}

The module installs **four** Data Exchange definitions of type Bank Statement Import, one per savings bank, together with the matching Bank Export/Import Setup rows:

| Format |
| --- |
| `SPAR-IN-SPARAUST` |
| `SPAR-IN-SPTHIN` |
| `SPAR-IN-SPSTR` |
| `SPAR-IN-SPSH` |

Choosing one of these as the **Bank Statement Import Format** on the Business Central bank account is how the savings bank is selected. There is no separate bank field on the setup page; the import format carries that choice.

Importing a statement on a Bank Acc. Reconciliation calls the bank, converts the response and maps it onto reconciliation lines through the standard mapping. When there is no earlier posted statement to derive the window from, the module asks for a start date first — see the [date input dialog](/help/iceland-treasury/date-input-dialog/). After a successful import a read-only [statement import summary](/help/iceland-treasury/statement-import-summary/) shows the account, currency, IBAN, the number of lines imported and the calculated starting and ending balances, and warns when those do not agree with what the reconciliation already held.

The definitions are created once and left alone on reinstall, so changes an administrator makes to them survive an upgrade.

## Claims on Payment Methods

A claim is issued under a collection agreement, and in Business Central that agreement is represented by a Payment Method. The module adds two fields to the base Payment Method table and shows them on the Payment Methods list:

| Field | Purpose |
| --- | --- |
| Spar Claim Identifier | The three-character identifier the bank assigned to this collection agreement |
| Spar Last Claim No. | The last claim number used, so the next claim continues the sequence |

A company can map several Payment Methods to different bank identifiers. The claimant registration number is always read from Company Information and is never stored on the Payment Method. See [Payment methods](/help/iceland-treasury/payment-methods/).

Customer Ledger Entries carry a FactBox showing the Sparisjóður claim account and claim date behind the entry, resolved from the claim line linked to it. The fields stay hidden for users without read access to the claim tables. See [Customer ledger FactBox](/help/iceland-treasury/customer-ledger-factbox/).

## Permission sets

Each functional area sits behind a gate table with one assignable permission set, so a caller can be granted statement reads without being granted payment execution:

| Permission set | Covers |
| --- | --- |
| `BIFROST SPStmt ori` | `Sparisjodir.Statement.Get` |
| `BIFROST SPAcct ori` | The four account message types |
| `BIFROST SPBill ori` | Bill list and bill detail |
| `BIFROST SPCard ori` | The three credit card message types |
| `BIFROST SPClmPmt ori` | Claim queries, claim payments and claim transactions |
| `BIFROST SPClmCrt ori` | Claim batch create, alter, cancel, re-create, secondary collection and the operation result |
| `BIFROST SPPaymt ori` | Payment batch submission and results |

Two further sets extend Bifröst Foundation rather than standing alone. `BIFROST SPFull ori` extends `BIFROST Full ori`, so anyone with full Bifröst access reaches the whole Sparisjóðir integration. `BIFROST SPRdClm ori` extends `BIFROST Read ori` with read access to the claim header and claim line tables.

## Replacing the published app

This module succeeds the per-tenant app *Cloud Events Sparisjóðir*. The successor is a separate app, so both can be installed side by side while the switch is made.

On its first install the module takes the predecessor's data over: claim headers, lines and batches, payment batches and lines, and the gate tables are copied table by table. Fields that live on shared base tables — the claim identifier and last claim number on Payment Method, and the Sparisjóðir fields on Bifröst User Setup — are copied field by field, because their field numbers moved with the new object range. Existing user assignments of the old permission sets are re-pointed at the sets that replace them. A table that already holds rows is left alone, so a second install never overwrites live data.

Stored secrets do not carry over. Isolated Storage is scoped per extension, and the successor is a different extension, so the password, certificate and certificate password are entered again after the switch. The company-default user name is carried across with the rest of the setup.
