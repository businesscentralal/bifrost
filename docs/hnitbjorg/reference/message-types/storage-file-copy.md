---
id: storage-file-copy
title: "Storage.File.Copy"
sidebar_label: "Storage.File.Copy"
sidebar_position: 11
description: "Request and response contract for the Storage.File.Copy Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Copies a file within the configured storage connection.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.File.Copy` and the parameters below as the `data` object.
- **External File Storage operation:** `CopyFile`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The configured storage connection to use. Resolve via Storage.Account.List. |
| `sourcePath` | **Yes** | string | The file to copy (relative to the connection base path). |
| `targetPath` | **Yes** | string | The destination path for the copy. |

## Request example
```json
{ "storageCode": "ARCHIVE", "sourcePath": "in/a.txt", "targetPath": "out/a.txt" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```
`data` contains the `sourcePath` and `targetPath`.

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| Source not found | Verify the source file exists with Storage.File.Exists. |

## Related operations
- **Move instead of copy:** `Storage.File.Move`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

