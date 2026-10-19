---
id: log-entry-api
title: "Job Queue Log Entries API"
sidebar_label: "Job Queue Log Entries API"
sidebar_position: 21
---

The **Job Queue Log Entries API** gives integrations a read-only view of the job queue log in the company, so an external tool can check how past runs ended and why a job failed. It has no page in Business Central; people do not open it.

It is one of the [Job Queue Orchestrator APIs](/help/orchestrator/scheduled-entry-api/) and is published at `/api/origo/jobQueueOrchestrator/v1.0/queueLogEntries`.

## Fields

| Field | Description |
| --- | --- |
| `id` | The ID of the job queue entry that ran. Use it to match log entries with the [Job Queue Entries API](/help/orchestrator/entries-api/). |
| `entryNo` | The number of the log entry. |
| `startDateTime`, `endDateTime` | When the run started and ended. |
| `userID` | The user the run was performed as. |
| `status` | How the run ended, such as Success or Error. |
| `errorMessage` | The error the run reported, if any. |
| `errorMessageRegisterId` | The ID of the error message register for the run, when Business Central kept detailed errors. |
