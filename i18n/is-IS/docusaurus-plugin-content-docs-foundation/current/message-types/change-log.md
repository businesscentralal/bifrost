---
id: change-log
title: "Change log message types"
sidebar_position: 10
---

Þetta skjal fjallar um þrjár skilaboðategundir sem setja BC-breytingaskrána (Change Log) fram til skoðunar á reitastigsstigum, endurheimtu og stöðuprófa.

---

## Yfirlit

| Skilaboðategund | Stefna | Lýsing |
|---|---|---|
| `ChangeLog.Field.History` | Útlæg (lestur) | Skilar núgildandi gildi og heilli breytingasögu fyrir einn reit á færslu |
| `ChangeLog.Field.Restore` | Innlæg (skrif) | Endurheimtir reit í fyrra gildi úr breytingaskrá (eftir færslunúmeri eða tímapunkti) |
| `ChangeLog.Field.Enabled` | Útlæg (lestur) | Athugar hvort reitur sé á BC-breytingaskrá |
| `ChangeLog.Records.Delta` | Útlæg (lestur) | Skilar einkvæmum SystemId fyrir færslur sem breyttust (innsetning/breyting) í töflu innan tímabils, valkvætt síað við reiti |

**Forskilyrði:** BC-breytingaskráin verður að vera stillt fyrir hlutaðeigandi töflur og reiti
(`Stjórnun → Uppsetning breytingaskrár → Töflur`). Án breytingaskráarfærslna er engin saga til að skoða eða endurheimta.

**Dæmigerð vinnuferli:**
1. Kalla `ChangeLog.Field.Enabled` til að staðfesta að reitur sé rakinn.
2. Kalla `ChangeLog.Field.History` til að skoða breytingar og velja `entryNo` sem miðast að.
3. Kalla `ChangeLog.Field.Restore` með þetta `entryNo` til að skrifa gildið aftur.

---

## ChangeLog.Field.History

**Stefna:** Útlæg  
**Hlutkenni:** Kóðaeining 10078000 (`ChangeLog Field History Impl`), Kóðaeining 10078001 (`ChangeLog Field History Help`)

### Tilgangur

Skilar núgildandi gildi reits ásamt öllum breytingaskráarfærslum fyrir
þann reit á tiltekinni færslu, raðað frá nýjasta til elsta.

