---
id: data
title: "Data message types"
sidebar_position: 1
---

Þetta skjal lýsir Gagna-skilaboðategundunum sem eru í boði í Bifröst API til að sækja og meðhöndla færslugögn.

**Yfirskjal:** [API_Reference.md](/foundation/reference/api/)

**Útfærslumappa:** `app/src/Message Type/Implementations/Data/`

---

## Yfirlit

Gagna-skilaboðategundir bjóða upp á aðgerðir til að sækja og meðhöndla færslugögn í Business Central töflum samkvæmt gagnasendingarmatsniði. Allar gagnaaðgerðir styðja síun á reitum, dagsetningar/tímasvið síur og síðuskiptingu til fínstillingar á afköstum með stórar gagnasöfn.

**Skráðar skilaboðategundir:**

| Skilaboðategund | Lýsing | Stefna |
|---|---|---|
| Data.Records.Get | Sækir öll færslugögn sem JSON fyrir færslur í tiltekinni töflu | Útlæg |
| Data.Records.Set | Setur inn eða uppfærir öll færslugögn sem JSON fyrir færslur í tiltekinni töflu | Innlæg |
| Data.RecordIds.Get | Sækir færsluauðkenni og breytingartímastimpla fyrir færslur í tiltekinni töflu | Útlæg |
| CSV.Records.Get | Flytur allar samsvarandi færslur úr tiltekinni töflu sem CSV-skrá á Open Mirroring sniði | Útlæg |
| Data.Totals.Get | Leggur saman Decimal SumIndexFields yfir allar samsvarandi færslur og skilar reitaheildum | Útlæg |
| Deleted.Records.Get | Sækir fullkláraðar reitastigsþykkvandi eyððar færslur úr Delete Log ori | Útlæg |
| Deleted.RecordIds.Get | Sækir SystemId og eyðingartímastimpil fyrir eyðdar færslur | Útlæg |
| CSV.DeletedRecords.Get | Flytur endurskoðunarkladda yfir eyðdar færslur sem CSV | Útlæg |
| Data.Entries.Find | Finnur allar tengdar færslur fyrir skjal með BC staðlaðri Siglingaleið | Útlæg |

---

## 1. Data.Records.Get {#datarecordsget}

**Tilgangur:** Sækja öll færslugögn sem JSON fyrir færslur í tiltekinni töflu, samkvæmt gagnasendingarmatsniði.

**Lýsing:** Sækir öll færslugögn sem JSON fyrir færslur í tiltekinni töflu, samkvæmt gagnasendingarmatsniðinu. Styður valfrjálsa síun á reitum, útreikning FlowFields, töflukennaðra sía, dagsetningar/tíma svið síur og síðuskiptingu.

**Stefna skilaboða:** Útlæg

**Töfluauðkenning:**

Marktöflu er hægt að tilgreina með eftirfarandi möguleikum (metið í þessari röð):
1. `tableName` í JSON gagnaumboðinu
2. `tableNumber` í JSON gagnaumboðinu
3. `tableNo` í JSON gagnaumboðinu (samheiti fyrir `tableNumber`)
4. `tableId` í JSON gagnaumboðinu (samheiti fyrir `tableNumber`)
5. `subject` reitur í Bifröst umslagi — þiggur bæði töfluheiti (t.d. `"Customer"`) og töflunúmer (t.d. `"18"`)

**Inntaksfæribreytur:**

```json
{
  "tableName": "Customer",
  "tableNumber": 18,
  "fieldNumbers": [1, 2, 3, 5, 7],
  "startDateTime": "2026-01-01T00:00:00Z",
  "endDateTime": "2026-02-19T23:59:59Z",
  "tableView": "WHERE(Blocked = CONST( ))",
  "skip": 0,
  "take": 100
}
```

**Snið svars:**

```json
{
  "status": "Success",
  "noOfRecords": 245,
  "result": [
    {
      "id": "{guid}",
      "primaryKey": {
        "No": "10000"
      },
      "fields": {
        "Name": "Contoso Ltd.",
        "Address": "123 Main St",
        "City": "Atlanta",
        "Balance": 1250.50
      }
    }
  ]
}
```

**Gagnasendingarmatsniðið:**

Hver færsla í niðurstöðufylkinu inniheldur:
- **id**: SystemId (GUID) færslunnar
- **primaryKey**: Hlutur með aðallykil reit/reita og gildi þeirra
- **fields**: Hlutur með reiti sem eru ekki aðallyklar og gildi þeirra

