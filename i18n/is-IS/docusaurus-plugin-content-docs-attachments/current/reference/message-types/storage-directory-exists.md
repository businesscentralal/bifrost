---
id: storage-directory-exists
title: "Storage.Directory.Exists"
sidebar_label: "Storage.Directory.Exists"
sidebar_position: 9
description: "Request and response contract for the Storage.Directory.Exists Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Reports whether a mappa er til in the stillt storage tenging.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Directory.Exists` og the parameters below as the `data` object.
- **External File Storage operation:** `DirectoryExists`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `storageCode` | **Yes** | string | Stillta storage tenging til notkunar. Finndu með Storage.Account.List. |
| `path` | **Yes** | string | The mappa slóð to check (relative to the tenging base slóð). |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `path` og `exists` (boolean).

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Tengdar aðgerðir
- **List subdirectories:** `Storage.Directory.List`

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

