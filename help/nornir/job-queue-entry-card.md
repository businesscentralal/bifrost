---
id: job-queue-entry-card
title: "Job Queue Entry Card"
sidebar_label: "Job Queue Entry Card"
sidebar_position: 5
---

Bifrost Nornir extends the standard **Job Queue Entry Card** with the orchestrator status of the entry and with an action that puts the entry under orchestrator supervision.

## Added field

| Field | Description |
| --- | --- |
| **Orchestrator Enabled** | Shows whether the orchestrator is monitoring this job queue entry. |

## Changed behaviour

While **Orchestrator Enabled** is set, the standard **Recurrence** group on this card is read-only. The schedule is owned by the orchestrator and is maintained on the [Job Queue Orchestrator Entry Card](/help/nornir/scheduled-entry-card/) instead, so that the two definitions cannot drift apart.

## Added action

| Action | Description |
| --- | --- |
| **Add to Job Queue Orchestrator** | Creates an orchestrator entry from this job queue entry, so the orchestrator monitors it and restarts it when it fails. |
