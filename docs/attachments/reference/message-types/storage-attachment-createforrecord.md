---
id: storage-attachment-createforrecord
title: "Storage.Attachment.CreateForRecord"
sidebar_label: "Storage.Attachment.CreateForRecord"
sidebar_position: 3
description: "Request and response contract for the Storage.Attachment.CreateForRecord Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates a document attachment on any record - customer, vendor, fixed asset, document - from base64, from storage, or by copying an existing attachment.

## Metadata
- **Direction:** Inbound (write)
- **Content-Type:** text/json
- **Invoke:** call the `call_message_type` tool with `type` = `Storage.Attachment.CreateForRecord` and the parameters below as the `data` object.
- **External File Storage operation:** `GetFile`
- **Routing:** The record is addressed with `tableId`/`tableName` plus `recordSystemId` or `no`. A `storageCode` is needed only when the content source is a file in storage.

## Parameters

| Parameter | Required | Type | Description |
|---|---|---|---|
| `tableId` | No | integer | Table the attachment belongs to. Supply this or tableName. Common values: 18 = Customer, 23 = Vendor, 27 = Item, 156 = Resource, 270 = Bank Account, 5050 = Contact, 5200 = Employee, 5600 = Fixed Asset, 167 = Job, 15 = G/L Account. |
| `tableName` | No | string | Table name instead of tableId, e.g. 'Fixed Asset', 'Customer', 'Bank Account'. Case-insensitive match against the BC object name. |
| `recordSystemId` | No | string (GUID) | SystemId of the record to attach to. Works for every table, including those with composite primary keys. Supply this or no. |
| `no` | No | string | Primary key value of the record (e.g. '10000' for a customer, 'FA000010' for a fixed asset). Only works for tables whose primary key is a single Code or Text field of 20 characters or less. Use recordSystemId for document tables and any table with a composite or integer key. |
| `fileName` | No | string | File name including extension, e.g. 'contract.pdf'. Required unless copying from an existing attachment that already carries a name. |
| `content` | No | base64 string | Content source 1: the file itself, base64-encoded inline. The content is stored in the BC database. Use for small files. |
| `storageCode` | No | string | Content source 2 (with path): references a file already in storage. The attachment is born offloaded — content stays in storage and is served transparently. Use for files delivered via Storage.Upload.Commit. |
| `path` | No | string | Required with storageCode. Path of the file within the storage connection — typically the `path` returned by Storage.Upload.Commit. Each path can only be linked to one attachment. |
| `sourceTarget` | No | string | Content source 3 (with sourceSystemId): copies content from an existing BC attachment. Value is 'IncomingDocument' or 'DocumentAttachment'. |
| `sourceSystemId` | No | string (GUID) | SystemId of the existing attachment to copy content from. The content is duplicated server-side — nothing crosses the wire. |

## Request example
```json
// Source 1 — inline base64 on a customer:\{ "tableId": 18, "no": "10000", "fileName": "contract.txt", "content": "SGVsbG8=" }\\// Source 2 — from storage (born offloaded) on a fixed asset:\{ "tableName": "Fixed Asset", "no": "FA000010", "fileName": "deed.pdf", "storageCode": "ARCHIVE", "path": "uploads/deed.pdf" }\\// Source 3 — copy from an existing incoming document attachment to a vendor:\{ "tableId": 23, "no": "20000", "sourceTarget": "IncomingDocument", "sourceSystemId": "e4a2..." }\\// Addressing by SystemId (works for any table):\{ "tableId": 18, "recordSystemId": "b2ae4a05-...", "fileName": "note.txt", "content": "SGVsbG8=" }
```

## Response
Success:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Description |
|---|---|---|
| `target` | string | Always `DocumentAttachment`. |
| `tableId` | integer | The table the attachment was created on. |
| `no` | string | The record key the attachment hangs on. |
| `documentType` | string | The document type the base application derived from the record. |
| `lineNo` | integer | The line number the base application derived from the record. |
| `attachmentId` | integer | The attachment's ID within the record's attachment list. |
| `systemId` | string (GUID) | SystemId of the new attachment. Pass to Storage.Attachment.Offload or Restore. |
| `fileName` | string | The final attachment file name (may be deduplicated, e.g. 'deed1.pdf'). |
| `contentLength` | integer | The file size in bytes. |
| `offloaded` | boolean | True when content stayed in storage (source 2). False for inline or copy sources. |
| `storageCode` | string | Present only when offloaded. The storage connection serving the file. |
| `path` | string | Present only when offloaded. The storage path of the file. |

Failure (the framework wraps any raised error):
```json
{ "status": "Error", "error": "<message>" }
```
Always branch on `status` before reading `data`.

## Common errors

| Error | Resolution |
|---|---|
| Supply exactly one content source | Send content, or storageCode with path, or sourceTarget with sourceSystemId — never combine two sources in the same request. |
| No record was found in table | The host record must exist before attaching. Check tableId and no/recordSystemId. |
| has a composite primary key | The table has more than one key field. Address the record with recordSystemId instead of no. |
| is not a code or text field | The primary key is an Integer or other non-text type. Use recordSystemId. |
| does not know which field identifies a record | The table is not in the set BC can key an attachment to. This connector widens that set to all tables with a single Code key; others need a subscriber on Document Attachment Mgmt.OnAfterTableHasNumberFieldPrimaryKey. |
| is longer than the 20 characters | The record identifier exceeds the 20-character limit of Document Attachment.No. |
| is already linked to another attachment | Each storage file can only back one attachment. Upload a separate copy or use a different path. |

## Notes
Document type and line number are derived from the host record — never supply them. File names are deduplicated within a record: two files named 'deed.pdf' become 'deed.pdf' and 'deed1.pdf'. With the storage source (source 2) the local content is cleared and a link is recorded, so the file is served on demand — the same state as Offload produces.\\### Supported tables\\The base application natively supports: Customer (18), Vendor (23), Item (27), Employee (5200), Fixed Asset (5600), Job (167), Resource (156), and the standard Sales/Purchase document tables. This connector widens that set to **every table whose primary key is a single Code field of 20 characters or less** — including G/L Account (15), Bank Account (270), Contact (5050), Location (14), and any extension table with the same shape. For tables outside this set, use recordSystemId (always works for addressing) — but note that the base application must still be able to derive a key for the Document Attachment row.

## Next steps
- To deliver a large file first → call `Storage.Upload.Begin` (then Append and Commit, and pass the committed `path` + `storageCode` here as source 2).
- To move inline content out of the database later → call `Storage.Attachment.Offload` (pass `target` = DocumentAttachment and the returned `systemId`).
- To pull offloaded content back into the database → call `Storage.Attachment.Restore` (pass `target` = DocumentAttachment and the returned `systemId`).

---
Connector overview and the list of configured connections: request help for `Help.Storage.Get` and call `Storage.Account.List`.

