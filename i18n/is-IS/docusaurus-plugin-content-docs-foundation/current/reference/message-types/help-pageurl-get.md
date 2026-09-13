---
id: help-pageurl-get
title: "Help.PageUrl.Get"
sidebar_label: "Help.PageUrl.Get"
sidebar_position: 67
description: "Beiðni- og svarsamningur fyrir Help.PageUrl.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar a deep-link URL til the card page fyrir a specific færsla. Resolves the card page úr the tafla's LookupPageId/DrillDownPageId og builds a client URL með the færsla's primary key in the filter.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Identifier Resolution
1. tafla: `tableName` / `tableNumber` / `tableNo` / `tableId` in JSON, eða `subject` (áskilið)
2. færsla: `id` / `systemId` / `recordId` / `recordSystemId` in JSON, eða a GUID `subject` (áskilið)

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text eða heiltala | Yes (via JSON eða subject) | Target tafla |
| id / systemId / recordId / recordSystemId | GUID | Yes (eða GUID subject) | færsla SystemId |

## Dæmi um beiðni
```json
{
  "type": "Help.PageUrl.Get",
  "subject": "Customer",
  "data": { "id": "a1b2c3d4-..." }
}
```

## Uppbygging svars
```json
{ "status": "Success", "url": "https://businesscentral.dynamics.com/..." }
```

## Villur
Returned as `{ "status": "Error", "error": "..." }`.
| Condition | Villa message |
|-----------|---------------|
| tafla ekki supplied | `Table identifier is required. Provide tableName, tableNumber, tableNo, tableId, or subject.` |
| færsla ekki supplied | `Record identifier is required. Provide id, systemId, recordId, recordSystemId, or a GUID subject.` |
| No card page eða færsla fannst ekki | `No card page URL could be resolved for table '{table}' and record {systemId}.` |

## Tengdar skilaboðategundir
- `Data.Records.Get`

