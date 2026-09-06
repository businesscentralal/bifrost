---
id: arion
title: "Arion banki"
sidebar_label: "Arion banki"
sidebar_position: 2
description: "The Arion banki connector: 34 message types covering statements, claims, payments, accounts, cards, documents and currency rates, over the Sambankaskema SOAP services and Arion's REST document service."
---

The Arion module connects Business Central to Arion banki. It exposes 34 message types across ten domains, so a caller reaches the bank through the same queue, task and data pattern used everywhere else in Bifröst. Nothing about the transport is visible to the caller: the module resolves credentials, builds the SOAP body, signs the envelope through [Draupnir](../reference/draupnir-signers.md), and returns a parsed response.

Every message type answers `Help.Implementation.Get` from its own domain help codeunit, and `Help.Arionbanki.Get` returns a Markdown directory of the whole module.

## What it covers

| Area | What you can do |
| --- | --- |
| **Accounts** | List the accounts the service user may see, look one up by account number, list the accounts owned by a kennitala, and verify that a kennitala owns a given account. |
| **Statements** | Retrieve a statement for one account over a date span, with paging. Statements also import straight into Bank Acc. Reconciliation — see below. |
| **Bills** | List outstanding bills (*seðlar*) and read the full detail of one. |
| **Credit cards** | List cards, read one card, and fetch card transactions by date range, by due month or in full. |
| **Claims** | Query claims (*innheimtukröfur*) by claimant, account and date span; read a single claim; list the payments received against claims and a claim's lifecycle transactions. |
| **Claim batches** | Create, alter and cancel claims in batches. These are asynchronous — the bank returns an operation id and the result is collected afterwards. |
| **Domestic payments** | Submit an ISK payment batch and retrieve the per-line result. |
| **Foreign payments** | Submit a foreign-currency payment batch, list active batches, and retrieve receipts by date range, transaction number or batch id. |
| **Foreign statements** | List foreign-currency accounts and fetch their transactions and statements. |
| **Currency rates** | Fetch Arion's buy and sell rates for a date. |
| **Electronic documents** | Upload a PDF or XML document for distribution in the recipient's online bank, then poll its processing result. |

## Message types

The table names each type and what it does. The request and response contract for each one — fields, defaults, errors — lives in the [message type reference](/iceland-treasury/reference/message-types/).

### Statements

| Type | What it does |
| --- | --- |
| `Arionbanki.Statement.Get` | Returns a statement for one account over a date span, with skip/take paging. |

### Claims

| Type | What it does |
| --- | --- |
| `Arionbanki.Claim.Query` | Returns claims matching a claimant, account span and date span. |
| `Arionbanki.Claim.QueryOne` | Returns a single claim by claimant and reference. |
| `Arionbanki.Claim.QueryPayments` | Returns a paged list of payments received against claims. |
| `Arionbanki.Claim.QueryTransactions` | Returns the lifecycle transactions of one claim, paged. |
| `Arionbanki.Claim.CreateBatch` | Creates a batch of claims. Asynchronous — returns an operation id. |
| `Arionbanki.Claim.AlterBatch` | Alters a batch of existing claims. Asynchronous. |
| `Arionbanki.Claim.CancelBatch` | Cancels a batch of claims by key. Asynchronous. |
| `Arionbanki.Claim.GetOperationResult` | Polls the result of a previous asynchronous batch operation. |

### Domestic payments

| Type | What it does |
| --- | --- |
| `Arionbanki.Payment.Batch` | Submits a batch of domestic payments. |
| `Arionbanki.Payment.ResultBatch` | Returns the processing result of a submitted batch, with a filter. |

### Foreign payments

| Type | What it does |
| --- | --- |
| `Arionbanki.ForeignPayment.EnterBatch` | Enters a batch of foreign payments. A batch of one is a single payment. |
| `Arionbanki.ForeignPayment.GetBatches` | Returns the active foreign payment batches. |
| `Arionbanki.ForeignPayment.GetPaymentsByBatchId` | Returns the payment requests in one batch. |
| `Arionbanki.ForeignPayment.GetReceipts` | Returns receipts for a date range. |
| `Arionbanki.ForeignPayment.GetReceipt` | Returns one receipt by transaction number. |
| `Arionbanki.ForeignPayment.GetReceiptByBatchId` | Returns the receipts belonging to one batch. |

