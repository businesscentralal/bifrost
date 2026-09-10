---
id: bifrost-iceland-treasury
title: "Iceland Treasury message types"
sidebar_label: "Iceland Treasury message types"
sidebar_position: 5
description: "Message types added to the Bifröst API by Bifrost Iceland Treasury. Icelandic bank integrations as Bifröst message types: Landsbankinn, Arion, Íslandsbanki, Kvika and Sparisjóðir on a shared IOBS SOAP signer framework. Load alongside bifrost-bc-integration, which carries the API…"
---

Icelandic bank integrations as Bifröst message types: Landsbankinn, Arion, Íslandsbanki, Kvika and Sparisjóðir on a shared IOBS SOAP signer framework.

---

## When to load this skill

Load it together with the core skill when:

- money moves: claims, payments, direct debits, card transactions, account statements or bank balances against an Icelandic bank;
- the task names Landsbankinn, Arion banki, Íslandsbanki, Kvika or the savings banks (Sparisjóðir).

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](./bifrost-bc-integration/index.md) and are not repeated here.

---

## Hard rules

- Each bank is its own message-type family with its own contract. `Landsbankinn.*` and `Arionbanki.*` are not interchangeable, even where the operation reads the same.
- These message types move real money and create real claims. Never call a create, send, alter or delete type against a production environment to find out what it does — read the page first.
- Bank credentials live in the Bifröst secret store, configured in Business Central. Never pass a certificate, key or password through a message payload, a command line or a log.
- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.
- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.
- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.

---

## Reference pages

**Reference base:** `../../iceland-treasury/reference/` — every path below is relative to it.

Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.
From the deployed site the same paths resolve against this file’s own URL.

### `Landsbankinn.*` (65)

