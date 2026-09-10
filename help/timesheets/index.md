---
id: index
title: "Bifröst Timesheets — Help"
sidebar_label: "Bifröst Timesheets — Help"
sidebar_position: 1
slug: /
---

**Bifröst Timesheets** is the Clockify connector of the Bifröst platform, a Business Central extension by Origo. It exposes the Clockify time-tracking REST API as Bifröst message types, so external systems get direct read and write access to Clockify workspaces, clients, projects, tasks, tags and time entries through the Bifröst API.

Beyond the pass-through API, the connector brings finished Clockify time entries into Business Central — as Job Journal lines with deduplication and correction posting, or as detail on the resource's open Time Sheet — and drives the Time Sheet lifecycle from creation through approval to posting and archiving. Registered Clockify webhooks keep the synchronisation real-time. The Clockify API key is held in IsolatedStorage at company scope, never in a table field.

## Pages

| Page | Description |
| --- | --- |
| [Timesheets Setup](/help/timesheets/timesheets-setup/) | The connector's setup card: API key, default workspace, Job Journal target, webhooks and the navigation to the lists. |
| [Enter Clockify API Key](/help/timesheets/timesheets-set-secret-dialog/) | Masked dialog for entering the Clockify API key. |
| [Clockify Workspaces](/help/timesheets/timesheets-workspace-lookup/) | Lookup of the workspaces the stored API key can reach, used to pick the default workspace. |
| [Clockify Integration](/help/timesheets/timesheets-integration-list/) | The links between Business Central records and Clockify objects. |
| [Clockify Webhooks](/help/timesheets/timesheets-webhooks/) | The Clockify webhooks this company has registered for real-time time-entry sync. |

## Message Types

| Message Type | Description |
| --- | --- |
| Help.Clockify.Get | Returns a Markdown overview of the connector and all its message types. |
| Clockify.Workspace.List | Lists the workspaces the stored API key can access. |
| Clockify.User.GetCurrent | Returns the Clockify user the API key belongs to. |
| Clockify.User.List | Lists the users in a workspace. |
| Clockify.UserGroup.List | Lists the user groups in a workspace, with the identifiers needed for project access and assignment writes. |
| Clockify.Currency.List | Lists the currencies defined in a workspace, with the currency identifiers needed when writing clients. |
| Clockify.CustomField.List | Lists the workspace custom-field definitions, with the identifiers needed when writing custom field values. |
| Clockify.Client.List | Lists the clients in a workspace. |
| Clockify.Client.Get | Retrieves a single client by ID. |
| Clockify.Client.Create | Creates a client in a workspace. |
| Clockify.Client.Update | Updates an existing client. |
| Clockify.Client.Delete | Deletes a client. |
| Clockify.Project.List | Lists the projects in a workspace. |
| Clockify.Project.Get | Retrieves a single project by ID. |
| Clockify.Project.Create | Creates a project in a workspace. |
| Clockify.Project.Update | Updates an existing project. |
| Clockify.Project.Delete | Deletes a project. |
| Clockify.Task.List | Lists the tasks of a project. |
| Clockify.Task.Create | Creates a task in a project. |
| Clockify.Task.Update | Updates an existing task. |
| Clockify.Task.Delete | Deletes a task. |
| Clockify.Tag.List | Lists the tags in a workspace. |
| Clockify.Tag.Create | Creates a tag in a workspace. |
| Clockify.Tag.Update | Updates an existing tag. |
| Clockify.Tag.Delete | Deletes a tag. |
| Clockify.TimeEntry.List | Lists a user's time entries in a workspace. |
| Clockify.TimeEntry.Get | Retrieves a single time entry by ID. |
| Clockify.TimeEntry.Create | Creates a time entry for a user. |
| Clockify.TimeEntry.Update | Updates an existing time entry. |
| Clockify.TimeEntry.Delete | Deletes a time entry. |
| Clockify.TimeEntry.Sync | Syncs one finished Clockify time entry to a Job Journal line, with deduplication, update detection and correction posting. |
| Clockify.TimeEntry.SyncRange | Syncs all of a user's finished time entries in a date range to Job Journal lines in one call. |
| Clockify.TimeEntry.SyncAllUsers | Syncs finished entries in a date range for every mapped user, to the Job Journal or to Time Sheets. |
| Clockify.TimeEntry.SyncToTimeSheet | Syncs one finished time entry to the resource's open Time Sheet, as a line plus its detail. |
| Clockify.TimeEntry.SyncRangeToTimeSheet | Syncs all of a user's finished time entries in a date range to their open Time Sheets. |
| Clockify.TimeSheet.Create | Creates the upcoming weekly time sheets for every time-sheet resource. |
| Clockify.TimeSheet.Approve | Submits and approves open time-sheet lines up to a cut-off date. |
| Clockify.TimeSheet.Reject | Rejects submitted time-sheet lines up to a cut-off date. |
| Clockify.TimeSheet.Reopen | Reopens submitted or approved time-sheet lines back to Open. |
| Clockify.TimeSheet.Post | Transfers approved time-sheet detail to a Job Journal batch and posts it. |
| Clockify.TimeSheet.Archive | Archives fully posted time sheets and removes empty posted sheets. |

Send `Help.Clockify.Get` for the full Markdown catalogue, or ask any single message type for its own help document to see its exact request parameters, response fields and error cases.

An entry that is still running in Clockify has no end time, so it has no duration to post. Every synchronisation type refuses such an entry on purpose.

## Getting Started

1.  In Clockify, create an API key under **Profile Settings → API**.
2.  Open [Timesheets Setup](/help/timesheets/timesheets-setup/) — the **Clockify** action in the **Apps** group of the Bifröst **Setup** page.
3.  Choose **Set Company API Key** and paste the key into the [masked dialog](/help/timesheets/timesheets-set-secret-dialog/).
4.  Look up **Default Workspace** and pick a workspace from the [workspace list](/help/timesheets/timesheets-workspace-lookup/).
5.  If time entries are to reach a Job Journal, fill in the Job Journal template, batch and default Work Type.
6.  For real-time sync, enter the **Webhook Receiver URL**, choose **Register Webhooks**, and configure the signing tokens the action reports on the receiver.
7.  Send Bifröst messages naming a Clockify message type, for example `Clockify.Workspace.List`.
