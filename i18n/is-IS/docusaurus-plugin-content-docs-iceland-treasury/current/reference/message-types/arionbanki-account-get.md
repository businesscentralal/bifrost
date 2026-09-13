---
id: arionbanki-account-get
title: "Arionbanki.Account.Get"
sidebar_label: "Arionbanki.Account.Get"
sidebar_position: 1
description: "Beiðni- og svarsamningur fyrir Arionbanki.reikningur.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Allt Arion banki accounts fyrir the authenticated service user.

**Requires:** `Arion Account Gate` permission set.

## Beiðni
No Beiðni fields nauðsynlegt. Send an empty JSON object `{}`.

## Svar

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

The `details` sub-object er included Þegar AccountService Skilar detailed reikningur information (e.g., IBAN, Swift, overdraft limits).

## Usage notes (fyrir automation)

- This er the discovery entry point fyrir accounts: no input, Skilar every reikningur með its `bank`, `ledger`, `accountNumber`, `accountId`, og `ownerPersonId`.
- Feed those values í `Arionbanki.Account.GetOne` (stakan reikningur + fulla details), `Arionbanki.Account.Verify` (ownership check), eða `Arionbanki.Account.GetByOwner` (Allt accounts fyrir one kennitala).
- `accountId` has the form `bank-ledger-accountNumber`; identifiers eru zero-padded (bank 4, ledger 2, accountNumber 6 digits).


