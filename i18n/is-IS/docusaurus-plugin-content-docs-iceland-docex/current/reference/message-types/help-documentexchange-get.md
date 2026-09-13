---
id: help-documentexchange-get
title: "Help.DocumentExchange.Get"
sidebar_label: "Help.DocumentExchange.Get"
sidebar_position: 76
description: "Beiðni- og svarsamningur fyrir Help.DocumentExchange.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Comprehensive guide til the skjal Exchange connector fyrir AI agents og developers.
This connector integrates með Advania (er e-invoicing) og Unimaze (Peppol access point)
til send og receive electronic skjöl frá Business Central.

---

## Chapter 1 — Receiving skjöl

### Verkflæði: Import incoming invoices til BC

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

| Gerð | Tilgangur | Key parameters |
|---|---|---|
| `DocumentExchange.Advania.GetUnread` | Listi pending skjöl | endpointId, skip, take |
| `DocumentExchange.Advania.GetDocument` | Download XML + valfrjálst BC import | messageId, format, createIncomingDocument |
| `DocumentExchange.Advania.GetDocumentInfo` | Metadata without downloading XML | messageId |
| `DocumentExchange.Advania.GetDocumentLines` | Parsed invoice lines | messageId |
| `DocumentExchange.Advania.GetAttachments` | Embedded attachments (PDF, etc.) | messageId |
| `DocumentExchange.Advania.GetDocumentLight` | Lightweight skjal preview | messageId |
| `DocumentExchange.Advania.GetDocumentPdf` | PDF rendering of skjal | messageId |
| `DocumentExchange.Advania.GetInbox` | fulla inbox history (read + unread) | endpointId, skip, take, dateFrom, dateTo |
| `DocumentExchange.Advania.InboxSince` | Inbox changes since timestamp | endpointId, since |
| `DocumentExchange.Advania.GetSent` | Sent skjöl history | endpointId, skip, take |
| `DocumentExchange.Advania.GetUnreadRemittance` | Unread remittance advices | endpointId |

### Unimaze receiving types

| Gerð | Tilgangur | Key parameters |
|---|---|---|
| `DocumentExchange.Unimaze.GetUnread` | Listi pending skjöl | skip, take |
| `DocumentExchange.Unimaze.GetDocument` | Download XML + valfrjálst BC import | messageId, format, createIncomingDocument |
| `DocumentExchange.Unimaze.GetDocumentInfo` | Metadata | messageId |
| `DocumentExchange.Unimaze.GetDocumentHistory` | Status history of a skjal | messageId |
| `DocumentExchange.Unimaze.GetInbox` | fulla inbox history | skip, take, dateFrom, dateTo |
| `DocumentExchange.Unimaze.GetDocumentOriginal` | Original XML as received | messageId |
| `DocumentExchange.Unimaze.GetDocumentTransformed` | Transformed/normalized XML | messageId |
| `DocumentExchange.Unimaze.GetPendingActions` | skjöl requiring action | (none) |

### Decision logic

- Ef `createIncomingDocument: true` Skilar an entry number → skjal er in BC, proceed til UpdateStatus
- Ef GetDocument fails → do NOT Kallaðu á UpdateStatus (skjal stays unread fyrir retry)
- Notaðu `from_ean` filtering in results til process skjöl frá a specific sender
- Page through results með skip/take Þegar count > take

### InExchange receiving types

| Gerð | Tilgangur | Key parameters |
|---|---|---|
| `DocumentExchange.InExchange.GetIncoming` | Listi incoming skjöl | skip, take, status |
| `DocumentExchange.InExchange.GetDocument` | Download XML + valfrjálst BC import | messageId, createIncomingDocument |
| `DocumentExchange.InExchange.GetDocumentInfo` | skjal metadata | messageId |
| `DocumentExchange.InExchange.MarkHandled` | Mark skjal as processed | messageId |
| `DocumentExchange.InExchange.SellerLookup` | Lookup seller registration | sellerId |

## Chapter 2 — Sending skjöl

### Verkflæði: Send an e-invoice

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