Heitireitanöfn eru stöðluð þannig að þau innihaldi aðeins bókstafi og tölustafi (bil og sértákn fjarlægð).

**Studdar reitategundir:**

- BigInteger, Boolean, Code, Date, DateFormula, DateTime
- Decimal, Duration, GUID, Integer, Option, Text, Time, RecordID
- BLOB, Media, MediaSet (Base64 kóðuð)
- FlowField (eingöngu þegar `fieldNumbers` er tilgreint)

**Option/Enum reitir**: Gildi eru skilað sem **birtiheiti** þeirra (ekki innri nöfn). Notaðu `Help.Fields.Get` til að uppgötva gild gildi og birtiheiti þeirra.

**Athugasemdir:**

- **Sveigjanleg töfluauðkenning**: Tilgreindu töflu með `tableName`, `tableNumber`, `tableNo` eða `tableId`
- **Gagnasendingarmatsniðið**: Fylgir staðlaðri gagnasendingar-JSON-uppbyggingu með id, primaryKey og fields
- **Reitasíun**: Tilgreindu valfrjálst ákveðin reitanúmer með **fieldNumbers** fylkinu
- **FlowField stuðningur**: Þegar `fieldNumbers` er gefið, eru FlowField-reitar reiknaðir á staðnum
- **Enum birtiheiti**: Option/Enum reitargildi eru skilað sem birtiheiti (ekki innri nöfn)
- **Dagsetningarsviðssía**: Síar færslur eftir SystemModifiedAt með **startDateTime** og **endDateTime**
- **Síðuskiptingartuðningur**: Notaðu **skip** og **take** til síðuskiptingar (sjálfgefið: skip=0, take=100)
- **Að sleppa töflukenni**: Þegar aðeins þarf auðkenni og tímastimpla, notaðu **Data.RecordIds.Get** í staðinn

**Dæmi um notkun:**

1. **Sækja alla reiti allra viðskiptamanna:**
   ```json
   {"tableName": "Customer"}
   ```

2. **Sækja tilgreinda reiti viðskiptamanna breytt á dagsetningarsviði:**
   ```json
   {
     "tableName": "Customer",
     "fieldNumbers": [2, 5, 7, 21],
     "startDateTime": "2026-02-01T00:00:00Z",
     "endDateTime": "2026-02-28T23:59:59Z"
   }
   ```

3. **Sækja viðskiptamenn með töflukennaðra sía:**
   ```json
   {
     "tableName": "Customer",
     "tableView": "WHERE(Blocked = CONST( ))",
     "fieldNumbers": [1, 2, 3, 5]
   }
   ```

4. **Sækja viðskiptamenn með síðuskiptingu (fyrstu 100 færslur):**
   ```json
   {
     "tableName": "Customer",
     "skip": 0,
     "take": 100
   }
   ```

---

## 2. Data.Records.Set {#datarecordsset}

**Tilgangur:** Setja inn eða uppfæra öll færslugögn sem JSON fyrir færslur í tiltekinni töflu, samkvæmt gagnasendingarmatsniði.

**Lýsing:** Setur inn eða uppfærir öll færslugögn sem JSON. Styður bæði innsetningu (nýjar færslur) og uppfærslu (núverandi færslur) aðgerðir byggt á SystemId eða aðallykli.

**Stefna skilaboða:** Innlæg

**Töfluauðkenning:** Sama og Data.Records.Get.

**Inntaksfæribreytur:**

```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "identityInsert": true,
      "primaryKey": {
        "No_": "10000"
      },
      "fields": {
        "Name": "Contoso Ltd.",
        "Address": "123 Main St",
        "City": "Atlanta",
        "Balance": 1250.50
      }
    }
  ]
}
```

**Snið svars:**

```json
{
  "status": "Success",
  "insertedCount": 5,
  "modifiedCount": 3,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": {
        "No_": "10000"
      },
      "fields": {
        "Name": "Contoso Ltd.",
        "Address": "123 Main St",
        "City": "Atlanta",
        "Balance": 1250.50
      }
    }
  ]
}
```

**Gagnasendingarmatsniðið:**

