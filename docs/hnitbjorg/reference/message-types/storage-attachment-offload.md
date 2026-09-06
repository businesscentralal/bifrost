---
id: storage-attachment-offload
title: "Storage.Attachment.Offload"
sidebar_label: "Storage.Attachment.Offload"
sidebar_position: 5
description: "Request and response contract for the Storage.Attachment.Offload Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Offloads an attachment's file to a storage connection and clears it from the database, keeping it transparently available.

## Metadata
- **Direction:** Inbound (write)
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Attachment.Offload` and the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `target` | **Yes** | string | Which attachment table to act on: 'IncomingDocument' or 'DocumentAttachment'. |
| `systemId` | **Yes** | string (GUID) | The SystemId of the attachment record whose file should be offloaded. |
| `storageCode` | **Yes** | string | The configured storage connection to upload to. Resolve via Storage.Account.List. |
| `folderPath` | No | string | Optional destination folder (one or more subfolders, relative to the connection base path) where the file is stored; the file name is appended automatically. Omit to use a navigable default: for an incoming document, `bifrost-attachments/incoming-documents/{year}/{entry no.}/{file name}`, so the blob traces back to the document. |

## Request example
```json
{ "target": "IncomingDocument", "systemId": "0f8e...-...", "storageCode": "ARCHIVE", "folderPath": "invoices/2026" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `target` | string | Echo of the target table (IncomingDocument or DocumentAttachment). |
| `systemId` | string (GUID) | Echo of the offloaded attachment record. Pass to Storage.Attachment.Restore to bring it back. |
| `storageCode` | string | The storage connection that now holds the file. |
| `path` | string | The full storage path the file was stored at. |
| `contentLength` | integer | The number of bytes uploaded to storage. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| The attachment is already offloaded | Restore it first with Storage.Attachment.Restore, then offload again if needed. |
| The attachment has no content to offload | The record holds no file content; nothing to move. |
| No attachment record was found for the supplied SystemId | Verify the target table and the SystemId. |

## Notes
After a successful offload the file is removed from the Business Central database and served on demand from storage, so existing processes keep working. Reverse it with Storage.Attachment.Restore.

An attachment that is already offloaded cannot be offloaded again. The call will return an error; restore it first if you need to re-offload.

### Finding offload candidates (batch workflow)

Both attachment tables expose a calculated field **`Offloaded ori`** (Boolean) that is `true` when the record has a storage link and `false` when its content is still in the database. Use `get_records` to discover candidates:

- **Incoming document attachments:** `get_records` with table `Incoming Document Attachment` (133), filter `WHERE(Offloaded ori=CONST(0))`, fields `SystemId,Name,Content_Length,Incoming_Document_Entry_No`. Set target to `IncomingDocument`.
- **Document attachments:** `get_records` with table `Document Attachment` (1173), filter `WHERE(Offloaded ori=CONST(0))`, fields `SystemId,File_Name,File_Extension,Table_ID,No`. Set target to `DocumentAttachment`.

Loop through the results and call this message type once per record, passing the returned `SystemId` as `systemId`. Already-offloaded records (if any slip through) are rejected safely.

## Next steps
- To bring the file back into the database → call `Storage.Attachment.Restore` (pass the same `target` and `systemId` — no storageCode needed, it is read from the link).

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

