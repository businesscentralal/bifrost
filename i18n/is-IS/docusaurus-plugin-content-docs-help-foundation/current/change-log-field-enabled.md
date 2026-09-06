---
id: change-log-field-enabled
title: "ChangeLog.Field.Enabled"
sidebar_label: "ChangeLog.Field.Enabled"
sidebar_position: 32
---

Athugar hvort Breytingaskrá hafi skráninguna virka fyrir breytingar á tilteknum reit töflu. Skilar dekkingustöðu ásamt núgildandi kveikjum Change Log og Write Guard.

**Stefna:** Útlæg (Lestur)  |  **Dæmigerð notkun:** Forprófun áður en kallað er á [ChangeLog.Field.History](/help/foundation/change-log-field-history/) eða [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/).

## Beiðni

```json
{
  "tableName": "Customer",
  "fieldNo": 2
}
```

| Færibreyta | Nauðsynleg | Lýsing |
| --- | --- | --- |
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Marktafla — heiti (t.d. `"Customer"`) eða númer (t.d. `18`). |
| `fieldNo` / `fieldId` / `fieldName` | Já | Reiturinn sem athuga á — eftir númeri, auðkenni eða heiti. |

## Svar

```json
{
  "status": "Success",
  "changeLogEnabled": true,
  "changelogWriteGuardEnabled": false,
  "tableNo": 18,
  "tableName": "Customer",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldCovered": true
}
```

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| `status` | Texti | `Success` eða `Error`. |
| `changeLogEnabled` | Boolean | `true` ef Breytingaskrá er virk í Uppsetning Breytingaskrárinnar. |
| `changelogWriteGuardEnabled` | Boolean | `true` ef ChangeLog Write Guard í Bifröst Setup er stilltur á Blocked eða Via force. |
| `tableNo` | Heiltala | Töflunúmer. |
| `tableName` | Texti | Töfluheiti. |
| `fieldNo` | Heiltala | Reitarnúmer. |
| `fieldName` | Texti | Reitarheiti. |
| `fieldCovered` | Boolean | `true` ef reiturinn er tryggður fyrir breytingaskráningu í Uppsetning Breytingaskrárinnar. Reitur er tryggður ef taflan er stillt á _All Fields_, eða ef taflan er stillt á _Some Fields_ og þessi reitur hefur **Log Modification** virkt. |

## Villur

| Villa | Ástæða |
| --- | --- |
| Table not found | Uppgefið töfluheiti eða töflunúmer er ekki til. |
| Field identifier required | Ekkert `fieldNo`, `fieldId` eða `fieldName` gefið upp. |
| Field type is not supported for change log tracking | FlowFields og FlowFilters geta ekki verið skráðir í Breytingaskrá. |

## Tengdar skilaboðagerðir

-   [ChangeLog.Field.History](/help/foundation/change-log-field-history/) — sæktu fulla breytingasögu reits
-   [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/) — endurheimtu reit í fyrra gildi
-   [Bifröst Setup](/help/foundation/bifrost-setup/) — stilltu ChangeLog Write Guard
