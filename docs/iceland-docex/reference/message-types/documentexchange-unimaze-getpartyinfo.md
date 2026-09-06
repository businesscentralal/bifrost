---
id: documentexchange-unimaze-getpartyinfo
title: "DocumentExchange.Unimaze.GetPartyInfo"
sidebar_label: "DocumentExchange.Unimaze.GetPartyInfo"
sidebar_position: 63
description: "Request and response contract for the DocumentExchange.Unimaze.GetPartyInfo Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns company name and identifier for a registered electronic address (Unimaze only).
Use this to verify a trading partner exists in the PEPPOL network before sending documents.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Party identifier. Format: `{scheme}:{id}` (e.g. `0196:5801120800`) or plain kennitala (auto-prefixed with 0196:) |

## Response
```json
{ "identifier": "KT:1010101111", "name": "Receiving Party ehf." }
```

## Workflow
1. Before sending any document, call GetPartyInfo to verify the receiver exists
2. Call GetDocumentSupport with the same endpointId to verify they can receive your document type
3. Then call SubmitTransaction or CreateInvoice to send

## Data Mapping from BC
| BC Source | Field | Maps to endpointId |
|-----------|-------|-------------------|
| Customer | Registration No. | `0196:{Registration No.}` |
| Vendor | Registration No. | `0196:{Registration No.}` |
| Company Information | Registration No. | Your own identifier |

## Related
- **GetDocumentSupport** — check what document types the party can receive
- **SubmitTransaction** — send a document to the party

