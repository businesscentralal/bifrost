---
id: clockify-client-delete
title: "Clockify.Client.Delete"
sidebar_label: "Clockify.Client.Delete"
sidebar_position: 2
description: "Request and response contract for the Clockify.Client.Delete Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Eyðir a Clockify client by ID.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `DELETE /workspaces/{workspaceId}/clients/{clientId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `clientId` | **Yes** | string | The Clockify client ID to delete | `Clockify Integration table → Clockify Id (type=client)` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "clientId": "60..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the deleted client object.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Preconditions
1. The client **verður að vera archived first** — call `Clockify.Client.Update` með body `{ "archived": true }`.\2. Clockify rejects delete on active clients með HTTP 400.

## Samstillingarskráning
Mark the integration link as broken: find the `Clockify Integration` row (filter `Clockify Type` = `client`, `Clockify Id` = the deleted ID, `Reversed` = `false`) og set `Reversed` = `true` með `Data.Records.Set`. Do NOT delete the row. The retention policy purges reversed rows ~1 month later.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Cannot delete an active client | Archive first: `Clockify.Client.Update` með `{ "archived": true }` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |
| 404 | Client fannst ekki | Staðfestu clientId via `Clockify.Client.List` |

## Notes
- Two-step delete pattern: archive → delete. This er a Clockify platform requirement.\- After delete, mark the `Clockify Integration` row as reversed (do NOT delete it).

## Tengdar aðgerðir
- **Step 1 (archive):** `Clockify.Client.Update` með `{ "archived": true }`\- **Step 2 (delete):** This message tegund\- **Step 3 (unlink):** `Data.Records.Set` on Clockify Integration → `Reversed` = true

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

