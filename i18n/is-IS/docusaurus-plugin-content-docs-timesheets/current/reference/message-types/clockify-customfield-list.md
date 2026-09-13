---
id: clockify-customfield-list
title: "Clockify.CustomField.List"
sidebar_label: "Clockify.CustomField.List"
sidebar_position: 7
description: "Request and response contract for the Clockify.CustomField.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the vinnusvæði-level custom field definitions in a Clockify vinnusvæði.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/custom-fields`

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `query.page-size` | No | integer | Results per page (sjálfgefið 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.status` | No | string | Filter: VISIBLE eða INVISIBLE | — |
| `query.name` | No | string | Filter: partial heiti match | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "query": { "page-size": 50, "page": 1, "status": "VISIBLE" } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur an array of custom-field definition objects (each með `id`, `name`, `type`, `allowedValues`, `status`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu `id` as `customFieldId` in time-entry og verkefni operations.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Field `type` gildi: `TXT`, `NUMBER`, `DROPDOWN_SINGLE`, `DROPDOWN_MULTIPLE`, `CHECKBOX`, `LINK`.\- Notaðu the `id` gildi as `customFieldId` in `Clockify.TimeEntry.Create/Update` og `Clockify.Project.Update` bodies.\- For per-verkefni enablement og sjálfgefiðs, send `customFieldId` inside the `customFields` array on `Clockify.Project.Update`.\- This endpoint returns **vinnusvæði-level** definitions only. Project-scoped overrides (enabled/disabled, verkefni-level sjálfgefiðs) surface inside `Clockify.Project.Get`.

## Tengdar aðgerðir
- **Notaðu on tímafærslur:** `Clockify.TimeEntry.Create/Update` (body.customFields)\- **Enable per verkefni:** `Clockify.Project.Update` (body.customFields)\- **See verkefni overrides:** `Clockify.Project.Get` (response.customFields)

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- `query.*` parameters aðeins shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Sleppiðting query filters returns a broader niðurstaða set than filtered calls.
- `query.page-size` og `query.page` aðeins change paging windows; they do not change underlying færslur.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