Hver færsla í gagnafylkinu inniheldur:
- **id**: SystemId (GUID) sem hreinn texti — notaðu til að uppfæra núverandi færslur
- **primaryKey**: Hlutur með aðallykil reit/reita og gildi þeirra — notaðu til uppflettings
- **fields**: Hlutur með reiti sem eru ekki aðallyklar og gildi þeirra sem á að stilla

**Uppflettingarrök færslu:**

Fyrir hverja færslu í gagnafylkinu ákveðir kerfið hvort setja á inn eða uppfæra byggt á:

1. **Ef "id" er gefið**:
   - Flettir upp færslu eftir SystemId
   - Ef fundin, uppfærir núverandi færslu
   - Ef "primaryKey" er einnig gefið, staðfestir að hann passi við
   - Ef ekki fundin og "identityInsert" er true, setur inn nýja færslu með þessu SystemId
   - Ef ekki fundin og "identityInsert" er ekki true, skilar villu

2. **Ef "primaryKey" er gefið (án "id")**:
   - Stillir aðallykla reiti og reynir Find('=')
   - Ef fundin, uppfærir núverandi færslu
   - Ef ekki fundin, setur inn nýja færslu með þessum aðallykla gildum

3. **Ef hvorki "id" né "primaryKey" er gefið**:
   - Setur inn nýja færslu

**Meðhöndlun reita:**

- Aðeins reitir sem eru ekki aðallyklar og eru í "fields" hlutnum eru stilltir eða uppfærðir
- **Aðallykla reitir eru ALDREI unnir úr "fields" hlutnum**
- Kerfisreitir (SystemCreatedAt, SystemModifiedAt o.s.frv.) geta ekki verið settir og eru hunsaðir
- Öll reitargildi eru sannprófuð með RecordRef.Validate() aðferðinni
- FlowFields og CalcFields eru ritvarðaðar og geta ekki verið sett

**Sérstakar reitameðhöndlunar:**

- **SGM gjaldmiðilsumreikningur**: Reitir með gjaldmiðil töflu tengsl: tómt = SGM
- **Víddarsamstæður**: Reitir með Dimension Set Entry tengsl þiggja annað hvort heiltölu (Dimension Set ID) eða fylki af víddum
- **BLOB/Media/MediaSet**: Kóðuð sem Base64 strengir
- **Option reitir**: Notaðu enum gildanöfn (t.d. "Open", "Released")

**Dæmi um notkun:**

1. **Setja inn nýja viðskiptavinafærslu:**
   ```json
   {
     "data": [
       {
         "primaryKey": {
           "No_": "CUST-001"
         },
         "fields": {
           "Name": "New Customer Inc.",
           "Address": "456 Oak Ave",
           "City": "Seattle"
         }
       }
     ]
   }
   ```

2. **Uppfæra núverandi viðskiptavin eftir SystemId:**
   ```json
   {
     "data": [
       {
         "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
         "fields": {
           "Address": "789 New Street",
           "City": "Portland"
         }
       }
     ]
   }
   ```

---

## 3. Data.RecordIds.Get {#datarecordidsget}

**Tilgangur:** Sækja færsluauðkenni og breytingartímastimpla fyrir færslur í tiltekinni töflu innan dagsetningar/tímasvið.

**Lýsing:** Sækir færsluauðkenni (SystemId) og breytingartímastimpla (SystemModifiedAt) fyrir færslur í tiltekinni töflu. Þessi skilaboðategund er fínstillt fyrir samstillingaraðstæður þar sem þú þarft að greina hvaða færslur hafa breyst án þess að sækja öll færslugögn.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

```json
{
  "tableName": "Customer",
  "tableNumber": 18,
  "startDateTime": "2026-01-01T00:00:00Z",
  "endDateTime": "2026-02-19T23:59:59Z",
  "tableView": "WHERE(Blocked = CONST( ))",
  "skip": 0,
  "take": 100
}
```

**Snið svars:**

```json
{
  "status": "Success",
  "noOfRecords": 245,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "modifiedAt": "2026-02-15T14:30:00Z"
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
      "modifiedAt": "2026-02-16T09:15:30Z"
    }
  ]
}
```

**Svarreitir:**

- **status**: Vinnslustöðu ("Success" eða "Error")
- **noOfRecords**: Heildarfjöldi samsvarandi færslna (óháð skip/take)
- **result**: Fylki af færsluauðkennum
  - **id**: SystemId (GUID) færslunnar
  - **modifiedAt**: Tímastimpill þegar færsla var síðast breytt (SystemModifiedAt)

