---
id: arion
title: "Arion banki"
sidebar_label: "Arion banki"
sidebar_position: 2
description: "The Arion banki connector: 34 message types covering statements, claims, greiðslur, accounts, cards, skjöl og currency rates, over the Sambankaskema SOAP services og Arion's REST skjal service."
---

The Arion module connects Business Central til Arion banki. It exposes 34 message types across ten domains, so a caller reaches the bank through the same queue, task og data pattern used everywhere else in Bifröst. Nothing about the transport er visible til the caller: the module resolves credentials, builds the SOAP body, signs the envelope through [Draupnir](../reference/draupnir-signers.md), og Skilar a parsed Svar.

Every message Gerð answers `Help.Implementation.Get` frá its own domain help codeunit, og `Help.Arionbanki.Get` Skilar a Markdown directory of the whole module.

## What it covers

| Area | What you getur do |
| --- | --- |
| **Accounts** | Listi the accounts the service user may see, look one up by reikningur number, Listi the accounts owned by a kennitala, og verify that a kennitala owns a given reikningur. |
| **Statements** | Retrieve a statement fyrir one reikningur over a date span, með paging. Statements also import straight í Bank Acc. Reconciliation — see below. |
| **Bills** | Listi outstanding bills (*seðlar*) og read the fulla detail of one. |
| **Credit cards** | Listi cards, read one card, og fetch card færslur by date range, by due month eða in fulla. |
| **Claims** | Fyrirspurn claims (*innheimtukröfur*) by claimant, reikningur og date span; read a stakan claim; Listi the greiðslur received against claims og a claim's lifecycle færslur. |
| **Claim batches** | Create, alter og cancel claims in batches. These eru asynchronous — the bank Skilar an operation id og Niðurstaðan er collected afterwards. |
| **Domestic greiðslur** | Submit an ISK greiðsla batch og retrieve the per-line result. |
| **Foreign greiðslur** | Submit a foreign-currency greiðsla batch, Listi active batches, og retrieve receipts by date range, færsla number eða batch id. |
| **Foreign statements** | Listi foreign-currency accounts og fetch their færslur og statements. |
| **Currency rates** | Fetch Arion's buy og sell rates fyrir a date. |
| **Electronic skjöl** | Upload a PDF eða XML skjal fyrir distribution in the recipient's online bank, then poll its processing result. |

## Message types

The table names each Gerð og what it does. Beiðnin og Svar contract fyrir each one — fields, defaults, errors — lives in the [message Gerð reference](/iceland-treasury/reference/message-types/).

### Statements

| Gerð | What it does |
| --- | --- |
| `Arionbanki.Statement.Get` | Skilar a statement fyrir one reikningur over a date span, með skip/take paging. |

### Claims

| Gerð | What it does |
| --- | --- |
| `Arionbanki.Claim.Query` | Skilar claims matching a claimant, reikningur span og date span. |
| `Arionbanki.Claim.QueryOne` | Skilar a stakan claim by claimant og reference. |
| `Arionbanki.Claim.QueryPayments` | Skilar a paged Listi of greiðslur received against claims. |
| `Arionbanki.Claim.QueryTransactions` | Skilar lifecycle færslur of one claim, paged. |
| `Arionbanki.Claim.CreateBatch` | Býr til a batch of claims. Asynchronous — Skilar an operation id. |
| `Arionbanki.Claim.AlterBatch` | Alters a batch of existing claims. Asynchronous. |
| `Arionbanki.Claim.CancelBatch` | Cancels a batch of claims by key. Asynchronous. |
| `Arionbanki.Claim.GetOperationResult` | Polls Niðurstaðan of a previous asynchronous batch operation. |

### Domestic greiðslur

| Gerð | What it does |
| --- | --- |
| `Arionbanki.Payment.Batch` | Sendir a batch of domestic greiðslur. |
| `Arionbanki.Payment.ResultBatch` | Skilar processing result of a submitted batch, með a filter. |

### Foreign greiðslur

| Gerð | What it does |
| --- | --- |
| `Arionbanki.ForeignPayment.EnterBatch` | Enters a batch of foreign greiðslur. A batch of one er a stakan greiðsla. |
| `Arionbanki.ForeignPayment.GetBatches` | Skilar active foreign greiðsla batches. |
| `Arionbanki.ForeignPayment.GetPaymentsByBatchId` | Skilar greiðsla requests in one batch. |
| `Arionbanki.ForeignPayment.GetReceipts` | Skilar receipts fyrir a date range. |
| `Arionbanki.ForeignPayment.GetReceipt` | Skilar one receipt by færsla number. |
| `Arionbanki.ForeignPayment.GetReceiptByBatchId` | Skilar receipts belonging til one batch. |

