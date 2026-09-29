---
id: storage-attachment-restore
title: "Storage.Attachment.Restore"
sidebar_label: "Storage.Attachment.Restore"
sidebar_position: 12
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Attachment.Restore."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Sækir skrá útflutts viðhengis úr geymslu aftur inn í gagnagrunninn og eyðir afritinu í geymslunni.

## Lýsigögn
- **Stefna:** Inn á við (Inbound, ritun)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Attachment.Restore` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `GetFile`
- **Beining:** Tilgreint með `target` + `systemId`. Geymslutengingin og slóðin eru lesnar úr útflutnings-/tengingarfærslu viðhengisins — enginn `storageCode` er nauðsynlegur.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `target` | **Já** | string | Hvaða viðhengjatöflu á að vinna með: 'IncomingDocument' eða 'DocumentAttachment'. |
| `systemId` | **Já** | string (GUID) | SystemId útfluttu eða geymslutengdu viðhengisfærslunnar sem á að sækja aftur inn í gagnagrunninn. |

## Dæmi um beiðni
```json
{ "target": "IncomingDocument", "systemId": "0f8e...-..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `target` | string | Endurvarp marktöflunnar. |
| `systemId` | string (GUID) | Endurvarp endurheimtu viðhengisfærslunnar. |
| `contentLength` | integer | Fjöldi bæta sem voru skrifuð aftur inn í gagnagrunninn. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Viðhengið er ekki flutt út | Aðeins er hægt að endurheimta viðhengi með geymslutengingu (úr Offload eða CreateLinked). Athugaðu reitinn `Offloaded ori`. |
| Engin viðhengisfærsla fannst fyrir uppgefið SystemId | Athugaðu marktöfluna og SystemId. |

## Athugasemdir
Virkar fyrir viðhengi sem búin eru til með Storage.Attachment.Offload, Storage.Attachment.CreateLinked og Storage.Attachment.CreateForRecord (þegar þau eru vistuð í geymslu frá upphafi úr geymsluuppruna). Geymslutengingin og slóðin eru lesnar úr tengingarfærslunni, svo enginn storageCode er nauðsynlegur. Skránni í geymslunni er **eytt** eftir að innihaldið hefur verið skrifað aftur í gagnagrunninn — endurheimt eyðir afritinu í geymslunni.

## Næstu skref
- Til að flytja skrána aftur út í geymslu → kallaðu á `Storage.Attachment.Offload` (sendu sama `target` og `systemId` með `storageCode`).
- Til að búa til nýtt tengt viðhengi úr geymslu → kallaðu á `Storage.Attachment.CreateLinked` (fyrir innkomin fylgiskjöl).
- Til að tengja skrá úr geymslu við hvaða aðalfærslu sem er → kallaðu á `Storage.Attachment.CreateForRecord` (sendu `storageCode` + `path` sem uppruna 2).

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

