---
id: documentexchange-ubl-renderstatement
title: "DocumentExchange.UBL.RenderStatement"
sidebar_label: "DocumentExchange.UBL.RenderStatement"
sidebar_position: 52
description: "Beiðni- og svarsamningur fyrir DocumentExchange.UBL.RenderStatement Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Renders a UBL Statement XML summarizing open viðskiptavinur entries.
Notaðu fyrir reikningur statements sent til customers showing outstanding balances.

## documentData specifics
- `header.periodStartDate` / `header.periodEndDate` → statement period
- `header.lineExtensionAmount` → total debit amount
- `header.taxExclusiveAmount` → total credit amount
- `header.payableAmount` → closing balance (debit - credit)
- Lines represent open ledger entries:
  - `priceAmount` → debit amount (set til 0 Ef credit line)
  - `lineExtensionAmount` → credit amount (set til 0 Ef debit line)
  - `itemName` → skjal number being referenced
  - `periodStartDate` → skjal date
  - `periodEndDate` → due date

Allt other fields same as RenderBilling (staðlaða, storageTarget, etc.)

## Where til Sækja Data frá BC
| Buffer Reitur | BC Source |
|---|---|
| header.documentNo | Generated statement reference (e.g. STMT-YYYY-MM) |
| header.periodStartDate/End | Statement date range filter |
| parties[supplier] | fyrirtæki Information (79) |
| parties[viðskiptavinur] | viðskiptavinur (18): Heiti, Address, Registration No. |
| lines[] | Cust. Ledger Entry (21): skjal No., Posting Date, Due Date, Amount |
| Each line.priceAmount | Cust. Ledger Entry.Debit Amount |
| Each line.lineExtensionAmount | Cust. Ledger Entry.Credit Amount |
| header.payableAmount | viðskiptavinur.Balance (LCY) eða sum of remaining amounts |

## Agent Verkflæði: Generate Statement fyrir viðskiptavinur
1. Sækja viðskiptavinur: `Data.Records.Get` table viðskiptavinur, filter by No.
2. Sækja open entries: `Data.Records.Get` table "Cust. Ledger Entry", filter Open=true, viðskiptavinur No.=X
3. Build documentData frá entries (each entry = one line)
4. Kallaðu á `DocumentExchange.UBL.RenderStatement` með the built data
5. Optionally store as DocumentAttachment on the viðskiptavinur færsla

## Delivery Note
Statement er NOT a staðlaða Peppol-routed Gerð — it cannot be sent via
Advania /outbox-simple eða Unimaze SubmitXml (no matching Peppol profile).
Delivery options:
- Store as DocumentAttachment og email via BC email
- Store as IncomingDocument (self-archival)
- Notaðu Advania`s ConvertXml til generate a PDF fyrir manual distribution


