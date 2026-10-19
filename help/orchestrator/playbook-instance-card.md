---
id: playbook-instance-card
title: "Playbook Execution Detail"
sidebar_label: "Playbook Execution Detail"
sidebar_position: 7
---

**Playbook Execution Detail** shows one playbook run in full: when it ran, how many steps and items it
handled, any error, and the log of every step. Use it to find out why a run failed or what a step sent
and received. The card is read-only. Open it from the
[Playbook Execution Log](/help/orchestrator/playbook-instances/).

## General

| Field | Description |
| --- | --- |
| **Playbook Code** | The playbook that ran. |
| **Status** | The status of the run: _Running_, _Completed_, _Failed_ or _Cancelled_. |
| **Started At** | When the run started. |
| **Completed At** | When the run ended. |
| **Total Duration** | How long the run took. |

## Counters

| Field | Description |
| --- | --- |
| **Steps Executed** | The number of steps that ran. |
| **Steps Failed** | The number of steps that failed. |
| **Items Processed** | The number of items handled by steps that repeat over an array. |

## Error

The **Error** group appears only when the run ended with an error. **Error Text** holds the error
message.

## Step Log

The **Step Log** part lists every step the run executed, with one line for each item when a step
repeats over an array. See [Step Log](/help/orchestrator/playbook-step-logs/).

## Selected Step

The **Selected Step** FactBox shows the line selected in **Step Log**: the request the step sent, the
answer it received and its timing. See [Selected Step](/help/orchestrator/playbook-step-log-detail-fact-box/).
