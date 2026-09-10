---
id: storage-file-create
title: "Storage.File.Create"
sidebar_label: "Storage.File.Create"
sidebar_position: 12
description: "Request and response contract for the Storage.File.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Uploads one small base64 file to a path. For larger files, use Storage.Upload.Begin/Append/Commit.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.File.Create` and the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The configured storage connection to use. Resolve via Storage.Account.List. |
| `path` | **Yes** | string | The destination file path (relative to the connection base path). |
| `contentBase64` | **Yes** | base64 string | The complete file content, base64-encoded. Keep single-call uploads small; use Storage.Upload.Begin for larger files. |

## Request example
```json
{ "storageCode": "ARCHIVE", "path": "notes/hello.txt", "contentBase64": "SGVsbG8gd29ybGQ=" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```
`data` contains `path` and `contentLength` (the number of bytes stored).

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| Invalid base64 content | Ensure contentBase64 is valid base64 with no surrounding whitespace or data-URI prefix. |
| Path not found | Create the parent directory first with Storage.Directory.Create where the connector requires it. |

## Notes
Use this message type for small files that fit comfortably in one Bifrost request. For predictable large-file uploads, use `Storage.Upload.Begin`, append chunks of at most 49152 RAW bytes each (about 64 KB base64), then call `Storage.Upload.Commit`. Creating a file at an existing path overwrites it on connectors that support overwrite (for example Azure Blob).

## Related operations
- **Upload a larger file in parts:** `Storage.Upload.Begin`\- **Download the file:** `Storage.File.Get`\- **Delete the file:** `Storage.File.Delete`

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

