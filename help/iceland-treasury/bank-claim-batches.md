---
id: bank-claim-batches
title: "Bank Claim Batches"
---

**Bank Claim Batches** lists every batch of claims Bifröst sent to a bank or claim collection agency to create, change or cancel
claims, with the status the bank last reported. It is for the accountant who follows claims that are
sent in batches.

At Arion banki, Íslandsbanki, Kvika banki and the savings banks (Sparisjóðir), and at the claim collection
agencies Gjaldskil and InKasso, claims are created, changed and cancelled in batches. The bank or agency
accepts the batch first and reports each claim's outcome afterwards, when the batch's result is read.

Open it with **Bank Claim Batches** on
[Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/). The page is read-only and
written by Bifröst.

## Fields

| Field | Description |
| --- | --- |
| **Bank** | The bank or claim collection agency the batch was sent to. |
| **Operation** | **Create**, **Alter** or **Cancel**. |
| **Operation Id** | The batch's id at the bank, used to read its result. |
| **Batch Status** | **In Progress**, **Completed**, **Completed With Errors**, **Not Confirmed**, **Cancelled** or **On Hold**. |
| **Claim Count** | How many claims the batch holds. |
| **Submitted At**, **Completed At** | When the batch was sent, and when the bank finished it. |
| **Last Polled At**, **Poll Count** | When and how often Bifröst read the batch's result. |
| **Error Text** | Why the bank refused the batch. |
| **Request Log Entry No.**, **Result Log Entry No.** | The calls on the **Bifrost Request Log** that sent the batch and read its result. |
| **Entry No.** | The batch's number in Bifröst's tracking. |

## Good to know

- **Completed With Errors** means some claims were refused. Their **Error Text** is on
  [Bank Claims](/help/iceland-treasury/bank-claims/).
- When [Bifröst Language Models](/language-models/) is set up, the **Chat via Bifrost** FactBox on the right
  answers questions about the selected batch.
