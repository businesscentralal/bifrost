---
id: index
title: "Bifröst Clockify"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "The Clockify time-tracking API exposed as Bifröst message types, with synchronisation of time entries into Business Central Job Journals and Time Sheets."
---

Bifröst Clockify connects Business Central to [Clockify](https://clockify.me), the time-tracking service. It builds on Bifröst Foundation and exposes the Clockify REST API as 41 message types, so an external caller, an MCP client or a Business Central process can read and write Clockify data through the same queue, task and data pattern used by the rest of Bifröst. On top of that pass-through the connector brings finished Clockify time entries into Business Central as Job Journal lines or Time Sheet detail, and drives the Time Sheet lifecycle.

## What it does

- **Workspace directory** — list the workspaces the API key can reach, the current user, the workspace users and user groups, the workspace currencies and the workspace custom-field definitions. The currency, user-group and custom-field lists exist because Clockify write operations need those internal identifiers.
- **Clients, projects, tasks and tags** — full list, get, create, update and delete over the Clockify workspace, so a Business Central process can keep the Clockify side of a project in step.
- **Time entries** — list, get, create, update and delete a user's Clockify time entries.
- **Job Journal synchronisation** — bring a finished Clockify time entry into a Business Central Job Journal line, one entry at a time, for a date range, or for every mapped user at once. The sync deduplicates, detects updates to an entry that was already synced and posts a correction rather than a duplicate.
- **Time Sheet synchronisation** — write the same finished entries into the resource's open Time Sheet instead, as a line plus its detail.
- **Time Sheet lifecycle** — create the upcoming weekly sheets, submit and approve them, reject or reopen submitted lines, transfer approved detail to a Job Journal and post it, then archive the fully posted sheets.
- **Real-time webhooks** — register the Clockify `NEW_TIME_ENTRY`, `TIME_ENTRY_UPDATED` and `TIME_ENTRY_DELETED` webhooks against a receiver endpoint, so the sync follows the clock instead of a schedule.
- **Integration links** — every Business Central record bound to a Clockify object is recorded in a link table. Links are never deleted, only marked reversed, and are purged by a retention policy about a month later.
- **The API key stays out of the database** — it is held in IsolatedStorage at company scope and entered through a masked dialog. It is never written to a table field and never appears in a request log body.
- **Self-documenting contract** — `Help.Clockify.Get` returns a Markdown catalogue of the connector, and every message type answers its own per-type help.

## How it works

1. Create a Clockify API key in Clockify under **Profile Settings → API**.
2. Open **Clockify Setup** in Business Central — one action in the **Apps** group of the Bifröst **Setup** page — and store the key with **Set Company API Key**.
3. Pick the default workspace from the live lookup, so requests that omit `workspaceId` still resolve.
4. Point the Job Journal template, batch and default Work Type at where synced time should land, if you sync to a Job Journal.
5. External systems send Bifröst messages naming a Clockify message type; the connector calls Clockify with the stored key and answers through the Bifröst data API.
6. For real-time sync, set the webhook receiver URL and choose **Register Webhooks**, then configure the signing tokens the action reports on the receiver.

## Message types

| Domain | Message types |
| --- | --- |
| Directory | `Help.Clockify.Get` |
| Workspace | `Clockify.Workspace.List`, `Clockify.User.GetCurrent`, `Clockify.User.List`, `Clockify.UserGroup.List`, `Clockify.Currency.List`, `Clockify.CustomField.List` |
| Clients | `Clockify.Client.List`, `Clockify.Client.Get`, `Clockify.Client.Create`, `Clockify.Client.Update`, `Clockify.Client.Delete` |
| Projects | `Clockify.Project.List`, `Clockify.Project.Get`, `Clockify.Project.Create`, `Clockify.Project.Update`, `Clockify.Project.Delete` |
| Tasks | `Clockify.Task.List`, `Clockify.Task.Create`, `Clockify.Task.Update`, `Clockify.Task.Delete` |
| Tags | `Clockify.Tag.List`, `Clockify.Tag.Create`, `Clockify.Tag.Update`, `Clockify.Tag.Delete` |
| Time entries | `Clockify.TimeEntry.List`, `Clockify.TimeEntry.Get`, `Clockify.TimeEntry.Create`, `Clockify.TimeEntry.Update`, `Clockify.TimeEntry.Delete` |
| Journal sync | `Clockify.TimeEntry.Sync`, `Clockify.TimeEntry.SyncRange`, `Clockify.TimeEntry.SyncAllUsers` |
| Time Sheet sync | `Clockify.TimeEntry.SyncToTimeSheet`, `Clockify.TimeEntry.SyncRangeToTimeSheet` |
| Time Sheets | `Clockify.TimeSheet.Create`, `Clockify.TimeSheet.Approve`, `Clockify.TimeSheet.Reject`, `Clockify.TimeSheet.Reopen`, `Clockify.TimeSheet.Post`, `Clockify.TimeSheet.Archive` |

The keys are the published API contract and never change. Each type documents its own request and response contract at runtime: send `Help.Clockify.Get` for the connector catalogue, or ask `Help.Implementation.Get` for a single type.

An in-progress Clockify entry — one that has been started but not stopped — is refused by every synchronisation type on purpose. Only a finished entry has a duration to post.

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- Bifröst Foundation, available separately on AppSource.
- A Clockify account with an API key. Job Journal synchronisation additionally needs a Job Journal template and batch; Time Sheet synchronisation needs resources set up for time sheets.
- Real-time webhooks need a publicly reachable receiver endpoint that forwards Clockify events into Business Central.

## Where to go next

- [In-product help](/help/clockify/)
- [Message type reference](./reference/message-types/) — the request and response contract for every type, generated from the app itself
- [Build on Bifröst](/extensibility/)
