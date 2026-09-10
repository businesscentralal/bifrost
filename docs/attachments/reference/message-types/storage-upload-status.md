---
id: storage-upload-status
title: "Storage.Upload.Status"
sidebar_label: "Storage.Upload.Status"
sidebar_position: 23
description: "Request and response contract for the Storage.Upload.Status Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Reports the progress and state of an upload session.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Upload.Status` and the parameters below as the `data` object.
- **Routing:** Addressed by `uploadId` — the session created by `Storage.Upload.Begin`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `uploadId` | **Yes** | string (GUID) | The session returned by Storage.Upload.Begin. |

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
| `uploadId` | string (GUID) | Echo of the session id. |
| `storageCode` | string | The storage connection the file will be written to. |
| `fileName` | string | The file name set at Begin. |
| `path` | string | The destination path the committed file will be written to. |
| `status` | string | `Open`, `Committed`, or `Aborted`. |
| `declaredSize` | integer | The expected size declared at Begin, or 0 if none was given. |
| `received` | integer | Bytes accumulated across all chunks so far. |
| `chunkCount` | integer | Number of chunks stored so far. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| No upload session was found for the supplied uploadId | It may have been committed, aborted, or pruned; a session is private to its creator. |

## Notes
Use this to confirm received bytes and chunk count before committing, or to check whether a session is still open. This is a read-only query and does not change the session.

## Next steps
- If status is Open and bytes remain → call `Storage.Upload.Append` (send the next chunk).
- If all bytes are received → call `Storage.Upload.Commit` (pass the same `uploadId`).

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

