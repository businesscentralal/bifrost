---
id: help-storage-get
title: "Help.Storage.Get"
sidebar_label: "Help.Storage.Get"
sidebar_position: 7
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Help.Storage.Get."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Þessi tengill birtir **External File Storage**-viðmót Business Central sem Bifrost-skilaboðategundir og veitir les- og skrifaðgang að skýjageymslu (Azure Blob, Azure File Share, SharePoint og öllum öðrum skráðum External File Storage-tenglum) úr Business Central og fyrir ytri kallendur.

Skilaboðategundir eru **outbound** (lestur/fyrirspurn) eða **inbound** (skrift); allar skiptast á JSON (`Content-Type: text/json`). Kallaðu á hvaða þeirra sem er með `call_message_type`-tólinu og sendu `type` = heiti skilaboðategundarinnar og `data` = færibreytur hennar.

**Direction** lýsir gögnum Business Central. Create, Delete, Copy og Move fyrir File og Directory breyta ytri geymslunni þótt þær séu Outbound; líttu á þær sem skrift þegar beðið er um staðfestingu.

## Útgáfuupplýsingar

- **Útgáfa:** 28.0.0.36
- **Studd tungumál:** en-US, is-IS
- **Studd keyrsluumhverfi:** Business Central 28 / runtime 17.0

## Fyrstu skref

Ráðlögð röð fyrir sjálfvirkan kallanda:

1. Kallaðu á `Storage.Account.List` til að finna þau `storageCode`-gildi sem þú mátt nota. Ekki giska á kóða.
2. Sæktu hjálp fyrir tegundina (`get_message_type_help`) fyrir aðgerðina sem þú ætlar að kalla á, til að staðfesta nákvæmar færibreytur hennar og **Næstu skref**.
3. Kallaðu á aðgerðina með völdum `storageCode` og færibreytum aðgerðarinnar.
4. Skoðaðu `status` fyrst: ef `Error`, lestu `error` og leiðréttu beiðnina áður en þú reynir aftur; ef `Success`, lestu `data`.

## Verkferlar fyrir gervigreindarmiðla

Hvert hjálparskjal fyrir tegund endar á hlutanum **Næstu skref**, sem nefnir nákvæmlega hvaða skilaboðategund kemur næst og hvaða reit á að flytja áfram, svo þú getir keðjað köll án ágiskana. Algengustu ferlarnir:

**Hlaða stórri skrá upp í ytri geymslu** (of stór fyrir eitt `Storage.File.Create`):
1. `Storage.Upload.Begin` með `storageCode` + `fileName` \u2192 skilar `uploadId`, `path`, `chunkSizeHint`.
2. `Storage.Upload.Append` einu sinni fyrir hvern bút \u2014 lestu í mesta lagi `chunkSizeHint` RAW-bæti, base64-kóðaðu þann hluta einan og sér, sendu með `uploadId` og `sequence` = 1, 2, 3, ...
3. `Storage.Upload.Commit` með `uploadId` \u2192 skrifar skrána og skilar endanlegu `path` og `contentLength`.

**Hlaða stórri skrá beint upp í færslu** (engin ytri geymsla nauðsynleg):
1. `Storage.Upload.Begin` með aðeins `fileName` (slepptu `storageCode`) \u2192 býr til lotu sem notar eingöngu biðminni.
2. `Storage.Upload.Append` einu sinni fyrir hvern bút (eins og að ofan).
3. `Storage.Upload.CommitToRecord` með `uploadId` + færsluvistfangi (`tableId`/`no` eða `recordSystemId`) \u2192 setur bútana saman og geymir í gagnagrunninum.
   - Sjálfgefið markmið er `DocumentAttachment` (hvaða aðalfærsla sem er, sölufylgiskjal, bókað fylgiskjal).
   - Stilltu `target` = `IncomingDocument` til að búa til innkomið fylgiskjal í staðinn.

**Tengja upphlaðna skrá við innkomið fylgiskjal:**
4. `Storage.Attachment.CreateLinked` með `storageCode` + `path` úr Commit → býr til (eða endurnýtir) innkomið fylgiskjal, skilar `incomingDocumentEntryNo`.
5. `Incoming.Document.Get` með því færslunúmeri sem `subject` → staðfestir viðhengið; innihald þess er afgreitt á gagnsæjan hátt úr geymslunni.

**Tengja skrá við hvaða aðalfærslu sem er** (viðskiptamann, lánardrottin, eign, fjárhagsreikning, bankareikning, ...):
- Innfellt: `Storage.Attachment.CreateForRecord` með `tableId`/`tableName` + `no`/`recordSystemId` + `content` (base64) + `fileName`.
- Úr geymslu (vistað í geymslu frá upphafi): sama kall en sendu `storageCode` + `path` í stað `content`. Skráin er áfram í geymslu og er afgreidd eftir þörfum.
- Afrita úr fyrirliggjandi viðhengi: sama kall en sendu `sourceTarget` + `sourceSystemId` í stað `content`. Afritað á þjóninum, ekkert fer yfir netið.
- Hver slóð í geymslu getur aðeins verið tengd einu viðhengi; notaðu sérstaka upphleðslu fyrir hvert viðhengi.

