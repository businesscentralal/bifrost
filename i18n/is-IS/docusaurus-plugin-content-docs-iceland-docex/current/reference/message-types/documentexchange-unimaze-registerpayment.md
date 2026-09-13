---
id: documentexchange-unimaze-registerpayment
title: "DocumentExchange.Unimaze.RegisterPayment"
sidebar_label: "DocumentExchange.Unimaze.RegisterPayment"
sidebar_position: 69
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.RegisterPayment Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Registers a greiðsla against a received invoice (compliance/Croatia Verkflæði, Unimaze Aðeins).
Notifies the sender that their invoice has been paid.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | UUID of the received invoice message |
| payload | object | No | greiðsla details (amount, date, reference) |

## Payload Structure
```json
{ "paidAmount": 124000, "paymentDate": "2026-07-04", "paymentReference": "PMT-001" }
```

## Data Mapping frá BC
| BC Source | Maps til |
|-----------|---------|
| Vendor Ledger Entry."Amount (LCY)" | payload.paidAmount |
| Vendor Ledger Entry."Posting Date" | payload.paymentDate |
| Vendor Ledger Entry."skjal No." | payload.paymentReference |

## Note
This Endapunktur may not be available in Allt regions (Skilar 404 in Iceland sandbox).


