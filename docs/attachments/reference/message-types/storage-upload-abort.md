---
id: storage-upload-abort
title: "Storage.Upload.Abort"
sidebar_label: "Storage.Upload.Abort"
sidebar_position: 18
description: "Request and response contract for the Storage.Upload.Abort Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Discards an open upload session and all its chunks without writing to storage.

## Metadata
- **Direction:** Inbound (write)
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Upload.Abort` and the parameters below as the `data` object.
- **Routing:** Addressed by `uploadId` — the session created by `Storage.Upload.Begin`. Touches no storage.

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
| `uploadId` | string (GUID) | Echo of the discarded session id. |
| `status` | string | Always `Aborted` on success. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| No upload session was found for the supplied uploadId | It may have already been committed, aborted, or pruned; a session is private to its creator. |
| The upload session is not open | Only an open session can be aborted; a committed upload is already stored. |

## Notes
Aborting deletes the session and its chunks from the database. It does not touch storage, because nothing has been written there yet. Uncommitted sessions are also pruned automatically by a retention policy, so aborting is optional.

## Next steps
- To start a fresh upload → call `Storage.Upload.Begin`.

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

