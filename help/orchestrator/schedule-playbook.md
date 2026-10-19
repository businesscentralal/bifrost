---
id: schedule-playbook
title: "Schedule Playbook"
sidebar_label: "Schedule Playbook"
sidebar_position: 13
---

**Schedule Playbook** turns a playbook into a scheduled job. Open it with **Schedule** on the
[Bifrost Playbook](/help/orchestrator/playbook-card/) card. When you choose **OK**, it creates an
[orchestrator entry](/help/orchestrator/scheduled-entry-card/) that runs the playbook on the schedule of
the template you choose. The entry is ready to run; it is not blocked.

## Schedule

| Field | Description |
| --- | --- |
| **Recurring Template Code** | The [recurring template](/help/orchestrator/recurring-templates/) that gives the schedule. Mandatory: the dialog cannot be confirmed without it. |

## Notification

| Field | Description |
| --- | --- |
| **Notification Type** | How you are told about the job: _None_, _EMail_ or _Telegram_. Changing it clears **Notification Recipient**. |
| **Notification Recipient** | The e-mail address or Telegram chat ID the notification goes to. Mandatory when **Notification Type** is not _None_. |

## Advanced

| Field | Description |
| --- | --- |
| **Job Queue Category Code** | An optional job queue category for the entry. |
| **Retry Policy** | How failures are retried: _Always_, _Three Times_ or _Never_. The dialog opens with _Always_. |
| **Emit Telemetry** | Emits telemetry for every run of the entry. |

## Tips

- A playbook can be scheduled once. To change the schedule later, choose **Orchestrator Entry** on the
  playbook card; there you can also block the job or run it once.
- If no template fits, create one first on
  [Job Queue Recurring Templates](/help/orchestrator/recurring-templates/).
- You need permission to schedule playbooks. A user who may only view playbooks cannot open this
  dialog.