Svarið byrjar alltaf með þjálfunarlegri **Current** færslu við `entryNo = 0` sem sýnir
gildandi reitgildi. Þetta gerir það auðvelt fyrir kallara að bera saman núverandi stöðu við
söguleg gögn án sérstaks uppflettings.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.History",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"recordSystemId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"fieldNo\":2}"
}
```

#### Inntaksfæribreytur

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | string / integer | Já | Marktafla — heiti (t.d. `"Customer"`) eða númer (t.d. `18`). |
| `recordSystemId` / `systemId` / `id` | GUID string | Já* | SystemId færslunnar. |
| `fieldNo` / `fieldId` / `fieldName` | integer / string | Já | Reiturinn til að sækja sögu fyrir. |

*Ef `recordSystemId` vantar í gagnafærslu, er `subject`-eigind Bifröst notuð sem GUID-varabú.

### Snið svars

```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldType": "Text",
  "history": [
    {
      "entryNo": 0,
      "dateAndTime": "2026-03-28T14:22:00.000Z",
      "typeOfChange": "Current",
      "oldValue": "",
      "newValue": "Contoso Ltd.",
      "userId": "ADMIN"
    },
    {
      "entryNo": 56789,
      "dateAndTime": "2026-03-10T09:00:00.000Z",
      "typeOfChange": "Modification",
      "oldValue": "Contoso Inc.",
      "newValue": "Contoso Ltd.",
      "userId": "ADMIN"
    },
    {
      "entryNo": 45001,
      "dateAndTime": "2025-11-15T11:30:00.000Z",
      "typeOfChange": "Modification",
      "oldValue": "Contoso",
      "newValue": "Contoso Inc.",
      "userId": "JANE"
    }
  ],
  "totalCount": 3
}
```

#### Reitir á efsta stigi svars

| Reitur | Tegund | Lýsing |
|---|---|---|
| `status` | Text | `Success` eða `Error` |
| `tableNo` | Integer | Töflunúmer |
| `tableName` | Text | Heiti töflu |
| `recordSystemId` | Text | Færslu SystemId (GUID án sveigja) |
| `fieldNo` | Integer | Reitanúmer |
| `fieldName` | Text | Heiti reits |
| `fieldType` | Text | Gagnategund (`Text`, `Code`, `Decimal`, `Date`, o.s.frv.) |
| `history` | Array | Breytingafærslur, nýjast fyrst. Vísi 0 er alltaf núverandi gildandi staða. |
| `totalCount` | Integer | Fjöldi færslna í `history` (þar með talið `entryNo=0` þjálfunarlega færslan) |

#### Reitir sögulegrar færslu

| Reitur | Tegund | Lýsing |
|---|---|---|
| `entryNo` | BigInteger | Númer breytingaskráarfærslu. `0` = núverandi gildandi staða (þjálfunarlegt). Notaðu `entryNo > 0` með `ChangeLog.Field.Restore`. |
| `dateAndTime` | DateTime | ISO 8601 tímastimpill. Fyrir `entryNo=0` er þetta `SystemModifiedAt` færslunnar. |
| `typeOfChange` | Text | `Current` (vísi 0 eingöngu), `Insertion`, `Modification`, eða `Deletion` |
| `oldValue` | Text | Gildi fyrir breytinguna. Tómt fyrir `entryNo=0`. |
| `newValue` | Text | Gildi eftir breytinguna. Fyrir `entryNo=0` er þetta gildandi reitgildi. |
| `userId` | Text | Notandinn sem gerði breytinguna. Fyrir `entryNo=0` leyst úr `SystemModifiedBy` GUID. |

#### Villutilvik

| Villa | Ástæða |
|---|---|
| `Table not found` | Ógilt töluheiti eða númer |
| `recordSystemId or a subject GUID is required` | Engin færsluauðkenni gefin |
| `Field identifier required` | Engin `fieldNo`, `fieldId`, eða `fieldName` gefin |
| `Field read-restricted` | Reitur er lokaður í Field Access ori |
| `Record not found` | Engin færsla með gefið SystemId |

---

## ChangeLog.Field.Restore

**Stefna:** Innlæg (skrif)  
**Hlutkenni:** Kóðaeining 10078071 (`ChgLog Field Restore Impl ori`), Kóðaeining 10077926 (`ChgLog Field Restore Help ori`)

### Tilgangur

Skrifar fyrra reitgildi aftur í lifandi Business Central færsluna. Gildið er tekið
úr `Old Value` völdrar breytingaskráarfærslu. Endurheimtan er framkvæmd með
`Validate()` + `Modify(true)` svo allar viðskiptalegifraðar á reitastigi keyri eðlilega.

Styður tvær stillingar:

| Stilling | Auðkenni | Lýsing |
|---|---|---|
| **1 — Eftir færslunúmeri** | `entryNo` | Endurheimtir `Old Value` tiltekinnar breytingaskráarfærslu |
| **2 — Eftir tímapunkti** | `restoreToDateTime` | Finnur nýjustu `Modification`-færslu við eða fyrir tímastimpilinn og endurheimtir `Old Value` hennar |

### Stilling 1: Eftir færslunúmeri

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Restore",
  "source": "MyApp v1.0",
  "data": "{\"entryNo\":56789}"
}
```

| Færibreyta | Nauðsynleg | Lýsing |
|---|---|---|
| `entryNo` | Já | Númer breytingaskráarfærslu frá `ChangeLog.Field.History`. Verður að vera > 0. |

