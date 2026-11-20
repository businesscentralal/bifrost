---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Subscription Billing published on Microsoft AppSource."
---

# Bifröst Subscription Billing release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Subscription Billing published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.0.2 — 20 November 2026

### Added

- A setup wizard, **Set up Bifrost Subscription Billing**, is now part of Business Central's assisted setup. It explains what the app adds, shows whether your assistant or integration can reach the app, points you to where that access is switched on, and describes the two permission sets you can assign. The wizard only guides: it does not change settings or assign access.
- The Subscription Billing operations now appear in a company only when a number series is set for subscription contracts (customer or vendor) on **Subscription Contract Setup**. A company that has not set up contracts no longer shows operations it cannot use. A change in the setup takes effect on the next call, without a restart.
- Operations that cannot be undone now state what they count and ask you to confirm that count before they run. This covers the price update, removing a contract line and removing an item assignment from a package, and 18 further operations that act on a number of records. Without a confirmed count, the operation reports how many records it would affect and changes nothing.

### Changed

- When a request is refused, the answer now says what was wrong, which value caused it and what to do next, in English and Icelandic. A request with several problems reports all of them at once, so they can be fixed in one go instead of one at a time.
- Each operation now reads only the values that its own description lists. A value that belongs to a different operation is ignored, so it can no longer affect the result.
- Refusals for vendor documents that Subscription Billing cannot post now point to the operation that posts them.
- The price update now counts the update lines it would perform, whether or not a template is named, and asks for confirmation of that number. Before, a call that named no template could perform every line without confirmation.
- Descriptions of several operations explain more clearly what they change and in what order to use them. The renewal quote description notes that dates in the quote text follow the regional settings of your Business Central session.
- Billing terms in the Icelandic texts are now consistent, for example "reikningskeyrsla" for a billing run.
- Bifröst Subscription Billing now needs Bifröst Foundation 28.0.11 or later.

### Fixed

- Recalculating analysis figures for a contract now changes and counts only that contract, and refuses a contract that does not exist before anything is changed. If a contract number exists for both a customer and a vendor, the operation asks you to say which one instead of picking one.
- Adding lines to a vendor invoice now refuses a contract that belongs to a different invoice vendor, and no longer counts text lines as added lines.
- Creating a renewal quote now selects the same contract lines as Microsoft's own renewal: open lines with an end date and no planned subscription line. Lines closed by an earlier merge are left out.
- When processing a usage data import fails, the import and its file are kept, and the answer says how to delete or retry it. Processing now reports an error when its own lines are in error, even if the import header shows none.
- When posting billing documents fails part-way, the answer lists which documents were posted, which failed and which were not tried. Documents that were already posted stay posted.
- Refusal texts no longer end without a full stop in date format messages, and always name both accepted parameters where either may be given.
- A license administrator with restricted rights can now open Bifröst Setup and see Subscription Billing listed there.

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
