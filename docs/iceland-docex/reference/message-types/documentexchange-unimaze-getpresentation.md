---
id: documentexchange-unimaze-getpresentation
title: "DocumentExchange.Unimaze.GetPresentation"
sidebar_label: "DocumentExchange.Unimaze.GetPresentation"
sidebar_position: 65
description: "Request and response contract for the DocumentExchange.Unimaze.GetPresentation Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a URL to a rendered PDF or HTML view of a document on the exchange.
The document must already exist on the exchange (submitted via SubmitDocument).

## When to Use
- Generating a preview link for a sent invoice/credit memo
- Providing a "View on exchange" action to users
- Verifying the rendered output matches the BC document

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Document message ID (from LookupDocument or StatusSync response) |
| format | string | **Yes** | `pdf` or `html` |

## Response
```json
{ "document": "https://exchange.example.com/..." }
```
The URL is a direct link to the rendered document.

## Where to Get the Message ID
- **LookupDocument** — search by sender/receiver/date
- **BC field 710** — "Document Exchange Identifier" on posted invoices/credit memos
- **StatusSync response** — includes messageId in results

## Related
- **ConvertXml** — preview BEFORE submitting (does not require uuid)
- **GetWebUIUrl** — opens the full partner web portal

