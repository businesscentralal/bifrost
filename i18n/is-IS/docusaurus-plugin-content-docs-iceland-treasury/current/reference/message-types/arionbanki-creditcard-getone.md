---
id: arionbanki-creditcard-getone
title: "Arionbanki.CreditCard.GetOne"
sidebar_label: "Arionbanki.CreditCard.GetOne"
sidebar_position: 16
description: "Beiðni- og svarsamningur fyrir Arionbanki.CreditCard.GetOne Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir fulla details (limits, greiðsla dates, interest, charge reikningur, prepaid/collection flags) fyrir a stakan Arion banki credit card. Amounts eru null/0 fyrir cards in the legal collection process.

**Requires:** `Arion Card Gate` permission set.

## Beiðni

| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| `cardId` | number | Yes | Numeric unique card identifier (frá `Arionbanki.CreditCard.Get`) |

```json
{ "cardId": 123456789 }
```

## Svar

Skilar `{ "status": "Success", "card": { ...base fields..., "details": { ... } } }`. The `details` sub-object carries CreditCardDetails (credit limit, authorization limit, min greiðsla, greiðsla/last-greiðsla dates, penalty interest, charge bank/ledger/reikningur, prepaid og collection flags).

## Usage notes (fyrir automation)

- Obtain `cardId` frá `Arionbanki.CreditCard.Get`; this Gerð does not search by card number (the printed card number er masked).
- Skilar fulla `details` object that the `Arionbanki.CreditCard.Get` Listi omits. Several detail fields eru issuer-specific (Valitor vs Borgun) og may be blank/0.
- **Signs (bank-statement convention):** `balance` og `amountDue` eru returned **negative** (amounts owed = a liability). Credit limits, available credit, min greiðsla, interest, og turnover/usage keep their native positive sign.


