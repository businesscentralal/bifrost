---
id: sparisjodir-account-verify
title: "Sparisjodir.Account.Verify"
sidebar_label: "Sparisjodir.Account.Verify"
sidebar_position: 139
description: "Request and response contract for the Sparisjodir.Account.Verify Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Verifies that a specific person (kennitala) owns a given Sparisjóður account.
Use this for account ownership validation before payment or statement operations.

**Requires:** `Spar Account Gate` permission set.

## Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bank` | string | Yes | 4-digit bank identifier |
| `ledger` | string | Yes | 2-digit ledger identifier |
| `accountNumber` | string | Yes | 6-digit account number |
| `ownerPersonId` | string | Yes | Kennitala (10-digit Icelandic person ID) of the person to verify |

```json
{
  "bank": "1234",
  "ledger": "38",
  "accountNumber": "003536",
  "ownerPersonId": "1234567890"
}
```

## Response

```json
{
  "status": "Success",
  "verified": true,
  "bank": "1234",
  "ledger": "38",
  "accountNumber": "003536",
  "ownerPersonId": "1234567890"
}
```

`verified` is `false` when the bank confirms the person does not own the account.

## Usage notes (for automation)

- Get `bank`/`ledger`/`accountNumber` from `Sparisjodir.Account.Get` or `Sparisjodir.Account.GetByOwner`. `ownerPersonId` is the 10-digit kennitala you want to confirm owns that account — it need not match the account's listed owner (confirming a candidate is the point of the check).
- `verified: false` is a normal negative result, not an error. The call still returns `status: Success`.
- Use as the **transfer pre-check** before adding a `kind=Transfer` line to `Sparisjodir.Payment.Batch` (only send the transfer when `verified` is `true`), or before any operation that must target a verified owner.

