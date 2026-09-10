---
id: storage-directory-delete
title: "Storage.Directory.Delete"
sidebar_label: "Storage.Directory.Delete"
sidebar_position: 8
description: "Request and response contract for the Storage.Directory.Delete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a directory from the configured storage connection.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Directory.Delete` and the parameters below as the `data` object.
- **External File Storage operation:** `DeleteDirectory`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The configured storage connection to use. Resolve via Storage.Account.List. |
| `path` | **Yes** | string | The directory path to delete (relative to the connection base path). |

## Request example
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026" }
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
| Directory not found | Verify the directory exists with Storage.Directory.Exists. |

## Related operations
- **Check existence first:** `Storage.Directory.Exists`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

