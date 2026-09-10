---
id: bifrost-nornir
title: "Nornir message types"
sidebar_label: "Nornir message types"
sidebar_position: 9
description: "Message types added to the Bifröst API by Bifrost Orchestrator. Job Queue scheduling, monitoring and restart for Business Central, plus declarative playbooks that chain Bifröst message types. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index…"
---

Job Queue scheduling, monitoring and restart for Business Central, plus declarative playbooks that chain Bifröst message types.

---

## When to load this skill

Load it together with the core skill when:

- work has to run on a schedule, be retried, or be supervised — Job Queue entries;
- several message types have to run in sequence with the output of one feeding the next — a playbook.

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](./bifrost-bc-integration/index.md) and are not repeated here.

---

## Hard rules

- A playbook is declarative. Data moves between steps through the shared workspace using `@path` references; do not try to pass values by constructing the next request yourself.
- A scheduled playbook runs under the Job Queue, which means it runs as a background session with its own permissions. Test it as that user, not as yourself.
- Every run is logged as an instance with a per-step record of the request, the response and a workspace snapshot. Read the instance before re-running a failed playbook.
- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.
- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.
- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.

---

## Reference pages

**Reference base:** `../../orchestrator/reference/` — every path below is relative to it.

Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.
From the deployed site the same paths resolve against this file’s own URL.

### `Orchestrator.*` (19)

| Message type | Page |
| --- | --- |
| `Orchestrator.Email.Send` | `message-types/orchestrator-email-send/` |
| `Orchestrator.Entry.Register` | `message-types/orchestrator-entry-register/` |
| `Orchestrator.Entry.Restart` | `message-types/orchestrator-entry-restart/` |
| `Orchestrator.Entry.Run` | `message-types/orchestrator-entry-run/` |
| `Orchestrator.Entry.Schedule` | `message-types/orchestrator-entry-schedule/` |
| `Orchestrator.JobQueueEntry.Restart` | `message-types/orchestrator-jobqueueentry-restart/` |
| `Orchestrator.JobQueueEntry.RestartIfNeeded` | `message-types/orchestrator-jobqueueentry-restartifneeded/` |
| `Orchestrator.Playbook.Enqueue` | `message-types/orchestrator-playbook-enqueue/` |
| `Orchestrator.Playbook.Run` | `message-types/orchestrator-playbook-run/` |
| `Orchestrator.Playbook.Schedule` | `message-types/orchestrator-playbook-schedule/` |
| `Orchestrator.Report.Get` | `message-types/orchestrator-report-get/` |
| `Orchestrator.Report.List` | `message-types/orchestrator-report-list/` |
| `Orchestrator.Report.Run` | `message-types/orchestrator-report-run/` |
| `Orchestrator.Report.SaveAs` | `message-types/orchestrator-report-saveas/` |
| `Orchestrator.Status.Get` | `message-types/orchestrator-status-get/` |
| `Orchestrator.Status.Restart` | `message-types/orchestrator-status-restart/` |
| `Orchestrator.Status.RestartIfNeeded` | `message-types/orchestrator-status-restartifneeded/` |
| `Orchestrator.Telegram.Message` | `message-types/orchestrator-telegram-message/` |
| `Orchestrator.Workspace.Preview` | `message-types/orchestrator-workspace-preview/` |

### `Help.*` (1)

| Message type | Page |
| --- | --- |
| `Help.Orchestrator.Get` | `message-types/help-orchestrator-get/` |

---

## Related skills

- [bifrost-bc-integration](./bifrost-bc-integration/index.md) — the API itself. Always load this one.
- [bifrost-foundation](./bifrost-foundation.md) — Bifrost Foundation
- [bifrost-iceland](./bifrost-iceland.md) — Bifrost Iceland
- [bifrost-iceland-treasury](./bifrost-iceland-treasury.md) — Bifrost Iceland Treasury
- [bifrost-iceland-docex](./bifrost-iceland-docex.md) — Bifrost Iceland DocEx
- [bifrost-bragi](./bifrost-bragi.md) — Bifrost Language Models
- [bifrost-hnitbjorg](./bifrost-hnitbjorg.md) — Bifrost Attachments
- [bifrost-clockify](./bifrost-clockify.md) — Bifrost Timesheets
- [bifrost-subscription-billing](./bifrost-subscription-billing.md) — Bifrost Subscription Billing
## Loading this skill

An agent loads the skill file itself: [SKILL.md](pathname:///skills/bifrost-nornir/SKILL.md).
It is an index: what the app adds, when to load it, and the path of every reference page.

<details>
<summary>The description an agent matches this skill against</summary>

Message types added to the Bifröst API by Bifrost Orchestrator. Job Queue scheduling, monitoring and restart for Business Central, plus declarative playbooks that chain Bifröst message types. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index of what Nornir adds — 20 message types across 2 families (Orchestrator.*, Help.*).

</details>
