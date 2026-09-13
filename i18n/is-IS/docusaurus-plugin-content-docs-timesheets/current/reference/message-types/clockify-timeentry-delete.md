---
id: clockify-timeentry-delete
title: "Clockify.TimeEntry.Delete"
sidebar_label: "Clockify.TimeEntry.Delete"
sidebar_position: 22
description: "Request and response contract for the Clockify.TimeEntry.Delete Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Eyðir a Clockify tímafærsla by ID.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/time-entries/{timeEntryId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `timeEntry`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `timeEntryId` | **Yes** | string | The tímafærsla ID to delete | `Clockify.TimeEntry.List → id` |

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
`data` inniheldur empty body (HTTP 204 No Content on success).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `timeEntry`, `Clockify Id` = the deleted ID, `Reversed` = `false`) og set `Reversed` = `true` með `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 404 | Time entry fannst ekki | Staðfestu timeEntryId via `Clockify.TimeEntry.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- No archive step required — tímafærslur getur be deleted directly.\- Ef the entry was already synced to BC, consider reversing the Job Journal Line in BC as well.

## Tengdar aðgerðir
- **Alternative:** Updagsetning með corrected times instead of deleting (`Clockify.TimeEntry.Update`)\- **After delete in BC context:** Reverse eða delete the corresponding Job Journal Line

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

