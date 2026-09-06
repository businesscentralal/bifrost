---
id: sparisjodir-account-getbyowner
title: "Sparisjodir.Account.GetByOwner"
sidebar_label: "Sparisjodir.Account.GetByOwner"
sidebar_position: 137
description: "Request and response contract for the Sparisjodir.Account.GetByOwner Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves all Sparisjóður accounts owned by a specific person, identified by kennitala.

**Requires:** `Spar Account Gate` permission set.

## Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ownerPersonId` | string | Yes | Kennitala (10-digit Icelandic person ID) of the account owner |

```json
{
  "ownerPersonId": "1234567890"
}
```

## Response

```json
{
  "status": "Success",
  "ownerPersonId": "1234567890",
  "count": 1,
  "accounts": [
    {
      "bank": "1234",
      "ledger": "38",
      "accountNumber": "003536",
      "currency": "ISK",
      "balance": 50000.00
    }
  ]
}
```

## Usage notes (for automation)

- `ownerPersonId` is a 10-digit kennitala (no hyphen). You can take it from any account's `ownerPersonId` in an `Sparisjodir.Account.Get` result.
- Returns the accounts that person owns; pass a returned `bank`/`ledger`/`accountNumber` to `Sparisjodir.Account.GetOne` for full details, or to `Sparisjodir.Account.Verify` to confirm a different candidate owner.

