---
id: documentexchange-ubl-renderstatement
title: "DocumentExchange.UBL.RenderStatement"
sidebar_label: "DocumentExchange.UBL.RenderStatement"
sidebar_position: 52
description: "Request and response contract for the DocumentExchange.UBL.RenderStatement Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Renders a UBL Statement XML summarizing open customer entries.
Use for account statements sent to customers showing outstanding balances.

## documentData specifics
- `header.periodStartDate` / `header.periodEndDate` → statement period
- `header.lineExtensionAmount` → total debit amount
- `header.taxExclusiveAmount` → total credit amount
- `header.payableAmount` → closing balance (debit - credit)
- Lines represent open ledger entries:
  - `priceAmount` → debit amount (set to 0 if credit line)
  - `lineExtensionAmount` → credit amount (set to 0 if debit line)
  - `itemName` → document number being referenced
  - `periodStartDate` → document date
  - `periodEndDate` → due date

All other fields same as RenderBilling (standard, storageTarget, etc.)

## Where to Get Data from BC
| Buffer field | BC Source |
|---|---|
| header.documentNo | Generated statement reference (e.g. STMT-YYYY-MM) |
| header.periodStartDate/End | Statement date range filter |
| parties[supplier] | Company Information (79) |
| parties[customer] | Customer (18): Name, Address, Registration No. |
| lines[] | Cust. Ledger Entry (21): Document No., Posting Date, Due Date, Amount |
| Each line.priceAmount | Cust. Ledger Entry.Debit Amount |
| Each line.lineExtensionAmount | Cust. Ledger Entry.Credit Amount |
| header.payableAmount | Customer.Balance (LCY) or sum of remaining amounts |

## Agent Workflow: Generate Statement for Customer
1. Get customer: `Data.Records.Get` table Customer, filter by No.
2. Get open entries: `Data.Records.Get` table "Cust. Ledger Entry", filter Open=true, Customer No.=X
3. Build documentData from entries (each entry = one line)
4. Call `DocumentExchange.UBL.RenderStatement` with the built data
5. Optionally store as DocumentAttachment on the Customer record

## Delivery Note
Statement is NOT a standard Peppol-routed type — it cannot be sent via
Advania /outbox-simple or Unimaze SubmitXml (no matching Peppol profile).
Delivery options:
- Store as DocumentAttachment and email via BC email
- Store as IncomingDocument (self-archival)
- Use Advania`s ConvertXml to generate a PDF for manual distribution

