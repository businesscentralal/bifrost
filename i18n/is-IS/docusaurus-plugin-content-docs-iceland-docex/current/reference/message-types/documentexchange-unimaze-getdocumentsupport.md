---
id: documentexchange-unimaze-getdocumentsupport
title: "DocumentExchange.Unimaze.GetDocumentSupport"
sidebar_label: "DocumentExchange.Unimaze.GetDocumentSupport"
sidebar_position: 60
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.GetDocumentSupport Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Checks which skjal types a specific trading partner getur receive.
**Kallaðu á this áður en sending** til verify the receiver supports the format you intend til Notaðu.

## Þegar til Notaðu
- áður en CreateInvoice: verify the receiver accepts electronic invoices
- Checking Ef a viðskiptavinur supports BIS3 (Peppol) eða Aðeins STI (Icelandic)
- Looking up a partner Heiti by kennitala

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Receiver Endapunktur ID. Accepts plain kennitala (e.g. `1010101111`) eða ISO 6523 format (e.g. `0196:1010101111`). Auto-normalized per partner. |

## Svar (Partner-Dependent)

### Advania
```json
{ "ean": "5801120800", "name": "Gestsson ehf.", "supported_types": [
  { "standard_code": "STI", "type_code": "TS236Reikningur", "root": "Invoice", "simpletypename": "Reikningur" }
] }
```

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| ean | string | Endapunktur ID queried |
| Heiti | string | fyrirtæki Heiti |
| supported_types[].standard_code | string | staðlaða: STI, BII, NES2.0, BIS3 |
| supported_types[].type_code | string | færsla Gerð code |
| supported_types[].root | string | XML root: Invoice, CreditNote, RemittanceAdvice |
| supported_types[].simpletypename | string | Short Icelandic Heiti |

### Unimaze (Peppol)
```json
{ "messages": [
  { "uniqueId": "PEPPOL-3.0-ENUBL", "profileId": "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0",
    "customizationId": "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0",
    "transactionKeyName": "BISENUBL-3.0 SubmitInvoice", "profileKeyName": "BISENUBL-3.0",
    "willBeTransformed": false }
] }
```

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| messages[].uniqueId | string | Profile identifier key |
| messages[].profileId | string | Peppol process identifier URI |
| messages[].customizationId | string | skjal customization URI |
| messages[].transactionKeyName | string | Human-readable færsla Heiti (e.g. BISENUBL-3.0 SubmitInvoice) |
| messages[].profileKeyName | string | Short profile key (e.g. BISENUBL-3.0, NESP4-2.0) |
| messages[].documentIdentifier | string | fulla UBL skjal Gerð identifier |
| messages[].willBeTransformed | boolean | Ef true, Unimaze converts the skjal (e.g. CII→UBL) |

## How til Read Niðurstaðan

**Advania:** Ef `root` includes "Invoice" → partner getur receive invoices. "CreditNote" → credit notes.
Empty `supported_types` → kennitala er not registered on the exchange.

**Unimaze:** Ef `transactionKeyName` contains "SubmitInvoice" → getur receive invoices.
Look fyrir `profileKeyName` = "BISENUBL-3.0" fyrir Peppol BIS3 (preferred fyrir international).
`willBeTransformed: true` means the source format differs frá delivery format (e.g. CII→UBL).
Empty `messages` array → Endapunktur not found in the Peppol directory.

## Common Profile Keys (Unimaze)
| profileKeyName | staðlaða | Notes |
|----------------|----------|-------|
| BISENUBL-3.0 | Peppol BIS3 UBL | Default fyrir Iceland. Used by CreateInvoice. |
| BISENCII-3.0 | Peppol BIS3 CII | Cross-Industry Invoice format. `willBeTransformed: true`. |
| NESP4-2.0 | NES UBL 2.0 | Nordic e-invoice (legacy). |
| BII04-1.0 | CEN BII Core | EU Core Invoice (legacy). |

## Typed Access (Unified Buffer)
Svarið items map
onto `DocEx Endpt Buffer ori` færslur regardless of partner.

## Related
- **GetTradingPartners** — fulla directory of Allt registered partners (Advania Aðeins)
- **GetAuthorizedPartners** — endpoints YOU getur manage (Advania Aðeins)
- **CreateInvoice** — send an invoice (uses BISENUBL-3.0 on Unimaze)


