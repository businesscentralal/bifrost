---
id: incoming-documents
title: "Incoming document message types"
sidebar_position: 11
---

**Yfirlægja skjal:** [API_Reference.md](/foundation/reference/api/)  
**Innleiðingarmappa:** `app/src/Message Type/Implementations/IncomingDocument/`

---

## Yfirlit

Þetta skjal lýsir skilaboðategundum innkomandi skjala í Bifröst API. Þessar skilaboðategundir ná yfir allt líftíma innkomandi skjals í Business Central — frá móttöku skráar, yfir viðbótarviðhengi, afgreiðslu yfir í kaupnótu eða dagbókarlínu, og að fyrirspurn um skjalið og viðhengi þess.

| Skilaboðategund | Stefna | Tilgangur | Tengdar töflur |
|-----------------|--------|-----------|----------------|
| Incoming.Document.Create | Inn | Stofnar nýtt innkomandi skjal með aðalviðhengi | Incoming Document (130), Incoming Document Attachment (133) |
| Incoming.Document.Attach | Inn | Bætir viðbótarviðhengjum við innkomandi skjal | Incoming Document Attachment (133) |
| Incoming.Document.Process | Inn | Afgreiðir innkomandi skjal og stofnar kaupnótu eða dagbókarlínu | Incoming Document (130) |
| Incoming.Document.Get | Út | Sækir innkomandi skjal með hausupplýsingum og öllum viðhengjum | Incoming Document (130), Incoming Document Attachment (133) |
| Incoming.Document.SetDefault | Inn | Stillir sjálfgefið (aðal) viðhengi á innkomandi skjali | Incoming Document (130), Incoming Document Attachment (133) |

**Dæmigerð vinnuflæðið:**
1. Kallaðu á `Incoming.Document.Create` til að hlaða upp aðalskrá og stofna innkomandi skjalið.
2. Kallaðu valfrjálst á `Incoming.Document.Attach` einu sinni eða oftar til að bæta við fylgigögnum.
3. Kallaðu á `Incoming.Document.Process` til að stofna kaupnótu eða dagbókarlínu úr skjalinu.
4. Kallaðu á `Incoming.Document.Get` hvenær sem er til að sækja núverandi stöðu skjalsins og öll viðhengi.
5. Kallaðu á `Incoming.Document.SetDefault` til að breyta hvaða viðhengi er aðalviðhengið (sjálfgefið).

---

## Incoming.Document.Create

**Stefna:** Inn  
**Hlutaauðkenni:** Codeunit 10078113 (`IncomingDoc Create Impl ori`), Codeunit 10077961 (`IncomingDoc Create Help ori`)

### Tilgangur

Stofnar nýtt innkomandi skjal í Business Central með aðalviðhengi. Innihald skráarinnar verður að vera gefið upp sem Base64-kóðaður strengur ásamt skráarheiti.

### Beiðnisnið

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Create",
  "source": "MyApp v1.0",
  "data": "{\"fileName\":\"reikningur.pdf\",\"fileContent\":\"<base64-kóðað innihald>\"}"
}
```

#### Reitir beiðni

| Reitur | Tegund | Nauðsynlegt | Lýsing |
|--------|--------|-------------|--------|
| fileName | Texti | Já | Skráarheiti með viðskeyti |
| fileContent | Texti | Já | Base64-kóðað innihald skráar |

### Svarsnið

```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineNo": 10000,
  "description": "Innkaup frá Fabrikam",
  "documentDate": "2026-04-01",
  "dueDate": "",
  "vendorNo": "V10000",
  "vendorName": "Fabrikam Inc.",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": {},
  "error": []
}
```

#### Reitir svars

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| status | Texti | `"Success"` við velgengni, `"Error"` við villu |
| entryNo | Heiltala | Færslunúmer hins stofnaða innkomandi skjals |
| id | Texti | SystemId (GUID án sviga) hins stofnaða innkomandi skjals |
| lineNo | Heiltala | Línunúmer aðalviðhengisins |
| description | Texti | Lýsing innkomandi skjalsins |
| documentDate | Texti | Dagsetning skjals á ISO sniði |
| dueDate | Texti | Gjalddagi á ISO sniði |
| vendorNo | Texti | Lánardrottnanúmer tengt skjalinu |
| vendorName | Texti | Nafn lánardrottins tengt skjalinu |
| documentStatus | Texti | Núverandi staða innkomandi skjalsins |
| dataExchangeType | Texti | Gagnaskiptigerð notuð við vinnslu |
| processed | Boolean | Hvort skjalið hefur verið unnið |
| posted | Boolean | Hvort skjalið hefur verið bókað |
| record | Hlutur | Tengd BC færsla (tómur hlutur ef engin) |
| error | Fylki | Villuskilaboð frá innkomandi skjalinu (tómt fylki ef engin). Sjá [Reitir villuboðahlutarins](#reitir-villuboðahlutarins) í Incoming.Document.Process fyrir fulla lýsingu |

### Villutilfelli

| Villa | Orsök |
|-------|-------|
| `fileName is required.` | Reiturinn `fileName` vantar eða er tómur |
| `fileContent is required.` | Reiturinn `fileContent` vantar eða er tómur |

---

## Incoming.Document.Attach

**Stefna:** Inn  
**Hlutaauðkenni:** Codeunit 10078112 (`IncomingDoc Attach Impl ori`), Codeunit 10077960 (`IncomingDoc Attach Help ori`)

### Tilgangur

Bætir viðbótarviðhengi við innkomandi skjal sem þegar er til. Skjalið er auðkennt með færslunúmeri eða SystemId í **subject** reitnum. Innihald skráar verður að vera gefið upp sem Base64-kóðaður strengur.

### Beiðnisnið

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Attach",
  "source": "MyApp v1.0",
  "subject": "1001",
  "data": "{\"fileName\":\"fylgiseðill.xml\",\"fileContent\":\"<base64-kóðað innihald>\"}"
}
```