### Stilling 2: Eftir tímapunkti

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Restore",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"recordSystemId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"fieldNo\":2,\"restoreToDateTime\":\"2026-02-10T09:15:00Z\"}"
}
```

| Færibreyta | Nauðsynleg | Lýsing |
|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Marktafla |
| `recordSystemId` | Já | SystemId (GUID) færslunnar |
| `fieldNo` / `fieldId` / `fieldName` | Já | Reiturinn til að endurheimta |
| `restoreToDateTime` | Já | ISO 8601 tímastimpill — finnur nýjustu `Modification`-færslu við eða fyrir þennan tíma |

### Snið svars

```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "fieldName": "Name",
  "previousValue": "Contoso Ltd.",
  "restoredValue": "Contoso Inc.",
  "fromEntryNo": 56789,
  "entryDateTime": "2026-02-10T09:15:00.000Z"
}
```

| Reitur | Tegund | Lýsing |
|---|---|---|
| `status` | Text | `Success` eða `Error` |
| `tableNo` | Integer | Töflunúmer |
| `tableName` | Text | Heiti töflu |
| `recordSystemId` | Text | Færslu SystemId (GUID án sveigja) |
| `fieldNo` | Integer | Reitanúmer |
| `fieldName` | Text | Heiti reits |
| `previousValue` | Text | Reitgildi strax fyrir endurheimtuna |
| `restoredValue` | Text | Gildi skrifað aftur í færslu |
| `fromEntryNo` | BigInteger | Númer breytingaskráarfærslu notað sem endurheimtugjafi |
| `entryDateTime` | DateTime | Tímastimpill breytingaskráarfærslu (ISO 8601) |

### Öryggisvarðar

Eftirfarandi skilyrði verða öll að uppfyllast eða endurheimta er hafnað:

- Tegund færslu verður að vera `Modification` — `Insertion`- og `Deletion`-færslur geta ekki verið endurheimtar
- Markmið-færsla verður enn að vera til
- Reitur verður að vera skrifanlegur (Normal-flokkur) — FlowFields og FlowFilters eru hafnað
- Reitur má ekki vera skriflokaður (Field Access ori)
- Taflan má ekki vera takmörkuð fyrir skrifaðgerðir (Bifröst Setup)
- Reitur verður að vera leyfður af ChangeLog Write Guard stillingunni í Bifröst Setup
- Endurheimtugildi verður að vera umbreytanlegt í gagnategund reitsins
- Núverandi reitgildi verður að vera frábrugðið endurheimtugildi (eins gildi skilar villu, engin skrif gerð)

### Villutilvik

| Villa | Ástæða |
|---|---|
| `Change log entry not found` | Ógilt `entryNo` |
| `No change log entry found for the specified record, field, and date` | Stilling 2: engin `Modification`-færsla við eða fyrir umbeðinn tímastimpil |
| `Only Modification entries can be restored` | Tegund færslu er `Insertion` eða `Deletion` |
| `Record not found` | Markmið-færsla er ekki lengur til |
| `Field is write-restricted` | Reitur lokaður af Field Access ori |
| `Field is not a writable field` | FlowField eða FlowFilter |
| `Cannot convert value to field type` | Tegundamissæmi við `Evaluate` |
| `Field already has the value — nothing to restore` | Núverandi gildi jafnt endurheimtugildi; engin skrif gerð |
| `Table is restricted from write operations` | Lokað af Bifröst Setup gagnafærslutakmörkunum |
| `Field is not allowed by the change log write guard` | Lokað af ChangeLog Write Guard í Bifröst Setup |
| `recordSystemId is required for point-in-time restore` | Stilling 2 kölluð án færsluauðkenndar |
| `Provide either entryNo or tableName + recordSystemId + fieldNo + restoreToDateTime` | Hvorki Stilling 1 né Stilling 2 færibreytur til staðar |

---

## ChangeLog.Field.Enabled

**Stefna:** Útlæg  
**Hlutkenni:** Kóðaeining 10078069 (`ChgLog FieldEnabled Impl ori`), Kóðaeining 10077924 (`ChgLog FieldEnabled Help ori`)

### Tilgangur

Athugar hvort:
1. BC-breytingaskráin sé virk á víðan svið.
2. ChangeLog Write Guard sé í gildandi stillingu (Blocked eða Via force).
3. Tiltekinn reitur sé á breytingaskráruppsetningunni fyrir `Modification`-rakningu.

Gagnlegt áður en skrifað er í gegnum `Data.Records.Set` þegar ChangeLog Write Guard er virkur,
eða áður en `ChangeLog.Field.Restore` er kallað til að staðfesta að reitur hafi sögu.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Field.Enabled",
  "source": "MyApp v1.0",
  "data": "{\"tableName\":\"Customer\",\"fieldNo\":2}"
}
```

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | string / integer | Já | Marktafla |
| `fieldNo` / `fieldId` / `fieldName` | integer / string | Já | Reiturinn til að athuga |

### Snið svars

```json
{
  "status": "Success",
  "changeLogEnabled": true,
  "changelogWriteGuardEnabled": true,
  "tableNo": 18,
  "tableName": "Customer",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldCovered": true,
  "fieldWriteGuardBypassed": false
}
```

| Reitur | Tegund | Lýsing |
|---|---|---|
| `status` | Text | `Success` eða `Error` |
| `changeLogEnabled` | Boolean | `true` ef BC-breytingaskrá er virkjuð á víðan svið |
| `changelogWriteGuardEnabled` | Boolean | `false` = Open-stilling (engin framfylgd); `true` = Blocked eða Via Force |
| `tableNo` | Integer | Töflunúmer |
| `tableName` | Text | Heiti töflu |
| `fieldNo` | Integer | Reitanúmer |
| `fieldName` | Text | Heiti reits |
| `fieldCovered` | Boolean | `true` ef reitur er rakinn af breytingaskráruppsetningunni fyrir breytingaskráningu |
| `fieldWriteGuardBypassed` | Boolean | `true` ef reitur hefur Bypass-færslu í Field Access ori, sem leyfir skrifanir óháð breytingaskrárþekju |

