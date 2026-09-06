---
id: metadata
title: "Metadata and help message types"
sidebar_position: 2
---

Þetta skjal lýsir Lýsigagna (Help) skilaboðategunum sem eru í boði í Bifröst API til að sækja kerfisgögn lýsigögn og skjöl.

**Yfirskjal:** [API_Reference.md](/foundation/reference/api/)

**Útfærslumappa:** `app/src/Message Type/Implementations/Metadata/` og `app/src/Message Type/Implementations/Field/`

---

## Yfirlit

Lýsigagna-skilaboðategundir bjóða upp á aðgerðir til að uppgötva og skilja BC gagnagrunnsuppbygginguna, tiltækar skilaboðategundir, reitarlýsigögn og heimildir notanda. Þessar skilaboðategundir eru nauðsynlegar til að smíða gangvirkar samþætttingar sem aðlagast gagnagrunnsuppbyggingunni og tiltækum aðgerðum.

**Skráðar skilaboðategundir:**

| Skilaboðategund | Lýsing | Stefna |
|---|---|---|
| Help.Tables.Get | Skilar lista yfir allar tiltækar töflur með auðkenni, heiti, birtitexta, dataPerCompany fána, nafnrými og les-/skrifhömlunarfána | Útlæg |
| Help.Fields.Get | Sækir reitarlýsigögn fyrir tilgreinda töflu | Útlæg |
| Help.MessageTypes.Get | Skilar lista yfir allar tiltækar skilaboðategundir með lýsigögn | Útlæg |
| Help.Implementation.Get | Skilar hjálparskjölun fyrir tilgreinda skilaboðategund | Útlæg |
| Help.Permissions.Get | Sækir heimildir núverandi notanda fyrir tilgreinda töflu | Útlæg |
| Help.NextLineNo.Get | Skilar næsta tiltæka línunúmeri fyrir töflu þar sem síðasti aðallyklireitur er Integer | Útlæg |
| Help.PageUrl.Get | Skilar Business Central vefslóð fyrir spjaldsíðu tiltekinnar færslu | Útlæg |
| Help.TableRelations.Get | Skilar öllum ytri lyklasamböndum töflureitar þar með taldar skilyrt greiningasamböndsgreinar og öfug sambönd (reitir sem vísa til þessa reitar) | Útlæg |
| Help.Bifröst.Get | Skilar stuttu Markdown-yfirliti yfir alla Help.* uppgötvunarendapunkta og vísar á Help.Implementation.Get til að sækja fullan tæknileiðarvísi um Bifröst API | Útlæg |
| Field.Translation.Get | Sækir BC kerfisþýðingar fyrir tiltekinn reit á færslu | Útlæg |
| Field.Translation.Set | Skrifar eða eyðir BC kerfisþýðingum fyrir reit á færslu | Innlæg |
| Field.Translations.Get | Sækir BC kerfisþýðingar fyrir alla reiti (eða tiltekinn reit) á færslu | Útlæg |
| Help.WhoAmI.Get | Skilar yfirgripsmiklu notandasniði með BC stillingum, hlutverkatengingum og kerfisboðskipun | Útlæg |

---

## 1. Help.Tables.Get {#helptablesget}

**Tilgangur:** Sækja lista yfir allar tiltækar töflur í gagnagrunni.

**Lýsing:** Skilar lista yfir allar tiltækar töflur í gagnagrunni með auðkenni þeirra, heiti, birtitexta og nafnrými.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

Engar færibreytur eru nauðsynlegar. Valfrjálst er að sía að tiltekinni töflu með einhverri af þessum aðferðum:

- `tableName` í gagnaumboðinu (t.d. `"Customer"`)
- `tableNumber` í gagnaumboðinu (t.d. `18`)
- `tableNo` í gagnaumboðinu (samheiti fyrir `tableNumber`)
- `tableId` í gagnaumboðinu (samheiti fyrir `tableNumber`)
- `subject` reitur í Bifröst umslagi — töfluheiti eða númer

**Tungumálastuðningur:**

Til að fá birtitexta á tilteknu tungumáli, stilltu `lcid` reitinn (Windows Language ID) á skilaboðastigi Bifröst (ekki í gagnaumboðinu).

**Algeng LCID gildi:**

| LCID | Tungumál |
|---|---|
| 1033 | Enska (Bandaríkin) |
| 1030 | Danska (Danmörk) |
| 1031 | Þýska (Þýskaland) |
| 1036 | Franska (Frakkland) |
| 1034 | Spænska (Spánn) |
| 1043 | Holenska (Holland) |
| 1053 | Sænska (Svíþjóð) |
| 1044 | Norska (Norðmenn) |
| 1039 | Íslenska (Ísland) |

**Snið svars:**

```json
{
  "status": "Success",
  "result": [
    {
      "id": 18,
      "name": "Customer",
      "caption": "Customer",
      "dataPerCompany": true,
      "namespace": "Microsoft.Sales.Customer",
      "readRestricted": false,
      "writeRestricted": false
    },
    {
      "id": 23,
      "name": "Vendor",
      "caption": "Vendor",
      "dataPerCompany": true,
      "namespace": "Microsoft.Purchases.Vendor",
      "readRestricted": false,
      "writeRestricted": false
    }
  ]
}
```

**Svarreitir:**

- `id`: Töflunúmer
- `name`: Töfluheiti
- `caption`: Töflubirtiheiti á umbeðnu tungumáli (eða sjálfgefnu tungumáli úr Bifröst Setup ef lcid er ekki tilgreint)
- `dataPerCompany`: Boolean — `true` ef taflan geymir gögn per fyrirtæki; `false` fyrir deildar (altækar) töflur
- `namespace`: AL nafnrými töflunnar (t.d. `"Microsoft.Sales.Customer"`) — tómur strengur fyrir töflur án nafnrýmis
- `readRestricted`: Boolean — `true` þegar taflan er læst fyrir `Data.Records.Get`. Innþi Bifröst / Change Log kerfistöflur og ekki-venjulegar töflutegundir eru leshömluðu.
- `writeRestricted`: Boolean — `true` þegar taflan er læst fyrir `Data.Records.Set`. Nær yfir allar leshömluðu töflur auk `Message ori` (lestur leyfður, skrift læst).

**Dæmi um notkun:**

*Dæmi 1 — Skila öllum töflum:*
```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0"
}
```

