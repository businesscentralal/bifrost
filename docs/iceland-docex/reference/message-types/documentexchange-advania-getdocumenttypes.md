---
id: documentexchange-advania-getdocumenttypes
title: "DocumentExchange.Advania.GetDocumentTypes"
sidebar_label: "DocumentExchange.Advania.GetDocumentTypes"
sidebar_position: 14
description: "Request and response contract for the DocumentExchange.Advania.GetDocumentTypes Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


> **Availability:** Advania only. On Unimaze, use GetDocumentSupport per-partner.

Lists all document types supported by the exchange, including Peppol profiles,
Icelandic standards, and legacy formats.

## When to Use
- Discovering which standards/transaction types exist
- Looking up the correct transactiontype code for SubmitDocument
- Understanding what BIS3, STI, NES2.0, BII mean

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skip | integer | No | Offset (default 0) |
| take | integer | No | Limit (default 25) |

## Response
Paged: `{ count, hasMore, items[] }`. Use skip/take for pagination.

| Field | Type | Description |
|-------|------|-------------|
| standard | string | Standard code: BII, NES2.0, BIS3, STI, UBL |
| standard_name | string | Full standard name |
| transactiontype | string | Transaction type code |
| typename | string | Long type name |
| simpletypename | string | Short Icelandic type name |
| peppol_name | string | Peppol profile name (null if not Peppol) |

## Standards Quick Reference
| Code | Name | Status | Used For |
|------|------|--------|----------|
| BIS3 | Peppol BIS 3 | **Current** | Invoices, credit notes, orders, catalogues |
| STI | Staðlaráð Íslands | **Current** | TS-236 invoices, TS-142 remittance advice |
| NES2.0 | Northern European Subset | Legacy | Basic invoices |
| BII | Business Interoperability | Legacy | Invoices, credit notes, orders |

## Agent Tip
Use **GetDocumentSupport** with a specific kennitala to check which of these
a trading partner actually accepts — not all partners support all types.