#### Reitir beiðni

| Reitur | Tegund | Nauðsynlegt | Lýsing |
|--------|--------|-------------|--------|
| fileName | Texti | Já | Skráarheiti með viðskeyti |
| fileContent | Texti | Já | Base64-kóðað innihald skráar |

### Svarsnið

```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineNo": 20000,
  "description": "Innkaup frá Fabrikam",
  "documentDate": "2026-04-01",
  "dueDate": "2026-04-30",
  "vendorNo": "V10000",
  "vendorName": "Fabrikam Inc.",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": {},
  "error": []
}
```

#### Reitir svars

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| status | Texti | `"Success"` við velgengni, `"Error"` við villu |
| entryNo | Heiltala | Færslunúmer innkomandi skjalsins |
| id | Texti | SystemId (GUID án sviga) innkomandi skjalsins |
| lineNo | Heiltala | Línunúmer nýja viðhengisins |
| description | Texti | Lýsing innkomandi skjalsins |
| documentDate | Texti | Dagsetning skjals á ISO sniði |
| dueDate | Texti | Gjalddagi á ISO sniði |
| vendorNo | Texti | Lánardrottnanúmer tengt skjalinu |
| vendorName | Texti | Nafn lánardrottins tengt skjalinu |
| documentStatus | Texti | Núverandi staða innkomandi skjalsins |
| dataExchangeType | Texti | Gagnaskiptigerð notuð við vinnslu |
| processed | Boolean | Hvort skjalið hefur verið unnið |
| posted | Boolean | Hvort skjalið hefur verið bókað |
| record | Hlutur | Tengd BC færsla (tómur hlutur ef engin) |
| error | Fylki | Villuskilaboð frá innkomandi skjalinu (tómt fylki ef engin). Sjá [Reitir villuboðahlutarins](#reitir-villuboðahlutarins) í Incoming.Document.Process fyrir fulla lýsingu |

### Villutilfelli

| Villa | Orsök |
|-------|-------|
| `fileName is required.` | Reiturinn `fileName` vantar eða er tómur |
| `fileContent is required.` | Reiturinn `fileContent` vantar eða er tómur |
| `Incoming Document X not found.` | Subject passar ekki við neitt innkomandi skjal |

---

## Incoming.Document.Process

**Stefna:** Inn  
**Hlutaauðkenni:** Codeunit 10078116 (`IncomingDoc Process Impl ori`), Codeunit 10077963 (`IncomingDoc Process Help ori`)

### Tilgangur

Afgreiðir innkomandi skjal með hefðbundnu OCR/skjalvinnsluflæði Business Central, sem reynir að stofna kaupnótu eða dagbókarlínu úr skjalinu.

### Beiðnisnið

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Process",
  "source": "MyApp v1.0",
  "subject": "1001"
}
```

Eða með SystemId:

```json
{
  "subject": "{a1b2c3d4-e5f6-7890-abcd-ef1234567890}"
}
```

### Svarsnið

```json
{
  "status": "Success",
  "record": {
    "tableNo": 38,
    "tableName": "Purchase Header",
    "tableCaption": "Purchase Header",
    "recordSystemId": "c3d4e5f6-a1b2-7890-abcd-ef1234567890"
  },
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

Ef afgreiðsla mistekst kemur `"status": "Error"` ásamt `"error"` fylki sem inniheldur BC-villuboð sem útskýra hvers vegna afgreiðslan náði ekki stöðunni `Status = Created`.

#### Reitir svars

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| status | Texti | `"Success"` þegar `Incoming Document.Status = Created` eftir afgreiðslu; `"Error"` annars |
| entryNo | Heiltala | Færslunúmer afgreiddra innkomandi skjals |
| id | Texti | SystemId (GUID án sviga) afgreidds innkomandi skjals |
| record | Hlutur | Til staðar við velgengni. Taflaupplýsingar um tengt BC-skjal stofnað úr innkomandi skjalinu |
| error | Fylki | Til staðar við villu. Fylki BC-villuboðahluta sem útskýra hvers vegna afgreiðslan náði ekki stöðunni `Status = Created` |

##### Reitir record-hlutarins

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| tableNo | Heiltala | Töflunúmer tengds BC-skjals (t.d. 38 fyrir Purchase Header, 81 fyrir Gen. Journal Line) |
| tableName | Texti | Innra heiti tengdu töflunnar |
| tableCaption | Texti | Þýddur titill tengdu töflunnar |
| recordSystemId | Texti | SystemId (GUID án sviga) tengds BC-skjals |

##### Reitir villuboðahlutarins

Hver hlutur í `error` fylkinu hefur eftirfarandi reiti:

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| id | Heiltala | Auðkenni villuboðs |
| message | Texti | Texti villuboðs |
| type | Texti | Tegund skilaboða (t.d. `"Error"`, `"Warning"`) |
| table | Hlutur | Upprunatafla — `{ "id": <tableNo>, "name": "<tableName>" }` |
| field | Hlutur | Upprunareitur — `{ "id": <fieldNo>, "name": "<fieldName>" }` |
| context | Hlutur | Samhengi — `{ "tableNumber": <int>, "fieldNumber": <int>, "fieldName": "<text>" }` |
| additionalInformation | Texti | Viðbótarupplýsingar úr villuboðinu |

### Villutilfelli

| Villa | Orsök |
|-------|-------|
| `Incoming Document X not found.` | Subject passar ekki við neitt innkomandi skjal |
| `Incoming Document X has already been posted.` | Tengt skjal innkomandi skjalsins hefur verið bókað |

---

## Incoming.Document.Get

**Stefna:** Út  
**Hlutaauðkenni:** Codeunit 10078114 (`IncomingDoc Get Impl ori`), Codeunit 10077962 (`IncomingDoc Get Help ori`)

### Tilgangur

Sækir hausupplýsingar og öll skráarviðhengi innkomandi skjals. Viðhengjum er skipt í `mainAttachment` hlut og `additionalAttachments` fylki. Innihald skráa er skilað sem Base64-kóðaðir strengir.

### Beiðnisnið

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Get",
  "source": "MyApp v1.0",
  "subject": "1001"
}
```

Eða með SystemId:

```json
{
  "subject": "{a1b2c3d4-e5f6-7890-abcd-ef1234567890}"
}
```

Reiturinn **subject** tekur við annað hvort:
- Færslunúmeri (heiltölu sem texta, t.d. `"1001"`)
- SystemId GUID (með eða án sviga)

### Svarsnið

```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "description": "Innkaup frá Fabrikam",
  "documentDate": "2026-04-01",
  "dueDate": "2026-04-30",
  "vendorNo": "V10000",
  "vendorName": "Fabrikam Inc.",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": {
    "tableNo": 38,
    "tableName": "Purchase Header",
    "tableCaption": "Purchase Header",
    "recordSystemId": "c3d4e5f6-a1b2-7890-abcd-ef1234567890"
  },
  "error": [],
  "mainAttachment": {
    "lineNo": 10000,
    "fileName": "reikningur.pdf",
    "fileContent": "<base64-kóðað innihald skráar>"
  },
  "additionalAttachments": [
    {
      "lineNo": 20000,
      "fileName": "fylgiseðill.xml",
      "fileContent": "<base64-kóðað innihald skráar>"
    }
  ]
}
```

#### Reitir hauss í svari

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| status | Texti | `"Success"` við velgengni, `"Error"` við villu |
| entryNo | Heiltala | Færslunúmer innkomandi skjals |
| id | Texti | SystemId (GUID án sviga) |
| description | Texti | Lýsing á innkomandi skjali |
| documentDate | Dagsetning | Dagsetning skjals á ISO-sniði (yyyy-MM-dd) |
| dueDate | Dagsetning | Gjalddagi á ISO-sniði (yyyy-MM-dd) |
| vendorNo | Kóði | Númer lánardrottins á innkomandi skjali |
| vendorName | Texti | Heiti lánardrottins á innkomandi skjali |
| documentStatus | Texti | Staða: `New`, `Released`, `Rejected` eða `Posted` |
| dataExchangeType | Texti | Kóði gagnaskiptigerðar sem er stilltur á innkomandi skjalinu |
| processed | Boolean | Hvort skjalið hafi verið afgreitt |
| posted | Boolean | Hvort tengt skjal hafi verið bókað |
| record | Hlutur | Upplýsingar um tengt BC-skjal (tableNo, tableName, tableCaption, recordSystemId). Tómur hlutur ef ekkert skjal er tengt |
| error | Fylki | BC villuboð frá innkomandi skjali. Tómt fylki ef engar villur. Sjá [Reitir villuboðahlutarins](#reitir-villuboðahlutarins) í Incoming.Document.Process fyrir fulla lýsingu |

##### Reitir record-hlutarins

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| tableNo | Heiltala | Töflunúmer tengds BC-skjals (t.d. 38 fyrir Purchase Header) |
| tableName | Texti | Innra heiti tengdu töflunnar |
| tableCaption | Texti | Þýddur titill tengdu töflunnar |
| recordSystemId | Texti | SystemId (GUID án sviga) tengds BC-skjals |

#### Reitir viðhengja (mainAttachment og færslur í additionalAttachments)

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| lineNo | Heiltala | Línunúmer viðhengis |
| fileName | Texti | Skráarheiti með viðskeyti (t.d. `reikningur.pdf`) |
| fileContent | Texti | Base64-kóðað innihald skráar |

### Athugasemdir

- Hluturinn `mainAttachment` er **sleppt** úr svari ef innkomandi skjalið er án aðalviðhengis.
- Fylkið `additionalAttachments` er tómt (`[]`) ef engin viðbótarviðhengi eru til staðar.
- Hluturinn `record` inniheldur upplýsingar um tengt BC-skjal þegar slíkt er til staðar.
- Fylkið `error` inniheldur BC villuboð sem tengjast innkomandi skjalinu.
- Innihald skráa er alltaf Base64-kóðað; kallari verður að afkóða áður en hann notar það.

### Villutilfelli

| Villa | Orsök |
|-------|-------|
| `Incoming Document X not found.` | Subject passar ekki við neitt innkomandi skjal |

---

## Incoming.Document.SetDefault

**Stefna:** Inn  
**Hlutaauðkenni:** Codeunit 10078118 (`IncomingDoc SetDef Impl ori`), Codeunit 10078117 (`IncomingDoc SetDef Exec ori`), Codeunit 10077964 (`IncomingDoc SetDef Help ori`)

### Tilgangur

Stillir sjálfgefið (aðal) viðhengi á innkomandi skjali sem þegar er til. Tilgreint viðhengi er eytt og sett inn á nýtt sem fyrsta viðhengið (línunúmer 10000) með fánann Aðalviðhengi (Main Attachment) stillt á satt. Öll önnur viðhengi eru sett inn á eftir í upprunalegri röð.

### Beiðnisnið

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.SetDefault",
  "source": "MyApp v1.0",
  "subject": "1001",
  "data": "{\"lineNo\": 20000}"
}
```