*Dæmi 2 — Sía að tiltekinni töflu með `tableName`:*
```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "data": {
    "tableName": "Customer"
  }
}
```

*Dæmi 3 — Allar töflur á tilteknu tungumáli:*
```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "lcid": 1039
}
```

---

## 2. Help.Fields.Get {#helpfieldsget}

**Tilgangur:** Sækja reitarlýsigögn fyrir tilgreinda töflu.

**Lýsing:** Sækir reitarlýsigögn fyrir tilgreinda töflu þ.m.t. reitanúmer, heiti, birtitexta, tegund, lengd og stöðu sem aðallykils hluta.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

```json
{
  "tableName": "Customer"
}
```

Eða með tilgreindum reitum:

```json
{
  "tableName": "Customer",
  "fieldNumbers": [1, 2, 21, 61]
}
```

**Tungumálastuðningur:** Sama og Help.Tables.Get — stilltu `lcid` á skilaboðastigi.

**Snið svars:**

```json
{
  "status": "Success",
  "result": [
    {
      "id": 1,
      "name": "No.",
      "jsonName": "No_",
      "caption": "No.",
      "class": "Normal",
      "type": "Code",
      "len": 20,
      "isPartOfPrimaryKey": true,
      "readRestricted": false,
      "writeRestricted": false
    },
    {
      "id": 2,
      "name": "Name",
      "jsonName": "Name",
      "caption": "Name",
      "class": "Normal",
      "type": "Text",
      "len": 100,
      "isPartOfPrimaryKey": false,
      "readRestricted": false,
      "writeRestricted": false
    },
    {
      "id": 21,
      "name": "Balance (LCY)",
      "jsonName": "BalanceLCY",
      "caption": "Balance (LCY)",
      "class": "FlowField",
      "type": "Decimal",
      "len": 0,
      "isPartOfPrimaryKey": false,
      "readRestricted": false,
      "writeRestricted": true
    },
    {
      "id": 35,
      "name": "Date Filter",
      "jsonName": "DateFilter",
      "caption": "Date Filter",
      "class": "FlowFilter",
      "type": "Date",
      "len": 0,
      "isPartOfPrimaryKey": false,
      "readRestricted": false,
      "writeRestricted": false
    },
    {
      "id": 3,
      "name": "Blocked",
      "jsonName": "Blocked",
      "caption": "Blocked",
      "class": "Normal",
      "type": "Option",
      "len": 0,
      "isPartOfPrimaryKey": false,
      "readRestricted": false,
      "writeRestricted": false,
      "enum": [
        { "value": " ", "caption": " ", "ordinal": 0 },
        { "value": "Ship", "caption": "Ship", "ordinal": 1 },
        { "value": "Invoice", "caption": "Invoice", "ordinal": 2 },
        { "value": "All", "caption": "All", "ordinal": 3 }
      ]
    }
  ]
}
```

**Lýsigögn reita:**

- `id`: Reitanúmer
- `name`: Reitnafn
- `jsonName`: Staðlað reitnafn notað í JSON-svörum (sértákn skipt út gegn undirstrikum)
- `caption`: Reitbirtiheiti á umbeðnu tungumáli
- `class`: Reitaflokkur — `"Normal"` fyrir venjulega reiti, `"FlowField"` fyrir reiknaða reiti, `"FlowFilter"` fyrir síuvíddareiti (notaðir í `tableView`)
- `type`: Gagnategund reits
- `len`: Lengd reits (0 fyrir tölulegar, option og FlowField reiti)
- `isPartOfPrimaryKey`: Hvort reitur sé hluti aðallykils
- `readRestricted`: Hvort virkur notandi sé með leshömlun á reitnum samkvæmt `Field Access ori` (hömlunargerð `Both` eða `Read`, eða samsvörim alttákn). Þegar `true`, sleppir `Data.Records.Get` reitnum úr svari án villu.
- `writeRestricted`: Hvort virkur notandi sé með skrifhömlun á reitnum samkvæmt `Field Access ori` (hömlunargerð `Both` eða `Write`, eða samsvörim alttákn). Þegar `true`, hafnar `Data.Records.Set` skrifum á reitnum.
- `enum` (aðeins fyrir Option reiti): Fylki af enum gildum, hvert með `value` (innri nafn), `caption` (birtiheiti) og `ordinal` (heiltölugildi)

**Dæmi um notkun:**

```json
{
  "specversion": "1.0",
  "type": "Help.Fields.Get",
  "source": "MyIntegrationApp v1.0",
  "subject": "Customer",
  "lcid": 1039
}
```

---

## 3. Help.MessageTypes.Get {#helpmessagetypesget}

**Tilgangur:** Sækja lista yfir allar tiltækar skilaboðategundir með lýsigögn þeirra.

**Lýsing:** Skilar lista yfir allar tiltækar skilaboðategundir með lýsigögn þeirra þ.m.t. síutöflunúmer, lýsingu og stefnu skilaboða.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

| Færibreyta | Staðsetning | Tegund | Nauðsynleg | Lýsing |
|-----------|----------|------|----------|-------------|
| `subject` | Bifröst reitur | Text | Nei | Þegar sett, skilar aðeins skilaboðategundinni sem samsvarar þessu nafni. Sleppa til að skila öllum. |
| `onlyEnabled` | data (JSON meginmál) | Boolean | Nei | Þegar `true`, skilar aðeins skilaboðategundum sem virkar eru fyrir núverandi notanda. Sjálfgefið: `false` (skilar öllum). |

**Beiðni — ein skilaboðategund eftir nafni:**

```json
{
  "type": "Help.MessageTypes.Get",
  "subject": "Data.Records.Get"
}
```

**Beiðni — aðeins virkar tegundir:**

```json
{
  "type": "Help.MessageTypes.Get",
  "data": { "onlyEnabled": true }
}
```

**Snið svars:**

```json
{
  "status": "Success",
  "result": [
    {
      "name": "Data.RecordIds.Get",
      "isEnabled": true,
      "filterTableNo": 0,
      "description": "Sækir færsluauðkenni og breytingartímastimpla...",
      "messageDirection": "Outbound"
    },
    {
      "name": "Help.Tables.Get",
      "isEnabled": true,
      "filterTableNo": 0,
      "description": "Skilar lista yfir allar tiltækar töflur...",
      "messageDirection": "Outbound"
    }
  ]
}
```

