---
id: incoming-documents
title: "Incoming documents from start to finish"
sidebar_label: "Incoming documents"
sidebar_position: 2
sidebar_custom_props:
  top: true
description: "Handle every incoming invoice in Business Central with your assistant: e-invoices from Advania and Unimaze, and PDF, scanned or photographed invoices turned into Peppol BIS 3.0 e-invoices with UBL rendering."
---

# Incoming documents from start to finish

**Every supplier invoice goes the same way, whatever it arrives as.** Together with
[Bifröst Foundation](/foundation/), Bifröst Iceland DocEx lets your assistant take an incoming
document from the first file to a purchase invoice or journal lines in Business Central. An e-invoice
from Advania or Unimaze is read as it is. An invoice that arrives as a PDF, a scan or a photo is first turned into
a Peppol BIS 3.0 e-invoice with **UBL rendering**, so Business Central reads it the same way.

## What each app does

| App | What it adds |
|---|---|
| **Bifröst Foundation** | Creates an incoming document from a file, adds more files to it, chooses which file is the main one, reads the document and its files, and creates the purchase invoice, credit memo or journal lines from it. |
| **Bifröst Iceland DocEx** | Brings e-invoices in from Advania and Unimaze, renders a UBL e-invoice from the data of a PDF, scanned or photographed invoice, finds the vendor by kennitala, translates Peppol codes and decides the G/L accounts. |

## Before you start

- Complete the setup on the [app page](/iceland-docex/#set-it-up): **Update BII Data Exchange
  Definitions**, each vendor's kennitala in **Registration No.**, the
  [BIS30 Code Map](/help/iceland-docex/bis30-code-map/), the
  [Vendor VAT G/L Account Map](/help/iceland-docex/vend-vat-gl-map/) and each vendor's
  **Incoming Doc. Posting Mode**.
- The person or service that does the work needs `BIFROST Full ori`.
- To turn PDF, scanned and photographed invoices into e-invoices you need an assistant that can read
  PDF files and images. UBL rendering itself needs no network agreement and no credentials.

## The workflow

| Step | What happens | E-invoice from a network | PDF, scan or photo |
|---|---|---|---|
| 1 | **Bring the document in.** An incoming document is created with the file attached. | The e-invoice is brought in with its XML and PDF. A document is brought in only once. | The file is added as a new incoming document, for example from an e-mail or a scan. |
| 2 | **Make an e-invoice of it.** | Not needed: the XML is the e-invoice. | The assistant reads the invoice and renders it as a Peppol BIS 3.0 e-invoice. The XML is added to the same incoming document and becomes its main file; the original file stays attached. |
| 3 | **Check it.** The vendor is found by kennitala, codes are translated through the BIS30 Code Map, and the total must match the amount the supplier asks to be paid. | | Compare the e-invoice with the original: vendor, dates, lines, VAT and total. |
| 4 | **Create the purchase document.** | A purchase invoice or credit memo, or general journal lines when the vendor's **Incoming Doc. Posting Mode** says so. Lines that are not items get their G/L account from the Vendor VAT G/L Account Map, or else from **Text-to-Account Mapping**. | The same. |
| 5 | **Review and post** the purchase document or journal lines in Business Central as usual. | | |
| 6 | **Close the loop with the supplier.** | Confirm the receipt to the network. Through Unimaze you can also tell the supplier the invoice is paid, or reject it with a reason. | Not needed. |

## What to ask your assistant

- *"Which invoices are waiting for us at Unimaze? Bring them in as incoming documents."*
- *"Incoming document 1042 is a PDF invoice. Make a Peppol e-invoice of it and add it to the document."*
- *"Show me the e-invoice you made next to the PDF: vendor, lines, VAT and total."*
- *"Create the purchase invoice for incoming document 1042."*
- *"Tell the supplier through Unimaze that invoice 2026-118 has been paid."*

## UBL rendering

UBL rendering writes a business document as UBL XML in the Peppol BIS 3.0 format, from data you or your
assistant provide. It renders invoices and credit notes, orders and order responses, despatch advices,
and statements and remittance advices. A purchase order can be rendered straight from Business Central.

- **It runs in Business Central and sends nothing.** Sending a rendered invoice to a network is a separate
  step that you ask for.
- **The data is checked before the XML is written:** the parties, the lines and the Peppol codes. The XML
  can be stored as an attachment on a Business Central document or as an incoming document.
- **It is only as right as the data it is given.** When the data comes from a PDF, a scan or a photo, check the
  e-invoice against the original before you create the purchase document.

## Good to know

- Business Central refuses a document whose total does not match the amount to pay, or whose lines land on
  an account with a different VAT. Fix the map or the e-invoice and process the document again.
- An incoming document keeps all its files. The original PDF, scan or photo stays on it after the e-invoice
  is added, so you can always see what the supplier sent.
- Everything runs with the caller's own Business Central permissions, and every call is logged on
  **Bifrost Messages**.
