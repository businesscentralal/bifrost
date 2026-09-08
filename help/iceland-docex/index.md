---
id: index
title: "Bifröst Iceland DocEx — Help"
sidebar_label: "Bifröst Iceland DocEx — Help"
sidebar_position: 1
slug: /
---

**Bifrost Iceland DocEx** connects Business Central to electronic document exchange networks. Send and receive invoices, orders, and other business documents through Advania, Unimaze, and InExchange, look up Peppol BIS 3.0 reference data, and render UBL 2.1 XML — all through the Bifrost message API.

The extension adds 76 message types. Each one is self-documenting: submit `Help.DocumentExchange.Get` with the message type name as the subject to receive its request and response contract in Markdown.

## Table of Contents

-   [Getting Started](#getting-started)
-   [DocEx Setup](/help/iceland-docex/docex-setup/) — provider environments and credentials
-   [BIS 3.0 Reference Data](#bis30) — 10 message types
-   [Advania](#advania) — 30 message types
-   [Unimaze](#unimaze) — 23 message types
-   [InExchange](#inexchange) — 8 message types
-   [UBL Rendering](#ubl) — 4 message types
-   [Help](#help)
-   [Error Handling](#errors)
-   [Support](#support)

## Getting Started {#getting-started}

The extension requires **Bifrost Foundation** to be installed. After installation, enter your provider credentials on the Bifröst Setup page.

1.  Choose the search icon, enter **Bifröst Setup**, and choose the related link.
2.  In the **Apps** group, choose **Bifrost Iceland DocEx Setup** to open [Bifröst DocEx Setup](/help/iceland-docex/docex-setup/).
3.  Set the **Environment** (Live or Test) for each provider you use.
4.  Enter the provider credentials with the **Set …** actions: username and password for Advania, username and password or API key for Unimaze, API key and client token for InExchange. The values go into the Bifröst secret store and are never displayed again — the page shows only a credential status.
5.  Choose **Test … Connection** for each provider and confirm it succeeds.
6.  Choose **Update BII Data Exchange Definitions** if you import incoming documents. This recreates the `BIIINVOICE` and `BIICREDITMEMO` definitions.
7.  Use the Bifrost Queue API to submit document exchange requests, and retrieve the results from the Bifrost Data API.

**Upgrading from Origo Cloud Events DocEx?** Install Bifrost Iceland DocEx beside it. Your code maps and VAT G/L account maps are copied automatically, but Business Central keeps stored credentials separate per extension, so you must enter the provider credentials again.

## BIS 3.0 Reference Data {#bis30}

Built-in Peppol BIS 3.0 reference data is available without external credentials. Use these message types to look up standard codes for electronic documents.

| Message Type | Description |
| --- | --- |
| DocumentExchange.BIS30.CountryCodes | ISO country codes for Peppol documents |
| DocumentExchange.BIS30.Currencies | Currency codes |
| DocumentExchange.BIS30.DocumentTypeCodes | Document type identifiers (380=Invoice, 381=Credit Note, etc.) |
| DocumentExchange.BIS30.DocumentTypes | Document type descriptions |
| DocumentExchange.BIS30.ElectronicAddressSchemes | Electronic address scheme identifiers (EAS) |
| DocumentExchange.BIS30.InvoicedObjectIdentifiers | Invoiced object identifier scheme codes |
| DocumentExchange.BIS30.MimeCodes | MIME type codes for attachments |
| DocumentExchange.BIS30.ParticipantSchemes | Participant identifier schemes |
| DocumentExchange.BIS30.UnitCodes | Unit of measure codes (UN/ECE Rec 20) |
| DocumentExchange.BIS30.VatCodes | VAT category codes |

## Advania {#advania}

Advania is Iceland's primary document exchange platform. The following message types are available for receiving, sending, and managing electronic documents through Advania.

### Receive Documents

| Message Type | Description |
| --- | --- |
| DocumentExchange.Advania.GetUnread | Get list of unread documents |
| DocumentExchange.Advania.GetDocument | Get full document content by ID |
| DocumentExchange.Advania.GetDocumentInfo | Get document metadata |
| DocumentExchange.Advania.GetDocumentLines | Get document line items |
| DocumentExchange.Advania.GetAttachments | Get document attachments |
| DocumentExchange.Advania.GetDocumentHistory | Get document status history |

### Status Management

| Message Type | Description |
| --- | --- |
| DocumentExchange.Advania.UpdateStatus | Update status of a document |
| DocumentExchange.Advania.StatusSync | Synchronize statuses for all tracked documents |
| DocumentExchange.Advania.GetStatuses | Get available status values |

### Send Documents

| Message Type | Description |
| --- | --- |
| DocumentExchange.Advania.SubmitDocument | Submit a document for delivery |
| DocumentExchange.Advania.CreateInvoice | Create and send an invoice from BC data |

### Mailbox Queries

| Message Type | Description |
| --- | --- |
| DocumentExchange.Advania.GetInbox | Get inbox document list |
| DocumentExchange.Advania.GetSent | Get sent document list |
| DocumentExchange.Advania.InboxSince | Get inbox documents since a date |

### Partner Lookup

| Message Type | Description |
| --- | --- |
| DocumentExchange.Advania.GetTradingPartners | Get registered trading partners |
| DocumentExchange.Advania.GetAuthorizedPartners | Get partners authorized to send documents |

### Document Retrieval

| Message Type | Description |
| --- | --- |
| DocumentExchange.Advania.LookupDocument | Look up a document by reference |
| DocumentExchange.Advania.GetDocumentPdf | Get document as PDF |
| DocumentExchange.Advania.GetPresentation | Get formatted document presentation |

### User and UI Access

| Message Type | Description |
| --- | --- |
| DocumentExchange.Advania.GetUserAccess | Get user access information |
| DocumentExchange.Advania.GetWebUIUrl | Get URL for web interface |
| DocumentExchange.Advania.GetSessionUrl | Get authenticated session URL |

### Document Processing

| Message Type | Description |
| --- | --- |
| DocumentExchange.Advania.ConvertXml | Convert XML between formats |
| DocumentExchange.Advania.CompressPdf | Compress a PDF document |
| DocumentExchange.Advania.OcrPdf | Run OCR on a PDF document |

### Additional Services

| Message Type | Description |
| --- | --- |
| DocumentExchange.Advania.CheckUniversalService | Check universal service availability |
| DocumentExchange.Advania.GetDocumentSupport | Get supported document types for a partner |
| DocumentExchange.Advania.GetDocumentTypes | Get all available document types |
| DocumentExchange.Advania.GetDocumentLight | Get lightweight document summary |
| DocumentExchange.Advania.GetUnreadRemittance | Get unread remittance advices |

## Unimaze {#unimaze}

Unimaze is a Nordic document exchange network supporting electronic invoicing across Scandinavia.

### Receive Documents

| Message Type | Description |
| --- | --- |
| DocumentExchange.Unimaze.GetUnread | Get unread documents |
| DocumentExchange.Unimaze.GetDocument | Get full document by ID |
| DocumentExchange.Unimaze.GetDocumentInfo | Get document metadata |
| DocumentExchange.Unimaze.GetDocumentHistory | Get document history |

### Status Management

| Message Type | Description |
| --- | --- |
| DocumentExchange.Unimaze.UpdateStatus | Update document status |
| DocumentExchange.Unimaze.StatusSync | Synchronize document statuses |

### Send Documents

| Message Type | Description |
| --- | --- |
| DocumentExchange.Unimaze.CreateInvoice | Create and send an invoice |
| DocumentExchange.Unimaze.SubmitTransaction | Submit a transaction |
| DocumentExchange.Unimaze.SubmitXml | Submit raw XML document |

### Queries

| Message Type | Description |
| --- | --- |
| DocumentExchange.Unimaze.GetInbox | Get inbox contents |
| DocumentExchange.Unimaze.LookupDocument | Look up document by reference |
| DocumentExchange.Unimaze.GetPresentation | Get document presentation |
| DocumentExchange.Unimaze.GetPartyInfo | Get party/partner information |

### Operations

| Message Type | Description |
| --- | --- |
| DocumentExchange.Unimaze.AddAttachment | Add attachment to a document |
| DocumentExchange.Unimaze.GetValidations | Get validation results |
| DocumentExchange.Unimaze.RetryMessage | Retry a failed message |

### Workflow

| Message Type | Description |
| --- | --- |
| DocumentExchange.Unimaze.RegisterPayment | Register payment for a document |
| DocumentExchange.Unimaze.RegisterRejection | Register document rejection |
| DocumentExchange.Unimaze.GetPendingActions | Get actions pending user decision |

### Additional

| Message Type | Description |
| --- | --- |
| DocumentExchange.Unimaze.CreateGenericMessage | Create a generic message |
| DocumentExchange.Unimaze.GetDocumentOriginal | Get original document file |
| DocumentExchange.Unimaze.GetDocumentTransformed | Get transformed document |
| DocumentExchange.Unimaze.GetDocumentSupport | Get supported document types |

## InExchange {#inexchange}

InExchange is a Swedish electronic invoicing network used across the Nordics.

### Receive Documents

| Message Type | Description |
| --- | --- |
| DocumentExchange.InExchange.GetIncoming | Get incoming documents |
| DocumentExchange.InExchange.GetDocument | Get full document by ID |
| DocumentExchange.InExchange.GetDocumentInfo | Get document metadata |

### Status and Send

| Message Type | Description |
| --- | --- |
| DocumentExchange.InExchange.MarkHandled | Mark document as handled |
| DocumentExchange.InExchange.SendDocument | Send a document |
| DocumentExchange.InExchange.GetOutboundStatus | Track outbound document status |

### Partner Discovery

| Message Type | Description |
| --- | --- |
| DocumentExchange.InExchange.BuyerLookup | Look up a buyer in the network |
| DocumentExchange.InExchange.SellerLookup | Look up a seller in the network |

## UBL Rendering {#ubl}

Generate standards-compliant UBL 2.1 XML documents directly from Business Central data. No external credentials are required.

| Message Type | Description |
| --- | --- |
| DocumentExchange.UBL.RenderBilling | Render invoice or credit note as UBL XML |
| DocumentExchange.UBL.RenderOrder | Render order as UBL XML |
| DocumentExchange.UBL.RenderDespatchAdvice | Render despatch advice as UBL XML |
| DocumentExchange.UBL.RenderStatement | Render statement as UBL XML |

## Help {#help}

| Message Type | Description |
| --- | --- |
| Help.DocumentExchange.Get | Get help documentation for document exchange message types |

## Error Handling {#errors}

When a provider operation fails (authentication error, network issue, invalid request), the response contains a structured JSON error object with:

-   **error** — error code or type
-   **message** — human-readable description
-   **provider** — which provider returned the error
-   **callStack** — AL call stack (when available)

Check the `Message ori` status field for task completion state.

## Support {#support}

For assistance, contact [Origo](https://www.origo.is/).
