---
name: bifrost-subscription-billing
description: >
  Message types added to the Bifröst API by Bifrost Subscription Billing. Microsoft's
  Subscription Billing app made callable — 22 Bifröst message types for contracts, the billing
  pipeline, usage data, deferrals and migration. Load alongside bifrost-bc-integration, which
  carries the API itself; this skill is the index of what Subscription Billing adds — 22
  message types across 1 family (Subscription.*).
license: MIT
metadata:
  version: 1.0.0
  updated: 2026-09-06
  app: Bifrost Subscription Billing
  messageTypes: 22
  source: https://github.com/businesscentralal/bifrost
---

# Subscription Billing message types

Microsoft's Subscription Billing app made callable — 22 Bifröst message types for contracts, the billing pipeline, usage data, deferrals and migration.

---

## When to load this skill

Load it together with the core skill when:

- recurring revenue has to be billed — contracts, billing proposals, billing documents or subscription analysis;
- a contract has to be previewed before it is invoiced.

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](../bifrost-bc-integration/SKILL.md) and are not repeated here.

---

## Hard rules

- Preview before you create. The proposal and preview message types exist so that a billing run can be inspected before it produces documents.
- A billing run is not idempotent. Creating documents twice from the same proposal bills the customer twice.
- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.
- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.
- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.

---

## Reference pages

**Reference base:** `../../subscription-billing/reference/` — every path below is relative to it.

Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.
From the deployed site the same paths resolve against this file’s own URL.

### `Subscription.*` (22)

| Message type | Page |
| --- | --- |
| `Subscription.Analysis.Recalculate` | `message-types/subscription-analysis-recalculate/` |
| `Subscription.Billing.CreateDocuments` | `message-types/subscription-billing-createdocuments/` |
| `Subscription.Billing.CreateProposal` | `message-types/subscription-billing-createproposal/` |
| `Subscription.Billing.PreviewDocuments` | `message-types/subscription-billing-previewdocuments/` |
| `Subscription.Contract.CreateInvoice` | `message-types/subscription-contract-createinvoice/` |
| `Subscription.Contract.GetLines` | `message-types/subscription-contract-getlines/` |
| `Subscription.Contract.PreviewInvoice` | `message-types/subscription-contract-previewinvoice/` |
| `Subscription.Contract.UpdateExchangeRates` | `message-types/subscription-contract-updateexchangerates/` |
| `Subscription.Contract.UpdateLineDates` | `message-types/subscription-contract-updatelinedates/` |
| `Subscription.Deferral.Release` | `message-types/subscription-deferral-release/` |
| `Subscription.Import.CreateContracts` | `message-types/subscription-import-createcontracts/` |
| `Subscription.Line.Create` | `message-types/subscription-line-create/` |
| `Subscription.PriceUpdate.CreateProposal` | `message-types/subscription-priceupdate-createproposal/` |
| `Subscription.PriceUpdate.Perform` | `message-types/subscription-priceupdate-perform/` |
| `Subscription.PriceUpdate.SetTemplateFilter` | `message-types/subscription-priceupdate-settemplatefilter/` |
| `Subscription.Renewal.CreateQuote` | `message-types/subscription-renewal-createquote/` |
| `Subscription.Renewal.Extend` | `message-types/subscription-renewal-extend/` |
| `Subscription.Usage.ImportData` | `message-types/subscription-usage-importdata/` |
| `Subscription.Usage.Process` | `message-types/subscription-usage-process/` |
| `Subscription.VendorContract.CreateInvoice` | `message-types/subscription-vendorcontract-createinvoice/` |
| `Subscription.VendorContract.GetLines` | `message-types/subscription-vendorcontract-getlines/` |
| `Subscription.VendorContract.PreviewInvoice` | `message-types/subscription-vendorcontract-previewinvoice/` |

---

## Related skills

- [bifrost-bc-integration](../bifrost-bc-integration/SKILL.md) — the API itself. Always load this one.
- [bifrost-foundation](../bifrost-foundation/SKILL.md) — Bifrost Foundation
- [bifrost-iceland](../bifrost-iceland/SKILL.md) — Bifrost Iceland
- [bifrost-iceland-treasury](../bifrost-iceland-treasury/SKILL.md) — Bifrost Iceland Treasury
- [bifrost-iceland-docex](../bifrost-iceland-docex/SKILL.md) — Bifrost Iceland DocEx
- [bifrost-bragi](../bifrost-bragi/SKILL.md) — Bifrost Bragi
- [bifrost-hnitbjorg](../bifrost-hnitbjorg/SKILL.md) — Bifrost Hnitbjorg
- [bifrost-nornir](../bifrost-nornir/SKILL.md) — Bifrost Nornir
- [bifrost-clockify](../bifrost-clockify/SKILL.md) — Bifrost Clockify
