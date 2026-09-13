---
id: index
title: "Bifröst Timesheets"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "The Clockify time-tracking API exposed as Bifröst message types, with synchronisation of time entries into Business Central Job Journals and Time Sheets."
---

Bifröst Timesheets connects Business Central to [Clockify](https://clockify.me), the time-tracking service. It builds on Bifröst Foundation og exposes the Clockify REST API as 41 message tegunds, so an external caller, an MCP client eða a Business Central process getur read og write Clockify data through the same queue, verkþáttur og data pattern used by the rest of Bifröst. On top of that pass-through the connector brings finished Clockify tímafærslur í Business Central as Job Journal línur eða Time Sheet detail, og drives the Time Sheet lifecycle.

## What it does

- **Workspace mappa** — list the vinnusvæðis the API key getur reach, the current notandi, the vinnusvæði notendur og notandi groups, the vinnusvæði currencies og the vinnusvæði custom-field definitions. The currency, notandi-group og custom-field listar exist because Clockify write operations need those internal identifiers.
- **Clients, verkefni, verkþættir og tags** — full list, get, create, updagsetning og delete over the Clockify vinnusvæði, so a Business Central process getur keep the Clockify side of a verkefni in step.
- **Time entries** — list, get, create, updagsetning og delete a notandi's Clockify tímafærslur.
- **Job Journal synchronisation** — bring a finished Clockify tímafærsla í a Business Central Job Journal lína, one entry at a time, fyrir a dagsetning range, eða fyrir every mapped notandi at once. The sync deduplicates, detects updagsetnings to an entry that was already synced og posts a correction rather than a duplicate.
- **Time Sheet synchronisation** — write the same finished entries í the resource's open Time Sheet instead, as a lína plus its detail.
- **Time Sheet lifecycle** — create the upcoming weekly sheets, submit og approve them, reject eða reopen submitted línur, transfer approved detail to a Job Journal og post it, then archive the fully posted sheets.
- **Real-time webhooks** — register the Clockify `NEW_TIME_ENTRY`, `TIME_ENTRY_UPDATED` og `TIME_ENTRY_DELETED` webhooks against a receiver endpoint, so the sync follows the clock instead of a schedule.
- **Integration links** — every Business Central færsla bound to a Clockify object er færslaed in a link table. Links eru never deleted, aðeins marked reversed, og eru purged by a retention policy about a month later.
- **The API key stays out of the database** — it er held in IsolatedStorage at company scope og entered through a masked dialog. It er never written to a table field og never appears in a request log body.
- **Self-skjaling samningur** — `Help.Clockify.Get` returns a Markdown catalogue of the connector, og every message tegund answers its own per-tegund help.

## How it works

1. Create a Clockify API key in Clockify under **Proskrá Stilltutings → API**.
2. Open **Clockify Stilltuup** in Business Central — one action in the **Apps** group of the Bifröst **Stilltuup** page — og store the key með **Stilltu Company API Key**.
3. Pick the sjálfgefið vinnusvæði úr the live lookup, so requests that omit `workspaceId` still resolve.
4. Point the Job Journal template, batch og sjálfgefið Work Type at þar sem synced time should land, ef you sync to a Job Journal.
5. External systems send Bifröst messages naming a Clockify message tegund; the connector calls Clockify með the stored key og answers through the Bifröst data API.
6. For real-time sync, set the webhook receiver URL og choose **Register Webhooks**, then configure the signing tokens the action reports on the receiver.

## Skilaboð tegunds

| Domain | Skilaboð tegunds |
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

The keys eru the published API samningur og never change. Each tegund skjöl its own request og response samningur at runtime: send `Help.Clockify.Get` fyrir the connector catalogue, eða ask `Help.Implementation.Get` fyrir a single tegund.

An in-progress Clockify entry — one that has been started but not stopped — er refused by every synchronisation tegund on purpose. Only a finished entry has a duration to post.

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 eða later, Essentials eða Premium.
- Bifröst Foundation, available separately on AppSource.
- A Clockify account með an API key. Job Journal synchronisation additionally needs a Job Journal template og batch; Time Sheet synchronisation needs resources set up fyrir time sheets.
- Real-time webhooks need a publicly reachable receiver endpoint that forwards Clockify events í Business Central.

## Where to go next

- [In-product help](/help/timesheets/)
- [Skilaboð tegund reference](./reference/message-types/) — the request og response samningur fyrir every tegund, generated úr the app itself
- [Build on Bifröst](/extensibility/)
