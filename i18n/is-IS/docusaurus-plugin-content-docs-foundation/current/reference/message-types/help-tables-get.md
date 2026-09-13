---
id: help-tables-get
title: "Help.Tables.Get"
sidebar_label: "Help.Tables.Get"
sidebar_position: 70
description: "Beiðni- og svarsamningur fyrir Help.Tables.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar metadata fyrir normal (non-obsolete) BC töflur úr `Table Metadata`. þegar no tafla identifier er supplied, Skilar all matching töflur. þegar a tafla identifier er supplied, Skilar just that one.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Identifier Resolution (valfrjálst)
1. Request JSON: `tableName`, `tableNumber`, `tableNo`, `tableId` (in that order)
2. Bifrost `subject`
3. ef none resolve, all normal töflur eru returned

> ⚠️ **Context-window warning:** Calling `Help.Tables.Get` án a tafla identifier Skilar **all** non-obsolete BC töflur (typically thousands of rows). This mun overflow the AI context window og the call mun fail með a token-limit Villa. **Gefðu alltaf upp a tafla Heiti eða númer** unless you eru doing a deliberate bulk discovery task — og even then, expect the result til be too large til process in a single AI turn.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text eða heiltala | No | Restricts result til a single tafla |
| namespaceFilter | Text | No | Filters töflur með AL namespace. styður BC wildcards: `Microsoft.Sales.*` matches all Sales töflur. |

## Recommended Uppgötvunarferli
þegar you do ekki know which töflur exist, nota a two-step approach:
```
Step 1 — discover available namespaces (lightweight):
  { "type": "Help.Namespaces.Get" }
  → { "namespaces": ["Microsoft.Sales.Customer", "Microsoft.Finance.GeneralLedger", ...] }

Step 2 — list tables in a namespace:
  { "type": "Help.Tables.Get", "data": { "namespaceFilter": "Microsoft.Sales.*" } }
  → { "result": [ { "id": 18, "name": "Customer", ... }, ... ] }
```

## Request Examples
Single tafla með Heiti:
```json
{ "type": "Help.Tables.Get", "subject": "Customer" }
```
All töflur in a namespace:
```json
{ "type": "Help.Tables.Get", "data": { "namespaceFilter": "Microsoft.Sales.*" } }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "result": [
    { "id": 18, "name": "Customer", "caption": "Customer", "dataPerCompany": true, "namespace": "Microsoft.Sales.Customer", "readRestricted": false, "writeRestricted": false }
  ]
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| id | heiltala | tafla ID |
| Heiti | Text | tafla Heiti |
| caption | Text | tafla caption in current language |
| dataPerCompany | sanngildi | True þegar the tafla er per-company |
| namespace | Text | AL namespace of the tafla |
| readRestricted | sanngildi | True þegar the tafla er blocked úr `Data.Records.Get` (innri system töflur such as `Bifrost Setup`, `Change Log Setup`, etc.). Restricted töflur getur ekki be lesa via the generic data API. |
| writeRestricted | sanngildi | True þegar the tafla er blocked úr `Data.Records.Set`. Includes the lesa-restricted set plus `Bifrost Message` (lesa-allowed, skrifa-blocked). |

## Tengdar skilaboðategundir
- `Help.Namespaces.Get` — discover available AL namespaces áður en calling this Gerð
- `Help.Fields.Get`
- `Help.TableRelations.Get`
- `Help.Permissions.Get`

