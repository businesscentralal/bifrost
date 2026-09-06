---
id: approval
title: "Approval message types"
sidebar_position: 9
---

**Yfirskjal:** [API_Reference.md](/foundation/reference/api/)  
**Útfærslumappa:** `app/src/Message Type/Implementations/Approval/`

---

## Yfirlit

Þetta skjal lýsir samþykktarskilaboðategundunum í Bifröst API. Þessar skilaboðategundir bjóða upp á aðgerðir til að stofna og sækja samþykktarfærslur og tengd samþykktarverkferli úr Business Central.

| Skilaboðategund | Stefna | Tilgangur | Tengdar töflur |
| --- | --- | --- | --- |
| Document.Approval.Get | Útlæg | Sækir samþykktarfærslur með tengdum samþykktaraðgerðum og heimildasíu | Approval Log ori (10077885), Approval Entry, Posted Approval Entry |
| Document.Approval.Send | Innlæg | Stofnar samþykktarfærslur fyrir skjal með samþykktaraðilaúthlutunum og upphæðaútreikningi | Sales Header (36), Purchase Header (38), Incoming Document (130) |
| Document.Approval.Approve | Innlæg | Samþykkir eina eða fleiri opnar samþykktarfærslur með valfrjálsri athugasemd | Approval Entry (455), Approval Comment Line (455) |
| Document.Approval.Reject | Innlæg | Hafnar einni eða fleiri opnum samþykktarfærslum með valfrjálsri athugasemd | Approval Entry (455), Approval Comment Line (455) |
| Document.Approval.Me | Útlæg | Sækir samþykktarfærslur sem eru úthlutaðar á núverandi notanda með blaðsíðustjórnun og heimildasíu | Approval Entry (455) |
| Document.Approval.Delegate | Innlæg | Framselur eina eða fleiri opnar samþykktarfærslur á annan notanda | Approval Entry (455), User Setup |
| Document.Approval.Cancel | Innlæg | Afturkallar allar opnar samþykktarfærslur fyrir skjal og opnar það aftur | Approval Entry (455), Sales Header (36), Purchase Header (38), Incoming Document (130) |

---

## Document.Approval.Get

**Tilgangur:** Sækja samþykktarfærslur úr Bifröst samþykktarskrá með tengdum virkum og bókuðum samþykktarfærslum.

**Lýsing:** Skilar samþykktarfærslum með heimildasíu á hverja færslu. Hver færsla vísar til tengdrar BC-töflu (t.d. Sales Header, Purchase Header). Aðeins færslur sem notandinn hefur leseheimild á koma í niðurstöður — færslur þar sem leseheimild vantar eru útilokaðar. Hver færsla inniheldur tengdar virkar samþykktarfærslur og bókaðar (sögulegar) samþykktarfærslur sem passa við Table ID, Record ID og Approval Code.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

```json
{
  "skip": 0,
  "take": 50,
  "tableView": "SORTING(Entry No.) WHERE(Table ID=CONST(36))"
}
```

**Færibreytur beiðni:**

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
| --- | --- | --- | --- |
| skip | Integer | Nei | Fjöldi færslna til að sleppa (sjálfgefið: 0) |
| take | Integer | Nei | Hámarksfjöldi færslna til að skila (sjálfgefið: 100) |
| tableView | Text | Nei | AL table view síunaryrðing á Approval Log ori töfluna |

