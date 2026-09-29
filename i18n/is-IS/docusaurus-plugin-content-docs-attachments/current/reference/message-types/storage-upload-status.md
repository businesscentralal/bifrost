---
id: storage-upload-status
title: "Storage.Upload.Status"
sidebar_label: "Storage.Upload.Status"
sidebar_position: 29
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Upload.Status."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Segir til um framvindu og stöðu upphleðslulotu.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Upload.Status` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Beining:** Tilgreint með `uploadId` — lotunni sem `Storage.Upload.Begin` stofnaði.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `uploadId` | **Já** | string (GUID) | Lotan sem Storage.Upload.Begin skilaði. |

## Dæmi um beiðni
```json
{ "uploadId": "0f8e...-..." }
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
| `storageCode` | string | Geymslutengingin sem skráin verður skrifuð í. |
| `fileName` | string | Skráarheitið sem var stillt í Begin. |
| `path` | string | Áfangaslóðin sem skráin verður skrifuð á við Commit. |
| `status` | string | `Open` eða `Committed` (lotur sem hætt hefur verið við hverfa og eru sagðar ekki finnast). |
| `declaredSize` | integer | Væntanleg stærð sem gefin var upp í Begin, eða 0 ef engin var gefin. |
| `received` | integer | Bæti sem safnast hafa í öllum bútum hingað til. |
| `chunkCount` | integer | Fjöldi búta sem geymdir hafa verið hingað til. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Engin upphleðslulota fannst fyrir uploadId sem var gefið upp | Hugsanlega hefur henni verið lokið með Commit, hætt við hana eða henni eytt; lota er einkaeign þess sem stofnaði hana. Hefðu nýja lotu með Storage.Upload.Begin. |

## Athugasemdir
Notaðu þetta til að staðfesta móttekin bæti og fjölda búta áður en Commit er kallað, eða til að athuga hvort lota sé enn opin. Þegar hætt er við lotu er henni eytt, svo staða upphleðslu sem hætt var við er sögð ekki finnast. Þetta er fyrirspurn sem aðeins les og breytir ekki lotunni.

## Næstu skref
- Ef staðan er Open og bæti eru eftir → kallaðu á `Storage.Upload.Append` (sendu næsta bút).
- Ef öll bæti hafa verið móttekin → kallaðu á `Storage.Upload.Commit` (sendu sama `uploadId`).

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

