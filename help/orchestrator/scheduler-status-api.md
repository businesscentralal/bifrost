---
id: scheduler-status-api
title: "Job Queue Orchestrator Status"
sidebar_label: "Job Queue Orchestrator Status"
sidebar_position: 20
---

The **Job Queue Orchestrator Status** API lets an external monitoring tool check that Bifrost Orchestrator itself is running, and start it again when it is not. It has no page in Business Central; people do not open it.

It is one of the [Job Queue Orchestrator APIs](/help/orchestrator/scheduled-entry-api/) and is published at `/api/origo/jobQueueOrchestrator/v1.0/status`. It returns the orchestrator's setup for the company, the same record as on [Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/).

## Fields

| Field | Description |
| --- | --- |
| `systemId` | The ID of the setup record. |
| `jobQueueCategoryCode` | The job queue category of the orchestrator's management job queue entry. Can be changed. |
| `logJobQueueActivity` | Whether job queue activity is logged. Can be changed. |
| `status` | Read-only. A text describing the management job queue entry: running, expired, failed or not set up. |
| `readyToStart` | Read-only. `true` when the management job queue entry is ready and not overdue, that is, when the orchestrator is running. |

## Bound actions

| Action | Description |
| --- | --- |
| **Restart** | Schedules the management job queue entry again, whatever its state. Returns the management entry from the [Job Queue Entries API](/help/orchestrator/entries-api/). |
| **RestartIfNeeded** | Schedules the management job queue entry again only when `readyToStart` is `false`. Use it from a monitor that runs on a timer. |
