---
id: csv-records-get
title: "CSV.Records.Get"
sidebar_label: "CSV.Records.Get"
sidebar_position: 30
---

Outbound  Content-Type: `text/csv`

Flytur út allar samsvarandi færslur úr tiltekinni Business Central töflu sem UTF-8 CSV skrá á Open Mirroring sniði. Fyrir stórar niðurstöður sem nálgast 2 GB OutStream mörkin er stuðningur við framhaldsmynstur í gegnum `continueFromRecordId`.

## Beiðnifæribreytur

| Færibreyta | Staðsetning | Tegund | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- | --- |
| `subject` | Bifröst umslag | string | Ein af töfluauðkennum | Töfluheiti (t.d. `"Customer"`) eða töflunúmer (t.d. `"18"`) |
| `continueFromRecordId` | Bifröst umslag | GUID | Nei | SystemId færslunnar sem á að halda áfram frá. Sleppa eða skilja eftir autt fyrir fyrstu beiðni. |
| `tableName` | JSON gögn | string | Ein af töfluauðkennum | Töfluheiti, t.d. `"Customer"` |
| `tableNumber` / `tableNo` / `tableId` | JSON gögn | integer | Ein af töfluauðkennum | Töflunúmer, t.d. `18` |
| `fieldNumbers` | JSON gögn | array of integers | Nei | Sértæk reitanúmer sem á að taka með. Ef sleppt eru allir studdir reitir teknir með. |
| `startDateTime` | JSON gögn | ISO 8601 datetime | Nei | Sía eftir `SystemModifiedAt >=` |
| `endDateTime` | JSON gögn | ISO 8601 datetime | Nei | Sía eftir `SystemModifiedAt <=` |
| `tableView` | JSON gögn | string | Nei | BC AL töflusýn sía á SetView sniði |

**Athugið:** `skip` og `take` eru **ekki** studdar. Notið framhaldsmynstrið fyrir stórar útflutningar.

## Svarssnið

Þegar færslur samsvara er UTF-8 CSV texti skilað með efnisgerð `text/csv`. Fyrsta línan er hausinn; síðari línur eru gagnalínur. Ef engar færslur samsvara eru bæði `data` og `datacontenttype` tóm.

### Dæmi um CSV

```
No,Name,timestamp,SystemId,SystemCreatedAt,SystemCreatedBy,SystemModifiedAt,SystemModifiedBy,$Company,__rowMarker__
"10000","Contoso Ltd.",0,"a1b2c3d4-...",2026-01-10T08:00:00.000Z,"user-guid",2026-03-01T12:30:00.000Z,"user-guid","CRONUS International Ltd.",4
```

## Dálkanöfn

Hver dálkahaus er myndaður með því að fjarlægja ólögleg stafi (nema `%`) úr BC reitaheiti.

| BC reitaheiti | Dálkahaus |
| --- | --- |
| `No.` | `No` |
| `Sell-to Customer No.` | `SelltoCustomerNo` |
| `SystemId` | `SystemId` |

## Kerfisreitir

Alltaf bætt við aftast í hverri línu, óháð `fieldNumbers`:

| Dálkur | Reitur Nr. | Lýsing |
| --- | --- | --- |
| `timestamp` | 0 | Innra tímamerki (BigInteger) |
| `SystemId` | 2000000000 | GUID færslu |
| `SystemCreatedAt` | 2000000001 | Stofnunartímamerki (UTC) |
| `SystemCreatedBy` | 2000000002 | Stofnað af notanda GUID |
| `SystemModifiedAt` | 2000000003 | Síðast breytt tímamerki (UTC) |
| `SystemModifiedBy` | 2000000004 | Síðast breytt af notanda GUID |

## Sérstakir dálkar

-   **`$Company`** — bætt við fyrir töflur á fyrirtækisstigi. Gildi er heiti núverandi fyrirtækis.
-   **`__rowMarker__`** — alltaf síðasti dálkurinn. Gildi er `4` (virk færsla). Sameina við `CSV.DeletedRecords.Get` (rowMarker = `2`) fyrir fulla lífsferilsrakningu.

## Framhaldsmynstur (stórar útflutningar)

Þegar CSV svarið nálgast 2 GB OutStream mörkin stöðvast útflutningurinn eftir núverandi 4 MB hluta og skilar `SystemId` næstu óunninna færslu í `continueFromRecordId` svarsreitnum.

### Verkflæði

1.  Senda venjulega `CSV.Records.Get` beiðni (ekkert `continueFromRecordId`).
2.  Athuga `continueFromRecordId` reitinn í svarinu.
3.  Ef hann inniheldur GUID, senda nýja beiðni með `continueFromRecordId` stillt á það gildi.
4.  Endurtaka þar til `continueFromRecordId` í svari er tómt (allar færslur fluttar út).

### Dæmi — Fyrsta beiðni

```
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Item Ledger Entry",
  "datacontenttype": "application/json",
  "data": {}
}
```

### Dæmi — Framhaldsbeiðni

```
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Item Ledger Entry",
  "continueFromRecordId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "datacontenttype": "application/json",
  "data": {}
}
```

### Mikilvægar athugasemdir

-   Hver framhaldshluti inniheldur CSV hauslínu — neytendur ættu að sleppa hausnum á síðari hlutum.
-   Sömu síur (`tableView`, `startDateTime`, `endDateTime`) verða að fylgja hverri framhaldsbeiðni.
-   Ef framhaldsfærslan var eytt á milli beiðna er villa skilað.

## Villumeðhöndlun

| Skilyrði | Svar |
| --- | --- |
| Tafla ekki auðkennd | Villa útaf töfluúrvinnslu |
| Tafla er innri/hömlur | `Table {n} ({name}) cannot be read via CSV.Records.Get. This is an internal table.` |
| Lesheimild hafnað | `Read permission denied for table {n}.` |
| `continueFromRecordId` vísar á færslu sem er ekki til | `Unable to locate the record in table {name} with System Id {guid}` |
| Engar færslur samsvara | Verk lýkur; `data` og `datacontenttype` eru bæði tóm |
| Óstudd reitagerð | Reit sleppt án villu |

## Tengdar skilaboðagerðir

-   **Data.Records.Get** — sömu síur, skilar JSON, styður skip/take
-   **Data.RecordIds.Get** — skilar aðeins færsluauðkennum (SystemId + SystemModifiedAt) sem JSON
-   **CSV.DeletedRecords.Get** — flytur út eyddar færslur sem CSV (rowMarker = 2)
-   [**Data.Totals.Get**](/help/foundation/data-totals-get/) — safnar saman Decimal SumIndexFields með CalcSums
