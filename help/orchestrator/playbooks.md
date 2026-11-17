---
id: playbooks
title: "Bifrost Playbooks"
sidebar_label: "Bifrost Playbooks"
sidebar_position: 9
---

A **playbook** is a routine that Bifrost Orchestrator runs step by step. Each step either calls a Bifröst
operation in Business Central or transforms data locally. The result of a step can fill in the input
of a later step, and a step can repeat for every element of an array or decide which step runs next. A playbook can run when you
choose **Run Now**, on a schedule, or when an assistant or another system asks for it.

**Bifrost Playbooks** lists the playbooks of the company with the outcome of their most recent run. It
is opened from [Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/). Choose **New**, or
open a line, to work on the [Bifrost Playbook](/help/orchestrator/playbook-card/) card.

## Fields

| Field | Description |
| --- | --- |
| **Code** | The unique code of the playbook. |
| **Description** | What the playbook does. |
| **Last Run Status** | The status of the most recent run. |
| **Last Run At** | When the playbook last ran. |

## Actions

| Action | Description |
| --- | --- |
| **Execution Log** | Opens the [Playbook Execution Log](/help/orchestrator/playbook-instances/) filtered to the selected playbook. |
