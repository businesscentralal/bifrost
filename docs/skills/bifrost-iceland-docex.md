---
id: bifrost-iceland-docex
title: "Iceland DocEx message types"
sidebar_label: "Iceland DocEx message types"
sidebar_position: 6
description: "Message types added to the Bifröst API by Bifrost Iceland DocEx. Electronic document exchange for Business Central through Advania, Unimaze and InExchange, with Peppol BIS 3.0 data and UBL rendering. Load alongside bifrost-bc-integration, which carries the API itself; this skill…"
---

Electronic document exchange for Business Central through Advania, Unimaze and InExchange, with Peppol BIS 3.0 data and UBL rendering.

---

## When to load this skill

Load it together with the core skill when:

- a document has to leave or enter Business Central electronically — Peppol/BIS 3.0, an e-invoice, an e-receipt or an electronic order;
- the task names a document exchange service provider.

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](./bifrost-bc-integration/index.md) and are not repeated here.

---

## Hard rules

- A document exchange is asynchronous end to end. A successful send means the provider accepted the document, not that the recipient did — poll for the delivery state.
- Documents carry attachments as base64 inside the payload. Watch the request size limit and use the provider-specific compression types where they exist.
- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.
- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.
- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.

---

## Reference pages

**Reference base:** `../../iceland-docex/reference/` — every path below is relative to it.

Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.
From the deployed site the same paths resolve against this file’s own URL.

### `DocumentExchange.*` (75)

