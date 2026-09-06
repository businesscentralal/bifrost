---
id: storage-file-get
title: "Storage.File.Get"
sidebar_label: "Storage.File.Get"
sidebar_position: 15
description: "Request and response contract for the Storage.File.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads a file from the configured storage connection and returns its content as base64.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.File.Get` and the parameters below as the `data` object.
- **External File Storage operation:** `GetFile`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The configured storage connection to use. Resolve via Storage.Account.List. |
| `path` | **Yes** | string | The file path to download (relative to the connection base path). |

## Request example
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026/INV-001.pdf" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```
`data` contains `path`, `contentLength` (bytes) and `contentBase64` (the file content).

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| File not found | Verify the file exists with Storage.File.Exists or list the directory with Storage.File.List. |

## Notes
The content is base64-encoded. Decode `contentBase64` to recover the original bytes.

## Related operations
- **Upload a file:** `Storage.File.Create`\- **Check existence:** `Storage.File.Exists`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

