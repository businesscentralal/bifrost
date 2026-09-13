---
id: clockify-client-update
title: "Clockify.Client.Update"
sidebar_label: "Clockify.Client.Update"
sidebar_position: 5
description: "Request and response contract for the Clockify.Client.Update Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Uppfærir an existing Clockify client úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/clients/{clientId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `clientId` | **Yes** | string | The Clockify client ID to updagsetning | `Clockify Integration table → Clockify Id (type=client)` |
| `body.name` | No | string | Client display heiti | — |
| `body.address` | No | string | Single-lína address | — |
| `body.email` | No | string | Client contact email | — |
| `body.note` | No | string | Free-text note | — |
| `body.currencyId` | No | string | Clockify currency ID (NOT the ISO kóði) | `Clockify.Currency.List → id` |
| `body.archived` | No | boolean | Stilltu true to archive, false to unarchive | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "clientId": "60...", "body": { "name": "Acme Ltd.", "currencyId": "6a...", "archived": false } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the updagsetningd client object.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Ef this changes which Business Central færsla the client maps to, updagsetning the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `client`, `Clockify Id` = the ID, `Reversed` = `false`). Updagsetning `BC SystemId`, `BC Code`, og `Clockify Name` með `Data.Records.Set`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Client heiti already er til | Choose a different heiti eða use existing client |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |
| 404 | Client fannst ekki | Staðfestu clientId via `Clockify.Client.List` |

## Notes
- `currencyCode` er **silently ignored** — Clockify returns 200 but the currency er unchanged. Alltaf use `currencyId`.\- Stilltuting `archived: true` er the **required first step** áður en `Clockify.Client.Delete`.\- Send aðeins the fields you want to change; omitted fields retain their current gildi.

## Tengdar aðgerðir
- **Archive áður en delete:** Stilltu `body.archived` = true, then call `Clockify.Client.Delete`\- **Resolve currencyId:** `Clockify.Currency.List` → match on `code` → use `id`\- **Unarchive:** Stilltu `body.archived` = false

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- Valfrjálst `body.*` fields omitted úr the request eru not sent to Clockify; existing Clockify gildi typically remain unchanged.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

