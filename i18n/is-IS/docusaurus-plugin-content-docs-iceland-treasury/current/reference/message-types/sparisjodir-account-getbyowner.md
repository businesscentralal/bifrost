---
id: sparisjodir-account-getbyowner
title: "Sparisjodir.Account.GetByOwner"
sidebar_label: "Sparisjodir.Account.GetByOwner"
sidebar_position: 137
description: "Beiðni- og svarsamningur fyrir Sparisjodir.reikningur.GetByOwner Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Allt Sparisjóður accounts owned by a specific person, identified by kennitala.

**Requires:** `Spar Account Gate` permission set.

## Beiðni

| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| `ownerPersonId` | string | Yes | Kennitala (10-digit Icelandic person ID) of the reikningur owner |

```json
{
  "ownerPersonId": "1234567890"
}
```

## Svar

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

## Usage notes (fyrir automation)

- `ownerPersonId` er a 10-digit kennitala (no hyphen). You getur take it frá any reikningur's `ownerPersonId` in an `Sparisjodir.Account.Get` result.
- Skilar accounts that person owns; pass a returned `bank`/`ledger`/`accountNumber` til `Sparisjodir.Account.GetOne` fyrir fulla details, eða til `Sparisjodir.Account.Verify` til confirm a different candidate owner.


