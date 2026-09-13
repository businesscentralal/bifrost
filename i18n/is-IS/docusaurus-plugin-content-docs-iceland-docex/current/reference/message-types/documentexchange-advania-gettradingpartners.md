---
id: documentexchange-advania-gettradingpartners
title: "DocumentExchange.Advania.GetTradingPartners"
sidebar_label: "DocumentExchange.Advania.GetTradingPartners"
sidebar_position: 20
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetTradingPartners Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


> **Availability:** Advania Aðeins. Unimaze does not expose a public partner directory.

Lists Allt registered trading partners on the skjal exchange — the fulla public directory.
Typically 700+ partners. Paginated.

## Þegar til Notaðu
- Searching fyrir a partner by Heiti eða kennitala
- Building a complete partner directory
- Checking Ef a specific fyrirtæki er registered on the exchange

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100) |

## Svar
Paged: `{ skip, take, count, hasMore, items[] }`.

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| ean | string | Endapunktur ID (kennitala eða PEPPOL identifier) |
| Heiti | string | fyrirtæki Heiti |
| support | array | Supported skjal Gerð names (Icelandic) |
| support_code | array | Supported Gerð codes (staðlaða:transactiontype) |

## Typed Access (Unified Buffer)
Svarið items map
onto `DocEx Endpt Buffer ori` færslur með unified Reitur names.

## Agent Tips
- fyrir a **stakan partner lookup**, Notaðu GetDocumentSupport instead (faster, more detail).
- fyrir endpoints **you** getur manage (send/receive), Notaðu GetAuthorizedPartners.
- EANs starting með "0088:" eða "0196:" eru PEPPOL identifiers; plain numbers eru Icelandic kennitala.


