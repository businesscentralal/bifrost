---
id: index
title: "Bifröst Timesheets"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "The Clockify time-tracking API exposed as Bifröst message types, with synchronisation of time entries into Business Central Job Journals and Time Sheets."
---

# Bifröst Timesheets

**Hours tracked in Clockify, posted in Business Central.** Finished time entries become Job Journal
lines or Time Sheet detail, without typing them in again.

Bifröst Timesheets connects Business Central to [Clockify](https://clockify.me), the
time-tracking service. It can also keep clients, projects, tasks and tags in Clockify in step with
Business Central.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Bring Clockify hours into the Job Journal.** One entry, a date range, or every mapped user at
  once. An entry that is synced twice is not duplicated, and a changed entry is posted as a
  correction.
- **Or fill Time Sheets instead.** Write the same finished entries into the resource's open Time
  Sheet.
- **Run the Time Sheet week.** Create the coming weekly sheets, submit and approve them, reject or
  reopen lines, post approved hours through a Job Journal, and archive posted sheets.
- **Keep Clockify in step with your projects.** List, create, change and delete clients, projects,
  tasks, tags and time entries in your Clockify workspace.
- **Sync as it happens.** With Clockify webhooks registered, new, changed and deleted entries
  reach Business Central without waiting for a schedule.

## Get it

Install **Bifrost Timesheets** next to Bifröst Foundation, from AppSource or through your partner.
It needs Business Central 28.0 or later, Essentials or Premium, and a Clockify account with an API
key.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | In Clockify, create an API key under **Profile Settings → API**, with an account that has the access the integration needs. | Clockify account owner |
| 2 | On **Bifrost Setup**, open **Bifrost Timesheets Setup** from the **Apps** group. Choose **Set Company API Key**, then pick the **Default Workspace**. | Business Central administrator |
| 3 | To sync to a Job Journal, fill in the Job Journal template, batch and default Work Type. To sync to Time Sheets, set up the resources for time sheets. | Business Central administrator |
| 4 | Link Business Central records to Clockify objects, for example customers to clients and Work Types to tags. Links are listed on **Integration Links**. | Whoever builds the integration |
| 5 | For real-time sync, enter the **Webhook Receiver URL**, choose **Register Webhooks**, and set up the signing tokens it shows on the receiver. | Business Central administrator, with whoever runs the receiver |
| 6 | Give the people and services that use it the **`BIFROST Timeshts ori`** permission set. | Business Central administrator |

The step-by-step guides are in the in-product help:
[Timesheets setup](/help/timesheets/timesheets-setup/),
[Enter Clockify API Key](/help/timesheets/timesheets-set-secret-dialog/),
[Clockify Workspaces](/help/timesheets/timesheets-workspace-lookup/),
[Integration links](/help/timesheets/timesheets-integration-list/) and
[Webhooks](/help/timesheets/timesheets-webhooks/).

## Good to know

- **It acts as you.** Every call runs with your own Business Central permissions and is logged on
  **Bifrost Messages**.
- **It works in Clockify as the key's owner.** Everything done in Clockify happens with the
  permissions of the Clockify user who created the API key.
- **The API key stays out of tables and logs.** It is stored in Business Central's isolated
  storage, one key per company, and is never shown again after you enter it.
- **Only finished entries are synced.** An entry that is still running has no duration, so every
  sync refuses it on purpose.
- **Links are kept, not deleted.** A broken link between a record and a Clockify object is marked
  reversed and removed by a retention policy about a month later.
- **Real-time sync needs a receiver.** Webhooks need a publicly reachable endpoint that forwards
  Clockify events into Business Central. The signing tokens are not stored in Business Central.

## Capabilities and reference

Capability: **`Clockify`**.

What each message type does, in plain words: [Capabilities](./capabilities).

- [Message type reference](./reference/message-types/): the contract of every type, generated from the app itself
- [Build on Bifröst](/extensibility/)
- Permission set: `BIFROST Timeshts ori`.