### Foreign statements

| Type | What it does |
| --- | --- |
| `Arionbanki.ForeignStatement.Accounts.Get` | Returns an overview of the foreign-currency accounts. |
| `Arionbanki.ForeignStatement.Transactions.Get` | Returns transactions for a foreign account and date range. |
| `Arionbanki.ForeignStatement.Statements.Get` | Returns statements for a foreign account and date range. |

### Accounts

| Type | What it does |
| --- | --- |
| `Arionbanki.Account.Get` | Returns every account the authenticated service user may see. |
| `Arionbanki.Account.GetByOwner` | Returns the accounts owned by one kennitala. |
| `Arionbanki.Account.GetOne` | Returns one account by bank, ledger and account number, with full detail. |
| `Arionbanki.Account.Verify` | Verifies that a kennitala owns a given account. |

### Bills

| Type | What it does |
| --- | --- |
| `Arionbanki.Bill.Get` | Returns the outstanding bills for the authenticated user. |
| `Arionbanki.Bill.GetDetails` | Returns the full detail of one bill. |

### Credit cards

| Type | What it does |
| --- | --- |
| `Arionbanki.CreditCard.Get` | Returns the credit cards of the authenticated user. |
| `Arionbanki.CreditCard.GetOne` | Returns one card by card id. |
| `Arionbanki.CreditCard.Transactions` | Returns card transactions by date range, by due month or in full, with paging. |

### Electronic documents

| Type | What it does |
| --- | --- |
| `Arionbanki.Document.Upload` | Uploads a PDF or XML document for distribution in the recipient's online bank. |
| `Arionbanki.Document.GetResult` | Polls the processing result of one uploaded document. |
| `Arionbanki.Document.GetResults` | Returns processing results for documents uploaded in a date range. |

### Reference data and directory

| Type | What it does |
| --- | --- |
| `Arionbanki.CurrencyRates.Get` | Returns buy and sell exchange rates for a date. |
| `Help.Arionbanki.Get` | Returns a Markdown overview of the module and every message type it adds. |

## Transports

Arion is reached over three transports. The module picks the right one per operation; a caller never chooses.

| Transport | Used by |
| --- | --- |
| Sambankaskema `ClaimService` SOAP API | Claims and claim batches. |
| Sambankaskema IOBS SOAP services, through the [Draupnir signer framework](../reference/draupnir-signers.md) | Statements, accounts, bills, credit cards, domestic payments, foreign payments, foreign statements and currency rates. |
| Arion's REST service | Electronic document upload and its result queries. |

Within the IOBS services Draupnir uses two signing profiles. The shared Sambankaskema services are signed only, with the default WS-Security profile. Arion's proprietary account and bill services additionally encrypt the body to the bank's certificate, using the symmetric mutual-certificate profile; the bank's public certificate is read from the service's own metadata rather than entered by an administrator.

## Setting up

All five banks share one **Treasury Setup** page, one row per bank: whether the bank is enabled, the service user name and the transport. Open it from Bifröst Setup — see the [in-product help](/help/iceland-treasury/treasury-setup/).

Arion needs three credentials:

| Credential | Scope | Notes |
| --- | --- | --- |
| Company password | One value for the company | Used when the calling user has no personal password. |
| User password | One value per user | Set by the user on Bank User Setup. Overrides the company password. |
| Client certificate and its password | One value for the company | A PKCS#12 certificate, entered once. |

Arion needs no API key and no bank certificate; those belong to other connectors. Every value is written to the extension's encrypted storage and never to a table; see [secrets](/help/iceland-treasury/treasury-secrets/). The certificate's expiry is shown on the setup page's FactBox, in green, amber or red as the date approaches. The personal password is entered by each user on [Bank User Setup](/help/iceland-treasury/bank-user-setup/).

## Bank statement import

Statements do not have to be read as message types. The module also registers two Data Exchange definitions — one for bank accounts and one for credit cards — so a statement imports directly into **Bank Acc. Reconciliation** through the standard Business Central import action.

