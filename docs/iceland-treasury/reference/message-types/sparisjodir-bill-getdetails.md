---
id: sparisjodir-bill-getdetails
title: "Sparisjodir.Bill.GetDetails"
sidebar_label: "Sparisjodir.Bill.GetDetails"
sidebar_position: 141
description: "Request and response contract for the Sparisjodir.Bill.GetDetails Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves full details for a single Sparisjóður bill (krafa) using the bill key: bank/ledger/number/dueDate.
Optional `payorId` and `claimantId` filters narrow the search when the number alone is ambiguous.

**Requires:** `Spar Bill Gate` permission set.

## Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bank` | string | Yes | 4-digit bank identifier |
| `ledger` | string | Yes | 2-digit ledger identifier |
| `number` | string | Yes | Bill number (up to 30 characters) |
| `dueDate` | string | Yes | Due date in YYYY-MM-DD format |
| `payorId` | string | No | Kennitala of the payor (10 digits) |
| `claimantId` | string | No | Kennitala of the claimant (10 digits) |

```json
{
  "bank": "1234",
  "ledger": "38",
  "number": "12345678901234",
  "dueDate": "2024-12-31",
  "payorId": "1234567890",
  "claimantId": "5001234560"
}
```

## Response

```json
{
  "status": "Success",
  "bill": {
    "bank": "1234",
    "ledger": "38",
    "number": "12345678901234",
    "dueDate": "2024-12-31T00:00:00",
    "description": "Húsaleiga desember",
    "amountDue": 120000.00,
    "claimantId": "5001234560",
    "payorId": "1234567890",
    "claimType": "Regular",
    "billType": "Regular",
    "isDebited": false,
    "details": {
      "claimantName": "Leigusali ehf.",
      "payorName": "Jón Jónsson",
      "amount": 120000.00,
      "defaultInterest": 0.0,
      "reference": "202412",
      "customerNumber": "C001"
    }
  }
}
```

## Usage notes (for automation)

- **Always send both `payorId` and `claimantId`.** Although the schema marks them optional, the bank rejects the request without them (`Kennitölu greiðanda/kröfueiganda vantar eða er ekki á réttu formi`). Take both, with the bill key, from a prior `Sparisjodir.Bill.Get` result.
- Recommended flow: call `Sparisjodir.Bill.Get`, pick the target bill, then call this with `{bank, ledger, number, dueDate, payorId, claimantId}` copied from that bill.
- `dueDate` must be date-only (`YYYY-MM-DD`). `Sparisjodir.Bill.Get` returns it as a timestamp (`YYYY-MM-DDT00:00:00`) — strip the time part before sending.
- `number` must be exactly as returned by `Sparisjodir.Bill.Get` (do not strip leading zeros). Kennitala fields are 10 digits, no hyphen.
- Use as the **payment-slip pre-check**: confirm the payable amount and exact key here before adding a `kind=PaymentSlip` line to `Sparisjodir.Payment.Batch`. Pay the bank-reported amount; do not compute it yourself.

