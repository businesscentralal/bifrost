---
id: clockify-customfield-list
title: "Clockify.CustomField.List"
sidebar_label: "Clockify.CustomField.List"
sidebar_position: 7
description: "Request and response contract for the Clockify.CustomField.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the workspace-level custom field definitions in a Clockify workspace.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces/{workspaceId}/custom-fields`

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |
| `query.page-size` | No | integer | Results per page (default 50, max 5000) | — |
| `query.page` | No | integer | Page number (1-based) | — |
| `query.status` | No | string | Filter: VISIBLE or INVISIBLE | — |
| `query.name` | No | string | Filter: partial name match | — |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f...", "query": { "page-size": 50, "page": 1, "status": "VISIBLE" } }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains an array of custom-field definition objects (each with `id`, `name`, `type`, `allowedValues`, `status`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation. Use `id` as `customFieldId` in time-entry and project operations.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Field `type` values: `TXT`, `NUMBER`, `DROPDOWN_SINGLE`, `DROPDOWN_MULTIPLE`, `CHECKBOX`, `LINK`.\- Use the `id` value as `customFieldId` in `Clockify.TimeEntry.Create/Update` and `Clockify.Project.Update` bodies.\- For per-project enablement and defaults, send `customFieldId` inside the `customFields` array on `Clockify.Project.Update`.\- This endpoint returns **workspace-level** definitions only. Project-scoped overrides (enabled/disabled, project-level defaults) surface inside `Clockify.Project.Get`.

## Related operations
- **Use on time entries:** `Clockify.TimeEntry.Create/Update` (body.customFields)\- **Enable per project:** `Clockify.Project.Update` (body.customFields)\- **See project overrides:** `Clockify.Project.Get` (response.customFields)

## Agent guidance — optional parameter effects

- Any parameter marked **Required = No** may be omitted.
- `query.*` parameters only shape the returned `data` set (filtering/paging). They never mutate Clockify state.
- Omitting query filters returns a broader result set than filtered calls.
- `query.page-size` and `query.page` only change paging windows; they do not change underlying records.

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

