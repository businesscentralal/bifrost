---
id: clockify-project-update
title: "Clockify.Project.Update"
sidebar_label: "Clockify.Project.Update"
sidebar_position: 12
description: "Request and response contract for the Clockify.Project.Update Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Uppfærir an existing Clockify verkefni úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `PUT /workspaces/{workspaceId}/projects/{projectId}`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `project`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `projectId` | **Yes** | string | The Clockify verkefni ID to updagsetning | `Clockify Integration table → Clockify Id (type=project)` |
| `body.name` | No | string | Project display heiti | — |
| `body.clientId` | No | string | Clockify client ID | `Clockify.Client.List → id` |
| `body.isPublic` | No | boolean | Visibility to allir vinnusvæði members | — |
| `body.billable` | No | boolean | Default billable status fyrir tímafærslur | — |
| `body.color` | No | string | Hex colour kóði | — |
| `body.note` | No | string | Free-text description | — |
| `body.archived` | No | boolean | Stilltu true to archive (required áður en delete) | — |
| `body.userGroupIds` | No | array | Array of Clockify notandi-group IDs | `Clockify.UserGroup.List → id` |
| `body.customFields` | No | array | Array of &#123; customFieldId, status, sjálfgefiðValue &#125; | `Clockify.CustomField.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "projectId": "60...", "body": { "name": "Implementation 2026", "archived": false, "billable": true, "customFields": [ { "customFieldId": "62...", "status": "VISIBLE", "defaultValue": "Iceland" } ] } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the updagsetningd verkefni object.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Ef this changes which Business Central færsla the verkefni maps to, updagsetning the matching `Clockify Integration` row (find via `Data.Records.Get` filter `Clockify Type` = `project`, `Clockify Id` = the ID, `Reversed` = `false`). Updagsetning `BC SystemId`, `BC Code`, og `Clockify Name` með `Data.Records.Set`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Project heiti already er til | Choose a different heiti |
| 404 | Project fannst ekki | Staðfestu verkefniId via `Clockify.Project.List` |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- `clientId` og `userGroupIds` require Clockify IDs — heitis og BC keys eru silently ignored.\- `customFields` format: `{ "customFieldId": "...", "status": "VISIBLE"|"INVISIBLE", "defaultValue": ... }`. Get `customFieldId` úr `Clockify.CustomField.List`.\- Stilltuting `archived: true` er the **required first step** áður en `Clockify.Project.Delete`.\- Send aðeins fields you want to change; omitted fields retain current gildi.

## Tengdar aðgerðir
- **Archive áður en delete:** Stilltu `body.archived` = true, then `Clockify.Project.Delete`\- **Resolve customFieldId:** `Clockify.CustomField.List` → `id`\- **Resolve clientId:** `Clockify.Client.List` eða Clockify Integration (tegund=client)

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- Valfrjálst `body.*` fields omitted úr the request eru not sent to Clockify; existing Clockify gildi typically remain unchanged.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

