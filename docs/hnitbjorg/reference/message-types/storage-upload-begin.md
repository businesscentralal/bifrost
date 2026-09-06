---
id: storage-upload-begin
title: "Storage.Upload.Begin"
sidebar_label: "Storage.Upload.Begin"
sidebar_position: 20
description: "Request and response contract for the Storage.Upload.Begin Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Opens a chunked upload session for delivering a large file as a sequence of small chunks.

## Metadata
- **Direction:** Inbound (write)
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Upload.Begin` and the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | No | string | The storage connection the file is written to on Storage.Upload.Commit. Omit to create a buffer-only session that can only be committed with Storage.Upload.CommitToRecord (attaches directly to a record without external storage). |
| `fileName` | **Yes** | string | File name of the upload, including extension. Used as the leaf of the default path. |
| `path` | No | string | Full destination path including the file name, relative to the connection base path. Overrides folderPath. Omit both to use the default `bifrost-uploads/{fileName}`. |
| `folderPath` | No | string | Destination folder (forward-slash separated); the file name is appended automatically. Ignored when path is supplied. |
| `declaredSize` | No | integer | Expected total size in bytes. When supplied it is verified against the assembled size on commit; a mismatch fails the commit. Recommended for integrity. |

## Request example
```json
{ "storageCode": "BLOBTEST", "fileName": "invoice.pdf", "folderPath": "invoices/2026", "declaredSize": 212413 }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `uploadId` | string (GUID) | The session id. Pass it as `uploadId` on every Append, Commit, Abort and Status call for this upload. |
| `storageCode` | string | Echo of the resolved storage connection. |
| `path` | string | The destination path the committed file will be written to. |
| `chunkSizeHint` | integer | Recommended maximum RAW bytes per chunk (currently 49152). Read at most this many bytes per chunk, base64-encode that slice on its own, and send it with Append. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| No storage connection is configured for storageCode | Resolve a valid, enabled code via Storage.Account.List. |

## Notes
Use this when a file is too large to pass to Storage.File.Create in one call. Split the file into chunks of at most `chunkSizeHint` RAW bytes; base64-encode each chunk INDEPENDENTLY (do not base64 the whole file and then slice the text — the boundaries would not decode). Send chunks with sequence numbers 1, 2, 3, ..., then commit. A session is private to the user that created it and is pruned automatically if never committed.

## Next steps
- To send the file contents → call `Storage.Upload.Append` (pass the returned `uploadId`, `sequence` starting at 1, and one base64 chunk).
- To write the file to storage → call `Storage.Upload.Commit` (pass the `uploadId` — requires a storageCode on the session).
- To attach the file to a record without storage → call `Storage.Upload.CommitToRecord` (pass the `uploadId` + record address (tableId/no)).

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