### Foreign statements

| Gerð | What it does |
| --- | --- |
| `Arionbanki.ForeignStatement.Accounts.Get` | Skilar an Yfirlit of the foreign-currency accounts. |
| `Arionbanki.ForeignStatement.Transactions.Get` | Skilar færslur fyrir a foreign reikningur og date range. |
| `Arionbanki.ForeignStatement.Statements.Get` | Skilar statements fyrir a foreign reikningur og date range. |

### Accounts

| Gerð | What it does |
| --- | --- |
| `Arionbanki.Account.Get` | Skilar every reikningur the authenticated service user may see. |
| `Arionbanki.Account.GetByOwner` | Skilar accounts owned by one kennitala. |
| `Arionbanki.Account.GetOne` | Skilar one reikningur by bank, ledger og reikningur number, með fulla detail. |
| `Arionbanki.Account.Verify` | Verifies that a kennitala owns a given reikningur. |

### Bills

| Gerð | What it does |
| --- | --- |
| `Arionbanki.Bill.Get` | Skilar outstanding bills fyrir the authenticated user. |
| `Arionbanki.Bill.GetDetails` | Skilar fulla detail of one bill. |

### Credit cards

| Gerð | What it does |
| --- | --- |
| `Arionbanki.CreditCard.Get` | Skilar credit cards of the authenticated user. |
| `Arionbanki.CreditCard.GetOne` | Skilar one card by card id. |
| `Arionbanki.CreditCard.Transactions` | Skilar card færslur by date range, by due month eða in fulla, með paging. |

### Electronic skjöl

| Gerð | What it does |
| --- | --- |
| `Arionbanki.Document.Upload` | Uploads a PDF eða XML skjal fyrir distribution in the recipient's online bank. |
| `Arionbanki.Document.GetResult` | Polls the processing result of one uploaded skjal. |
| `Arionbanki.Document.GetResults` | Skilar processing results fyrir skjöl uploaded in a date range. |

### Reference data og directory

| Gerð | What it does |
| --- | --- |
| `Arionbanki.CurrencyRates.Get` | Skilar buy og sell exchange rates fyrir a date. |
| `Help.Arionbanki.Get` | Skilar a Markdown Yfirlit of the module og every message Gerð it adds. |

## Transports

Arion er reached over three transports. The module picks the right one per operation; a caller never chooses.

| Transport | Used by |
| --- | --- |
| Sambankaskema `ClaimService` SOAP API | Claims og claim batches. |
| Sambankaskema IOBS SOAP services, through the [Draupnir signer framework](../reference/draupnir-signers.md) | Statements, accounts, bills, credit cards, domestic greiðslur, foreign greiðslur, foreign statements og currency rates. |
| Arion's REST service | Electronic skjal upload og its result queries. |

Within the IOBS services Draupnir uses two signing profiles. The shared Sambankaskema services eru signed Aðeins, með the default WS-Security profile. Arion's proprietary reikningur og bill services additionally encrypt the body til the bank's certificate, using the symmetric mutual-certificate profile; the bank's public certificate er read frá the service's own metadata rather than entered by an administrator.

## Setting up

Allt five banks share one **Treasury Setup** page, one row per bank: whether the bank er enabled, the service user Heiti og the transport. Open it frá Bifröst Setup — see the [in-product help](/help/iceland-treasury/treasury-setup/).

Arion needs three credentials:

| Credential | Scope | Notes |
| --- | --- | --- |
| fyrirtæki password | One value fyrir the fyrirtæki | Used Þegar the calling user has no personal password. |
| User password | One value per user | Set by the user on Bank User Setup. Overrides the fyrirtæki password. |
| Client certificate og its password | One value fyrir the fyrirtæki | A PKCS#12 certificate, entered once. |

Arion needs no API key og no bank certificate; those belong til other connectors. Every value er written til the extension's encrypted storage og never til a table; see [secrets](/help/iceland-treasury/treasury-secrets/). The certificate's expiry er shown on the setup page's FactBox, in green, amber eða red as the date approaches. The personal password er entered by each user on [Bank User Setup](/help/iceland-treasury/bank-user-setup/).

## Bank statement import

Statements do not have til be read as message types. The module also registers two Data Exchange definitions — one fyrir bank accounts og one fyrir credit cards — so a statement imports directly í **Bank Acc. Reconciliation** through the staðlaða Business Central import action.

