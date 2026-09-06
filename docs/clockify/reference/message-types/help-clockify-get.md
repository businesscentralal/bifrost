---
id: help-clockify-get
title: "Help.Clockify.Get"
sidebar_label: "Help.Clockify.Get"
sidebar_position: 41
description: "Request and response contract for the Help.Clockify.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


The Clockify connector exposes the [Clockify](https://docs.developer.clockify.me) REST API as Bifrost message types.
Most message types are **outbound** (Business Central calls Clockify) and use `Content-Type: application/json`. The exceptions are `Clockify.TimeEntry.Sync` (inbound BC-side operation that writes to the Job Journal and does not call Clockify) and `Clockify.TimeEntry.SyncRange` (inbound BC-side operation that reads entries from Clockify, then writes to the Job Journal).

Authentication uses the workspace API key stored on Clockify Setup (`X-Api-Key`). Set `workspaceId` in the request, or configure a Default Workspace ID on Clockify Setup.
Create/update message types send the request's `body` object verbatim to Clockify. List message types accept an optional `query` object whose properties become URL query parameters (for example `page-size`, `page`, `name`, `in-progress`).
For `Clockify.TimeEntry.List`, prefer `query.in-progress = false` when selecting entries for `Clockify.TimeEntry.Sync`. In-progress entries (`end` = null) are intentionally rejected by sync and never written to Job Journal.

Responses are wrapped as `{ "status", "statusCode", "data" }`. For the full request/response contract of any message type, request its per-type help.

| Message type | Description |
|---|---|
| `Clockify.Workspace.List` | Lists the workspaces the API key can access. |
| `Clockify.User.GetCurrent` | Returns the currently authenticated user. |
| `Clockify.User.List` | Lists the users in a workspace. |
| `Clockify.Client.List` | Lists the clients in a workspace. |
| `Clockify.Client.Get` | Retrieves a single client by ID. |
| `Clockify.Client.Create` | Creates a client. |
| `Clockify.Client.Update` | Updates a client. |
| `Clockify.Client.Delete` | Deletes a client. |
| `Clockify.Project.List` | Lists the projects in a workspace. |
| `Clockify.Project.Get` | Retrieves a single project by ID. |
| `Clockify.Project.Create` | Creates a project. |
| `Clockify.Project.Update` | Updates a project. |
| `Clockify.Project.Delete` | Deletes a project. |
| `Clockify.Task.List` | Lists the tasks of a project. |
| `Clockify.Task.Create` | Creates a task. |
| `Clockify.Task.Update` | Updates a task. |
| `Clockify.Task.Delete` | Deletes a task. |
| `Clockify.Tag.List` | Lists the tags in a workspace. |
| `Clockify.Tag.Create` | Creates a tag. |
| `Clockify.Tag.Update` | Updates a tag. |
| `Clockify.Tag.Delete` | Deletes a tag. |
| `Clockify.TimeEntry.List` | Lists a user's time entries in a workspace. |
| `Clockify.TimeEntry.Get` | Retrieves a single time entry by ID. |
| `Clockify.TimeEntry.Create` | Creates a time entry for a user. |
| `Clockify.TimeEntry.Update` | Updates a time entry. |
| `Clockify.TimeEntry.Delete` | Deletes a time entry. |
| `Clockify.TimeEntry.Sync` | Syncs a time entry to a BC Job Journal Line with deduplication, update detection, and correction posting. |
| `Clockify.TimeEntry.SyncRange` | Syncs all of a user's finished time entries in a date range to BC Job Journal Lines in a single call. |
| `Clockify.TimeEntry.SyncToTimeSheet` | Syncs a time entry to the resource's open BC Time Sheet (line + detail) instead of the Job Journal. |
| `Clockify.TimeEntry.SyncRangeToTimeSheet` | Syncs all of a user's finished time entries in a date range to their open BC Time Sheets in one call. |
| `Clockify.TimeEntry.SyncAllUsers` | Syncs finished entries in a date range for **every mapped user** — to time sheets (default) or the Job Journal. |
| `Clockify.TimeSheet.Create` | Creates upcoming weekly time sheets for every time-sheet resource (BC-side). |
| `Clockify.TimeSheet.Approve` | Submits and approves open time-sheet lines up to a cut-off date (BC-side). |
| `Clockify.TimeSheet.Reject` | Rejects submitted time-sheet lines up to a cut-off date (BC-side). |
| `Clockify.TimeSheet.Reopen` | Reopens submitted or approved time-sheet lines back to Open (BC-side). |
| `Clockify.TimeSheet.Post` | Transfers approved time-sheet detail to a Job Journal batch and posts it (BC-side). |
| `Clockify.TimeSheet.Archive` | Archives fully posted time sheets and removes empty posted sheets (BC-side). |
| `Clockify.Currency.List` | Lists the currencies defined in a workspace. Returns the `currencyId` values that `Clockify.Client.Create` and `Clockify.Client.Update` need. |
| `Clockify.UserGroup.List` | Lists the user groups defined in a workspace. Returns the user-group IDs needed for `userGroupIds` on `Clockify.Project.Create` / `Clockify.Project.Update`. |
| `Clockify.CustomField.List` | Lists the workspace-level custom field definitions. Returns the `customFieldId` values needed when writing `customFields` on time entries and projects. |

## Common Clockify quirks

These behaviours are not obvious from the Clockify reference and have bitten integrations in production. Each per-type help repeats the relevant one in its **Notes** section.

- **Clients use `currencyId`, not `currencyCode`.** The body of `Clockify.Client.Create` and `Clockify.Client.Update` must carry `currencyId` (an opaque Clockify ID). Passing `currencyCode` returns HTTP 200 but silently leaves the workspace default in place. Discover IDs with `Clockify.Currency.List`.
- **Clients must be archived before they can be deleted.** Clockify rejects `Clockify.Client.Delete` on active clients with HTTP 400 `Cannot delete an active client`. First send `Clockify.Client.Update` with body `{ "archived": true }`, then delete.
- **Clockify addresses are single-line.** The client (and similar) `address` field is one free-text value. When the source is a BC customer with `Address`, `Address 2`, `Post Code`, `City`, and `Country/Region Code`, concatenate them before sending.
- **Writes accept Clockify IDs, never names or BC keys.** `clientId`, `projectId`, `taskId`, `userId`, `tagIds`, `userGroupIds`, `customFieldId`, and `currencyId` are all opaque Clockify IDs. Passing display names or BC numbers returns HTTP 200 but the value is ignored. Resolve IDs first with the matching `*.List` message type.
- **Projects also archive before delete.** As with clients, `Clockify.Project.Delete` requires `archived = true` first; update the project, then delete.

## Integration tracking

The connector keeps the links between Business Central records and Clockify objects (for example a BC **Customer** and a Clockify **Client**) in the **`Clockify Integration`** table. You manage it with the base **`Data.Records.Get`** and **`Data.Records.Set`** message types — the Clockify message types above never touch it.

Each row holds:

| Field | Meaning |
|---|---|
| `BC Table No.` | The BC table of the linked record (for example `18` for Customer). |
| `BC SystemId` | The SystemId of the linked BC record — the stable link target. |
| `BC Code` | The readable key of the BC record (for example the Customer No.). |
| `Clockify Type` | `CLIENT`, `PROJECT`, `TASK`, `TAG`, `TIME_ENTRY`, `USER` or `WORKSPACE`. |
| `Clockify Workspace Id` | The workspace the Clockify object lives in. |
| `Clockify Id` | The Clockify object identifier. |
| `Clockify Name` | The display name of the Clockify object. |
| `Reversed` | Set to `true` to break the link (rows cannot be deleted). |
| `Reversed At` | Stamped automatically when `Reversed` becomes `true`. |

### Methods for storing integration information

Use the following `Data.Records.Set` and `Data.Records.Get` patterns to manage the Clockify Integration table.

#### Record a link (`Data.Records.Set`)

After creating or syncing an object in Clockify, record the link:

```json
{
  "type": "Data.Records.Set",
  "body": {
    "table": "Clockify Integration ori",
    "records": [
      {
        "primaryKey": { "Entry No.": <next entry no.> },
        "fields": {
          "BC Table No.": 18,
          "BC SystemId": "<SystemId of BC Customer>",
          "BC Code": "10000",
          "Clockify Type": "CLIENT",
          "Clockify Workspace Id": "<workspaceId>",
          "Clockify Id": "<clockify client id>",
          "Clockify Name": "Adatum Corporation",
          "Reversed": false
        }
      }
    ]
  }
}
```

Common `Clockify Type` and `BC Table No.` pairings:

| Clockify Type | BC Table No. | BC Table |
|---|---|---|
| `CLIENT` | 18 | Customer |
| `PROJECT` | 167 | Job |
| `TASK` | 1001 | Job Task |
| `USER` | 156 | Resource |
| `TIME_ENTRY` | 210 | Job Journal Line (or 169 = Job Ledger Entry after posting) |
| `TAG` | 200 | Work Type — optional; links a Clockify tag to a BC Work Type so synced time entries carry a Work Type Code (`BC Code` = the Work Type Code). |

#### Resolve a link (`Data.Records.Get`)

Look up the Clockify ID for a BC record (or vice versa):

```json
{
  "type": "Data.Records.Get",
  "body": {
    "table": "Clockify Integration ori",
    "filter": "WHERE(Clockify Type=CONST(PROJECT),BC Table No.=CONST(167),Reversed=CONST(false))"
  }
}
```

To find the BC record for a known Clockify ID:

```json
{
  "type": "Data.Records.Get",
  "body": {
    "table": "Clockify Integration ori",
    "filter": "WHERE(Clockify Type=CONST(TIME_ENTRY),Clockify Id=CONST(<clockifyId>),Reversed=CONST(false))"
  }
}
```

#### Break a link (`Data.Records.Set` with `Reversed`)

Neither `Data.Records.Get` nor `Data.Records.Set` can delete rows. Set `Reversed` = `true` instead:

```json
{
  "type": "Data.Records.Set",
  "body": {
    "table": "Clockify Integration ori",
    "records": [
      {
        "primaryKey": { "Entry No.": <existing entry no.> },
        "fields": { "Reversed": true }
      }
    ]
  }
}
```

A retention policy automatically purges reversed rows about **one month** after `Reversed At`.

#### Automated sync (`Clockify.TimeEntry.Sync`)

The `Clockify.TimeEntry.Sync` message type handles integration tracking automatically:

- **Created**: Creates a Job Journal Line and a new integration record linking the Clockify time entry ID to the journal line SystemId.
- **Skipped**: Time entry already synced and unchanged — no action.
- **Updated**: Time entry changed but journal line not yet posted — updates the line in place and updates the integration name.
- **Corrected**: Time entry changed but already posted to Job Ledger — reverses the old integration, creates a reversal journal line (negative qty) and a new correct line with new integration.

##### How a synced line is built

| Job Journal Line field | Source |
|---|---|
| Job No. | The `PROJECT` integration link for the entry's Clockify project. |
| Job Task No. | The `TASK` integration link for the entry's Clockify task. The Clockify task always maps to a BC Job Task. |
| No. (Resource) | The `USER` integration link for the entry's Clockify user. People sync as BC **Resources** (not Employees). |
| Quantity | The entry duration in hours. |
| Line Type | `Both Budget and Billable` when the entry is billable, otherwise `Budget`. |
| Work Type Code | Resolved from the entry's **tags** (see below). |
| Unit of Measure / Unit Price / Unit Cost | Defaulted by BC from the Resource and standard job/resource pricing. Clockify rates are not transferred. |

**Work Type resolution (tags → Work Type).** A Clockify tag can be linked to a BC Work Type with a `TAG` integration row whose `BC Code` is the Work Type Code. When a time entry is synced, the connector takes the **first** of the entry's tags that is linked to a Work Type and stamps it on the journal line. If the entry has no tags, or none of its tags is linked, the **`Clockify Default Work Type`** on Clockify Setup is used. If that is also blank, the line's Work Type is left empty.

**Journal target.** Lines are written to the **`Clockify Job Journal Template` / `Clockify Job Journal Batch`** configured on Clockify Setup (the `Clockify.TimeEntry.Sync` request may override them per call with `journalTemplate` / `journalBatch`). The connector **creates** the journal line only — it never posts it; posting is left to a person.

When the Job Journal is posted, the `Clockify Event Subscribers` codeunit automatically updates the integration record from `BC Table No. = 210` (Job Journal Line) to `BC Table No. = 169` (Job Ledger Entry).

> Every Clockify message type except this help requires **write permission to the `Clockify Integration` table** (the `Clockify - Full` permission set grants it). Requests run by a user without it return an error.

