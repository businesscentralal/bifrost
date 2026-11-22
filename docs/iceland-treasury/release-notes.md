---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Iceland Treasury published on Microsoft AppSource."
---

# Bifröst Iceland Treasury release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Iceland Treasury published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.0.3 — 22 November 2026

### Added

- Reverse payment and claim tracking records. A reversal is a local bookkeeping step in Business Central: it marks the records as Reversed with a reason, and sends nothing to the bank. It needs its own permission set, so you decide who may do it. See [Reversing payment and claim tracking](/iceland-treasury/tracking-reversal/).
- Payment and claim tracking records are kept for seven years. They are registered with the Business Central retention policies, and a payment or claim is removed only when everything that belongs to it is completed and at least seven years old.
- Personal Landsbankinn API keys are honored when you enable the Landsbankinn connections. The personal key is used before the company key, and the guidance when a key is missing names both places to set it up.
- The Iceland Treasury setup page shows the secure connection status (Connected, Not connected, or Not connected (not an AppSource install)), with an action to check it again. No secret names or values are shown.

### Changed

- No Treasury operation asks for a confirmation count any more. Treasury posts nothing in Business Central: reads change nothing, and what it sends to a bank (payments, claims, claim templates, card ledger keys, electronic documents) can be updated, cancelled or sent again, so an assistant or another app treats these as ordinary changes. Older callers that still send a count keep working; the count is ignored.
- Errors from Treasury now follow the error format of Bifröst Foundation. Every error carries a code and a text, and the help for each operation describes the errors it can return truthfully, including errors that had no code before.
- The overview help names the refusal codes you can meet, in English and Icelandic.

### Fixed

- Landsbankinn card lists, and the help that describes them, are correct, and the translated help follows the language of the request.
- Bank statements are read correctly regardless of the decimal separator of the Business Central language or region. A statement with decimals no longer fails or changes value because of the culture of the session.
- When you copy a company to a sandbox, the bank credentials are not carried over. A sandbox cannot use the bank connections of the company it was copied from.
- Treasury installs and runs on Business Central 28.4, and registers its operations correctly when Bifröst Foundation starts.

## 28.0.2 — 28 October 2026

### Added

- The Icelandic savings banks are offered again: statements, currency rates, account verification, claims and domestic payment batches. If a savings bank asks for a different signing method, change it on that bank's row in the Treasury setup.
- Claim collection agencies Gjaldskil and InKasso: create, change, cancel and read claims, and read claim payments, with the same claim tracking as the banks. Each agency has its own row in the setup and needs only a user name and password, no certificate.
- Íslandsbanki domestic (ISK) payment batches are offered again, on the bank's own payment service. A batch holds transfers and claim payments, is debited once for its total, and is approved and paid by a person in the Íslandsbanki online bank. Bifröst never approves or pays it. Once the batch is approved, the bank no longer lets Bifröst read it, so it shows the status Unknown and the statement of the debited account confirms its payments as paid.

### Changed

- Bank claim payments can now be updated by users with the permission for them, for example to add posting information. Claim payments are still created and removed only by Bifröst.

### Fixed

- Kvika banki payments accept an account number written with dashes. The number is sent to the bank in the form it requires.
- Requests to Landsbankinn for claim templates and foreign payments work again with Bifröst Foundation 28.0.10, which refuses request values an operation does not declare.

## 28.0.1 — 24 October 2026

### First version on Microsoft AppSource

- Read bank statements from Arion banki, Íslandsbanki, Kvika banki and Landsbankinn into Business Central bank reconciliation.
- Register payment batches at the bank, including foreign payments, and follow their status. What each bank supports is on its [bank page](/iceland-treasury/banks/arion).
- Create claims (*kröfur*) for your customers, follow them, and confirm from the bank statement that a claim has been paid.
- Set up only the banks you use. Bank credentials stay in protected storage, and separate permission sets let you give each task to the people who may do it.
