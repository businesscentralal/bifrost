---
id: sparisjodir-creditcard-get
title: "Sparisjodir.CreditCard.Get"
sidebar_label: "Sparisjodir.CreditCard.Get"
sidebar_position: 152
description: "Request and response contract for the Sparisjodir.CreditCard.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves all Sparisjóður credit cards for the authenticated user (overview). Shows cards in active use and cards in the legal collection process; amounts are null/0 for cards in legal collection.

**Requires:** `Spar Card Gate` permission set.

## Request
No request fields required. Send an empty JSON object `{}`.

## Response

```json
{
  "status": "Success",
  "count": 1,
  "cards": [
    {
      "cardId": 123456789,
      "cardNumber": "4804 28** **** 0557",
      "cardOwnerName": "Kappi ehf.",
      "cardHolderName": "Jón Jónsson",
      "balance": -50000.00,
      "availableBalance": 45000.00,
      "active": true,
      "cardBrand": "V",
      "cardRole": "Main card",
      "limit": 300000.00,
      "issueDate": "2023-01-12",
      "expiryDate": "2027-05-31"
    }
  ]
}
```

## Usage notes (for automation)

- This is the discovery entry point for credit cards: no input, returns every card with its numeric `cardId`.
- Use a returned `cardId` with `Sparisjodir.CreditCard.GetOne` (full details) or `Sparisjodir.CreditCard.Transactions` (transaction history).
- `cardBrand`: `V` = Visa, `M` = Mastercard. Some fields are issuer-specific (Valitor vs Borgun) and may be blank/0.
- **Signs (bank-statement convention):** `balance` and `amountDue` are amounts owed and are returned **negative** (a liability). `availableBalance`, `limit`, and turnover/usage figures keep their native positive sign.
- To reconcile a card in Business Central, map it to a BC `Bank Account` whose `Bank Account No.` holds this `cardId` (digits only) and whose `Bank Statement Import Format` is `SPAR-CARD-FEED-IN`, then import via `Finance.BankReconciliation.Create` — see the bank-import section in `Sparisjodir.CreditCard.Transactions` help.