| Gerð | Tilgangur | Key parameters |
|---|---|---|
| `DocumentExchange.Advania.SubmitDocument` | Send pre-built XML | xml (base64), recipientId, senderEndpointId |
| `DocumentExchange.Advania.CreateInvoice` | Build + send frá JSON | invoiceData object |
| `DocumentExchange.Advania.GetDocumentSupport` | Check what a recipient accepts | recipientId |
| `DocumentExchange.Advania.GetTradingPartners` | Listi Allt known trading partners | (none) |
| `DocumentExchange.Advania.GetAuthorizedPartners` | Your authorized send/receive endpoints | (none) |
| `DocumentExchange.Advania.ConvertXml` | Transform XML between standards | xml (base64), fromStandard, toStandard |

### Unimaze sending types

| Gerð | Tilgangur | Key parameters |
|---|---|---|
| `DocumentExchange.Unimaze.SubmitTransaction` | Send skjal | xml (base64), recipientId, documentType |
| `DocumentExchange.Unimaze.CreateInvoice` | Build + send frá JSON | invoiceData object |
| `DocumentExchange.Unimaze.AddAttachment` | Attach file til a sent skjal | messageId, attachment (base64), filename |
| `DocumentExchange.Unimaze.GetDocumentSupport` | Check recipient capabilities | recipientId |
| `DocumentExchange.Unimaze.GetPartyInfo` | Lookup party registration details | partyId |
| `DocumentExchange.Unimaze.CreateGenericMessage` | Send non-invoice skjal | messageData object |
| `DocumentExchange.Unimaze.GetValidations` | Validate skjal áður en sending | messageId |
| `DocumentExchange.Unimaze.RetryMessage` | Retry a failed send | messageId |
| `DocumentExchange.Unimaze.RegisterPayment` | Register greiðsla against received invoice | messageId, paymentData |
| `DocumentExchange.Unimaze.RegisterRejection` | Reject a received skjal | messageId, reason |

### InExchange sending types

| Gerð | Tilgangur | Key parameters |
|---|---|---|
| `DocumentExchange.InExchange.SendDocument` | Send pre-built XML | xml (base64), recipientId |
| `DocumentExchange.InExchange.GetOutboundStatus` | Check delivery status of sent skjal | messageId |
| `DocumentExchange.InExchange.BuyerLookup` | Check Ef a buyer getur receive e-invoices | buyerId |

## Chapter 3 — UBL skjal Rendering

Render BC skjöl í Peppol BIS 3.0 compliant UBL XML locally (no external API Kallaðu á).

| Gerð | BC Source | UBL Output |
|---|---|---|
| `DocumentExchange.UBL.RenderBilling` | Posted Sales Invoice / Credit Memo | UBL Invoice 2.1 eða CreditNote 2.1 |
| `DocumentExchange.UBL.RenderOrder` | Sales Order | UBL Order 2.1 |
| `DocumentExchange.UBL.RenderDespatchAdvice` | Posted Sales Shipment | UBL DespatchAdvice 2.1 |
| `DocumentExchange.UBL.RenderStatement` | viðskiptavinur Statement | UBL Statement 2.1 |

### Usage pattern

```
DocumentExchange.UBL.RenderBilling { "documentNo": "PSI-001234", "store": "response" }
→ Returns { xml: "<base64 UBL XML>", standard: "BIS3", documentType: "Invoice" }
```

**Store options:** `response` (return in JSON), `blob` (attach til skjal), `both`.

### Combine með sending

```
1. DocumentExchange.UBL.RenderBilling { "documentNo": "PSI-001234", "store": "response" }
2. DocumentExchange.Advania.SubmitDocument { "xml": "<rendered xml>", "recipientId": "..." }
```

## Chapter 4 — BIS 3.0 Reference Data

Static code Listi lookups fyrir Peppol BIS Billing 3.0. No authentication nauðsynlegt.
Notaðu these til validate codes áður en rendering UBL eða til populate dropdowns.