**Flytja fyrirliggjandi BC-viðhengi út í geymslu** og sækja það aftur: `Storage.Attachment.Offload` → `Storage.Attachment.Restore`. Virkar bæði fyrir `DocumentAttachment`- og `IncomingDocument`-markmið.

### Reglur um búta (nákvæmar)

- Bútur er í mesta lagi `chunkSizeHint` **hrá** bæti (nú 49152, um 48 KB).
- Base64-kóðaðu hvern bút **sjálfstætt**; base64-kóðaðu aldrei alla skrána og skiptu textanum síðan niður — þá væri ekki hægt að afkóða bútamörkin.
- `sequence` byrjar á 1 og verður að vera samfellt án bila þegar Commit er kallað; ef runa er send aftur kemur hún í stað þess búts (endurtekningar eru öruggar).
- Sendu `declaredSize` (heildarfjölda bæta) í Begin svo Commit geti staðfest að ekkert hafi tapast.
- Lota er einkaeign kallanda og er eytt sjálfkrafa ef henni er aldrei lokið með Commit.

## Beining

Hver beiðni ber **`storageCode`** sem velur línu í **`Bifrost Storage Setup`**. Hver lína tengir kóðann við skráðan skráarreikning í Business Central (tengil og reikning) og valfrjálst **`Base Path`**-forskeyti sem er sett framan við hverja slóð. Tengilforritin sjá um auðkenningu og leyndarmál — þessi tengill geymir aldrei aðgangsupplýsingar.

Finndu uppsetta kóða með `Storage.Account.List`. Gildin `path`, `sourcePath` og `targetPath` eru miðuð við grunnslóð tengingarinnar og nota skástrik (t.d. `dir/sub/file.txt`).

## Svarumslag

Allar skilaboðategundir skila sama umslagi:

- Tókst — `{ "status": "Success", "data": { ... } }`
- Villa — `{ "status": "Error", "error": "<message>" }`

Innihald skráar er borið sem base64 í `contentBase64`. Tilvistarkannanir skila `{ "path": ..., "exists": true|false }`.

## Skilaboðategundir

### Uppgötvun

| Skilaboðategund | Nauðsynlegar færibreytur | Lýsing |
|---|---|---|
| `Help.Storage.Get` | _engin_ | Skilar þessu yfirliti í Markdown. |
| `Storage.Account.List` | _engin_ | Listar uppsettar geymslutengingar (kóða og tengla; engin leyndarmál). |

### Skrár

| Skilaboðategund | Nauðsynlegar færibreytur | Lýsing |
|---|---|---|
| `Storage.File.Exists` | `storageCode`, `path` | Segir til um hvort skrá sé til. |
| `Storage.File.Get` | `storageCode`, `path` | Hleður niður skrá sem base64. |
| `Storage.File.Create` | `storageCode`, `path`, `contentBase64` | Hleður upp skrá (skrifar yfir þar sem það er stutt). |
| `Storage.File.Delete` | `storageCode`, `path` | Eyðir skrá. |
| `Storage.File.Copy` | `storageCode`, `sourcePath`, `targetPath` | Afritar skrá. |
| `Storage.File.Move` | `storageCode`, `sourcePath`, `targetPath` | Flytur (endurnefnir) skrá. |
| `Storage.File.List` | `storageCode`, `path` | Listar skrárnar í möppu. |

### Möppur

| Skilaboðategund | Nauðsynlegar færibreytur | Lýsing |
|---|---|---|
| `Storage.Directory.Exists` | `storageCode`, `path` | Segir til um hvort mappa sé til. |
| `Storage.Directory.Create` | `storageCode`, `path` | Býr til möppu. |
| `Storage.Directory.Delete` | `storageCode`, `path` | Eyðir möppu. |
| `Storage.Directory.List` | `storageCode`, `path` | Listar undirmöppur möppu. |

### Viðhengi

Flyttu skrá Business Central-viðhengis út í geymslu og aftur til baka. Á meðan skráin er í geymslu er hún fjarlægð úr gagnagrunninum en er áfram aðgengileg núverandi ferlum á gagnsæjan hátt.

| Skilaboðategund | Nauðsynlegar færibreytur | Lýsing |
|---|---|---|
| `Storage.Attachment.Offload` | `target`, `systemId`, `storageCode` | Flytur skrá viðhengis í geymslu og hreinsar hana úr gagnagrunninum. |
| `Storage.Attachment.Restore` | `target`, `systemId` | Sækir skrá útflutts viðhengis aftur inn í gagnagrunninn og eyðir afritinu í geymslunni. |
| `Storage.Attachment.CreateLinked` | `storageCode`, `path`, `fileName` | Tengir skrá sem þegar er í geymslu við nýtt eða fyrirliggjandi innkomið fylgiskjal; hún er afgreidd á gagnsæjan hátt úr geymslunni. |
| `Storage.Attachment.CreateForRecord` | `tableId`/`tableName`, `no`/`recordSystemId`, innihaldsuppruni | Býr til fylgiskjalsviðhengi á hvaða færslu sem er (viðskiptamann, lánardrottin, eign, fjárhagsreikning, ...) úr innfelldu base64, úr geymslu eða með því að afrita fyrirliggjandi viðhengi. |

