---
id: payment-methods
title: "Payment Methods — claim collection"
---

Bifröst Iceland Treasury adds claim collection fields to the **Payment Methods** page. A payment method
with these fields stands for one collection agreement with a bank: the claims created with it are created under
that agreement. This page is for the accountant who sets up claim collection (*kröfur*).

Open it by searching for **Payment Methods**.

## Fields

| Field | Description |
| --- | --- |
| **Claim Identifier** | The claim identifier the bank assigned to the collection agreement. At Íslandsbanki this is the claim template code from the bank's online banking. |
| **Last Claim No.** | The last claim number used for this agreement. The next claim gets the following number. |

The claimant's kennitala is not set here: it is read from **Registration No.** on **Company Information**.

## Setting them up

1. Create one payment method for each collection agreement. Two agreements, at the same bank or at
   different banks, need two payment methods.
2. Enter the **Claim Identifier** from the agreement.
3. Leave **Last Claim No.** empty for a new agreement. When you continue an existing numbering, enter the
   last number already used.
4. Set **Bal. Account Type** to **Bank Account** and **Bal. Account No.** to the bank account the
   payments arrive on. Claims and claim payments then show that bank account.

A payment method without a claim identifier is not used for claims; nothing else about it changes.

## Good to know

- A claim created with this payment method shows on [Bank Claims](/help/iceland-treasury/bank-claims/)
  and in the [customer ledger entry FactBox](/help/iceland-treasury/customer-ledger-factbox/).
- At Landsbankinn the claim is also created under a claim template; see
  [Landsbankinn](/iceland-treasury/banks/landsbankinn/).
