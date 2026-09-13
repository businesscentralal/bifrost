---
id: storage-file-create
title: "Storage.File.Create"
sidebar_label: "Storage.File.Create"
sidebar_position: 12
description: "Request and response contract for the Storage.File.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Hleður upp one small base64 skrá to a slóð. For larger skrár, use Storage.Upload.Begin/Append/Commit.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.File.Create` og the parameters below as the `data` object.
- **External File Storage operation:** `CreateFile`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `storageCode` | **Yes** | string | Stillta storage tenging til notkunar. Finndu með Storage.Account.List. |
| `path` | **Yes** | string | The destination skrá slóð (relative to the tenging base slóð). |
| `contentBase64` | **Yes** | base64 string | The complete skrá innihald, base64-enkóðid. Keep single-call uploads small; use Storage.Upload.Begin fyrir larger skrár. |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "notes/hello.txt", "contentBase64": "SGVsbG8gd29ybGQ=" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `path` og `contentLength` (the number of bytes stored).

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Invalid base64 innihald | Gakktu úr skugga um innihaldBase64 er valid base64 með no surrounding whitespace eða data-URI prefix. |
| Path fannst ekki | Create the parent mappa first með Storage.Directory.Create þar sem the connector requires it. |

## Notes
Notaðu this message tegund fyrir small skrár that fit comfortably in one Bifrost request. For predictable large-skrá uploads, use `Storage.Upload.Begin`, append chunks of at most 49152 RAW bytes hver (about 64 KB base64), then call `Storage.Upload.Commit`. Creating a skrá at an existing slóð overwrites it on connectors that support overwrite (for example Azure Blob).

## Tengdar aðgerðir
- **Upload a larger skrá in parts:** `Storage.Upload.Begin`\- **Download the skrá:** `Storage.File.Get`\- **Delete the skrá:** `Storage.File.Delete`

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

