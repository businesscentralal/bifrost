---
id: documentexchange-advania-gettradingpartners
title: "DocumentExchange.Advania.GetTradingPartners"
sidebar_label: "DocumentExchange.Advania.GetTradingPartners"
sidebar_position: 20
description: "Request and response contract for the DocumentExchange.Advania.GetTradingPartners Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


> **Availability:** Advania only. Unimaze does not expose a public partner directory.

Lists all registered trading partners on the document exchange — the full public directory.
Typically 700+ partners. Paginated.

## When to Use
- Searching for a partner by name or kennitala
- Building a complete partner directory
- Checking if a specific company is registered on the exchange

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 100) |

## Response
Paged: `{ skip, take, count, hasMore, items[] }`.

| Field | Type | Description |
|-------|------|-------------|
| ean | string | Endpoint ID (kennitala or PEPPOL identifier) |
| name | string | Company name |
| support | array | Supported document type names (Icelandic) |
| support_code | array | Supported type codes (standard:transactiontype) |

## Typed Access (Unified Buffer)
The response items map
onto `DocEx Endpt Buffer ori` records with unified field names.

## Agent Tips
- For a **single partner lookup**, use GetDocumentSupport instead (faster, more detail).
- For endpoints **you** can manage (send/receive), use GetAuthorizedPartners.
- EANs starting with "0088:" or "0196:" are PEPPOL identifiers; plain numbers are Icelandic kennitala.

