---
id: index
title: "Bifröst Iceland DocEx"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Electronic document exchange for Business Central through Advania, Unimaze and InExchange, with Peppol BIS 3.0 data and UBL rendering."
---

Bifröst Iceland DocEx sends and receives electronic business documents through four services — Advania, Unimaze, InExchange and the public Peppol BIS Billing 3.0 reference-data service — and exposes each operation as a message type. It builds on Bifröst Foundation: a caller posts one message such as `DocumentExchange.Advania.GetUnread`, the extension performs the HTTP call, writes the exchange to the Bifrost Request Log with the secrets masked, and returns a JSON response.

## What it does

- **Advania** — receive and send documents, read metadata, lines, attachments and history, synchronise statuses, query the inbox and sent lists, look up trading partners, retrieve PDFs, and run OCR and XML conversion.
- **Unimaze** — receive and send documents, submit transactions and raw XML, add attachments, read validation results, retry failed messages, register payments and rejections, and list pending actions.
- **InExchange** — fetch incoming documents, send outbound documents, track outbound delivery status, mark documents handled, and look up buyers and sellers.
- **Peppol BIS 3.0 reference data** — country codes, currencies, document type codes, electronic address schemes, participant schemes, MIME codes, unit codes and VAT codes, without external credentials.
- **UBL rendering** — produce UBL 2.1 XML for invoices, credit notes, orders, despatch advices and statements directly from Business Central documents, without a mapping project.
- **Incoming documents** — an inbound payload can become a Business Central Incoming Document, deduplicated on the provider's document id, and from there either a purchase document or general journal lines depending on the vendor's posting mode.
- **Per-vendor posting rules** — a vendor can be configured to post incoming lines to fixed G/L accounts per VAT percentage.
- **Audited traffic** — every provider call is written to the Bifrost Request Log through a provider-specific masker, so a failed exchange can be reconstructed without exposing credentials.
- **One API for four networks** — the caller changes the message type, not the integration code.

## How it works

1. An administrator opens **Bifröst Setup → Document Exchange**, picks the environment (Live or Test) per provider, and enters the provider credentials. Credentials go to Isolated Storage; the page shows only a **Credentials Stored** flag.
2. A caller — an external system, an MCP client or a Business Central process — posts a message with a `DocumentExchange.*` type and a JSON payload to the Bifrost queue API.
3. Bifröst Foundation resolves the message type to its handler codeunit.
4. The handler reads the provider environment from Setup, resolves the matching provider client, and performs the HTTP call. Request and response are written to the Bifrost Request Log with the credentials masked.
5. The handler writes a JSON response back to the message, and the caller downloads it from the Bifrost data API.
6. For inbound documents requested with `createIncomingDocument: true`, the extension also creates a Business Central Incoming Document and, depending on the vendor's posting mode, a purchase document or general journal lines.

## Message types

The extension adds 76 message types on top of Bifröst Foundation. Each one is self-documenting: submit `Help.DocumentExchange.Get` with the message type name as the subject to receive its request and response contract in Markdown.

| Category | Types | What it covers |
| --- | --- | --- |
| BIS 3.0 reference data | 10 | Peppol BIS 3.0 code lists — countries, currencies, document types, address and participant schemes, MIME codes, unit codes, VAT codes. |
| Advania | 30 | Receiving, sending, status management, mailbox queries, partner lookup, document retrieval, OCR and XML conversion, user and web UI access. |
| Unimaze | 23 | Receiving, sending, status management, queries, attachments and validation, payment and rejection workflow. |
| InExchange | 8 | Incoming documents, outbound sending and status, buyer and seller lookup. |
| UBL rendering | 4 | `DocumentExchange.UBL.RenderBilling`, `RenderOrder`, `RenderDespatchAdvice`, `RenderStatement`. |
| Help | 1 | `Help.DocumentExchange.Get` — the contract of every type above. |

The full list, one row per message type, is in the [in-product help](/help/iceland-docex/).

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- Bifröst Foundation, available separately on AppSource.
- Provider credentials from at least one supported exchange network — Advania, Unimaze or InExchange.
- BIS 3.0 reference data and UBL rendering need no external credentials.

## Where to go next

- [In-product help](/help/iceland-docex/)
- [Object ID map](./reference/object-id-map)
- [AppSource user scenarios](./user-scenarios)
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
