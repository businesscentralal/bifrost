---
id: job-queue-entries
title: "Job Queue Entries"
sidebar_label: "Job Queue Entries"
sidebar_position: 4
---

Bifrost Nornir extends the standard **Job Queue Entries** list so that an existing job queue entry can be placed under the orchestrator's supervision without being redefined from scratch.

## Added field

| Field | Description |
| --- | --- |
| **Orchestrator Enabled** | Shows whether the orchestrator is monitoring this job queue entry. When it is, the orchestrator recreates and restarts the entry according to the retry policy on the matching [orchestrator entry](/help/nornir/scheduled-entry-card/). |

## Added action

| Action | Description |
| --- | --- |
| **Add to Job Queue Orchestrator** | Creates an orchestrator entry from the selected job queue entry, so the orchestrator monitors it and restarts it when it fails. The schedule of the existing entry is carried over. |

## Tips

-   Once an entry is under orchestrator control, maintain the schedule on the [Job Queue Orchestrator Entry Card](/help/nornir/scheduled-entry-card/) rather than here.
-   All orchestrator entries are also listed on [Job Queue Orchestrator Setup](/help/nornir/nornir-setup/).
