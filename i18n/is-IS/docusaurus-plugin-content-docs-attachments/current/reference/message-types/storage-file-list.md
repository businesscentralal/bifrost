---
id: storage-file-list
title: "Storage.File.List"
sidebar_label: "Storage.File.List"
sidebar_position: 22
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.File.List."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Listar skrárnar í möppu í uppsettu geymslutengingunni.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.File.List` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `ListFiles`
- **Beining:** `storageCode` beiðninnar velur línu í `Bifrost Storage Setup` og aðgerðin keyrir á skráarreikningi þeirrar línu. Finndu kóðana með `Storage.Account.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `storageCode` | **Já** | string | Uppsetta geymslutengingin sem á að nota. Finndu hana með Storage.Account.List. |
| `path` | Nei | string | Mappan sem skrárnar eru listaðar úr (miðað við grunnslóð tengingarinnar). Slepptu eða sendu tóman streng til að lista rót tengingarinnar. |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `path` og fylkið `entries` með `{ name, type, parentDirectory }` (type er alltaf `File`).

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Slóð fannst ekki | Staðfestu að mappan sé til með Storage.Directory.Exists. |

## Tengdar aðgerðir
- **Lista undirmöppur:** `Storage.Directory.List`\- **Hlaða niður skrá:** `Storage.File.Get`

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

