---
id: documentexchange-advania-ocrpdf
title: "DocumentExchange.Advania.OcrPdf"
sidebar_label: "DocumentExchange.Advania.OcrPdf"
sidebar_position: 27
description: "Request and response contract for the DocumentExchange.Advania.OcrPdf Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Extracts text from a PDF using Advania OCR service. Use for scanned invoices that need text extraction.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Your authorized endpoint (kennitala) |
| pdfContent | string | **Yes** | Base64-encoded PDF content |

## Response
Extracted text content from the PDF pages.

## Workflow: Scanned Invoice Processing
```
1. Get PDF attachment from a received document:
   DocumentExchange.Advania.GetAttachments { "messageId": "<uuid>" }
2. Extract text from the PDF:
   DocumentExchange.Advania.OcrPdf { "endpointId": "5801120800", "pdfContent": "<base64>" }
3. Parse extracted text for invoice data (amounts, dates, references)
```

