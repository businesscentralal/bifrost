---
id: documentexchange-advania-getdocumentpdf
title: "DocumentExchange.Advania.GetDocumentPdf"
sidebar_label: "DocumentExchange.Advania.GetDocumentPdf"
sidebar_position: 12
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetDocumentPdf Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir a styled PDF rendering of a skjal using a specific stylesheet.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | skjal UUID |
| style | string | No | Stylesheet Heiti (default: "default") |
| resource | string | No | Resource Heiti (default: "invoice.pdf") |

## Svar
The styled PDF skjal data.

## Alternative: GetPresentation
Notaðu GetPresentation fyrir a simpler URL-based approach (Skilar a link til view the skjal).
Notaðu GetDocumentPdf Þegar you need the actual PDF bytes fyrir storage eða email attachment.