| Gerð | Skilar | Notaðu case |
|---|---|---|
| `DocumentExchange.BIS30.CountryCodes` | ISO 3166-1 alpha-2 codes | Validate country in addresses |
| `DocumentExchange.BIS30.Currencies` | ISO 4217 currency codes | Validate currency on invoices |
| `DocumentExchange.BIS30.DocumentTypeCodes` | UNCL 1001 subset | documentTypeCode Reitur |
| `DocumentExchange.BIS30.DocumentTypes` | Invoice, CreditNote, etc. | Root skjal Gerð |
| `DocumentExchange.BIS30.ElectronicAddressSchemes` | EAS codes (0007, 0196, etc.) | endpointID schemeID |
| `DocumentExchange.BIS30.InvoicedObjectIdentifiers` | UNCL 7143 codes | Item classification |
| `DocumentExchange.BIS30.MimeCodes` | IANA MIME types | Attachment mimeCode |
| `DocumentExchange.BIS30.ParticipantSchemes` | ICD codes fyrir party identification | Party/PartyIdentification |
| `DocumentExchange.BIS30.UnitCodes` | UN/ECE Rec 20 codes | InvoicedQuantity@unitCode |
| `DocumentExchange.BIS30.VatCodes` | UNCL 5305 duty/tax codes | TaxCategory/ID |

### Usage pattern

```
DocumentExchange.BIS30.CountryCodes {}
→ Returns { items: [{ code: "IS", name: "Iceland" }, ...] }
```

Allt BIS30 types accept valfrjálst `filter` parameter til search by code eða Heiti.

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

Samstillir Allt pending status changes between BC og the exchange in one Kallaðu á.
Prefer StatusSync over individual UpdateStatus calls Þegar processing multiple skjöl.

### skjal lookup og history

| Gerð | Tilgangur |
|---|---|
| `DocumentExchange.Advania.LookupDocument` | Find skjal by reference/number |
| `DocumentExchange.Advania.GetDocumentHistory` | fulla status change timeline |
| `DocumentExchange.Advania.GetStatuses` | Available status codes og meanings |
| `DocumentExchange.Unimaze.LookupDocument` | Find skjal by reference/number |
| `DocumentExchange.Unimaze.GetDocumentHistory` | fulla status change timeline |

### Presentation og UI

| Gerð | Tilgangur |
|---|---|
| `DocumentExchange.Advania.GetPresentation` | URL til view skjal in browser |
| `DocumentExchange.Advania.GetWebUIUrl` | URL til the Advania web portal |
| `DocumentExchange.Advania.GetSessionUrl` | Authenticated session URL |
| `DocumentExchange.Unimaze.GetPresentation` | URL til view skjal in browser |

## Chapter 6 — Setup

### Prerequisites

1. **Bifrost Setup** → skjal Exchange section:
   - Advania: set API Key og Endapunktur URL
   - Unimaze: set API Key og Endapunktur URL
2. **Extension Management** → Allow HttpClient Requests on "Bifrost Iceland DocEx"
3. **Endapunktur allowlists:** Advania API-endapunktur og Unimaze API-endapunktur
4. **fyrir UBL rendering:** No external setup needed (local XML generation)
5. **fyrir BIS30 lookups:** No setup needed (built-in reference data)

### Connector selection

A fyrirtæki typically uses ONE connector (Advania, InExchange, eða Unimaze), not both.
Check which one er configured in Bifrost Setup áður en calling message types.

### Heimildir

Users need the `BIFROST Full ori` permission set til Kallaðu á skjal exchange message types.
BIS30 og UBL types require no special Heimildir beyond base Bifrost access.

## Chapter 7 — Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "outbound HTTP Kallaðu á blocked" | HttpClient not allowed | Extension Management → Allow HttpClient Requests |
| 401 Unauthorized | Invalid eða expired API key | Update API key in Bifrost Setup |
| "sending er disabled" | Send gate off in setup | Enable skjal Exchange sending in Bifrost Setup |
| "receiving er disabled" | Receive gate off in setup | Enable skjal Exchange receiving in Bifrost Setup |
| "no credentials configured" | Missing connector setup | Configure Tengingin (Advania eða Unimaze) in Bifrost Setup |
| GetUnread Skilar empty | Allt skjöl already delivered | Check GetInbox fyrir fulla history, eða verify endpointId |
| UBL render Skilar error | Missing nauðsynlegt fields on BC skjal | Check fyrirtæki Information (VAT, address) og viðskiptavinur data |

