---
id: storage-upload-begin
title: "Storage.Upload.Begin"
sidebar_label: "Storage.Upload.Begin"
sidebar_position: 20
description: "Request and response contract for the Storage.Upload.Begin Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Opens a chunked upload session fyrir delivering a large skrá as a sequence of small chunks.

## Lýsigögn
- **Direction:** Inn á við (write)
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Upload.Begin` og the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `storageCode` | No | string | The storage tenging the skrá er written to on Storage.Upload.Commit. Sleppið to create a buffer-only session that getur aðeins be committed með Storage.Upload.CommitToRecord (attaches directly to a færsla án external storage). |
| `fileName` | **Yes** | string | File heiti of the upload, including extension. Notaðud as the leaf of the sjálfgefið slóð. |
| `path` | No | string | Full destination slóð including the skrá heiti, relative to the tenging base slóð. Overrides mappaPath. Sleppið both til notkunar the sjálfgefið `bifrost-uploads/{fileName}`. |
| `folderPath` | No | string | Destination mappa (forward-slash separated); the skrá heiti er appended automatically. Ignored þegar slóð er supplied. |
| `declaredSize` | No | integer | Expected total size in bytes. When supplied it er verified against the assembled size on commit; a mismatch fails the commit. Recommended fyrir integrity. |

## Dæmi um beiðni
```json
{ "storageCode": "BLOBTEST", "fileName": "invoice.pdf", "folderPath": "invoices/2026", "declaredSize": 212413 }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Lýsing |
|---|---|---|
| `uploadId` | string (GUID) | The session id. Sendu it as `uploadId` on every Append, Commit, Abort og Status call fyrir this upload. |
| `storageCode` | string | Echo of the resolved storage tenging. |
| `path` | string | The destination slóð the committed skrá mun be written to. |
| `chunkSizeHint` | integer | Recommended maximum RAW bytes per chunk (currently 49152). Lestu at most this many bytes per chunk, base64-enkóði that slice on its own, og send it með Append. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| No storage tenging er stillt fyrir storageCode | Resolve a valid, enabled kóði via Storage.Account.List. |

## Notes
Notaðu this þegar a skrá er too large to pass to Storage.File.Create in one call. Split the skrá í chunks of at most `chunkSizeHint` RAW bytes; base64-enkóði hver chunk INDEPENDENTLY (do not base64 the whole skrá og then slice the text — the boundaries would not dekóði). Send chunks með sequence numbers 1, 2, 3, ..., then commit. A session er private to the notandi that created it og er pruned automatically ef never committed.

## Next steps
- To send the skrá innihalds → call `Storage.Upload.Append` (pass the returned `uploadId`, `sequence` starting at 1, og one base64 chunk).
- To write the skrá to storage → call `Storage.Upload.Commit` (pass the `uploadId` — requires a storageCode on the session).
- To attach the skrá to a færsla án storage → call `Storage.Upload.CommitToRecord` (pass the `uploadId` + færsla address (tableId/no)).

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

