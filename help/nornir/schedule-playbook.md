---
id: schedule-playbook
title: "Schedule Playbook"
sidebar_label: "Schedule Playbook"
sidebar_position: 13
---

**Schedule Playbook** is the dialog that turns a playbook into a scheduled job. It is opened from the **Schedule** action on the [Bifrost Playbook](/help/nornir/playbook-card/) card, and on OK it creates an [orchestrator entry](/help/nornir/scheduled-entry-card/) that runs the playbook on the selected recurring schedule.

## Fields

| Field | Description |
| --- | --- |
| **Recurring Template Code** | The [recurring template](/help/nornir/recurring-templates/) that supplies the schedule. Mandatory – the dialog cannot be confirmed without it. |
| **Notification Type** | How errors are reported: _None_, _Email_ or _Telegram_. Changing the type clears the recipient. |
| **Notification Recipient** | The address the notification is sent to. Marked as mandatory whenever a notification type other than None is selected. |
| **Job Queue Category Code** | An optional job queue category for the entry that is created. |
| **Retry Policy** | How failures are retried. The dialog opens with _Always_ selected. |
| **Emit Telemetry** | Emits telemetry for every execution of the entry that is created. |

## Tips

-   After scheduling, use **Orchestrator Entry** on the playbook card to change the schedule, block the job or run it once in the foreground.
-   If no template fits the pattern you need, create one first on [Job Queue Recurring Templates](/help/nornir/recurring-templates/).
