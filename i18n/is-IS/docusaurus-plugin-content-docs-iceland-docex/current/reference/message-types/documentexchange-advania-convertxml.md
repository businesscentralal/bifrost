---
id: documentexchange-advania-convertxml
title: "DocumentExchange.Advania.ConvertXml"
sidebar_label: "DocumentExchange.Advania.ConvertXml"
sidebar_position: 3
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.ConvertXml Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


> **Availability:** Advania Aðeins.

Converts raw UBL XML til a rendered PDF eða HTML **without storing** the skjal.
Notaðu this til preview what an invoice mun look like áður en submitting it.

## Þegar til Notaðu
- Previewing a generated UBL XML invoice áður en SubmitDocument
- Debugging XML generation — verify the rendered output
- Generating a human-readable view fyrir internal review

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| xml | string | **Yes** | Raw UBL XML content |
| output | string | No | `html` (default) eða `pdf` |
| day | string | No | Stylesheet date dd.mm.yyyy (default: today) |

## Svar
The rendered content er returned directly (HTML string eða PDF binary).

## Key Difference frá GetPresentation
- **ConvertXml** — works on raw XML, nothing er stored. Notaðu áður en submit.
- **GetPresentation** — works on a UUID of an already-submitted skjal. Notaðu eftir submit.


