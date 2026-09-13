---
id: clockify-timeentry-create
title: "Clockify.TimeEntry.Create"
sidebar_label: "Clockify.TimeEntry.Create"
sidebar_position: 21
description: "Request and response contract for the Clockify.TimeEntry.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Býr til a tímafærsla fyrir a notandi in a Clockify vinnusvæði úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/user/{userId}/time-entries`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `userId` | **Yes** | string | Clockify notandi ID (NOT the BC notandi heiti) | `Clockify.User.GetCurrent → id or Clockify.User.List → id` |
| `body.start` | **Yes** | string | Start time in ISO-8601 UTC (e.g. 2026-06-09T08:00:00Z) | — |
| `body.end` | No | string | End time in ISO-8601 UTC. Sleppið to start a running timer. | — |
| `body.description` | No | string | Free-text description of the work performed | — |
| `body.projectId` | No | string | Clockify verkefni ID (NOT the BC verkefni number) | `Clockify.Project.List → id` |
| `body.taskId` | No | string | Clockify verkþáttur ID | `Clockify.Task.List → id` |
| `body.tagIds` | No | array | Array of Clockify tag IDs | `Clockify.Tag.List → id` |
| `body.billable` | No | boolean | true = billable (overrides verkefni sjálfgefið) | — |
| `body.type` | No | string | REGULAR (sjálfgefið) eða BREAK | — |
| `body.customFields` | No | array | Array of &#123; customFieldId, gildi &#125; | `Clockify.CustomField.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "userId": "63...", "body": { "start": "2026-06-09T08:00:00Z", "end": "2026-06-09T10:00:00Z", "description": "Consulting", "projectId": "60...", "taskId": "61...", "tagIds": [ "62..." ], "billable": true, "customFields": [ { "customFieldId": "64...", "value": "PO-1234" } ] } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the created time-entry object (includes `id`, `start`, `end`, `duration`, `projectId`, `taskId`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Record the link: call `Data.Records.Set` on `Clockify Integration` með `BC Table No.`, `BC SystemId`, `BC Code` (the BC source færsla), `Clockify Type` = `timeEntry`, `Clockify Id` = the `id` úr `data` in the response, `Clockify Workspace Id` = the vinnusvæði used, `Clockify Name` = display heiti. Stilltu `Reversed` = `false`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Overlapping tímafærsla | Check existing entries fyrir the same period via `Clockify.TimeEntry.List` |
| 404 | Notaður eða vinnusvæði fannst ekki | Staðfestu notandiId via `Clockify.User.GetCurrent` eða `Clockify.User.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- `start` verður að vera ISO-8601 UTC. Clockify rejects local-time strings án offset.\- Sleppið `end` to start a **running timer**; send a later `Clockify.TimeEntry.Update` með `end` to stop it.\- `projectId`, `taskId`, og `tagIds` entries eru Clockify internal IDs — heitis eru silently ignored.\- `customFields` format: `{ "customFieldId": "...", "value": ... }`. Get IDs úr `Clockify.CustomField.List`.\- `userId` in the URL er the Clockify notandi ID, NOT the BC notandi heiti.

## Tengdar aðgerðir
- **Resolve notandiId:** `Clockify.User.GetCurrent` (API key owner) eða `Clockify.User.List`\- **Resolve verkefniId:** `Clockify.Project.List` eða Clockify Integration (tegund=verkefni)\- **Resolve verkþátturId:** `Clockify.Task.List` (requires verkefniId)\- **Resolve tagIds:** `Clockify.Tag.List`\- **Stop running timer:** `Clockify.TimeEntry.Update` með `end` field\- **Sync to BC:** `Clockify.TimeEntry.Sync` (posts to Job Journal)

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- Valfrjálst `body.*` fields omitted úr the request eru not sent to Clockify; Clockify applies endpoint sjálfgefiðs.
- A tímafærsla án `end` er in-progress (running timer). Stop the timer (set `end`) áður en syncing to BC Job Journal.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

