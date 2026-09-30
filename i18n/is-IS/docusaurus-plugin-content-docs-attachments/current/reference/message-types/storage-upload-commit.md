---
id: storage-upload-commit
title: "Storage.Upload.Commit"
sidebar_label: "Storage.Upload.Commit"
sidebar_position: 27
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Upload.Commit."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Setur búta upphleðslulotu saman og skrifar skrána í geymslutenginguna.

## Lýsigögn
- **Stefna:** Inn á við (Inbound, ritun)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Upload.Commit` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `CreateFile`
- **Beining:** Tilgreint með `uploadId` — lotunni sem `Storage.Upload.Begin` stofnaði. Áfangaslóðin og geymslutengingin voru ákveðnar í Begin.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `uploadId` | **Já** | string (GUID) | Lotan sem Storage.Upload.Begin skilaði, eftir að öllum bútum hefur verið bætt við. |

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
| `uploadId` | string (GUID) | Endurvarp auðkennis lotunnar sem var lokið. |
| `storageCode` | string | Geymslutengingin sem skráin var skrifuð í. Notaðu hana áfram í Storage.Attachment.CreateLinked eða Storage.File.*-köllum. |
| `path` | string | Öll slóðin sem skráin var skrifuð á. Notaðu hana áfram í Storage.Attachment.CreateLinked, Storage.File.Get o.s.frv. |
| `contentLength` | integer | Stærð samsettu skrárinnar í bætum. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Upphleðslulotan hefur enga búta til að ljúka | Bættu við að minnsta kosti einum bút með Storage.Upload.Append áður en þú kallar á Commit. |
| Það vantar einn eða fleiri búta í upphleðslulotuna | Rununúmerin eru ekki samfelld; bættu týndu rununni (eða runum) við aftur áður en þú kallar á Commit. |
| Móttekin stærð passar ekki við uppgefna stærð | Bút vantar eða hann er styttur; bættu honum við aftur eða hefðu nýja lotu án declaredSize. |
| Upphleðslulotan er ekki opin | Henni hefur þegar verið lokið með Commit eða hætt við hana; hefðu nýja lotu. |
| Þessi upphleðslulota hefur enga geymslutengingu | Lotan var hafin án storageCode. Notaðu Storage.Upload.CommitToRecord til að tengja hana við færslu án ytri geymslu, eða hefðu nýja lotu með storageCode. |

## Athugasemdir
Commit setur bútana saman í hækkandi runuröð, skrifar skrána síðast (á eftir gagnagrunnsvinnslunni, svo villa afturkallast hreint) og eyðir bútunum. Ef skrifað er á slóð sem þegar er til er skrifað yfir hana hjá tenglum á borð við Azure Blob. Þessi skilaboðategund krefst storageCode á lotunni — notaðu Storage.Upload.CommitToRecord í staðinn ef þú vilt tengja skrána beint við færslu án ytri geymslu.

## Næstu skref
- Til að tengja skrána við nýtt eða fyrirliggjandi innkomið fylgiskjal → kallaðu á `Storage.Attachment.CreateLinked` (sendu `storageCode` og `path` sem var skilað).
- Til að tengja skrána við hvaða aðalfærslu sem er (vistuð í geymslu frá upphafi) → kallaðu á `Storage.Attachment.CreateForRecord` (sendu `storageCode` og `path` sem var skilað sem innihaldsuppruna 2).
- Til að hlaða niður eða staðfesta geymdu skrána → kallaðu á `Storage.File.Get` (sendu `storageCode` og `path` sem var skilað).

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