| Message type | Page |
| --- | --- |
| `DocumentExchange.Advania.CheckUniversalService` | `message-types/documentexchange-advania-checkuniversalservice/` |
| `DocumentExchange.Advania.CompressPdf` | `message-types/documentexchange-advania-compresspdf/` |
| `DocumentExchange.Advania.ConvertXml` | `message-types/documentexchange-advania-convertxml/` |
| `DocumentExchange.Advania.CreateInvoice` | `message-types/documentexchange-advania-createinvoice/` |
| `DocumentExchange.Advania.GetAttachments` | `message-types/documentexchange-advania-getattachments/` |
| `DocumentExchange.Advania.GetAuthorizedPartners` | `message-types/documentexchange-advania-getauthorizedpartners/` |
| `DocumentExchange.Advania.GetDocument` | `message-types/documentexchange-advania-getdocument/` |
| `DocumentExchange.Advania.GetDocumentHistory` | `message-types/documentexchange-advania-getdocumenthistory/` |
| `DocumentExchange.Advania.GetDocumentInfo` | `message-types/documentexchange-advania-getdocumentinfo/` |
| `DocumentExchange.Advania.GetDocumentLight` | `message-types/documentexchange-advania-getdocumentlight/` |
| `DocumentExchange.Advania.GetDocumentLines` | `message-types/documentexchange-advania-getdocumentlines/` |
| `DocumentExchange.Advania.GetDocumentPdf` | `message-types/documentexchange-advania-getdocumentpdf/` |
| `DocumentExchange.Advania.GetDocumentSupport` | `message-types/documentexchange-advania-getdocumentsupport/` |
| `DocumentExchange.Advania.GetDocumentTypes` | `message-types/documentexchange-advania-getdocumenttypes/` |
| `DocumentExchange.Advania.GetInbox` | `message-types/documentexchange-advania-getinbox/` |
| `DocumentExchange.Advania.GetPresentation` | `message-types/documentexchange-advania-getpresentation/` |
| `DocumentExchange.Advania.GetSent` | `message-types/documentexchange-advania-getsent/` |
| `DocumentExchange.Advania.GetSessionUrl` | `message-types/documentexchange-advania-getsessionurl/` |
| `DocumentExchange.Advania.GetStatuses` | `message-types/documentexchange-advania-getstatuses/` |
| `DocumentExchange.Advania.GetTradingPartners` | `message-types/documentexchange-advania-gettradingpartners/` |
| `DocumentExchange.Advania.GetUnread` | `message-types/documentexchange-advania-getunread/` |
| `DocumentExchange.Advania.GetUnreadRemittance` | `message-types/documentexchange-advania-getunreadremittance/` |
| `DocumentExchange.Advania.GetUserAccess` | `message-types/documentexchange-advania-getuseraccess/` |
| `DocumentExchange.Advania.GetWebUIUrl` | `message-types/documentexchange-advania-getwebuiurl/` |
| `DocumentExchange.Advania.InboxSince` | `message-types/documentexchange-advania-inboxsince/` |
| `DocumentExchange.Advania.LookupDocument` | `message-types/documentexchange-advania-lookupdocument/` |
| `DocumentExchange.Advania.OcrPdf` | `message-types/documentexchange-advania-ocrpdf/` |
| `DocumentExchange.Advania.StatusSync` | `message-types/documentexchange-advania-statussync/` |
| `DocumentExchange.Advania.SubmitDocument` | `message-types/documentexchange-advania-submitdocument/` |
| `DocumentExchange.Advania.UpdateStatus` | `message-types/documentexchange-advania-updatestatus/` |
| `DocumentExchange.BIS30.CountryCodes` | `message-types/documentexchange-bis30-countrycodes/` |
| `DocumentExchange.BIS30.Currencies` | `message-types/documentexchange-bis30-currencies/` |
| `DocumentExchange.BIS30.DocumentTypeCodes` | `message-types/documentexchange-bis30-documenttypecodes/` |
| `DocumentExchange.BIS30.DocumentTypes` | `message-types/documentexchange-bis30-documenttypes/` |
| `DocumentExchange.BIS30.ElectronicAddressSchemes` | `message-types/documentexchange-bis30-electronicaddressschemes/` |
| `DocumentExchange.BIS30.InvoicedObjectIdentifiers` | `message-types/documentexchange-bis30-invoicedobjectidentifiers/` |
| `DocumentExchange.BIS30.MimeCodes` | `message-types/documentexchange-bis30-mimecodes/` |
| `DocumentExchange.BIS30.ParticipantSchemes` | `message-types/documentexchange-bis30-participantschemes/` |
| `DocumentExchange.BIS30.UnitCodes` | `message-types/documentexchange-bis30-unitcodes/` |
| `DocumentExchange.BIS30.VatCodes` | `message-types/documentexchange-bis30-vatcodes/` |
| `DocumentExchange.InExchange.BuyerLookup` | `message-types/documentexchange-inexchange-buyerlookup/` |
| `DocumentExchange.InExchange.GetDocument` | `message-types/documentexchange-inexchange-getdocument/` |
| `DocumentExchange.InExchange.GetDocumentInfo` | `message-types/documentexchange-inexchange-getdocumentinfo/` |
| `DocumentExchange.InExchange.GetIncoming` | `message-types/documentexchange-inexchange-getincoming/` |
| `DocumentExchange.InExchange.GetOutboundStatus` | `message-types/documentexchange-inexchange-getoutboundstatus/` |
| `DocumentExchange.InExchange.MarkHandled` | `message-types/documentexchange-inexchange-markhandled/` |
| `DocumentExchange.InExchange.SellerLookup` | `message-types/documentexchange-inexchange-sellerlookup/` |
| `DocumentExchange.InExchange.SendDocument` | `message-types/documentexchange-inexchange-senddocument/` |
| `DocumentExchange.UBL.RenderBilling` | `message-types/documentexchange-ubl-renderbilling/` |
| `DocumentExchange.UBL.RenderDespatchAdvice` | `message-types/documentexchange-ubl-renderdespatchadvice/` |
| `DocumentExchange.UBL.RenderOrder` | `message-types/documentexchange-ubl-renderorder/` |
| `DocumentExchange.UBL.RenderStatement` | `message-types/documentexchange-ubl-renderstatement/` |
| `DocumentExchange.Unimaze.AddAttachment` | `message-types/documentexchange-unimaze-addattachment/` |
| `DocumentExchange.Unimaze.CreateGenericMessage` | `message-types/documentexchange-unimaze-creategenericmessage/` |
| `DocumentExchange.Unimaze.CreateInvoice` | `message-types/documentexchange-unimaze-createinvoice/` |
| `DocumentExchange.Unimaze.GetDocument` | `message-types/documentexchange-unimaze-getdocument/` |
| `DocumentExchange.Unimaze.GetDocumentHistory` | `message-types/documentexchange-unimaze-getdocumenthistory/` |
| `DocumentExchange.Unimaze.GetDocumentInfo` | `message-types/documentexchange-unimaze-getdocumentinfo/` |
| `DocumentExchange.Unimaze.GetDocumentOriginal` | `message-types/documentexchange-unimaze-getdocumentoriginal/` |
| `DocumentExchange.Unimaze.GetDocumentSupport` | `message-types/documentexchange-unimaze-getdocumentsupport/` |
| `DocumentExchange.Unimaze.GetDocumentTransformed` | `message-types/documentexchange-unimaze-getdocumenttransformed/` |
| `DocumentExchange.Unimaze.GetInbox` | `message-types/documentexchange-unimaze-getinbox/` |
| `DocumentExchange.Unimaze.GetPartyInfo` | `message-types/documentexchange-unimaze-getpartyinfo/` |
| `DocumentExchange.Unimaze.GetPendingActions` | `message-types/documentexchange-unimaze-getpendingactions/` |
| `DocumentExchange.Unimaze.GetPresentation` | `message-types/documentexchange-unimaze-getpresentation/` |
| `DocumentExchange.Unimaze.GetUnread` | `message-types/documentexchange-unimaze-getunread/` |
| `DocumentExchange.Unimaze.GetValidations` | `message-types/documentexchange-unimaze-getvalidations/` |
| `DocumentExchange.Unimaze.LookupDocument` | `message-types/documentexchange-unimaze-lookupdocument/` |
| `DocumentExchange.Unimaze.RegisterPayment` | `message-types/documentexchange-unimaze-registerpayment/` |
| `DocumentExchange.Unimaze.RegisterRejection` | `message-types/documentexchange-unimaze-registerrejection/` |
| `DocumentExchange.Unimaze.RetryMessage` | `message-types/documentexchange-unimaze-retrymessage/` |
| `DocumentExchange.Unimaze.StatusSync` | `message-types/documentexchange-unimaze-statussync/` |
| `DocumentExchange.Unimaze.SubmitTransaction` | `message-types/documentexchange-unimaze-submittransaction/` |
| `DocumentExchange.Unimaze.SubmitXml` | `message-types/documentexchange-unimaze-submitxml/` |
| `DocumentExchange.Unimaze.UpdateStatus` | `message-types/documentexchange-unimaze-updatestatus/` |