### Villutilvik

| Villa | Ástæða |
|---|---|
| `Table not found` | Ógilt töluheiti eða númer |
| `Field identifier required` | Vantar `fieldNo`, `fieldId`, eða `fieldName` |
| `Field type is not supported for change log tracking` | BLOB, Media eða svipuð tegund sem BC getur ekki rakið |

---

## ChangeLog.Records.Delta

**Stefna:** Útlæg  
**Hlutkenni:** Kóðaeining 10078072 (`ChgLog Records Delta Impl ori`), Kóðaeining 10077927 (`ChgLog Records Delta Help ori`)

### Tilgangur

Skilar einkvæmum `SystemId` fyrir færslur í einni töflu sem voru **settar inn** eða **breyttar** innan tímabils. Hægt er að þrengja leitina við ákveðna reiti. Notist sem grunnur fyrir lotusamstillingu: sækið breyttu auðkennin, kallið síðan `Data.Records.Get` fyrir hverja færslu og `ChangeLog.Field.History` fyrir dýpri rakningu.

Eyðingar eru **ekki** skilaðar — notið `Deleted.RecordIds.Get` fyrir eyddar færslur.

### Beiðnasnið

```json
{
  "specversion": "1.0",
  "type": "ChangeLog.Records.Delta",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"tableName\":\"Customer\",\"fieldNumbers\":[2,3],\"startDateTime\":\"2026-03-01T00:00:00Z\",\"endDateTime\":\"2026-03-31T23:59:59Z\"}"
}
```

#### Inntakssvið

| Reitur | Tegund | Krafist | Lýsing |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Texti/Heiltala | Já | Taflan sem á að fyrirspyrja. Notar `subject` til vara. |
| `fieldNumbers` | Heiltala[] | Nei | Þrengir niðurstöður við breytingar á þessum reitanúmerum. Sleppið til að taka með alla rakta reiti. |
| `startDateTime` | DateTime | Nei | Neðri mörk (meðtalin). Sjálfgildi `0DT` (engin neðri mörk). |
| `endDateTime` | DateTime | Nei | Efri mörk (meðtalin). Sjálfgildi er `Date & Time` skilaboðsins. |

### Svarsnið

```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "fieldNumbers": [2, 3],
  "startDateTime": "2026-03-01T00:00:00.000Z",
  "endDateTime": "2026-03-31T23:59:59.000Z",
  "totalCount": 42,
  "systemIds": [
    "a1b2c3d4-...",
    "e5f6a7b8-..."
  ]
}
```

#### Villutilvik

| Villa | Orsök |
|---|---|
| `Table ... not found.` | `tableName` / `tableNumber` leysist ekki upp í þekkta töflu |
| `fieldNumbers must contain at least one integer when supplied.` | `fieldNumbers` var sent inn sem tómt fylki |

---

## ChangeLog Write Guard

**ChangeLog Write Guard** er reitur í Bifröst Setup (reitur 17) sem stjórnar hvaða
reitir `Data.Records.Set` má skrifa í. Hefur ekki áhrif á lesunaðgerðir.

| Stilling | Heiti | Enum-gildi | Hegðun |
|---|---|---|---|
| Open | Open | 0 | Allir reitir mega vera skrifaðir. Sjálfgefið. |
| Blocked | Blocked | 1 | Aðeins reitir á breytingaskrár `Modification`-rakningu mega vera skrifaðir. |
| Via force | Via force | 2 | Sama og Blocked; hægt að fara framhjá með `force: true` í beiðninni og ef kallari hefur `Force Access ori` |

### Virkjun varðar

Breyting í `Blocked` eða `Via force` krefst þess að BC-breytingaskráin sé virk:

```al
trigger OnValidate()
begin
    if Rec."ChangeLog Write Guard" in [Blocked, "Via force"] then
        if not ChangeLogSetup.Get() or not ChangeLogSetup."Change Log Activated" then
            Error(ChangeLogNotEnabledErr);
end;
```

### Notkun `force` framhjágöngu (Via force stilling eingöngu)

Feldu `"force": true` sem efsta-stigs lykil innan `data` JSON ásamt `data`-fylkinu:

```json
{
  "specversion": "1.0",
  "type": "Data.Records.Set",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"force\":true,\"data\":[{\"id\":\"...\",\"fields\":{\"Name\":\"Updated Name\"}}]}"
}
```

Kallari verður að hafa `Force Access ori` heimildasamstæðu (PermissionSet 10077888).
