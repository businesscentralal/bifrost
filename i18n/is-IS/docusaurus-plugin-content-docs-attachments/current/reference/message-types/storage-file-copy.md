---
id: storage-file-copy
title: "Storage.File.Copy"
sidebar_label: "Storage.File.Copy"
sidebar_position: 17
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.File.Copy."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Afritar skrá innan uppsettu geymslutengingarinnar.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.File.Copy` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `CopyFile`
- **Beining:** `storageCode` beiðninnar velur línu í `Bifrost Storage Setup` og aðgerðin keyrir á skráarreikningi þeirrar línu. Finndu kóðana með `Storage.Account.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `storageCode` | **Já** | string | Uppsetta geymslutengingin sem á að nota. Finndu hana með Storage.Account.List. |
| `sourcePath` | **Já** | string | Skráin sem á að afrita (miðað við grunnslóð tengingarinnar). |
| `targetPath` | **Já** | string | Áfangaslóð afritsins. |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "sourcePath": "in/a.txt", "targetPath": "out/a.txt" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `sourcePath` og `targetPath`.

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Upprunaskrá fannst ekki | Staðfestu að upprunaskráin sé til með Storage.File.Exists. |

## Hliðarverkanir

Býr til afrit í ytri geymslu þótt Direction sé Outbound. Líttu á það sem skrift þegar beðið er um staðfestingu.

## Tengdar aðgerðir
- **Færa í stað þess að afrita:** `Storage.File.Move`

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

