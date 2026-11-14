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

## Ask a language model for a verdict {#ask-a-language-model-for-a-verdict}

When a rule cannot be written as a filter ("is this customer set up correctly?"), a **Check** step can ask a language model for a verdict (pass, fail or unknown) and let the model look data up. The model only reads; it cannot change data. What the lookup can and cannot do is described under [Bifrost Language Models](/language-models/).

- **Shape of the step:** a **Check** step that repeats for each record of an earlier step, with **Iterate Source Step No.** and **Iterate Array Path** pointing at that step's records. Its Success conditions are that the answer was delivered, that the answer matched the requested shape, and that the verdict is pass.
- **What each outcome means:** pass means the item succeeded. Fail or unknown means the item is checked and needs attention: the Check answered no, and the run does not fail. If the model could not run, the item is an error and counts as a failure of the run.
- **Keep the findings:** use **Result Log Paths** to keep the verdict and the findings, and the reason a run stopped, for each item.
- **Report the counts:** take the number of items per outcome from the step's item counts in the run report. **Summary Paths** on a repeating step keeps only the last item.
- **Mind the cost:** each item is one model run, and each lookup it makes is a counted message (see [Usage and billing](/licensing/usage-and-billing/)). The cost grows with the number of records the earlier step reads, so limit what that step reads.
- **Run it without a timeout:** a run started with **Run Now**, on a schedule or by queuing it has no client timeout. An assistant or system that starts a playbook and waits for the answer can time out first; for long runs it should queue the playbook instead of waiting.
- **Safe to schedule:** a verdict playbook writes nothing, so it is safe to schedule once you have tried it. A playbook that acts on the verdict adds its own write step, which you control separately.
- **For an assistant:** an assistant connected to Bifröst reads the installed operations and their worked examples live, with `list_domains`, `describe_domains` and `describe_message_type`.
