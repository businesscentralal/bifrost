---
id: bank-tracking-log
title: "Bank Tracking Log"
---

The **Bank Tracking Log** lists every action Bifröst took at a bank on a payment, a foreign payment or a
claim, with the status after it. It is for the finance team and the administrator who want to know what
happened to a batch or a claim, and when.

Open it with **Bank Tracking Log** on [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/).
The log is read-only and written by Bifröst. A call the bank refused is not in it; it is on the
**Bifrost Request Log**.

## Fields

| Field | Description |
| --- | --- |
| **Logged At** | When the action ran. |
| **Bank** | The bank. |
| **Area** | **Payment**, **Foreign Payment** or **Claim**. |
| **Action** | What was done, for example **Register**, **Result**, **Create**, **Alter**, **Cancel**, **Query Payments**, **Reactivate** or **Statement Match**. |
| **Payment Batch Status** | The status of the payment batch after the action. Blank for claims. |
| **Claim Status** | The status of the claim after the action. Blank for payments and for actions that are not about one claim. |
| **Not Tracked** | The action was about a batch or claim that Bifröst does not track, for example one created in the online bank. |
| **Bank Reference** | The bank's id of the batch, claim or operation. |
| **Detail** | A short description of the outcome. |
| **Message Type** | The operation that took the action. |
| **User ID** | Who called it. |
| **Request Log Entry No.** | The call on the **Bifrost Request Log**. |

## Common tasks

**Follow one batch or claim.** Filter **Bank Reference** on its id at the bank.

**See what was paid today.** Filter **Action** on **Statement Match** and **Logged At** on today.

## Good to know

- The current state of each batch and claim is on [Bank Payment Batches](/help/iceland-treasury/bank-payment-batches/)
  and [Bank Claims](/help/iceland-treasury/bank-claims/); the log keeps the history.
- When [Bifröst Language Models](/language-models/) is set up, the **Chat via Bifrost** FactBox on the right
  answers questions about the selected entry.
