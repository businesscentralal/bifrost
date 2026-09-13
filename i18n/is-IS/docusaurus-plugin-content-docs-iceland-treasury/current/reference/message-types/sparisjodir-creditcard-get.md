---
id: sparisjodir-creditcard-get
title: "Sparisjodir.CreditCard.Get"
sidebar_label: "Sparisjodir.CreditCard.Get"
sidebar_position: 152
description: "Beiðni- og svarsamningur fyrir Sparisjodir.CreditCard.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Allt Sparisjóður credit cards fyrir the authenticated user (Yfirlit). Shows cards in active Notaðu og cards in the legal collection process; amounts eru null/0 fyrir cards in legal collection.

**Requires:** `Spar Card Gate` permission set.

## Beiðni
No Beiðni fields nauðsynlegt. Send an empty JSON object `{}`.

## Svar

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

## Usage notes (fyrir automation)

- This er the discovery entry point fyrir credit cards: no input, Skilar every card með its numeric `cardId`.
- Notaðu a returned `cardId` með `Sparisjodir.CreditCard.GetOne` (fulla details) eða `Sparisjodir.CreditCard.Transactions` (færsla history).
- `cardBrand`: `V` = Visa, `M` = Mastercard. Some fields eru issuer-specific (Valitor vs Borgun) og may be blank/0.
- **Signs (bank-statement convention):** `balance` og `amountDue` eru amounts owed og eru returned **negative** (a liability). `availableBalance`, `limit`, og turnover/usage figures keep their native positive sign.
- til reconcile a card in Business Central, map it til a BC `Bank Account` whose `Bank Account No.` holds this `cardId` (digits Aðeins) og whose `Bank Statement Import Format` er `SPAR-CARD-FEED-IN`, then import via `Finance.BankReconciliation.Create` — see the bank-import section in `Sparisjodir.CreditCard.Transactions` help.


