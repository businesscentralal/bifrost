---
id: storage-attachment-restore
title: "Storage.Attachment.Restore"
sidebar_label: "Storage.Attachment.Restore"
sidebar_position: 6
description: "Request and response contract for the Storage.Attachment.Restore Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Restores an offloaded attachment's file from storage back into the database and deletes the remote copy.

## Metadata
- **Direction:** Inbound (write)
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Attachment.Restore` and the parameters below as the `data` object.
- **External File Storage operation:** `GetFile`
- **Routing:** Addressed by `target` + `systemId`. The storage connection and path are read from the attachment's offload/link record — no `storageCode` is needed.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `target` | **Yes** | string | Which attachment table to act on: 'IncomingDocument' or 'DocumentAttachment'. |
| `systemId` | **Yes** | string (GUID) | The SystemId of the offloaded or storage-linked attachment record to bring back into the database. |

## Request example
```json
{ "target": "IncomingDocument", "systemId": "0f8e...-..." }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `target` | string | Echo of the target table. |
| `systemId` | string (GUID) | Echo of the restored attachment record. |
| `contentLength` | integer | The number of bytes written back into the database. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| The attachment is not offloaded | Only attachments with a storage link (from Offload or CreateLinked) can be restored. Check the `Offloaded ori` field. |
| No attachment record was found for the supplied SystemId | Verify the target table and the SystemId. |

## Notes
Works for attachments produced by Storage.Attachment.Offload, Storage.Attachment.CreateLinked, and Storage.Attachment.CreateForRecord (when born offloaded from a storage source). The storage connection and path are read from the link record, so no storageCode is needed. The remote file is **deleted** after the content is written back to the database — restoring is destructive to the storage copy.

## Next steps
- To move the file back out to storage → call `Storage.Attachment.Offload` (pass the same `target` and `systemId` with a `storageCode`).
- To create a new linked attachment from storage → call `Storage.Attachment.CreateLinked` (for incoming documents).
- To attach a storage file to any master record → call `Storage.Attachment.CreateForRecord` (pass `storageCode` + `path` as source 2).

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

