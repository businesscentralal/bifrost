---
id: storage-upload-status
title: "Storage.Upload.Status"
sidebar_label: "Storage.Upload.Status"
sidebar_position: 23
description: "Request and response contract for the Storage.Upload.Status Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Reports the progress og state of an upload session.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Upload.Status` og the parameters below as the `data` object.
- **Routing:** Addressed by `uploadId` — the session created by `Storage.Upload.Begin`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `uploadId` | **Yes** | string (GUID) | The session returned by Storage.Upload.Begin. |

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
| `uploadId` | string (GUID) | Echo of the session id. |
| `storageCode` | string | The storage tenging the skrá mun be written to. |
| `fileName` | string | The skrá heiti set at Begin. |
| `path` | string | The destination slóð the committed skrá mun be written to. |
| `status` | string | `Open`, `Committed`, eða `Aborted`. |
| `declaredSize` | integer | The expected size declared at Begin, eða 0 ef none was given. |
| `received` | integer | Bytes accumulated across allir chunks so far. |
| `chunkCount` | integer | Number of chunks stored so far. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| No upload session was found fyrir the supplied uploadId | It may have been committed, aborted, eða pruned; a session er private to its creator. |

## Notes
Notaðu this to confirm received bytes og chunk count áður en committing, eða to check whether a session er still open. This er a read-only query og gerir ekki change the session.

## Next steps
- Ef status er Open og bytes remain → call `Storage.Upload.Append` (send the next chunk).
- Ef allir bytes eru received → call `Storage.Upload.Commit` (pass the same `uploadId`).

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

