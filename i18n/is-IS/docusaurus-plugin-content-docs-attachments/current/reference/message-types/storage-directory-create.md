---
id: storage-directory-create
title: "Storage.Directory.Create"
sidebar_label: "Storage.Directory.Create"
sidebar_position: 13
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Directory.Create."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Býr til möppu í uppsettu geymslutengingunni.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Directory.Create` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `CreateDirectory`
- **Beining:** `storageCode` beiðninnar velur línu í `Bifrost Storage Setup` og aðgerðin keyrir á skráarreikningi þeirrar línu. Finndu kóðana með `Storage.Account.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `storageCode` | **Já** | string | Uppsetta geymslutengingin sem á að nota. Finndu hana með Storage.Account.List. |
| `path` | **Já** | string | Slóð möppunnar sem á að búa til (miðað við grunnslóð tengingarinnar). |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `path` möppunnar sem var búin til.

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Hliðarverkanir

Býr til möppu í ytri geymslu þótt Direction sé Outbound. Líttu á það sem skrift þegar beðið er um staðfestingu.

## Athugasemdir
Sumir tenglar (t.d. Azure Blob) hafa engar raunverulegar möppur; mappa verður hugsanlega ekki sýnileg fyrr en hún inniheldur skrá.

## Tengdar aðgerðir
- **Eyða möppu:** `Storage.Directory.Delete`

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