**Snið svars:**

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "lastModified": "2025-01-15T10:30:00Z",
      "approvalType": "Send",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "e5f6g7h8-i9j0-1234-abcd-ef1234567890",
      "approvalCode": "CE00000000001",
      "request": {
        "customerNo": "10000",
        "amount": 5000.00
      },
      "linkedApprovalEntries": [
        {
          "entryNo": 1,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "S-ORD-1001",
          "status": "Open",
          "approverId": "ADMIN",
          "dueDate": "2025-02-01",
          "currency": "USD",
          "amount": "5000.00",
          "amountLCY": "5000.00",
          "comments": [],
          "lastModified": "2025-01-15T10:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [
        {
          "entryNo": 2,
          "sequenceNo": 1,
          "documentNo": "S-INV-1001",
          "status": "Approved",
          "approverId": "ADMIN",
          "dueDate": "2025-02-01",
          "currency": "USD",
          "amount": "5000.00",
          "amountLCY": "5000.00",
          "comments": [],
          "lastModified": "2025-01-15T10:30:00Z"
        }
      ]
    }
  ]
}
```

**Svarreitir:**

### Yfirflokkur

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| status | Text | Vinnslustaða (`"Success"` eða `"Error"`) |
| noOfRecords | Integer | Heildarfjöldi samþykktarfærslna í skrá (fyrir heimildasíu) |
| result | Array | Fylki af samþykktarfærsluhlutum |

### Samþykktarfærsla

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| id | GUID | SystemId samþykktarfærslu |
| lastModified | DateTime | Síðast breytt tímastimpill (ISO 8601, Format 9) |
| approvalType | Text | Tegund samþykktaraðgerðar. Möguleg gildi: `Send`, `Approve`, `Reject`, `Delegate`, `Cancel` |
| tableId | Integer | Tafla-ID færslunnar sem er til samþykktar |
| tableName | Text | Heiti tengdrar töflu (t.d. `"Sales Header"`) |
| tableCaption | Text | Staðfært yfirskrift tengdrar töflu |
| recordSystemId | GUID | SystemId færslunnar sem er til samþykktar |
| approvalCode | Code[20] | Sjálfvirkt mynduð samþykktarkóði (snið: `CE00000000001`) |
| request | Object | Upprunalegt beiðni-JSON gagnasafn sem var vistað með samþykktarfærslunni |
| linkedApprovalEntries | Array | Virkar samþykktarfærslur tengdar þessari færslu og samþykktarkóða |
| linkedPostedApprovalEntries | Array | Bókaðar (sögulegar) samþykktarfærslur tengdar þessari færslu og samþykktarkóða |

### Reitir tengdra samþykktarfærsla

Þessir reitir eru sameiginlegir fyrir bæði `linkedApprovalEntries` og `linkedPostedApprovalEntries` nema annað sé tekið fram.

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| entryNo | Integer | Færslunúmer |
| sequenceNo | Integer | Raðnúmer innan samþykktarverkferlisins |
| documentType | Text | Tegund samþykktarskjals. **Aðeins í virkum færslum** — ekki til staðar í bókuðum færslum |
| documentNo | Text | Skjalanúmer |
| status | Text | Staða samþykktar (t.d. `Open`, `Approved`, `Rejected`, `Canceled`, `Created`) |
| approverId | Text | Kenni samþykktaraðila |
| lastModified | DateTime | Síðast breytt tímastimpill (ISO 8601, Format 9) |
| dueDate | Date | Gjalddagi samþykktar (ISO 8601, Format 9) |
| currency | Code[10] | Gjaldmiðilskóði. Notar LCY kóða úr Fjárhagur uppsetning ef færslan hefur engan gjaldmiðilskóða |
| amount | Decimal | Upphæð í gjaldmiðli skjals (Format 9) |
| amountLCY | Decimal | Upphæð í staðargjaldmiðli (Format 9) |
| comments | Array | Strengjafylki athugasemda tengdra samþykktarfærslu |

---

## Heimildasíun

Útfærslan beitir tvöfaldri heimildasíu:

1. **Töfluheimildasíun:** Fyrir hverja samþykktarfærslu athugar útfærslan hvort notandinn hafi `ReadPermission()` á tengdri töflu (skilgreind af Table ID). Færslur sem vísa til taflna sem notandinn getur ekki lesið eru útilokaðar.

2. **Færsluheimildasíun:** Eftir staðfestingu á töfluheimild beitir útfærslan `SetPermissionFilter()` á tengdri töflu og sannreynir að viðkomandi færsla sé aðgengileg. Þetta tryggir að línuheimildir (t.d. víddasíur) séu virtar.

3. **Heimildasíun á tengdar færslur:** `linkedApprovalEntries` og `linkedPostedApprovalEntries` fylkin eru aðeins fyllt út ef notandinn hefur `ReadPermission()` á viðkomandi Approval Entry / Posted Approval Entry töflunum.

`noOfRecords` reiturinn skilar heildarfjölda úr samþykktarskránni (þ.m.t. færslur sem gætu verið síaðar út vegna heimilda), sem gefur leið til að greina hvort heimildasíun eigi sér stað.

---

## Approval Log ori tafla

`Approval Log ori` (tafla 10077885) geymir samþykktarverkferilsatburði. Hver færsla inniheldur:

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| Entry No. | Integer | Sjálfvirkt raðnúmer (aðallykill) |
| Table ID | Integer | BC tafla-ID færslunnar sem er til samþykktar |
| Record ID to Approve | RecordId | Fullt BC færsluauðkenni |
| Record SystemId to Approve | GUID | SystemId færslunnar sem er til samþykktar |
| Approval Code | Code[20] | Sjálfvirkt mynduð verkferilsauðkenni |
| Request | Blob | Upprunalegt beiðni-JSON gagnasafn |
| Approval Type | Enum | Tegund samþykktaraðgerðar (sjá gildi hér að neðan) |

### Gildi Approval Type

| Gildi | Raðtala | Lýsing |
| --- | --- | --- |
| Send | 0 | Samþykktarbeiðni hefur verið stofnuð og send |
| Approve | 2 | Beiðni hefur verið samþykkt |
| Reject | 3 | Beiðni hefur verið hafnað |
| Delegate | 4 | Beiðni hefur verið framseld til annars samþykktaraðila |
| Cancel | 5 | Samþykktarbeiðni hefur verið afturkölluð |

---

## Villumeðhöndlun

| Atburðarás | Hegðun |
| --- | --- |
| Óstudd skilaboðaútgáfa | Villa frá `AssertVersion1()` |
| Ógilt tableView segð | Stöðluð BC villa frá `SetView()` |
| Engar færslur fundust | Skilar `"status": "Success"` með tómu `result` fylki og `noOfRecords: 0` |
| Allar færslur síaðar vegna heimilda | Skilar `"status": "Success"` með tómu `result` fylki; `noOfRecords` sýnir ósíaðan fjölda |

---

## Tengdar skilaboðategundir

- **[Document.Approval.Get](#documentapprovalget)** — Sækir samþykktarfærslur sem þegar eru til
- **[Data.Records.Get](/foundation/message-types/data/#datarecordsget)** — Almenn færslusókn úr hvaða BC töflu sem er
- **[Sales.Document.Release](/foundation/message-types/sales/#salesdocumentrelease)** — Gefa út söluskjal til samþykktar
- **[Purchase.Document.Release](/foundation/message-types/purchase/#purchasedocumentrelease)** — Gefa út innkaupaskjal til samþykktar

---

## Document.Approval.Send

**Tilgangur:** Stofna samþykktarfærslur fyrir skjal úr JSON-beiðni sem inniheldur samþykktaraðilaúthlutanir með valfrjálsum upphæðaútreikningi á hverja línu.

**Lýsing:** Tekur við fylki af samþykktaraðilaúthlutunum fyrir tiltekið skjal. Hvert stök stofnar eina Approval Entry tengda við sameiginlega Approval Log ori færslu. Staða skjalsins er sett á Pending Approval eftir að færslur eru stofnaðar. Upphæðir eru reiknaðar sjálfkrafa úr skjalalínum — sendandinn þarf ekki að gefa upp upphæðir.

**Stefna skilaboða:** Innlæg

**Studdar töflur:**

| Tafla-ID | Nafn töflu |
| -------- | ---------- |
| 36 | Sales Header |
| 38 | Purchase Header |
| 130 | Incoming Document |

**Forsendur:**

| Krafa | Upplýsingar |
| ----- | ----------- |
| Heimildarsett | Notandinn sem sendir beiðnina verður að vera með **Approval Access ori** (10077891) heimildarsettið úthlutað. Án þess er beiðni hafnað með: `User <ID> does not have permissions to send documents to approval via Bifrost.` |
| User Setup ori | Hvert `approverUserId` verður að vera til í User Setup ori með gildum Salesperson Code |

**Inntaksfæribreytur:**

```json
{
  "tableId": 36,
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "approvals": [
    {
      "approverUserId": "JOHN",
      "sequenceNo": 1,
      "dueDate": "2025-01-15"
    },
    {
      "approverUserId": "JANE",
      "sequenceNo": 2,
      "lineNumbers": [10000, 20000]
    }
  ]
}
```

**Færibreytur beiðni:**

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
| --- | --- | --- | --- |
| tableId / tableNumber / tableName | Integer eða Text | Já | Auðkennir töfluna sem inniheldur skjalið |
| recordSystemId | GUID | Já | SystemId færslunnar |
| approvals | Array | Já | Fylki af samþykktaraðilaúthlutunum (sjá hér að neðan) |

**Stök samþykktarfylkis:**

| Færibreyta | Tegund | Nauðsynleg | Sjálfgefið | Lýsing |
| --- | --- | --- | --- | --- |
| approverUserId | Text | Já | — | Kenni samþykktaraðila (verður að vera til í User Setup ori fyrir Salesperson Code uppflettingu) |
| sequenceNo | Integer | Nei | 1 | Raðnúmer til að stýra samþykktarröð |
| dueDate | Date | Nei | Gjalddagi skjals | Hnekkja gjalddaga samþykktar |
| lineNumbers | Integer[] | Nei | Allar línur | Línunúmer skjals til að taka með í upphæðaútreikning. **Ekki stutt fyrir Incoming Documents** |

---

### Upphæðaútreikningur

Upphæðir eru fengnar úr skjalinu, ekki sendar af sendandanum.

**Sales Header / Purchase Header:**
- Reiknar `Amount Including VAT` með bókunarsamantektarkóðaeiningar BC (`SumSalesLines` / `SumPurchaseLines`)
- Ef uppsetning krefst `Calc. Inv. Discount` er reikningsafsláttur reiknaður fyrst
- Ef `lineNumbers` er tilgreint, eru aðeins þær skjalalínur teknar með í summu
- Gjaldmiðilskóði og stuðull koma úr skjalahausnum
- `Amount (LCY)` er reiknað með gjaldmiðilsstuðli skjalsins

**Incoming Document:**
- Notar `Amount Incl. VAT` beint af Incoming Document færslunni
- `lineNumbers` er **EKKI stutt** — að tilgreina þau veldur villu
- Ef skjalið er í erlendum gjaldmiðli er `Amount (LCY)` reiknað með gildandi gengi

---

### Stöðubreyting skjals

Eftir að samþykktarfærslur eru stofnaðar er staða skjalsins sett á **Pending Approval** í gegnum `ApprovalsMgmt.SetStatusToPendingApproval()`.

**Forsendur:**
- **Sales Header / Purchase Header**: Skjal verður að hafa línur og má EKKI vera í stöðunni `Released` eða `Pending Prepayment`
- **Incoming Document**: Skjal má EKKI vera í stöðunni `Posted`, `Rejected` eða `Released`

---

### Snið svars

Skilar stofnaðri Approval Log færslu með tengdum Approval Entries, í sama sniði og Document.Approval.Get.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2025-01-10T12:00:00Z",
      "approvalType": "Send",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "document-system-id",
      "approvalCode": "CE00000000001",
      "request": { "...upprunalega beiðnin..." },
      "linkedApprovalEntries": [
        {
          "entryNo": 1,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "S-ORD-001",
          "status": "Open",
          "approverId": "JOHN",
          "dueDate": "2025-01-15",
          "currency": "ISK",
          "amount": "50000",
          "amountLCY": "50000",
          "comments": [],
          "lastModified": "2025-01-10T12:00:00Z"
        }
      ],
      "linkedPostedApprovalEntries": []
    }
  ]
}
```

