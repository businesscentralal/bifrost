---
id: playbook-steps
title: "Playbook Steps"
sidebar_label: "Playbook Steps"
sidebar_position: 23
---

The **Steps** part of the [Bifrost Playbook](/help/orchestrator/playbook-card/) card is where you build a playbook: one line per step, each running one Bifröst operation, in the order the steps run. Step numbers are assigned as you add lines, and each step names the step that follows it, so a playbook can branch on the outcome.

Steps that iterate over an array are indented, and disabled steps are dimmed. Select a step to see its conditions in the [Step Conditions](/help/orchestrator/playbook-conditions/) part and its request in the [Request Template](/help/orchestrator/playbook-step-template-fact-box/) FactBox.

## Fields

| Field | Description |
| --- | --- |
| **Step No.** | The sequence number of the step. |
| **Last Run** | The outcome of the step in the most recent run: ✓ completed, ✗ failed, – skipped, · not run. Blank when the playbook has not run. |
| **Description** | What the step does. |
| **Message Type** | The operation the step runs. The operations installed in Business Central are listed on the **Bifrost Message Types** page. |
| **Iterate Array Path** | The JSON path to an array in an earlier step's response. The step then runs once for each item. Leave it empty for a single call. |
| **Iterate Source Step No.** | The earlier step whose response contains that array. |
| **Step Type** | **Action**: a false success condition counts as a failure. **Check**: the condition is simply the answer and does not fail the run. |
| **Summary Paths** | Response paths copied into the run report for this step. Keep the list short; it feeds the report, not the later steps. |
| **Exclude From Run Status** | Leaves the step out of the run status and the report. Use it for the reporting steps themselves. |
| **Next Step No. (Success)** | The step to continue with when the step succeeds. `0` completes the playbook. A disabled or skipped step also continues here. |
| **Next Step No. (Failure)** | The step to continue with when the step fails. `0` ends the playbook. |
| **Stop On Item Error** | Stops the playbook when one item of an iteration fails, instead of continuing with the remaining items. |
| **Disabled** | The playbook skips the step without running it. |

## Common tasks

- **Add a step:** enter a new line, choose the operation in **Message Type**, then write its request in the **Request Template** FactBox.
- **Branch on the outcome:** set **Next Step No. (Success)** and **Next Step No. (Failure)** to different steps, and add Success conditions if the operation's answer, not just its completion, decides the branch.
- **Process a list:** point **Iterate Source Step No.** and **Iterate Array Path** at the array an earlier step returned.
- **Check a change:** choose **Run Now** on the card and read the **Last Run** column.
