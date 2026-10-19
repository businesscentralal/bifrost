---
id: playbook-instances
title: "Playbook Execution Log"
sidebar_label: "Playbook Execution Log"
sidebar_position: 8
---

The **Playbook Execution Log** lists playbook runs, grouped by playbook with the newest run first. Start
here when you need to know whether a playbook ran, or why it failed. The list is read-only. Open a line
to see the run step by step on [Playbook Execution Detail](/help/orchestrator/playbook-instance-card/).

Open the log with **Playbook Execution Log** on
[Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/), or with **Execution Log** on a
playbook, which filters it to that playbook.

The **Status** column is colored: completed runs green, failed runs red and running runs yellow.

## Fields

| Field | Description |
| --- | --- |
| **Playbook Code** | The playbook that ran. |
| **Status** | The status of the run. |
| **Started At** | When the run started. |
| **Completed At** | When the run ended. |
| **Total Duration** | How long the run took. |
| **Steps Executed** | The number of steps that ran. |
| **Steps Failed** | The number of steps that failed. |
| **Items Processed** | The number of items handled by steps that repeat over an array. |
| **Error Text** | The error message when the run failed. |
