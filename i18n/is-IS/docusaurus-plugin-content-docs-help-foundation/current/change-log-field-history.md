---
id: change-log-field-history
title: "ChangeLog.Field.History"
sidebar_label: "ChangeLog.Field.History"
sidebar_position: 33
---

Skilar núgildandi virði tiltekins reits í færslu ásamt fullri breytingasögu úr töflu Breytingaskrárfærslu (405) í Business Central. Svarið inniheldur tilbúna _Núverandi_ færslu (entryNo = 0) sem sýnir núverandi live virði reitsins, og síðan raðar raunverulegum breytingaskrárfærslum frá nýlegastu til elstu.

**Stefna:** Útlæg (Lestur)  |  **Dæmigerð notkun:** Endurskoðun, áður en kallað er á [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/)

## Vinnuferli

1.  Kallaðu á `ChangeLog.Field.History` með töfluheiti, SystemId færslu og fieldNo.
2.  Skoðaðu `history` fylkið — færsla 0 er núverandi virði; færslur 1+ eru skráðar breytingar.
3.  Athugaðu `entryNo` þeirrar útgáfu sem þú vilt endurheimta.
4.  Kallaðu á [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/) með `{ "entryNo": <valinn> }`.

## Færibreytur beiðni

```json
{
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2
}
```

| Færibreyta | Nauðsynleg | Lýsing |
| --- | --- | --- |
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Marktafla — heiti (t.d. `"Customer"`) eða númer (t.d. `18`). |
| `recordSystemId` / `systemId` / `id` | Já\* | SystemId (GUID) færslunnar. Má einnig senda sem GUID í `subject` reit skilaboðsins. |
| `fieldNo` / `fieldId` / `fieldName` | Já | Reiturinn sem sækja á sögu fyrir — eftir númer, auðkenni eða heiti. |

\* Ef `recordSystemId` vantar úr JSON meginmáli er `subject` reitur Bifröst skilaboðsins notaður sem GUID varagildi.

## Svar

```json
{
  "status": "Success",
  "tableNo": 18,
  "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fieldNo": 2,
  "fieldName": "Name",
  "fieldType": "Text",
  "history": \[
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
    }
  \],
  "totalCount": 2
}
```

### Efstu-stig reitir svars

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| `status` | Text | `Success` eða `Error`. |
| `tableNo` | Integer | Töflunúmer. |
| `tableName` | Text | Töfluheiti. |
| `recordSystemId` | Text | SystemId færslu (GUID, án sviga). |
| `fieldNo` | Integer | Reitnúmer. |
| `fieldName` | Text | Heitið á reitnum. |
| `fieldType` | Text | Gagnategund reitsins (Text, Code, Decimal, Date o.s.frv.). |
| `history` | Array | Breytingafærslur, nýlegastar fyrst. Vísitala 0 er alltaf núverandi live staða. |
| `totalCount` | Integer | Fjöldi færslna í history fylkinu (telur með núverandi-stöðu færsluna). |

### Reitir breytingafærslu

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| `entryNo` | BigInteger | Númer breytingaskrárfærslu. `0` = núverandi live staða (er ekki raunveruleg færsla). Nota entryNo > 0 með [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/). |
| `dateAndTime` | DateTime | Þegar breyting var skráð (ISO 8601). Fyrir entryNo = 0 er þetta `SystemModifiedAt` færslunnar. |
| `typeOfChange` | Text | `Current` fyrir entryNo = 0; `Insertion`, `Modification` eða `Deletion` fyrir raunverulegar færslur. |
| `oldValue` | Text | Virði fyrir breytingu. Tómt fyrir núverandi-stöðu færsluna. |
| `newValue` | Text | Virði eftir breytingu. Fyrir núverandi-stöðu færsluna er þetta live virði reitsins. |
| `userId` | Text | Notandinn sem gerði breytinguna. Fyrir entryNo = 0 er þetta leyst úr `SystemModifiedBy` GUID færslunnar. |

## Villur

| Villa | Ástæða |
| --- | --- |
| Table not found | Ógilt töfluheiti eða -númer. |
| recordSystemId or a subject GUID is required | Ekkert færsluauðkenni gefið upp. |
| Field identifier required | Ekkert fieldNo, fieldId eða fieldName gefið upp. |
| Field read-restricted | Reiturinn er lokaður í [Bifröst svæðisaðgangar](/help/foundation/bifrost-field-accesses/). |
| Record not found | Engin færsla með uppgefið SystemId. |

## Tengdar skilaboðagerðir

-   [ChangeLog.Field.Restore](/help/foundation/change-log-field-restore/) — endurheimta reit í fyrra gildi úr sögunni
-   [ChangeLog.Field.Enabled](/help/foundation/change-log-field-enabled/) — athuga hvort reitur sé rakinn í Breytingaskrá
