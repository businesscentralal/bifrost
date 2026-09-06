---
id: help-documentexchange-get
title: "Help.DocumentExchange.Get"
sidebar_label: "Help.DocumentExchange.Get"
sidebar_position: 76
description: "Request and response contract for the Help.DocumentExchange.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Comprehensive guide to the Document Exchange connector for AI agents and developers.
This connector integrates with Advania (IS e-invoicing) and Unimaze (Peppol access point)
to send and receive electronic documents from Business Central.

---

## Chapter 1 — Receiving Documents

### Workflow: Import incoming invoices to BC

```
Step 1: Discover endpoints
  DocumentExchange.Advania.GetAuthorizedPartners
  → Returns endpoints with can_get_documents flag

Step 2: List unread documents
  DocumentExchange.Advania.GetUnread { "endpointId": "<kennitala>", "take": 50 }
  → Returns { skip, take, count, hasMore, items[] }

Step 3: Import each document
  DocumentExchange.Advania.GetDocument { "messageId": "<uuid>", "format": "xml", "createIncomingDocument": true }
  → Returns { incomingDocumentEntryNo, messageId }

Step 4: Confirm receipt
  DocumentExchange.Advania.UpdateStatus { "messageId": "<uuid>", "status": 3, "comment": "Imported" }
  → Document removed from GetUnread after this
```

### Advania receiving types

| Type | Purpose | Key parameters |
|---|---|---|
| `DocumentExchange.Advania.GetUnread` | List pending documents | endpointId, skip, take |
| `DocumentExchange.Advania.GetDocument` | Download XML + optional BC import | messageId, format, createIncomingDocument |
| `DocumentExchange.Advania.GetDocumentInfo` | Metadata without downloading XML | messageId |
| `DocumentExchange.Advania.GetDocumentLines` | Parsed invoice lines | messageId |
| `DocumentExchange.Advania.GetAttachments` | Embedded attachments (PDF, etc.) | messageId |
| `DocumentExchange.Advania.GetDocumentLight` | Lightweight document preview | messageId |
| `DocumentExchange.Advania.GetDocumentPdf` | PDF rendering of document | messageId |
| `DocumentExchange.Advania.GetInbox` | Full inbox history (read + unread) | endpointId, skip, take, dateFrom, dateTo |
| `DocumentExchange.Advania.InboxSince` | Inbox changes since timestamp | endpointId, since |
| `DocumentExchange.Advania.GetSent` | Sent documents history | endpointId, skip, take |
| `DocumentExchange.Advania.GetUnreadRemittance` | Unread remittance advices | endpointId |

### Unimaze receiving types

| Type | Purpose | Key parameters |
|---|---|---|
| `DocumentExchange.Unimaze.GetUnread` | List pending documents | skip, take |
| `DocumentExchange.Unimaze.GetDocument` | Download XML + optional BC import | messageId, format, createIncomingDocument |
| `DocumentExchange.Unimaze.GetDocumentInfo` | Metadata | messageId |
| `DocumentExchange.Unimaze.GetDocumentHistory` | Status history of a document | messageId |
| `DocumentExchange.Unimaze.GetInbox` | Full inbox history | skip, take, dateFrom, dateTo |
| `DocumentExchange.Unimaze.GetDocumentOriginal` | Original XML as received | messageId |
| `DocumentExchange.Unimaze.GetDocumentTransformed` | Transformed/normalized XML | messageId |
| `DocumentExchange.Unimaze.GetPendingActions` | Documents requiring action | (none) |

### Decision logic

- If `createIncomingDocument: true` returns an entry number → document is in BC, proceed to UpdateStatus
- If GetDocument fails → do NOT call UpdateStatus (document stays unread for retry)
- Use `from_ean` filtering in results to process documents from a specific sender
- Page through results with skip/take when count > take

### InExchange receiving types

| Type | Purpose | Key parameters |
|---|---|---|
| `DocumentExchange.InExchange.GetIncoming` | List incoming documents | skip, take, status |
| `DocumentExchange.InExchange.GetDocument` | Download XML + optional BC import | messageId, createIncomingDocument |
| `DocumentExchange.InExchange.GetDocumentInfo` | Document metadata | messageId |
| `DocumentExchange.InExchange.MarkHandled` | Mark document as processed | messageId |
| `DocumentExchange.InExchange.SellerLookup` | Lookup seller registration | sellerId |

## Chapter 2 — Sending Documents

### Workflow: Send an e-invoice

