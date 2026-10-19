---
id: playbook-step-log-detail-fact-box
title: "Selected Step"
sidebar_label: "Selected Step"
sidebar_position: 29
---

The **Selected Step** FactBox on [Playbook Execution Detail](/help/orchestrator/playbook-instance-card/) shows the full detail of the line selected in the [Step Log](/help/orchestrator/playbook-step-logs/) part. It is read-only.

## Sections

| Section | Description |
| --- | --- |
| **Request Sent** | The request the step sent to its operation, with every `@` value filled in. |
| **Response Received** | The response the operation returned, or the error text when the step failed. |
| **Workspace Snapshot** | The values the playbook had collected when the step failed. Empty for steps that succeeded. |

To keep a copy, use the download actions in the **Step Log** part.
