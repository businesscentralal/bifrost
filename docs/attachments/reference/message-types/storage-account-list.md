---
id: storage-account-list
title: "Storage.Account.List"
sidebar_label: "Storage.Account.List"
sidebar_position: 2
description: "Request and response contract for the Storage.Account.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the configured storage connections (codes, descriptions, connectors and enabled state). No secrets are exposed.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Account.List` and the parameters below as the `data` object.
- **Routing:** No routing parameters. Lists every configured connection so you can pick a `storageCode` for the other types. This is the discovery entry point — call it first.

## Request example
```json
{ }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `accounts` | array | One object per connection: `{ code, description, connector, basePath, enabled }`. No secrets are returned. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Notes
Use a returned `code` as the `storageCode` on every other storage message type. Disabled connections are listed but rejected at call time, so prefer ones with `enabled = true`.

## Next steps
- Once you have a storageCode → call `Storage.File.Create` (pass the `code` as `storageCode` (or use any other Storage.* type)).
- To upload a large file → call `Storage.Upload.Begin` (pass the `code` as `storageCode`).

## Related operations
- **Connector overview:** `Help.Storage.Get`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