| Message type | Page |
| --- | --- |
| `Landsbankinn.Account.EndOfDayBalance` | `message-types/landsbankinn-account-endofdaybalance/` |
| `Landsbankinn.Account.Get` | `message-types/landsbankinn-account-get/` |
| `Landsbankinn.Account.List` | `message-types/landsbankinn-account-list/` |
| `Landsbankinn.Account.Transactions` | `message-types/landsbankinn-account-transactions/` |
| `Landsbankinn.Account.Verify` | `message-types/landsbankinn-account-verify/` |
| `Landsbankinn.Acquiring.Settlements` | `message-types/landsbankinn-acquiring-settlements/` |
| `Landsbankinn.Acquiring.Transactions` | `message-types/landsbankinn-acquiring-transactions/` |
| `Landsbankinn.Card.Attachment` | `message-types/landsbankinn-card-attachment/` |
| `Landsbankinn.Card.LedgerKeyCreate` | `message-types/landsbankinn-card-ledgerkeycreate/` |
| `Landsbankinn.Card.LedgerKeyDelete` | `message-types/landsbankinn-card-ledgerkeydelete/` |
| `Landsbankinn.Card.LedgerKeyGroupCreate` | `message-types/landsbankinn-card-ledgerkeygroupcreate/` |
| `Landsbankinn.Card.LedgerKeyGroupDelete` | `message-types/landsbankinn-card-ledgerkeygroupdelete/` |
| `Landsbankinn.Card.LedgerKeyGroups` | `message-types/landsbankinn-card-ledgerkeygroups/` |
| `Landsbankinn.Card.LedgerKeys` | `message-types/landsbankinn-card-ledgerkeys/` |
| `Landsbankinn.Card.LedgerKeySubGroupCreate` | `message-types/landsbankinn-card-ledgerkeysubgroupcreate/` |
| `Landsbankinn.Card.LedgerKeySubGroupDelete` | `message-types/landsbankinn-card-ledgerkeysubgroupdelete/` |
| `Landsbankinn.Card.LedgerKeySubGroups` | `message-types/landsbankinn-card-ledgerkeysubgroups/` |
| `Landsbankinn.Card.List` | `message-types/landsbankinn-card-list/` |
| `Landsbankinn.Card.Query` | `message-types/landsbankinn-card-query/` |
| `Landsbankinn.Card.TransactionGet` | `message-types/landsbankinn-card-transactionget/` |
| `Landsbankinn.Card.Transactions` | `message-types/landsbankinn-card-transactions/` |
| `Landsbankinn.Card.TransactionUpdate` | `message-types/landsbankinn-card-transactionupdate/` |
| `Landsbankinn.Claim.Create` | `message-types/landsbankinn-claim-create/` |
| `Landsbankinn.Claim.Delete` | `message-types/landsbankinn-claim-delete/` |
| `Landsbankinn.Claim.Get` | `message-types/landsbankinn-claim-get/` |
| `Landsbankinn.Claim.List` | `message-types/landsbankinn-claim-list/` |
| `Landsbankinn.Claim.Update` | `message-types/landsbankinn-claim-update/` |
| `Landsbankinn.ClaimBatch.Actions` | `message-types/landsbankinn-claimbatch-actions/` |
| `Landsbankinn.ClaimBatch.Create` | `message-types/landsbankinn-claimbatch-create/` |
| `Landsbankinn.ClaimBatch.Get` | `message-types/landsbankinn-claimbatch-get/` |
| `Landsbankinn.ClaimBatch.List` | `message-types/landsbankinn-claimbatch-list/` |
| `Landsbankinn.ClaimPayment.Get` | `message-types/landsbankinn-claimpayment-get/` |
| `Landsbankinn.ClaimPayment.List` | `message-types/landsbankinn-claimpayment-list/` |
| `Landsbankinn.ClaimTemplate.ClaimantAccesses` | `message-types/landsbankinn-claimtemplate-claimantaccesses/` |
| `Landsbankinn.ClaimTemplate.Create` | `message-types/landsbankinn-claimtemplate-create/` |
| `Landsbankinn.ClaimTemplate.Delete` | `message-types/landsbankinn-claimtemplate-delete/` |
| `Landsbankinn.ClaimTemplate.Get` | `message-types/landsbankinn-claimtemplate-get/` |
| `Landsbankinn.ClaimTemplate.List` | `message-types/landsbankinn-claimtemplate-list/` |
| `Landsbankinn.ClaimTemplate.UnfulfilledPrerequisites` | `message-types/landsbankinn-claimtemplate-unfulfilledprerequisites/` |
| `Landsbankinn.ClaimTemplate.Update` | `message-types/landsbankinn-claimtemplate-update/` |
| `Landsbankinn.Currency.Rates` | `message-types/landsbankinn-currency-rates/` |
| `Landsbankinn.EDoc.BatchUpload` | `message-types/landsbankinn-edoc-batchupload/` |
| `Landsbankinn.EDoc.CrossReferenceCreate` | `message-types/landsbankinn-edoc-crossreferencecreate/` |
| `Landsbankinn.EDoc.CrossReferenceDelete` | `message-types/landsbankinn-edoc-crossreferencedelete/` |
| `Landsbankinn.EDoc.CrossReferenceGet` | `message-types/landsbankinn-edoc-crossreferenceget/` |
| `Landsbankinn.EDoc.CrossReferences` | `message-types/landsbankinn-edoc-crossreferences/` |
| `Landsbankinn.EDoc.DocumentContent` | `message-types/landsbankinn-edoc-documentcontent/` |
| `Landsbankinn.EDoc.DocumentGet` | `message-types/landsbankinn-edoc-documentget/` |
| `Landsbankinn.EDoc.Documents` | `message-types/landsbankinn-edoc-documents/` |
| `Landsbankinn.EDoc.DocumentTypes` | `message-types/landsbankinn-edoc-documenttypes/` |
| `Landsbankinn.EDoc.Upload` | `message-types/landsbankinn-edoc-upload/` |
| `Landsbankinn.Fees.List` | `message-types/landsbankinn-fees-list/` |
| `Landsbankinn.ForeignPayment.Create` | `message-types/landsbankinn-foreignpayment-create/` |
| `Landsbankinn.ForeignPayment.Query` | `message-types/landsbankinn-foreignpayment-query/` |
| `Landsbankinn.Funds.List` | `message-types/landsbankinn-funds-list/` |
| `Landsbankinn.InterestRates.List` | `message-types/landsbankinn-interestrates-list/` |
| `Landsbankinn.Payment.Batch` | `message-types/landsbankinn-payment-batch/` |
| `Landsbankinn.Payment.ResultBatch` | `message-types/landsbankinn-payment-resultbatch/` |
| `Landsbankinn.PaymentSlip.Query` | `message-types/landsbankinn-paymentslip-query/` |
| `Landsbankinn.Portfolio.HoldingReturns` | `message-types/landsbankinn-portfolio-holdingreturns/` |
| `Landsbankinn.Portfolio.Holdings` | `message-types/landsbankinn-portfolio-holdings/` |
| `Landsbankinn.Portfolio.List` | `message-types/landsbankinn-portfolio-list/` |
| `Landsbankinn.Portfolio.Transactions` | `message-types/landsbankinn-portfolio-transactions/` |
| `Landsbankinn.UnpaidInvoice.Get` | `message-types/landsbankinn-unpaidinvoice-get/` |
| `Landsbankinn.UnpaidInvoice.Query` | `message-types/landsbankinn-unpaidinvoice-query/` |

