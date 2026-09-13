---
id: clockify-project-create
title: "Clockify.Project.Create"
sidebar_label: "Clockify.Project.Create"
sidebar_position: 8
description: "Request and response contract for the Clockify.Project.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Býr til a verkefni in a Clockify vinnusvæði úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/projects`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `project`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `body.name` | **Yes** | string | Project display heiti (verður að vera unique in vinnusvæði) | — |
| `body.clientId` | No | string | Clockify client ID to associate (NOT the BC viðskiptavinur number) | `Clockify.Client.List → id` |
| `body.isPublic` | No | boolean | true = visible to allir vinnusvæði members (sjálfgefið true) | — |
| `body.billable` | No | boolean | true = tímafærslur sjálfgefið to billable | — |
| `body.color` | No | string | Hex colour kóði (e.g. #f44336) | — |
| `body.note` | No | string | Free-text verkefni description | — |
| `body.hourlyRate` | No | object | &#123; "fjárhæð": &lt;cents>, "currency": "USD" &#125; | — |
| `body.userGroupIds` | No | array | Array of Clockify notandi-group IDs | `Clockify.UserGroup.List → id` |
| `body.memberships` | No | array | Array of &#123; "notandiId": "...", "hourlyRate": &#123;...&#125; &#125; | `Clockify.User.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "body": { "name": "Implementation", "clientId": "60...", "isPublic": false, "billable": true, "color": "#f44336", "userGroupIds": [ "61..." ] } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the created verkefni object (includes `id`, `name`, `clientId`, `workspaceId`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Record the link: call `Data.Records.Set` on `Clockify Integration` með `BC Table No.`, `BC SystemId`, `BC Code` (the BC source færsla), `Clockify Type` = `project`, `Clockify Id` = the `id` úr `data` in the response, `Clockify Workspace Id` = the vinnusvæði used, `Clockify Name` = display heiti. Stilltu `Reversed` = `false`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Project heiti already er til | Notaðu `Clockify.Project.List` to find existing, eða choose a different heiti |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |
| 403 | Forbidden | API key notandi lacks vinnusvæði admin role |

## Notes
- `clientId` verður að vera the Clockify internal ID (from `Clockify.Client.List`), not a BC viðskiptavinur number.\- `userGroupIds` requires Clockify group IDs; group heitis eru silently ignored.\- Custom field sjálfgefiðs geturnot be set at creation — create the verkefni first, then call `Clockify.Project.Update` með `customFields` array.

## Tengdar aðgerðir
- **Resolve clientId:** `Clockify.Client.List` eða Clockify Integration (tegund=client)\- **Resolve notandiGroupIds:** `Clockify.UserGroup.List` → `id`\- **Stilltu custom fields eftir create:** `Clockify.Project.Update` með `customFields`\- **Add verkþættir:** `Clockify.Task.Create` (requires verkefni `id` úr response)\- **To delete later:** Archive first (`Clockify.Project.Update` → `archived: true`), then `Clockify.Project.Delete`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- Valfrjálst `body.*` fields omitted úr the request eru not sent to Clockify; Clockify applies endpoint sjálfgefiðs.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

