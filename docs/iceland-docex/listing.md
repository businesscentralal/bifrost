---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

## Search Result Summary (max 50 chars)
Add-on for Business Central with electronic invoicing via Peppol, Advania, and Unimaze.

## Offer Summary

Electronic invoicing and document exchange via Peppol, Advania, Unimaze, and InExchange.

## Description

The full description text is [below](#full-description-text).

---

## Keywords

- electronic invoicing
- Peppol
- document exchange
- e-invoice
- UBL
- Advania
- Unimaze
- InExchange
- electronic document

## Categories

- **Primary:** Operations > Supply Chain
- **Secondary:** Finance > Tax/Audit

## Industries

- Professional Services
- Retail
- Distribution
- Manufacturing

## Supported Countries

- IS (Iceland)
- SE (Sweden)
- NO (Norway)
- DK (Denmark)
- FI (Finland)

## Supported Languages

- en-US (English)
- is-IS (Icelandic)

## App Version

28.0.0.0

## Support

- **URL:** https://www.origo.is/
- **Email:** bc-support@origo.is
- **Help URL:** https://bifrost.origo.is/en-us/iceland-docex/

## Privacy Policy

https://www.origo.is/

## EULA

Standard Microsoft AppSource EULA applies.

## Screenshots

1. Bifrost Setup showing document exchange providers configured.
2. Queue API demonstrating document exchange message submission.
3. UBL invoice XML output from RenderBilling operation.

---

## Full description text

### Connect Business Central to Leading Document Exchange Networks

**Bifrost Iceland DocEx** extends Business Central with electronic document exchange capabilities through the Bifrost platform — a message-based integration layer that gives external systems, AI agents, and automation tools structured access to Business Central data and procedures via OData. Send and receive electronic invoices, orders, and other business documents via multiple providers — without custom integrations or manual file handling.

Built on the **Bifrost Foundation** framework, this extension adds document exchange as a set of message types that any MCP-compatible client, REST caller, or BC process can invoke through the same Queue → Task → Data API pattern used across the entire Bifrost ecosystem.

### Who is this for?

**Finance and IT teams** at companies that send or receive electronic invoices and need to connect Business Central to document exchange networks (Peppol, Advania, Unimaze, InExchange). Eliminates manual file handling, provides full document lifecycle tracking, and ensures Peppol BIS 3.0 compliance.

**Target industries:** Professional services, retail, distribution, and manufacturing — any business that exchanges electronic invoices with trading partners across the Nordics and Europe.

### Supported Providers

**Advania** — Send, receive, and track electronic invoices and documents. Includes inbox management, status synchronization, trading partner lookup, document PDF retrieval, OCR processing, and XML conversion.

**Unimaze** — Send and receive electronic documents with full lifecycle management. Supports transaction submission, payment registration, rejection handling, and document validation.

**InExchange** — Receive incoming documents, send outbound invoices, track delivery status, and discover trading partners through buyer/seller lookup.

**BIS 3.0 Reference Data** — Built-in Peppol BIS 3.0 reference data including country codes, currencies, document type codes, electronic address schemes, unit codes, VAT codes, and more. No external credentials required.

**UBL Rendering** — Generate standards-compliant UBL 2.1 XML directly from Business Central documents. Render invoices, credit notes, orders, despatch advices, and statements in Peppol BIS 3.0 format.

### Key Capabilities

- **Multi-provider support** — Use one, two, or all providers simultaneously based on your trading partner requirements.
- **Unified API** — All providers accessed through the same Bifrost message pattern. No provider-specific integration code needed.
- **Peppol compliance** — UBL rendering and BIS 3.0 reference data ensure standards-compliant documents.
- **Full document lifecycle** — Receive, send, track status, retrieve PDFs, and manage trading partners.
- **Extensible** — Built on the Bifrost framework. Add custom providers or message types through AL extensions.

### How It Works

External systems or BC processes submit messages to the Bifrost queue API specifying the provider and operation (e.g., `DocumentExchange.Advania.GetUnread`). The framework dispatches each message to the appropriate provider handler, executes the operation, and returns results through the data API.

### Requirements and prerequisites

- Microsoft Dynamics 365 Business Central 28.0 or later (Essentials or Premium)
- Bifrost Foundation extension (available separately on AppSource)
- Provider credentials from at least one supported exchange network (Advania, Unimaze, or InExchange)
- BIS 3.0 reference data and UBL rendering work without external credentials
