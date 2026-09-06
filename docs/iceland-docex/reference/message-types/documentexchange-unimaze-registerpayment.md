---
id: documentexchange-unimaze-registerpayment
title: "DocumentExchange.Unimaze.RegisterPayment"
sidebar_label: "DocumentExchange.Unimaze.RegisterPayment"
sidebar_position: 69
description: "Request and response contract for the DocumentExchange.Unimaze.RegisterPayment Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Registers a payment against a received invoice (compliance/Croatia workflow, Unimaze only).
Notifies the sender that their invoice has been paid.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | UUID of the received invoice message |
| payload | object | No | Payment details (amount, date, reference) |

## Payload Structure
```json
{ "paidAmount": 124000, "paymentDate": "2026-07-04", "paymentReference": "PMT-001" }
```

## Data Mapping from BC
| BC Source | Maps to |
|-----------|---------|
| Vendor Ledger Entry."Amount (LCY)" | payload.paidAmount |
| Vendor Ledger Entry."Posting Date" | payload.paymentDate |
| Vendor Ledger Entry."Document No." | payload.paymentReference |

## Note
This endpoint may not be available in all regions (returns 404 in Iceland sandbox).