### Beiðni log

Allt API calls eru logged in the Bifrost Beiðni Log.
Check the log fyrir HTTP status codes, timestamps, og fulla Beiðni/Svar bodies.

### Advania-specific utilities

| Gerð | Tilgangur |
|---|---|
| `DocumentExchange.Advania.GetUserAccess` | Check your API access level og Heimildir |
| `DocumentExchange.Advania.GetDocumentTypes` | Listi skjal types your endpoints support |
| `DocumentExchange.Advania.CheckUniversalService` | Check Ef recipient accepts via universal service |
| `DocumentExchange.Advania.CompressPdf` | Compress a PDF attachment |
| `DocumentExchange.Advania.OcrPdf` | OCR a scanned PDF skjal |

## Chapter 8 — G/L Journal Posting frá Incoming skjöl

Incoming skjöl getur be posted directly til a General Journal instead of creating
a Purchase Invoice. This er controlled per-vendor via the **Posting Mode** Reitur.

### Setup

1. **Vendor Card → Incoming Doc. Posting Mode**: Set til "G/L Journal"
2. **Vendor VAT G/L reikningur Map**: Map VAT percentages til G/L Accounts fyrir that vendor
   - Each row maps a VAT % → G/L reikningur No.
   - VAT % er auto-calculated frá the vendor's VAT Bus. Posting Group + the G/L reikningur's VAT Prod. Posting Group
   - A 0% row acts as a fallback fyrir unmatched VAT rates
3. **Incoming skjöl Setup**: Configure General Journal Template Heiti og Batch Heiti

### How it works (auto-aggregation)

Þegar `Incoming.Document.Process` er called fyrir a vendor in G/L Journal mode:

```
1. Pre-map resolves vendor by Registration Number / GLN / VAT Reg No.
2. Detects G/L Journal posting mode → sets Document Type = Journal
3. VAT GL Resolver maps each XML line's tax % → G/L Account
4. Lines are aggregated by G/L Account into Posting Instructions
5. A vendor balancing entry is added (last line, negative amount)
6. Codeunit 1224 creates Gen. Journal Lines from the instructions
```

### Pre-seeded posting instructions (MCP Verkflæði)

You getur bypass auto-aggregation by writing posting instructions áður en processing.
This allows custom splits, bankareikningur balancing (credit cards), eða manual overrides.

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

| Reitur | Gerð | Lýsing |
|---|---|---|
| Incoming skjal Entry No. | Integer | Links til the incoming skjal |
| Line No. | Integer | Ordering (10000, 20000, ...) |
| reikningur Gerð | Enum | G/L reikningur, Vendor, viðskiptavinur, bankareikningur |
| reikningur No. | Code[20] | The reikningur number |
| Lýsing | Text[100] | Journal line Lýsing |
| Amount | Decimal | Net amount (positive = debit, negative = credit) |
| Reversed | Boolean | Ef true, ignored by processing (used fyrir history) |

### Credit memo handling

fyrir credit memos (InvoiceTypeCode = 381), the sign er sjálfkrafa reversed:
- G/L reikningur lines Sækja negative amounts
- Vendor balancing line Sækir positive amount

### Lifecycle

- Instructions eru **deleted** Þegar processing succeeds (status = Created)
- Instructions eru **deleted** Þegar the incoming skjal er deleted
- Set `Reversed = true` til mark old instructions as superseded without deleting
- Aðeins `Reversed = false` instructions eru used during processing

### Key rules

1. **Amounts eru net** — BC applies VAT decomposition based on the G/L reikningur's posting setup
2. **Instructions verður að balance** — total of Allt lines should be zero (debits = credits)
3. **Pre-seeded = no override** — Ef non-reversed instructions exist, auto-aggregation er skipped entirely
4. **Vendor er valfrjálst** — you getur Notaðu bankareikningur as the balancing entry (credit card Verkflæði)
5. **VAT G/L Map er per-vendor** — different vendors getur map til different G/L Accounts


