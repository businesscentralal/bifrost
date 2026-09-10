---
id: orchestrator-setup
title: "Bifröst Orchestrator Setup"
sidebar_label: "Orchestrator Setup"
sidebar_position: 17
---

**Bifröst Orchestrator Setup** is the single setup page of the orchestrator module. It holds the settings for the management job queue entry that monitors and restarts scheduled jobs, the status of the Telegram bot token, and the list of the orchestrator entries themselves. Everything else the module configures is reachable from here through an action.

The page is opened from the **Apps** group on the Bifröst **Setup** page. There is one setup record per company, created automatically the first time the page opens.

## Fields

| Field | Description |
| --- | --- |
| **Job Queue Category Code** | The job queue category that the management job queue entry belongs to. Mandatory — it groups the orchestrator's own job with the jobs it supervises. |
| **Log Job Queue Activity** | Turns on logging of job queue activity so that runs can be reviewed afterwards from the activity log. |
| **Job Queue User ID** | The user that owns the management job queue entry. That user must be allowed to run job queue entries. Blank means the current user. Shown on-premises only. |
| **Job Queue Orchestrator Status** | Read-only status of the management job queue entry. Drill down to open the underlying job queue entry and refresh the status. |
| **Emit Telemetry** | Emits telemetry for every execution the orchestrator performs. |
| **Telegram Bot Token** | Read-only status showing whether a bot token has been stored. The value itself is never displayed — it lives in the Bifröst secret store under the code `TELEGRAM-BOT-TOKEN`. |

## Job Queues

The **Job Queues** part lists the orchestrator entries registered in this company. Select a line and open it to reach the [Job Queue Orchestrator Entry Card](/help/orchestrator/scheduled-entry-card/), where the schedule, retry policy and notification settings for that job are maintained.

## Actions

| Action | Description |
| --- | --- |
| **Bifrost Playbooks** | Opens [Bifrost Playbooks](/help/orchestrator/playbooks/) to view and configure message playbooks. |
| **Client Credentials** | Opens [Client Credentials](/help/orchestrator/credentials-list/) to manage authentication against external services. |
| **Playbook Execution Log** | Opens the [Playbook Execution Log](/help/orchestrator/playbook-instances/) for playbook runs. |
| **App Secrets** | Opens the Bifröst App Secrets list filtered to Bifrost Orchestrator, showing every secret this module needs and whether a value has been entered. |
| **Job Queue Entries** | Opens the standard [Job Queue Entries](/help/orchestrator/job-queue-entries/) list, so you can see the actual job queue entries created from the orchestrator entries. |
| **Recurring Templates** | Opens [Job Queue Recurring Templates](/help/orchestrator/recurring-templates/), where reusable schedule patterns are maintained. |
| **Restart Job Queue** | Restarts the management job queue entry. Use it when the orchestrator status shows that the queue has stopped. |
| **Set Telegram Bot Token** | Opens the shared masked dialog and stores the bot token in the Bifröst secret store. |
| **Clear Telegram Bot Token** | Removes the stored bot token. The secret stays registered, so the page keeps showing that a value is expected. |

## Secrets

Bifröst Orchestrator keeps every credential in the Bifröst Foundation secret store rather than in its own tables. The values are written to Isolated Storage, are never shown again, and never reach a table, a log or telemetry.

| Secret code | Scope | Used for |
| --- | --- | --- |
| `TELEGRAM-BOT-TOKEN` | Company | The Telegram Bot API token used to send notifications. |
| `CREDENTIAL-<Code>-CLIENT-ID` | Company | The OAuth 2.0 client id of one [client credentials](/help/orchestrator/credentials-card/) record. |
| `CREDENTIAL-<Code>-CLIENT-SECRET` | Company | The OAuth 2.0 client secret of that record. |

Business Central keeps stored secrets separate per extension, so values entered in an earlier version of the app — or in the legacy Origo Cloud Events orchestrator — cannot be carried over. Enter each value once after installing.

## Setup notification

When you open the page, the extension checks two things and shows a notification if either is missing:

| Situation | Message |
| --- | --- |
| **HTTP blocked and the queue is not running** | HTTP client requests are blocked and the orchestrator job queue is not running. |
| **HTTP blocked only** | HTTP client requests are not enabled for this extension. |
| **Queue not running only** | The orchestrator job queue is not running. |

Each notification carries a **Run Setup Wizard** action that opens the [assisted setup](/help/orchestrator/scheduler-setup-wizard/) at the step that fixes the problem.

A second notification counts the secrets that still have no value, with an action that opens the App Secrets list. It disappears once every registered secret has been entered.

## Tips

-   If the status field shows that the queue is not running, either use **Restart Job Queue** here or run the [setup wizard](/help/orchestrator/scheduler-setup-wizard/).
-   The Telegram bot token is only needed when an orchestrator entry or a scheduled playbook uses the _Telegram_ notification type.
