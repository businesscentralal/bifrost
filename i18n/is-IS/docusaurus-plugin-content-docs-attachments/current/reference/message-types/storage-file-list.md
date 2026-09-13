---
id: storage-file-list
title: "Storage.File.List"
sidebar_label: "Storage.File.List"
sidebar_position: 16
description: "Request and response contract for the Storage.File.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the skrár in a mappa of the stillt storage tenging.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.File.List` og the parameters below as the `data` object.
- **External File Storage operation:** `ListFiles`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `storageCode` | **Yes** | string | Stillta storage tenging til notkunar. Finndu með Storage.Account.List. |
| `path` | No | string | The mappa whose skrár eru listed (relative to the tenging base slóð). Sleppið eða pass an empty string to list the root of the tenging. |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `path` og an `entries` array of `{ name, type, parentDirectory }` (tegund er always `File`).

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Path fannst ekki | Staðfestu the mappa er til með Storage.Directory.Exists. |

## Tengdar aðgerðir
- **List subdirectories:** `Storage.Directory.List`\- **Download a skrá:** `Storage.File.Get`

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