`target` er `IncomingDocument` eða `DocumentAttachment`; `systemId` er SystemId viðhengisfærslunnar. `Storage.Attachment.Offload` tekur einnig við valfrjálsu `folderPath` (ein eða fleiri undirmöppur) sem ræður hvar skráin er geymd; skráarheitinu er bætt við sjálfkrafa. Ef því er sleppt fyrir innkomið fylgiskjal fæst sjálfgefin slóð sem auðvelt er að rata um — `bifrost-attachments/incoming-documents/{year}/{entry no.}/{file name}` — svo rekja megi blob-skrána aftur til fylgiskjalsins.

`Storage.Attachment.CreateForRecord` tilgreinir hýsilfærsluna með `tableId`/`tableName` ásamt `no` eða `recordSystemId`. Hún tekur við þremur innihaldsuppruna — innfelldu base64, skrá í geymslu eða afriti af fyrirliggjandi viðhengi — en nákvæmlega einum í hverju kalli. Töflur með einum Code-aðallykli (Customer, Vendor, Fixed Asset, G/L Account, Bank Account, ...) má tilgreina með `no`; allar aðrar nota `recordSystemId`.

### Upphleðsla í bútum

Sendu stóra skrá sem röð lítilla búta þegar hún er of stór fyrir eitt `Storage.File.Create`-kall eða eina innfellda `content`-færibreytu. Hefðu lotu, bættu skránni við í bútum (um 48 KB af hráum bætum hver, base64-kóðuð) og ljúktu svo með Commit — annaðhvort í ytri geymslu eða beint sem viðhengi á færslu.

| Skilaboðategund | Nauðsynlegar færibreytur | Lýsing |
|---|---|---|
| `Storage.Upload.Begin` | `fileName` (+ valfrjálst `storageCode`) | Opnar lotu og skilar `uploadId`. Slepptu `storageCode` fyrir lotu sem notar eingöngu biðminni. |
| `Storage.Upload.Append` | `uploadId`, `sequence`, `contentBase64` | Bætir við einum bút (ef runa er send aftur kemur hún í stað hans). |
| `Storage.Upload.Commit` | `uploadId` | Setur bútana saman og skrifar skrána í ytri geymslu (krefst `storageCode` á lotunni). |
| `Storage.Upload.CommitToRecord` | `uploadId`, færsluvistfang | Setur bútana saman og tengir beint við færslu án ytri geymslu. |
| `Storage.Upload.Abort` | `uploadId` | Fleygir lotunni án þess að skrifa. |
| `Storage.Upload.Status` | `uploadId` | Segir til um framvindu og stöðu. |

Hver upphleðslulota er einkaeign notandans sem stofnaði hana, svo samtímis kallendur sjá aldrei búta hvers annars sem eru í vinnslu. Lotum sem ekki er lokið með Commit er eytt sjálfkrafa samkvæmt varðveislureglu.

Sæktu hjálparskjalið fyrir hvaða skilaboðategund sem er til að fá alla færibreytutöfluna, dæmi um beiðni og svar og algengar villur.

## Athugasemdir um tengilinn

- **Reikningar eru skráðir í Business Central.** Settu upp tengla og reikninga í hefðbundinni uppsetningu skráarreikninga; þessi tengill vísar í þá með auðkenni og geymir aldrei aðgangsupplýsingar.
- **Hegðun mappa fer eftir tenglinum.** Hlutageymslur á borð við Azure Blob hafa engar raunverulegar möppur — sumir tenglar líkja eftir þeim með núll-bæta staðgengilsmerkjum, aðrir telja möppu aðeins til þegar hún inniheldur skrá. Notaðu `Storage.Directory.Exists` til að staðfesta í stað þess að gefa þér það.
- **Create skrifar yfir.** `Storage.File.Create` kemur í stað fyrirliggjandi skrár hjá tenglum sem styðja yfirskrift.
- **Slóðir geta verið háðar há- og lágstöfum** í skýjabakendum — notaðu nákvæmlega sama rithátt og í geymslunni.
- **Útflutt viðhengi haldast gagnsæ.** Eftir `Storage.Attachment.Offload` halda ferlar sem lesa skrána með hefðbundnum aðgangsleiðum áfram að virka; innihaldið er sótt úr geymslunni eftir þörfum. Ef geymslutengingin er ekki tiltæk mistekst lesturinn í stað þess að tómri skrá sé skilað.

## Afmörkun fyrstu útgáfu

- Hjálparskjölin eru samin sem véllesanlegar leiðbeiningar um köll og fyrirsjáanlega keðjun beiðna.
- Tengillinn fer vísvitandi í gegnum uppsetta External File Storage-reikninga og sér ekki um aðgangsupplýsingar.
- Skilaboðasamningar fylgja sameiginlegu svarumslagi Bifrost með `status` og annaðhvort `data` eða `error`.

