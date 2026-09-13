---
id: clockify-tag-delete
title: "Clockify.Tag.Delete"
sidebar_label: "Clockify.Tag.Delete"
sidebar_position: 14
description: "Request and response contract for the Clockify.Tag.Delete Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Eyðir a Clockify tag by ID.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/tags/{tagId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `tag`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `tagId` | **Yes** | string | The tag ID to delete | `Clockify.Tag.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "tagId": "62..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the deleted tag object.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `tag`, `Clockify Id` = the deleted ID, `Reversed` = `false`) og set `Reversed` = `true` með `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 404 | Tag fannst ekki | Staðfestu tagId via `Clockify.Tag.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Unlike clients og verkefni, tags do NOT require archiving áður en delete.\- Time entries referencing this tag retain their data but the tag link becomes orphaned.

## Tengdar aðgerðir
- **Alternative to delete:** Archive via `Clockify.Tag.Update` með `{ "archived": true }`\- **After delete:** `Data.Records.Set` on Clockify Integration → `Reversed` = true

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

