---
id: clockify-tag-create
title: "Clockify.Tag.Create"
sidebar_label: "Clockify.Tag.Create"
sidebar_position: 13
description: "Request and response contract for the Clockify.Tag.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Býr til a tag in a Clockify vinnusvæði úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/tags`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `tag`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `body.name` | **Yes** | string | Tag display heiti (verður að vera unique in vinnusvæði) | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "body": { "name": "Billable" } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the created tag object (includes `id`, `name`, `workspaceId`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Record the link: call `Data.Records.Set` on `Clockify Integration` með `BC Table No.`, `BC SystemId`, `BC Code` (the BC source færsla), `Clockify Type` = `tag`, `Clockify Id` = the `id` úr `data` in the response, `Clockify Workspace Id` = the vinnusvæði used, `Clockify Name` = display heiti. Stilltu `Reversed` = `false`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Tag heiti already er til | Notaðu `Clockify.Tag.List` to find existing tag |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Tags eru vinnusvæði-scoped (not verkefni-scoped). One tag getur be used across allir verkefni.\- Notaðu tag `id` (not heiti) þegar attaching to tímafærslur via `tagIds` array.

## Tengdar aðgerðir
- **List existing tags:** `Clockify.Tag.List`\- **Notaðu in tímafærslur:** Sendu tag `id` in `tagIds` array of `Clockify.TimeEntry.Create`/`Update`\- **Delete later:** `Clockify.Tag.Delete` (no archive step needed)

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

