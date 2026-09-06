---
id: scheduled-entry-card
title: "Job Queue Orchestrator Entry Card"
sidebar_label: "Job Queue Orchestrator Entry Card"
sidebar_position: 15
---

The **Job Queue Orchestrator Entry Card** defines one supervised job: what to run, when to run it, how to react to errors, and who to notify. The orchestrator creates and maintains the underlying job queue entry from this definition and recreates it when it fails or disappears.

New entries are created blocked, with the earliest start date set to the current date and time, so you can finish the definition before the job goes live.

## General

| Field | Description |
| --- | --- |
| **Object Type to Run** | The type of object the job runs – typically a codeunit or a report. |
| **Object ID to Run** | The ID of the object to run. This field is mandatory; the page will not close without it. |
| **Object Caption to Run** | The caption of the object, filled in from the object ID. |
| **Description** | A description of the entry. Drill down to open the related record when the entry was created from one. |
| **Report Output Type** | Output format for the run. Shown only when the object type is _Report_. |
| **Job Queue Category Code** | The job queue category the entry belongs to. |
| **Job Queue User ID** | The user that owns the job queue entry. The user must be allowed to run job queue entries; if blank the current user is used. On-premises only. |
| **Blocked** | Stops the orchestrator from scheduling the entry. New entries start blocked – clear this field when the definition is complete. |
| **Emit Telemetry** | Emits telemetry for every execution of this entry. |
| **Client Credentials Code** | The [client credentials](/help/nornir/credentials-list/) used when this entry calls an external service. |
| **Earliest Start Date/Time** | The earliest date and time at which the job may run. |
| **Recurring Template Code** | A [recurring template](/help/nornir/recurring-template/) that supplies the schedule. When a template is selected, the fields in the Recurrence group become read-only and follow the template. |
| **Scheduled** | Shows whether this entry currently has a job queue entry scheduled for it. |

## Retry Policy

| Field | Description |
| --- | --- |
| **Retry Policy** | How the orchestrator reacts when the job fails. **Always** – the entry is always restarted. **Three Times** – the entry is restarted only while it has failed fewer than three times. **Never** – the entry is never restarted automatically. |
| **Errors Since Last Success** | The number of consecutive failures since the last successful run. The counter is reset when the entry runs successfully. |

## Recurrence

The Recurrence group is editable only when **Recurring Template Code** is blank. The schedule is validated when the page is closed.

| Field | Description |
| --- | --- |
| **Run on Mondays … Run on Sundays** | The weekdays on which the job runs. At least one day must be selected for a recurring job. |
| **Time Zone** | The time zone the schedule is interpreted in. Use the assist button to pick a time zone. |
| **Next Run Date Formula** | A date formula used to calculate the next run date, for example `1M` for monthly. |
| **Starting Time** | The earliest time of day at which the recurring job may run. |
| **Ending Time** | The latest time of day at which the recurring job may run. |
| **No. of Minutes between Runs** | The minimum number of minutes between two runs of the job. |

## Notification

| Field | Description |
| --- | --- |
| **Notification Type** | How the owner is notified about the run: _None_, _Email_ or _Telegram_. Selecting Telegram fills in the recipient from your Telegram chat ID in User Setup when one is stored. |
| **Notification Recipient** | The address the notification is sent to – an email address or a Telegram chat ID. The field is marked as mandatory when the selected notification type requires a recipient. Use the assist button to send a test notification. |

## Actions

| Action | Description |
| --- | --- |
| **Run once (foreground)** | Runs a copy of this job once, immediately, in the foreground. Useful for testing a definition before letting it run on a schedule. |
| **Reschedule** | Deletes the current job queue entry. The orchestrator creates a new one on its next pass. The entry must not be blocked. |
| **Schedule Now** | Recreates the job queue entry so the job is scheduled for execution now. The entry must not be blocked. |
| **Activity Log** | Opens the activity log for this entry, so you can review previous runs and errors. |
| **Job Queue Entry** | Opens the [Job Queue Entry Card](/help/nornir/job-queue-entry-card/) for the underlying job queue entry. Enabled only while such an entry exists. |
