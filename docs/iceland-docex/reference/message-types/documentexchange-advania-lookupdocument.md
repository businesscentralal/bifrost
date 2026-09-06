---
id: documentexchange-advania-lookupdocument
title: "DocumentExchange.Advania.LookupDocument"
sidebar_label: "DocumentExchange.Advania.LookupDocument"
sidebar_position: 26
description: "Request and response contract for the DocumentExchange.Advania.LookupDocument Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Searches for sent documents on the exchange. Returns document metadata including
the message UUID needed for GetDocument, GetDocumentInfo, GetPresentation, and StatusSync.

## When to Use
- Finding a specific sent document to check its exchange status
- Getting the messageId/uuid for a document (for GetDocument, GetDocumentInfo, GetPresentation)
- Verifying a document was successfully registered on the exchange
- Checking delivery and validation status of sent documents

## Request

**Preferred (works on both partners):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| documentNo | string | **Yes** | Posted document number (e.g. "103006") |

**Advania extended (optional precision):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| issuer | string | No | Sender endpoint ID (auto-derived from Company Information if omitted) |
| customer | string | No | Receiver endpoint ID (kennitala) |
| issueDate | string | No | Issue date YYYY-MM-DD |

> **Tip:** Just pass `documentNo` — it works on both Unimaze and Advania.
> Advania auto-fills the issuer from Company Information and uses sourceidentifier search.

## Response (Partner-Dependent)

### Unimaze
Returns the raw MAPI message list (may contain multiple results if documentNo matches several):
```json
{ "messages": [
  { "uniqueId": "41131fd0-f62c-4002-8920-427b93cb8d9c",
    "documentNo": "103006", "status": "delivered", "transfer": "outbound",
    "validationStatus": "approved", "timeReceived": "2026-06-30T15:20:00Z",
    "originParty": { "identifier": "KT:2020202222", "name": "Sending Party ehf." },
    "destinationParty": { "identifier": "KT:1010101111", "name": "Receiving Party ehf." },
    "service": "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0##PEPPOL-3.0-ENUBL" }
] }
```

| Field | Type | Description |
|-------|------|-------------|
| messages[].uniqueId | string | Message UUID — use as `messageId` in other operations |
| messages[].documentNo | string | Source document number from BC |
| messages[].status | string | Delivery status: `delivered`, `failed`, `pending` |
| messages[].validationStatus | string | Schema validation: `approved`, `rejected`, `NotSet` |
| messages[].transfer | string | Direction: `outbound` (sent) or `inbound` (received) |
| messages[].timeReceived | string | UTC timestamp when exchange received the document |
| messages[].timeDelivered | string | UTC timestamp when receiver got the document |
| messages[].originParty | object | Sender: `{ identifier, name }` |
| messages[].destinationParty | object | Receiver: `{ identifier, name }` |
| messages[].service | string | Peppol service/profile used |

### Advania
```json
{ "count": 1, "hasMore": false, "items": [
  { "uuid": "abc-123", "document_id": "103006", "document_type": "Invoice",
    "issue_date": "2026-06-30", "customer_id": "5801120800", "customer_name": "Gestsson ehf." }
] }
```

## Key Status Values (Unimaze)
| status | Meaning |
|--------|---------|
| delivered | Successfully delivered to receiver |
| failed | Delivery failed (check validationStatus) |
| pending | Awaiting delivery |
| notprocessingnotset | Legacy/unprocessed |

| validationStatus | Meaning |
|------------------|---------|
| approved | Document passed schema validation |
| rejected | Document failed validation (will not be delivered) |
| NotSet | Not yet validated |

## Typed Access (Unified Buffer)
The response items map
onto `DocEx Inbox Buffer ori` records regardless of partner.

## Workflow
1. After CreateInvoice, the response contains the message UUID — store it in field 710
2. Use **StatusSync** for routine status polling (preferred — uses stored field 710)
3. Use **LookupDocument** when:
   - Field 710 was lost or never stored
   - You need to find a document by its BC document number
   - You need full message metadata (parties, timestamps, validation)
4. Use the returned `uniqueId`/`uuid` with GetDocument, GetDocumentInfo, or GetPresentation

## Related
- **StatusSync** — preferred for routine status checks (automatic, uses field 710)
- **GetDocument** — retrieve the source XML using the uuid from results
- **GetDocumentInfo** — get extended metadata for a specific message
- **GetPresentation** — rendered PDF/HTML view (use uuid from results)
- **GetAuthorizedPartners** — get valid `issuer` values (Advania only)

