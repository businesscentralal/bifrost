---
id: customer-ledger-factbox
title: "Customer ledger entry — claim"
---

Bifröst Iceland Treasury adds the claim's fields to the **Customer Ledger Entry** FactBox, so you see the bank
claim (*krafa*) that collects an entry without leaving the list you are working in. It is for anyone who
follows up customer payments.

The FactBox appears where Business Central shows it, for example on **Customer Ledger Entries**.

## Fields

| Field | Description |
| --- | --- |
| **Claim Account** | The claim account of the bank claim that collects the entry. |
| **Claim Date** | The claim date of that claim. |
| **Claim Status** | The status of the claim, for example **Confirmed**, **Partially Paid**, **Paid**, **Cancelled** or **Expired**. |

The fields are blank when no claim collects the entry. They are read-only.

## Good to know

- A claim collects an entry when the entry was named when the claim was created. The same entry is never
  on two live claims.
- When a claim is cancelled, its entries are released and can be collected by a new claim.
- The claim, its entries and its payments are on [Bank Claims](/help/iceland-treasury/bank-claims/).
