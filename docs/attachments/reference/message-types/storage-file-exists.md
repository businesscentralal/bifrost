---
id: storage-file-exists
title: "Storage.File.Exists"
sidebar_label: "Storage.File.Exists"
sidebar_position: 14
description: "Request and response contract for the Storage.File.Exists Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Reports whether a file exists in the configured storage connection.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.File.Exists` and the parameters below as the `data` object.
- **External File Storage operation:** `FileExists`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The configured storage connection to use. Resolve via Storage.Account.List. |
| `path` | **Yes** | string | The file path to check (relative to the connection base path). |

## Request example
```json
{ "storageCode": "ARCHIVE", "path": "notes/hello.txt" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```
`data` contains `path` and `exists` (boolean).

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Related operations
- **List the directory:** `Storage.File.List`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

