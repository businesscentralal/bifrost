---
id: storage-file-list
title: "Storage.File.List"
sidebar_label: "Storage.File.List"
sidebar_position: 16
description: "Request and response contract for the Storage.File.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the files in a directory of the configured storage connection.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.File.List` and the parameters below as the `data` object.
- **External File Storage operation:** `ListFiles`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The configured storage connection to use. Resolve via Storage.Account.List. |
| `path` | No | string | The directory whose files are listed (relative to the connection base path). Omit or pass an empty string to list the root of the connection. |

## Request example
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```
`data` contains `path` and an `entries` array of `{ name, type, parentDirectory }` (type is always `File`).

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| Path not found | Verify the directory exists with Storage.Directory.Exists. |

## Related operations
- **List subdirectories:** `Storage.Directory.List`\- **Download a file:** `Storage.File.Get`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