**Lýsigögnasreitir:**

- `name`: Heiti skilaboðategund
- `isEnabled`: `true` ef núverandi notandi hefur heimild til að nota þessa skilaboðategund
- `filterTableNo`: Töflunúmer sía (ef við á, 0 þýðir á við allar töflur)
- `description`: Lýsing á skilaboðategundinni
- `messageDirection`: Stefna skilaboða (Inbound/Outbound/Both)

**Dæmi um notkun:**

```json
{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0"
}
```

---

## 4. Help.Implementation.Get {#helpimplementationget}

**Tilgangur:** Sækja hjálparskjölun fyrir tilgreinda skilaboðategund.

**Lýsing:** Skilar hjálparskjölun fyrir tilgreinda skilaboðategund. Tilgreindu heiti skilaboðategund í subject reitnum.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

Heiti skilaboðategundar verður að vera tilgreint í **subject** reitnum:

```json
{
  "subject": "Help.Tables.Get"
}
```

**Snið svars:**

Skilar hjálparskjöluninni á **text/markdown** sniði. Svarið inniheldur nákvæmar skjölun þ.m.t.:

- Yfirlit yfir aðgerðir skilaboðategundar
- Sniðbeiðni og færibreytur
- Uppbyggingu svars
- Dæmi
- Villutilvik
- Bestu venjur

**Villutilvik:**

1. **Vantar subject reit**
   - Villa: "Subject field must contain the message type name (e.g., 'Help.Tables.Get')"

2. **Ógild skilaboðategund**
   - Villa: "Message type '&#123;name&#125;' is not valid or not found."

---

## 5. Help.Permissions.Get {#helppermissionsget}

**Tilgangur:** Sækja les- og skrifaheimildir núverandi notanda fyrir tilgreinda töflu.

**Lýsing:** Sækir les- og skrifaheimildir núverandi notanda fyrir tilgreinda töflu með RecordRef.ReadPermission() og RecordRef.WritePermission() aðferðunum.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

```json
{
  "tableName": "Customer"
}
```

**Snið svars:**

```json
{
  "status": "Success",
  "permissions": {
    "read": true,
    "write": false
  }
}
```

**Heimildireitir:**

- `read`: Boolean sem gefur til kynna hvort núverandi notandi hafi lesheimild á töfluna
- `write`: Boolean sem gefur til kynna hvort núverandi notandi hafi skrifaheimild (setja inn/breyta/eyða) á töfluna

**Dæmi um notkun:**

```json
{
  "specversion": "1.0",
  "type": "Help.Permissions.Get",
  "source": "MyIntegrationApp v1.0",
  "subject": "Customer"
}
```

```json
{
  "specversion": "1.0",
  "type": "Help.Permissions.Get",
  "source": "MyIntegrationApp v1.0",
  "subject": "G/L Account"
}
```

### Heimildalög

Aðgangur að gögnum gegnum Bifröst API er stýrt af **tveimur óháðum lögum**. Beiðni heppnast aðeins þegar bæði lögin leyfa hana.

1. **BC heimild** (það sem þessi skilaboðategund skilar)
   - Uppspretta: BC heimildasett notandans, ásamt `InherentPermissions` á AL hlutum.
   - Umfang: öll taflan (les / setja inn / breyta / eyða).
   - Þegar hafnað: `Data.Records.*` skilar heimildavillu frá BC vettvanginum.
2. **Bifröst takmarkanir** (uppsettar per notanda í `Field Access ori`)
   - Uppspretta: `Field Access ori` taflan, viðhaldin af Bifröst stjórnendum.
   - Umfang: per tafla **og** per reitur, með takmörkunartegundunum `Read`, `Write`, `Both` eða `Bypass`.
   - Þegar hafnað: `Data.Records.Get` sleppir reitnum þegjandi úr svari; `Data.Records.Set` hafnar skrifun með villu; Create skilaboðategundir (`Sales.Document.Create`, `Purchase.Document.Create`, `Inventory.AssemblyOrder.Create`, `Inventory.TransferOrder.Create`, `Finance.BankReconciliation.Create`) neita að stofna færsluna þegar aðalreiturinn er skrifa-takmarkaður.

#### Virkur aðgangur — uppflettitafla

| BC `read` | Bifröst les-takmörkun | Virkur lestur |
|-----------|-----------------------------|---------------|
| true | engin | Reitur skilar gildi |
| true | `Read` eða `Both` | Reitur er fjarlægður úr svari (þegjandi) |
| false | hvaða sem er | Öll beiðnin fellur með BC heimildavillu |

| BC `write` | Bifröst skrifa-takmörkun | Virk skrifun |
|------------|-------------------------------|---------------|
| true | engin | Gildi er skrifað |
| true | `Write` eða `Both` | Skrifun er hafnað með villu sem nefnir reit og gildi |
| false | hvaða sem er | Öll beiðnin fellur með BC heimildavillu |

### Hvernig á að leysa heildarmyndina

Til að vita hvort núverandi notandi getur í raun lesið eða skrifað í tilgreinda töflu eða reit, kallaðu allar þrjár uppspretturnar og sameinaðu þær:

1. **BC heimild á töflu** — kallaðu `Help.Permissions.Get` (þessa skilaboðategund). Les `permissions.read` og `permissions.write`.
2. **Bifröst takmörkun á töflu** — kallaðu `Help.Tables.Get` með auðkenni töflu. Hver tafla í niðurstöðu inniheldur `readRestricted` og `writeRestricted` táknfána á töflustigi.
3. **Bifröst takmörkun á einstökum reitum** — kallaðu `Help.Fields.Get` með auðkenni töflu. Hver reitur í niðurstöðu inniheldur `readRestricted` og `writeRestricted` fána sem leyst eru gegn **núverandi notanda**.

Sameina lögin:

- `canReadField = Help.Permissions.Get.permissions.read AND NOT Help.Tables.Get.readRestricted AND NOT Help.Fields.Get.readRestricted`
- `canWriteField = Help.Permissions.Get.permissions.write AND NOT Help.Tables.Get.writeRestricted AND NOT Help.Fields.Get.writeRestricted`

---

## 6. Help.NextLineNo.Get {#helpnextlinenoget}

**Tilgangur:** Skila næsta tiltæka línunúmeri fyrir hvaða töflu sem síðasti aðallyklireitur er Integer.