**Svarreitir:**

Svarið fylgir sama sniði og Document.Approval.Get. Sjá kaflann um [Snið svars](#snið-svars) hér að ofan fyrir reitarlýsingar.

---

### Hliðarverkanir

| Aðgerð | Lýsing |
| --- | --- |
| Stofnar Approval Log færslu | Ein `Approval Log ori` færsla með `Approval Type = Send` |
| Stofnar Approval Entries | Ein `Approval Entry` á hvert stak í `approvals` fylkinu |
| Uppfærir stöðu skjals | Setur skjal í Pending Approval |
| Vistar beiðni-JSON | Upprunalega beiðnin er vistuð í Approval Log `Request` BLOB |

---

### Villumeðhöndlun

| Atburðarás | Hegðun |
| --- | --- |
| Óstudd tafla | Villa sem listar studdar töflur (36, 38, 130) |
| Vantar recordSystemId | Villa: "Missing required 'recordSystemId' in request" |
| Færsla finnst ekki | Villa með SystemId og tafla-ID |
| Vantar approvals fylki | Villa: "Missing required 'approvals' array in request" |
| Vantar approverUserId | Villa með línuvísitölu viðkomandi staks |
| lineNumbers á Incoming Document | Villa: lineNumbers ekki stutt |
| Engar skjalalínur (Sales/Purchase) | Villa frá bókunarútreikningi BC |
| Skjal þegar Released/Pending Prepayment | Villa frá stöðustaðfestingu |
| Bilun í vinnslukóðaeiningu | Skilar villujson með `error` og `callstack` reitum |

---

## Document.Approval.Approve

```json
{
  "type": "Document.Approval.Approve",
  "subject": "5",
  "data": {
    "comment": "Samþykkt vegna fjárhagsáætlunar H2."
  }
}
```

Samþykkir eina eða fleiri opnar Approval Entry færslur með BC staðlaðri `Approvals Mgmt.` heimild og keðjuvinnslu.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

Uppfletting færslu fylgir forgangsröð: `entries` fylki > `entryNo`/`systemId` í beiðni-JSON > `subject` reitur.

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
| --- | --- | --- | --- |
| subject | Text | Nei | Færslunúmer (heiltala) eða SystemId (GUID) einstakrar samþykktarfærslu |
| entries | Array | Nei | Fylki af færslum til samþykktar (lotuvinnsla) |
| entries[].entryNo | Integer | Nei | Færslunúmer samþykktarfærslu |
| entries[].systemId | String (GUID) | Nei | SystemId samþykktarfærslu |
| entryNo | Integer | Nei | Færslunúmer fyrir einstaka færslu (í beiðni-JSON) |
| systemId | String (GUID) | Nei | SystemId fyrir einstaka færslu (í beiðni-JSON) |
| comment | String | Nei | Athugasemd við samþykkt (hámark 80 stafir), vistuð sem Approval Comment Line |

**Snið svars:**

Svarið notar sama log-wrapped snið og Document.Approval.Get. Hvert niðurstöðustak er full samþykktarfærsla með tengdum færslum, ásamt aðgerðarsértækum reitum.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2024-06-10T14:30:00Z",
      "approvalType": "Approve",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "approvalCode": "CE00000001",
      "request": {},
      "linkedApprovalEntries": [
        {
          "entryNo": 5,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "SO-001234",
          "status": "Approved",
          "approverId": "JOHN",
          "dueDate": "2024-06-15",
          "currency": "ISK",
          "amount": "150000",
          "amountLCY": "150000",
          "comments": [],
          "lastModified": "2024-06-10T14:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "entryNo": 5,
      "statusBefore": "Open"
    }
  ]
}
```

**Svarreitir:**

Svarið fylgir sama log-wrapped sniði og Document.Approval.Get (sjá kaflana [Samþykktarfærsla](#samþykktarfærsla) og [Reitir tengdra samþykktarfærsla](#reitir-tengdra-samþykktarfærsla) hér að ofan), með þessum viðbótarreitum á niðurstöðustigi:

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| entryNo | Integer | Færslunúmer samþykktarfærslu sem var aðgerðin beitt á |
| statusBefore | String | Staða fyrir aðgerðina (alltaf `"Open"`) |

---

### Keðjuvinnsla

Þegar síðasta nauðsynlega samþykktarfærsla fyrir skjal er samþykkt gefur BC stöðluð `Approvals Mgmt.` sjálfkrafa út undirliggjandi skjal (sölupöntun, innkaupapöntun, o.s.frv.). Engin viðbótar API-kall er þörf.

---

### Varasamþykki

Styður varasamþykki í gegnum BC staðlaða notandauppsetningu. Ef sá sem kallar er skilgreindur sem varamaður samþykktaraðilans tekst samþykktin.

---

### Dæmi um notkun

**Samþykkja eina færslu með subject:**

```json
{
  "type": "Document.Approval.Approve",
  "subject": "5"
}
```

**Samþykkja með athugasemd:**

```json
{
  "type": "Document.Approval.Approve",
  "data": {
    "entries": [{"entryNo": 5}],
    "comment": "Samþykkt vegna fjárhagsáætlunar H2."
  }
}
```

**Samþykkja margar færslur (lota):**

```json
{
  "type": "Document.Approval.Approve",
  "data": {
    "entries": [{"entryNo": 5}, {"entryNo": 6}, {"entryNo": 7}],
    "comment": "Lotusamþykkt."
  }
}
```

---

### Villumeðhöndlun

| Atburðarás | Hegðun |
| --- | --- |
| Engin færsla fundin | `{"status":"Error","error":"No approval entries could be resolved..."}` |
| Færsla finnst ekki | `{"status":"Error","error":"Approval Entry N not found."}` |
| Færsla ekki opin | `{"status":"Error","error":"Approval Entry N has status X. Only entries with status Open can be approved."}` |
| Óheimilt kall | `{"status":"Error","error":"...","callstack":"..."}` (BC staðlað heimildarvilla frá Approvals Mgmt.) |
| Bilun í vinnslukóðaeiningu | Skilar villujson með `error` og `callstack` reitum |

---

## Document.Approval.Reject

```json
{
  "type": "Document.Approval.Reject",
  "subject": "5",
  "data": {
    "comment": "Upphæð yfir fjárhagsáætlun. Vinsamlegast sendið aftur með lægri upphæð."
  }
}
```

Hafnar einni eða fleiri opnum Approval Entry færslum með BC staðlaðri `Approvals Mgmt.` heimild. Tekur við valfrjálsri `comment` sem er vistuð sem Approval Comment Line.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

Uppfletting færslu fylgir forgangsröð: `entries` fylki > `entryNo`/`systemId` í beiðni-JSON > `subject` reitur.

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
| --- | --- | --- | --- |
| subject | Text | Nei | Færslunúmer (heiltala) eða SystemId (GUID) einstakrar samþykktarfærslu |
| entries | Array | Nei | Fylki af færslum til höfnunar (lotuvinnsla) |
| entries[].entryNo | Integer | Nei | Færslunúmer samþykktarfærslu |
| entries[].systemId | String (GUID) | Nei | SystemId samþykktarfærslu |
| entryNo | Integer | Nei | Færslunúmer fyrir einstaka færslu (í beiðni-JSON) |
| systemId | String (GUID) | Nei | SystemId fyrir einstaka færslu (í beiðni-JSON) |
| comment | String | Nei | Valfrjáls athugasemd vistuð sem Approval Comment Line. Langur texti er sjálfkrafa brotinn í margar línur |

---

### Vistun athugasemda

Þegar `comment` er gefið upp er það vistað sem Approval Comment Line. Langur texti er sjálfkrafa brotinn í margar línur.

---

**Snið svars:**

Sama log-wrapped snið og Document.Approval.Approve, með `approvalType` = `"Reject"` og tengd færsla staða = `"Rejected"` eftir aðgerðina.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2024-06-10T14:30:00Z",
      "approvalType": "Reject",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "approvalCode": "CE00000001",
      "request": {},
      "linkedApprovalEntries": [
        {
          "entryNo": 5,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "SO-001234",
          "status": "Rejected",
          "approverId": "JOHN",
          "dueDate": "2024-06-15",
          "currency": "ISK",
          "amount": "150000",
          "amountLCY": "150000",
          "comments": [],
          "lastModified": "2024-06-10T14:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "entryNo": 5,
      "statusBefore": "Open"
    }
  ]
}
```