### `Arionbanki.*` (33)

| Message type | Page |
| --- | --- |
| `Arionbanki.Account.Get` | `message-types/arionbanki-account-get/` |
| `Arionbanki.Account.GetByOwner` | `message-types/arionbanki-account-getbyowner/` |
| `Arionbanki.Account.GetOne` | `message-types/arionbanki-account-getone/` |
| `Arionbanki.Account.Verify` | `message-types/arionbanki-account-verify/` |
| `Arionbanki.Bill.Get` | `message-types/arionbanki-bill-get/` |
| `Arionbanki.Bill.GetDetails` | `message-types/arionbanki-bill-getdetails/` |
| `Arionbanki.Claim.AlterBatch` | `message-types/arionbanki-claim-alterbatch/` |
| `Arionbanki.Claim.CancelBatch` | `message-types/arionbanki-claim-cancelbatch/` |
| `Arionbanki.Claim.CreateBatch` | `message-types/arionbanki-claim-createbatch/` |
| `Arionbanki.Claim.GetOperationResult` | `message-types/arionbanki-claim-getoperationresult/` |
| `Arionbanki.Claim.Query` | `message-types/arionbanki-claim-query/` |
| `Arionbanki.Claim.QueryOne` | `message-types/arionbanki-claim-queryone/` |
| `Arionbanki.Claim.QueryPayments` | `message-types/arionbanki-claim-querypayments/` |
| `Arionbanki.Claim.QueryTransactions` | `message-types/arionbanki-claim-querytransactions/` |
| `Arionbanki.CreditCard.Get` | `message-types/arionbanki-creditcard-get/` |
| `Arionbanki.CreditCard.GetOne` | `message-types/arionbanki-creditcard-getone/` |
| `Arionbanki.CreditCard.Transactions` | `message-types/arionbanki-creditcard-transactions/` |
| `Arionbanki.CurrencyRates.Get` | `message-types/arionbanki-currencyrates-get/` |
| `Arionbanki.Document.GetResult` | `message-types/arionbanki-document-getresult/` |
| `Arionbanki.Document.GetResults` | `message-types/arionbanki-document-getresults/` |
| `Arionbanki.Document.Upload` | `message-types/arionbanki-document-upload/` |
| `Arionbanki.ForeignPayment.EnterBatch` | `message-types/arionbanki-foreignpayment-enterbatch/` |
| `Arionbanki.ForeignPayment.GetBatches` | `message-types/arionbanki-foreignpayment-getbatches/` |
| `Arionbanki.ForeignPayment.GetPaymentsByBatchId` | `message-types/arionbanki-foreignpayment-getpaymentsbybatchid/` |
| `Arionbanki.ForeignPayment.GetReceipt` | `message-types/arionbanki-foreignpayment-getreceipt/` |
| `Arionbanki.ForeignPayment.GetReceiptByBatchId` | `message-types/arionbanki-foreignpayment-getreceiptbybatchid/` |
| `Arionbanki.ForeignPayment.GetReceipts` | `message-types/arionbanki-foreignpayment-getreceipts/` |
| `Arionbanki.ForeignStatement.Accounts.Get` | `message-types/arionbanki-foreignstatement-accounts-get/` |
| `Arionbanki.ForeignStatement.Statements.Get` | `message-types/arionbanki-foreignstatement-statements-get/` |
| `Arionbanki.ForeignStatement.Transactions.Get` | `message-types/arionbanki-foreignstatement-transactions-get/` |
| `Arionbanki.Payment.Batch` | `message-types/arionbanki-payment-batch/` |
| `Arionbanki.Payment.ResultBatch` | `message-types/arionbanki-payment-resultbatch/` |
| `Arionbanki.Statement.Get` | `message-types/arionbanki-statement-get/` |