```
Step 1: Verify recipient can receive
  DocumentExchange.Advania.GetDocumentSupport { "recipientId": "<kennitala>" }
  → Returns supported document types for that recipient

Step 2a: Submit existing XML
  DocumentExchange.Advania.SubmitDocument { "xml": "<base64>", "recipientId": "...", "senderEndpointId": "..." }
  → Returns { messageId, status }

Step 2b: Create from JSON (alternative)
  DocumentExchange.Advania.CreateInvoice { invoiceData... }
  → Builds UBL XML and submits in one call
```

### Advania sending types

| Type | Purpose | Key parameters |
|---|---|---|
| `DocumentExchange.Advania.SubmitDocument` | Send pre-built XML | xml (base64), recipientId, senderEndpointId |
| `DocumentExchange.Advania.CreateInvoice` | Build + send from JSON | invoiceData object |
| `DocumentExchange.Advania.GetDocumentSupport` | Check what a recipient accepts | recipientId |
| `DocumentExchange.Advania.GetTradingPartners` | List all known trading partners | (none) |
| `DocumentExchange.Advania.GetAuthorizedPartners` | Your authorized send/receive endpoints | (none) |
| `DocumentExchange.Advania.ConvertXml` | Transform XML between standards | xml (base64), fromStandard, toStandard |

### Unimaze sending types

| Type | Purpose | Key parameters |
|---|---|---|
| `DocumentExchange.Unimaze.SubmitTransaction` | Send document | xml (base64), recipientId, documentType |
| `DocumentExchange.Unimaze.CreateInvoice` | Build + send from JSON | invoiceData object |
| `DocumentExchange.Unimaze.AddAttachment` | Attach file to a sent document | messageId, attachment (base64), filename |
| `DocumentExchange.Unimaze.GetDocumentSupport` | Check recipient capabilities | recipientId |
| `DocumentExchange.Unimaze.GetPartyInfo` | Lookup party registration details | partyId |
| `DocumentExchange.Unimaze.CreateGenericMessage` | Send non-invoice document | messageData object |
| `DocumentExchange.Unimaze.GetValidations` | Validate document before sending | messageId |
| `DocumentExchange.Unimaze.RetryMessage` | Retry a failed send | messageId |
| `DocumentExchange.Unimaze.RegisterPayment` | Register payment against received invoice | messageId, paymentData |
| `DocumentExchange.Unimaze.RegisterRejection` | Reject a received document | messageId, reason |

### InExchange sending types

| Type | Purpose | Key parameters |
|---|---|---|
| `DocumentExchange.InExchange.SendDocument` | Send pre-built XML | xml (base64), recipientId |
| `DocumentExchange.InExchange.GetOutboundStatus` | Check delivery status of sent document | messageId |
| `DocumentExchange.InExchange.BuyerLookup` | Check if a buyer can receive e-invoices | buyerId |

## Chapter 3 — UBL Document Rendering

Render BC documents into Peppol BIS 3.0 compliant UBL XML locally (no external API call).

| Type | BC Source | UBL Output |
|---|---|---|
| `DocumentExchange.UBL.RenderBilling` | Posted Sales Invoice / Credit Memo | UBL Invoice 2.1 or CreditNote 2.1 |
| `DocumentExchange.UBL.RenderOrder` | Sales Order | UBL Order 2.1 |
| `DocumentExchange.UBL.RenderDespatchAdvice` | Posted Sales Shipment | UBL DespatchAdvice 2.1 |
| `DocumentExchange.UBL.RenderStatement` | Customer Statement | UBL Statement 2.1 |

### Usage pattern

```
DocumentExchange.UBL.RenderBilling { "documentNo": "PSI-001234", "store": "response" }
→ Returns { xml: "<base64 UBL XML>", standard: "BIS3", documentType: "Invoice" }
```

**Store options:** `response` (return in JSON), `blob` (attach to document), `both`.

### Combine with sending

```
1. DocumentExchange.UBL.RenderBilling { "documentNo": "PSI-001234", "store": "response" }
2. DocumentExchange.Advania.SubmitDocument { "xml": "<rendered xml>", "recipientId": "..." }
```

## Chapter 4 — BIS 3.0 Reference Data

Static code list lookups for Peppol BIS Billing 3.0. No authentication required.
Use these to validate codes before rendering UBL or to populate dropdowns.

