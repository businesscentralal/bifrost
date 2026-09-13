---
id: arionbanki-bill-getdetails
title: "Arionbanki.Bill.GetDetails"
sidebar_label: "Arionbanki.Bill.GetDetails"
sidebar_position: 6
description: "Beiðni- og svarsamningur fyrir Arionbanki.Bill.GetDetails Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir fulla details fyrir a stakan Arion banki bill (krafa) using the bill key: bank/ledger/number/dueDate.
valfrjálst `payorId` og `claimantId` filters narrow the search Þegar the number alone er ambiguous.

**Requires:** `Arion Bill Gate` permission set.

## Beiðni

| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| `bank` | string | Yes | 4-digit bank identifier |
| `ledger` | string | Yes | 2-digit ledger identifier |
| `number` | string | Yes | Bill number (up til 30 characters) |
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

## Svar

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

## Usage notes (fyrir automation)

- **Always send both `payorId` og `claimantId`.** Although the schema marks them valfrjálst, the bank rejects Beiðnin without them (`Kennitölu greiðanda/kröfueiganda vantar eða er ekki á réttu formi`). Take both, með the bill key, frá a prior `Arionbanki.Bill.Get` result.
- Recommended flow: Kallaðu á `Arionbanki.Bill.Get`, pick the target bill, then Kallaðu á this með `{bank, ledger, number, dueDate, payorId, claimantId}` copied frá that bill.
- `dueDate` verður að be date-Aðeins (`YYYY-MM-DD`). `Arionbanki.Bill.Get` Skilar it as a timestamp (`YYYY-MM-DDT00:00:00`) — strip the time part áður en sending.
- `number` verður að be exactly as returned by `Arionbanki.Bill.Get` (do not strip leading zeros). Kennitala fields eru 10 digits, no hyphen.
- Notaðu as the **greiðsla-slip pre-check**: confirm the payable amount og exact key here áður en adding a `kind=PaymentSlip` line til `Arionbanki.Payment.Batch`. Pay the bank-reported amount; do not compute it yourself.


