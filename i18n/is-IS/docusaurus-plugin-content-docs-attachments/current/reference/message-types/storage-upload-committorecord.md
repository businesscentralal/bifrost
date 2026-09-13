---
id: storage-upload-committorecord
title: "Storage.Upload.CommitToRecord"
sidebar_label: "Storage.Upload.CommitToRecord"
sidebar_position: 22
description: "Request and response contract for the Storage.Upload.CommitToRecord Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Assembles uploaded chunks og attaches the skrá directly to a færsla án external storage.

## Lýsigögn
- **Direction:** Inn á við (write)
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Upload.CommitToRecord` og the parameters below as the `data` object.
- **Routing:** Addressed by `uploadId` úr a prior `Storage.Upload.Begin`. Stilltu `target` to choose the attachment tegund. For DocumentAttachment (sjálfgefið), address the færsla með `tableId`/`tableName` plus `recordSystemId` eða `no`. For IncomingDocument, optionally supply `incomingDocumentEntryNo`. No `storageCode` er needed.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `uploadId` | **Yes** | string (GUID) | The session returned by Storage.Upload.Begin. |
| `target` | No | string | 'DocumentAttachment' (sjálfgefið) eða 'IncomingDocument'. Controls which attachment table the skrá er written to. |
| `tableId` | No | integer | DocumentAttachment: table the attachment belongs to. 18 = Customer, 23 = Vendor, 36 = Sales Header (use færslaSystemId), 112 = Sales Invoice Header, 5600 = Fixed Asset, etc. |
| `tableName` | No | string | DocumentAttachment: table heiti instead of tableId. |
| `recordSystemId` | No | string (GUID) | DocumentAttachment: SystemId of the færsla. Nauðsynlegt fyrir tables með composite keys (sales/purchase skjöl). |
| `no` | No | string | DocumentAttachment: primary key of the færsla. Only fyrir single Code key tables. |
| `incomingDocumentEntryNo` | No | integer | IncomingDocument: attach to this existing incoming skjal. Sleppið to create a new one. |
| `description` | No | string | IncomingDocument: description fyrir a new incoming skjal. Sjálfgefið er skráName. |
| `fileName` | No | string | Overrides the skrá heiti úr Begin. Ef omitted, the session's original skráName er used. |

## Dæmi um beiðni
```json
// Attach to a customer (DocumentAttachment, default):\{ "uploadId": "0f8e...", "tableId": 18, "no": "10000" }\\// Attach to a sales quote by SystemId:\{ "uploadId": "0f8e...", "tableId": 36, "recordSystemId": "04df3c11-..." }\\// Create as incoming document:\{ "uploadId": "0f8e...", "target": "IncomingDocument", "description": "Scanned invoice" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Lýsing |
|---|---|---|
| `target` | string | `DocumentAttachment` eða `IncomingDocument`. |
| `tableId` | integer | DocumentAttachment: the table the attachment was created on. |
| `no` | string | DocumentAttachment: the færsla key. |
| `incomingDocumentEntryNo` | integer | IncomingDocument: entry no. of the incoming skjal. |
| `systemId` | string (GUID) | SystemId of the new attachment. |
| `fileName` | string | The final attachment skrá heiti. |
| `contentLength` | integer | The skrá size in bytes. |
| `offloaded` | boolean | Alltaf false — innihald er stored in the database. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| No upload session was found | Begin a session first með Storage.Upload.Begin. |
| The upload session er not open | It was already committed eða aborted; begin a new session. |
| No færsla was found in table | DocumentAttachment: the host færsla verður exist. |
| Unknown target | Notaðu 'DocumentAttachment' eða 'IncomingDocument'. |

## Notes
The storage-free alternative to Storage.Upload.Commit. Chunks eru assembled og written directly í the database — no external storage tenging er needed. Begin the session með eða án a `storageCode`; omitting it creates a buffer-only session.\\### Workflow\1. `Storage.Upload.Begin` með `fileName` (storageCode er optional).\2. `Storage.Upload.Append` once per chunk.\3. `Storage.Upload.CommitToRecord` með `uploadId` + target + færsla address.\\### Target differences\- **DocumentAttachment** (sjálfgefið): requires `tableId`/`tableName` + `no`/`recordSystemId`. Works fyrir master færslur (Customer, Vendor, FA) og skjöl (Sales Header via færslaSystemId, Posted Sales Invoice via no).\- **IncomingDocument**: creates eða reuses an incoming skjal. Valfrjálstly pass `incomingDocumentEntryNo` to attach to an existing one.

## Next steps
- To offload the attachment to storage later → call `Storage.Attachment.Offload` (pass the returned `target` og `systemId`).

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

