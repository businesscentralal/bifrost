---
id: index
title: "Bifröst Subscription Billing"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Microsoft's Subscription Billing app made callable — 22 Bifröst message types for contracts, the billing pipeline, usage data, deferrals and migration."
---

Bifröst Subscription Billing makes Microsoft's **Subscription Billing** app callable from outside Business Central. It builds on Bifröst Foundation and adds 22 message types covering the operations that live behind a page action — applying a subscription package, attaching lines to a contract, running a billing proposal, releasing deferrals — so an integration, an automation job or an MCP client can drive recurring billing end to end without a person clicking through the client.

Subscription Billing models recurring revenue well, but a generic record API reads and writes subscription records and then stops at the first button. This extension publishes one message type per operation that genuinely needs more than a record write: a Microsoft codeunit, record context at insert time, a stored view filter, or a preview-and-rollback run. Anything a plain read or a plain insert already covers is deliberately left to Foundation's `Data.Records.Get` and `Data.Records.Set`.

## What it does

- **Subscription lines** — apply a Subscription Package to a Subscription and let Microsoft's own derivation logic compute prices, billing rhythms and dates for each new line.
- **Customer and vendor contracts** — attach unassigned Subscription Lines to a contract, and bill a single contract to an unposted sales or purchase invoice.
- **Billing pipeline** — build billing proposal lines for a Billing Template and date range, then turn the proposal into documents in one bulk run, grouped per contract or per customer.
- **Preview without writing** — see exactly what a customer, vendor or bulk billing run would produce. The work is performed against real data so the numbers are true, then everything built for the preview is removed again.
- **Usage-based billing** — deliver a usage file as data rather than through a file dialog, and advance it through Microsoft's own processing stages.
- **Deferrals, analysis and migration** — release deferred revenue and cost to the general ledger, rebuild contract analysis entries, and turn staged import rows into real subscriptions and contracts.
- **Nothing is ever deleted** — there are no `*.Delete` message types. Ending a subscription is an end date or a closed flag, not a hard delete.
- **Self-documenting contract** — every message type answers its own Markdown help document, listing its parameters, a worked example, the response shape, the errors it raises and what it is safe to do.

## How it works

1. Install Microsoft's **Subscription Billing** app and run its assisted setup, so Subscription Contract Setup, number series and at least one Billing Template exist.
2. Install **Bifröst Foundation** and activate it.
3. Install **Bifröst Subscription Billing** and assign the permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) alongside the caller's Foundation permissions.
4. External systems send Bifröst messages named `Subscription.<Domain>.<Action>` through the same queue, task and data pattern used by the rest of Bifröst.
5. Every write runs inside a shared isolated-transaction wrapper, so a failure partway through rolls back cleanly and returns a structured error rather than leaving half-written records — with the documented exceptions noted in the [message type guide](./message-types).

## Message types

| Domain | Message types |
| --- | --- |
| Subscription lines | `Subscription.Line.Create` |
| Customer contracts | `Subscription.Contract.GetLines`, `Subscription.Contract.CreateInvoice`, `Subscription.Contract.PreviewInvoice`, `Subscription.Contract.UpdateLineDates`, `Subscription.Contract.UpdateExchangeRates` |
| Vendor contracts | `Subscription.VendorContract.GetLines`, `Subscription.VendorContract.CreateInvoice`, `Subscription.VendorContract.PreviewInvoice` |
| Billing pipeline | `Subscription.Billing.CreateProposal`, `Subscription.Billing.CreateDocuments`, `Subscription.Billing.PreviewDocuments` |
| Price updates | `Subscription.PriceUpdate.SetTemplateFilter`, `Subscription.PriceUpdate.CreateProposal`, `Subscription.PriceUpdate.Perform` |
| Renewal | `Subscription.Renewal.Extend`, `Subscription.Renewal.CreateQuote` |
| Usage | `Subscription.Usage.ImportData`, `Subscription.Usage.Process` |
| Deferrals | `Subscription.Deferral.Release` |
| Analysis | `Subscription.Analysis.Recalculate` |
| Import | `Subscription.Import.CreateContracts` |

Four of these — `Subscription.Contract.UpdateLineDates`, `Subscription.Contract.UpdateExchangeRates`, `Subscription.PriceUpdate.CreateProposal` and `Subscription.PriceUpdate.Perform` — are registered and discoverable but return a structured error instead of running, because Microsoft has not exposed a public API for the underlying operation. Each one names the procedure that would need to become public and points at the client action that does the job today. See the [message type guide](./message-types).

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- Microsoft's **Subscription Billing** app installed and set up. This extension calls Microsoft's own codeunits and reports; it does not reimplement any of their logic.
- **Bifröst Foundation**, available separately on AppSource.
- The permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) on top of the caller's Foundation permissions. It grants execute rights on this app's objects only; it does not widen access to Subscription Billing tables.

## Where to go next

- [Message type guide](./message-types) — the shared request and response contract, what each type does, and the limitations worth knowing before you call one
- [Message type reference](./reference/message-types/) — the request and response contract for every type, generated from the app itself
- [In-product help](/help/subscription-billing/)
- [AppSource user scenarios](./user-scenarios)
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
