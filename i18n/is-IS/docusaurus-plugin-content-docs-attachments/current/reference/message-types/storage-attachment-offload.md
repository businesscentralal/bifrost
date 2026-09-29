---
id: storage-attachment-offload
title: "Storage.Attachment.Offload"
sidebar_label: "Storage.Attachment.Offload"
sidebar_position: 11
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Attachment.Offload."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Flytur skrá viðhengis út í geymslutengingu og hreinsar hana úr gagnagrunninum, en hún er áfram aðgengileg á gagnsæjan hátt.

## Lýsigögn
- **Stefna:** Inn á við (Inbound, ritun)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Attachment.Offload` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `CreateFile`
- **Beining:** `storageCode` beiðninnar velur línu í `Bifrost Storage Setup` og aðgerðin keyrir á skráarreikningi þeirrar línu. Finndu kóðana með `Storage.Account.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `target` | **Já** | string | Hvaða viðhengjatöflu á að vinna með: 'IncomingDocument' eða 'DocumentAttachment'. |
| `systemId` | **Já** | string (GUID) | SystemId viðhengisfærslunnar þar sem skráin á að flytjast út í geymslu. |
| `storageCode` | **Já** | string | Uppsetta geymslutengingin sem hlaða á upp í. Finndu hana með Storage.Account.List. |
| `folderPath` | Nei | string | Valfrjáls áfangamappa (ein eða fleiri undirmöppur, miðað við grunnslóð tengingarinnar) þar sem skráin er geymd; skráarheitinu er bætt við sjálfkrafa. Slepptu til að nota sjálfgefna slóð sem auðvelt er að rata um: fyrir innkomið fylgiskjal `bifrost-attachments/incoming-documents/{year}/{entry no.}/{file name}`, svo rekja megi blob-skrána aftur til fylgiskjalsins. |

## Dæmi um beiðni
```json
{ "target": "IncomingDocument", "systemId": "0f8e...-...", "storageCode": "ARCHIVE", "folderPath": "invoices/2026" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `target` | string | Endurvarp marktöflunnar (IncomingDocument eða DocumentAttachment). |
| `systemId` | string (GUID) | Endurvarp útfluttu viðhengisfærslunnar. Sendu í Storage.Attachment.Restore til að sækja hana aftur. |
| `storageCode` | string | Geymslutengingin sem nú geymir skrána. |
| `path` | string | Öll geymsluslóðin þar sem skráin var geymd. |
| `contentLength` | integer | Fjöldi bæta sem hlaðið var upp í geymslu. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Viðhengið er þegar flutt út í geymslu | Sæktu það fyrst aftur með Storage.Attachment.Restore og flyttu það svo aftur út ef þörf krefur. |
| Viðhengið hefur ekkert innihald til að flytja út | Færslan inniheldur ekkert skráarinnihald; ekkert til að flytja. |
| Engin viðhengisfærsla fannst fyrir uppgefið SystemId | Athugaðu marktöfluna og SystemId. |

## Athugasemdir
Eftir vel heppnaðan útflutning er skráin fjarlægð úr gagnagrunni Business Central og afgreidd eftir þörfum úr geymslu, svo núverandi ferlar halda áfram að virka. Snúðu því við með Storage.Attachment.Restore.

Ekki er hægt að flytja út viðhengi sem þegar hefur verið flutt út. Kallið skilar villu; sæktu það fyrst aftur ef þú þarft að flytja það út á ný.

### Að finna útflutningsmöguleika (batch vinnufærsla)

Báðar viðhengjatöflurnar hafa reiknaða reitinn **`Offloaded ori`** (Boolean) sem er `true` þegar færslan hefur geymslutengingu og `false` þegar innihald hennar er enn í gagnagrunninum. Notaðu `get_records` til að finna færslur sem koma til greina:

- **Viðhengi innkominna fylgiskjala:** `get_records` með töflunni `Incoming Document Attachment` (133), síu `WHERE(Offloaded ori=CONST(0))`, reitum `SystemId,Name,Content_Length,Incoming_Document_Entry_No`. Stilltu target á `IncomingDocument`.
- **Fylgiskjalsviðhengi:** `get_records` með töflunni `Document Attachment` (1173), síu `WHERE(Offloaded ori=CONST(0))`, reitum `SystemId,File_Name,File_Extension,Table_ID,No`. Stilltu target á `DocumentAttachment`.

Farðu í gegnum niðurstöðurnar og kallaðu á þessa skilaboðategund einu sinni fyrir hverja færslu og sendu `SystemId` sem var skilað sem `systemId`. Færslum sem þegar hafa verið fluttar út (ef einhverjar slæðast með) er hafnað á öruggan hátt.

## Næstu skref
- Til að sækja skrána aftur inn í gagnagrunninn → kallaðu á `Storage.Attachment.Restore` (sendu sama `target` og `systemId` — enginn storageCode nauðsynlegur, hann er lesinn úr tengingunni).

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

