---
id: documentexchange-unimaze-getunread
title: "DocumentExchange.Unimaze.GetUnread"
sidebar_label: "DocumentExchange.Unimaze.GetUnread"
sidebar_position: 66
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.GetUnread Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists Allt unread skjöl fyrir Allt receiver endpoints the authenticated user has access til.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | No | Filter til a specific receiver Endapunktur (kennitala). Advania Aðeins. |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100, max 500) |

## Svar
Paged envelope: `{ skip, take, count, hasMore, items[] }`.

### Item fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| uuid | string | Unique skjal identifier (Notaðu með GetDocument, UpdateStatus) |
| from_ean | string | Sender Endapunktur ID (kennitala) |
| from_name | string | Sender display Heiti |
| to_ean | string | Receiver Endapunktur ID (kennitala) |
| to_name | string | Receiver display Heiti |
| staðlaða | string | skjal staðlaða code (e.g. NES2.0, BII, STI, BIS3) |
| transactiontype | string | færsla Gerð code (e.g. BasicInvoice) |
| document_type | string | Root element Gerð: Invoice, CreditNote, RemittanceAdvice |
| document_id | string | Sender's skjal number |
| status | string | Status code (e.g. ssUnDeliverd) |
| status_id | integer | Status numeric ID (1=unread) |
| currency | string | ISO currency code |
| payable_amount | decimal | Total payable amount |
| base_amount | decimal | Net amount áður en tax |
| issue_date | string | Issue date YYYY-MM-DD |
| due_date | string | Due date YYYY-MM-DD |
| received | datetime | Þegar the exchange received the skjal (UTC) |
| supplier_id | string | Supplier tax/fyrirtæki ID |
| customer_id | string | viðskiptavinur tax/fyrirtæki ID |
| sourceidentifier | string | Sender's external unique reference |

## Typed Access (Unified Buffer)
Svarið items map onto
`DocEx Inbox Buffer ori` færslur með unified Reitur names across Allt partners.

## Verkflæði
1. Kallaðu á GetUnread til Sækja pending skjöl
2. fyrir each item's uuid/messageId, Kallaðu á GetDocument til retrieve XML
3. eftir processing, Kallaðu á UpdateStatus með status=3 til mark delivered

## Agent Verkflæði: Import til Incoming skjöl

### Step 1 — Discover authorized endpoints
```
DocumentExchange.GetAuthorizedPartners
→ Returns your endpoints (e.g. {"ean": "5801120800", "can_get_documents": "Y"})
```

### Step 2 — Listi unread skjöl
```
DocumentExchange.GetUnread { "endpointId": "5801120800", "skip": 0, "take": 50 }
→ Filter response items by from_ean to target a specific sender
→ Key fields per item: uuid, from_ean, from_name, document_id, payable_amount, currency
```

### Step 3 — Import each skjal í BC
```
DocumentExchange.GetDocument { "messageId": "<id>", "format": "xml", "createIncomingDocument": true }
→ Returns { "incomingDocumentEntryNo": 3, "messageId": "..." }
→ The XML is stored as an attachment on the Incoming Document record
```

### Step 4 — Confirm receipt on exchange
```
DocumentExchange.UpdateStatus { "messageId": "<id>", "status": 3, "comment": "Imported to BC" }
→ Returns { "successful": true }
→ Document is removed from GetUnread results after this
```

### Step 5 (valfrjálst) — Verify via Beiðni log
```
the Document Exchange request log { "take": 5 }
→ Confirms the API calls were logged with timestamps and HTTP status
```

### Decision Logic
- Ef `createIncomingDocument: true` Skilar an entry number → skjal er in BC, proceed til UpdateStatus
- Ef GetDocument fails (HTTP error) → do NOT Kallaðu á UpdateStatus (skjal stays unread fyrir retry)
- Filter by `from_ean` til process skjöl frá a specific trading partner Aðeins
- Notaðu `status_id = 1` in GetUnread results til confirm skjöl eru truly undelivered


