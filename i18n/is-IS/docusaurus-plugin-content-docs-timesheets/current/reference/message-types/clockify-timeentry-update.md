---
id: clockify-timeentry-update
title: "Clockify.TimeEntry.Update"
sidebar_label: "Clockify.TimeEntry.Update"
sidebar_position: 30
description: "Request and response contract for the Clockify.TimeEntry.Update Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Uppfærir an existing Clockify tímafærsla úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/time-entries/{timeEntryId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `timeEntryId` | **Yes** | string | The tímafærsla ID to updagsetning | `Clockify.TimeEntry.List → id` |
| `body.start` | No | string | Start time (ISO-8601 UTC) | — |
| `body.end` | No | string | End time (ISO-8601 UTC). Stilltuting this on an open entry **stops the timer**. | — |
| `body.description` | No | string | Free-text description | — |
| `body.projectId` | No | string | Clockify verkefni ID | `Clockify.Project.List → id` |
| `body.taskId` | No | string | Clockify verkþáttur ID | `Clockify.Task.List → id` |
| `body.tagIds` | No | array | Array of tag IDs. **Empty array clears allir tags**; omit to keep current. | `Clockify.Tag.List → id` |
| `body.billable` | No | boolean | Override billable status | — |
| `body.customFields` | No | array | Array of &#123; customFieldId, gildi &#125; | `Clockify.CustomField.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "timeEntryId": "64...", "body": { "start": "2026-06-09T08:00:00Z", "end": "2026-06-09T11:00:00Z", "description": "Consulting (revised)", "billable": true, "customFields": [ { "customFieldId": "65...", "value": "PO-1234" } ] } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the updagsetningd time-entry object.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Ef this changes which Business Central færsla the timeEntry maps to, updagsetning the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `timeEntry`, `Clockify Id` = the ID, `Reversed` = `false`). Updagsetning `BC SystemId`, `BC Code`, og `Clockify Name` með `Data.Records.Set`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Overlapping tímafærsla | Adjust start/end to avoid overlap með existing entries |
| 404 | Time entry fannst ekki | Staðfestu timeEntryId via `Clockify.TimeEntry.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Stilltuting `end` on an entry með no end **stops the running timer**.\- `tagIds: []` (empty array) **clears allir tags**; omitting `tagIds` entirely leaves existing tags unchanged.\- Send aðeins fields you want to change; omitted fields retain current gildi.\- `customFields` format: `{ "customFieldId": "...", "value": ... }`. Get IDs úr `Clockify.CustomField.List`.

## Tengdar aðgerðir
- **Stop running timer:** Send `{ "end": "<ISO-8601 UTC>" }`\- **Delete instead:** `Clockify.TimeEntry.Delete`\- **Sync updagsetningd entry to BC:** `Clockify.TimeEntry.Sync`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- Valfrjálst `body.*` fields omitted úr the request eru not sent to Clockify; existing Clockify gildi typically remain unchanged.
- A tímafærsla án `end` er in-progress (running timer). Stop the timer (set `end`) áður en syncing to BC Job Journal.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

