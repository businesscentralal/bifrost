---
id: bank-claims
title: "Bank Claims"
---

**Bank Claims** lists every claim (*krafa*) Bifröst created at a bank, with its status, the amount paid
and the bank account it is paid into. Below the list, **Ledger Entries** shows the customer ledger
entries the selected claim collects and **Claim Payments** the payments the bank reported for it. It is
for the accountant who follows up what customers owe.

Open it with **Bank Claims** on [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/).
The page is read-only: Bifröst writes it when a claim is created, changed or cancelled at the bank, when
the claim is read again, and when its payments are registered.

## Claims

| Field | Description |
| --- | --- |
| **Bank** | The bank the claim is at. |
| **Claim Account** | The claim's account at the bank: bank, ledger and claim number. |
| **Claim Date**, **Due Date** | The claim date and the due date. |
| **Customer No.** | The customer the claim collects from. |
| **Amount**, **Amount Paid** | The claim's amount and how much of it the registered payments cover. |
| **Status** | **Submitted** (sent in a batch the bank has not answered yet), **Confirmed**, **Rejected**, **Partially Paid**, **Paid**, **Cancelled** or **Expired**. |
| **Payment Method Code** | The payment method, and so the collection agreement, the claim was created with. |
| **Bank Account No.** | The Business Central bank account the claim is paid into: the balancing bank account of its payment method. |
| **Posted** | For posting in Business Central. Bifröst does not post, so it is blank. |
| **Claimant No.** | The kennitala of the claimant. |
| **Claim No.**, **Identifier**, **Reference**, **Bill Number**, **Bank Claim Id** | The claim's number, the collection agreement's claim identifier, the reference and bill number sent to the bank, and the claim's id at the bank. |
| **Error Text** | Why the bank refused the claim. |
| **Batch Entry No.** | The batch the claim was sent in, on [Bank Claim Batches](/help/iceland-treasury/bank-claim-batches/). |
| **Created At**, **Last Modified At**, **Last Checked At** | When the claim was created, last changed, and last read at the bank. |

## Ledger Entries

The customer ledger entries the claim collects: **Customer Ledger Entry No.**, **Customer No.**,
**Document Type**, **Document No.**, **Posting Date**, **Due Date**, **Amount**, **Remaining Amount at
Creation**, and **Reversed** when the entry was later reversed.

## Claim Payments

The payments the bank reported for the claim, with the same fields as
[Bank Claim Payments](/help/iceland-treasury/bank-claim-payments/).

## Common tasks

**See what is still open.** Filter **Status** on **Confirmed** and **Partially Paid**. **Amount** less
**Amount Paid** is what the bank has not reported as paid.

**Find the claim for an invoice.** Select the claim, or open the invoice's customer ledger entry: its
FactBox shows the claim's account, date and status.

## Good to know

- A claim is **Partially Paid** or **Paid** only from the payments registered against it, and **Expired**
  when the bank's cancellation date has passed.
- A cancelled claim reopens when the bank reports it open again, for example after it was reactivated in
  the online bank.
- Every action on a claim is also on the [Bank Tracking Log](/help/iceland-treasury/bank-tracking-log/).
- When [Bifröst Language Models](/language-models/) is set up, the **Chat via Bifrost** FactBox on the right
  answers questions about the selected claim.
