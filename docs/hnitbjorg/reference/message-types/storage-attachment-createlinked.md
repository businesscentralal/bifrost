---
id: storage-attachment-createlinked
title: "Storage.Attachment.CreateLinked"
sidebar_label: "Storage.Attachment.CreateLinked"
sidebar_position: 4
description: "Request and response contract for the Storage.Attachment.CreateLinked Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Attaches a file already in storage to a new or existing incoming document, served transparently from storage.

## Metadata
- **Direction:** Inbound (write)
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Attachment.CreateLinked` and the parameters below as the `data` object.
- **External File Storage operation:** `GetFile`
- **Routing:** The request's `storageCode` selects a `Bifrost Storage Setup` row; the action runs against that row's file account. Discover codes with `Storage.Account.List`.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `storageCode` | **Yes** | string | The storage connection that holds the file (the same code used for the upload). Resolve via Storage.Account.List. |
| `path` | **Yes** | string | Path of the file within the connection — typically the `path` returned by Storage.Upload.Commit. |
| `fileName` | **Yes** | string | Attachment file name including extension (e.g. 'invoice.pdf'). The extension is parsed from it. |
| `incomingDocumentEntryNo` | No | integer | Attach to this existing incoming document. Omit to create a new incoming document. |
| `description` | No | string | Description for the new incoming document. Defaults to fileName. Ignored when incomingDocumentEntryNo is supplied. |

## Request example
```json
{ "storageCode": "BLOBTEST", "path": "bifrost-uploads/invoice.pdf", "fileName": "invoice.pdf" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `target` | string | Always `IncomingDocument`. |
| `incomingDocumentEntryNo` | integer | Entry No. of the incoming document the attachment belongs to. Use it as the `subject` of Incoming.Document.Get. |
| `lineNo` | integer | Line No. of the new attachment within the incoming document. |
| `systemId` | string (GUID) | SystemId of the attachment record. Use it as `systemId` for Storage.Attachment.Restore. |
| `storageCode` | string | The storage connection that serves the file. |
| `path` | string | The storage path the attachment is served from. |
| `fileName` | string | The attachment file name. |
| `contentLength` | integer | The file size in bytes. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| No file was found in storage | Upload the file first (Storage.Upload.Begin/Append/Commit) and pass the committed path. |
| No incoming document was found with entry no. | Omit incomingDocumentEntryNo to create a new document, or pass a valid entry number. |
| is already linked to another attachment | Each storage file can only back one attachment. Upload a separate copy or use a different path. |

## Notes
The attachment is created from the stored file and immediately linked, with its local content cleared, so it is served on demand from storage exactly like an offloaded attachment. The file is never copied into the database from the caller.

## Next steps
- To verify the attachment and read it back → call `Incoming.Document.Get` (pass the returned `incomingDocumentEntryNo` as the `subject`).
- To pull the file into the database (un-link) → call `Storage.Attachment.Restore` (pass `target` = IncomingDocument and the returned `systemId`).

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

