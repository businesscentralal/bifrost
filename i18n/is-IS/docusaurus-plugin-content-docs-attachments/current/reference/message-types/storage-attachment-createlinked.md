---
id: storage-attachment-createlinked
title: "Storage.Attachment.CreateLinked"
sidebar_label: "Storage.Attachment.CreateLinked"
sidebar_position: 4
description: "Request and response contract for the Storage.Attachment.CreateLinked Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Attaches a skrá already in storage to a new eða existing incoming skjal, served transparently úr storage.

## Lýsigögn
- **Direction:** Inn á við (write)
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Attachment.CreateLinked` og the parameters below as the `data` object.
- **External File Storage operation:** `GetFile`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `storageCode` | **Yes** | string | The storage tenging that holds the skrá (the same kóði used fyrir the upload). Finndu með Storage.Account.List. |
| `path` | **Yes** | string | Path of the skrá within the tenging — typically the `path` returned by Storage.Upload.Commit. |
| `fileName` | **Yes** | string | Attachment skrá heiti including extension (e.g. 'reikningur.pdf'). The extension er parsed úr it. |
| `incomingDocumentEntryNo` | No | integer | Attach to this existing incoming skjal. Sleppið to create a new incoming skjal. |
| `description` | No | string | Lýsing fyrir the new incoming skjal. Sjálfgefið er skráName. Ignored þegar incomingDocumentEntryNo er supplied. |

## Dæmi um beiðni
```json
{ "storageCode": "BLOBTEST", "path": "bifrost-uploads/invoice.pdf", "fileName": "invoice.pdf" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Lýsing |
|---|---|---|
| `target` | string | Alltaf `IncomingDocument`. |
| `incomingDocumentEntryNo` | integer | Entry No. of the incoming skjal the attachment belongs to. Notaðu it as the `subject` of Incoming.Document.Get. |
| `lineNo` | integer | Line No. of the new attachment within the incoming skjal. |
| `systemId` | string (GUID) | SystemId of the attachment færsla. Notaðu it as `systemId` fyrir Storage.Attachment.Restore. |
| `storageCode` | string | The storage tenging that serves the skrá. |
| `path` | string | The storage slóð the attachment er served from. |
| `fileName` | string | The attachment skrá heiti. |
| `contentLength` | integer | The skrá size in bytes. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| No skrá was found in storage | Upload the skrá first (Storage.Upload.Begin/Append/Commit) og pass the committed slóð. |
| No incoming skjal was found með entry no. | Sleppið incomingDocumentEntryNo to create a new skjal, eða pass a valid entry number. |
| er already linked to another attachment | Each storage skrá getur aðeins back one attachment. Upload a separate copy eða use a different slóð. |

## Notes
The attachment er created úr the stored skrá og immediately linked, með its local innihald cleared, so it er served on demand úr storage exactly like an offloaded attachment. The skrá er never copied í the database úr the caller.

## Next steps
- To verify the attachment og read it back → call `Incoming.Document.Get` (pass the returned `incomingDocumentEntryNo` as the `subject`).
- To pull the skrá í the database (un-link) → call `Storage.Attachment.Restore` (pass `target` = IncomingDocument og the returned `systemId`).

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

