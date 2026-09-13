---
id: sparisjodir
title: "Sparisjóðir"
sidebar_label: "Sparisjóðir"
sidebar_position: 5
description: "Statements, claims, greiðslur, accounts, bills og credit cards at the Icelandic savings banks, exposed as 24 Bifröst message types."
---

The Sparisjóðir module connects Business Central til the Icelandic savings banks over their shared Sambankaskema 2013 B2B services. It exposes 24 message types covering statements, claims og asynchronous claim batches, greiðslur, accounts, bills, credit cards og currency rates, og it imports bank statements í Business Central's own Bank Acc. Reconciliation.

The savings banks share a service contract but not a host. One Business Central fyrirtæki integrates með exactly one savings bank, og which one er chosen by configuration rather than by code. See [Bank statement import](#bank-statement-import) below.

## What it covers

- **Statements.** reikningur statements fyrir an reikningur og date range, either as a message Svar eða imported straight í a reconciliation.
- **Claims (*innheimtukröfur*).** Fyrirspurn claims, one claim eða many; Fyrirspurn the greiðslur received against them og the færslur that make up a claim's lifecycle.
- **Claim batches.** Create, alter, cancel og re-create batches of claims, og mark a batch fyrir secondary collection. These eru asynchronous — see below.
- **greiðslur.** Submit a greiðsla batch og poll fyrir its result.
- **Accounts.** The accounts the credentials reach, accounts by owner registration number, a stakan reikningur, og verification that an owner og an reikningur belong together.
- **Bills og credit cards.** Outstanding bills og bill detail; the credit card Listi, one card með detail, og card færslur.
- **Currency rates.** The savings bank's published rates.

## Message types

The fulla Beiðni og Svar contract fyrir each Gerð — every Reitur, every error — er in the generated [message Gerð reference](/iceland-treasury/reference/message-types/). `Help.Sparisjodir.Get` Skilar same index frá inside Business Central.

### Statements

| Gerð | What it does |
| --- | --- |
| `Sparisjodir.Statement.Get` | Statement fyrir one reikningur over a date range |

### Claims

| Gerð | What it does |
| --- | --- |
| `Sparisjodir.Claim.Query` | Queries claims |
| `Sparisjodir.Claim.QueryOne` | Queries a stakan claim |
| `Sparisjodir.Claim.QueryPayments` | greiðslur received against claims |
| `Sparisjodir.Claim.QueryTransactions` | Claim lifecycle færslur |

### Claim batches

| Gerð | What it does |
| --- | --- |
| `Sparisjodir.Claim.CreateBatch` | Sendir a batch of new claims |
| `Sparisjodir.Claim.AlterBatch` | Sendir changes til existing claims |
| `Sparisjodir.Claim.CancelBatch` | Cancels a batch of claims |
| `Sparisjodir.Claim.ReCreateBatch` | Re-Býr til a batch of claims |
| `Sparisjodir.Claim.MarkBatchForSecCollection` | Marks a batch fyrir secondary collection |
| `Sparisjodir.Claim.GetOperationResult` | Collects Niðurstaðan of a submitted batch operation |

### greiðslur

| Gerð | What it does |
| --- | --- |
| `Sparisjodir.Payment.Batch` | Sendir a greiðsla batch |
| `Sparisjodir.Payment.ResultBatch` | Polls a submitted greiðsla batch |

### Accounts

| Gerð | What it does |
| --- | --- |
| `Sparisjodir.Account.Get` | Accounts fyrir the authenticated user |
| `Sparisjodir.Account.GetByOwner` | Accounts belonging til one owner |
| `Sparisjodir.Account.GetOne` | One reikningur by bank, ledger og reikningur number |
| `Sparisjodir.Account.Verify` | Confirms that an owner og an reikningur belong together |

### Bills

| Gerð | What it does |
| --- | --- |
| `Sparisjodir.Bill.Get` | Lists outstanding bills |
| `Sparisjodir.Bill.GetDetails` | One bill með its detail |

### Credit cards

| Gerð | What it does |
| --- | --- |
| `Sparisjodir.CreditCard.Get` | Lists credit cards |
| `Sparisjodir.CreditCard.GetOne` | One card með its detail |
| `Sparisjodir.CreditCard.Transactions` | færslur on a card |

### Currency rates og help

| Gerð | What it does |
| --- | --- |
| `Sparisjodir.CurrencyRates.Get` | Published currency rates |
| `Help.Sparisjodir.Get` | Skilar a Markdown index of every Sparisjóðir message Gerð |

### Claim batches eru asynchronous

A batch operation er not a transfer. The bank accepts the batch og Skilar an operation id; the outcome er collected afterwards með `Sparisjodir.Claim.GetOperationResult`. A caller Sendir the batch, keeps the operation id og polls — it does not block waiting fyrir the bank, og a successful submission does not mean the payer has been charged. Notaðu `Sparisjodir.Claim.QueryPayments` og `Sparisjodir.Claim.QueryTransactions` fyrir settlement evidence.

## Setting up

Allt five bank modules share one setup page, með a row per bank. Open **Bifröst Iceland Treasury Setup**, select the Sparisjóðir row, og set the fyrirtæki-default user Heiti. See the [in-product help](/help/iceland-treasury/treasury-setup/) fyrir the page itself.

Sparisjóðir uses four secrets:

| Secret | Scope | Tilgangur |
| --- | --- | --- |
| fyrirtæki password | fyrirtæki | The fyrirtæki-default B2B password |
| User password | Per user | Overrides the fyrirtæki password fyrir one user |
| Client certificate | fyrirtæki | Signs the SOAP envelopes |
| Certificate password | fyrirtæki | Opens the certificate |

Secrets eru entered through masked dialogs og stored in Isolated Storage. They eru never written til a table og never appear in a Svar. See [Treasury secrets](/help/iceland-treasury/treasury-secrets/).

A user who needs their own login sets a personal user Heiti og password on their own færsla; leave those blank og the fyrirtæki defaults apply. See [Bank user setup](/help/iceland-treasury/bank-user-setup/).

## Bank statement import {#bank-statement-import}

The module installs **four** Data Exchange definitions of Gerð Bank Statement Import, one per savings bank, together með the matching Bank Export/Import Setup rows:

| Format |
| --- |
| `SPAR-IN-SPARAUST` |
| `SPAR-IN-SPTHIN` |
| `SPAR-IN-SPSTR` |
| `SPAR-IN-SPSH` |

Choosing one of these as the **Bank Statement Import Format** on the Business Central bankareikningur er how the savings bank er selected. There er no separate bank Reitur on the setup page; the import format carries that choice.

Importing a statement on a Bank Acc. Reconciliation calls the bank, converts Svarið og maps it onto reconciliation lines through the staðlaða mapping. Þegar there er no earlier posted statement til derive the window frá, the module asks fyrir a start date first — see the [date input dialog](/help/iceland-treasury/date-input-dialog/). eftir a successful import a read-Aðeins [statement import summary](/help/iceland-treasury/statement-import-summary/) shows the reikningur, currency, IBAN, the number of lines imported og the calculated starting og ending balances, og warns Þegar those do not agree með what the reconciliation already held.

The definitions eru created once og left alone on reinstall, so changes an administrator makes til them survive an upgrade.

## Claims on greiðsla Methods

A claim er issued under a collection agreement, og in Business Central that agreement er represented by a greiðsla Aðferð. The module adds two fields til the base greiðsla Aðferð table og shows them on the greiðsla Methods Listi:

| Reitur | Tilgangur |
| --- | --- |
| Spar Claim Identifier | The three-character identifier the bank assigned til this collection agreement |
| Spar Last Claim No. | The last claim number used, so the next claim continues the sequence |

A fyrirtæki getur map several greiðsla Methods til different bank identifiers. The claimant registration number er always read frá fyrirtæki Information og er never stored on the greiðsla Aðferð. See [greiðsla methods](/help/iceland-treasury/payment-methods/).

viðskiptavinur Ledger Entries carry a FactBox showing the Sparisjóður claim reikningur og claim date behind the entry, resolved frá the claim line linked til it. The fields stay hidden fyrir users without read access til the claim tables. See [viðskiptavinur ledger FactBox](/help/iceland-treasury/customer-ledger-factbox/).

## Permission sets

Each functional area sits behind a gate table með one assignable permission set, so a caller getur be granted statement reads without being granted greiðsla execution:

| Permission set | Covers |
| --- | --- |
| `BIFROST SPStmt ori` | `Sparisjodir.Statement.Get` |
| `BIFROST SPAcct ori` | The four reikningur message types |
| `BIFROST SPBill ori` | Bill Listi og bill detail |
| `BIFROST SPCard ori` | The three credit card message types |
| `BIFROST SPClmPmt ori` | Claim queries, claim greiðslur og claim færslur |
| `BIFROST SPClmCrt ori` | Claim batch create, alter, cancel, re-create, secondary collection og the operation result |
| `BIFROST SPPaymt ori` | greiðsla batch submission og results |

Two further sets extend Bifröst Foundation rather than standing alone. `BIFROST SPFull ori` extends `BIFROST Full ori`, so anyone með fulla Bifröst access reaches the whole Sparisjóðir integration. `BIFROST SPRdClm ori` extends `BIFROST Read ori` með read access til the claim header og claim line tables.

## Replacing the published app

This module succeeds the per-tenant app *Cloud Events Sparisjóðir*. The successor er a separate app, so both getur be installed side by side while the switch er made.

On its first install the module takes the predecessor's data over: claim headers, lines og batches, greiðsla batches og lines, og the gate tables eru copied table by table. Fields that live on shared base tables — the claim identifier og last claim number on greiðsla Aðferð, og the Sparisjóðir fields on Bifröst User Setup — eru copied Reitur by Reitur, because their Reitur numbers moved með the new object range. Existing user assignments of the old permission sets eru re-pointed at the sets that replace them. A table that already holds rows er left alone, so a second install never overwrites live data.

Stored secrets do not carry over. Isolated Storage er scoped per extension, og the successor er a different extension, so the password, certificate og certificate password eru entered again eftir the switch. The fyrirtæki-default user Heiti er carried across með the rest of the setup.

