---
id: playbook-instance-card
title: "Playbook Execution Detail"
sidebar_label: "Playbook Execution Detail"
sidebar_position: 7
---

The **Playbook Execution Detail** card shows one playbook run in full: the timings, the counters, any error, and the log of every step that was executed. The card is read-only.

## General

| Field | Description |
| --- | --- |
| **Playbook Code** | The playbook that was executed. |
| **Status** | The execution status of the run. |
| **Started At** | When the execution started. |
| **Completed At** | When the execution completed. |
| **Total Duration** | The total execution time. |

## Counters

| Field | Description |
| --- | --- |
| **Steps Executed** | The number of steps that were executed. |
| **Steps Failed** | The number of steps that failed. |
| **Items Processed** | The total number of items processed across all iterations. |

## Error

The **Error** group is shown only when the run produced an error. It contains the error message that ended the run.

## Step Log

The **Step Log** part lists every step execution in the run, including one line per iteration when a step iterates over an array. Select a line to see its request, response and timing in the **Selected Step** FactBox.
