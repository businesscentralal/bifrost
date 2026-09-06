---
id: arionbanki-creditcard-getone
title: "Arionbanki.CreditCard.GetOne"
sidebar_label: "Arionbanki.CreditCard.GetOne"
sidebar_position: 16
description: "Request and response contract for the Arionbanki.CreditCard.GetOne Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves full details (limits, payment dates, interest, charge account, prepaid/collection flags) for a single Arion banki credit card. Amounts are null/0 for cards in the legal collection process.

**Requires:** `Arion Card Gate` permission set.

## Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cardId` | number | Yes | Numeric unique card identifier (from `Arionbanki.CreditCard.Get`) |

```json
{ "cardId": 123456789 }
```

## Response

Returns `{ "status": "Success", "card": { ...base fields..., "details": { ... } } }`. The `details` sub-object carries CreditCardDetails (credit limit, authorization limit, min payment, payment/last-payment dates, penalty interest, charge bank/ledger/account, prepaid and collection flags).

## Usage notes (for automation)

- Obtain `cardId` from `Arionbanki.CreditCard.Get`; this type does not search by card number (the printed card number is masked).
- Returns the full `details` object that the `Arionbanki.CreditCard.Get` list omits. Several detail fields are issuer-specific (Valitor vs Borgun) and may be blank/0.
- **Signs (bank-statement convention):** `balance` and `amountDue` are returned **negative** (amounts owed = a liability). Credit limits, available credit, min payment, interest, and turnover/usage keep their native positive sign.

