---
id: clockify-timeentry-get
title: "Clockify.TimeEntry.Get"
sidebar_label: "Clockify.TimeEntry.Get"
sidebar_position: 23
description: "Request and response contract for the Clockify.TimeEntry.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Retrieves a single Clockify tímafærsla by ID.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/time-entries/{timeEntryId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `timeEntryId` | **Yes** | string | The tímafærsla ID to retrieve | `Clockify.TimeEntry.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "timeEntryId": "64..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the time-entry object (includes `id`, `start`, `end`, `duration`, `projectId`, `taskId`, `tagIds`, `billable`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 404 | Time entry fannst ekki | Staðfestu timeEntryId via `Clockify.TimeEntry.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Tengdar aðgerðir
- **Find timeEntryId:** `Clockify.TimeEntry.List` (requires notandiId)\- **Updagsetning this entry:** `Clockify.TimeEntry.Update`\- **Sync to BC:** `Clockify.TimeEntry.Sync`

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

