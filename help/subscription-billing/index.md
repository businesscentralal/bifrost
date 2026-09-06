---
id: index
title: "Bifröst Subscription Billing — Help"
sidebar_label: "Bifröst Subscription Billing — Help"
sidebar_position: 1
slug: /
---

**Bifröst Subscription Billing** is the subscription module of the Bifröst platform, a Business Central extension by Origo. It makes Microsoft's **Subscription Billing** app callable from outside Business Central, by publishing 22 Bifröst message types for the operations that otherwise live behind a page action.

## This extension has no pages of its own

There is nothing to open in the Business Central client. The extension adds no pages, no page extensions, no actions and no fields to any existing page — it is operated entirely through Bifröst message types.

What it does add is visible in the standard Subscription Billing pages: a billing proposal built by `Subscription.Billing.CreateProposal` appears in **Recurring Billing**, an invoice created by `Subscription.Contract.CreateInvoice` appears in **Sales Invoices**, and so on. Use Microsoft's own pages to review the results.

Two things are configured outside this extension:

- **Bifrost Setup**, in Bifröst Foundation, holds the platform settings the message queue runs on. See [Bifrost Setup](/help/foundation/bifrost-setup/).
- **Subscription Contract Setup**, number series, Billing Templates and posting setup belong to Microsoft's Subscription Billing app and are set up there.

## Message Types

| Message Type | Description |
| --- | --- |
| Subscription.Line.Create | Applies a Subscription Package to a Subscription and creates the resulting Subscription Lines. |
| Subscription.Contract.GetLines | Attaches unassigned Subscription Lines to a customer Subscription Contract. |
| Subscription.Contract.CreateInvoice | Bills one customer Subscription Contract to an unposted sales invoice. |
| Subscription.Contract.PreviewInvoice | Shows what Subscription.Contract.CreateInvoice would bill, without keeping anything. |
| Subscription.Contract.UpdateLineDates | Blocked: no public API exists for rolling contract line dates forward. Always returns a structured error. |
| Subscription.Contract.UpdateExchangeRates | Blocked: no public API exists, and the underlying flow is unsafe unattended. Always returns a structured error. |
| Subscription.VendorContract.GetLines | Attaches unassigned Subscription Lines to a vendor Subscription Contract. |
| Subscription.VendorContract.CreateInvoice | Bills one vendor Subscription Contract to an unposted purchase invoice. Never posts. |
| Subscription.VendorContract.PreviewInvoice | Shows what Subscription.VendorContract.CreateInvoice would bill, without keeping anything. |
| Subscription.Billing.CreateProposal | Generates billing proposal lines for a Billing Template and billing date. |
| Subscription.Billing.CreateDocuments | Turns a template's unbilled proposal lines into sales or purchase documents in bulk. |
| Subscription.Billing.PreviewDocuments | Reads a template's existing proposal lines and reports how they would group into documents. Read-only. |
| Subscription.PriceUpdate.SetTemplateFilter | Writes the contract, subscription or line view filter on a Price Update Template. |
| Subscription.PriceUpdate.CreateProposal | Blocked: no public API exists for building a price update proposal. Always returns a structured error. |
| Subscription.PriceUpdate.Perform | Blocked: no public API exists for applying a price update proposal. Always returns a structured error. |
| Subscription.Renewal.Extend | Extends a Subscription onto a customer and/or vendor Subscription Contract. |
| Subscription.Renewal.CreateQuote | Builds contract renewal lines and a renewal sales quote for a customer contract. |
| Subscription.Usage.ImportData | Imports a usage data file, as text or base64, into Usage Data Import lines. |
| Subscription.Usage.Process | Advances a Usage Data Import entry through its remaining processing stages. |
| Subscription.Deferral.Release | Releases deferred revenue and cost up to a date and posts the release to the general ledger. |
| Subscription.Analysis.Recalculate | Rebuilds Subscription Contract analysis entries as of today. |
| Subscription.Import.CreateContracts | Creates real Subscriptions and contracts from staged import rows. |

Call `Help.MessageTypes.Get` for the registered catalogue, or ask any single message type for its own help document with `Help.Implementation.Get` to see its exact request parameters, response fields and error cases.

## Getting Started

1. Install and set up Microsoft's **Subscription Billing** app, so Subscription Contract Setup, number series and a Billing Template exist.
2. Install and activate **Bifröst Foundation**.
3. Install **Bifröst Subscription Billing**.
4. Assign the permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) to the calling user or service, in addition to their Bifröst Foundation permissions.
5. Send Bifröst messages named `Subscription.<Domain>.<Action>` through the Bifröst queue.
6. Review the results in Microsoft's own Subscription Billing pages.

## Learn More

- [Product documentation](/subscription-billing/) — what the extension does, how it works and what it requires
- [Message type guide](/subscription-billing/message-types) — the shared request and response contract, and the limitations worth knowing before you call one
- [Message type reference](/subscription-billing/reference/message-types/) — the request and response contract for every type
- [Bifrost Setup](/help/foundation/bifrost-setup/) — the Bifröst Foundation page holding the platform settings
