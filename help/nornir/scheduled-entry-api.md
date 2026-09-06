---
id: scheduled-entry-api
title: "Job Queue Orchestrator API"
sidebar_label: "Job Queue Orchestrator API"
sidebar_position: 14
---

Bifrost Nornir publishes a small set of API pages under the publisher `origo`, API group `jobQueueOrchestrator`, version `v1.0`. They are used programmatically by external integrations and are not opened by users.

## Endpoints

| API page | Endpoint | Description |
| --- | --- | --- |
| **Job Queue Orchestrator Entries API** | `/api/origo/jobQueueOrchestrator/v1.0/scheduledEntries` | Read and write orchestrator entries: object to run, schedule, notification settings and blocked state. Bound actions can reschedule, restart or set the linked job queue entry to Ready. |
| **Job Queue Entries API** | `/api/origo/jobQueueOrchestrator/v1.0/queueEntries` | Read-only view of the standard job queue entries, including status, schedule and the last error message. |
| **Job Queue Log Entries API** | `/api/origo/jobQueueOrchestrator/v1.0/queueLogEntries` | Read-only view of the job queue log entries, for checking the outcome of past runs. |
| **Job Queue Orchestrator Status** | `/api/origo/jobQueueOrchestrator/v1.0/status` | Read-only status of the orchestrator itself, for external monitoring. |
| **Job Queue Categories** | `/api/origo/jobQueueOrchestrator/v1.0/queueCategories` | Read-only list of the job queue categories available in the company. |

## Bound actions

The orchestrator entries endpoint exposes four bound actions. All of them require that the entry is not blocked.

| Action | Description |
| --- | --- |
| **ScheduleJobQueueEntryUpdate** | Deletes the linked job queue entry and returns the updated orchestrator entry. The orchestrator recreates the job on its next pass. |
| **UpdateJobQueueEntry** | Deletes the linked job queue entry and immediately schedules a new one from the current definition. |
| **RestartJobQueueEntry** | Restarts the linked job queue entry. |
| **SetStatusToReady** | Sets the linked job queue entry status to Ready. |
