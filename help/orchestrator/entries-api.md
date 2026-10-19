---
id: entries-api
title: "Job Queue Entries API"
sidebar_label: "Job Queue Entries API"
sidebar_position: 19
---

The **Job Queue Entries API** gives integrations a read-only view of the standard job queue entries in the company, so an external monitoring tool can see what is scheduled, what is running and what has failed. It has no page in Business Central; people do not open it.

It is one of the [Job Queue Orchestrator APIs](/help/orchestrator/scheduled-entry-api/) and is published at `/api/origo/jobQueueOrchestrator/v1.0/queueEntries`.

## Fields

| Field | Description |
| --- | --- |
| `id` | The ID of the job queue entry. |
| `objectTypeToRun`, `objectIDToRun`, `objectCaptionToRun` | The report or codeunit the entry runs. |
| `description` | The description of the entry. |
| `status` | The status of the entry, such as Ready, In Process, Error or On Hold. |
| `scheduled` | Whether the entry is scheduled to run. |
| `orchestratorEnabled` | Whether Bifrost Orchestrator supervises the entry. |
| `jobQueueCategoryCode` | The job queue category of the entry. |
| `runOnMondays` … `runOnSundays` | The weekdays the entry runs on. |
| `startingTime`, `endingTime` | The earliest and latest time of day the entry runs. |
| `earliestStartDateTime` | The earliest date and time the entry may run. |
| `userID` | The user the entry runs as. |
| `errorMessage` | The last error the entry reported. |

## Bound action

| Action | Description |
| --- | --- |
| **AddToJobQueueOrchestrator** | Puts the job queue entry under the orchestrator's supervision. It creates an orchestrator entry from the job queue entry, or replaces the existing one, and returns that orchestrator entry from the orchestrator entries endpoint. The orchestrator's own management entry cannot be added. |
