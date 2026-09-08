---
id: payment-methods
title: "Payment Methods — claim identifiers"
sidebar_label: "Payment Methods"
sidebar_position: 6
---

Bifröst Iceland Treasury adds two fields to the standard **Payment Methods** page for each bank that supports claims: Landsbankinn, Arion banki and Sparisjóður. Together they tell the connector which claim agreement a sales document belongs to, and which claim number to hand out next.

Open the page by searching for **Payment Methods**.

## Fields

| Field | Description |
|---|---|
| **Claim Identifier** | The claim agreement identifier the bank issued for this payment method. A claim created from a document using this payment method is registered under that identifier. |
| **Last Claim No.** | The last claim number assigned from this payment method. The connector increments it each time it creates a claim, so it is a running counter rather than a setting. |

Each bank has its own pair, captioned with the bank's name — Landsbankinn, Arion and Spar — so one payment method can serve one bank without affecting the others.

## Setting them up

Create one payment method per claim agreement. If the company collects through two banks, or holds two agreements at the same bank, each needs its own payment method with its own identifier.

Set **Claim Identifier** to the value on the agreement with the bank. Leave **Last Claim No.** alone unless you are moving an existing numbering series across — set it to the last number already used, and the next claim continues from there.

A payment method with a blank claim identifier is simply not used for claims. Nothing else about it changes.

## Related

- [Customer ledger entry — claim information](./customer-ledger-factbox.md) — where the resulting claim shows up
