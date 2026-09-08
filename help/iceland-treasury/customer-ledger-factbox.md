---
id: customer-ledger-factbox
title: "Customer ledger entry — claim information"
sidebar_label: "Claim FactBox"
sidebar_position: 7
---

The **Customer Ledger Entry FactBox** gains two fields for each bank that supports claims — Landsbankinn, Arion banki and Sparisjóður — so you can see the bank claim behind an entry without leaving the list you are working in.

It appears anywhere the standard FactBox does: **Customer Ledger Entries**, the customer card, and the entry lists reached from a sales document.

## Fields

| Field | Description |
|---|---|
| **Claim Account** | The claim account at the bank that the entry was registered against. |
| **Claim Date** | The claim date registered with the bank for the entry. |

Both are read from the claim the connector created; neither can be edited here. Each bank has its own pair, captioned with the bank's name.

## When the fields are hidden

The fields for a bank appear only if you have read permission for that bank's claim tables. Without it the group stays hidden rather than showing blanks, so a user who is not meant to see collection data does not see empty rows suggesting there is something to look at.

If you expect a claim and no fields appear, check your permission sets first — the entry itself may be perfectly fine.

## When the fields are empty

Visible but blank means no claim exists for that entry at that bank. The usual reasons are that the document's payment method carries no claim identifier, or the claim has not been sent yet.

## Related

- [Payment Methods — claim identifiers](./payment-methods.md) — the setting that decides which claim agreement an entry belongs to