**Svarreitir:**

Sama og Document.Approval.Approve — sjá [Snið svars](#snið-svars) hér að ofan. Aðgerðarsértækir reitir:

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| entryNo | Integer | Færslunúmer samþykktarfærslu sem var aðgerðin beitt á |
| statusBefore | String | Staða fyrir aðgerðina (alltaf `"Open"`) |

---

### Varasamþykki

Styður höfnun varamanns í gegnum BC staðlaða notandauppsetningu. Ef sá sem kallar er skilgreindur sem varamaður samþykktaraðilans tekst höfnunin.

---

### Dæmi um notkun

**Hafna einni færslu með subject:**

```json
{
  "type": "Document.Approval.Reject",
  "subject": "5"
}
```

**Hafna með athugasemd:**

```json
{
  "type": "Document.Approval.Reject",
  "data": {
    "entries": [{"entryNo": 5}],
    "comment": "Upphæð yfir fjárhagsáætlun. Vinsamlegast sendið aftur með lægri upphæð."
  }
}
```

**Hafna mörgum færslum (lota):**

```json
{
  "type": "Document.Approval.Reject",
  "data": {
    "entries": [{"entryNo": 5}, {"entryNo": 6}],
    "comment": "Birgi ekki á viðurkenndum lista."
  }
}
```

---

### Villumeðhöndlun

| Atburðarás | Hegðun |
| --- | --- |
| Engin færsla fundin | `{"status":"Error","error":"No approval entries could be resolved..."}` |
| Færsla finnst ekki | `{"status":"Error","error":"Approval Entry N not found."}` |
| Færsla ekki opin | `{"status":"Error","error":"Approval Entry N has status X. Only entries with status Open can be rejected."}` |
| Óheimilt kall | `{"status":"Error","error":"...","callstack":"..."}` (BC staðlað heimildarvilla frá Approvals Mgmt.) |
| Bilun í vinnslukóðaeiningu | Skilar villujson með `error` og `callstack` reitum |

---

## Document.Approval.Me

```json
{
  "type": "Document.Approval.Me",
  "data": {
    "skip": 0,
    "take": 50
  }
}
```

Skilar samþykktarfærslum sem eru úthlutaðar á kallandi notanda. Hver færsla inniheldur SystemId tengdrar skjalafærslu sem leyst er með RecordRef, sem gerir köllum kleift að tengja samþykktarverkefni aftur við upprunaskjöl sín. Styður skip/take blaðsíðustjórnun. Aðeins færslur þar sem kallandi notandi hefur leseheimild á tengda upprunaskjalinu eru skilaðar.

**Stefna skilaboða:** Útlæg (lesaðeins)

**Inntaksfæribreytur:**

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
| --- | --- | --- | --- |
| skip | Integer | Nei | Fjöldi færslna til að sleppa (sjálfgefið 0) |
| take | Integer | Nei | Hámarksfjöldi færslna til að skila (0 = allar) |

`Approver ID` sían er alltaf bundin við kallandi notanda og er ekki hægt að hnekkja henni.

---

**Snið svars:**

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "entryNo": 1,
      "sequenceNo": 1,
      "documentType": "Invoice",
      "documentNo": "SI-001",
      "status": "Open",
      "approverId": "ADMIN",
      "dueDate": "2025-01-31",
      "currency": "ISK",
      "amount": "150000",
      "amountLCY": "150000",
      "comments": [],
      "approvalCode": "APPR-001",
      "lastModified": "2025-01-15T10:30:00Z",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }
  ]
}
```

**Svarreitir:**

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| status | String | "Success" eða "Error" |
| noOfRecords | Integer | Heildarfjöldi samþykktarfærslna (fyrir skip/take) |
| result | Array | Fylki af samþykktarfærsluhlutum |
| entryNo | Integer | Færslunúmer samþykktarfærslu |
| sequenceNo | Integer | Staða í samþykktarkeðjunni |
| documentType | String | Tegund upprunaskjals (Invoice, Order, o.s.frv.) |
| documentNo | String | Skjalanúmer upprunaskjals |
| status | String | Staða samþykktar (Open, Approved, Rejected, o.s.frv.) |
| approverId | String | Kenni samþykktaraðila (alltaf kallandi notandi) |
| dueDate | String | Gjalddagi samþykktar (ISO 8601, Format 9) |
| currency | String | Gjaldmiðilskóði (notar LCY kóða úr Fjárhagur uppsetning ef tómt) |
| amount | String | Upphæð í gjaldmiðli skjals (Format 9) |
| amountLCY | String | Upphæð í staðargjaldmiðli (Format 9) |
| comments | Array | Strengjafylki athugasemda tengdra samþykktarfærslu |
| approvalCode | String | Samþykktarkóði verkferlisins |
| lastModified | String | Tímastimpill síðustu breytingar (ISO 8601, Format 9) |
| tableId | Integer | Tafla-ID upprunatöflu (aðeins ef notandi hefur leseheimild) |
| tableName | String | Heiti upprunatöflu |
| tableCaption | String | Yfirskrift upprunatöflu (staðfærð) |
| recordSystemId | String (GUID) | SystemId tengdrar skjalafærslu |

---

### Heimildasía

Færslur eru sjálfkrafa síaðar á Approver ID kallandi notanda. Aðeins færslur þar sem kallandi notandi hefur leseheimild á tengdu upprunaskjalinu eru í niðurstöðunum. Ef tengt skjal finnst ekki eða notandi skortir heimild er færslan hljóðlega sleppt úr svari.

---

### Dæmi um notkun

**Sækja allar samþykktarfærslur fyrir núverandi notanda:**

```json
{
  "type": "Document.Approval.Me",
  "data": {}
}
```

**Sækja með blaðsíðustjórnun:**

```json
{
  "type": "Document.Approval.Me",
  "data": {
    "skip": 0,
    "take": 25
  }
}
```

---

### Villumeðhöndlun

| Atburðarás | Hegðun |
| --- | --- |
| Engar færslur fundust | Skilar `{"status":"Success","noOfRecords":0,"result":[]}` (tóm niðurstaða, ekki villa) |
| Ógild beiðni | Staðlað villujson |
| Engin leseheimild á Approval Entry | BC staðlað heimildarvilla |

---

## Document.Approval.Delegate

```json
{
  "type": "Document.Approval.Delegate",
  "subject": "5",
  "data": {
    "delegateToUserId": "NEWUSER"
  }
}
```

Framselur eina eða fleiri opnar samþykktarfærslur (Approval Entry) á annan notanda. Færslan helst í stöðunni Open en Approver ID er breytt yfir á marknotandann. Marknotandinn verður að vera til í User Setup.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

Uppfletting færslu fylgir forgangsröð: `entries` fylki > `entryNo`/`systemId` í beiðni-JSON > `subject` reitur.

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
| --- | --- | --- | --- |
| delegateToUserId | Text | Já | Kenni notanda (úr User Setup) sem samþykktin er framseld á |
| subject | Text | Nei | Færslunúmer (heiltala) eða SystemId (GUID) einstakrar samþykktarfærslu |
| entries | Array | Nei | Fylki af færslum til framselningar (lotuvinnsla) |
| entries[].entryNo | Integer | Nei | Færslunúmer samþykktarfærslu |
| entries[].systemId | String (GUID) | Nei | SystemId samþykktarfærslu |
| entryNo | Integer | Nei | Færslunúmer fyrir einstaka færslu (í beiðni-JSON) |
| systemId | String (GUID) | Nei | SystemId fyrir einstaka færslu (í beiðni-JSON) |
| comment | String | Nei | Valfrjáls athugasemd vistuð sem Approval Comment Line. Langur texti er sjálfkrafa brotinn í margar línur |

---

### Vistun athugasemda

Þegar `comment` er gefið upp er það vistað sem Approval Comment Line. Langur texti er sjálfkrafa brotinn í margar línur.

---

**Snið svars:**

Sama log-wrapped snið og Document.Approval.Approve, með `approvalType` = `"Delegate"` og viðbótarreit `delegatedTo`.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2024-06-10T14:30:00Z",
      "approvalType": "Delegate",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "approvalCode": "CE00000001",
      "request": {},
      "linkedApprovalEntries": [
        {
          "entryNo": 5,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "SO-001",
          "status": "Open",
          "approverId": "NEWUSER",
          "dueDate": "2024-01-15",
          "currency": "ISK",
          "amount": "150000",
          "amountLCY": "150000",
          "comments": [],
          "lastModified": "2024-06-10T14:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "entryNo": 5,
      "statusBefore": "Open",
      "delegatedTo": "NEWUSER"
    }
  ]
}
```

