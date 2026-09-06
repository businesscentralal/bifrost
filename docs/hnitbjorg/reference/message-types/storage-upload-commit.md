---
id: storage-upload-commit
title: "Storage.Upload.Commit"
sidebar_label: "Storage.Upload.Commit"
sidebar_position: 21
description: "Request and response contract for the Storage.Upload.Commit Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Assembles an upload session's chunks and writes the file to the storage connection.

## Metadata
- **Direction:** Inbound (write)
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Upload.Commit` and the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** Addressed by `uploadId` — the session created by `Storage.Upload.Begin`. The destination path and storage connection were fixed at Begin.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `uploadId` | **Yes** | string (GUID) | The session returned by Storage.Upload.Begin, after all chunks have been appended. |

## Request example
```json
{ "uploadId": "0f8e...-..." }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `uploadId` | string (GUID) | Echo of the committed session id. |
| `storageCode` | string | The storage connection the file was written to. Carry it into Storage.Attachment.CreateLinked or Storage.File.* calls. |
| `path` | string | The full path the file was written to. Carry it into Storage.Attachment.CreateLinked, Storage.File.Get, etc. |
| `contentLength` | integer | The assembled file size in bytes. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| The upload session has no chunks to commit | Append at least one chunk with Storage.Upload.Append before committing. |
| The upload session is missing one or more chunks | Sequence numbers are not contiguous; re-append the missing sequence(s) before committing. |
| The received size does not match the declared size | A chunk is missing or truncated; re-append it, or begin again without declaredSize. |
| The upload session is not open | It was already committed or aborted; begin a new session. |
| This upload session has no storage connection | The session was begun without a storageCode. Use Storage.Upload.CommitToRecord to attach it to a record without external storage, or begin a new session with a storageCode. |

## Notes
Commit assembles the chunks in ascending sequence order, writes the file last (after the database work, so a failure rolls back cleanly), and removes the chunks. Writing to an existing path overwrites it on connectors such as Azure Blob. This message type requires a storageCode on the session — use Storage.Upload.CommitToRecord instead if you want to attach the file directly to a record without external storage.

## Next steps
- To attach the file to a new or existing incoming document → call `Storage.Attachment.CreateLinked` (pass the returned `storageCode` and `path`).
- To attach the file to any master record (born offloaded) → call `Storage.Attachment.CreateForRecord` (pass the returned `storageCode` and `path` as content source 2).
- To download or confirm the stored file → call `Storage.File.Get` (pass the returned `storageCode` and `path`).

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

