---
id: job-queue-entry-card
title: "Job Queue Entry Card"
sidebar_label: "Job Queue Entry Card"
sidebar_position: 5
---

Bifrost Orchestrator adds a field and an action to the standard **Job Queue Entry Card**: whether the
entry is supervised, and a way to put it under supervision.

## Added field

| Field | Description |
| --- | --- |
| **Scheduler Enabled** | Shows whether Bifrost Orchestrator monitors this job queue entry. |

## Changed behavior

While **Scheduler Enabled** is selected, the standard **Recurrence** group on this card cannot be
edited. Bifrost Orchestrator owns the schedule, which you maintain on the
[Job Queue Orchestrator Entry Card](/help/orchestrator/scheduled-entry-card/), so the two definitions
cannot drift apart.

## Added action

| Action | Description |
| --- | --- |
| **Add to Bifrost Orchestrator** | Creates an orchestrator entry from this job queue entry, so Bifrost Orchestrator monitors it and restarts it when it fails. If the entry is already supervised, you are asked whether to overwrite its orchestrator entry. |