**Svarreitir:**

Sama log-wrapped snið og Document.Approval.Approve, með þessum aðgerðarsértækum reitum:

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| entryNo | Integer | Færslunúmer samþykktarfærslu sem var aðgerðin beitt á |
| statusBefore | String | Staða fyrir aðgerðina (alltaf `"Open"`) |
| delegatedTo | String | Kenni notanda sem framselt var til |

---

### Hegðun framselningar

Ólíkt samþykki og höfnun notar framseljing EKKI `ApprovalsMgmt` kóðaeiningu. Hún breytir samþykktarfærslunni beint:
- Setur `Approver ID` á marknotandann
- Staða færslunnar helst **Open** (óbreytt)
- Nýr samþykktaraðili getur síðan samþykkt, hafnað eða framselt áfram

---

### Varasamþykki

Styður framseljingu í gegnum BC staðlaða notandauppsetningu. Ef sá sem kallar er skilgreindur sem varamaður núverandi samþykktaraðilans tekst framselningin.

---

### Dæmi um notkun

**Framseljing á einni færslu með subject:**

```json
{
  "type": "Document.Approval.Delegate",
  "subject": "5",
  "data": {
    "delegateToUserId": "JANE"
  }
}
```

**Framseljing með athugasemd:**

```json
{
  "type": "Document.Approval.Delegate",
  "data": {
    "entries": [{"entryNo": 5}],
    "delegateToUserId": "JANE",
    "comment": "Fjarverandi í vikunni. Jane sér um þetta."
  }
}
```

