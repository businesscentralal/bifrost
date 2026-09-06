---
id: landsbankinn
title: "Landsbankinn"
sidebar_label: "Landsbankinn"
sidebar_position: 1
description: "Claims, cards, accounts, portfolios, electronic documents, acquiring and payments at Landsbankinn, exposed as 66 Bifröst message types."
---

The Landsbankinn module connects Business Central to Landsbankinn's REST services and to the bank's IOBS (*Landsbankaskema*) SOAP operations. It is the largest of the bank modules in [Bifröst Iceland Treasury](../index.md): 66 message types covering claims, claim templates, claim batches, corporate cards, accounts, asset portfolios, reference rates, electronic documents, acquiring settlement, domestic payments and foreign payments, plus bank statement and card transaction import into Business Central's own reconciliation.

Every operation is reached the same way as the rest of Bifröst — a caller submits a message naming the type, and the module signs and sends the request. Nothing about the bank's transport is exposed to the caller.

## What it covers

- **Claims (*kröfur*).** Create, read, update and cancel individual claims over the Claims REST API, or submit a batch of claim actions and track the batch result. Claim payments received against a claim can be listed for the whole company or for one claim.
- **Claim templates.** The collection agreements a claim is created under: list, read, create, update and delete templates, list claimant accesses, and check which prerequisites a claimant has not yet fulfilled.
- **Corporate cards.** The card list, card transactions and transaction detail, receipt attachments, and the full ledger key structure — keys, groups and sub-groups — including assigning a ledger key to a transaction.
- **Accounts.** Account list, single account detail, transactions, end-of-day balance and accrued interest, plus account existence verification over the IOBS service.
- **Asset portfolios.** Portfolios, holdings, gain and loss returns, and asset transactions such as trades and dividends.
- **Reference data.** Landsbankinn exchange rates, bank fees and prices, Landsbréf fund market data, and current deposit and lending interest rates. These do not require authentication against the customer's own bank agreement.
- **Electronic documents.** Upload single documents or a batch, list and download received documents, and manage the cross-references that link a document to an entity.
- **Acquiring.** Settlement batches and the transactions behind them, for companies that take card payments through Landsbankinn.
- **Payments.** Domestic payment batches and their results, unpaid invoices and payment slips, and foreign payments over the IOBS service.
- **Statement and card import.** Two Data Exchange definitions feed Business Central's Bank Acc. Reconciliation directly.

## Message types

The table below groups the 66 types by domain. The full request and response contract for each one — every field, every error — is in the generated [message type reference](../reference/message-types/). `Help.Landsbankinn.Get` returns the same index from inside Business Central.

### Claims

| Type | What it does |
| --- | --- |
| `Landsbankinn.Claim.List` | Lists claims from a due date onwards |
| `Landsbankinn.Claim.Get` | Retrieves a single claim by id |
| `Landsbankinn.Claim.Create` | Creates one claim |
| `Landsbankinn.Claim.Update` | Updates one claim |
| `Landsbankinn.Claim.Delete` | Cancels one claim |
| `Landsbankinn.ClaimPayment.List` | Lists all claim payments |
| `Landsbankinn.ClaimPayment.Get` | Lists the payments received against one claim |

### Claim batches

| Type | What it does |
| --- | --- |
| `Landsbankinn.ClaimBatch.Create` | Submits a batch of create, update and cancel actions |
| `Landsbankinn.ClaimBatch.List` | Lists batch operations |
| `Landsbankinn.ClaimBatch.Get` | Returns the status of one batch operation |
| `Landsbankinn.ClaimBatch.Actions` | Returns the per-claim result of one batch |

### Claim templates

| Type | What it does |
| --- | --- |
| `Landsbankinn.ClaimTemplate.List` | Lists claim templates |
| `Landsbankinn.ClaimTemplate.Get` | Retrieves one template by id |
| `Landsbankinn.ClaimTemplate.Create` | Creates a template |
| `Landsbankinn.ClaimTemplate.Update` | Updates a template |
| `Landsbankinn.ClaimTemplate.Delete` | Soft-deletes a template |
| `Landsbankinn.ClaimTemplate.ClaimantAccesses` | Lists the accesses a claimant holds |
| `Landsbankinn.ClaimTemplate.UnfulfilledPrerequisites` | Lists what a claimant still has to fulfil |

### Cards

