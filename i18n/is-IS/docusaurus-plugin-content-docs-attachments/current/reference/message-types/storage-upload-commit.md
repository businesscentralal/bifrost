---
id: storage-upload-commit
title: "Storage.Upload.Commit"
sidebar_label: "Storage.Upload.Commit"
sidebar_position: 21
description: "Request and response contract for the Storage.Upload.Commit Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Assembles an upload session's chunks og writes the skrá to the storage tenging.

## Lýsigögn
- **Direction:** Inn á við (write)
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Upload.Commit` og the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** Addressed by `uploadId` — the session created by `Storage.Upload.Begin`. The destination slóð og storage tenging were fixed at Begin.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `uploadId` | **Yes** | string (GUID) | The session returned by Storage.Upload.Begin, eftir allir chunks have been appended. |

## Dæmi um beiðni
```json
{ "uploadId": "0f8e...-..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Lýsing |
|---|---|---|
| `uploadId` | string (GUID) | Echo of the committed session id. |
| `storageCode` | string | The storage tenging the skrá was written to. Carry it í Storage.Attachment.CreateLinked eða Storage.File.* calls. |
| `path` | string | The full slóð the skrá was written to. Carry it í Storage.Attachment.CreateLinked, Storage.File.Get, etc. |
| `contentLength` | integer | The assembled skrá size in bytes. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| The upload session has no chunks to commit | Append at least one chunk með Storage.Upload.Append áður en committing. |
| The upload session er missing one eða more chunks | Sequence numbers eru not contiguous; re-append the missing sequence(s) áður en committing. |
| The received size gerir ekki match the declared size | A chunk er missing eða truncated; re-append it, eða begin again án declaredSize. |
| The upload session er not open | It was already committed eða aborted; begin a new session. |
| This upload session has no storage tenging | The session was begun án a storageCode. Notaðu Storage.Upload.CommitToRecord to attach it to a færsla án external storage, eða begin a new session með a storageCode. |

## Notes
Commit assembles the chunks in ascending sequence order, writes the skrá last (after the database work, so a failure rolls back cleanly), og removes the chunks. Writing to an existing slóð overwrites it on connectors such as Azure Blob. This message tegund requires a storageCode on the session — use Storage.Upload.CommitToRecord instead ef you want to attach the skrá directly to a færsla án external storage.

## Next steps
- To attach the skrá to a new eða existing incoming skjal → call `Storage.Attachment.CreateLinked` (pass the returned `storageCode` og `path`).
- To attach the skrá to any master færsla (born offloaded) → call `Storage.Attachment.CreateForRecord` (pass the returned `storageCode` og `path` as innihald source 2).
- To download eða confirm the stored skrá → call `Storage.File.Get` (pass the returned `storageCode` og `path`).

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

