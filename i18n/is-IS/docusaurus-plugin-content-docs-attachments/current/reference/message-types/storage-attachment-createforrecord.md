---
id: storage-attachment-createforrecord
title: "Storage.Attachment.CreateForRecord"
sidebar_label: "Storage.Attachment.CreateForRecord"
sidebar_position: 9
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Storage.Attachment.CreateForRecord."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Býr til fylgiskjalsviðhengi á hvaða færslu sem er - viðskiptamanni, lánardrottni, eign, fylgiskjali - úr base64, úr geymslu eða með því að afrita fyrirliggjandi viðhengi.

## Lýsigögn
- **Stefna:** Inn á við (Inbound, ritun)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `Storage.Attachment.CreateForRecord` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Aðgerð í External File Storage:** `GetFile`
- **Beining:** Færslan er tilgreind með `tableId`/`tableName` ásamt `recordSystemId` eða `no`. `storageCode` þarf aðeins þegar innihaldsuppruninn er skrá í geymslu.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `tableId` | Nei | integer | Taflan sem viðhengið tilheyrir. Gefðu upp þetta eða tableName. Algeng gildi: 18 = Customer, 23 = Vendor, 27 = Item, 156 = Resource, 270 = Bank Account, 5050 = Contact, 5200 = Employee, 5600 = Fixed Asset, 167 = Job, 15 = G/L Account. |
| `tableName` | Nei | string | Heiti töflu í stað tableId, t.d. 'Fixed Asset', 'Customer', 'Bank Account'. Ekki háð há- og lágstöfum; borið saman við heiti BC-hlutarins. |
| `recordSystemId` | Nei | string (GUID) | SystemId færslunnar sem viðhengið á að tengjast. Virkar fyrir allar töflur, líka töflur með samsettan aðallykil. Gefðu upp þetta eða no. |
| `no` | Nei | string | Aðallyklagildi færslunnar (t.d. '10000' fyrir viðskiptamann, 'FA000010' fyrir eign). Virkar aðeins fyrir töflur þar sem aðallykillinn er einn Code- eða Text-reitur, 20 stafir eða færri. Notaðu recordSystemId fyrir fylgiskjalatöflur og allar töflur með samsettan lykil eða heiltölulykil. |
| `fileName` | Nei | string | Skráarheiti með endingu, t.d. 'contract.pdf'. Nauðsynlegt nema afritað sé úr fyrirliggjandi viðhengi sem þegar hefur heiti. |
| `content` | Nei | base64 string | Innihaldsuppruni 1: skráin sjálf, base64-kóðuð og innfelld. Innihaldið er geymt í BC-gagnagrunninum. Notaðu fyrir litlar skrár. |
| `storageCode` | Nei | string | Innihaldsuppruni 2 (með path): vísar í skrá sem þegar er í geymslu. Viðhengið er vistað í geymslu frá upphafi — innihaldið er áfram í geymslu og er afgreitt á gagnsæjan hátt. Notaðu fyrir skrár sem sendar eru með Storage.Upload.Commit. |
| `path` | Nei | string | Nauðsynlegt með storageCode. Slóð skrárinnar innan geymslutengingarinnar — yfirleitt `path` sem Storage.Upload.Commit skilar. Hver slóð getur aðeins tengst einu viðhengi. |
| `sourceTarget` | Nei | string | Innihaldsuppruni 3 (með sourceSystemId): afritar innihald úr fyrirliggjandi BC-viðhengi. Gildið er 'IncomingDocument' eða 'DocumentAttachment'. |
| `sourceSystemId` | Nei | string (GUID) | SystemId fyrirliggjandi viðhengis sem innihaldið er afritað úr. Innihaldið er afritað á þjóninum — ekkert fer yfir netið. |