**Framseljing á mörgum færslum (lota):**

```json
{
  "type": "Document.Approval.Delegate",
  "data": {
    "entries": [{"entryNo": 5}, {"entryNo": 6}],
    "delegateToUserId": "JANE"
  }
}
```

---

### Villumeðhöndlun

| Atburðarás | Hegðun |
| --- | --- |
| Vantar delegateToUserId | `{"status":"Error","error":"The delegateToUserId field is required for delegation."}` |
| Marknotandi finnst ekki | `{"status":"Error","error":"User Setup for delegate target user NEWUSER not found."}` |
| Engin færsla fundin | `{"status":"Error","error":"No approval entries could be resolved..."}` |
| Færsla finnst ekki | `{"status":"Error","error":"Approval Entry N not found."}` |
| Færsla ekki opin | `{"status":"Error","error":"Approval Entry N has status X. Only entries with status Open can be delegated."}` |
| Bilun í vinnslukóðaeiningu | Skilar villujson með `error` og `callstack` reitum |

---

## Document.Approval.Cancel

```json
{
  "type": "Document.Approval.Cancel",
  "data": {
    "tableId": 36,
    "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

Afturkallar allar opnar samþykktarfærslur fyrir skjal. Setur allar opnar Approval Entry færslur tengdar skjalinu í stöðuna **Canceled**, stofnar Cancel-skráningarfærslu og opnar undirliggjandi skjal aftur.

**Stefna skilaboða:** Innlæg

**Studdar töflur:**

| Tafla-ID | Nafn töflu |
| -------- | ---------- |
| 36 | Sales Header |
| 38 | Purchase Header |
| 130 | Incoming Document |

**Forsendur:**

| Krafa | Upplýsingar |
| ----- | ----------- |
| Heimildarsett | Notandinn verður að hafa heimildarsettið **Approval Access ori** (10077891) úthlutað. Án þess er beiðninni hafnað með: `User <ID> does not have permissions to cancel document approvals via Bifrost.` |

**Inntaksfæribreytur:**

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
| --------- | ---- | -------- | ----------- |
| tableId / tableNumber / tableName | Integer eða Text | Já | Auðkennir töfluna sem inniheldur skjalið |
| recordSystemId | GUID | Já | SystemId skjalafærslunnar |

---

### Hegðun

1. Leysir skjalafærslu eftir töflu og SystemId
2. Finnur nýjustu Approval Log ori færslu fyrir færsluna
3. Setur allar tengdar opnar Approval Entry færslur í stöðuna **Canceled**
4. Stofnar nýja Approval Log færslu með `Approval Type = Cancel`
5. Opnar skjalið aftur (fjarlægir Pending Approval stöðu)

---

**Snið svars:**

Skilar Cancel-skráningarfærslu með öllum tengdum færslum (sem nú sýna Canceled stöðu) og `cancelledEntries` talningu.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "log-system-id",
      "lastModified": "2025-01-15T10:30:00Z",
      "approvalType": "Cancel",
      "tableId": 36,
      "tableName": "Sales Header",
      "tableCaption": "Sales Header",
      "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "approvalCode": "CE00000001",
      "request": {},
      "linkedApprovalEntries": [
        {
          "entryNo": 5,
          "sequenceNo": 1,
          "documentType": "Order",
          "documentNo": "SO-001234",
          "status": "Canceled",
          "approverId": "JOHN",
          "dueDate": "2025-01-31",
          "currency": "ISK",
          "amount": "150000",
          "amountLCY": "150000",
          "comments": [],
          "lastModified": "2025-01-15T10:30:00Z"
        }
      ],
      "linkedPostedApprovalEntries": [],
      "cancelledEntries": 1
    }
  ]
}
```

