---
id: job-queue-entries
title: "Job Queue Entries"
sidebar_label: "Job Queue Entries"
sidebar_position: 4
---

Bifrost Orchestrator adds a field and an action to the standard **Job Queue Entries** list, so you can
see which entries it supervises and put an existing entry under its supervision without defining it
again.

## Added field

| Field | Description |
| --- | --- |
| **Scheduler Enabled** | Shows whether Bifrost Orchestrator monitors this job queue entry. When it does, it recreates and restarts the entry according to the retry policy on the matching [orchestrator entry](/help/orchestrator/scheduled-entry-card/). |

## Added action

| Action | Description |
| --- | --- |
| **Add to Bifrost Orchestrator** | Creates an orchestrator entry from the selected job queue entry, so Bifrost Orchestrator monitors it and restarts it when it fails. The schedule of the job queue entry is carried over, and you can open the new entry straight away. If the job queue entry is already supervised, you are asked whether to overwrite its orchestrator entry. Bifrost Orchestrator's own management job queue entry cannot be added. |

## Tips

- Once an entry is supervised, change its schedule on the
  [Job Queue Orchestrator Entry Card](/help/orchestrator/scheduled-entry-card/), not here.
- The supervised entries are also listed in the **Orchestrator Entries** part of
  [Bifrost Orchestrator Setup](/help/orchestrator/orchestrator-setup/).
