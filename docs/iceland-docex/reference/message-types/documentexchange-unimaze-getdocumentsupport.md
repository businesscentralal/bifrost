---
id: documentexchange-unimaze-getdocumentsupport
title: "DocumentExchange.Unimaze.GetDocumentSupport"
sidebar_label: "DocumentExchange.Unimaze.GetDocumentSupport"
sidebar_position: 60
description: "Request and response contract for the DocumentExchange.Unimaze.GetDocumentSupport Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Checks which document types a specific trading partner can receive.
**Call this before sending** to verify the receiver supports the format you intend to use.

## When to Use
- Before CreateInvoice: verify the receiver accepts electronic invoices
- Checking if a customer supports BIS3 (Peppol) or only STI (Icelandic)
- Looking up a partner name by kennitala

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Receiver endpoint ID. Accepts plain kennitala (e.g. `1010101111`) or ISO 6523 format (e.g. `0196:1010101111`). Auto-normalized per partner. |

## Response (Partner-Dependent)

### Advania
```json
{ "ean": "5801120800", "name": "Gestsson ehf.", "supported_types": [
  { "standard_code": "STI", "type_code": "TS236Reikningur", "root": "Invoice", "simpletypename": "Reikningur" }
] }
```

| Field | Type | Description |
|-------|------|-------------|
| ean | string | Endpoint ID queried |
| name | string | Company name |
| supported_types[].standard_code | string | Standard: STI, BII, NES2.0, BIS3 |
| supported_types[].type_code | string | Transaction type code |
| supported_types[].root | string | XML root: Invoice, CreditNote, RemittanceAdvice |
| supported_types[].simpletypename | string | Short Icelandic name |

### Unimaze (Peppol)
```json
{ "messages": [
  { "uniqueId": "PEPPOL-3.0-ENUBL", "profileId": "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0",
    "customizationId": "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0",
    "transactionKeyName": "BISENUBL-3.0 SubmitInvoice", "profileKeyName": "BISENUBL-3.0",
    "willBeTransformed": false }
] }
```

| Field | Type | Description |
|-------|------|-------------|
| messages[].uniqueId | string | Profile identifier key |
| messages[].profileId | string | Peppol process identifier URI |
| messages[].customizationId | string | Document customization URI |
| messages[].transactionKeyName | string | Human-readable transaction name (e.g. BISENUBL-3.0 SubmitInvoice) |
| messages[].profileKeyName | string | Short profile key (e.g. BISENUBL-3.0, NESP4-2.0) |
| messages[].documentIdentifier | string | Full UBL document type identifier |
| messages[].willBeTransformed | boolean | If true, Unimaze converts the document (e.g. CII→UBL) |

## How to Read the Result

**Advania:** If `root` includes "Invoice" → partner can receive invoices. "CreditNote" → credit notes.
Empty `supported_types` → kennitala is not registered on the exchange.

**Unimaze:** If `transactionKeyName` contains "SubmitInvoice" → can receive invoices.
Look for `profileKeyName` = "BISENUBL-3.0" for Peppol BIS3 (preferred for international).
`willBeTransformed: true` means the source format differs from delivery format (e.g. CII→UBL).
Empty `messages` array → endpoint not found in the Peppol directory.

## Common Profile Keys (Unimaze)
| profileKeyName | Standard | Notes |
|----------------|----------|-------|
| BISENUBL-3.0 | Peppol BIS3 UBL | Default for Iceland. Used by CreateInvoice. |
| BISENCII-3.0 | Peppol BIS3 CII | Cross-Industry Invoice format. `willBeTransformed: true`. |
| NESP4-2.0 | NES UBL 2.0 | Nordic e-invoice (legacy). |
| BII04-1.0 | CEN BII Core | EU Core Invoice (legacy). |

## Typed Access (Unified Buffer)
The response items map
onto `DocEx Endpt Buffer ori` records regardless of partner.

## Related
- **GetTradingPartners** — full directory of all registered partners (Advania only)
- **GetAuthorizedPartners** — endpoints YOU can manage (Advania only)
- **CreateInvoice** — send an invoice (uses BISENUBL-3.0 on Unimaze)

