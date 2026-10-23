---
id: bank-payment-batches
title: "Bank Payment Batches"
---

**Bank Payment Batches** lists every payment batch Bifröst registered at a bank, domestic and foreign,
with the status the bank last reported. Below the list, **Payments** shows the payments of the selected
batch and **Payment Charges** the charges the bank reported for them. It is for the finance team that
follows payments until they are paid.

Open it with **Bank Payment Batches** on
[Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/). The page is read-only: Bifröst
writes it when a batch is registered, when its result is read at the bank, and when a statement shows a
payment. The newest batch is at the top.

## Batches

| Field | Description |
| --- | --- |
| **Bank** | The bank the batch was registered at. |
| **Kind** | **Domestic** or **Foreign**. |
| **Name of Batch** | The batch name sent to the bank. |
| **Visible to All Users** | Whether the name starts with `*`, so every user of the company's online bank sees the batch, not only the web service user. |
| **Status** | The batch's status at the bank, for example **Registered**, **Awaiting Approval**, **In Progress**, **Completed**, **Completed with Errors**, **Cancelled** or **Rejected**. **Draft (Not Confirmed)** is a foreign batch registered but not yet confirmed. |
| **Line Count**, **Total Amount**, **Currency Code** | The number of payments and their total. |
| **Out Account** | The account the batch is paid from. |
| **Date of Forward Payment** | The day the bank pays the batch once it is approved. |
| **Bank Batch Id** | The batch's id at the bank. |
| **Submitted At**, **Submitted By** | When and by whom the batch was registered. |
| **Paid At** | When the last payment of the batch was confirmed paid. |
| **Last Checked At** | When Bifröst last read the batch's result at the bank. |
| **Bank Account No.** | The Business Central bank account whose bank account number is the out account. Blank when none matches. |
| **Posted**, **Document No.**, **Posting Date** | For posting in Business Central. Bifröst does not post, so these are blank. |

## Payments

| Field | Description |
| --- | --- |
| **Recipient Account**, **Recipient Owner ID**, **Recipient Name** | Who the payment goes to. |
| **Amount**, **Currency Code** | The amount registered. |
| **Status** | **Pending**, **Paid**, **Error**, **Cancelled** or **Removed at bank**. |
| **Error Text** | Why the bank refused the payment. |
| **Reference**, **Description** | The payment's reference and text. |
| **Payment Kind** | A transfer or a payment slip. |
| **Amount Paid**, **Paid Currency Code**, **Value Date**, **Exchange Rate**, **Amount Paid (LCY)**, **Charges (LCY)** | What the bank reports as paid, for foreign payments in particular. |
| **Paid Source** | How Bifröst knows the payment is paid: the **Statement** of the out account, the bank's result, or a receipt. |
| **Paid At** | When the payment was confirmed paid. |
| **Source Type**, **Source No.**, **Source Document No.**, **Source Entry No.**, **Source Journal Template**, **Source Journal Batch**, **Source Journal Line No.** | What the payment pays, when the registration named it: a purchase invoice, a vendor or customer ledger entry, a vendor, a payment journal line, a G/L account or a bank account. |
| **Document No.**, **Posting Date**, **Posted**, **Posted At**, **Journal Template Name**, **Journal Batch Name**, **Journal Line No.** | For posting in Business Central. Bifröst does not post, so these are blank. |

## Payment Charges

**Payment Charges** lists the charges the bank reported for the batch's payments: **Charge Type** (for
example fee, cable or foreign cost), **Amount** and **Currency Code**, **Amount (LCY)**, and **Paid By**
(payer, beneficiary or shared). **Posted** and **Document No.** are for posting in Business Central and
are blank.

## Common tasks

**See whether a batch is paid.** Select it and look at the **Status** of its payments. A payment is
**Paid** when the statement of the out account shows it: read or import that account's statement.

**Find a batch waiting for approval.** Filter **Status** on **Awaiting Approval**. A person approves it in
the bank's online banking; if it cannot be found there, check **Visible to All Users**.

**Ask about a batch.** When [Bifröst Language Models](/language-models/) is set up, the **Chat via Bifrost**
FactBox on the right answers questions about the selected batch.

## Good to know

- Bifröst registers batches and reads their status. It never approves or pays a batch.
- Every action on a batch is also on the [Bank Tracking Log](/help/iceland-treasury/bank-tracking-log/).
- How a payment is followed from start to finish: [Payments and claims](/iceland-treasury/payments-and-claims/).
