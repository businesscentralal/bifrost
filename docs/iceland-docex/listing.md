---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts into Partner Center when creating or updating the offer listing.

---

## Offer Name
Bifrost Iceland DocEx

## Search Result Summary (max 50 chars)
Send and receive e-invoices via Advania, Unimaze

## Offer Summary (max 100 chars)
Send and receive Peppol e-invoices in Business Central through Advania and Unimaze, from any assistant.

## Search Keywords
1. E-invoice
2. Peppol
3. Document exchange

## Categories
- **Primary:** Finance > Accounting
- **Secondary:** IT & Admin Tools > Data Integration

## Industries
- Professional Services
- Distribution
- Retail and Consumer Goods
- Manufacturing

## Supported Countries
- Iceland

## Supported Languages
- English (en-US)
- Icelandic (is-IS)

---

## Description

The full description text is [below](#full-description-text).

---

## Help Link
https://docs.bifrost.origo.is/en-us/iceland-docex/

## Support Link
https://www.origo.is/

## Privacy Policy
https://docs.bifrost.origo.is/en-us/licensing/privacy/

## Terms of Use
https://docs.bifrost.origo.is/en-us/licensing/eula/

## Products your app works with
- Dynamics 365 Business Central

## Dependencies
- Bifrost Foundation (Origo), required, available separately on AppSource

---

## Full description text

**Bifrost Iceland DocEx** lets your assistant, your integrations and your routines send and receive
electronic invoices in Business Central. It connects Business Central to the Advania and Unimaze
document exchange networks in Iceland, in the Peppol BIS 3.0 format.

### What it does

- **Send posted invoices and credit memos.** Send a posted sales invoice or credit memo as a Peppol
  BIS 3.0 e-invoice, with its PDF. The posted document is marked as sent, and a document that was
  already sent is not sent again by mistake.
- **Follow what you sent.** Bring the delivery status of sent documents into Business Central, read
  their history and validation results, and open them as the recipient sees them.
- **Receive invoices.** Bring received invoices and credit notes into Business Central as incoming
  documents, with their PDFs and other files, each one only once.
- **Turn them into purchase documents or journal lines.** The vendor is found by its kennitala, Peppol
  codes are translated into your own codes, lines are posted to the accounts you decide per vendor and
  VAT percentage, and the total matches the amount the supplier asks to be paid.
- **Answer the supplier.** Tell a supplier through Unimaze that an invoice has been paid, or reject it
  with a reason.
- **Check a recipient before you send**, and look up the Peppol BIS 3.0 code lists.

### How it works

Bifrost Iceland DocEx adds operations to Bifrost Foundation. Each one is a complete Business Central task
that explains itself to the assistant: what it is for, what it needs and what it changes. Your assistant
(Copilot, ChatGPT, Claude or another) calls them through the Bifrost MCP server; integrations and
routines call them through the Bifrost API or the Bifrost queue. Every call runs with the user's own
Business Central permissions and is logged in the company.

### Control

- Credentials are kept in protected storage, per network and per environment, and never shown again.
- Every call to a network is logged with the credentials masked.
- A Test environment for each network, so you can send a document from start to finish before you go
  live.

### Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later (Essentials or Premium), for companies in Iceland
- Bifrost Foundation (available separately on AppSource)
- An agreement with Advania or Unimaze for document exchange
- For the price, contact your Business Central partner
