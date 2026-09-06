---
id: sparisjodir-account-get
title: "Sparisjodir.Account.Get"
sidebar_label: "Sparisjodir.Account.Get"
sidebar_position: 136
description: "Request and response contract for the Sparisjodir.Account.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves all Sparisjóður accounts for the authenticated service user.

**Requires:** `Spar Account Gate` permission set.

## Request
No request fields required. Send an empty JSON object `{}`.

## Response

```json
{
  "status": "Success",
  "count": 2,
  "accounts": [
    {
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
      "accountName": "Tékkareikningur"
    }
  ]
}
```

The `details` sub-object is included when AccountService returns detailed account information (e.g., IBAN, Swift, overdraft limits).

## Usage notes (for automation)

- This is the discovery entry point for accounts: no input, returns every account with its `bank`, `ledger`, `accountNumber`, `accountId`, and `ownerPersonId`.
- Feed those values into `Sparisjodir.Account.GetOne` (single account + full details), `Sparisjodir.Account.Verify` (ownership check), or `Sparisjodir.Account.GetByOwner` (all accounts for one kennitala).
- `accountId` has the form `bank-ledger-accountNumber`; identifiers are zero-padded (bank 4, ledger 2, accountNumber 6 digits).

