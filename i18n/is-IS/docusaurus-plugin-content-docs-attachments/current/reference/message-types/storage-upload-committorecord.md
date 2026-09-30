---
id: storage-upload-committorecord
title: "Storage.Upload.CommitToRecord"
sidebar_label: "Storage.Upload.CommitToRecord"
sidebar_position: 28
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Upload.CommitToRecord."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Setur upphlaðna búta saman og tengir skrána beint við færslu án ytri geymslu.

## Lýsigögn
- **Stefna:** Inn á við (Inbound, ritun)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Upload.CommitToRecord` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Beining:** Tilgreint með `uploadId` úr fyrra `Storage.Upload.Begin`. Stilltu `target` til að velja gerð viðhengis. Fyrir DocumentAttachment (sjálfgefið) er færslan tilgreind með `tableId`/`tableName` ásamt `recordSystemId` eða `no`. Fyrir IncomingDocument má gefa upp `incomingDocumentEntryNo`. Enginn `storageCode` er nauðsynlegur.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `uploadId` | **Já** | string (GUID) | Lotan sem Storage.Upload.Begin skilaði. |
| `target` | Nei | string | 'DocumentAttachment' (sjálfgefið) eða 'IncomingDocument'. Stýrir því í hvaða viðhengjatöflu skráin er skrifuð. |
| `tableId` | Nei | integer | DocumentAttachment: taflan sem viðhengið tilheyrir. 18 = Customer, 23 = Vendor, 36 = Sales Header (notaðu recordSystemId), 112 = Sales Invoice Header, 5600 = Fixed Asset, o.s.frv. |
| `tableName` | Nei | string | DocumentAttachment: heiti töflunnar í stað tableId. |
| `recordSystemId` | Nei | string (GUID) | DocumentAttachment: SystemId færslunnar. Nauðsynlegt fyrir töflur með samsettan lykil (sölu-/innkaupafylgiskjöl). |
| `no` | Nei | string | DocumentAttachment: aðallykill færslunnar. Aðeins fyrir töflur með einn Code-lykil. |
| `incomingDocumentEntryNo` | Nei | integer | IncomingDocument: tengja við þetta fyrirliggjandi innkomna fylgiskjal. Slepptu til að búa til nýtt. |
| `description` | Nei | string | IncomingDocument: lýsing fyrir nýtt innkomið fylgiskjal. Sjálfgefið er fileName. |
| `fileName` | Nei | string | Kemur í stað skráarheitisins úr Begin. Ef því er sleppt er upprunalegt fileName lotunnar notað. |

## Dæmi um beiðni
```json
// Attach to a customer (DocumentAttachment, default):\{ "uploadId": "0f8e...", "tableId": 18, "no": "10000" }\\// Attach to a sales quote by SystemId:\{ "uploadId": "0f8e...", "tableId": 36, "recordSystemId": "04df3c11-..." }\\// Create as incoming document:\{ "uploadId": "0f8e...", "target": "IncomingDocument", "description": "Scanned invoice" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `target` | string | `DocumentAttachment` eða `IncomingDocument`. |
| `tableId` | integer | DocumentAttachment: taflan sem viðhengið var búið til á. |
| `no` | string | DocumentAttachment: lykill færslunnar. |
| `incomingDocumentEntryNo` | integer | IncomingDocument: færslunúmer innkomna fylgiskjalsins. |
| `systemId` | string (GUID) | SystemId nýja viðhengisins. |
| `fileName` | string | Endanlegt skráarheiti viðhengisins. |
| `contentLength` | integer | Stærð skrárinnar í bætum. |
| `offloaded` | boolean | Alltaf false — innihaldið er geymt í gagnagrunninum. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Engin upphleðslulota fannst | Byrjaðu lotu fyrst með Storage.Upload.Begin. |
| Upphleðslulotan er ekki opin | Henni hefur þegar verið lokið með Commit eða hætt við hana; hefðu nýja lotu. |
| Engin færsla fannst í töflunni | DocumentAttachment: hýsilfærslan verður að vera til. |
| Óþekkt markmið | Notaðu 'DocumentAttachment' eða 'IncomingDocument'. |

## Athugasemdir
Valkosturinn án geymslu í stað Storage.Upload.Commit. Bútar eru settir saman og skrifaðir beint í gagnagrunninn — engin ytri geymslutenging er nauðsynleg. Hefðu lotuna með eða án `storageCode`; ef honum er sleppt verður til lota sem notar eingöngu biðminni.\\### Vinnuferli\1. `Storage.Upload.Begin` með `fileName` (storageCode er valfrjálst).\2. `Storage.Upload.Append` einu sinni fyrir hvern bút.\3. `Storage.Upload.CommitToRecord` með `uploadId` + target + færsluvistfangi.\\### Munur á markmiðum\- **DocumentAttachment** (sjálfgefið): krefst `tableId`/`tableName` + `no`/`recordSystemId`. Virkar fyrir aðalfærslur (Customer, Vendor, FA) og fylgiskjöl (Sales Header með recordSystemId, Posted Sales Invoice með no).\- **IncomingDocument**: býr til eða endurnýtir innkomið fylgiskjal. Sendu `incomingDocumentEntryNo` ef tengja á við fyrirliggjandi fylgiskjal.

## Næstu skref
- Til að flytja viðhengið út í geymslu síðar → kallaðu á `Storage.Attachment.Offload` (sendu skilaða `target` og `systemId`).

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

