---
id: documentexchange-advania-getunread
title: "DocumentExchange.Advania.GetUnread"
sidebar_label: "DocumentExchange.Advania.GetUnread"
sidebar_position: 21
description: "Request and response contract for the DocumentExchange.Advania.GetUnread Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists all unread documents for all receiver endpoints the authenticated user has access to.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | No | Filter to a specific receiver endpoint (kennitala). Advania only. |
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100, max 500) |

## Response
Paged envelope: `{ skip, take, count, hasMore, items[] }`.

### Item fields
| Field | Type | Description |
|-------|------|-------------|
| uuid | string | Unique document identifier (use with GetDocument, UpdateStatus) |
| from_ean | string | Sender endpoint ID (kennitala) |
| from_name | string | Sender display name |
| to_ean | string | Receiver endpoint ID (kennitala) |
| to_name | string | Receiver display name |
| standard | string | Document standard code (e.g. NES2.0, BII, STI, BIS3) |
| transactiontype | string | Transaction type code (e.g. BasicInvoice) |
| document_type | string | Root element type: Invoice, CreditNote, RemittanceAdvice |
| document_id | string | Sender's document number |
| status | string | Status code (e.g. ssUnDeliverd) |
| status_id | integer | Status numeric ID (1=unread) |
| currency | string | ISO currency code |
| payable_amount | decimal | Total payable amount |
| base_amount | decimal | Net amount before tax |
| issue_date | string | Issue date YYYY-MM-DD |
| due_date | string | Due date YYYY-MM-DD |
| received | datetime | When the exchange received the document (UTC) |
| supplier_id | string | Supplier tax/company ID |
| customer_id | string | Customer tax/company ID |
| sourceidentifier | string | Sender's external unique reference |

## Typed Access (Unified Buffer)
The response items map onto
`DocEx Inbox Buffer ori` records with unified field names across all partners.

## Workflow
1. Call GetUnread to get pending documents
2. For each item's uuid/messageId, call GetDocument to retrieve XML
3. After processing, call UpdateStatus with status=3 to mark delivered

## Agent Workflow: Import to Incoming Documents

### Step 1 — Discover authorized endpoints
```
DocumentExchange.GetAuthorizedPartners
→ Returns your endpoints (e.g. {"ean": "5801120800", "can_get_documents": "Y"})
```

### Step 2 — List unread documents
```
DocumentExchange.GetUnread { "endpointId": "5801120800", "skip": 0, "take": 50 }
→ Filter response items by from_ean to target a specific sender
→ Key fields per item: uuid, from_ean, from_name, document_id, payable_amount, currency
```

### Step 3 — Import each document into BC
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

### Step 5 (optional) — Verify via request log
```
the Document Exchange request log { "take": 5 }
→ Confirms the API calls were logged with timestamps and HTTP status
```

### Decision Logic
- If `createIncomingDocument: true` returns an entry number → document is in BC, proceed to UpdateStatus
- If GetDocument fails (HTTP error) → do NOT call UpdateStatus (document stays unread for retry)
- Filter by `from_ean` to process documents from a specific trading partner only
- Use `status_id = 1` in GetUnread results to confirm documents are truly undelivered

