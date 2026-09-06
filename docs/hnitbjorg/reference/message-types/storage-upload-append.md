---
id: storage-upload-append
title: "Storage.Upload.Append"
sidebar_label: "Storage.Upload.Append"
sidebar_position: 19
description: "Request and response contract for the Storage.Upload.Append Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Appends one base64 chunk to an open upload session.

## Metadata
- **Direction:** Inbound (write)
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Upload.Append` and the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** Addressed by `uploadId` — the session created by `Storage.Upload.Begin`. No `storageCode` is needed here; the destination was fixed at Begin.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `uploadId` | **Yes** | string (GUID) | The session returned by Storage.Upload.Begin. |
| `sequence` | **Yes** | integer | 1-based position of this chunk. Sequences must be contiguous (1, 2, 3, ...) with no gaps by the time you commit. Re-sending the same sequence replaces that chunk, so retries are safe. |
| `contentBase64` | **Yes** | base64 string | This chunk's raw bytes, base64-encoded on their own — no data-URI prefix, no whitespace. Keep each chunk at or below the chunkSizeHint raw bytes from Begin (~48 KB). |

## Request example
```json
{ "uploadId": "0f8e...-...", "sequence": 1, "contentBase64": "JVBERi0xLjQK..." }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `uploadId` | string (GUID) | Echo of the session id. |
| `sequence` | integer | Echo of the accepted chunk sequence. |
| `received` | integer | Total bytes accumulated across all chunks so far. When this equals declaredSize (or the file size you intend), you are done appending. |
| `chunkCount` | integer | Number of distinct chunks stored so far. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| No upload session was found for the supplied uploadId | Begin a session first; a session is private to its creator and may have been committed, aborted, or pruned. |
| The upload session is not open | It was already committed or aborted; begin a new session. |
| Invalid base64 content | Ensure contentBase64 is valid base64 with no surrounding whitespace or data-URI prefix. |

## Notes
Send chunks in order (sequence 1, 2, 3, ...). This call is idempotent per sequence — re-sending a sequence replaces that chunk.

## Next steps
- While more chunks remain → call `Storage.Upload.Append` (increment `sequence` and send the next chunk).
- When all chunks are sent (to external storage) → call `Storage.Upload.Commit` (pass the same `uploadId` — requires a storageCode on the session).
- When all chunks are sent (to a record, no storage) → call `Storage.Upload.CommitToRecord` (pass the same `uploadId` + record address or `target` = IncomingDocument).
- To check accumulated progress → call `Storage.Upload.Status` (pass the same `uploadId`).

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