**Lýsing:** Gefið foreldri aðallykil gildi (með `primaryKey` JSON hlut eða `SystemId`), útfærslan síar á þeim foreldri reitum, kallar `FindLast` og skilar næsta gildi sem `lastLineNo + increment`. Svarið inniheldur fullkominn `primaryKey` hlut sem hægt er að senda beint til `Data.Records.Set`.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

| Færibreyta | Nauðsynleg | Tegund | Lýsing |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Text / Integer | Marktafla |
| `primaryKey` | Já* | Hlutur | Aðallykil foreldri reitargildi (allir nema síðasti Integer reitur) |
| `id` | Já* | GUID | SystemId á núverandi færslu í töflunni |
| `increment` | Nei | Integer | Gildi til að leggja við síðasta línunúmer. Sjálfgefið: 10000. Verður að vera > 0 |

\* Nákvæmlega eitt af `primaryKey` eða `id` verður að vera gefið. Ef bæði eru til staðar, hefur `id` forgang.

**Snið svars:**

```json
{
  "status": "Success",
  "primaryKey": {
    "DocumentType": "Order",
    "DocumentNo": "S-ORD-001",
    "LineNo": 40000
  }
}
```

**Dæmi um notkun:**

```json
{
  "specversion": "1.0",
  "type": "Help.NextLineNo.Get",
  "source": "external",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Sales Line",
    "primaryKey": {
      "DocumentType": "Order",
      "DocumentNo": "S-ORD-001"
    },
    "increment": 10000
  }
}
```

---

## 7. Field.Translation.Get {#fieldtranslationget}

**Tilgangur:** Sækja BC kerfisþýðingar fyrir tiltekinn reit á færslu.

**Lýsing:** Sækir geymdri þýðingu á færslureit með kóðaeiningu 3711 "Translation". Krefst tiltekins tungumáls (lcid). Skilar sléttri JSON svari með þýðingargildinu.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

| Færibreyta | Nauðsynleg | Tegund | Lýsing |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Text / Integer | Marktafla |
| `systemId` / `id` | Já* | GUID | Færslu SystemId (* eða notaðu subject reit sem GUID) |
| `fieldId` / `fieldNo` | Já | Integer | Markreiturinn á töflunni |
| `lcid` | Já | Integer | Windows Language ID (nauðsynlegt). |

**Athugið:** `lcid` færibreytan verður að vera gefin í beiðni JSON gagnaumboðinu, ekki á Bifröst skilaboðastigi.

**Snið svars:**

```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "fieldId": 3,
  "lcid": 1039,
  "value": "Borð úr tré"
}
```

**Dæmi um notkun:**

```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Get",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": {
    "systemId": "12345678-1234-1234-1234-123456789012",
    "fieldId": 3,
    "lcid": 1039
  }
}
```

---

## Help.PageUrl.Get

**Tilgangur:** Skila Business Central vefslóð fyrir spjaldsíðu tiltekinnar færslu.

**Lýsing:** Leyst er úr töflu og færslu SystemId með stöðluðum beiðnisniðum í argument-töflunni, skilyrt spjaldsíða er fundin með kóðaeiningunni `Page Management`, og vefslóð síðunnar er skilað. Aðeins er skilað `Success` þegar vefslóðin fæst og er ekki tóm.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

| Færibreyta | Nauðsynleg | Tegund | Lýsing |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já* | Text / Integer | Marktafla |
| `subject` | Já* / Já** | Text | Getur innihaldið annaðhvort töfluauðkenni eða GUID SystemId færslu |
| `id` / `systemId` / `recordId` / `recordSystemId` | Já** | GUID | SystemId markfærslunnar |

\* Töfluauðkenni er nauðsynlegt.
\*\* Færsluauðkenni er nauðsynlegt.

**Snið svars:**

**Efnisgerð svars (Content Type):** `text/json`

```json
{
  "status": "Success",
  "url": "https://businesscentral.dynamics.com/..."
}
```

**Svarreitir:**

| Reitur | Tegund | Lýsing |
|---|---|---|
| `status` | Texti | `"Success"` þegar vefslóð síðunnar fannst |
| `url` | Texti | Vefslóð spjaldsíðu færslunnar |

**Dæmi um notkun (tafla í gögnum, auðkenni í gögnum):**

```json
{
  "specversion": "1.0",
  "type": "Help.PageUrl.Get",
  "source": "external",
  "id": "pageurl-001",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Customer",
    "id": "a0e2b3c4-d5e6-7890-abcd-ef1234567890"
  }
}
```

**Dæmi um notkun (tafla í subject, recordSystemId í gögnum):**

```json
{
  "specversion": "1.0",
  "type": "Help.PageUrl.Get",
  "source": "external",
  "subject": "Customer",
  "datacontenttype": "application/json",
  "data": {
    "recordSystemId": "a0e2b3c4-d5e6-7890-abcd-ef1234567890"
  }
}
```

**Villuskilaboð:**

- **Vantar töfluauðkenni**: "Table identifier is required. Provide tableName, tableNumber, tableNo, tableId, or subject."
- **Vantar færsluauðkenni**: "Record identifier is required. Provide id, systemId, recordId, recordSystemId, or a GUID subject."
- **Færsla fannst ekki**: "Record not found in table &#123;tableId&#125; with SystemId &#123;guid&#125;."
- **Engin spjaldsíðuslóð**: "No card page URL could be resolved for table '&#123;tableCaption&#125;' and record &#123;guid&#125;."

---

## 8. Field.Translation.Set {#fieldtranslationset}

**Tilgangur:** Skrifa eða eyða BC kerfisþýðingu fyrir tiltekinn reit á færslu.

**Lýsing:** Skrifar eina þýðingu á færslureit með kóðaeiningu 3711 "Translation". Til að eyða þýðingu, sendu tómt gildi fyrir tilgreint tungumál.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

| Færibreyta | Nauðsynleg | Tegund | Lýsing |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Text / Integer | Marktafla |
| `systemId` / `id` | Já | GUID | Færslu SystemId (gefið í gagnaumboðinu) |
| `fieldId` / `fieldNo` | Já | Integer | Markreiturinn á töflunni |
| `lcid` | Já | Integer | Windows Language ID |
| `value` | Nei | Text | Þýtt gildi (max 2048 stafir). Tómt eða sleppt eyðir þýðingunum. |

**Snið svars:**

