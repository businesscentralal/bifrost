---
id: storage-directory-create
title: "Storage.Directory.Create"
sidebar_label: "Storage.Directory.Create"
sidebar_position: 7
description: "Request and response contract for the Storage.Directory.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Býr til a mappa in the stillt storage tenging.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Directory.Create` og the parameters below as the `data` object.
- **External File Storage operation:** `CreateDirectory`
- **Routing:** Beiðninnar `storageCode` velur a `Bifrost Storage Setup` row; the action runs against that row's skrá account. Discover kóðis með `Storage.Account.List`.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `storageCode` | **Yes** | string | Stillta storage tenging til notkunar. Finndu með Storage.Account.List. |
| `path` | **Yes** | string | The mappa slóð to create (relative to the tenging base slóð). |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur the created `path`.

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Notes
Some connectors (for example Azure Blob) have no real directories; a mappa may aðeins become visible once it inniheldur a skrá.

## Tengdar aðgerðir
- **Delete a mappa:** `Storage.Directory.Delete`

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

