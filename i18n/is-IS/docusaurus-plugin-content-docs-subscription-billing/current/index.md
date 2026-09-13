---
id: index
title: "Bifröst Subscription Billing"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Microsoft's Subscription Billing app made callable — 22 Bifröst message types for contracts, the billing pipeline, usage data, deferrals and migration."
---

Bifröst Subscription Billing makes Microsoft's **Subscription Billing** app callable úr outside Business Central. It builds on Bifröst Foundation og adds 22 message tegunds covering the operations that live behind a page action — applying a subscription package, attaching línur to a samningur, running a billing proposal, releasing deferrals — so an integration, an automation job eða an MCP client getur drive recurring billing end to end án a person clicking through the client.

Subscription Billing models recurring revenue well, but a generic færsla API reads og writes subscription færslur og then stops at the first button. This extension publishes one message tegund per operation that genuinely needs more than a færsla write: a Microsoft kóðiunit, færsla context at insert time, a stored view filter, eða a preview-and-rollback run. Anything a plain read eða a plain insert already covers er deliberately left to Foundation's `Data.Records.Get` og `Data.Records.Set`.

## What it does

- **Subscription línur** — apply a Subscription Package to a Subscription og let Microsoft's own derivation logic compute prices, billing rhythms og dagsetnings fyrir hver new lína.
- **Customer og vendor samningar** — attach unassigned Subscription Lines to a samningur, og bill a single samningur to an unposted sales eða purchase reikningur.
- **Billing pipelína** — build billing proposal línur fyrir a Billing Template og dagsetning range, then turn the proposal í skjöl in one bulk run, grouped per samningur eða per viðskiptavinur.
- **Preview án writing** — see exactly what a viðskiptavinur, vendor eða bulk billing run would produce. The work er performed against real data so the numbers eru true, then everything built fyrir the preview er removed again.
- **Usage-based billing** — deliver a usage skrá as data rather than through a skrá dialog, og advance it through Microsoft's own processing stages.
- **Deferrals, analysis og migration** — release deferred revenue og cost to the general ledger, rebuild samningur analysis entries, og turn staged import rows í real subscriptions og samningar.
- **Ekkert er ever deleted** — there eru no `*.Delete` message tegunds. Ending a subscription er an end dagsetning eða a closed flag, not a hard delete.
- **Self-skjaling samningur** — every message tegund answers its own Markdown help skjal, listing its parameters, a worked example, the response shape, the villur it raises og what it er safe to do.

## How it works

1. Install Microsoft's **Subscription Billing** app og run its assisted setup, so Subscription Contract Stilltuup, number series og at least one Billing Template exist.
2. Install **Bifröst Foundation** og activate it.
3. Install **Bifröst Subscription Billing** og assign the permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) alongside the caller's Foundation permissions.
4. External systems send Bifröst messages heitid `Subscription.<Domain>.<Action>` through the same queue, verkþáttur og data pattern used by the rest of Bifröst.
5. Every write runs inside a shared isolated-transaction wrapper, so a failure partway through rolls back cleanly og returns a structured villa rather than leaving half-written færslur — með the skjaled exceptions noted in the [message tegund guide](./message-types).

## Skilaboð tegunds

| Domain | Skilaboð tegunds |
| --- | --- |
| Subscription línur | `Subscription.Line.Create` |
| Customer samningar | `Subscription.Contract.GetLines`, `Subscription.Contract.CreateInvoice`, `Subscription.Contract.PreviewInvoice`, `Subscription.Contract.UpdateLineDates`, `Subscription.Contract.UpdateExchangeRates` |
| Vendor samningar | `Subscription.VendorContract.GetLines`, `Subscription.VendorContract.CreateInvoice`, `Subscription.VendorContract.PreviewInvoice` |
| Billing pipelína | `Subscription.Billing.CreateProposal`, `Subscription.Billing.CreateDocuments`, `Subscription.Billing.PreviewDocuments` |
| Price updagsetnings | `Subscription.PriceUpdate.SetTemplateFilter`, `Subscription.PriceUpdate.CreateProposal`, `Subscription.PriceUpdate.Perform` |
| Renewal | `Subscription.Renewal.Extend`, `Subscription.Renewal.CreateQuote` |
| Usage | `Subscription.Usage.ImportData`, `Subscription.Usage.Process` |
| Deferrals | `Subscription.Deferral.Release` |
| Analysis | `Subscription.Analysis.Recalculate` |
| Import | `Subscription.Import.CreateContracts` |

Four of these — `Subscription.Contract.UpdateLineDates`, `Subscription.Contract.UpdateExchangeRates`, `Subscription.PriceUpdate.CreateProposal` og `Subscription.PriceUpdate.Perform` — eru registered og discoverable but return a structured villa instead of running, because Microsoft has not exposed a public API fyrir the underlying operation. Each one heitis the procedure that would need to become public og points at the client action that does the job today. See the [message tegund guide](./message-types).

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 eða later, Essentials eða Premium.
- Microsoft's **Subscription Billing** app installed og set up. This extension calls Microsoft's own kóðiunits og reports; it gerir ekki reimplement any of their logic.
- **Bifröst Foundation**, available separately on AppSource.
- The permission set **Bifrost Sub. Billing** (`BIFROST SubBil ori`) on top of the caller's Foundation permissions. It grants execute rights on this app's objects only; it gerir ekki widen access to Subscription Billing tables.

## Where to go next

- [Skilaboð tegund guide](./message-types) — the shared request og response samningur, what hver tegund does, og the limitations worth knowing áður en you call one
- [Skilaboð tegund reference](./reference/message-types/) — the request og response samningur fyrir every tegund, generated úr the app itself
- [In-product help](/help/subscription-billing/)
- [AppSource notandi scenarios](./user-scenarios)
- [Partner Center listing](./listing)
- [Build on Bifröst](/extensibility/)
