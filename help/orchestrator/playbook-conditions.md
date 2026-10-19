---
id: playbook-conditions
title: "Step Conditions"
sidebar_label: "Step Conditions"
sidebar_position: 24
---

The **Step Conditions** part of the [Bifrost Playbook](/help/orchestrator/playbook-card/) card decides whether a step runs, which way the playbook goes after it, and whether the run should be marked as failed. It shows the conditions of the step selected in the [Steps](/help/orchestrator/playbook-steps/) part; new lines belong to that step.

A step without conditions always runs, and it succeeds when its operation completes without an error.

## Fields

| Field | Description |
| --- | --- |
| **Step No.** | The step the condition belongs to. |
| **Condition Type** | **Start** decides whether the step runs at all; when it is false, the step is skipped and the playbook continues with the step's success branch. **Success** decides whether the step succeeded, and with it the branch. **Error** marks the run as failed without changing the branch. |
| **Group No.** | All conditions in a group must be true. It is enough for any one group to be true. |
| **Path** | Where the value is read: a path in the playbook's workspace for Start and Error conditions, a path in the step's response for Success conditions. |
| **Operator** | How the value at the path is compared: _Equals_, _Not Equals_, _Greater Than_, _Less Than_, _Greater or Equal_, _Less or Equal_, _Contains_ or _Exists_. |
| **Value** | The value to compare against. Not needed for _Exists_. |
| **Description** | An optional note on what the condition is for. |

## Common tasks

- **Run a step only sometimes:** add a Start condition on a value an earlier step saved.
- **Branch on an answer:** add a Success condition on the response, then set the step's two next-step numbers in the Steps part.
- **Flag a result without stopping:** add an Error condition. The playbook carries on, and the run is reported as failed.
