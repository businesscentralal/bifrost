---
id: changelog-field-history
title: "ChangeLog.Field.History"
sidebar_label: "ChangeLog.Field.History"
sidebar_position: 4
description: "Beiðni- og svarsamningur fyrir ChangeLog.Field.History Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar the current Gildi of a Reitur plus its full change history úr BC Change Log færsla (tafla 405). The current Gildi er emitted as `entryNo: 0` með `typeOfChange: "Current"`; historical færslur follow, ordered með dagsetning/time descending.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Identifier Resolution
1. `recordSystemId` in request JSON (via `EvaluateSystemId`)
2. Bifrost `subject` (GUID)

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int eða Text | Yes | Identifies the tafla |
| fieldNo / fieldName | Int eða Text | Yes | Identifies the Reitur |
| recordSystemId | GUID | Yes | SystemId of the færsla |

## Dæmi um beiðni
```json
{
  "type": "ChangeLog.Field.History",
  "data": {
    "tableId": 18, "fieldNo": 2,
    "recordSystemId": "a1b2c3d4-..."
  }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "tableNo": 18, "tableName": "Customer",
  "recordSystemId": "a1b2c3d4-...",
  "fieldNo": 2, "fieldName": "Name", "fieldType": "Text",
  "history": [
    { "entryNo": 0, "dateAndTime": "2024-06-10T14:30:00Z", "typeOfChange": "Current", "oldValue": "", "newValue": "Acme Inc.", "userId": "JANE" },
    { "entryNo": 42, "dateAndTime": "2024-06-09T09:00:00Z", "typeOfChange": "Modification", "oldValue": "Acme", "newValue": "Acme Inc.", "userId": "JANE" }
  ],
  "totalCount": 2
}
```

## History færsla Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| entryNo | BigInteger | Change Log færsla No., eða 0 fyrir the current live Gildi |
| dateAndTime | DateTime | Change Log færsla timestamp (eða SystemModifiedAt fyrir `entryNo: 0`) |
| typeOfChange | Text | `Current`, `Insertion`, `Modification`, eða `Deletion` |
| oldValue / newValue | Text | Reitur values as stored in Change Log færsla |
| userId | Text | BC User Heiti (eða SystemModifiedBy fyrir `entryNo: 0`) |

## Villur
| Condition | Villa message |
|-----------|---------------|
| vantar identifier | `recordSystemId or a subject GUID is required.` |
| Unsupported Reitur Gerð | `Field type is not supported for change log tracking.` |
| Reitur lesa-restricted | `Field {fieldNo} in table {tableName} is read-restricted.` |
| tafla lesa-restricted | `Read permission denied for table {tableId}.` |
| færsla fannst ekki | `Record with SystemId {systemId} in table {tableName} not found.` |

## Tengdar skilaboðategundir
- `ChangeLog.Field.Enabled`
- `ChangeLog.Field.Restore`
- `ChangeLog.Records.Delta`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

