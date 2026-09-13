---
id: documentexchange-advania-getsessionurl
title: "DocumentExchange.Advania.GetSessionUrl"
sidebar_label: "DocumentExchange.Advania.GetSessionUrl"
sidebar_position: 18
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetSessionUrl Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a pre-made presentation URL áður en a skjal er sent. The URL activates Þegar the matching skjal arrives.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| sourceidentifier | string | **Yes** | Unique skjal ID frá your system (verður að match Þegar submitted) |
| fromean | string | **Yes** | Sender Endapunktur ID (kennitala) |
| toean | string | **Yes** | Receiver Endapunktur ID (kennitala) |
| standardcode | string | **Yes** | skjal staðlaða code (frá GetDocumentTypes) |

## Svar
`{ url: "https://skeyti.advania.is/session/..." }` — a URL that mun display the skjal once sent.

## Verkflæði
```
1. Before sending: create session URL for the document
   DocumentExchange.Advania.GetSessionUrl {
     "sourceidentifier": "INV-10042", "fromean": "5801120800",
     "toean": "4804022940", "standardcode": "STI" }
2. Include the URL in email to customer
3. Submit document: DocumentExchange.Advania.SubmitDocument { ... }
4. Customer clicks URL → sees rendered invoice
```


