---
id: scheduled-entry-subform
title: "Orchestrator Entries"
sidebar_label: "Orchestrator Entries"
sidebar_position: 18
---

The **Orchestrator Entries** part lists every job that Bifrost Orchestrator supervises in this company: what it runs, when it runs and who is told about the outcome. It appears on [Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/). Use it to check the jobs at a glance and to run, reschedule or inspect one of them.

The list is read-only. Open a line to change the job on the [Job Queue Orchestrator Entry Card](/help/orchestrator/scheduled-entry-card/).

## Fields

| Field | Description |
| --- | --- |
| **Object Type to Run** | Whether the job runs a report or a codeunit. |
| **Object ID to Run** | The ID of the report or codeunit that the job runs. |
| **Object Caption to Run** | The name of that report or codeunit. |
| **Description** | A description of the job. |
| **Earliest Start Date/Time** | The earliest date and time the job may run. |
| **Recurring Template Code** | The [recurring template](/help/orchestrator/recurring-template/) that sets the schedule, if one is used. |
| **Time Zone** | The time zone the schedule is read in. |
| **No. of Minutes between Runs** | How often the job runs during the day. Blank means the job is not repeated within the day. |
| **Job Queue Category Code** | The job queue category the job belongs to. |
| **User ID** | The user that owns the job queue entry. That user must be allowed to run job queue entries; blank means the current user. Shown on-premises only. |
| **Blocked** | The orchestrator does not schedule a blocked job. |
| **Notification Type** | How the outcome is reported: _None_, _EMail_ or _Telegram_. |
| **Notification Recipient** | Who receives the notification. |
| **Emit Telemetry** | Sends telemetry for every run of the job. |
| **Client Credentials Code** | The [client credentials](/help/orchestrator/credentials-list/) the job uses to reach an external service. |
| **Scheduled** | Shows whether the job currently has a job queue entry. |
| **Run on Mondays** … **Run on Sundays** | The weekdays the job runs on. |
| **Starting Time** / **Ending Time** | The earliest and latest time of day the job runs. |
| **Next Run Date Formula** | A date formula for the next run date, for jobs that run less often than daily. |

## Actions

| Action | Description |
| --- | --- |
| **Run once (foreground)** | After you confirm, runs a one-time copy of the job now, while you wait, and reports whether it succeeded. The schedule is not changed. |
| **Reschedule** | Removes the job's current job queue entry. The orchestrator creates a new one from the job's definition on its next pass. Not available for a blocked job. |
| **Schedule Now** | Replaces the job's job queue entry with a new one scheduled to run right away. Not available for a blocked job. |
| **Activity Log** | Shows the activity logged for the job. |
| **Job Queue Entry** | Opens the standard job queue entry card for the job. Available when the job has a job queue entry. |
| **Drill Down** | Opens the record the job was created for, when one is linked to it. |

## Common tasks

- **Change a schedule:** open the line, change the schedule on the card, then choose **Reschedule** or **Schedule Now** so the job queue entry follows the new definition.
- **Test a job:** choose **Run once (foreground)** to see the result without waiting for the schedule.