### `Islandsbanki.*` (23)

| Message type | Page |
| --- | --- |
| `Islandsbanki.Account.Verify` | `message-types/islandsbanki-account-verify/` |
| `Islandsbanki.Claim.Cancel` | `message-types/islandsbanki-claim-cancel/` |
| `Islandsbanki.Claim.Create` | `message-types/islandsbanki-claim-create/` |
| `Islandsbanki.Claim.Get` | `message-types/islandsbanki-claim-get/` |
| `Islandsbanki.Claim.Query` | `message-types/islandsbanki-claim-query/` |
| `Islandsbanki.Claim.QueryPayments` | `message-types/islandsbanki-claim-querypayments/` |
| `Islandsbanki.CurrencyRates.Get` | `message-types/islandsbanki-currencyrates-get/` |
| `Islandsbanki.DebitCard.Transfer` | `message-types/islandsbanki-debitcard-transfer/` |
| `Islandsbanki.File.Send` | `message-types/islandsbanki-file-send/` |
| `Islandsbanki.ForeignPayment.Confirm` | `message-types/islandsbanki-foreignpayment-confirm/` |
| `Islandsbanki.ForeignPayment.Rates` | `message-types/islandsbanki-foreignpayment-rates/` |
| `Islandsbanki.ForeignPayment.Register` | `message-types/islandsbanki-foreignpayment-register/` |
| `Islandsbanki.ForeignPayment.Result` | `message-types/islandsbanki-foreignpayment-result/` |
| `Islandsbanki.Milliinnheimta.Claim.Query` | `message-types/islandsbanki-milliinnheimta-claim-query/` |
| `Islandsbanki.Milliinnheimta.Claim.Return` | `message-types/islandsbanki-milliinnheimta-claim-return/` |
| `Islandsbanki.Milliinnheimta.Payment.Query` | `message-types/islandsbanki-milliinnheimta-payment-query/` |
| `Islandsbanki.Payment.Batch` | `message-types/islandsbanki-payment-batch/` |
| `Islandsbanki.Payment.Execute` | `message-types/islandsbanki-payment-execute/` |
| `Islandsbanki.Payment.Result` | `message-types/islandsbanki-payment-result/` |
| `Islandsbanki.Payment.Validate` | `message-types/islandsbanki-payment-validate/` |
| `Islandsbanki.Securities.TransactionHistory` | `message-types/islandsbanki-securities-transactionhistory/` |
| `Islandsbanki.Statement.Get` | `message-types/islandsbanki-statement-get/` |
| `Islandsbanki.UnpaidInvoice.Query` | `message-types/islandsbanki-unpaidinvoice-query/` |

### `Sparisjodir.*` (23)

| Message type | Page |
| --- | --- |
| `Sparisjodir.Account.Get` | `message-types/sparisjodir-account-get/` |
| `Sparisjodir.Account.GetByOwner` | `message-types/sparisjodir-account-getbyowner/` |
| `Sparisjodir.Account.GetOne` | `message-types/sparisjodir-account-getone/` |
| `Sparisjodir.Account.Verify` | `message-types/sparisjodir-account-verify/` |
| `Sparisjodir.Bill.Get` | `message-types/sparisjodir-bill-get/` |
| `Sparisjodir.Bill.GetDetails` | `message-types/sparisjodir-bill-getdetails/` |
| `Sparisjodir.Claim.AlterBatch` | `message-types/sparisjodir-claim-alterbatch/` |
| `Sparisjodir.Claim.CancelBatch` | `message-types/sparisjodir-claim-cancelbatch/` |
| `Sparisjodir.Claim.CreateBatch` | `message-types/sparisjodir-claim-createbatch/` |
| `Sparisjodir.Claim.GetOperationResult` | `message-types/sparisjodir-claim-getoperationresult/` |
| `Sparisjodir.Claim.MarkBatchForSecCollection` | `message-types/sparisjodir-claim-markbatchforseccollection/` |
| `Sparisjodir.Claim.Query` | `message-types/sparisjodir-claim-query/` |
| `Sparisjodir.Claim.QueryOne` | `message-types/sparisjodir-claim-queryone/` |
| `Sparisjodir.Claim.QueryPayments` | `message-types/sparisjodir-claim-querypayments/` |
| `Sparisjodir.Claim.QueryTransactions` | `message-types/sparisjodir-claim-querytransactions/` |
| `Sparisjodir.Claim.ReCreateBatch` | `message-types/sparisjodir-claim-recreatebatch/` |
| `Sparisjodir.CreditCard.Get` | `message-types/sparisjodir-creditcard-get/` |
| `Sparisjodir.CreditCard.GetOne` | `message-types/sparisjodir-creditcard-getone/` |
| `Sparisjodir.CreditCard.Transactions` | `message-types/sparisjodir-creditcard-transactions/` |
| `Sparisjodir.CurrencyRates.Get` | `message-types/sparisjodir-currencyrates-get/` |
| `Sparisjodir.Payment.Batch` | `message-types/sparisjodir-payment-batch/` |
| `Sparisjodir.Payment.ResultBatch` | `message-types/sparisjodir-payment-resultbatch/` |
| `Sparisjodir.Statement.Get` | `message-types/sparisjodir-statement-get/` |

