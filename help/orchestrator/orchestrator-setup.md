---
id: orchestrator-setup
title: "Bifrost Orchestrator Setup"
sidebar_label: "Bifrost Orchestrator Setup"
sidebar_position: 17
---

**Bifrost Orchestrator Setup** is the setup page of Bifrost Orchestrator, for the administrator who sets
the app up. It holds the settings of the management job queue entry that monitors and restarts the
supervised jobs, the status of the Telegram bot token, and the list of orchestrator entries. Playbooks,
client credentials, the playbook execution log and the app's secrets are opened from here.

Open it with **Bifrost Orchestrator Setup** in the **Apps** group on
[Bifrost Setup](/help/foundation/bifrost-setup/). There is one setup record per company; it is created
the first time the page opens. The page shows no notifications of its own: anything that still needs
setting up is shown on Bifrost Setup.

## General

| Field | Description |
| --- | --- |
| **Job Queue Category Code** | The job queue category of the management job queue entry. Mandatory. |
| **Log Job Queue Activity** | Records what Bifrost Orchestrator does with each supervised entry in the activity log, which **Activity Log** on the entry card shows. |
| **User ID** | The user that owns the management job queue entry. That user must be allowed to run job queue entries. If it is blank, the current user is used. Shown on-premises only. An AI agent cannot change this field through Bifröst; change it here. |
| **Job Queue Orchestrator Status** | Whether the management job queue entry is running. Choose the value to open that job queue entry; if there is none, you are offered to schedule it. |
| **Emit Telemetry** | Emits telemetry for every run. |

## Telegram

| Field | Description |
| --- | --- |
| **Telegram Bot Token** | **Set** when the bot token used to send Telegram notifications has been entered, **Not set** when it has not. The value is kept in the Bifröst secret store and is never shown. |

## Orchestrator Entries

The **Orchestrator Entries** part lists the orchestrator entries of the company: each job that Bifrost
Orchestrator supervises, with its object, schedule, notification and status. Open a line to work on the
[Job Queue Orchestrator Entry Card](/help/orchestrator/scheduled-entry-card/). See
[Orchestrator Entries](/help/orchestrator/scheduled-entry-subform/) for its columns and actions.

## Actions

| Action | Description |
| --- | --- |
| **Restart Job Queue** | Restarts the management job queue entry. Use it when **Job Queue Orchestrator Status** shows that it is not running. |
| **Set Telegram Bot Token** | Opens the [Set Secret](/help/foundation/set-secret-dialog/) dialog, where you enter the bot token. |
| **Clear Telegram Bot Token** | Removes the stored bot token after you confirm. |
| **Setup Wizard** | Opens the [Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/), which allows HTTP requests for all Bifröst apps and walks through the credentials of every app. |
| **Bifrost Playbooks** | Opens [Bifrost Playbooks](/help/orchestrator/playbooks/). |
| **Client Credentials** | Opens [Client Credentials](/help/orchestrator/credentials-list/), the credential pairs used for external services. |
| **Playbook Execution Log** | Opens the [Playbook Execution Log](/help/orchestrator/playbook-instances/). |
| **App Secrets** | Opens [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/) filtered to Bifrost Orchestrator: every secret the app needs and whether a value has been entered. |
| **Job Queue Entries** | Opens the standard [Job Queue Entries](/help/orchestrator/job-queue-entries/) list. |
| **Recurring Templates** | Opens [Job Queue Recurring Templates](/help/orchestrator/recurring-templates/), the reusable schedules. |

## Secrets

Bifrost Orchestrator keeps its secrets in the Bifröst secret store, never on a page or in a table: the
Telegram bot token, and the client ID and client secret of each
[client credential pair](/help/orchestrator/credentials-card/). They are stored for this company and
never shown again. Enter them here, on the client credentials card, or in the Bifrost Setup Wizard.

## Getting started

1. On **Bifrost Setup**, run the setup wizard if a notification asks you to. It allows the Bifröst apps
   to make HTTP requests, which Telegram notifications and calls to external services need.
2. Run the [Bifrost Orchestrator Setup](/help/orchestrator/scheduler-setup-wizard/) assisted setup to
   start the management job queue.
3. Open this page and check that **Job Queue Orchestrator Status** shows the job queue running.
4. If you want Telegram notifications, choose **Set Telegram Bot Token**. Each person who receives them
   needs a **Telegram Chat ID** in the [User Setup Editor](/help/foundation/bifrost-user-setup-editor/).
5. Add the client credentials your entries need, and put the job queue entries you want supervised
   under Bifrost Orchestrator with **Add to Bifrost Orchestrator** on
   [Job Queue Entries](/help/orchestrator/job-queue-entries/).

## Tips

- If the status shows that the job queue is not running, choose **Restart Job Queue**, or run the
  [assisted setup](/help/orchestrator/scheduler-setup-wizard/) again.
- The Telegram bot token is needed only when an orchestrator entry or a scheduled playbook uses the
  _Telegram_ notification type, or when an assistant sends Telegram messages.
