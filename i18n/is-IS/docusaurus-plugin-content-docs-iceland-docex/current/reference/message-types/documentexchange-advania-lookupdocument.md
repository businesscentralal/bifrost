---
id: documentexchange-advania-lookupdocument
title: "DocumentExchange.Advania.LookupDocument"
sidebar_label: "DocumentExchange.Advania.LookupDocument"
sidebar_position: 26
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.LookupDocument Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Searches fyrir sent skjöl on the exchange. Skilar skjal metadata þar á meðal
the message UUID needed fyrir GetDocument, GetDocumentInfo, GetPresentation, og StatusSync.

## Þegar til Notaðu
- Finding a specific sent skjal til check its exchange status
- Getting the messageId/uuid fyrir a skjal (fyrir GetDocument, GetDocumentInfo, GetPresentation)
- Verifying a skjal was með góðum árangri registered on the exchange
- Checking delivery og validation status of sent skjöl

## Beiðni

**Preferred (works on both partners):**
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| documentNo | string | **Yes** | Posted skjal number (e.g. "103006") |

**Advania extended (valfrjálst precision):**
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| issuer | string | No | Sender Endapunktur ID (auto-derived frá fyrirtæki Information Ef omitted) |
| viðskiptavinur | string | No | Receiver Endapunktur ID (kennitala) |
| issueDate | string | No | Issue date YYYY-MM-DD |

> **Tip:** Just pass `documentNo` — it works on both Unimaze og Advania.
> Advania auto-fills the issuer frá fyrirtæki Information og uses sourceidentifier search.

## Svar (Partner-Dependent)

### Unimaze
Skilar raw MAPI message Listi (may contain multiple results Ef documentNo matches several):
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

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| messages[].uniqueId | string | Message UUID — Notaðu as `messageId` in other operations |
| messages[].documentNo | string | Source skjal number frá BC |
| messages[].status | string | Delivery status: `delivered`, `failed`, `pending` |
| messages[].validationStatus | string | Schema validation: `approved`, `rejected`, `NotSet` |
| messages[].transfer | string | Stefna: `outbound` (sent) eða `inbound` (received) |
| messages[].timeReceived | string | UTC timestamp Þegar exchange received the skjal |
| messages[].timeDelivered | string | UTC timestamp Þegar receiver got the skjal |
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
| delivered | með góðum árangri delivered til receiver |
| failed | Delivery failed (check validationStatus) |
| pending | Awaiting delivery |
| notprocessingnotset | Legacy/unprocessed |

| validationStatus | Meaning |
|------------------|---------|
| approved | skjal passed schema validation |
| rejected | skjal failed validation (mun not be delivered) |
| NotSet | Not yet validated |

## Typed Access (Unified Buffer)
Svarið items map
onto `DocEx Inbox Buffer ori` færslur regardless of partner.

## Verkflæði
1. eftir CreateInvoice, Svarið contains the message UUID — store it in Reitur 710
2. Notaðu **StatusSync** fyrir routine status polling (preferred — uses stored Reitur 710)
3. Notaðu **LookupDocument** Þegar:
   - Reitur 710 was lost eða never stored
   - You need til find a skjal by its BC skjal number
   - You need fulla message metadata (parties, timestamps, validation)
4. Notaðu the returned `uniqueId`/`uuid` með GetDocument, GetDocumentInfo, eða GetPresentation

## Related
- **StatusSync** — preferred fyrir routine status checks (automatic, uses Reitur 710)
- **GetDocument** — retrieve the source XML using the uuid frá results
- **GetDocumentInfo** — Sækja extended metadata fyrir a specific message
- **GetPresentation** — rendered PDF/HTML view (Notaðu uuid frá results)
- **GetAuthorizedPartners** — Sækja valid `issuer` values (Advania Aðeins)