```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "fieldId": 3,
  "lcid": 1039,
  "value": "Borð úr tré"
}
```

**Dæmi 1 — Stilla þýðingu á reit (íslenska):**

```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Set",
  "source": "MyApp v1.0",
  "data": {
    "tableName": "Item",
    "systemId": "12345678-1234-1234-1234-123456789012",
    "fieldId": 3,
    "lcid": 1039,
    "value": "Borð úr tré"
  }
}
```

**Dæmi 2 — Eyða þýðingu (senda tómt gildi):**

```json
{
  "specversion": "1.0",
  "type": "Field.Translation.Set",
  "source": "MyApp v1.0",
  "subject": "Item",
  "data": {
    "systemId": "12345678-1234-1234-1234-123456789012",
    "fieldId": 3,
    "lcid": 1039,
    "value": ""
  }
}
```

---

## 9. Field.Translations.Get {#fieldtranslationsget}

**Tilgangur:** Sækja BC kerfisþýðingar fyrir alla reiti (eða tiltekinn reit) á færslu.

**Lýsing:** Sækir allar geymdar þýðingar á færslu með kóðaeiningu 3711 "Translation". Ólíkt Field.Translation.Get (eintala), skilar þessi endapunktur þýðingum yfir marga reiti, þar sem hver færsla inniheldur `fieldId`. Valfrjálst síað eftir reit og/eða tungumáli.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

| Færibreyta | Nauðsynleg | Tegund | Lýsing |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Text / Integer | Marktafla |
| `systemId` / `id` | Já | GUID | Færslu SystemId (gefið í gagnaumboðinu) |
| `fieldId` / `fieldNo` | Nei | Integer | Markreiturinn. Þegar sleppt eða 0, skilar þýðingum fyrir ALLA reiti. |
| `lcid` | Nei | Integer | Windows Language ID sía. Slepptu til að fá öll tungumál. |

**Snið svars:**

```json
{
  "status": "Success",
  "tableId": 27,
  "systemId": "12345678-1234-1234-1234-123456789012",
  "translationCount": 4,
  "translations": [
    { "fieldId": 3, "languageId": 1039, "value": "Borð úr tré" },
    { "fieldId": 3, "languageId": 1040, "value": "Scrivania" },
    { "fieldId": 5, "languageId": 1039, "value": "Tré" },
    { "fieldId": 5, "languageId": 1040, "value": "Legno" }
  ]
}
```

**Svarreitir:**

| Reitur | Tegund | Lýsing |
|---|---|---|
| `status` | Text | `"Success"` eða `"Error"` |
| `tableId` | Integer | Töflunúmer |
| `systemId` | GUID | Færslu SystemId (án sviga) |
| `fieldId` | Integer | Reitauðkenni (aðeins til staðar þegar tiltekinn reitur er umbeðinn) |
| `lcid` | Integer | Tungumálasía (aðeins til staðar þegar umbeðið) |
| `translationCount` | Integer | Fjöldi þýðingarfærslna skilað |
| `translations` | Array | Fylki þýðingarhlutar |
| `translations[].fieldId` | Integer | Reitauðkenni (alltaf innifalið í fleirtölu Get) |
| `translations[].languageId` | Integer | Windows Language ID |
| `translations[].value` | Text | Þýtt gildi |

---

## Samþætttingarmynstur

### Mynstur 1: Uppbygging kerfisuppgötvunar

**Skref 1: Fá allar töflur**
```json
{
  "type": "Help.Tables.Get"
}
```

**Skref 2: Fá reiti fyrir tilgreinda töflu**
```json
{
  "type": "Help.Fields.Get",
  "subject": "Customer"
}
```

**Skref 3: Athuga heimildir notanda**
```json
{
  "type": "Help.Permissions.Get",
  "subject": "Customer"
}
```