**Svarreitir:**

Sama log-wrapped snið og aðrar samþykktaraðgerðir. Aðgerðarsértækur reitur:

| Reitur | Tegund | Lýsing |
| ----- | ---- | ----------- |
| cancelledEntries | Integer | Fjöldi samþykktarfærsla sem voru settar í Canceled |

---

### Villumeðhöndlun

| Atburðarás | Hegðun |
| -------- | -------- |
| Óstudd tafla | Villa sem listar studdar töflur (36, 38, 130) |
| Vantar recordSystemId | Villa: "Missing required 'recordSystemId' in request" |
| Færsla finnst ekki | Villa með SystemId og tafla-ID |
| Engin samþykktarskráningarfærsla fundin | Villa: "No approval log entry found for the record" |
| Engar opnar færslur til afturköllunar | Skilar success með `cancelledEntries: 0` |
| Bilun í vinnslukóðaeiningu | Skilar villujson með `error` og `callstack` reitum |

---

## Tengdar skilaboðategundir

- **[Document.Approval.Get](#documentapprovalget)** — Sækir samþykktarfærslur sem þegar eru til
- **[Document.Approval.Send](#documentapprovalsend)** — Stofnar samþykktarfærslur fyrir skjal
- **[Document.Approval.Approve](#documentapprovalapprove)** — Samþykkir opnar samþykktarfærslur
- **[Document.Approval.Reject](#documentapprovalreject)** — Hafnar opnum samþykktarfærslum
- **[Document.Approval.Cancel](#documentapprovalcancel)** — Afturkallar allar opnar færslur og opnar skjal aftur
- **[Document.Approval.Me](#documentapprovalme)** — Sækir færslur úthlutaðar á núverandi notanda
- **[Document.Approval.Delegate](#documentapprovaldelegate)** — Framselur færslur á annan notanda
- **[Data.Records.Get](/foundation/message-types/data/#datarecordsget)** — Almenn færslusókn úr hvaða BC töflu sem er
- **[Document.Approval.Approve](#documentapprovalapprove)** — Samþykkir opnar samþykktarfærslur
- **[Document.Approval.Reject](#documentapprovalreject)** — Hafnar opnum samþykktarfærslum
- **[Document.Approval.Me](#documentapprovalme)** — Sækir færslur úthlutaðar á núverandi notanda
- **[Document.Approval.Delegate](#documentapprovaldelegate)** — Framselur færslur á annan notanda
- **[Data.Records.Get](/foundation/message-types/data/#datarecordsget)** — Almenn færslusókn úr hvaða BC töflu sem er
