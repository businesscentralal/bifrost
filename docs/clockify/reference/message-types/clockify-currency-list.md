---
id: clockify-currency-list
title: "Clockify.Currency.List"
sidebar_label: "Clockify.Currency.List"
sidebar_position: 6
description: "Request and response contract for the Clockify.Currency.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the currencies defined in a Clockify workspace.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /workspaces (inline `currencies` from workspace object)`

## Parameters

| Parameter | Required | Type | Description | Resolve via |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target workspace ID | `Clockify.Workspace.List → id` |

`workspaceId` may be omitted when Default Workspace ID is configured on Clockify Setup.

## Request example
```json
{ "workspaceId": "5f..." }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains an array of currency objects (each with `id`, `code`, and the workspace default flag).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation. Use `id` as `currencyId` in client operations.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- Clockify has no standalone currencies endpoint. This message type reads `GET /workspaces` and extracts the requested workspace's `currencies` array.\- Each item has an internal `id` (Clockify currency ID) and a 3-letter `code` (e.g. `ISK`, `USD`).\- Use the `id` value (NOT the `code`) as `currencyId` in `Clockify.Client.Create` / `Clockify.Client.Update`. Passing `currencyCode` is silently ignored.\- The list is per-workspace — the same currency code can have different IDs in different workspaces.

## Related operations
- **Use currencyId:** `Clockify.Client.Create` and `Clockify.Client.Update` (body.currencyId)\- **Workspace info:** `Clockify.Workspace.List` returns the full workspace object including currencies

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

