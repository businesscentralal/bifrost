---
id: playbooks
title: "Bifrost Playbooks"
sidebar_label: "Playbooks"
sidebar_position: 9
---

A **playbook** is a declarative chain of Bifrost message types. Each step calls one message type, and the response of a step can drive the request of the next step, be iterated over as an array, or decide which branch the run takes.

This list shows every playbook defined in the company together with the outcome of its most recent run. Select a line to open the [Bifrost Playbook](/help/orchestrator/playbook-card/) card.

## Fields

| Field | Description |
| --- | --- |
| **Code** | The unique code of the playbook. |
| **Description** | The description of the playbook. |
| **Last Run Status** | The status of the most recent execution. |
| **Last Run At** | When the playbook was last executed. |

## Actions

| Action | Description |
| --- | --- |
| **Execution Log** | Opens the [Playbook Execution Log](/help/orchestrator/playbook-instances/) filtered to the selected playbook. |
