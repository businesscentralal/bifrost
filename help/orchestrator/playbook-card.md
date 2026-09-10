---
id: playbook-card
title: "Bifrost Playbook"
sidebar_label: "Playbook"
sidebar_position: 6
---

The **Bifrost Playbook** card is where a chain of Bifrost message types is defined: the steps, the conditions that gate and branch them, and the JSON payload handed to the first step. The card also shows the outcome of the most recent run, step by step.

## General

| Field | Description |
| --- | --- |
| **Code** | The unique code of the playbook. |
| **Description** | The description of the playbook. |
| **Scheduled** | Indicates whether the playbook has an active orchestrator entry attached to it. |
| **Initial Request JSON** | The JSON payload passed to the first step when no runtime initial request is supplied. Edited directly in the field. |

## Steps

The **Steps** part holds the step definitions, in execution order. Steps that iterate over an array are indented, and disabled steps are dimmed. The _Last Run_ column shows the outcome of each step in the most recent execution.

| Column | Description |
| --- | --- |
| **Step No.** | The sequence number of the step. |
| **Last Run** | The result of this step in the most recent execution: completed, failed, skipped, or not run. |
| **Description** | What the step does. |
| **Message Type** | The Bifrost message type the step executes. |
| **Iterate Array Path** | The JSON path to an array that the step iterates over. Leave it empty for a single call. |
| **Iterate Source Step No.** | Which earlier step's response contains the array to iterate. |
| **Step Type** | **Action** – a false success condition counts as a failure. **Check** – the condition is simply the answer and does not fail the run. |
| **Summary Paths** | Response paths copied into the run report for this step. Keep the list short – it feeds the report, not the later steps. |
| **Exclude From Run Status** | Leaves the step out of the run status and the report. Use it for the reporting steps themselves. |
| **Next Step No. (Success)** | The step to continue with when the condition succeeds. `0` completes the playbook. |
| **Next Step No. (Failure)** | The step to continue with when the condition fails. `0` ends the playbook. |
| **Stop On Item Error** | Aborts the playbook when one item in an iteration fails, instead of continuing with the remaining items. |
| **Disabled** | The runner skips the step without executing it. |

## Step Conditions

The **Step Conditions** part shows the conditions belonging to the step selected above. Conditions in the same group must all be true; it is enough for any one group to be true.

| Column | Description |
| --- | --- |
| **Step No.** | The step the condition belongs to. |
| **Condition Type** | **Start** gates whether the step runs at all, **Success** picks the branch, and **Error** fails the run without changing the branch. |
| **Group No.** | Conditions are OR-ed across groups and AND-ed inside a group. |
| **Path** | A workspace path for Start and Error conditions, a response path for Success conditions. |
| **Operator** | How the value found at the path is compared. |
| **Value** | The value to compare against. |
| **Description** | An optional note explaining what the condition is for. |

## FactBoxes

| FactBox | Description |
| --- | --- |
| **Request Template** | The request template of the step selected in the Steps part. |
| **Last Execution** | A summary of the most recent run of this playbook. |

## Actions

| Action | Description |
| --- | --- |
| **Run Now** | Executes the playbook immediately in the foreground, using the initial request JSON from the card. When the run ends, the last run status, timestamp and instance are updated and a message reports the outcome. |
| **Schedule** | Opens the [Schedule Playbook](/help/orchestrator/schedule-playbook/) dialog and creates an orchestrator entry that runs the playbook on a recurring schedule. Disabled once the playbook is scheduled. |
| **Orchestrator Entry** | Opens the linked [orchestrator entry](/help/orchestrator/scheduled-entry-card/) so the schedule can be managed. Enabled only when the playbook is scheduled. |
| **Execution Log** | Opens the [Playbook Execution Log](/help/orchestrator/playbook-instances/) filtered to this playbook. |
