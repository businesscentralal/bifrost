---
id: storage-account-list
title: "Storage.Account.List"
sidebar_label: "Storage.Account.List"
sidebar_position: 8
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Account.List."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Listar uppsettar geymslutengingar (kóða, lýsingar, tengla og hvort þær eru virkar). Engin leyndarmál eru birt.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Account.List` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Beining:** Engar beiningarfæribreytur. Listar allar uppsettar tengingar svo þú getir valið `storageCode` fyrir hinar tegundirnar. Þetta er upphafspunktur könnunar — kallaðu á hana fyrst.

## Dæmi um beiðni
```json
{ }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `accounts` | array | Einn hlutur fyrir hverja tengingu: `{ code, description, connector, basePath, enabled }`. Engum leyndarmálum er skilað. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Athugasemdir
Notaðu `code` sem var skilað sem `storageCode` í öllum öðrum geymsluskilaboðategundum. Óvirkar tengingar eru listaðar en þeim er hafnað þegar kallað er, svo veldu frekar tengingar með `enabled = true`.

## Næstu skref
- Þegar þú hefur storageCode → kallaðu á `Storage.File.Create` (sendu `code` sem `storageCode` (eða notaðu hvaða aðra Storage.*-tegund sem er)).
- Til að hlaða upp stórri skrá → kallaðu á `Storage.Upload.Begin` (sendu `code` sem `storageCode`).

## Tengdar aðgerðir
- **Yfirlit yfir tengla:** `Help.Storage.Get`

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

