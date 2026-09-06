---
name: bifrost-nornir
description: >
  Message types added to the Bifröst API by Bifrost Nornir. Job Queue scheduling, monitoring
  and restart for Business Central, plus declarative playbooks that chain Bifröst message
  types. Load alongside bifrost-bc-integration, which carries the API itself; this skill is
  the index of what Nornir adds — 20 message types across 2 families (Orchestrator.*, Help.*).
license: MIT
metadata:
  version: 1.0.0
  updated: 2026-09-06
  app: Bifrost Nornir
  messageTypes: 20
  source: https://github.com/businesscentralal/bifrost
---

# Nornir message types

Job Queue scheduling, monitoring and restart for Business Central, plus declarative playbooks that chain Bifröst message types.

---

## When to load this skill

Load it together with the core skill when:

- work has to run on a schedule, be retried, or be supervised — Job Queue entries;
- several message types have to run in sequence with the output of one feeding the next — a playbook.

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](../bifrost-bc-integration/SKILL.md) and are not repeated here.

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

**Reference base:** `../../nornir/reference/` — every path below is relative to it.

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

- [bifrost-bc-integration](../bifrost-bc-integration/SKILL.md) — the API itself. Always load this one.
- [bifrost-foundation](../bifrost-foundation/SKILL.md) — Bifrost Foundation
- [bifrost-iceland](../bifrost-iceland/SKILL.md) — Bifrost Iceland
- [bifrost-iceland-treasury](../bifrost-iceland-treasury/SKILL.md) — Bifrost Iceland Treasury
- [bifrost-iceland-docex](../bifrost-iceland-docex/SKILL.md) — Bifrost Iceland DocEx
- [bifrost-bragi](../bifrost-bragi/SKILL.md) — Bifrost Bragi
- [bifrost-hnitbjorg](../bifrost-hnitbjorg/SKILL.md) — Bifrost Hnitbjorg
- [bifrost-clockify](../bifrost-clockify/SKILL.md) — Bifrost Clockify
- [bifrost-subscription-billing](../bifrost-subscription-billing/SKILL.md) — Bifrost Subscription Billing
