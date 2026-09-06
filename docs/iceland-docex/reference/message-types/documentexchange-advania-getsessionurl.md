---
id: documentexchange-advania-getsessionurl
title: "DocumentExchange.Advania.GetSessionUrl"
sidebar_label: "DocumentExchange.Advania.GetSessionUrl"
sidebar_position: 18
description: "Request and response contract for the DocumentExchange.Advania.GetSessionUrl Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a pre-made presentation URL before a document is sent. The URL activates when the matching document arrives.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sourceidentifier | string | **Yes** | Unique document ID from your system (must match when submitted) |
| fromean | string | **Yes** | Sender endpoint ID (kennitala) |
| toean | string | **Yes** | Receiver endpoint ID (kennitala) |
| standardcode | string | **Yes** | Document standard code (from GetDocumentTypes) |

## Response
`{ url: "https://skeyti.advania.is/session/..." }` — a URL that will display the document once sent.

## Workflow
```
1. Before sending: create session URL for the document
   DocumentExchange.Advania.GetSessionUrl {
     "sourceidentifier": "INV-10042", "fromean": "5801120800",
     "toean": "4804022940", "standardcode": "STI" }
2. Include the URL in email to customer
3. Submit document: DocumentExchange.Advania.SubmitDocument { ... }
4. Customer clicks URL → sees rendered invoice
```

