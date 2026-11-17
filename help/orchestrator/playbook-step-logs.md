---
id: playbook-step-logs
title: "Playbook Step Log"
sidebar_label: "Playbook Step Log"
sidebar_position: 28
---

The **Step Log** part of [Playbook Execution Detail](/help/orchestrator/playbook-instance-card/) lists every step that ran in one playbook run. A step that iterates over an array has one line per item. Use it to find where a run went wrong and what the operation or transform received and returned. The list is read-only.

Select a line to see its request and response in the [Selected Step](/help/orchestrator/playbook-step-log-detail-fact-box/) FactBox.

## Fields

| Field | Description |
| --- | --- |
| **Step No.** | The step that ran. |
| **Iteration No.** | The item number when the step iterates over an array; `0` for a single call. |
| **Step Kind** | Whether the step called an operation (**Message**) or transformed data locally (**Transform**). |
| **Message Type** | The operation a **Message** step ran. Blank for a **Transform** step. |
| **Status** | The outcome of the step: _Completed_ (green), _Failed_ (red), or _Cancelled_ when an item was skipped because an earlier step failed for it or the iteration limit was reached. |
| **Duration** | How long the step took. |
| **Error Text** | The error message, when the step failed. |
| **Confirmation Note** | For a step configured to confirm from its preview: the preview count and the count used to confirm, or why confirmation was refused. |

## Actions

| Action | Description |
| --- | --- |
| **Download Request** | Downloads the operation request or transform input, as a JSON file. |
| **Download Response** | Downloads the operation response or transform result, as a JSON file. |
| **Download Workspace** | Downloads the values the playbook had collected when the step failed. Available on failed lines only. |

## Common tasks

- **Find the cause of a failure:** look for the first red line, read **Error Text**, then compare the request in the **Selected Step** FactBox with what the operation or transform expects.
- **Review a confirmation:** read **Confirmation Note** alongside **Status** and **Error Text**. The note records the count used to confirm; the status shows whether the step completed successfully.
