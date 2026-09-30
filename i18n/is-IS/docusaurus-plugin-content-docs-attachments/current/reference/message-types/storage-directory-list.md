---
id: storage-directory-list
title: "Storage.Directory.List"
sidebar_label: "Storage.Directory.List"
sidebar_position: 16
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Directory.List."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Listar undirmöppur möppu í uppsettu geymslutengingunni.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Directory.List` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `ListDirectories`
- **Beining:** `storageCode` beiðninnar velur línu í `Bifrost Storage Setup` og aðgerðin keyrir á skráarreikningi þeirrar línu. Finndu kóðana með `Storage.Account.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `storageCode` | **Já** | string | Uppsetta geymslutengingin sem á að nota. Finndu hana með Storage.Account.List. |
| `path` | Nei | string | Mappan sem undirmöppurnar eru listaðar úr (miðað við grunnslóð tengingarinnar). Slepptu eða sendu tóman streng til að lista rót tengingarinnar. |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "invoices" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `path` og fylkið `entries` með `{ name, type, parentDirectory }` (type er alltaf `Directory`).

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Tengdar aðgerðir
- **Lista skrár:** `Storage.File.List`\- **Búa til möppu:** `Storage.Directory.Create`

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

