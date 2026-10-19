---
id: scheduled-entry-api
title: "Job Queue Orchestrator Entries API"
sidebar_label: "Job Queue Orchestrator Entries API"
sidebar_position: 14
---

**Job Queue Orchestrator Entries API** is an API page for developers who connect another system to
Business Central. It reads and writes orchestrator entries: what each job runs, when, how it notifies
and whether it is blocked. It is not opened by users; the same entries are maintained on the
[Job Queue Orchestrator Entry Card](/help/orchestrator/scheduled-entry-card/).

The page is published with API publisher `origo`, API group `jobQueueOrchestrator` and version `v1.0`,
as the entity set `scheduledEntries`:

```text
/api/origo/jobQueueOrchestrator/v1.0/companies({companyId})/scheduledEntries
```

## Fields

| Field | Description |
| --- | --- |
| `id` | The ID of the entry, which is also the ID of its job queue entry. |
| `objectTypeToRun`, `objectIDToRun` | The report or codeunit the job runs. |
| `description` | The description of the entry. |
| `jobQueueCategoryCode` | The job queue category. |
| `noOfMinutesBetweenRuns` | The minimum number of minutes between runs. |
| `earliestStartDateTime` | The earliest date and time the job may run. |
| `blocked` | Whether the entry is blocked. |
| `notificationType`, `notificationRecipient` | How and to whom notifications are sent. |
| `recordIDToProcess`, `relatedRecordSystemId` | The record the job processes, when it was created for one. |
| `scheduled` | Read-only: whether a job queue entry is scheduled for the entry. |

## Bound actions

Each action works on one entry and requires that the entry is not blocked.

| Action | Description |
| --- | --- |
| `ScheduleJobQueueEntryUpdate` | Deletes the entry's job queue entry and returns the entry. Bifrost Orchestrator creates a new job queue entry on its next pass. |
| `UpdateJobQueueEntry` | Deletes the entry's job queue entry and schedules a new one at once from the current definition. |
| `RestartJobQueueEntry` | Restarts the entry's job queue entry. |
| `SetStatusToReady` | Sets the status of the entry's job queue entry to _Ready_. |

## Related API pages

Bifrost Orchestrator publishes these API pages in the same API group. Their own help pages say which
fields can be changed and which bound actions they offer:

| API page | Entity set | Help |
| --- | --- | --- |
| **Job Queue Entries API** | `queueEntries` | [Job Queue Entries API](/help/orchestrator/entries-api/) |
| **Job Queue Log Entries API** | `queueLogEntries` | [Job Queue Log Entries API](/help/orchestrator/log-entry-api/) |
| **Job Queue Orchestrator Status** | `status` | [Job Queue Orchestrator Status](/help/orchestrator/scheduler-status-api/) |
| **Job Queue Categories** | `queueCategories` | [Job Queue Categories](/help/orchestrator/categories-api/) |
