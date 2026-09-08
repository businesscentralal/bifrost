---
id: bifrost-clockify
title: "Clockify message types"
sidebar_label: "Clockify message types"
sidebar_position: 10
description: "Message types added to the Bifröst API by Bifrost Clockify. The Clockify time-tracking API exposed as Bifröst message types, with synchronisation of time entries into Business Central Job Journals and Time Sheets. Load alongside bifrost-bc-integration, which carries the API…"
---

The Clockify time-tracking API exposed as Bifröst message types, with synchronisation of time entries into Business Central Job Journals and Time Sheets.

---

## When to load this skill

Load it together with the core skill when:

- time entries have to move between Clockify and Business Central — into Job Journal lines or into Time Sheets;
- the task drives the Time Sheet lifecycle, or manages Clockify clients, projects, tasks or tags from Business Central.

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](./bifrost-bc-integration/index.md) and are not repeated here.

---

## Hard rules

- The sync deduplicates. Re-running an import does not create duplicates — an entry that changed produces a correction, not a second line. Do not build your own deduplication on top.
- Links between a Business Central record and a Clockify object are never deleted, only marked reversed. Treat a reversed link as history, not as an absence.
- The Clockify API key lives in IsolatedStorage at company scope. It is never a field value and never appears in a request log.
- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.
- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.
- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.

---

## Reference pages

**Reference base:** `../../clockify/reference/` — every path below is relative to it.

Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.
From the deployed site the same paths resolve against this file’s own URL.

### `Clockify.*` (40)

| Message type | Page |
| --- | --- |
| `Clockify.Client.Create` | `message-types/clockify-client-create/` |
| `Clockify.Client.Delete` | `message-types/clockify-client-delete/` |
| `Clockify.Client.Get` | `message-types/clockify-client-get/` |
| `Clockify.Client.List` | `message-types/clockify-client-list/` |
| `Clockify.Client.Update` | `message-types/clockify-client-update/` |
| `Clockify.Currency.List` | `message-types/clockify-currency-list/` |
| `Clockify.CustomField.List` | `message-types/clockify-customfield-list/` |
| `Clockify.Project.Create` | `message-types/clockify-project-create/` |
| `Clockify.Project.Delete` | `message-types/clockify-project-delete/` |
| `Clockify.Project.Get` | `message-types/clockify-project-get/` |
| `Clockify.Project.List` | `message-types/clockify-project-list/` |
| `Clockify.Project.Update` | `message-types/clockify-project-update/` |
| `Clockify.Tag.Create` | `message-types/clockify-tag-create/` |
| `Clockify.Tag.Delete` | `message-types/clockify-tag-delete/` |
| `Clockify.Tag.List` | `message-types/clockify-tag-list/` |
| `Clockify.Tag.Update` | `message-types/clockify-tag-update/` |
| `Clockify.Task.Create` | `message-types/clockify-task-create/` |
| `Clockify.Task.Delete` | `message-types/clockify-task-delete/` |
| `Clockify.Task.List` | `message-types/clockify-task-list/` |
| `Clockify.Task.Update` | `message-types/clockify-task-update/` |
| `Clockify.TimeEntry.Create` | `message-types/clockify-timeentry-create/` |
| `Clockify.TimeEntry.Delete` | `message-types/clockify-timeentry-delete/` |
| `Clockify.TimeEntry.Get` | `message-types/clockify-timeentry-get/` |
| `Clockify.TimeEntry.List` | `message-types/clockify-timeentry-list/` |
| `Clockify.TimeEntry.Sync` | `message-types/clockify-timeentry-sync/` |
| `Clockify.TimeEntry.SyncAllUsers` | `message-types/clockify-timeentry-syncallusers/` |
| `Clockify.TimeEntry.SyncRange` | `message-types/clockify-timeentry-syncrange/` |
| `Clockify.TimeEntry.SyncRangeToTimeSheet` | `message-types/clockify-timeentry-syncrangetotimesheet/` |
| `Clockify.TimeEntry.SyncToTimeSheet` | `message-types/clockify-timeentry-synctotimesheet/` |
| `Clockify.TimeEntry.Update` | `message-types/clockify-timeentry-update/` |
| `Clockify.TimeSheet.Approve` | `message-types/clockify-timesheet-approve/` |
| `Clockify.TimeSheet.Archive` | `message-types/clockify-timesheet-archive/` |
| `Clockify.TimeSheet.Create` | `message-types/clockify-timesheet-create/` |
| `Clockify.TimeSheet.Post` | `message-types/clockify-timesheet-post/` |
| `Clockify.TimeSheet.Reject` | `message-types/clockify-timesheet-reject/` |
| `Clockify.TimeSheet.Reopen` | `message-types/clockify-timesheet-reopen/` |
| `Clockify.User.GetCurrent` | `message-types/clockify-user-getcurrent/` |
| `Clockify.User.List` | `message-types/clockify-user-list/` |
| `Clockify.UserGroup.List` | `message-types/clockify-usergroup-list/` |
| `Clockify.Workspace.List` | `message-types/clockify-workspace-list/` |

### `Help.*` (1)

| Message type | Page |
| --- | --- |
| `Help.Clockify.Get` | `message-types/help-clockify-get/` |

---

## Related skills

- [bifrost-bc-integration](./bifrost-bc-integration/index.md) — the API itself. Always load this one.
- [bifrost-foundation](./bifrost-foundation.md) — Bifrost Foundation
- [bifrost-iceland](./bifrost-iceland.md) — Bifrost Iceland
- [bifrost-iceland-treasury](./bifrost-iceland-treasury.md) — Bifrost Iceland Treasury
- [bifrost-iceland-docex](./bifrost-iceland-docex.md) — Bifrost Iceland DocEx
- [bifrost-bragi](./bifrost-bragi.md) — Bifrost Bragi
- [bifrost-hnitbjorg](./bifrost-hnitbjorg.md) — Bifrost Hnitbjorg
- [bifrost-nornir](./bifrost-nornir.md) — Bifrost Nornir
- [bifrost-subscription-billing](./bifrost-subscription-billing.md) — Bifrost Subscription Billing
## Loading this skill

An agent loads the skill file itself: [SKILL.md](pathname:///skills/bifrost-clockify/SKILL.md).
It is an index: what the app adds, when to load it, and the path of every reference page.

<details>
<summary>The description an agent matches this skill against</summary>

Message types added to the Bifröst API by Bifrost Clockify. The Clockify time-tracking API exposed as Bifröst message types, with synchronisation of time entries into Business Central Job Journals and Time Sheets. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index of what Clockify adds — 41 message types across 2 families (Clockify.*, Help.*).

</details>
