---
id: bank-payments
title: "Bank Payments"
---

**Bank Payments** lists single payments that Bifröst registered at a bank, each with its status and what
it pays. It is for the accountant who looks up a payment from a posted document.

**Navigate** opens it: when you navigate from a document, Business Central also looks for bank payments
with the same document number and posting date and lists them here. The page is read-only and written by
Bifröst.

## Fields

| Field | Description |
| --- | --- |
| **Bank** | The bank the payment was registered at. |
| **Batch Entry No.**, **Line No.** | The batch the payment belongs to on [Bank Payment Batches](/help/iceland-treasury/bank-payment-batches/), and its line in the batch. |
| **Recipient Account**, **Recipient Name** | Who the payment goes to. |
| **Amount**, **Currency Code** | The amount registered. |
| **Status** | **Pending**, **Paid**, **Error**, **Cancelled** or **Removed at bank**. |
| **Source Type**, **Source No.**, **Source Document No.**, **Source Entry No.**, **Source Journal Template**, **Source Journal Batch**, **Source Journal Line No.** | What the payment pays, when the registration named it. |
| **Document No.**, **Posting Date**, **Posted**, **Posted At**, **Journal Template Name**, **Journal Batch Name**, **Journal Line No.** | For posting in Business Central. Bifröst does not post, so these are blank. |
| **Reference** | The payment's reference. |
| **Paid At** | When the payment was confirmed paid. |
| **Entry No.** | The payment's number in Bifröst's tracking. |

## Good to know

- A payment is **Paid** when the statement of the account it is paid from shows it.
- The whole batch, with its charges, is on [Bank Payment Batches](/help/iceland-treasury/bank-payment-batches/).
- When [Bifröst Language Models](/language-models/) is set up, the **Chat via Bifrost** FactBox on the right
  answers questions about the selected payment.
