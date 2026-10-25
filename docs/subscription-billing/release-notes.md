---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Subscription Billing published on Microsoft AppSource."
---

# Bifröst Subscription Billing release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Subscription Billing published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.0.1 — 25 October 2026

### Changed

- Your AI assistant finds the right Subscription Billing operation more easily. Every operation now has a broader set of search phrases, in English and in Icelandic.
- Each operation's description now says which related operation to use instead, so the assistant is less likely to pick the wrong one.
- The billing run shows the optional billing template filter as its first step. Adding lines to a vendor invoice and deleting usage data now also describe the steps that go with them: the invoice alternative, and the reset before usage is processed again.
- The help text of several operations no longer mentions internal programming terms, and the overview of four operations now says when to use them: creating contracts from an import, recalculating analysis figures, releasing deferrals and processing usage.
- No operation, permission or behaviour changed. Everything that worked in 28.0.0 works the same way.

### Fixed

- The description of the operation that extends a subscription during renewal said it creates a new contract. It extends the existing subscription, and the description now says so.
- The description of the operation that creates invoices from a contract now says it can also create a credit memo.
- One operation description was too long and another referred to an internal object. Both were corrected.
- Corrected missing apostrophes in the descriptions of three operations (updating exchange rates, deleting usage data and disconnecting a subscription), and typos in two Icelandic texts (posting documents and merging contract lines).
- The Icelandic keyword list of the operation that merges contract lines was one entry short. It is complete now.

## 28.0.0 — 20 October 2026

### First version on Microsoft AppSource

- Run recurring billing from an assistant, an integration or a scheduled routine, using the logic of Microsoft's Subscription Billing app. The results appear on the standard Subscription Billing pages.
- Put subscriptions on contracts and bill a single contract or a whole billing run, from the billing proposal to the posted documents. Undo a run that is not posted yet.
- Preview what a contract or a billing run would produce, with real figures, before anything is kept.
- Bill for usage: deliver usage data, connect it to its subscriptions and move it through the processing stages.
- Keep contracts current and close the period: close ended lines, update prices and exchange rates, release deferrals to the general ledger and create renewal quotes.
- Move subscriptions into Business Central from staged import rows. Posting is a separate permission, so creating billing documents and posting them can be given to different people.
