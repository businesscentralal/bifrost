---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Iceland DocEx published on Microsoft AppSource."
---

# Bifröst Iceland DocEx release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Iceland DocEx published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.0.1 — 21 November 2026

### Bug-fix release

#### E-invoices

- The seller's VAT number is filled in from **Company Information** when you do not send one, so the network no longer refuses invoices with standard-rated VAT. If neither exists, you are told what is missing.
- The seller's kennitala is filled in from **Registration No.** on **Company Information** as the endpoint and party identifier. The VAT number is never used as one.
- Kennitalas are written as ten digits, also when they arrive with a hyphen or the `0196:` prefix. A kennitala of the wrong length is refused before anything is stored.
- Totals you leave out are calculated from the lines. A total that does not match the lines is refused.
- A line without a unit code gets the default unit code `C62` instead of an empty one.
- A party without an address gets one from **Company Information**, from the posted document or from the customer card. An Icelandic party that still has no street name or postcode is refused with a clear message instead of an invoice the network would reject.
- Statements show debit and credit amounts with the right signs, and invoice references use the document reference you give instead of an item name.
- When you check an invoice, every problem is listed at once instead of one at a time.

#### Incoming documents

- An invoice kept as an incoming document uses the supplier details of the sender. Your own company's VAT number and defaults are no longer filled in for a supplier.
- The supplier's kennitala is stored on the incoming document, and shown on its card, for e-invoices from Advania and Unimaze and for invoices your assistant turns into e-invoices.

#### Safer set-up

- A request with missing or malformed information is refused with a clear message, in English or Icelandic, before any call is made to a network.
- When Business Central copies a company to a sandbox, the stored network credentials are cleared and every network set to **Production** is switched to **Test**. A sandbox can no longer send documents with production credentials.
- **Document Exchange Setup** shows the secure connection status, with an action to refresh it.
- The environment names on **Document Exchange Setup** are now **Production** and **Test**. Your existing choices are kept.

## 28.0.0 — 21 October 2026

### First version on Microsoft AppSource

- Send posted sales invoices and credit memos as Peppol BIS 3.0 e-invoices through Advania or Unimaze. A document that was already sent is not sent again unless you ask for it on purpose.
- Keep the delivery status of every sent document up to date on the posted document.
- Receive invoices and credit notes as incoming documents, with their PDF and other files, and turn them into purchase invoices or general journal lines.
- Bring in invoices that arrive as a PDF, a scan or a photo, and let your assistant turn them into e-invoices.
- Tell a supplier that an invoice is paid or rejected, and check that a customer can receive e-invoices before you send.
- Start on the network's test environment. Credentials are stored per network and per environment, and every call to a network is logged.
