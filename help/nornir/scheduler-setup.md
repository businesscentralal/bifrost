---
id: scheduler-setup
title: "Job Queue Orchestrator Setup"
sidebar_label: "Job Queue Orchestrator Setup"
sidebar_position: 17
---

The **Job Queue Orchestrator Setup** page is the central configuration page for scheduling in Bifrost Nornir. It holds the settings for the management job queue entry that monitors and restarts scheduled jobs, the Telegram bot token used for notifications, and a list of the orchestrator entries themselves.

There is a single setup record per company. It is created automatically the first time you open the page.

## Fields

| Field | Description |
| --- | --- |
| **Job Queue Category Code** | The job queue category that the management job queue entry belongs to. This field is mandatory – it groups the orchestrator's own job with the jobs it supervises. |
| **Log Job Queue Activity** | Turns on logging of job queue activity so that runs can be reviewed afterwards from the activity log. |
| **Job Queue User ID** | The user that owns the management job queue entry. That user must be allowed to run job queue entries. If left blank the current user is used. The field is shown on-premises only. |
| **Job Queue Orchestrator Status** | Read-only status of the management job queue entry. Drill down to open the underlying job queue entry and refresh the status. |
| **Emit Telemetry** | When enabled, telemetry is emitted for every execution the orchestrator performs. |
| **Telegram Bot Token** | The Telegram Bot API token used to send notifications. The value is masked and stored securely – once saved it is shown as `***` and can only be replaced, not read back. |
| **Bot Token Configured** | Read-only indicator that shows whether a Telegram bot token has been stored. |

## Job Queues

The **Job Queues** part at the bottom of the page lists the orchestrator entries registered in this company. Select a line and open it to reach the [Job Queue Orchestrator Entry Card](/help/nornir/scheduled-entry-card/), where the schedule, retry policy and notification settings for that job are maintained.

## Actions

| Action | Description |
| --- | --- |
| **Job Queue Entries** | Opens the standard [Job Queue Entries](/help/nornir/job-queue-entries/) list, so you can see the actual job queue entries created from the orchestrator entries. |
| **Recurring Templates** | Opens [Job Queue Recurring Templates](/help/nornir/recurring-templates/), where reusable schedule patterns are maintained. |
| **Restart Job Queue** | Restarts the management job queue entry. Use it when the orchestrator status shows that the queue has stopped. |

## Tips

-   If the status field shows that the queue is not running, either use **Restart Job Queue** here or run the [setup wizard](/help/nornir/scheduler-setup-wizard/).
-   The Telegram bot token is only needed when an orchestrator entry or a scheduled playbook uses the _Telegram_ notification type.
-   Client credentials used to call external services are maintained separately on [Client Credentials](/help/nornir/credentials-list/).