A credit card is set up as a Business Central bank account whose account number carries the card id and whose import format is the card feed. Otherwise the two feeds behave identically.

On import the module asks for a start date and then reports what it fetched:

- The [date range dialog](/help/iceland-treasury/date-input-dialog/) proposes a start date and lets you change it before the call.
- The [statement import summary](/help/iceland-treasury/statement-import-summary/) shows the statement number, the number of lines imported, any warning, the calculated opening and closing balances against the balance the bank reported, and the account's own details.

## Claims on Payment Methods

Claims are configured where the rest of the payment terms live. The module adds two fields to the base **Payment Method** table:

| Field | Purpose |
| --- | --- |
| Arion Claim Identifier | The three-character claim identifier from the collection agreement with the bank. |
| Arion Last Claim No. | The last claim number issued, so the next claim continues the sequence. |

There is no claim account field on Payment Method; the disposal account comes from the standard balancing-account fields. See [payment methods](/help/iceland-treasury/payment-methods/).

On the customer side, the **Customer Ledger Entries** FactBox gains the claim account and claim date registered with Arion for the entry, resolved from the claim line linked to it. The two fields appear only for users who may read the claim tables. See the [customer ledger FactBox](/help/iceland-treasury/customer-ledger-factbox/).

## Permission sets

Every message-type group sits behind its own gate table and its own assignable permission set. A user is granted a group by being granted its set; without it the call returns an error response and does nothing. This lets an integration read statements without being able to execute payments.

| Permission set | Grants |
| --- | --- |
| `BIFROST ABStmt ori` | Statement queries |
| `BIFROST ABAcct ori` | Account queries and verification |
| `BIFROST ABBill ori` | Bill queries |
| `BIFROST ABCard ori` | Credit card queries and transactions |
| `BIFROST ABClmPmt ori` | Claim queries, claim payments and claim transactions |
| `BIFROST ABClmCrt ori` | Claim batch create, alter, cancel and operation result |
| `BIFROST ABPaymt ori` | Domestic payment batches and their results |
| `BIFROST ABFrgPay ori` | Foreign payments and receipts |
| `BIFROST ABFStmt ori` | Foreign accounts, transactions and statements |
| `BIFROST ABDoc ori` | Electronic document upload and results |

Two permission set extensions widen Foundation's own sets rather than being assigned directly: `BIFROST ABFull ori` extends `BIFROST Full ori`, and `BIFROST ABRdClm ori` extends `BIFROST Read ori` with read access to the claim tables. A user who holds Foundation's full or read set picks these up automatically.

`Arionbanki.CurrencyRates.Get` and `Help.Arionbanki.Get` are not gated. Rates are public market data and the help type returns documentation.

## Replacing the published app

This module succeeds the AppSource app *Origo Cloud Events Arionbanki*. The successor is a separate app: install it beside the published one, let it take the data over, then remove the old app.

`Arion Take-Over Install ori` runs once on first install, while both apps are present, and copies:

- 16 persistent tables, field for field. Transient tables — messages, arguments, request logs and buffers — are not copied.
- The Arion fields on tables shared with other extensions: Bifröst Setup, Bifröst User Setup and the base application's Payment Method.
- The ten access-gate permission set assignments, re-pointed at their `BIFROST AB… ori` replacements.

The legacy full-access and read-claims sets are not re-pointed, because both were permission set extensions and so never appeared in Access Control. Their replacements are extensions too, and take effect through Foundation's assignable sets.

**Stored secrets do not carry over.** Isolated Storage belongs to the extension that wrote it, and the successor is a new extension, so passwords and certificates are entered once more after the switch. Arion's secrets need particular attention: in the older implementation Landsbankinn shared Arion's storage keys, so the two banks overwrote each other's values. Rather than guess which bank a stored value belonged to, the upgrade deletes those keys. Both banks re-enter their password and certificate.

## Where to go next

- [Iceland Treasury overview](../index.md)
- [Draupnir signers](../reference/draupnir-signers.md) — how the IOBS envelopes are signed
- [Message type reference](/iceland-treasury/reference/message-types/)
- [In-product help](/help/iceland-treasury/)
