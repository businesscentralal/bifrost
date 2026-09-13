---
id: documentexchange-advania-ocrpdf
title: "DocumentExchange.Advania.OcrPdf"
sidebar_label: "DocumentExchange.Advania.OcrPdf"
sidebar_position: 27
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.OcrPdf Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Extracts text frá a PDF using Advania OCR service. Notaðu fyrir scanned invoices that need text extraction.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Your authorized Endapunktur (kennitala) |
| pdfContent | string | **Yes** | Base64-encoded PDF content |

## Svar
Extracted text content frá the PDF pages.

## Verkflæði: Scanned Invoice Processing
```
1. Get PDF attachment from a received document:
   DocumentExchange.Advania.GetAttachments { "messageId": "<uuid>" }
2. Extract text from the PDF:
   DocumentExchange.Advania.OcrPdf { "endpointId": "5801120800", "pdfContent": "<base64>" }
3. Parse extracted text for invoice data (amounts, dates, references)
```


