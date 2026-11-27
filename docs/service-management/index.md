---
id: index
title: "Bifröst Service Management"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Service orders, allocation, posting, loaners, service quotes and service contracts in Business Central from an assistant or integration."
---

# Bifröst Service Management

Bifröst Service Management lets service teams run Business Central's Service Management from an assistant or integration: release and reopen service orders, allocate resources, convert quotes, post and undo service work, lend loaner equipment and run service contract billing. It uses the standard Service Management logic of Business Central, so the results appear on the standard service pages.

An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with [How Bifröst works](/documentation/how-it-works/).

## What you can do

- **Release and reopen service orders**, with Business Central's own checks.
- **Allocate a resource or resource group** to a service item line, or reallocate it. A service zone outside the one set up for the order is refused unless you explicitly accept it.
- **Convert a service quote into a service order.**
- **Suggest resources and fault resolutions.** Rank resources for a service item line by skills, service zone and free hours in a period, and rank resolution codes by the fault codes and the service item group. Suggestions change nothing.
- **Adjust prices** on the service lines of one service item line from a service price group, with a preview and a reset.
- **Post service orders** (ship, invoice, ship and invoice, or ship and consume), preview the posting first, and **undo** posted shipment or consumption lines.
- **Bill without an order**: collect compatible shipments onto one invoice, preview the posting, and post invoices or credit memos.
- **Lend and receive loaner equipment** against open order lines, posted shipment lines or loaner numbers.
- **Run service contracts**: convert a contract quote, sign, lock and unlock a contract, and create invoices, service orders or a credit memo for a bounded set of contracts. The documents are created unposted, and the contract lines are kept.

## Before you start

1. Follow [Set it up](/setup/) to prepare Foundation and connect your assistant or integration.
2. Install Bifröst Service Management. Service Management is part of Business Central's base application and needs a Premium license for the users who work with it. Have your administrator set up Service Management in Business Central: service setup, number series, service item groups, price groups, zones, skills and contract templates, as you use them.
3. Ask your administrator for the app's full permission set and the Business Central permissions for the service work you do. The read-only set cannot change anything. Posting needs a separate posting permission that is not part of the full or read-only sets.
4. Try the work with sample data first and review the results in Business Central.

## Review before posting or changing contracts

Posting a service order or document, and undoing a posted shipment or consumption, change your books and stock and cannot be reversed by repeating the request. Preview a posting first, and check the order, quantities and posting option before you confirm. Posting runs only after you confirm it.

Contract runs are bounded: you state the contracts and the expected number, and the run is refused if the number does not match. A failed run is rolled back as a whole. Creating invoices or service orders again can create additional documents, so check what exists before retrying.

The app adds no pages of its own. Review the results on the standard Service Management pages, such as **Service Orders**, **Service Quotes**, **Service Contracts** and **Posted Service Shipments**.

Next: follow the [user scenarios](./user-scenarios.md), or read the [release notes](./release-notes.md).