| Type | What it does |
| --- | --- |
| `Landsbankinn.Card.List` | Lists the corporate cards registered at the bank |
| `Landsbankinn.Card.Transactions` | Card transactions over a date range |
| `Landsbankinn.Card.TransactionGet` | One transaction with ledger key, comment and attachments |
| `Landsbankinn.Card.TransactionUpdate` | Assigns a ledger key and comment to a transaction |
| `Landsbankinn.Card.Attachment` | Downloads a receipt by attachment id |
| `Landsbankinn.Card.LedgerKeys` | Lists ledger key mappings |
| `Landsbankinn.Card.LedgerKeyCreate` | Creates a ledger key |
| `Landsbankinn.Card.LedgerKeyDelete` | Deletes a ledger key |
| `Landsbankinn.Card.LedgerKeyGroups` | Lists ledger key groups |
| `Landsbankinn.Card.LedgerKeyGroupCreate` | Creates a ledger key group |
| `Landsbankinn.Card.LedgerKeyGroupDelete` | Deletes a ledger key group |
| `Landsbankinn.Card.LedgerKeySubGroups` | Lists ledger key sub-groups |
| `Landsbankinn.Card.LedgerKeySubGroupCreate` | Creates a ledger key sub-group |
| `Landsbankinn.Card.LedgerKeySubGroupDelete` | Deletes a ledger key sub-group |
| `Landsbankinn.Card.Query` | Card details and card state over the IOBS service |

### Accounts

| Type | What it does |
| --- | --- |
| `Landsbankinn.Account.List` | Lists the accounts the credentials reach |
| `Landsbankinn.Account.Get` | Account detail for one BBAN |
| `Landsbankinn.Account.Transactions` | Transactions on one account |
| `Landsbankinn.Account.EndOfDayBalance` | End-of-day balance and accrued interest |
| `Landsbankinn.Account.Verify` | Confirms that an account exists, over the IOBS service |

### Portfolios and assets

| Type | What it does |
| --- | --- |
| `Landsbankinn.Portfolio.List` | Lists asset portfolios |
| `Landsbankinn.Portfolio.Holdings` | Holdings in a portfolio |
| `Landsbankinn.Portfolio.HoldingReturns` | Gain and loss returns on holdings |
| `Landsbankinn.Portfolio.Transactions` | Asset transactions such as trades and dividends |

### Rates and reference data

| Type | What it does |
| --- | --- |
| `Landsbankinn.Currency.Rates` | Official Landsbankinn exchange rates |
| `Landsbankinn.InterestRates.List` | Current deposit and lending interest rates |
| `Landsbankinn.Fees.List` | Bank fees and prices |
| `Landsbankinn.Funds.List` | Market data for Landsbréf funds |

### Electronic documents

| Type | What it does |
| --- | --- |
| `Landsbankinn.EDoc.DocumentTypes` | Document types available to a sender |
| `Landsbankinn.EDoc.Upload` | Uploads one document |
| `Landsbankinn.EDoc.BatchUpload` | Uploads a batch of documents |
| `Landsbankinn.EDoc.Documents` | Lists received documents |
| `Landsbankinn.EDoc.DocumentGet` | Metadata for one received document |
| `Landsbankinn.EDoc.DocumentContent` | Downloads the content of a received document |
| `Landsbankinn.EDoc.CrossReferences` | Lists cross-references |
| `Landsbankinn.EDoc.CrossReferenceGet` | Retrieves one cross-reference |
| `Landsbankinn.EDoc.CrossReferenceCreate` | Links a document to an entity |
| `Landsbankinn.EDoc.CrossReferenceDelete` | Removes a cross-reference |

### Acquiring

| Type | What it does |
| --- | --- |
| `Landsbankinn.Acquiring.Settlements` | Lists acquiring settlement batches |
| `Landsbankinn.Acquiring.Transactions` | Lists acquiring transactions, optionally for one settlement |

### Payments

| Type | What it does |
| --- | --- |
| `Landsbankinn.Payment.Batch` | Submits a batch of domestic payments |
| `Landsbankinn.Payment.ResultBatch` | Retrieves the result of a submitted batch |
| `Landsbankinn.UnpaidInvoice.Query` | Queries unpaid invoices |
| `Landsbankinn.UnpaidInvoice.Get` | Retrieves one unpaid bill by id |
| `Landsbankinn.PaymentSlip.Query` | Queries payment slips over the IOBS service |

### Foreign payments

| Type | What it does |
| --- | --- |
| `Landsbankinn.ForeignPayment.Create` | Creates a batch of foreign payments |
| `Landsbankinn.ForeignPayment.Query` | Queries the status of foreign payment batches |

### Help

| Type | What it does |
| --- | --- |
| `Help.Landsbankinn.Get` | Returns a Markdown index of every Landsbankinn message type |

