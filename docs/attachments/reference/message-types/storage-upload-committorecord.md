---
id: storage-upload-committorecord
title: "Storage.Upload.CommitToRecord"
sidebar_label: "Storage.Upload.CommitToRecord"
sidebar_position: 22
description: "Request and response contract for the Storage.Upload.CommitToRecord Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Assembles uploaded chunks and attaches the file directly to a record without external storage.

## Metadata
- **Direction:** Inbound (write)
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Upload.CommitToRecord` and the parameters below as the `data` object.
- **Routing:** Addressed by `uploadId` from a prior `Storage.Upload.Begin`. Set `target` to choose the attachment type. For DocumentAttachment (default), address the record with `tableId`/`tableName` plus `recordSystemId` or `no`. For IncomingDocument, optionally supply `incomingDocumentEntryNo`. No `storageCode` is needed.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `uploadId` | **Yes** | string (GUID) | The session returned by Storage.Upload.Begin. |
| `target` | No | string | 'DocumentAttachment' (default) or 'IncomingDocument'. Controls which attachment table the file is written to. |
| `tableId` | No | integer | DocumentAttachment: table the attachment belongs to. 18 = Customer, 23 = Vendor, 36 = Sales Header (use recordSystemId), 112 = Sales Invoice Header, 5600 = Fixed Asset, etc. |
| `tableName` | No | string | DocumentAttachment: table name instead of tableId. |
| `recordSystemId` | No | string (GUID) | DocumentAttachment: SystemId of the record. Required for tables with composite keys (sales/purchase documents). |
| `no` | No | string | DocumentAttachment: primary key of the record. Only for single Code key tables. |
| `incomingDocumentEntryNo` | No | integer | IncomingDocument: attach to this existing incoming document. Omit to create a new one. |
| `description` | No | string | IncomingDocument: description for a new incoming document. Defaults to fileName. |
| `fileName` | No | string | Overrides the file name from Begin. If omitted, the session's original fileName is used. |

## Request example
```json
// Attach to a customer (DocumentAttachment, default):\{ "uploadId": "0f8e...", "tableId": 18, "no": "10000" }\\// Attach to a sales quote by SystemId:\{ "uploadId": "0f8e...", "tableId": 36, "recordSystemId": "04df3c11-..." }\\// Create as incoming document:\{ "uploadId": "0f8e...", "target": "IncomingDocument", "description": "Scanned invoice" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `target` | string | `DocumentAttachment` or `IncomingDocument`. |
| `tableId` | integer | DocumentAttachment: the table the attachment was created on. |
| `no` | string | DocumentAttachment: the record key. |
| `incomingDocumentEntryNo` | integer | IncomingDocument: entry no. of the incoming document. |
| `systemId` | string (GUID) | SystemId of the new attachment. |
| `fileName` | string | The final attachment file name. |
| `contentLength` | integer | The file size in bytes. |
| `offloaded` | boolean | Always false — content is stored in the database. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| No upload session was found | Begin a session first with Storage.Upload.Begin. |
| The upload session is not open | It was already committed or aborted; begin a new session. |
| No record was found in table | DocumentAttachment: the host record must exist. |
| Unknown target | Use 'DocumentAttachment' or 'IncomingDocument'. |

## Notes
The storage-free alternative to Storage.Upload.Commit. Chunks are assembled and written directly into the database — no external storage connection is needed. Begin the session with or without a `storageCode`; omitting it creates a buffer-only session.\\### Workflow\1. `Storage.Upload.Begin` with `fileName` (storageCode is optional).\2. `Storage.Upload.Append` once per chunk.\3. `Storage.Upload.CommitToRecord` with `uploadId` + target + record address.\\### Target differences\- **DocumentAttachment** (default): requires `tableId`/`tableName` + `no`/`recordSystemId`. Works for master records (Customer, Vendor, FA) and documents (Sales Header via recordSystemId, Posted Sales Invoice via no).\- **IncomingDocument**: creates or reuses an incoming document. Optionally pass `incomingDocumentEntryNo` to attach to an existing one.

## Next steps
- To offload the attachment to storage later → call `Storage.Attachment.Offload` (pass the returned `target` and `systemId`).

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

