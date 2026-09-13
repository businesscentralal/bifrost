---
id: documentexchange-unimaze-getpartyinfo
title: "DocumentExchange.Unimaze.GetPartyInfo"
sidebar_label: "DocumentExchange.Unimaze.GetPartyInfo"
sidebar_position: 63
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.GetPartyInfo Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar fyrirtæki Heiti og identifier fyrir a registered electronic address (Unimaze Aðeins).
Notaðu this til verify a trading partner exists in the PEPPOL network áður en sending skjöl.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Party identifier. Format: `{scheme}:{id}` (e.g. `0196:5801120800`) eða plain kennitala (auto-prefixed með 0196:) |

## Svar
```json
{ "identifier": "KT:1010101111", "name": "Receiving Party ehf." }
```

## Verkflæði
1. áður en sending any skjal, Kallaðu á GetPartyInfo til verify the receiver exists
2. Kallaðu á GetDocumentSupport með the same endpointId til verify they getur receive your skjal Gerð
3. Then Kallaðu á SubmitTransaction eða CreateInvoice til send

## Data Mapping frá BC
| BC Source | Reitur | Maps til endpointId |
|-----------|-------|-------------------|
| viðskiptavinur | Registration No. | `0196:{Registration No.}` |
| Vendor | Registration No. | `0196:{Registration No.}` |
| fyrirtæki Information | Registration No. | Your own identifier |

## Related
- **GetDocumentSupport** — check what skjal types the party getur receive
- **SubmitTransaction** — send a skjal til the party


