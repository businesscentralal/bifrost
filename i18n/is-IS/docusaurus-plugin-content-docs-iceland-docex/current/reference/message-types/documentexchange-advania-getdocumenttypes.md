---
id: documentexchange-advania-getdocumenttypes
title: "DocumentExchange.Advania.GetDocumentTypes"
sidebar_label: "DocumentExchange.Advania.GetDocumentTypes"
sidebar_position: 14
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetDocumentTypes Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


> **Availability:** Advania Aðeins. On Unimaze, Notaðu GetDocumentSupport per-partner.

Lists Allt skjal types supported by the exchange, þar á meðal Peppol profiles,
Icelandic standards, og legacy formats.

## Þegar til Notaðu
- Discovering which standards/færsla types exist
- Looking up the correct transactiontype code fyrir SubmitDocument
- Understanding what BIS3, STI, NES2.0, BII mean

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 25) |

## Svar
Paged: `{ count, hasMore, items[] }`. Notaðu skip/take fyrir pagination.

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| staðlaða | string | staðlaða code: BII, NES2.0, BIS3, STI, UBL |
| standard_name | string | fulla staðlaða Heiti |
| transactiontype | string | færsla Gerð code |
| typename | string | Long Gerð Heiti |
| simpletypename | string | Short Icelandic Gerð Heiti |
| peppol_name | string | Peppol profile Heiti (null Ef not Peppol) |

## Standards Quick Reference
| Code | Heiti | Status | Used fyrir |
|------|------|--------|----------|
| BIS3 | Peppol BIS 3 | **Current** | Invoices, credit notes, orders, catalogues |
| STI | Staðlaráð Íslands | **Current** | TS-236 invoices, TS-142 remittance advice |
| NES2.0 | Northern European Subset | Legacy | Basic invoices |
| BII | Business Interoperability | Legacy | Invoices, credit notes, orders |

## Agent Tip
Notaðu **GetDocumentSupport** með a specific kennitala til check which of these
a trading partner actually accepts — not Allt partners support Allt types.


