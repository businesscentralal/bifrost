---
id: change-log-field-restore
title: "ChangeLog.Field.Restore"
sidebar_label: "ChangeLog.Field.Restore"
sidebar_position: 34
---

Endurheimtir reitarvirði úr Change Log í Business Central með því að skrifa fyrra gildi aftur inn í lifandi færsluna. Styður tvo ham: endurheimting eftir tilteknum færslunúmeri eða endurheimting eftir tímapunkti.

**Stefna:** Innlæg (Skrif)  |  **Dæmigerð notkun:** Kallið fyrst á [ChangeLog.Field.History](/help/foundation/change-log-field-history/) til að skoða sögu reitsins, síðan endurheimtið.

## Vinnuferli

1.  Kallið á [ChangeLog.Field.History](/help/foundation/change-log-field-history/) til að skoða breytingasögu reitsins.
2.  Veljið þann `entryNo` sem þið viljið endurheimta.
3.  Kallið á `ChangeLog.Field.Restore` með `{ "entryNo": <valinn> }`.
4.  `Old Value` þeirrar breytingaskrárfærslu er skrifað aftur inn í lifandi færsluna með `Validate()` og `Modify(true)`.

## Ham 1: Eftir færslunúmeri

Endurheimtir `Old Value` úr tiltekinni breytingaskrárfærslu.

```json
{
  "entryNo": 56789
}
```

| Færibreyta | Nauðsynleg | Lýsing |
| --- | --- | --- |
| `entryNo` | Já | Færslunúmer breytingaskrárinnar (úr svari [ChangeLog.Field.History](/help/foundation/change-log-field-history/)). Verður að vera stærra en 0. |

## Ham 2: Eftir tímapunkti

Finnur nýlegustu `Modification` færslu á eða fyrir uppgefinn tímastimpil og endurheimtir `Old Value` hennar. Hentar þegar þú veist u.þ.b. hvenær óæskilega breyting átti sér stað en þekkir ekki nákvæmt færslunúmerið.

```json
{
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "restoreToDateTime": "2026-02-10T09:15:00Z"
}
```

| Færibreyta | Nauðsynleg | Lýsing |
| --- | --- | --- |
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Marktafla — heiti (t.d. `"Customer"`) eða númer (t.d. `18`). |
| `recordSystemId` | Já | SystemId (GUID) færslunnar sem endurheimta á. |
| `fieldNo` / `fieldId` / `fieldName` | Já | Reiturinn sem endurheimta á — eftir númeri, auðkenni eða heiti. |
| `restoreToDateTime` | Já | ISO 8601 tímastimpill. Endurheimtir nýlegustu Modification færslu á eða fyrir þennan tíma (t.d. `"2026-02-10T09:15:00Z"`). |

## Svar

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
| --- | --- | --- |
| `status` | Texti | `Success` eða `Error`. |
| `tableNo` | Heiltala | Töflunúmer. |
| `tableName` | Texti | Töfluheiti. |
| `recordSystemId` | Texti | SystemId færslunnar (GUID án sviga). |
| `fieldNo` | Heiltala | Reitarnúmer. |
| `fieldName` | Texti | Reitarheiti. |
| `previousValue` | Texti | Gildi reitsins áður en endurheimting var framkvæmd. |
| `restoredValue` | Texti | Gildið sem skrifað var aftur inn í lifandi færsluna (`Old Value` breytingaskrárfærslunnar). |
| `fromEntryNo` | BigInteger | Færslunúmer breytingaskrárinnar sem notuð var sem endurheimtargjafi. |
| `entryDateTime` | DateTime | Tímastimpill þeirrar breytingaskrárfærslu sem notuð var (ISO 8601). |

## Öryggisvernd

-   Aðeins **Modification** færslur geta verið endurheimtar — Insertion og Deletion færslur eru hafnaðar.
-   Markfærslan verður að vera til staðar.
-   Reiturinn verður að vera skrifanlegur (Normal class) — FlowFields og FlowFilters eru hafnað.
-   Skriðvarðir reitir (í gegnum [Bifröst svæðisaðgangar](/help/foundation/bifrost-field-accesses/)) eru hafnaðir.
-   Taflan má ekki vera takmörkuð á skrifaðgerðir í Bifröst Setup.
-   Reiturinn verður að vera leyfður af Change Log Write Guard sem er stilltur í [Bifröst Setup](/help/foundation/bifrost-setup/).
-   Endurheimtargildi verður að vera hægt að breyta í gagnategund reitsins.
-   Ef núverandi gildi er þegar jafnt og endurheimtargildi skilar aðgerðin villu — ekkert skrif á sér stað.
-   `Validate()` og `Modify(true)` eru alltaf notaðir til að virða viðskiptatengdar kveikjur.

## Villur

| Villa | Ástæða |
| --- | --- |
| Change log entry not found | Ógilt `entryNo`. |
| No change log entry found for the specified record, field, and date | Ham 2: engin Modification færsla til staðar á eða fyrir umbeðinn tímastimpil. |
| Only Modification entries can be restored | Færslan er af gerðinni Insertion eða Deletion. |
| Record not found | Markfærslan er ekki lengur til. |
| Field is write-restricted | Reitur er lokaður af Bifrost Field Accesses. |
| Field is not a writable field | Reiturinn er FlowField eða FlowFilter. |
| Cannot convert value to field type | Tegundarmissræmi — geymdur texti er ekki þýðanlegur í gagnategund reitsins. |
| Field already has the value — nothing to restore | Núverandi gildi er jafnt og endurheimtargildi; ekkert skrif reynt. |
| Table is restricted from write operations | Tafla er takmörkuð í Bifröst Setup. |
| Field is not allowed by the change log write guard | Reitur er lokaður af Change Log Write Guard í Bifröst Setup. |
| recordSystemId is required for point-in-time restore | Ham 2 var kallaður án færsluauðkennis. |
| Provide either entryNo or tableName + recordSystemId + fieldNo + restoreToDateTime | Hvorki Ham 1 né Ham 2 færibreytur voru gefnar upp. |

## Tengdar skilaboðagerðir

-   [ChangeLog.Field.History](/help/foundation/change-log-field-history/) — skoðaðu breytingasögu áður en þú endurheimtir
-   [ChangeLog.Field.Enabled](/help/foundation/change-log-field-enabled/) — athugaðu hvort reitur sé skráður í Change Log