A credit card er set up as a Business Central bankareikningur whose reikningur number carries the card id og whose import format er the card feed. Otherwise the two feeds behave identically.

On import the module asks fyrir a start date og then reports what it fetched:

- The [date range dialog](/help/iceland-treasury/date-input-dialog/) proposes a start date og lets you change it áður en the Kallaðu á.
- The [statement import summary](/help/iceland-treasury/statement-import-summary/) shows the statement number, the number of lines imported, any warning, the calculated opening og closing balances against the balance the bank reported, og the reikningur's own details.

## Claims on greiðsla Methods

Claims eru configured where the rest of the greiðsla terms live. The module adds two fields til the base **greiðsla Aðferð** table:

| Reitur | Tilgangur |
| --- | --- |
| Arion Claim Identifier | The three-character claim identifier frá the collection agreement með the bank. |
| Arion Last Claim No. | The last claim number issued, so the next claim continues the sequence. |

There er no claim reikningur Reitur on greiðsla Aðferð; the disposal reikningur comes frá the staðlaða balancing-reikningur fields. See [greiðsla methods](/help/iceland-treasury/payment-methods/).

On the viðskiptavinur side, the **viðskiptavinur Ledger Entries** FactBox gains the claim reikningur og claim date registered með Arion fyrir the entry, resolved frá the claim line linked til it. The two fields appear Aðeins fyrir users who may read the claim tables. See the [viðskiptavinur ledger FactBox](/help/iceland-treasury/customer-ledger-factbox/).

## Permission sets

Every message-Gerð group sits behind its own gate table og its own assignable permission set. A user er granted a group by being granted its set; without it the Kallaðu á Skilar an error Svar og does nothing. This lets an integration read statements without being able til execute greiðslur.

| Permission set | Grants |
| --- | --- |
| `BIFROST ABStmt ori` | Statement queries |
| `BIFROST ABAcct ori` | reikningur queries og verification |
| `BIFROST ABBill ori` | Bill queries |
| `BIFROST ABCard ori` | Credit card queries og færslur |
| `BIFROST ABClmPmt ori` | Claim queries, claim greiðslur og claim færslur |
| `BIFROST ABClmCrt ori` | Claim batch create, alter, cancel og operation result |
| `BIFROST ABPaymt ori` | Domestic greiðsla batches og their results |
| `BIFROST ABFrgPay ori` | Foreign greiðslur og receipts |
| `BIFROST ABFStmt ori` | Foreign accounts, færslur og statements |
| `BIFROST ABDoc ori` | Electronic skjal upload og results |

Two permission set extensions widen Foundation's own sets rather than being assigned directly: `BIFROST ABFull ori` extends `BIFROST Full ori`, og `BIFROST ABRdClm ori` extends `BIFROST Read ori` með read access til the claim tables. A user who holds Foundation's fulla eða read set picks these up sjálfkrafa.

`Arionbanki.CurrencyRates.Get` og `Help.Arionbanki.Get` eru not gated. Rates eru public market data og the help Gerð Skilar documentation.

## Replacing the published app

This module succeeds the AppSource app *Origo Cloud Events Arionbanki*. The successor er a separate app: install it beside the published one, let it take the data over, then remove the old app.

`Arion Take-Over Install ori` runs once on first install, while both apps eru present, og copies:

- 16 persistent tables, Reitur fyrir Reitur. Transient tables — messages, arguments, Beiðni logs og buffers — eru not copied.
- The Arion fields on tables shared með other extensions: Bifröst Setup, Bifröst User Setup og the base application's greiðsla Aðferð.
- The ten access-gate permission set assignments, re-pointed at their `BIFROST AB… ori` replacements.

The legacy fulla-access og read-claims sets eru not re-pointed, because both were permission set extensions og so never appeared in Access Control. Their replacements eru extensions too, og take effect through Foundation's assignable sets.

**Stored secrets do not carry over.** Isolated Storage belongs til the extension that wrote it, og the successor er a new extension, so passwords og certificates eru entered once more eftir the switch. Arion's secrets need particular attention: in the older implementation Landsbankinn shared Arion's storage keys, so the two banks overwrote each other's values. Rather than guess which bank a stored value belonged til, the upgrade Eyðir those keys. Both banks re-enter their password og certificate.

## Hvert næst

- [Iceland Treasury Yfirlit](/iceland-treasury/)
- [Draupnir signers](../reference/draupnir-signers.md) — how the IOBS envelopes eru signed
- [Message Gerð reference](/iceland-treasury/reference/message-types/)
- [In-product help](/help/iceland-treasury/)