### `Kvikabanki.*` (11)

| Message type | Page |
| --- | --- |
| `Kvikabanki.Claim.AlterBatch` | `message-types/kvikabanki-claim-alterbatch/` |
| `Kvikabanki.Claim.CancelBatch` | `message-types/kvikabanki-claim-cancelbatch/` |
| `Kvikabanki.Claim.CreateBatch` | `message-types/kvikabanki-claim-createbatch/` |
| `Kvikabanki.Claim.GetOperationResult` | `message-types/kvikabanki-claim-getoperationresult/` |
| `Kvikabanki.Claim.Query` | `message-types/kvikabanki-claim-query/` |
| `Kvikabanki.Claim.QueryOne` | `message-types/kvikabanki-claim-queryone/` |
| `Kvikabanki.Claim.QueryPayments` | `message-types/kvikabanki-claim-querypayments/` |
| `Kvikabanki.CurrencyRates.Get` | `message-types/kvikabanki-currencyrates-get/` |
| `Kvikabanki.Payment.Batch` | `message-types/kvikabanki-payment-batch/` |
| `Kvikabanki.Payment.ResultBatch` | `message-types/kvikabanki-payment-resultbatch/` |
| `Kvikabanki.Statement.Get` | `message-types/kvikabanki-statement-get/` |

### `Help.*` (3)

| Message type | Page |
| --- | --- |
| `Help.Arionbanki.Get` | `message-types/help-arionbanki-get/` |
| `Help.Landsbankinn.Get` | `message-types/help-landsbankinn-get/` |
| `Help.Sparisjodir.Get` | `message-types/help-sparisjodir-get/` |

---

## Related skills

- [bifrost-bc-integration](./bifrost-bc-integration/index.md) — the API itself. Always load this one.
- [bifrost-foundation](./bifrost-foundation.md) — Bifrost Foundation
- [bifrost-iceland](./bifrost-iceland.md) — Bifrost Iceland
- [bifrost-iceland-docex](./bifrost-iceland-docex.md) — Bifrost Iceland DocEx
- [bifrost-bragi](./bifrost-bragi.md) — Bifrost Language Models
- [bifrost-hnitbjorg](./bifrost-hnitbjorg.md) — Bifrost Attachments
- [bifrost-nornir](./bifrost-nornir.md) — Bifrost Orchestrator
- [bifrost-clockify](./bifrost-clockify.md) — Bifrost Timesheets
- [bifrost-subscription-billing](./bifrost-subscription-billing.md) — Bifrost Subscription Billing
## Loading this skill

An agent loads the skill file itself: [SKILL.md](pathname:///skills/bifrost-iceland-treasury/SKILL.md).
It is an index: what the app adds, when to load it, and the path of every reference page.

<details>
<summary>The description an agent matches this skill against</summary>

Message types added to the Bifröst API by Bifrost Iceland Treasury. Icelandic bank integrations as Bifröst message types: Landsbankinn, Arion, Íslandsbanki, Kvika and Sparisjóðir on a shared IOBS SOAP signer framework. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index of what Iceland Treasury adds — 158 message types across 6 families (Landsbankinn.*, Arionbanki.*, Islandsbanki.*, Sparisjodir.*, Kvikabanki.*, Help.*).

</details>
