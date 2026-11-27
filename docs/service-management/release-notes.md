---
id: release-notes
title: "Service Management release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "Customer-facing changes in Bifröst Service Management."
---

# Bifröst Service Management release notes

These notes help service teams and administrators review what the app changes. To check your installed version, open **Extension Management** in Business Central.

## 28.0.0 — date set at release

### Initial capabilities

- Release and reopen service orders using Business Central's standard checks.
- Allocate or reallocate a resource or resource group on a service item line, with a refusal outside the service zone unless you accept it.
- Convert a service quote into a service order. The request no longer asks for a count of lines.
- Suggest resources by skills, service zone and available hours, and suggest fault resolution codes. Suggestions change nothing.
- Adjust service line prices from a service price group, with a preview and a reset.
- Post service orders (ship, invoice, ship and invoice, or ship and consume) with a preview, including orders where the invoicing policy is mandatory. Posting uses a separate posting permission.
- Undo posted service shipment and consumption lines. Lines whose shipment created service items are refused so that no service item is deleted.
- Bill without an order: collect compatible shipments on one invoice, preview the posting, and post invoices and credit memos.
- Lend and receive loaner equipment, with the loan history kept.
- Convert a contract quote, sign, lock and unlock service contracts, and create invoices, service orders or a credit memo for a bounded set of contracts. The documents stay unposted, the contract lines are kept and a failed run is rolled back.
- Use English or Icelandic guidance, with the app available through Foundation and separate full and read access roles. A read-only user cannot run changes.

### Corrections included

- Posting keeps the customer when Business Central deletes a fully posted order, and returns the real first and last customer ledger entries for invoices and credit memos.
- Posting a quantity that was already shipped can be invoiced with the default or an explicit option.
- A service order or quote changed directly can no longer bypass the app's checks on status, resource and loaner fields.
- Clearer refusals that name the document type in your language, and for users without the permission to change service documents.
