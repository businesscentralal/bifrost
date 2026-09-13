---
id: storage-upload-append
title: "Storage.Upload.Append"
sidebar_label: "Storage.Upload.Append"
sidebar_position: 19
description: "Request and response contract for the Storage.Upload.Append Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Appends one base64 chunk to an open upload session.

## Lýsigögn
- **Direction:** Inn á við (write)
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Upload.Append` og the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** Addressed by `uploadId` — the session created by `Storage.Upload.Begin`. No `storageCode` er needed here; the destination was fixed at Begin.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `uploadId` | **Yes** | string (GUID) | The session returned by Storage.Upload.Begin. |
| `sequence` | **Yes** | integer | 1-based position of this chunk. Sequences verður að vera contiguous (1, 2, 3, ...) með no gaps by the time you commit. Re-sending the same sequence replaces that chunk, so retries eru safe. |
| `contentBase64` | **Yes** | base64 string | This chunk's raw bytes, base64-enkóðid on their own — no data-URI prefix, no whitespace. Keep hver chunk at eða below the chunkSizeHint raw bytes úr Begin (~48 KB). |

## Dæmi um beiðni
```json
{ "uploadId": "0f8e...-...", "sequence": 1, "contentBase64": "JVBERi0xLjQK..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Lýsing |
|---|---|---|
| `uploadId` | string (GUID) | Echo of the session id. |
| `sequence` | integer | Echo of the accepted chunk sequence. |
| `received` | integer | Total bytes accumulated across allir chunks so far. When this equals declaredSize (or the skrá size you intend), you eru done appending. |
| `chunkCount` | integer | Number of distinct chunks stored so far. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| No upload session was found fyrir the supplied uploadId | Begin a session first; a session er private to its creator og may have been committed, aborted, eða pruned. |
| The upload session er not open | It was already committed eða aborted; begin a new session. |
| Invalid base64 innihald | Gakktu úr skugga um innihaldBase64 er valid base64 með no surrounding whitespace eða data-URI prefix. |

## Notes
Send chunks in order (sequence 1, 2, 3, ...). This call er idempotent per sequence — re-sending a sequence replaces that chunk.

## Next steps
- While more chunks remain → call `Storage.Upload.Append` (increment `sequence` og send the next chunk).
- When allir chunks eru sent (to external storage) → call `Storage.Upload.Commit` (pass the same `uploadId` — requires a storageCode on the session).
- When allir chunks eru sent (to a færsla, no storage) → call `Storage.Upload.CommitToRecord` (pass the same `uploadId` + færsla address eða `target` = IncomingDocument).
- To check accumulated progress → call `Storage.Upload.Status` (pass the same `uploadId`).

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

