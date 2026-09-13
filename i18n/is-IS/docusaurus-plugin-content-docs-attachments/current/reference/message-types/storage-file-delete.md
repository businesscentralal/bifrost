---
id: storage-file-delete
title: "Storage.File.Delete"
sidebar_label: "Storage.File.Delete"
sidebar_position: 13
description: "Request and response contract for the Storage.File.Delete Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Eyðir a skrá úr the stillt storage tenging.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.File.Delete` og the parameters below as the `data` object.
- **External File Storage operation:** `DeleteFile`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `storageCode` | **Yes** | string | Stillta storage tenging til notkunar. Finndu með Storage.Account.List. |
| `path` | **Yes** | string | The skrá slóð to delete (relative to the tenging base slóð). |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "notes/hello.txt" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur the deleted `path`.

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| File fannst ekki | Staðfestu the skrá er til með Storage.File.Exists. |

## Tengdar aðgerðir
- **Check existence first:** `Storage.File.Exists`

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