### `Help.*` (1)

| Message type | Page |
| --- | --- |
| `Help.DocumentExchange.Get` | `message-types/help-documentexchange-get/` |

### Other reference pages

| Page | Path |
| --- | --- |
| Object ID map — Cloud Events DocEx to Bifröst | `object-id-map/` |

---

## Related skills

- [bifrost-bc-integration](./bifrost-bc-integration/index.md) — the API itself. Always load this one.
- [bifrost-foundation](./bifrost-foundation.md) — Bifrost Foundation
- [bifrost-iceland](./bifrost-iceland.md) — Bifrost Iceland
- [bifrost-iceland-treasury](./bifrost-iceland-treasury.md) — Bifrost Iceland Treasury
- [bifrost-bragi](./bifrost-bragi.md) — Bifrost Bragi
- [bifrost-hnitbjorg](./bifrost-hnitbjorg.md) — Bifrost Hnitbjorg
- [bifrost-nornir](./bifrost-nornir.md) — Bifrost Nornir
- [bifrost-clockify](./bifrost-clockify.md) — Bifrost Clockify
- [bifrost-subscription-billing](./bifrost-subscription-billing.md) — Bifrost Subscription Billing
## Loading this skill

An agent loads the skill file itself: [SKILL.md](pathname:///skills/bifrost-iceland-docex/SKILL.md).
It is an index: what the app adds, when to load it, and the path of every reference page.

<details>
<summary>The description an agent matches this skill against</summary>

Message types added to the Bifröst API by Bifrost Iceland DocEx. Electronic document exchange for Business Central through Advania, Unimaze and InExchange, with Peppol BIS 3.0 data and UBL rendering. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index of what Iceland DocEx adds — 76 message types across 2 families (DocumentExchange.*, Help.*).

</details>
