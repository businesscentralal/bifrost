---
id: storage-upload-abort
title: "Storage.Upload.Abort"
sidebar_label: "Storage.Upload.Abort"
sidebar_position: 24
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Upload.Abort."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Fleygir opinni upphleðslulotu og öllum bútum hennar án þess að skrifa í geymslu.

## Lýsigögn
- **Stefna:** Inn á við (Inbound, ritun)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Upload.Abort` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Beining:** Tilgreint með `uploadId` — lotunni sem `Storage.Upload.Begin` stofnaði. Snertir ekki geymslu.

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
| `uploadId` | string (GUID) | Endurvarp auðkennis lotunnar sem var fleygt. |
| `status` | string | Alltaf `Aborted` ef aðgerðin tekst. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Engin upphleðslulota fannst fyrir uploadId sem var gefið upp | Hugsanlega hefur þegar verið lokið við hana með Commit, hætt við hana eða henni eytt; lota er einkaeign þess sem stofnaði hana. |
| Upphleðslulotan er ekki opin | Aðeins er hægt að hætta við opna lotu; upphleðsla sem lokið hefur verið með Commit er þegar geymd. |

## Athugasemdir
Þegar hætt er við er lotunni og bútum hennar eytt úr gagnagrunninum. Eftir það skilar `Storage.Upload.Status` fyrir sama `uploadId` villunni "No upload session was found for the supplied uploadId." Geymslan er ekki snert, því ekkert hefur enn verið skrifað þangað. Lotum sem ekki er lokið með Commit er einnig eytt sjálfkrafa samkvæmt varðveislureglu, svo ekki er nauðsynlegt að hætta við.

## Næstu skref
- Til að byrja nýja upphleðslu → kallaðu á `Storage.Upload.Begin`.

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

