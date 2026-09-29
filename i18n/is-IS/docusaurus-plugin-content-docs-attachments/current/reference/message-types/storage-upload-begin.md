---
id: storage-upload-begin
title: "Storage.Upload.Begin"
sidebar_label: "Storage.Upload.Begin"
sidebar_position: 26
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Upload.Begin."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Opnar upphleðslulotu í bútum til að senda stóra skrá sem röð lítilla búta.

## Lýsigögn
- **Stefna:** Inn á við (Inbound, ritun)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Upload.Begin` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `CreateFile`
- **Beining:** `storageCode` beiðninnar velur línu í `Bifrost Storage Setup` og aðgerðin keyrir á skráarreikningi þeirrar línu. Finndu kóðana með `Storage.Account.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `storageCode` | Nei | string | Geymslutengingin sem skráin er skrifuð í við Storage.Upload.Commit. Slepptu til að búa til lotu sem notar eingöngu biðminni og aðeins er hægt að ljúka með Storage.Upload.CommitToRecord (tengir beint við færslu án ytri geymslu). |
| `fileName` | **Já** | string | Skráarheiti upphleðslunnar, með endingu. Notað sem síðasti liður sjálfgefinnar slóðar. |
| `path` | Nei | string | Öll áfangaslóðin með skráarheiti, miðað við grunnslóð tengingarinnar. Gengur framar folderPath. Slepptu báðum til að nota sjálfgefið `bifrost-uploads/{fileName}`. |
| `folderPath` | Nei | string | Áfangamappa (aðskilin með skástrikum); skráarheitinu er bætt við sjálfkrafa. Hunsað þegar path er gefið upp. |
| `declaredSize` | Nei | integer | Væntanleg heildarstærð í bætum. Ef hún er gefin upp er hún borin saman við samsetta stærð við Commit; ef þær stemma ekki mistekst Commit. Mælt með til að tryggja heilleika. |

## Dæmi um beiðni
```json
{ "storageCode": "BLOBTEST", "fileName": "invoice.pdf", "folderPath": "invoices/2026", "declaredSize": 212413 }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `uploadId` | string (GUID) | Auðkenni lotunnar. Sendu það sem `uploadId` í hverju Append-, Commit-, Abort- og Status-kalli fyrir þessa upphleðslu. |
| `storageCode` | string | Endurvarp geymslutengingarinnar sem var fundin. |
| `path` | string | Áfangaslóðin sem skráin verður skrifuð á við Commit. |
| `chunkSizeHint` | integer | Ráðlagt hámark RAW-bæta í hverjum bút (nú 49152). Lestu í mesta lagi svo mörg bæti í hvern bút, base64-kóðaðu þann hluta einan og sér og sendu hann með Append. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Engin geymslutenging er uppsett fyrir storageCode | Finndu gildan, virkan kóða með Storage.Account.List. |

## Athugasemdir
Notaðu þetta þegar skrá er of stór til að senda í Storage.File.Create í einu kalli. Skiptu skránni í búta sem eru í mesta lagi `chunkSizeHint` RAW-bæti; base64-kóðaðu hvern bút SJÁLFSTÆTT (ekki base64-kóða alla skrána og skipta textanum síðan — þá væri ekki hægt að afkóða mörkin). Sendu bútana með rununúmerum 1, 2, 3, ... og ljúktu svo með Commit. Lota er einkaeign notandans sem stofnaði hana og er eytt sjálfkrafa ef henni er aldrei lokið.

## Næstu skref
- Til að senda innihald skrárinnar → kallaðu á `Storage.Upload.Append` (sendu `uploadId` sem var skilað, `sequence` sem byrjar á 1 og einn base64-bút).
- Til að skrifa skrána í geymslu → kallaðu á `Storage.Upload.Commit` (sendu `uploadId` — krefst storageCode á lotunni).
- Til að tengja skrána við færslu án geymslu → kallaðu á `Storage.Upload.CommitToRecord` (sendu `uploadId` + færsluvistfang (tableId/no)).

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

