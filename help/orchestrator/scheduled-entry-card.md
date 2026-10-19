---
id: scheduled-entry-card
title: "Job Queue Orchestrator Entry Card"
sidebar_label: "Job Queue Orchestrator Entry Card"
sidebar_position: 15
---

The **Job Queue Orchestrator Entry Card** defines one job that Bifrost Orchestrator supervises: what to
run, when, what to do when it fails, and whom to notify. Bifrost Orchestrator creates the job queue
entry from this definition and recreates it when it fails or disappears.

Open the card from the **Orchestrator Entries** part of
[Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/), with **Orchestrator Entry** on a
scheduled playbook, or by choosing **Add to Bifrost Orchestrator** on a
[job queue entry](/help/orchestrator/job-queue-entries/).

A new entry starts blocked, with **Earliest Start Date/Time** set to now, so you can finish the
definition before the job runs.

## General

| Field | Description |
| --- | --- |
| **Object Type to Run** | Whether the job runs a _Report_ or a _Codeunit_. |
| **Object ID to Run** | The ID of the object to run. Mandatory: the card cannot be closed without it. |
| **Object Caption to Run** | The caption of the object. |
| **Description** | A description of the entry. When the entry was created for a record, choose the value to open that record. |
| **Report Output Type** | The output format of the report. Shown only when **Object Type to Run** is _Report_. |
| **Job Queue Category Code** | The job queue category of the entry. |
| **User ID** | The user that owns the job queue entry and whose permissions it runs with. That user must be allowed to run job queue entries. If it is blank, the current user is used. Shown on-premises only. |
| **Blocked** | Stops Bifrost Orchestrator from scheduling the entry. Clear it when the definition is complete. |
| **Emit Telemetry** | Emits telemetry for every run of the entry. |
| **Client Credentials Code** | The [client credentials](/help/orchestrator/credentials-list/) used when the job calls an external service. |
| **Earliest Start Date/Time** | The earliest date and time the job may run. |
| **Recurring Template Code** | A [recurring template](/help/orchestrator/recurring-template/) that gives the schedule. When one is selected, the **Recurrence** fields follow the template and cannot be edited. |
| **Scheduled** | Shows whether a job queue entry is currently scheduled for the entry. |

## Retry Policy

| Field | Description |
| --- | --- |
| **Retry Policy** | What happens when the job fails. _Always_: the entry is always restarted. _Three Times_: the entry is restarted only while it has failed fewer than three times in a row. _Never_: the entry is not restarted automatically. |
| **Errors Since Last Success** | The number of failures in a row since the last successful run. It is reset when the job runs successfully. |

## Recurrence

The **Recurrence** fields can be edited only when **Recurring Template Code** is blank. The schedule is
checked when you close the card.

| Field | Description |
| --- | --- |
| **Run on Mondays** … **Run on Sundays** | The weekdays on which the job runs. A recurring job needs at least one. |
| **Time Zone** | The time zone the schedule is read in. Use the assist button to choose one. |
| **Next Run Date Formula** | A date formula for the next run date, for example `1M` for monthly. |
| **Starting Time** | The earliest time of day the job may run. |
| **Ending Time** | The latest time of day the job may run. |
| **No. of Minutes between Runs** | The minimum number of minutes between two runs. |

## Notification

| Field | Description |
| --- | --- |
| **Notification Type** | How you are told when the job fails or is restarted: _None_, _EMail_ or _Telegram_. When you choose _Telegram_ and **Notification Recipient** is blank, your own Telegram chat ID from your Bifröst user setup is filled in. |
| **Notification Recipient** | The e-mail address or Telegram chat ID the notification goes to. Mandatory when the notification type needs a recipient. Use the assist button to send a test notification. |

An AI agent cannot change **User ID** or **Notification Recipient** through Bifröst's general data
operations, so who a job runs as and where its notifications go are set on this card. An assistant can
set the recipient only when it schedules a playbook for you.

## Actions

| Action | Description |
| --- | --- |
| **Run once (foreground)** | Runs a copy of the job once, now, in the foreground. Use it to test a definition before it runs on its schedule. |
| **Reschedule** | Removes the current job queue entry; Bifrost Orchestrator creates a new one on its next pass. The entry must not be blocked. |
| **Schedule Now** | Recreates the job queue entry so the job is scheduled to run now. The entry must not be blocked. |
| **Activity Log** | Shows what Bifrost Orchestrator has done with this entry, such as restarts and errors, when **Log Job Queue Activity** is selected on the setup page. |
| **Job Queue Entry** | Opens the [Job Queue Entry Card](/help/orchestrator/job-queue-entry-card/) of the entry's job queue entry. Available only while that job queue entry exists. |
