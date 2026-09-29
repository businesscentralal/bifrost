---
id: storage-upload-append
title: "Storage.Upload.Append"
sidebar_label: "Storage.Upload.Append"
sidebar_position: 25
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Upload.Append."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Bætir einum base64-bút við opna upphleðslulotu.

## Lýsigögn
- **Stefna:** Inn á við (Inbound, ritun)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Upload.Append` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `CreateFile`
- **Beining:** Tilgreint með `uploadId` — lotunni sem `Storage.Upload.Begin` stofnaði. Enginn `storageCode` er nauðsynlegur hér; áfangastaðurinn var ákveðinn í Begin.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `uploadId` | **Já** | string (GUID) | Lotan sem Storage.Upload.Begin skilaði. |
| `sequence` | **Já** | integer | Staða þessa búts, talin frá 1. Runur verða að vera samfelldar (1, 2, 3, ...) án bila þegar Commit er kallað. Ef sama runa er send aftur kemur hún í stað þess búts, svo endurtekningar eru öruggar. |
| `contentBase64` | **Já** | base64 string | Hrá bæti þessa búts, base64-kóðuð sér — ekkert data-URI-forskeyti, engin bil. Hafðu hvern bút í mesta lagi jafnstóran og chunkSizeHint (hrá bæti) úr Begin (~48 KB). |

## Dæmi um beiðni
```json
{ "uploadId": "0f8e...-...", "sequence": 1, "contentBase64": "JVBERi0xLjQK..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `uploadId` | string (GUID) | Endurvarp auðkennis lotunnar. |
| `sequence` | integer | Endurvarp rununúmers bútsins sem var samþykktur. |
| `received` | integer | Heildarfjöldi bæta sem safnast hafa í öllum bútum hingað til. Þegar þetta jafngildir declaredSize (eða stærðinni sem þú ætlaðir) er viðbótum lokið. |
| `chunkCount` | integer | Fjöldi aðskildra búta sem geymdir hafa verið hingað til. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Engin upphleðslulota fannst fyrir uploadId sem var gefið upp | Hefðu lotu fyrst; lota er einkaeign þess sem stofnaði hana og gæti hafa verið lokið með Commit, hætt við hana eða henni eytt. |
| Upphleðslulotan er ekki opin | Henni hefur þegar verið lokið með Commit eða hætt við hana; hefðu nýja lotu. |
| Ógilt base64-innihald | Gakktu úr skugga um að contentBase64 sé gilt base64 án bila í kring eða data-URI-forskeytis. |

## Athugasemdir
Sendu bútana í röð (runa 1, 2, 3, ...). Þetta kall skilar sömu niðurstöðu við endurtekningu (idempotent) fyrir hverja runu — ef runa er send aftur kemur hún í stað þess búts.

## Næstu skref
- Á meðan fleiri bútar eru eftir → kallaðu á `Storage.Upload.Append` (hækkaðu `sequence` og sendu næsta bút).
- Þegar allir bútar hafa verið sendir (í ytri geymslu) → kallaðu á `Storage.Upload.Commit` (sendu sama `uploadId` — krefst storageCode á lotunni).
- Þegar allir bútar hafa verið sendir (í færslu, án geymslu) → kallaðu á `Storage.Upload.CommitToRecord` (sendu sama `uploadId` + færsluvistfang eða `target` = IncomingDocument).
- Til að athuga uppsafnaða framvindu → kallaðu á `Storage.Upload.Status` (sendu sama `uploadId`).

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

