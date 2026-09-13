---
id: arionbanki-account-getone
title: "Arionbanki.Account.GetOne"
sidebar_label: "Arionbanki.Account.GetOne"
sidebar_position: 3
description: "Beiðni- og svarsamningur fyrir Arionbanki.reikningur.GetOne Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir stakan Arion banki reikningur by bank/ledger/accountNumber, þar á meðal fulla reikningur details.

**Requires:** `Arion Account Gate` permission set.

## Beiðni

| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| `bank` | string | Yes | 4-digit bank identifier |
| `ledger` | string | Yes | 2-digit ledger identifier |
| `accountNumber` | string | Yes | 6-digit reikningur number |

```json
{
  "bank": "1234",
  "ledger": "38",
  "accountNumber": "003536"
}
```

## Svar

```json
{
  "status": "Success",
  "account": {
    "bank": "1234",
    "ledger": "38",
    "accountNumber": "003536",
    "accountId": "1234-38-003536",
    "accountType": "Current",
    "ownerName": "Jón Jónsson",
    "ownerPersonId": "1234567890",
    "isFit": false,
    "currency": "ISK",
    "balance": 50000.00,
    "accountName": "Tékkareikningur",
    "details": {
      "swift": "ARIBISRE",
      "iban": "IS140159260076545510730339",
      "availableAmount": 45000.00,
      "interestRate": 0.0,
      "transactionCount": 42
    }
  }
}
```

## Usage notes (fyrir automation)

- Obtain `bank`/`ledger`/`accountNumber` frá `Arionbanki.Account.Get` eða `Arionbanki.Account.GetByOwner` first — this Gerð does not search by Heiti eða IBAN.
- Allt three fields eru nauðsynlegt og verður að be the exact zero-padded identifiers the bank returned (bank 4, ledger 2, accountNumber 6 digits).
- Skilar fulla `details` sub-object (IBAN, Swift, interest, overdraft) that the `Arionbanki.Account.Get` Listi omits.


