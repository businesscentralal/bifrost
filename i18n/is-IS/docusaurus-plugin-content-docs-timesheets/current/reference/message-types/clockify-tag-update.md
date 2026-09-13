---
id: clockify-tag-update
title: "Clockify.Tag.Update"
sidebar_label: "Clockify.Tag.Update"
sidebar_position: 16
description: "Request and response contract for the Clockify.Tag.Update Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Uppfærir an existing Clockify tag úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/tags/{tagId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `tag`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `tagId` | **Yes** | string | The tag ID to updagsetning | `Clockify.Tag.List → id` |
| `body.name` | No | string | Tag display heiti | — |
| `body.archived` | No | boolean | Stilltu true to archive, false to unarchive | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "tagId": "62...", "body": { "name": "Non-billable", "archived": false } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the updagsetningd tag object.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Ef this changes which Business Central færsla the tag maps to, updagsetning the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `tag`, `Clockify Id` = the ID, `Reversed` = `false`). Updagsetning `BC SystemId`, `BC Code`, og `Clockify Name` með `Data.Records.Set`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Tag heiti already er til | Choose a different heiti |
| 404 | Tag fannst ekki | Staðfestu tagId via `Clockify.Tag.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Send aðeins fields you want to change; omitted fields retain current gildi.\- Unlike clients/verkefni, archiving a tag er NOT required áður en `Clockify.Tag.Delete`.

## Tengdar aðgerðir
- **Resolve tagId:** `Clockify.Tag.List` eða Clockify Integration (tegund=tag)\- **Delete tag:** `Clockify.Tag.Delete` (no archive step needed)

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- Valfrjálst `body.*` fields omitted úr the request eru not sent to Clockify; existing Clockify gildi typically remain unchanged.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

