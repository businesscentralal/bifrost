---
id: documentexchange-advania-compresspdf
title: "DocumentExchange.Advania.CompressPdf"
sidebar_label: "DocumentExchange.Advania.CompressPdf"
sidebar_position: 2
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.CompressPdf Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Compresses a PDF skjal using the Advania service. Reduces file size fyrir storage eða email.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Your authorized Endapunktur (kennitala) |
| pdfContent | string | **Yes** | Base64-encoded PDF content |
| compression | string | No | Level: screen, ebook (default), printer, prepress, none |
| filename | string | No | Output filename (appends "-compressed") |

## Svar
The compressed PDF binary in Svarið body (base64 eða raw depending on API version).

## Compression levels
| Level | Notaðu case | Quality |
|-------|----------|---------|
| screen | Web viewing | Lowest file size, lower quality |
| ebook | Email/archive (default) | Good balance |
| printer | Print-ready | Higher quality, larger files |
| prepress | Professional printing | Highest quality |
| none | Lossless FlateDecode Aðeins | No quality loss |


