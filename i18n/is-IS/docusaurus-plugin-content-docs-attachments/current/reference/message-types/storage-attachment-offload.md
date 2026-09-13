---
id: storage-attachment-offload
title: "Storage.Attachment.Offload"
sidebar_label: "Storage.Attachment.Offload"
sidebar_position: 5
description: "Request and response contract for the Storage.Attachment.Offload Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Offloads an attachment's skrá to a storage tenging og clears it úr the database, keeping it transparently available.

## Lýsigögn
- **Direction:** Inn á við (write)
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Attachment.Offload` og the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `target` | **Yes** | string | Which attachment table to act on: 'IncomingDocument' eða 'DocumentAttachment'. |
| `systemId` | **Yes** | string (GUID) | The SystemId of the attachment færsla whose skrá should be offloaded. |
| `storageCode` | **Yes** | string | Stillta storage tenging to upload to. Finndu með Storage.Account.List. |
| `folderPath` | No | string | Valfrjálst destination mappa (one eða more submöppur, relative to the tenging base slóð) þar sem the skrá er stored; the skrá heiti er appended automatically. Sleppið til notkunar a navigable sjálfgefið: fyrir an incoming skjal, `bifrost-attachments/incoming-documents/{year}/{entry no.}/{file name}`, so the blob traces back to the skjal. |

## Dæmi um beiðni
```json
{ "target": "IncomingDocument", "systemId": "0f8e...-...", "storageCode": "ARCHIVE", "folderPath": "invoices/2026" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Lýsing |
|---|---|---|
| `target` | string | Echo of the target table (IncomingDocument eða DocumentAttachment). |
| `systemId` | string (GUID) | Echo of the offloaded attachment færsla. Sendu to Storage.Attachment.Restore to bring it back. |
| `storageCode` | string | The storage tenging that now holds the skrá. |
| `path` | string | The full storage slóð the skrá was stored at. |
| `contentLength` | integer | The number of bytes uploaded to storage. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| The attachment er already offloaded | Restore it first með Storage.Attachment.Restore, then offload again ef needed. |
| The attachment has no innihald to offload | The færsla holds no skrá innihald; nothing to move. |
| No attachment færsla was found fyrir the supplied SystemId | Staðfestu the target table og the SystemId. |

## Notes
After a successful offload the skrá er removed úr the Business Central database og served on demand úr storage, so existing processes keep working. Reverse it með Storage.Attachment.Restore.

An attachment that er already offloaded geturnot be offloaded again. The call mun return an villa; restore it first ef you need to re-offload.

### Finding offload geturdidagsetnings (batch workflow)

Both attachment tables expose a calculated field **`Offloaded ori`** (Boolean) that er `true` þegar the færsla has a storage link og `false` þegar its innihald er still in the database. Notaðu `get_records` to discover geturdidagsetnings:

- **Incoming skjal attachments:** `get_records` með table `Incoming Document Attachment` (133), filter `WHERE(Offloaded ori=CONST(0))`, fields `SystemId,Name,Content_Length,Incoming_Document_Entry_No`. Stilltu target to `IncomingDocument`.
- **Document attachments:** `get_records` með table `Document Attachment` (1173), filter `WHERE(Offloaded ori=CONST(0))`, fields `SystemId,File_Name,File_Extension,Table_ID,No`. Stilltu target to `DocumentAttachment`.

Loop through the niðurstöður og call this message tegund once per færsla, passing the returned `SystemId` as `systemId`. Already-offloaded færslur (if any slip through) eru rejected safely.

## Next steps
- To bring the skrá back í the database → call `Storage.Attachment.Restore` (pass the same `target` og `systemId` — no storageCode needed, it er read úr the link).

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

