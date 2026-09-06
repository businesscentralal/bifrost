---
id: playbook-instances
title: "Playbook Execution Log"
sidebar_label: "Playbook Execution Log"
sidebar_position: 8
---

The **Playbook Execution Log** lists every playbook run, newest first. It is read-only and is the starting point when a scheduled playbook has to be investigated. Select a line to open the [Playbook Execution Detail](/help/nornir/playbook-instance-card/) card with the step-by-step log.

The status column is colour coded: completed runs are shown as favourable, failed runs as unfavourable and running instances as ambiguous.

## Fields

| Field | Description |
| --- | --- |
| **Playbook Code** | The playbook that was executed. |
| **Status** | The execution status of the run. |
| **Started At** | When the execution started. |
| **Completed At** | When the execution completed. |
| **Total Duration** | The total execution time. |
| **Steps Executed** | The number of steps that were executed. |
| **Steps Failed** | The number of steps that failed. |
| **Items Processed** | The total number of items processed across all iterations. |
| **Error Text** | The error message when the run failed. |