**Samþætttingarmynstur:**

**Skref 1: Greina breyttar færslur**
```json
{
  "type": "Data.RecordIds.Get",
  "data": {
    "tableName": "Customer",
    "startDateTime": "2026-02-01T00:00:00Z",
    "endDateTime": "2026-02-28T23:59:59Z"
  }
}
```

**Skref 2: Sækja öll gögn fyrir breyttar færslur**
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Customer",
    "tableView": "WHERE(SystemId=FILTER(a1b2c3d4-...|b2c3d4e5-...))"
  }
}
```

---

## 4. CSV.Records.Get {#csvrecordsget}

**Tilgangur:** Flytja allar samsvarandi færslur úr tiltekinni Business Central töflu sem CSV-skrá á Open Mirroring sniði.

**Lýsing:** Flytur allar samsvarandi færslur sem UTF-8 kóðaðar CSV-skrá samkvæmt bc2adls Open Mirroring dálkanotkunarsamþykkt. Þessi skilaboðategund skilar `text/csv` efni beint í svarsvæðinu. Fyrir stórar niðurstöðusöfn sem nálgast 2 GB OutStream takmörkin, er framhaldsparnsniðið stutt með `continueFromRecordId`.

**Stefna skilaboða:** Útlæg  
**Efnistegund:** `text/csv`

**Inntaksfæribreytur:**

```json
{
  "tableName": "Customer",
  "fieldNumbers": [1, 2, 5, 7],
  "startDateTime": "2026-01-01T00:00:00Z",
  "endDateTime": "2026-12-31T23:59:59Z",
  "tableView": "WHERE(Blocked = CONST( ))"
}
```

> **Athugið:** `skip` og `take` eru EKKI studd. Allt niðurstöðusafnið er alltaf skilað.

**Snið svars:**

Þegar færslur passa við síur, er UTF-8 kóðaður CSV texti skilað með efnistegund `text/csv`. Fyrsta röðin er hausröðin; síðari raðir eru gagnalínur, ein á hverja færslu.

**Ef engar færslur passa við síur, er ekkert CSV skrifað.** Bæði `data` og `datacontenttype` í Bifröst svarinu verða tómum strengi. Verk lýkur með velgengi — athugaðu alltaf hvort `data` sé tómt áður en reynt er að sækja.

Dæmi (Customer tafla, reitir 1 og 2 eingöngu):
```csv
No,Name,timestamp,SystemId,SystemCreatedAt,SystemCreatedBy,SystemModifiedAt,SystemModifiedBy,$Company,__rowMarker__
"10000","Contoso Ltd.",0,a1b2c3d4-e5f6-7890-abcd-ef1234567890,2026-01-10T08:00:00.000Z,...,"CRONUS International Ltd.",4
```

**Nafngevingasamþykkt dálka:**

Hver dálkahaussheiti myndast með því að fjarlægja stafi sem eru ekki bókstafs-tölustafir (nema `%`) úr BC reitnafninu.

| Reitur | Dálkahaussheiti |
|---|---|
| `No.` | `No` |
| `Name` | `Name` |
| `Sell-to Customer No.` | `SelltoCustomerNo` |
| `SystemId` | `SystemId` |

**Kerfisreitir (alltaf innifaldir):**

| Dálkur | Reitanr. | Lýsing |
|---|---|---|
| `timestamp` | 0 | Innri tímastimpill (BigInteger) |
| `SystemId` | 2000000000 | Færsla GUID |
| `SystemCreatedAt` | 2000000001 | Stofnunartímastimpill (UTC) |
| `SystemCreatedBy` | 2000000002 | Stofnaður af notanda GUID |
| `SystemModifiedAt` | 2000000003 | Síðasti breytingartímastimpill (UTC) |
| `SystemModifiedBy` | 2000000004 | Breytt af notanda GUID |

**$Company dálkur:**

Fyrir fyrirtækjatækar töflur (flestar BC töflur) er `$Company` dálkur bætt við á eftir kerfisreitum. Gildið er tvítöluleyfið og umkringt gæsalöppum. Nakvæmt gildi er stýrt af **Tegund útflutnings á heiti fyrirtækis** reitnum í Bifröst uppsetningu:

| Uppsetningargildi | Gildi í `$Company` |
|---|---|
| `Heiti fyrirtækis` (sjálfgefið) | `CompanyName()` — tæknilegt `Company.Name` |
| `Birtingarheiti fyrirtækis` | `Company."Display Name"`, fellur til baka á `CompanyName()` þegar autt |

Gildið er leyst einu sinni á beiðni og endurnotað fyrir hverja línu. Enum-ið er stækkanlegt með `Company Name Type ori` enum (10077886) og `Company Name ori` viðmótinu — sjá [Setup_Reference.md](/foundation/reference/setup/) kafla 8.

**__rowMarker__ dálkur (Open Mirroring):**

`__rowMarker__` dálkurinn er alltaf síðasti dálkurinn. Fyrir `CSV.Records.Get` er gildið alltaf `4`, sem gefur til kynna upsert/virka færslu. Þetta fylgir Open Mirroring samþykktinni sem bc2adls og Azure Data Lake samstillingarleiðslur nota.

**Framhaldsparnsniðið (stórar útflutningar):**

Þegar CSV-svarið nálgast 2 GB OutStream takmörkin, stöðvast útflutningur eftir núverandi 4 MB stykki
og skilar `SystemId` **næstu óunninnar færslu** í `continueFromRecordId` svarreitnum.

1. Sendu venjulega `CSV.Records.Get` beiðni (án `continueFromRecordId`).
2. Athugaðu `continueFromRecordId` reitinn í svarinu.
3. Ef hann inniheldur GUID, sendu aðra beiðni með `continueFromRecordId` stilltan á þetta gildi.
4. Endurtaktu þar til `continueFromRecordId` er tómt í svari (öll færslur fluttar).

---

## 5. Data.Totals.Get {#datatotalsget}

**Tilgangur:** Leggja saman Decimal SumIndexFields yfir allar samsvarandi færslur í tiltekinni BC töflu, valfrjálst flokkað eftir reit.

**Lýsing:** Notar BC-innbyggðu `CalcSums` fallið til að leggja saman einn eða fleiri Decimal reiti án þess að fara í gegnum einstakar færslur. Skilar JSON fylki þar sem hvert stak inniheldur `group` lykil og eitt lykil/gildi par á hvern umbeðinn reit. Án `groupBy` skilar eitt stak með tómu `group` gildi. Með `groupBy` skilar eitt stak á hvert aðgreint gildi. Styður valfrjálsa `tableView` síu.

**Stefna skilaboða:** Útlæg  
**Efnistegund:** `text/json`

**Inntaksfæribreytur:**

```json
{
  "tableName": "Item Ledger Entry",
  "fieldNumbers": [12, 14],
  "tableView": "WHERE(Entry Type=CONST(Purchase))",
  "groupBy": 3
}
```

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|---|---|---|---|
| `tableName` / `tableNumber` | string / integer | Já (eitt af) | Marktafla |
| `fieldNumbers` | heiltölu fylki | **Nauðsynleg** | Reitanúmer til að leggja saman. Verða öll að vera Decimal SumIndexFields. |
| `tableView` | string | Nei | BC AL SetView sía til að takmarka hvaða færslur eru innifaldar |
| `groupBy` | heiltala eða strengur | Nei | Reitanúmer eða reitarheiti til að flokka eftir. Skilar einu niðurstöðustaki á hvert aðgreint gildi. |

**Kröfur fyrir `fieldNumbers`:**
- Verður ekki að vanta eða vera tómt
- Hver reitur verður að vera til í töflunni
- Hver reitur verður að vera af tegund **Decimal**
- Hver reitur verður að vera **SumIndexField** (SIFT lykill)
- Enginn reitur má vera lesvarinn

**`groupBy` hegðun:**
- Tekur við reitanúmeri (heiltala) eða reitarheiti (strengur)
- Reiturinn er uppfléttur í lýsigögnum töflunnar
- Ef reiturinn finnst ekki er honum hægt og rólega sleppt (engin flokkun)
- `group` gildið í svari er sniðið gildi reitsins fyrir hvern flokk

**Snið svars (án groupBy):**

```json
{
  "status": "Success",
  "result": [
    {
      "group": "",
      "Quantity": 12500.00,
      "InvoicedQuantity": 11200.50
    }
  ]
}
```

**Snið svars (með groupBy):**

```json
{
  "status": "Success",
  "result": [
    {
      "group": "Purchase",
      "Quantity": 8500.00,
      "InvoicedQuantity": 7200.00
    },
    {
      "group": "Sale",
      "Quantity": -3200.00,
      "InvoicedQuantity": -2800.50
    }
  ]
}
```

**CalcSums krafa:**

`Data.Totals.Get` notar BC-`CalcSums`, sem krefst þess að allir reitir séu lýstir sem SumIndexFields á einum af SIFT-lyklunum töflunnar. Notaðu `Help.Fields.Get` til að athuga reitarmetalgögn áður en þessi skilaboðategund er kölluð.

Ef engar færslur passa við `tableView`, skilar `CalcSums` 0 fyrir hvern reit — þetta er ekki villa.

---

## 7. Deleted.Records.Get {#deletedrecordsget}

**Tilgangur:** Sækja fullkláraðar reitastigsþykkvandi eyðdar færslur úr Delete Log ori.

**Lýsing:** Sækir fullkláraðar reitaþykkvandi eyðdar færslur úr Delete Log ori, á sama gagnasendingarsniði og `Data.Records.Get`. **Forskilyrði:** "Store Record" verður að vera virkjað í Delete Setup ori fyrir upprunatolðuna — annars er villa skilað.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

```json
{
  "tableName": "Customer",
  "startDateTime": "2026-01-01T00:00:00Z",
  "endDateTime": "2026-03-21T23:59:59Z",
  "fieldNumbers": [1, 2, 5],
  "skip": 0,
  "take": 100
}
```

**Snið svars:**

```json
{
  "status": "Success",
  "noOfRecords": 25,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "No_": "10000" },
      "fields": { "Name": "Deleted Customer", "City": "Reykjavik" }
    }
  ]
}
```

---

## 8. Deleted.RecordIds.Get {#deletedrecordidsget}

**Tilgangur:** Sækja SystemId og eyðingartímastimpil fyrir eyðdar færslur — léttþyngdar sync-aðferð.

**Lýsing:** Skilar eingöngu SystemId og eyðingartímastimpil fyrir eyðdar færslur. Virkar óháð "Store Record" stillingu í Delete Setup ori. Tilvalið fyrir samstillingarverkflæði sem þurfa eingöngu að vita hvaða færslur voru eyðdar og hvenær.

**Stefna skilaboða:** Útlæg

**Snið svars:**

```json
{
  "status": "Success",
  "noOfRecords": 42,
  "result": [
    { "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "deletedAt": "2026-03-15T14:30:00Z" }
  ]
}
```

**Athugið:** Tímastimpilreiturinn er `deletedAt` (ekki `modifiedAt` eins og í `Data.RecordIds.Get`).

---

## 9. CSV.DeletedRecords.Get {#csvdeletedrecordsget}

**Tilgangur:** Flytja endurskoðunarkladda yfir eyðdar færslur sem CSV.

**Lýsing:** Skilar einföldum UTF-8 CSV af Delete Log ori færslum. Skilar föstum endurskoðunardálkum auk `$Company` dálks fyrir fyrirtækjatækar töflur (stýrt af **Tegund útflutnings á heiti fyrirtækis** reitnum — sjá [Setup_Reference.md](/foundation/reference/setup/) kafla 8) — ekki reitastigsgögnum (notaðu `Deleted.Records.Get` fyrir öll reitsgögn). `tableName` er valfrjálsalt; slepptu til að fá allar töflur.

**Stefna skilaboða:** Útlæg

**Föstir CSV dálkar (alltaf þeir sömu):**

| Dálkur | Lýsing |
|---|---|
| `systemId` | GUID eyððrar færslu |
| `tableId` | BC töflunúmer |
| `tableName` | BC töfluheiti |
| `deletedAt` | ISO 8601 eyðingartímastimpill |
| `userId` | Notandaauðkenni sem eyddist færslan |
| `$Company` | Firmaheiti (aðeins fyrir fyrirtækjatækar töflur) |
| `__rowMarker__` | Open Mirroring röðmerki — alltaf `2` (eyðd færsla) |

---

## 10. Data.Entries.Find {#dataentriesfind}

**Tilgangur:** Finna allar tengdar færslur fyrir skjalanúmer með BC staðlaðri Siglingaleið (Finna færslur).

**Lýsing:** Skilar lista af töflum sem innihalda færslur sem samsvara uppgefnu skjalanúmeri, ásamt fjölda færslna í hverri töflu. Þetta jafngildir aðgerðinni „Finna færslur..." (Ctrl+F7 → Siglingaleið) sem er í boði víðsvegar í Business Central. Leitar í öllum stöðluðum færslutöflum (Fjárhagsfærslur, Viðskiptamannafærslur, Lánardrottnafærslur, Birgðafærslur, VSK-færslur, Bankareikningsfærslur o.fl.) auk tafla sem skráðar viðbætur hafa bætt við.

**Stefna skilaboða:** Útlæg

**Inntaksbreytur:**

```json
{
  "documentNo": "PSI-103047",
  "postingDate": "2025-03-15"
}
```

| Breyta | Tegund | Nauðsynleg | Lýsing |
|--------|--------|------------|--------|
| `documentNo` | strengur | **Já** | Skjalanúmer til að leita að (t.d. reikningsnúmer, pöntunarnúmer, sendingarnúmer) |
| `postingDate` | dagsetning (ISO 8601) | Nei | Valfrjáls bókunardagsetningarsía. Þegar gefin, eru aðeins færslur með þessari bókunardagsetningu teknar með. Snið: `YYYY-MM-DD` |

**Lágmarksbeiðni (aðeins skjalanúmer):**

```json
{
  "documentNo": "PSI-103047"
}
```

**Snið svars:**

```json
{
  "status": "Success",
  "documentNo": "PSI-103047",
  "postingDate": "2025-03-15",
  "totalTables": 4,
  "totalRecords": 12,
  "entries": [
    {
      "tableId": 21,
      "tableName": "Cust. Ledger Entry",
      "noOfRecords": 1
    },
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "noOfRecords": 5
    },
    {
      "tableId": 254,
      "tableName": "VAT Entry",
      "noOfRecords": 2
    },
    {
      "tableId": 379,
      "tableName": "Detailed Cust. Ledg. Entry",
      "noOfRecords": 4
    }
  ]
}
```

**Svarsreitir:**

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | strengur | `"Success"` eða `"Error"` |
| `documentNo` | strengur | Skjalanúmer sem leitað var að |
| `postingDate` | strengur | Bókunardagsetningarsía (aðeins til staðar ef gefin í beiðni) |
| `totalTables` | heiltala | Fjöldi aðgreindra tafla með samsvarandi færslum |
| `totalRecords` | heiltala | Heildarfjöldi samsvarandi færslna yfir allar töflur |
| `entries` | fylki | Fylki af töfluresultum |
| `entries[].tableId` | heiltala | BC töflunúmer |
| `entries[].tableName` | strengur | Töfluheiti/yfirsögn |
| `entries[].noOfRecords` | heiltala | Fjöldi samsvarandi færslna í þessari töflu |

**Notkunarathugasemdir:**

- Leitin notar staðlaðan Siglingaleiðarbúnað BC, sem tekur til allra grunntafla og allra tafla sem skráðar viðbætur hafa bætt við.
- Þegar `postingDate` er sleppt, eru allar færslur sem samsvara skjalanúmeri skilaðar óháð dagsetningu.
- Töflur með engar samsvarandi færslur eru ekki í svarinu.
- Til að sækja raunverulegar færslur úr tiltekinni töflu í niðurstöðunum, notaðu `Data.Records.Get` með `tableView` síu á skjalanúmerasvæðinu.

**Villur:**

| Villa | Orsök |
|-------|-------|
| `documentNo is required.` | `documentNo` breytan var ekki gefin eða er tóm |

**Tengdar skilaboðategundir:**
- `Data.Records.Get` — Sækja raunveruleg færslugögn úr töflum sem þessi skilaboðategund greinir
- `Data.RecordIds.Get` — Sækja færsluauðkenni með síum fyrir tiltekna töflu
- `Data.Totals.Get` — Leggja saman töluleg svæði yfir samsvarandi færslur

---

## Tengd skjöl

- **[API_Reference.md](/foundation/reference/api/)**: API-endapunktar og auðkenning
- **[Metadata_Message_Types.md](/foundation/message-types/metadata/)**: Hjálpar- og lýsigagna-skilaboðategundir
- **[Sales_Message_Types.md](/foundation/message-types/sales/)**: Sölu- og viðskiptalegar skilaboðategundir
