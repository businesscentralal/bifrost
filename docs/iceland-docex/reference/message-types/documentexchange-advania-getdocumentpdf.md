---
id: documentexchange-advania-getdocumentpdf
title: "DocumentExchange.Advania.GetDocumentPdf"
sidebar_label: "DocumentExchange.Advania.GetDocumentPdf"
sidebar_position: 12
description: "Request and response contract for the DocumentExchange.Advania.GetDocumentPdf Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets a styled PDF rendering of a document using a specific stylesheet.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Document UUID |
| style | string | No | Stylesheet name (default: "default") |
| resource | string | No | Resource name (default: "invoice.pdf") |

## Response
The styled PDF document data.

## Alternative: GetPresentation
Use GetPresentation for a simpler URL-based approach (returns a link to view the document).
Use GetDocumentPdf when you need the actual PDF bytes for storage or email attachment.

