---
id: storage-directory-create
title: "Storage.Directory.Create"
sidebar_label: "Storage.Directory.Create"
sidebar_position: 7
description: "Request and response contract for the Storage.Directory.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a directory in the configured storage connection.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Directory.Create` and the parameters below as the `data` object.
- **External File Storage operation:** `CreateDirectory`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The configured storage connection to use. Resolve via Storage.Account.List. |
| `path` | **Yes** | string | The directory path to create (relative to the connection base path). |

## Request example
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```
`data` contains the created `path`.

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Notes
Some connectors (for example Azure Blob) have no real directories; a directory may only become visible once it contains a file.

## Related operations
- **Delete a directory:** `Storage.Directory.Delete`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