| Type | Returns | Use case |
|---|---|---|
| `DocumentExchange.BIS30.CountryCodes` | ISO 3166-1 alpha-2 codes | Validate country in addresses |
| `DocumentExchange.BIS30.Currencies` | ISO 4217 currency codes | Validate currency on invoices |
| `DocumentExchange.BIS30.DocumentTypeCodes` | UNCL 1001 subset | documentTypeCode field |
| `DocumentExchange.BIS30.DocumentTypes` | Invoice, CreditNote, etc. | Root document type |
| `DocumentExchange.BIS30.ElectronicAddressSchemes` | EAS codes (0007, 0196, etc.) | endpointID schemeID |
| `DocumentExchange.BIS30.InvoicedObjectIdentifiers` | UNCL 7143 codes | Item classification |
| `DocumentExchange.BIS30.MimeCodes` | IANA MIME types | Attachment mimeCode |
| `DocumentExchange.BIS30.ParticipantSchemes` | ICD codes for party identification | Party/PartyIdentification |
| `DocumentExchange.BIS30.UnitCodes` | UN/ECE Rec 20 codes | InvoicedQuantity@unitCode |
| `DocumentExchange.BIS30.VatCodes` | UNCL 5305 duty/tax codes | TaxCategory/ID |

### Usage pattern

```
DocumentExchange.BIS30.CountryCodes {}
→ Returns { items: [{ code: "IS", name: "Iceland" }, ...] }
```

All BIS30 types accept optional `filter` parameter to search by code or name.

## Chapter 5 — Status Management

### Individual status update

```
DocumentExchange.Advania.UpdateStatus { "messageId": "<uuid>", "status": 3, "comment": "Processed" }
DocumentExchange.Unimaze.UpdateStatus { "messageId": "<id>", "status": 3, "comment": "Processed" }
```

**Status codes:** 1 = Unread, 2 = Read, 3 = Delivered/Processed, 4 = Error, 5 = Rejected

### Bulk status synchronization

```
DocumentExchange.Advania.StatusSync {}
DocumentExchange.Unimaze.StatusSync {}
```

Synchronizes all pending status changes between BC and the exchange in one call.
Prefer StatusSync over individual UpdateStatus calls when processing multiple documents.

### Document lookup and history

| Type | Purpose |
|---|---|
| `DocumentExchange.Advania.LookupDocument` | Find document by reference/number |
| `DocumentExchange.Advania.GetDocumentHistory` | Full status change timeline |
| `DocumentExchange.Advania.GetStatuses` | Available status codes and meanings |
| `DocumentExchange.Unimaze.LookupDocument` | Find document by reference/number |
| `DocumentExchange.Unimaze.GetDocumentHistory` | Full status change timeline |

### Presentation and UI

| Type | Purpose |
|---|---|
| `DocumentExchange.Advania.GetPresentation` | URL to view document in browser |
| `DocumentExchange.Advania.GetWebUIUrl` | URL to the Advania web portal |
| `DocumentExchange.Advania.GetSessionUrl` | Authenticated session URL |
| `DocumentExchange.Unimaze.GetPresentation` | URL to view document in browser |

## Chapter 6 — Setup

### Prerequisites

1. **Bifrost Setup** → Document Exchange section:
   - Advania: set API Key and Endpoint URL
   - Unimaze: set API Key and Endpoint URL
2. **Extension Management** → Allow HttpClient Requests on "Bifrost Iceland DocEx"
3. **Endpoint allowlists:** Advania API endpoint and Unimaze API endpoint
4. **For UBL rendering:** No external setup needed (local XML generation)
5. **For BIS30 lookups:** No setup needed (built-in reference data)

### Connector selection

A company typically uses ONE connector (Advania, InExchange, or Unimaze), not both.
Check which one is configured in Bifrost Setup before calling message types.

### Permissions

Users need the `BIFROST Full ori` permission set to call document exchange message types.
BIS30 and UBL types require no special permissions beyond base Bifrost access.

## Chapter 7 — Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "outbound HTTP call blocked" | HttpClient not allowed | Extension Management → Allow HttpClient Requests |
| 401 Unauthorized | Invalid or expired API key | Update API key in Bifrost Setup |
| "sending is disabled" | Send gate off in setup | Enable Document Exchange sending in Bifrost Setup |
| "receiving is disabled" | Receive gate off in setup | Enable Document Exchange receiving in Bifrost Setup |
| "no credentials configured" | Missing connector setup | Configure the connector (Advania or Unimaze) in Bifrost Setup |
| GetUnread returns empty | All documents already delivered | Check GetInbox for full history, or verify endpointId |
| UBL render returns error | Missing required fields on BC document | Check Company Information (VAT, address) and customer data |

### Request log

