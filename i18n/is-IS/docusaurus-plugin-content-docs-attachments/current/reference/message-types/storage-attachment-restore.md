---
id: storage-attachment-restore
title: "Storage.Attachment.Restore"
sidebar_label: "Storage.Attachment.Restore"
sidebar_position: 6
description: "Request and response contract for the Storage.Attachment.Restore Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Restores an offloaded attachment's skrá úr storage back í the database og deletes the remote copy.

## Lýsigögn
- **Direction:** Inn á við (write)
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Attachment.Restore` og the parameters below as the `data` object.
- **External File Storage operation:** `GetFile`
- **Routing:** Addressed by `target` + `systemId`. The storage tenging og slóð eru read úr the attachment's offload/link færsla — no `storageCode` er needed.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `target` | **Yes** | string | Which attachment table to act on: 'IncomingDocument' eða 'DocumentAttachment'. |
| `systemId` | **Yes** | string (GUID) | The SystemId of the offloaded eða storage-linked attachment færsla to bring back í the database. |

## Dæmi um beiðni
```json
{ "target": "IncomingDocument", "systemId": "0f8e...-..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Lýsing |
|---|---|---|
| `target` | string | Echo of the target table. |
| `systemId` | string (GUID) | Echo of the restored attachment færsla. |
| `contentLength` | integer | The number of bytes written back í the database. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| The attachment er not offloaded | Only attachments með a storage link (from Offload eða CreateLinked) getur be restored. Check the `Offloaded ori` field. |
| No attachment færsla was found fyrir the supplied SystemId | Staðfestu the target table og the SystemId. |

## Notes
Works fyrir attachments produced by Storage.Attachment.Offload, Storage.Attachment.CreateLinked, og Storage.Attachment.CreateForRecord (when born offloaded úr a storage source). The storage tenging og slóð eru read úr the link færsla, so no storageCode er needed. The remote skrá er **deleted** eftir the innihald er written back to the database — restoring er destructive to the storage copy.

## Next steps
- To move the skrá back out to storage → call `Storage.Attachment.Offload` (pass the same `target` og `systemId` með a `storageCode`).
- To create a new linked attachment úr storage → call `Storage.Attachment.CreateLinked` (for incoming skjöl).
- To attach a storage skrá to any master færsla → call `Storage.Attachment.CreateForRecord` (pass `storageCode` + `path` as source 2).

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