Eða með SystemId:

```json
{
  "subject": "{a1b2c3d4-e5f6-7890-abcd-ef1234567890}",
  "data": "{\"lineNo\": 20000}"
}
```

#### Reitir beiðni

| Reitur | Tegund | Nauðsynlegt | Lýsing |
|--------|--------|-------------|--------|
| lineNo | Heiltala | Já | Línunúmer viðhengisins sem á að stilla sem sjálfgefið (aðal) viðhengi |

### Svarsnið

```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

#### Reitir svars

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| status | Texti | `"Success"` við velgengni, `"Error"` við villu |
| entryNo | Heiltala | Færslunúmer innkomandi skjalsins |
| id | Texti | SystemId (GUID án sviga) innkomandi skjalsins |

### Athugasemdir

- Innkomandi skjalið verður að hafa a.m.k. 2 viðhengi. Ef færri en 2 eru til staðar kemur villa.
- Öllum viðhengjum er eytt og þeim sett inn á ný: tilgreint viðhengi verður línunúmer 10000 (aðal), restin fylgir á 20000, 30000, o.s.frv.
- Innihald skráa (BLOB gögn) er varðveitt við endurröðun.
- Upprunaleg hlutfallsleg röð annarra viðhengja er varðveitt.

### Villutilfelli

| Villa | Orsök |
|-------|-------|
| `lineNo is required.` | Reiturinn `lineNo` vantar úr beiðninni |
| `Attachment with lineNo X not found.` | Ekkert viðhengi með tilgreindu línunúmeri finnst á skjalinu |
| `At least 2 attachments are required to set a default.` | Skjalið er með færri en 2 viðhengi |
| `Incoming Document X not found.` | Subject passar ekki við neitt innkomandi skjal |