All API calls are logged in the Bifrost Request Log.
Check the log for HTTP status codes, timestamps, and full request/response bodies.

### Advania-specific utilities

| Type | Purpose |
|---|---|
| `DocumentExchange.Advania.GetUserAccess` | Check your API access level and permissions |
| `DocumentExchange.Advania.GetDocumentTypes` | List document types your endpoints support |
| `DocumentExchange.Advania.CheckUniversalService` | Check if recipient accepts via universal service |
| `DocumentExchange.Advania.CompressPdf` | Compress a PDF attachment |
| `DocumentExchange.Advania.OcrPdf` | OCR a scanned PDF document |

## Chapter 8 — G/L Journal Posting from Incoming Documents

Incoming documents can be posted directly to a General Journal instead of creating
a Purchase Invoice. This is controlled per-vendor via the **Posting Mode** field.

### Setup

1. **Vendor Card → Incoming Doc. Posting Mode**: Set to "G/L Journal"
2. **Vendor VAT G/L Account Map**: Map VAT percentages to G/L Accounts for that vendor
   - Each row maps a VAT % → G/L Account No.
   - VAT % is auto-calculated from the vendor's VAT Bus. Posting Group + the G/L Account's VAT Prod. Posting Group
   - A 0% row acts as a fallback for unmatched VAT rates
3. **Incoming Documents Setup**: Configure General Journal Template Name and Batch Name

### How it works (auto-aggregation)

When `Incoming.Document.Process` is called for a vendor in G/L Journal mode:

```
1. Pre-map resolves vendor by Registration Number / GLN / VAT Reg No.
2. Detects G/L Journal posting mode → sets Document Type = Journal
3. VAT GL Resolver maps each XML line's tax % → G/L Account
4. Lines are aggregated by G/L Account into Posting Instructions
5. A vendor balancing entry is added (last line, negative amount)
6. Codeunit 1224 creates Gen. Journal Lines from the instructions
```

### Pre-seeded posting instructions (MCP workflow)

You can bypass auto-aggregation by writing posting instructions BEFORE processing.
This allows custom splits, bank account balancing (credit cards), or manual overrides.

```
Step 1: Create incoming document
  Incoming.Document.Create { "fileName": "invoice.xml", "content": "<base64>" }
  → Returns { entryNo: 123 }

Step 2: Write posting instructions
  Data.Records.Set { "table": "DocEx Inc.Doc. Post Instr ori", "data": [
    { "primaryKey": { "IncomingDocumentEntryNo_": "123", "LineNo_": "10000" },
      "fields": { "AccountType": "G/L Account", "AccountNo_": "8110",
                   "Description": "Office supplies", "Amount": "5000" } },
    { "primaryKey": { "IncomingDocumentEntryNo_": "123", "LineNo_": "20000" },
      "fields": { "AccountType": "Bank Account", "AccountNo_": "VISA",
                   "Description": "Credit card", "Amount": "-5000" } }
  ]}

Step 3: Process
  Incoming.Document.Process { "subject": "123" }
  → Instructions found → skips auto-aggregation → creates journal from your instructions
```

### Posting instruction fields

| Field | Type | Description |
|---|---|---|
| Incoming Document Entry No. | Integer | Links to the incoming document |
| Line No. | Integer | Ordering (10000, 20000, ...) |
| Account Type | Enum | G/L Account, Vendor, Customer, Bank Account |
| Account No. | Code[20] | The account number |
| Description | Text[100] | Journal line description |
| Amount | Decimal | Net amount (positive = debit, negative = credit) |
| Reversed | Boolean | If true, ignored by processing (used for history) |

### Credit memo handling

For credit memos (InvoiceTypeCode = 381), the sign is automatically reversed:
- G/L Account lines get negative amounts
- Vendor balancing line gets positive amount

### Lifecycle

- Instructions are **deleted** when processing succeeds (status = Created)
- Instructions are **deleted** when the incoming document is deleted
- Set `Reversed = true` to mark old instructions as superseded without deleting
- Only `Reversed = false` instructions are used during processing

### Key rules

1. **Amounts are net** — BC applies VAT decomposition based on the G/L Account's posting setup
2. **Instructions must balance** — total of all lines should be zero (debits = credits)
3. **Pre-seeded = no override** — if non-reversed instructions exist, auto-aggregation is skipped entirely
4. **Vendor is optional** — you can use Bank Account as the balancing entry (credit card workflow)
5. **VAT G/L Map is per-vendor** — different vendors can map to different G/L Accounts

