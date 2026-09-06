---
id: setup-jq
title: "Bifrost Setup – Nornir"
sidebar_label: "Setup – Nornir"
sidebar_position: 18
---

Bifrost Nornir adds an **Orchestrator** action group to the Bifrost Setup page, so everything this extension configures is reachable from the same place as the rest of the Bifrost configuration.

The page also raises a notification when the extension is not ready to run, with a **Run Setup Wizard** action that opens the [assisted setup](/help/nornir/scheduler-setup-wizard/).

## Actions

| Action | Description |
| --- | --- |
| **Job Queue Orchestrator Setup** | Opens [Job Queue Orchestrator Setup](/help/nornir/scheduler-setup/) to configure job queue scheduling, monitoring and restart policies. |
| **Bifrost Playbooks** | Opens [Bifrost Playbooks](/help/nornir/playbooks/) to view and configure message playbooks. |
| **Client Credentials** | Opens [Client Credentials](/help/nornir/credentials-list/) to manage authentication against external services. |
| **Playbook Execution Log** | Opens the [Playbook Execution Log](/help/nornir/playbook-instances/) for playbook runs. |

## Setup notification

When you open Bifrost Setup, the extension checks two things and shows a notification if either is missing:

| Situation | Message |
| --- | --- |
| **HTTP blocked and the queue is not running** | HTTP client requests are blocked and the orchestrator job queue is not running. |
| **HTTP blocked only** | HTTP client requests are not enabled for this extension. |
| **Queue not running only** | The orchestrator job queue is not running. |

Each notification carries a **Run Setup Wizard** action that opens the wizard at the step that fixes the problem.
