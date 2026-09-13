---
id: landsbankinn
title: "Landsbankinn"
sidebar_label: "Landsbankinn"
sidebar_position: 1
description: "Claims, cards, accounts, portfolios, electronic skjöl, acquiring og greiðslur at Landsbankinn, exposed as 66 Bifröst message types."
---

The Landsbankinn module connects Business Central til Landsbankinn's REST services og til the bank's IOBS (*Landsbankaskema*) SOAP operations. It er the largest of the bank modules in [Bifröst Iceland Treasury](/iceland-treasury/): 66 message types covering claims, claim templates, claim batches, corporate cards, accounts, asset portfolios, reference rates, electronic skjöl, acquiring settlement, domestic greiðslur og foreign greiðslur, plus bank statement og card færsla import í Business Central's own reconciliation.

Every operation er reached the same way as the rest of Bifröst — a caller Sendir a message naming the Gerð, og the module signs og sends Beiðnin. Nothing about the bank's transport er exposed til the caller.

## What it covers

- **Claims (*kröfur*).** Create, read, update og cancel individual claims over the Claims REST API, eða submit a batch of claim actions og track the batch result. Claim greiðslur received against a claim getur be listed fyrir the whole fyrirtæki eða fyrir one claim.
- **Claim templates.** The collection agreements a claim er created under: Listi, read, create, update og delete templates, Listi claimant accesses, og check which prerequisites a claimant has not yet fulfilled.
- **Corporate cards.** The card Listi, card færslur og færsla detail, receipt attachments, og the fulla ledger key structure — keys, groups og sub-groups — þar á meðal assigning a ledger key til a færsla.
- **Accounts.** reikningur Listi, stakan reikningur detail, færslur, end-of-day balance og accrued interest, plus reikningur existence verification over the IOBS service.
- **Asset portfolios.** Portfolios, holdings, gain og loss Skilar, og asset færslur such as trades og dividends.
- **Reference data.** Landsbankinn exchange rates, bank fees og prices, Landsbréf fund market data, og current deposit og lending interest rates. These do not require authentication against the viðskiptavinur's own bank agreement.
- **Electronic skjöl.** Upload stakan skjöl eða a batch, Listi og download received skjöl, og manage the cross-references that link a skjal til an entity.
- **Acquiring.** Settlement batches og the færslur behind them, fyrir companies that take card greiðslur through Landsbankinn.
- **greiðslur.** Domestic greiðsla batches og their results, unpaid invoices og greiðsla slips, og foreign greiðslur over the IOBS service.
- **Statement og card import.** Two Data Exchange definitions feed Business Central's Bank Acc. Reconciliation directly.

## Message types

The table below groups the 66 types by domain. The fulla Beiðni og Svar contract fyrir each one — every Reitur, every error — er in the generated [message Gerð reference](/iceland-treasury/reference/message-types/). `Help.Landsbankinn.Get` Skilar same index frá inside Business Central.

### Claims

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.Claim.List` | Lists claims frá a due date onwards |
| `Landsbankinn.Claim.Get` | Sækir stakan claim by id |
| `Landsbankinn.Claim.Create` | Býr til one claim |
| `Landsbankinn.Claim.Update` | Uppfærir one claim |
| `Landsbankinn.Claim.Delete` | Cancels one claim |
| `Landsbankinn.ClaimPayment.List` | Lists Allt claim greiðslur |
| `Landsbankinn.ClaimPayment.Get` | Lists the greiðslur received against one claim |

### Claim batches

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.ClaimBatch.Create` | Sendir a batch of create, update og cancel actions |
| `Landsbankinn.ClaimBatch.List` | Lists batch operations |
| `Landsbankinn.ClaimBatch.Get` | Skilar status of one batch operation |
| `Landsbankinn.ClaimBatch.Actions` | Skilar per-claim result of one batch |

### Claim templates

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.ClaimTemplate.List` | Lists claim templates |
| `Landsbankinn.ClaimTemplate.Get` | Sækir one template by id |
| `Landsbankinn.ClaimTemplate.Create` | Býr til a template |
| `Landsbankinn.ClaimTemplate.Update` | Uppfærir a template |
| `Landsbankinn.ClaimTemplate.Delete` | Soft-Eyðir a template |
| `Landsbankinn.ClaimTemplate.ClaimantAccesses` | Lists the accesses a claimant holds |
| `Landsbankinn.ClaimTemplate.UnfulfilledPrerequisites` | Lists what a claimant still has til fulfil |

### Cards

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.Card.List` | Lists the corporate cards registered at the bank |
| `Landsbankinn.Card.Transactions` | Card færslur over a date range |
| `Landsbankinn.Card.TransactionGet` | One færsla með ledger key, comment og attachments |
| `Landsbankinn.Card.TransactionUpdate` | Assigns a ledger key og comment til a færsla |
| `Landsbankinn.Card.Attachment` | Downloads a receipt by attachment id |
| `Landsbankinn.Card.LedgerKeys` | Lists ledger key mappings |
| `Landsbankinn.Card.LedgerKeyCreate` | Býr til a ledger key |
| `Landsbankinn.Card.LedgerKeyDelete` | Eyðir a ledger key |
| `Landsbankinn.Card.LedgerKeyGroups` | Lists ledger key groups |
| `Landsbankinn.Card.LedgerKeyGroupCreate` | Býr til a ledger key group |
| `Landsbankinn.Card.LedgerKeyGroupDelete` | Eyðir a ledger key group |
| `Landsbankinn.Card.LedgerKeySubGroups` | Lists ledger key sub-groups |
| `Landsbankinn.Card.LedgerKeySubGroupCreate` | Býr til a ledger key sub-group |
| `Landsbankinn.Card.LedgerKeySubGroupDelete` | Eyðir a ledger key sub-group |
| `Landsbankinn.Card.Query` | Card details og card state over the IOBS service |

