---
id: playbook-last-run-fact-box
title: "Last Execution"
sidebar_label: "Last Execution"
sidebar_position: 27
---

The **Last Execution** FactBox on the [Bifrost Playbook](/help/orchestrator/playbook-card/) card summarizes the most recent run of the playbook, so you can see at a glance whether it worked. It is empty until the playbook has run. The FactBox is read-only.

## Fields

| Field | Description |
| --- | --- |
| **Status** | How the run ended, such as _Completed_ or _Failed_. Choose the value to open the run in [Playbook Execution Detail](/help/orchestrator/playbook-instance-card/). |
| **Started At** | When the run started. |
| **Total Duration** | How long the run took. |
| **Steps Executed** | The number of steps that ran. |
| **Steps Failed** | The number of steps that failed. Choose the value to open the run and see which ones. |
| **Items Processed** | The number of items processed across all iterations. |
| **Error Text** | The error that ended the run. Shown only when there is one. |

For earlier runs, choose **Execution Log** on the card to open the [Playbook Execution Log](/help/orchestrator/playbook-instances/).
