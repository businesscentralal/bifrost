---
id: storage-file-get
title: "Storage.File.Get"
sidebar_label: "Storage.File.Get"
sidebar_position: 21
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.File.Get."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Hleður niður skrá úr uppsettu geymslutengingunni og skilar innihaldi hennar sem base64.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.File.Get` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `GetFile`
- **Beining:** `storageCode` beiðninnar velur línu í `Bifrost Storage Setup` og aðgerðin keyrir á skráarreikningi þeirrar línu. Finndu kóðana með `Storage.Account.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `storageCode` | **Já** | string | Uppsetta geymslutengingin sem á að nota. Finndu hana með Storage.Account.List. |
| `path` | **Já** | string | Skráarslóð sem á að hlaða niður (miðað við grunnslóð tengingarinnar). |

## Dæmi um beiðni
```json
{ "storageCode": "ARCHIVE", "path": "invoices/2026/INV-001.pdf" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```
`data` inniheldur `path`, `contentLength` (bæti) og `contentBase64` (innihald skrárinnar).

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Skrá fannst ekki | Staðfestu að skráin sé til með Storage.File.Exists eða listaðu möppuna með Storage.File.List. |

## Athugasemdir
Innihaldið er base64-kóðað. Afkóðaðu `contentBase64` til að fá upprunalegu bætin aftur.

## Tengdar aðgerðir
- **Hlaða upp skrá:** `Storage.File.Create`\- **Athuga tilvist:** `Storage.File.Exists`

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

