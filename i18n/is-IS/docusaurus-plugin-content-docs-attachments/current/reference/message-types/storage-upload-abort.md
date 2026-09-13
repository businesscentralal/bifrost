---
id: storage-upload-abort
title: "Storage.Upload.Abort"
sidebar_label: "Storage.Upload.Abort"
sidebar_position: 18
description: "Request and response contract for the Storage.Upload.Abort Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Discards an open upload session og allir its chunks án writing to storage.

## Lýsigögn
- **Direction:** Inn á við (write)
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Upload.Abort` og the parameters below as the `data` object.
- **Routing:** Addressed by `uploadId` — the session created by `Storage.Upload.Begin`. Touches no storage.

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
| `uploadId` | string (GUID) | Echo of the discarded session id. |
| `status` | string | Alltaf `Aborted` on success. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| No upload session was found fyrir the supplied uploadId | It may have already been committed, aborted, eða pruned; a session er private to its creator. |
| The upload session er not open | Only an open session getur be aborted; a committed upload er already stored. |

## Notes
Aborting deletes the session og its chunks úr the database. It gerir ekki touch storage, because nothing has been written there yet. Uncommitted sessions eru also pruned automatically by a retention policy, so aborting er optional.

## Next steps
- To start a fresh upload → call `Storage.Upload.Begin`.

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