There is no separate statement message type. Account movements are read with `Landsbankinn.Account.Transactions`, and a full bank statement is imported into a reconciliation as described under [Bank statement import](#bank-statement-import).

## Setting up

All five bank modules share one setup page, with a row per bank. Open **Bifröst Iceland Treasury Setup**, select the Landsbankinn row, and set the company-default user name. See the [in-product help](/help/iceland-treasury/treasury-setup/) for the page itself.

Landsbankinn needs more credentials than any other bank in the module, and it is the only one that uses API keys:

| Secret | Scope | Purpose |
| --- | --- | --- |
| Company password | Company | The company-default B2B password |
| User password | Per user | Overrides the company password for one user |
| Client certificate | Company | Signs the IOBS SOAP envelopes |
| Certificate password | Company | Opens the certificate |
| API key | Company | Authenticates the REST services |
| User API key | Per user | Overrides the company API key for one user |

Secrets are entered through masked dialogs and stored in Isolated Storage. They are never written to a table and never appear in a response. See [Treasury secrets](/help/iceland-treasury/treasury-secrets/).

A user who needs their own credentials sets a personal user name, password and API key on their own record; leave those blank and the company defaults apply. See [Bank user setup](/help/iceland-treasury/bank-user-setup/).

## Bank statement import {#bank-statement-import}

The module installs two Data Exchange definitions of type **Bank Statement Import**, and the matching Bank Export/Import Setup rows:

| Format | Imports |
| --- | --- |
| `LBI-FEED-IN` | Account statements |
| `LBI-CARD-IN` | Card transactions |

Set one of them as the **Bank Statement Import Format** on the Business Central bank account. Importing a statement on a Bank Acc. Reconciliation then calls Landsbankinn, converts the response and maps it onto reconciliation lines through the standard mapping.

The date window is taken from the reconciliation's statement date, falling back to the day after the last posted statement. When there is no earlier statement to work from, the module asks for a start date first — see the [date input dialog](/help/iceland-treasury/date-input-dialog/). After a successful import a read-only [statement import summary](/help/iceland-treasury/statement-import-summary/) shows the account, the number of lines imported and the calculated starting and ending balances, and warns when those do not agree with what the reconciliation already held.

The card format works the same way, against a bank account whose account number holds the card id.

## Claims on Payment Methods

A claim is issued under a collection agreement, and in Business Central that agreement is represented by a Payment Method. The module adds two fields to the base Payment Method table and shows them on the Payment Methods list:

| Field | Purpose |
| --- | --- |
| Landsbankinn Claim Identifier | The three-character identifier the bank assigned to this collection agreement |
| Landsbankinn Last Claim No. | The last claim number used, so the next claim continues the sequence |

A company can map several Payment Methods to different bank identifiers. The claimant registration number is always read from Company Information and is never stored on the Payment Method. See [Payment methods](/help/iceland-treasury/payment-methods/).

Customer Ledger Entries carry a FactBox showing the Landsbankinn claim account and claim date behind the entry, resolved from the claim line linked to it. The fields stay hidden for users without read access to the claim tables. See [Customer ledger FactBox](/help/iceland-treasury/customer-ledger-factbox/).

## Permission sets

Domains that move money or change state at the bank sit behind gate tables. Each gate has one assignable permission set, so a caller can be granted card reads without being granted payment execution:

| Permission set | Covers |
| --- | --- |
| `BIFROST LBStmt ori` | Account list, detail, transactions and end-of-day balance; reading the electronic document inbox |
| `BIFROST LBCards ori` | Every card message type, including ledger keys, groups and sub-groups |
| `BIFROST LBAssets ori` | Portfolios, holdings, returns and asset transactions |
| `BIFROST LBClmPmt ori` | Claim payment queries |
| `BIFROST LBClmCrt ori` | Claim batch submission and the batch result queries |
| `BIFROST LBPaymt ori` | Domestic payment batches, payment results, unpaid invoices |
| `BIFROST LBFrgPay ori` | Foreign payment creation and status queries |
| `BIFROST LBEDoc ori` | Electronic document upload, document types and cross-references |

Two further sets extend Bifröst Foundation rather than standing alone. `BIFROST LBFull ori` extends `BIFROST Full ori`, so anyone with full Bifröst access reaches the whole Landsbankinn integration. `BIFROST LBRdClm ori` extends `BIFROST Read ori` with read access to the claim header, claim line and claim payment tables.

The remaining message types — the Claims REST operations, claim templates, acquiring, rates and reference data, account verification, card query and payment slips — need no gate beyond general Bifröst access.

## Replacing the published app

This module succeeds the AppSource app *Origo Cloud Events Landsbankinn*. The successor is a separate app, so both can be installed side by side while the switch is made.

On its first install the module takes the predecessor's data over: claim headers, lines and payments, claim batches, payment batches and lines, hidden claims and the gate tables are copied table by table. Fields that live on shared base tables — the claim identifier and last claim number on Payment Method, and the Landsbankinn fields on Bifröst User Setup — are copied field by field, because their field numbers moved with the new object range. Existing user assignments of the old permission sets are re-pointed at the sets that replace them. A table that already holds rows is left alone, so a second install never overwrites live data.

Stored secrets do not carry over. Isolated Storage is scoped per extension, and the successor is a different extension, so passwords, certificates and API keys are entered again after the switch.

Landsbankinn has one additional reason to re-enter them. The older implementation shared its storage keys with the Arion module, so the two banks could overwrite each other's values inside a single extension. Those keys are now discarded rather than guessed at, and both banks start from a clean set of credentials.
