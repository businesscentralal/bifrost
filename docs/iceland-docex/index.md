---
id: index
title: "Bifröst Iceland DocEx"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Electronic document exchange for Business Central through Advania, Unimaze and InExchange, with Peppol BIS 3.0 data and UBL rendering."
---

# Bifröst Iceland DocEx

**Send and receive electronic invoices from Business Central.** Bifröst Iceland DocEx connects
Business Central to the Advania, Unimaze and InExchange document exchange networks, in the Peppol
BIS 3.0 format.

Received invoices arrive as incoming documents in Business Central, ready to become purchase
documents. You use the same setup and the same steps whichever network you are on.

*An add-on to [Bifröst Foundation](/foundation/), for companies in Iceland. New to Bifröst? Start
with [How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Receive invoices as incoming documents.** A received document becomes a Business Central
  incoming document, handled by Foundation's **Incoming** capability. Each document is created
  only once, and then becomes a purchase document or general journal lines, as set for the vendor.
- **Send invoices and other documents.** Send invoices, credit notes, orders, despatch advices and
  statements from Business Central documents, as UBL 2.1 XML in the Peppol BIS 3.0 format.
- **Follow each document.** Check the inbox and sent lists, read a document's status and history,
  and get its PDF. With Unimaze you can also register a payment or a rejection.
- **Find your trading partners.** Look up buyers, sellers and trading partners on the network
  before you send.
- **Post incoming lines to the right accounts.** Map a vendor's lines to fixed G/L accounts per VAT
  percentage, and translate Peppol codes into the codes your company uses.

## Get it

Install **Bifrost Iceland DocEx** next to Bifröst Foundation, from AppSource or through your
partner. It needs Business Central 28.0 or later, Essentials or Premium.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Get credentials from at least one network: Advania, Unimaze or InExchange. The Peppol reference data needs none. | Finance, with the network provider |
| 2 | Allow HTTP requests for the extension. The setup page reminds you if it is not allowed. | Business Central administrator |
| 3 | On **Bifröst Setup**, open **Bifrost Iceland DocEx Setup**. Choose Live or Test for each network you use, enter its credentials and test the connection. | Business Central administrator |
| 4 | If you receive invoices, choose **Update BII Data Exchange Definitions**, then fill in the BIS30 Code Map and the VAT G/L Account Map. | Business Central administrator or partner |
| 5 | Give each user or service that sends or receives documents the Bifrost Iceland DocEx permission set. | Business Central administrator |

The step-by-step guides are in the in-product help:
[DocEx Setup](/help/iceland-docex/docex-setup/),
[BIS30 Code Map](/help/iceland-docex/bis30-code-map/) and
[Vendor VAT G/L Account Map](/help/iceland-docex/vend-vat-gl-map/).

## Good to know

- **It acts as the caller.** The permission set lets a user run document exchange operations only,
  with no access beyond what it grants.
- **Credentials are stored per network and per environment** in Business Central's Isolated
  Storage, so a Test key is never used for a Live call. The setup page shows only whether a value
  is stored.
- **Every call to a network is logged** on the Bifröst Request Log, with the credentials masked, so
  a failed exchange can be traced.
- **Sending a document is real.** On a Live environment it goes to the recipient. Try sending in
  the Test environment first.
- **Moving from Origo Cloud Events DocEx?** Install this app beside it. Code maps and VAT G/L
  account maps are copied, but credentials do not carry over. Enter them again.

## Capabilities and reference

Capability: **`DocumentExchange`**. Its directory of types is `Help.DocumentExchange.Get`.

What each message type does, in plain words: [Capabilities](./capabilities).

- [Message type reference](./reference/message-types/): the contract of every type, generated from the app itself
- [In-product help](/help/iceland-docex/)
- [AppSource validation scenarios](./user-scenarios) · [AppSource listing text](./listing)
- Permission set: **Bifrost Iceland DocEx**.