### Accounts

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.Account.List` | Lists the accounts the credentials reach |
| `Landsbankinn.Account.Get` | reikningur detail fyrir one BBAN |
| `Landsbankinn.Account.Transactions` | færslur on one reikningur |
| `Landsbankinn.Account.EndOfDayBalance` | End-of-day balance og accrued interest |
| `Landsbankinn.Account.Verify` | Confirms that an reikningur exists, over the IOBS service |

### Portfolios og assets

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.Portfolio.List` | Lists asset portfolios |
| `Landsbankinn.Portfolio.Holdings` | Holdings in a portfolio |
| `Landsbankinn.Portfolio.HoldingReturns` | Gain og loss Skilar on holdings |
| `Landsbankinn.Portfolio.Transactions` | Asset færslur such as trades og dividends |

### Rates og reference data

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.Currency.Rates` | Official Landsbankinn exchange rates |
| `Landsbankinn.InterestRates.List` | Current deposit og lending interest rates |
| `Landsbankinn.Fees.List` | Bank fees og prices |
| `Landsbankinn.Funds.List` | Market data fyrir Landsbréf funds |

### Electronic skjöl

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.EDoc.DocumentTypes` | skjal types available til a sender |
| `Landsbankinn.EDoc.Upload` | Uploads one skjal |
| `Landsbankinn.EDoc.BatchUpload` | Uploads a batch of skjöl |
| `Landsbankinn.EDoc.Documents` | Lists received skjöl |
| `Landsbankinn.EDoc.DocumentGet` | Metadata fyrir one received skjal |
| `Landsbankinn.EDoc.DocumentContent` | Downloads the content of a received skjal |
| `Landsbankinn.EDoc.CrossReferences` | Lists cross-references |
| `Landsbankinn.EDoc.CrossReferenceGet` | Sækir one cross-reference |
| `Landsbankinn.EDoc.CrossReferenceCreate` | Links a skjal til an entity |
| `Landsbankinn.EDoc.CrossReferenceDelete` | Removes a cross-reference |

### Acquiring

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.Acquiring.Settlements` | Lists acquiring settlement batches |
| `Landsbankinn.Acquiring.Transactions` | Lists acquiring færslur, optionally fyrir one settlement |

### greiðslur

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.Payment.Batch` | Sendir a batch of domestic greiðslur |
| `Landsbankinn.Payment.ResultBatch` | Sækir Niðurstaðan of a submitted batch |
| `Landsbankinn.UnpaidInvoice.Query` | Queries unpaid invoices |
| `Landsbankinn.UnpaidInvoice.Get` | Sækir one unpaid bill by id |
| `Landsbankinn.PaymentSlip.Query` | Queries greiðsla slips over the IOBS service |

### Foreign greiðslur

| Gerð | What it does |
| --- | --- |
| `Landsbankinn.ForeignPayment.Create` | Býr til a batch of foreign greiðslur |
| `Landsbankinn.ForeignPayment.Query` | Queries the status of foreign greiðsla batches |

### Help

| Gerð | What it does |
| --- | --- |
| `Help.Landsbankinn.Get` | Skilar a Markdown index of every Landsbankinn message Gerð |