**Skref 4: Sækja gögn ef leyft**
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Customer"
  }
}
```

---

## Help.WhoAmI.Get

**Útfærsla:** `HelpWhoAmIGetImpl` (Codeunit 10078023)
**Hjálpar-kóðaeining:** `HelpWhoAmIGetHelp` (Codeunit 10078024)
**Stefna:** Útlæg

### Tilgangur

Skilar yfirgripsmiklu notandasniði fyrir þann sem kallar. Svarið inniheldur BC-stillingar, hlutverkatengingar, tengdar starfsmanns-/tilfanga-/sölumannaupplýsingar, fyrirtækjaupplýsingar, valfrjálsar tengdar viðskiptafærslur (viðskiptamaður, lánardrottinn, tengiliður, fjárhagsreikningur), valfrjálsa kerfisboðskipun sem geymd er í Bifröst notandauppsetningu og upplýsingar um hvort notandinn hafi skrifheimildir á fyrirtækjaminni.

Ytri gervigreindakerfi nota þetta til að finna út við hvern þau eiga samskipti og til að sækja notendabundið samhengi.

### Inntak

Engar inntaksfæribreytur eru nauðsynlegar. Skilaboðategundin notar samhengi köllunarinnar.

```json
{
  "specversion": "1.0",
  "type": "Help.WhoAmI.Get",
  "source": "external",
  "id": "whoami-001",
  "datacontenttype": "application/json",
  "data": {}
}
```

### Svarsnið

```json
{
  "status": "Success",
  "user": {
    "userSecurityId": "a1b2c3d4-...",
    "userName": "DOMAIN\\USER",
    "fullName": "Jón Jónsson",
    "contactEmail": "jon@example.com",
    "authenticationEmail": "jon@example.com"
  },
  "personalization": {
    "profileId": "BUSINESS MANAGER",
    "languageId": 1039,
    "localeId": 1039,
    "company": "CRONUS Iceland hf.",
    "timeZone": "UTC"
  },
  "userSetup": {
    "userId": "JON",
    "salesPurchCode": "JS",
    "approverId": "MANAGER1",
    "salesRespCtrFilter": "",
    "purchaseRespCtrFilter": "",
    "serviceRespCtrFilter": "",
    "allowPostingFrom": "2025-01-01",
    "allowPostingTo": "2025-12-31",
    "timeSheetAdmin": false,
    "email": "jon@example.com"
  },
  "approvalSetup": {
    "approverId": "MANAGER1",
    "approvalAdministrator": false,
    "unlimitedSalesApproval": false,
    "unlimitedPurchaseApproval": false,
    "unlimitedRequestApproval": false,
    "salesAmountApprovalLimit": 10000,
    "purchaseAmountApprovalLimit": 5000,
    "requestAmountApprovalLimit": 5000,
    "substitute": "JON2"
  },
  "notificationSetup": [
    {
      "notificationType": "New Record",
      "notificationMethod": "Email",
      "recurrence": "Daily",
      "time": "08:00:00",
      "dailyFrequency": "Weekday"
    }
  ],
  "resource": {
    "no": "JS",
    "name": "Jón Jónsson",
    "type": "Person"
  },
  "salesperson": {
    "code": "JS",
    "name": "Jón Jónsson",
    "email": "jon@example.com",
    "phoneNo": "+354 555 1234"
  },
  "employee": {
    "no": "EMP001",
    "firstName": "Jón",
    "lastName": "Jónsson",
    "socialSecurityNo": "010180-1234",
    "email": "jon@example.com",
    "phoneNo": "+354 555 1234",
    "jobTitle": "Forritari",
    "managerNo": "EMP002",
    "resourceNo": "JS"
  },
  "manager": {
    "no": "EMP002",
    "firstName": "Anna",
    "lastName": "Sigurðardóttir",
    "email": "anna@example.com",
    "phoneNo": "+354 555 5678",
    "jobTitle": "Teymisformaður"
  },
  "companyInfo": {
    "name": "CRONUS Iceland hf.",
    "name2": "",
    "address": "Laugavegur 123",
    "city": "Reykjavík",
    "postCode": "101",
    "countryRegionCode": "IS",
    "phoneNo": "+354 555 0000",
    "email": "info@company.is",
    "homePage": "https://company.is",
    "vatRegistrationNo": "123456-7890",
    "registrationNo": "1234567890"
  },
  "warehouseLocations": [
    { "locationCode": "BLUE", "default": true, "adcsUser": false },
    { "locationCode": "GREEN", "default": false, "adcsUser": false }
  ],
  "responsibilityCenters": {
    "salesRespCtrFilter": "AÐAL",
    "purchaseRespCtrFilter": "",
    "serviceRespCtrFilter": ""
  },
  "dueFromToOwner": {
    "glAccountNo": "33050",
    "name": "Arður",
    "balanceAtDate": 150000.00,
    "netChange": 25000.00
  },
  "customer": {
    "no": "10000",
    "name": "Contoso ehf.",
    "address": "Laugavegur 123",
    "city": "Reykjavík",
    "postCode": "101",
    "phoneNo": "+354 555 1234",
    "email": "info@contoso.is",
    "creditLimitLCY": 500000.00,
    "balanceLCY": 120000.00,
    "balanceDueLCY": 15000.00
  },
  "vendor": {
    "no": "20000",
    "name": "Fabrikam ehf.",
    "address": "Glerártorg 456",
    "city": "Akureyri",
    "postCode": "600",
    "phoneNo": "+354 555 5678",
    "email": "ap@fabrikam.is",
    "balanceLCY": 85000.00,
    "balanceDueLCY": 10000.00
  },
  "contact": {
    "no": "CT000001",
    "name": "Anna Jónsdóttir",
    "address": "Álmtré 789",
    "city": "Reykjavík",
    "postCode": "105",
    "phoneNo": "+354 555 9012",
    "email": "anna@example.com",
    "type": "Person",
    "companyNo": "CT000000",
    "companyName": "Contoso ehf."
  },
  "systemPrompt": "Þú ert hjálplegur aðstoðarmaður fyrir söluhópinn okkar...",
  "unreadNotifications": [
    {
      "sender": "ADMIN",
      "subject": "Eftirfylgni vegna pöntunar",
      "threadId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }
  ],
  "canUpdateCompanyMemory": true,
  "canSendAndCancelApprovalRequests": true
}
```

### Svarsreitir

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | Strengur | `Success` |
| `user` | Hlutur/null | Notandafærsla úr kerfistöflu User |
| `personalization` | Hlutur/null | Sérstillingar notanda (forstilling, tungumál, svæði, tímabelti) |
| `userSetup` | Hlutur/null | Uppsetning notanda (sölu-/innkaupamaður, samþykktaraðili, bókunardagsetningar) |
| `approvalSetup` | Hlutur/null | Samþykkismörk og kerfisstjórnunarflögg |
| `notificationSetup` | Fylki/null | Tilkynningauppsetning (tegund, aðferð, endurtekning, tími, dagleg tíðni) |
| `resource` | Hlutur/null | Tilfang tengt í gegnum Time Sheet Owner — eða yfirskrif frá Bifröst notandauppsetningu |
| `salesperson` | Hlutur/null | Sölu-/innkaupamaður tengdur í gegnum notandauppsetningu — eða yfirskrif frá Bifröst notandauppsetningu |
| `employee` | Hlutur/null | Starfsmaður tengdur í gegnum tilfangsnúmer — eða yfirskrif frá Bifröst notandauppsetningu |
| `manager` | Hlutur/null | Yfirmaður tengds starfsmanns |
| `companyInfo` | Hlutur/null | Fyrirtækjaupplýsingar fyrir núverandi fyrirtæki |
| `warehouseLocations` | Fylki/null | Staðsetningarúthlutanir vöruhússtarfsmanns |
| `responsibilityCenters` | Hlutur/null | Ábyrgðarstöðvarsíur úr notandauppsetningu |
| `dueFromToOwner` | Hlutur/null | Fjárhagsreikningur tengdur í gegnum Bifröst notandauppsetningu |
| `customer` | Hlutur/null | Viðskiptamaður tengdur í gegnum Bifröst notandauppsetningu |
| `vendor` | Hlutur/null | Lánardrottinn tengdur í gegnum Bifröst notandauppsetningu |
| `contact` | Hlutur/null | Tengiliður tengdur í gegnum Bifröst notandauppsetningu |
| `systemPrompt` | Strengur/null | Kerfisboðskipun á hvern notanda, á hvert fyrirtæki (venjulegur UTF-8 texti) |
| `unreadNotifications` | Fylki | Ólesnar tilkynningaþræðir fyrir núverandi notanda. Hver hlutur inniheldur: `sender` (notandaauðkenni sendanda), `subject` (efni tilkynningar), `threadId` (GUID þráðar). Tómt fylki þegar engar ólesnar tilkynningar eru. |
| `canUpdateCompanyMemory` | Boolean | Hvort sá sem kallar geti notað `Memory.Company.Set` skilaboðagerðina (hefur skrifheimildir á Bifröst Memory töflunni) |
| `canSendAndCancelApprovalRequests` | Boolean | Hvort sá sem kallar geti notað `Document.Approval.Send` og `Document.Approval.Cancel` skilaboðagerðirnar (hefur skrifheimildir á Approval Access ori töflunni) |

Sérhver reitur skilar `null` þegar samsvarandi færsla finnst ekki eða notandi hefur ekki leseheimildir.

### Tengdar færslur - yfirskriftar (Bifröst notandauppsetning)

**Bifröst notandauppsetningin** getur geymt tengireitir á hvern notanda sem yfirskrifa sjálfgefna uppflettingu og bæta við hlutum í svarið:

| Tengireitur | Yfirskrifar | Sjálfgefin uppfletting | Þegar tómt |
|-------------|-------------|-------------------------|------------|
| `Resource No.` | `resource` | Time Sheet Owner User ID | Fer til baka í Time Sheet Owner |
| `Salesperson Code` | `salesperson` | Notandauppsetning → Sölu-/innkaupamaður | Fer til baka í notandauppsetningu |
| `Employee No.` | `employee`, `manager` | Tilfang → Starfsmaður (í gegnum tilfangsnúmer) | Fer til baka í Tilfang→Starfsmaður keðju |
| `G/L Account No.` | `dueFromToOwner` | *(ekkert sjálfgefið)* | Hluti skilar `null` |
| `Customer No.` | `customer` | *(ekkert sjálfgefið)* | Hluti skilar `null` |
| `Vendor No.` | `vendor` | *(ekkert sjálfgefið)* | Hluti skilar `null` |
| `Contact No.` | `contact` | *(ekkert sjálfgefið)* | Hluti skilar `null` |

Sjá **[Setup_Reference.md](/foundation/reference/setup/)** → Bifröst notandauppsetning fyrir nánari stillingarleiðbeiningar.

### Villumeðhöndlun

Þessi skilaboðategund gefur ekki villur vegna færslna sem vantar. Hver gagnahluti skilar sjálfstætt `null` þegar samsvarandi færsla finnst ekki eða notandi hefur ekki leseheimildir. Eina villan kemur upp þegar óstudd skilaboðaútgáfa er notuð (ekki `1.0`).

---

## 10. Help.TableRelations.Get {#helptablerelationsget}

**Tilgangur:** Skilar öllum ytri lyklasamböndum sem eru skilgreindar á tilteknum töflureit, þar með taldar skilyrt greiningasamböndsgreinar og öfug sambönd (reitir í öðrum töflum sem vísa til þessa reitar).

**Lýsing:** Les úr kerfistöflunni `Table Relations Metadata` (2000000140) til að skila sérhverri samböndsgrein sem er skilgreind fyrir upprunareit töflu, ásamt `relatedTo` fylki sem listar öfug sambönd — reitir í öðrum töflum sem vísa til tilgreindrar töflu og reitar sem ytri lykilmark. Bæði töflu- og reitarauðkenning er nauðsynleg. Reitir með mörg skilyrt sambönd birtast sem margar raðir með fullum skilyrðisupplýsingum.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

| Færibreyta | Nauðsynleg | Tegund | Lýsing |
|------------|------------|--------|--------|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Texti / Heiltala | Upprunatafla (staðlað töfluauðkenni) |
| `fieldId` / `fieldNo` | Já* | Heiltala | Reitarnúmer |
| `fieldName` | Já* | Texti | Reitarheiti (notað aðeins ef `fieldId`/`fieldNo` er ekki gefið) |

\* Eitt af `fieldId`, `fieldNo` eða `fieldName` er nauðsynlegt.

**Svarsnið:**

```json
{
  "status": "Success",
  "tableId": 37,
  "tableName": "Sales Line",
  "relationCount": 2,
  "relations": [
    {
      "tableId": 37,
      "fieldNo": 6,
      "fieldName": "No.",
      "fieldJsonName": "No_",
      "relationNo": 1,
      "relatedTableId": 15,
      "relatedTableName": "G/L Account",
      "relatedFieldNo": 0,
      "relatedFieldName": "(Primary Key)",
      "relatedFieldJsonName": "PrimaryKey",
      "conditionType": "Const",
      "conditionFieldNo": 5,
      "conditionFieldName": "Type",
      "conditionFieldJsonName": "Type",
      "conditionValue": " "
    },
    {
      "tableId": 37,
      "fieldNo": 6,
      "fieldName": "No.",
      "fieldJsonName": "No_",
      "relationNo": 2,
      "relatedTableId": 27,
      "relatedTableName": "Item",
      "relatedFieldNo": 0,
      "relatedFieldName": "(Primary Key)",
      "relatedFieldJsonName": "PrimaryKey",
      "conditionType": "Const",
      "conditionFieldNo": 5,
      "conditionFieldName": "Type",
      "conditionFieldJsonName": "Type",
      "conditionValue": "Item"
    }
  ],
  "relatedToCount": 0,
  "relatedTo": []
}
```

> **Athugið:** Í þessu dæmi (Sales Line reiturinn "No.") er `relatedTo` tómt vegna þess að engin önnur tafla vísar til Sales Line.No. sem ytri lykilmark. Fyrir reit eins og Customer."No." myndi `relatedTo` fylkið innihalda færslur frá Sales Header, Sales Line og öðrum töflum sem vísa til viðskiptamanns.

**Svarsreitir (umslag):**

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `status` | Strengur | `"Success"` eða `"Error"` |
| `tableId` | Heiltala | Upprunatöflunúmer |
| `tableName` | Strengur | Heiti upprunatöflu |
| `relationCount` | Heiltala | Heildarfjöldi samböndsraða í svari |
| `relations` | Fylki | Fylki af sambandsobjektum |
| `relatedToCount` | Heiltala | Fjöldi öfugra samböndsraða |
| `relatedTo` | Fylki | Fylki af öfugum sambandsobjektum (reitir í öðrum töflum sem vísa til þessa reitar) |

**Sambandsobjektareitir:**

Bæði `relations` og `relatedTo` fylkin nota sömu hlutagerð:

| Reitur | Tegund | Lýsing |
|--------|--------|--------|
| `tableId` | Heiltala | Auðkenni upprunatöflu (taflan sem á ytri lykilinn) |
| `fieldNo` | Heiltala | Reitarnúmer upprunareitar |
| `fieldName` | Strengur | Heiti upprunareitar |
| `fieldJsonName` | Strengur | Heiti upprunareitar sem JSON-lykill (eins og `Data.Records.Get` notar) |
| `relationNo` | Heiltala | Greiningarnúmer sem aðgreinir margar skilyrtar greinar á sama reit |
| `relatedTableId` | Heiltala | Töflunúmer tengdu töflunnar |
| `relatedTableName` | Strengur | Heiti tengdu töflunnar |
| `relatedFieldNo` | Heiltala | Reitarnúmer í tengdu töflunni. `0` þýðir aðallykill. |
| `relatedFieldName` | Strengur | Heiti tengda reitar, eða `"(Primary Key)"` þegar `relatedFieldNo = 0`. |
| `relatedFieldJsonName` | Strengur | Heiti tengda reitar sem JSON-lykill |
| `conditionType` | Strengur | Skilyrðisgerð (sjá töflu hér að neðan) |
| `conditionFieldNo` | Heiltala | Reitarnúmer skilyrðisreitar (0 ef ekkert) |
| `conditionFieldName` | Strengur | Heiti skilyrðisreitar (tómt ef ekkert) |
| `conditionFieldJsonName` | Strengur | Heiti skilyrðisreitar sem JSON-lykill (tómt ef ekkert) |
| `conditionValue` | Strengur | Gildi sem virkjar þessa samböndsgrein |

**Skilyrðisgerðir:**

| Gildi | Merking |
|-------|---------|
| `""` (autt) | Skilyrðislaust — samband gildir óháð öðrum reitargildum |
| `"TableFilter"` | Samband er virkt þegar skilyrðisreitur samræmist töflusíu |
| `"Const"` | Samband er virkt þegar skilyrðisreitur er jafnt fasta gildi |
| `"Filter"` | Samband er virkt þegar skilyrðisreitur samræmist síusegð |
| `"Field"` | Samband er virkt þegar skilyrðisreitur samræmist öðru reitargildi |

**Villumeðhöndlun:**

Reitur sem engin önnur tafla vísar til skilar `relatedToCount: 0` og tómu `relatedTo` fylki. Reitur án útleiddra samböndna skilar `relationCount: 0` og tómu `relations` fylki.

**Dæmi um notkun (sía eftir reitarheiti):**

```json
{
  "specversion": "1.0",
  "type": "Help.TableRelations.Get",
  "source": "external",
  "id": "tablerel-001",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Sales Line",
    "fieldName": "No."
  }
}
```

**Dæmi um notkun (sía eftir reitarnúmeri):**

```json
{
  "specversion": "1.0",
  "type": "Help.TableRelations.Get",
  "source": "external",
  "id": "tablerel-002",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Customer",
    "fieldNo": 35
  }
}
```

**Dæmi um notkun (sía eftir töflunúmeri og reitarauðkenni):**

```json
{
  "specversion": "1.0",
  "type": "Help.TableRelations.Get",
  "source": "external",
  "id": "tablerel-003",
  "datacontenttype": "application/json",
  "data": {
    "tableNumber": 18,
    "fieldId": 1
  }
}
```

---

## Help.Bifröst.Get

**Stefna**: Útlæg
**Flokkur**: Lýsigögn

### Yfirlit

Skilar stuttu Markdown-yfirliti yfir alla `Help.*` uppgötvunarendapunkta og leiðbeinir kallaranum að sækja fullan tæknileiðarvísi um Bifröst API með `Help.Implementation.Get` og `subject = "Help.Bifrost.Get"`. Notist þegar AI-umboðsmaður eða samþætting þarf fljótlegt kort yfir tiltæka endapunkta án þess að sækja allan tæknitexta strax.

### Dæmi um beiðni

```json
{
  "type": "Help.Bifrost.Get",
  "subject": "",
  "data": {}
}
```

Engar færibreytur. `subject` og `data` eru hunsuð.

### Dæmi um svar

```json
{
  "status": "Success",
  "result": {
    "messageType": "Help.Bifrost.Get",
    "format": "markdown",
    "markdown": "# Bifrost API - Help endpoints\n\nThis response is a short directory. ...",
    "fullHelpInstructions": "Call Help.Implementation.Get with subject=\"Help.Bifrost.Get\" to retrieve the full technical Bifrost API how-to guide as Markdown."
  }
}
```

### Svarreitir

| Reitur | Tegund | Lýsing |
|---|---|---|
| `status` | strengur | `"Success"` |
| `result.messageType` | strengur | Alltaf `"Help.Bifrost.Get"` |
| `result.format` | strengur | Alltaf `"markdown"` |
| `result.markdown` | strengur | Stutt Markdown-yfirlit sem listar alla `Help.*.Get` endapunkta með einnar línu skýringu |
| `result.fullHelpInstructions` | strengur | Leiðbeining á ensku sem segir kallaranum að kalla `Help.Implementation.Get` með `subject="Help.Bifrost.Get"` til að fá fullan tæknileiðarvísi |

### Hvernig á að sækja fullan tæknileiðarvísi

```json
{
  "type": "Help.Implementation.Get",
  "subject": "Help.Bifrost.Get",
  "data": {}
}
```

Reiturinn `markdown` í svari inniheldur fulla tækniumfjöllun: talning færslna, samtölur á þjóni, FlowFields/FlowFilters, `tableView` málskipan, form aðallykla, upsert-semantík, gjaldmiðlameðhöndlun, tvíundarreiti, Change Log Write Guard og LCID-meðhöndlun.

### Tengdar skilaboðategundir

- `Help.Implementation.Get` — fullur tækni­leiðarvísir á hverja skilaboðategund
- `Help.MessageTypes.Get` — talning allra skilaboðategunda
- `Help.Tables.Get`, `Help.Fields.Get` — lýsigagnauppgötvun

---

## Tengd skjöl

- **[API_Reference.md](/foundation/reference/api/)**: API-endapunktar og auðkenning
- **[Data_Message_Types.md](/foundation/message-types/data/)**: Gagnasækja og vinnslu skilaboðategundir
- **[Sales_Message_Types.md](/foundation/message-types/sales/)**: Sölu og viðskiptagreind skilaboðategundir
- **[Setup_Reference.md](/foundation/reference/setup/)**: Bifröst uppsetningarstillingar
