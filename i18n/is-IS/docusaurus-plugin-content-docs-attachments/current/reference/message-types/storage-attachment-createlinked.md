---
id: storage-attachment-createlinked
title: "Storage.Attachment.CreateLinked"
sidebar_label: "Storage.Attachment.CreateLinked"
sidebar_position: 10
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Attachment.CreateLinked."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Tengir skrá sem þegar er í geymslu við nýtt eða fyrirliggjandi innkomið fylgiskjal; hún er afgreidd á gagnsæjan hátt úr geymslunni.

## Lýsigögn
- **Stefna:** Inn á við (Inbound, ritun)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Attachment.CreateLinked` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `GetFile`
- **Beining:** `storageCode` beiðninnar velur línu í `Bifrost Storage Setup` og aðgerðin keyrir á skráarreikningi þeirrar línu. Finndu kóðana með `Storage.Account.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `storageCode` | **Já** | string | Geymslutengingin sem geymir skrána (sami kóði og notaður var við upphleðsluna). Finndu hann með Storage.Account.List. |
| `path` | **Já** | string | Slóð skrárinnar innan tengingarinnar — yfirleitt `path` sem Storage.Upload.Commit skilar. |
| `fileName` | **Já** | string | Skráarheiti viðhengisins með endingu (t.d. 'invoice.pdf'). Endingin er lesin úr því. |
| `incomingDocumentEntryNo` | Nei | integer | Tengja við þetta fyrirliggjandi innkomna fylgiskjal. Slepptu til að búa til nýtt innkomið fylgiskjal. |
| `description` | Nei | string | Lýsing nýja innkomna fylgiskjalsins. Sjálfgefið er fileName. Hunsað þegar incomingDocumentEntryNo er gefið upp. |

## Dæmi um beiðni
```json
{ "storageCode": "BLOBTEST", "path": "bifrost-uploads/invoice.pdf", "fileName": "invoice.pdf" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `target` | string | Alltaf `IncomingDocument`. |
| `incomingDocumentEntryNo` | integer | Færslunúmer innkomna fylgiskjalsins sem viðhengið tilheyrir. Notaðu það sem `subject` í Incoming.Document.Get. |
| `lineNo` | integer | Línunúmer nýja viðhengisins innan innkomna fylgiskjalsins. |
| `systemId` | string (GUID) | SystemId viðhengisfærslunnar. Notaðu það sem `systemId` í Storage.Attachment.Restore. |
| `storageCode` | string | Geymslutengingin sem afgreiðir skrána. |
| `path` | string | Geymsluslóðin sem viðhengið er afgreitt frá. |
| `fileName` | string | Skráarnafn viðhengisins. |
| `contentLength` | integer | Stærð skrárinnar í bætum. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Engin skrá fannst í geymslunni | Hladdu skránni fyrst upp (Storage.Upload.Begin/Append/Commit) og sendu slóðina úr Commit. |
| Ekkert innkomið fylgiskjal fannst með færslunúmeri | Slepptu incomingDocumentEntryNo til að búa til nýtt fylgiskjal, eða sendu gilt færslunúmer. |
| er þegar tengd öðru viðhengi | Hver skrá í geymslu getur aðeins legið að baki einu viðhengi. Hladdu upp sérstöku afriti eða notaðu aðra slóð. |

## Athugasemdir
Viðhengið er búið til úr geymdu skránni og tengt strax, og staðbundna innihaldið er hreinsað, svo það er afgreitt eftir þörfum úr geymslunni nákvæmlega eins og útflutt viðhengi. Skráin er aldrei afrituð inn í gagnagrunninn frá kallanda.

## Næstu skref
- Til að staðfesta viðhengið og lesa það aftur → kallaðu á `Incoming.Document.Get` (sendu `incomingDocumentEntryNo` sem var skilað sem `subject`).
- Til að sækja skrána inn í gagnagrunninn (aftengja) → kallaðu á `Storage.Attachment.Restore` (sendu `target` = IncomingDocument og `systemId` sem var skilað).

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

