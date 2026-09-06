---
id: storage-file-delete
title: "Storage.File.Delete"
sidebar_label: "Storage.File.Delete"
sidebar_position: 13
description: "Request and response contract for the Storage.File.Delete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a file from the configured storage connection.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.File.Delete` and the parameters below as the `data` object.
- **External File Storage operation:** `DeleteFile`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The configured storage connection to use. Resolve via Storage.Account.List. |
| `path` | **Yes** | string | The file path to delete (relative to the connection base path). |

## Request example
```json
{ "storageCode": "ARCHIVE", "path": "notes/hello.txt" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```
`data` contains the deleted `path`.

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| File not found | Verify the file exists with Storage.File.Exists. |

## Related operations
- **Check existence first:** `Storage.File.Exists`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

