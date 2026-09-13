---
id: storage-file-move
title: "Storage.File.Move"
sidebar_label: "Storage.File.Move"
sidebar_position: 17
description: "Request and response contract for the Storage.File.Move Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Flytur a skrá within the stillt storage tenging.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.File.Move` og the parameters below as the `data` object.
- **External File Storage operation:** `MoveFile`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `storageCode` | **Yes** | string | Stillta storage tenging til notkunar. Finndu með Storage.Account.List. |
| `sourcePath` | **Yes** | string | The skrá to move (relative to the tenging base slóð). |
| `targetPath` | **Yes** | string | The destination slóð fyrir the moved skrá. |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "sourcePath": "in/a.txt", "targetPath": "done/a.txt" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur the `sourcePath` og `targetPath`.

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Source fannst ekki | Staðfestu the source skrá er til með Storage.File.Exists. |

## Tengdar aðgerðir
- **Copy instead of move:** `Storage.File.Copy`

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

