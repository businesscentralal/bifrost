---
id: arionbanki-account-getone
title: "Arionbanki.Account.GetOne"
sidebar_label: "Arionbanki.Account.GetOne"
sidebar_position: 3
description: "Request and response contract for the Arionbanki.Account.GetOne Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a single Arion banki account by bank/ledger/accountNumber, including full account details.

**Requires:** `Arion Account Gate` permission set.

## Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bank` | string | Yes | 4-digit bank identifier |
| `ledger` | string | Yes | 2-digit ledger identifier |
| `accountNumber` | string | Yes | 6-digit account number |

```json
{
  "bank": "1234",
  "ledger": "38",
  "accountNumber": "003536"
}
```

## Response

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

## Usage notes (for automation)

- Obtain `bank`/`ledger`/`accountNumber` from `Arionbanki.Account.Get` or `Arionbanki.Account.GetByOwner` first — this type does not search by name or IBAN.
- All three fields are required and must be the exact zero-padded identifiers the bank returned (bank 4, ledger 2, accountNumber 6 digits).
- Returns the full `details` sub-object (IBAN, Swift, interest, overdraft) that the `Arionbanki.Account.Get` list omits.