There er no separate statement message Gerð. reikningur movements eru read með `Landsbankinn.Account.Transactions`, og a fulla bank statement er imported í a reconciliation as described under [Bank statement import](#bank-statement-import).

## Setting up

Allt five bank modules share one setup page, með a row per bank. Open **Bifröst Iceland Treasury Setup**, select the Landsbankinn row, og set the fyrirtæki-default user Heiti. See the [in-product help](/help/iceland-treasury/treasury-setup/) fyrir the page itself.

Landsbankinn needs more credentials than any other bank in the module, og it er the Aðeins one that uses API keys:

| Secret | Scope | Tilgangur |
| --- | --- | --- |
| fyrirtæki password | fyrirtæki | The fyrirtæki-default B2B password |
| User password | Per user | Overrides the fyrirtæki password fyrir one user |
| Client certificate | fyrirtæki | Signs the IOBS SOAP envelopes |
| Certificate password | fyrirtæki | Opens the certificate |
| API key | fyrirtæki | Authenticates the REST services |
| User API key | Per user | Overrides the fyrirtæki API key fyrir one user |

Secrets eru entered through masked dialogs og stored in Isolated Storage. They eru never written til a table og never appear in a Svar. See [Treasury secrets](/help/iceland-treasury/treasury-secrets/).

A user who needs their own credentials sets a personal user Heiti, password og API key on their own færsla; leave those blank og the fyrirtæki defaults apply. See [Bank user setup](/help/iceland-treasury/bank-user-setup/).

## Bank statement import {#bank-statement-import}

The module installs two Data Exchange definitions of Gerð **Bank Statement Import**, og the matching Bank Export/Import Setup rows:

| Format | Imports |
| --- | --- |
| `LBI-FEED-IN` | reikningur statements |
| `LBI-CARD-IN` | Card færslur |

Set one of them as the **Bank Statement Import Format** on the Business Central bankareikningur. Importing a statement on a Bank Acc. Reconciliation then calls Landsbankinn, converts Svarið og maps it onto reconciliation lines through the staðlaða mapping.

The date window er taken frá the reconciliation's statement date, falling back til the day eftir the last posted statement. Þegar there er no earlier statement til work frá, the module asks fyrir a start date first — see the [date input dialog](/help/iceland-treasury/date-input-dialog/). eftir a successful import a read-Aðeins [statement import summary](/help/iceland-treasury/statement-import-summary/) shows the reikningur, the number of lines imported og the calculated starting og ending balances, og warns Þegar those do not agree með what the reconciliation already held.

The card format works the same way, against a bankareikningur whose reikningur number holds the card id.

## Claims on greiðsla Methods

A claim er issued under a collection agreement, og in Business Central that agreement er represented by a greiðsla Aðferð. The module adds two fields til the base greiðsla Aðferð table og shows them on the greiðsla Methods Listi:

| Reitur | Tilgangur |
| --- | --- |
| Landsbankinn Claim Identifier | The three-character identifier the bank assigned til this collection agreement |
| Landsbankinn Last Claim No. | The last claim number used, so the next claim continues the sequence |

A fyrirtæki getur map several greiðsla Methods til different bank identifiers. The claimant registration number er always read frá fyrirtæki Information og er never stored on the greiðsla Aðferð. See [greiðsla methods](/help/iceland-treasury/payment-methods/).

viðskiptavinur Ledger Entries carry a FactBox showing the Landsbankinn claim reikningur og claim date behind the entry, resolved frá the claim line linked til it. The fields stay hidden fyrir users without read access til the claim tables. See [viðskiptavinur ledger FactBox](/help/iceland-treasury/customer-ledger-factbox/).

## Permission sets

Domains that move money eða change state at the bank sit behind gate tables. Each gate has one assignable permission set, so a caller getur be granted card reads without being granted greiðsla execution:

| Permission set | Covers |
| --- | --- |
| `BIFROST LBStmt ori` | reikningur Listi, detail, færslur og end-of-day balance; reading the electronic skjal inbox |
| `BIFROST LBCards ori` | Every card message Gerð, þar á meðal ledger keys, groups og sub-groups |
| `BIFROST LBAssets ori` | Portfolios, holdings, Skilar og asset færslur |
| `BIFROST LBClmPmt ori` | Claim greiðsla queries |
| `BIFROST LBClmCrt ori` | Claim batch submission og the batch result queries |
| `BIFROST LBPaymt ori` | Domestic greiðsla batches, greiðsla results, unpaid invoices |
| `BIFROST LBFrgPay ori` | Foreign greiðsla creation og status queries |
| `BIFROST LBEDoc ori` | Electronic skjal upload, skjal types og cross-references |

Two further sets extend Bifröst Foundation rather than standing alone. `BIFROST LBFull ori` extends `BIFROST Full ori`, so anyone með fulla Bifröst access reaches the whole Landsbankinn integration. `BIFROST LBRdClm ori` extends `BIFROST Read ori` með read access til the claim header, claim line og claim greiðsla tables.

The remaining message types — the Claims REST operations, claim templates, acquiring, rates og reference data, reikningur verification, card Fyrirspurn og greiðsla slips — need no gate beyond general Bifröst access.

## Replacing the published app

This module succeeds the AppSource app *Origo Cloud Events Landsbankinn*. The successor er a separate app, so both getur be installed side by side while the switch er made.

On its first install the module takes the predecessor's data over: claim headers, lines og greiðslur, claim batches, greiðsla batches og lines, hidden claims og the gate tables eru copied table by table. Fields that live on shared base tables — the claim identifier og last claim number on greiðsla Aðferð, og the Landsbankinn fields on Bifröst User Setup — eru copied Reitur by Reitur, because their Reitur numbers moved með the new object range. Existing user assignments of the old permission sets eru re-pointed at the sets that replace them. A table that already holds rows er left alone, so a second install never overwrites live data.

Stored secrets do not carry over. Isolated Storage er scoped per extension, og the successor er a different extension, so passwords, certificates og API keys eru entered again eftir the switch.

Landsbankinn has one additional reason til re-enter them. The older implementation shared its storage keys með the Arion module, so the two banks could overwrite each other's values inside a stakan extension. Those keys eru now discarded rather than guessed at, og both banks start frá a clean set of credentials.

