---
id: playbook-step-template-fact-box
title: "Request Template"
sidebar_label: "Request Template"
sidebar_position: 25
---

The **Request Template** FactBox on the [Bifrost Playbook](/help/orchestrator/playbook-card/) card holds the JSON request that the step selected in the [Steps](/help/orchestrator/playbook-steps/) part sends to its operation. You can edit it directly in the FactBox, or open it in a larger editor.

A value written as `@` followed by a path is filled in when the step runs, from what the playbook has collected so far: for example the initial request, values saved from earlier steps, or the current item when the step iterates over an array. A single step with an empty template sends the playbook's initial request.

To see which parameters an operation accepts, ask for its description with `Help.Implementation.Get`, or look it up on the **Bifrost Message Types** page.

## Actions

| Action | Description |
| --- | --- |
| **Edit** | Opens the template in the [Playbook Template Editor](/help/orchestrator/playbook-template-editor/), a full-page editor. |
| **Download** | Downloads the template as a JSON file. |
| **Upload** | Replaces the template with the contents of a JSON file you choose. |

## Common tasks

- **Copy a request between playbooks:** choose **Download** on one step and **Upload** on the other.
- **Check what was actually sent:** open the run in the [Playbook Execution Log](/help/orchestrator/playbook-instances/). The [Selected Step](/help/orchestrator/playbook-step-log-detail-fact-box/) FactBox shows the request with every value filled in.