## Dæmi um beiðni
```json
// Source 1 — inline base64 on a customer:\{ "tableId": 18, "no": "10000", "fileName": "contract.txt", "content": "SGVsbG8=" }\\// Source 2 — from storage (born offloaded) on a fixed asset:\{ "tableName": "Fixed Asset", "no": "FA000010", "fileName": "deed.pdf", "storageCode": "ARCHIVE", "path": "uploads/deed.pdf" }\\// Source 3 — copy from an existing incoming document attachment to a vendor:\{ "tableId": 23, "no": "20000", "sourceTarget": "IncomingDocument", "sourceSystemId": "e4a2..." }\\// Addressing by SystemId (works for any table):\{ "tableId": 18, "recordSystemId": "b2ae4a05-...", "fileName": "note.txt", "content": "SGVsbG8=" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `target` | string | Alltaf `DocumentAttachment`. |
| `tableId` | integer | Taflan sem viðhengið var búið til á. |
| `no` | string | Lykill færslunnar sem viðhengið er tengt við. |
| `documentType` | string | Fylgiskjalsgerðin sem grunnforritið leiddi af færslunni. |
| `lineNo` | integer | Línunúmerið sem grunnforritið leiddi af færslunni. |
| `attachmentId` | integer | Auðkenni viðhengisins í viðhengjalista færslunnar. |
| `systemId` | string (GUID) | SystemId nýja viðhengisins. Sendu í Storage.Attachment.Offload eða Restore. |
| `fileName` | string | Endanlegt skráarheiti viðhengisins (gæti hafa verið breytt til að forðast tvítekningu, t.d. 'deed1.pdf'). |
| `contentLength` | integer | Stærð skrárinnar í bætum. |
| `offloaded` | boolean | True þegar innihaldið var áfram í geymslu (uppruni 2). False fyrir innfellt innihald eða afritun. |
| `storageCode` | string | Aðeins til staðar þegar viðhengið er í geymslu. Geymslutengingin sem afgreiðir skrána. |
| `path` | string | Aðeins til staðar þegar viðhengið er í geymslu. Geymsluslóð skrárinnar. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Gefðu upp nákvæmlega einn innihaldsuppruna | Sendu content, eða storageCode með path, eða sourceTarget með sourceSystemId — sameinaðu aldrei tvo uppruna í sömu beiðni. |
| Engin færsla fannst í töflunni | Hýsilfærslan verður að vera til áður en viðhengi er tengt. Athugaðu tableId og no/recordSystemId. |
| hefur samsettan aðallykil | Taflan hefur fleiri en einn lykilreit. Tilgreindu færsluna með recordSystemId í stað no. |
| er ekki Code- eða Text-reitur | Aðallykillinn er Integer eða önnur gerð sem ekki er texti. Notaðu recordSystemId. |
| veit ekki hvaða reitur auðkennir færslu | Taflan er ekki meðal þeirra sem BC getur tengt viðhengi við. Þessi tengill víkkar það safn út í allar töflur með einum Code-lykli; aðrar þurfa áskrifanda að Document Attachment Mgmt.OnAfterTableHasNumberFieldPrimaryKey. |
| er lengra en 20 stafir | Auðkenni færslunnar fer yfir 20 stafa hámark Document Attachment.No. |
| er þegar tengd öðru viðhengi | Hver skrá í geymslu getur aðeins legið að baki einu viðhengi. Hladdu upp sérstöku afriti eða notaðu aðra slóð. |

## Athugasemdir
Fylgiskjalsgerð og línunúmer eru leidd af hýsilfærslunni — gefðu þau aldrei upp. Komið er í veg fyrir tvítekin skráarheiti innan færslu: tvær skrár sem heita 'deed.pdf' verða 'deed.pdf' og 'deed1.pdf'. Með geymsluuppruna (uppruna 2) er staðbundna innihaldið hreinsað og tenging skráð, svo skráin er afgreidd eftir þörfum — sama staða og Offload skilar.\\### Studdar töflur\\Grunnforritið styður sjálft: Customer (18), Vendor (23), Item (27), Employee (5200), Fixed Asset (5600), Job (167), Resource (156) og hefðbundnar sölu- og innkaupafylgiskjalatöflur. Þessi tengill víkkar það safn út í **allar töflur þar sem aðallykillinn er einn Code-reitur, 20 stafir eða færri** — þar á meðal G/L Account (15), Bank Account (270), Contact (5050), Location (14) og hverja viðbótartöflu með sömu lögun. Fyrir töflur utan þessa safns skaltu nota recordSystemId (virkar alltaf til að tilgreina færslu) — en athugaðu að grunnforritið verður samt að geta leitt út lykil fyrir Document Attachment-línuna.

## Næstu skref
- Til að senda stóra skrá fyrst → kallaðu á `Storage.Upload.Begin` (síðan Append og Commit, og sendu `path` + `storageCode` úr Commit hingað sem uppruna 2).
- Til að flytja innfellt innihald út úr gagnagrunninum síðar → kallaðu á `Storage.Attachment.Offload` (sendu `target` = DocumentAttachment og `systemId` sem var skilað).
- Til að sækja útflutt innihald aftur inn í gagnagrunninn → kallaðu á `Storage.Attachment.Restore` (sendu `target` = DocumentAttachment og `systemId` sem var skilað).

---
Yfirlit yfir tengilinn og lista yfir stilltar tengingar: sæktu hjálpina fyrir `Help.Storage.Get` og kallaðu á `Storage.Account.List`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

