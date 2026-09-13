---
id: storage-file-get
title: "Storage.File.Get"
sidebar_label: "Storage.File.Get"
sidebar_position: 15
description: "Request and response contract for the Storage.File.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Sækir a skrá úr the stillt storage tenging og returns its innihald as base64.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.File.Get` og the parameters below as the `data` object.
- **External File Storage operation:** `GetFile`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `storageCode` | **Yes** | string | Stillta storage tenging til notkunar. Finndu með Storage.Account.List. |
| `path` | **Yes** | string | The skrá slóð to download (relative to the tenging base slóð). |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026/INV-001.pdf" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `path`, `contentLength` (bytes) og `contentBase64` (the skrá innihald).

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| File fannst ekki | Staðfestu the skrá er til með Storage.File.Exists eða list the mappa með Storage.File.List. |

## Notes
The innihald er base64-enkóðid. Dekóði `contentBase64` to recover the original bytes.

## Tengdar aðgerðir
- **Upload a skrá:** `Storage.File.Create`\- **Check existence:** `Storage.File.Exists`

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

