---
id: sparisjodir-account-verify
title: "Sparisjodir.Account.Verify"
sidebar_label: "Sparisjodir.Account.Verify"
sidebar_position: 139
description: "Beiðni- og svarsamningur fyrir Sparisjodir.reikningur.Verify Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Verifies that a specific person (kennitala) owns a given Sparisjóður reikningur.
Notaðu this fyrir reikningur ownership validation áður en greiðsla eða statement operations.

**Requires:** `Spar Account Gate` permission set.

## Beiðni

| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| `bank` | string | Yes | 4-digit bank identifier |
| `ledger` | string | Yes | 2-digit ledger identifier |
| `accountNumber` | string | Yes | 6-digit reikningur number |
| `ownerPersonId` | string | Yes | Kennitala (10-digit Icelandic person ID) of the person til verify |

```json
{
  "bank": "1234",
  "ledger": "38",
  "accountNumber": "003536",
  "ownerPersonId": "1234567890"
}
```

## Svar

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

`verified` er `false` Þegar the bank confirms the person does not own the reikningur.

## Usage notes (fyrir automation)

- Sækja `bank`/`ledger`/`accountNumber` frá `Sparisjodir.Account.Get` eða `Sparisjodir.Account.GetByOwner`. `ownerPersonId` er the 10-digit kennitala you want til confirm owns that reikningur — it need not match the reikningur's listed owner (confirming a candidate er the point of the check).
- `verified: false` er a normal negative result, not an error. The Kallaðu á still Skilar `status: Success`.
- Notaðu as the **transfer pre-check** áður en adding a `kind=Transfer` line til `Sparisjodir.Payment.Batch` (Aðeins send the transfer Þegar `verified` er `true`), eða áður en any operation that verður að target a verified owner.


