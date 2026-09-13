---
id: clockify-client-get
title: "Clockify.Client.Get"
sidebar_label: "Clockify.Client.Get"
sidebar_position: 3
description: "Request and response contract for the Clockify.Client.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Retrieves a single Clockify client by ID.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/clients/{clientId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `clientId` | **Yes** | string | The Clockify client ID to retrieve | `Clockify Integration table → Clockify Id (type=client)` |

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
`data` inniheldur the client object (includes `id`, `name`, `workspaceId`, `archived`, `currencyId`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 404 | Client fannst ekki | Staðfestu clientId er til via `Clockify.Client.List` eða check Clockify Integration table |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Tengdar aðgerðir
- **Find clientId:** `Clockify.Client.List` eða `Data.Records.Get` on Clockify Integration (tegund=client)\- **Updagsetning this client:** `Clockify.Client.Update`\- **Delete this client:** Archive first, then `Clockify.Client.Delete`

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

