---
id: storage-directory-list
title: "Storage.Directory.List"
sidebar_label: "Storage.Directory.List"
sidebar_position: 10
description: "Request and response contract for the Storage.Directory.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists the subdirectories of a directory in the configured storage connection.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Directory.List` and the parameters below as the `data` object.
- **External File Storage operation:** `ListDirectories`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The configured storage connection to use. Resolve via Storage.Account.List. |
| `path` | No | string | The directory whose subdirectories are listed (relative to the connection base path). Omit or pass an empty string to list the root of the connection. |

## Request example
```json
{ "storageCode": "ARCHIVE", "path": "invoices" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```
`data` contains `path` and an `entries` array of `{ name, type, parentDirectory }` (type is always `Directory`).

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Related operations
- **List files:** `Storage.File.List`\- **Create a directory:** `Storage.Directory.Create`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

