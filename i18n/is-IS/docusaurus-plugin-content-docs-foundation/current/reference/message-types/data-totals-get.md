---
id: data-totals-get
title: "Data.Totals.Get"
sidebar_label: "Data.Totals.Get"
sidebar_position: 21
description: "Beiðni- og svarsamningur fyrir Data.Totals.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Aggregates ein eða fleiri tugabrot fields across all matching færslur in a specified Business Central tafla using `CalcSums`. Skilar a single JSON result hlutur með the summed Gildi of hver requested Reitur. No row iteration er performed — aggregation er done natively með Business Central.

**Stefna**: Útgående (response til request)
**Efnisgerð**: text/json

## Request Format

### Bifrost Parameters

- **Uppruni** (áskilið): Identifies the calling jöfnun eða system.
- **subject** (valfrjálst): tafla Heiti eða númer; getur be notað instead of `tableName`/`tableNumber` in the data payload.
- **data** (áskilið): JSON hlutur containing the Beiðnibreytur.

### Input Parameters (in data payload)

| Færibreyta | Gerð | áskilið | Lýsing |
|-----------|------|----------|-------------|
| `tableName` | strengur | One of tafla ID params | tafla Heiti, e.g. `"Item Ledger Entry"` |
| `tableNumber` / `tableNo` / `tableId` | heiltala | One of tafla ID params | tafla númer, e.g. `32` |
| `fieldNumbers` | fylki of int | **áskilið** | Reitur numbers til sum. All verður að be tugabrot fields (Normal, ekki FlowField). |
| `tableView` | strengur | No | BC AL tafla view filter in SetView format, e.g. `"WHERE(Entry Type=CONST(Purchase))"` |
| `groupBy` | strengur eða int | No | Reitur Heiti eða Reitur númer til group með. Skilar one result row per distinct Gildi of that Reitur. |

```json
{
  "tableName": "Item Ledger Entry",
  "fieldNumbers": [12, 14],
  "tableView": "WHERE(Entry Type=CONST(Purchase))"
}
```

- `tableName` — eða `tableNumber` (alias `tableNo` / `tableId`) til identify the tafla með númer, e.g. `32`.
- `fieldNumbers` — **áskilið**, tugabrot Reitur numbers til sum (verður að be Normal fields, ekki FlowFields).
- `tableView` — valfrjálst BC SetView filter.

> **Note:** `fieldNumbers` er áskilið. Omitting it eða sending an empty fylki Skilar an Villa.
> `skip`, `take`, `startDateTime`, og `endDateTime` eru **ekki** stutt.

## Response Format

`result` er **always an fylki**. án `groupBy` it contains one element með `group: ""`. með `groupBy` it contains one element per distinct group Gildi.

án `groupBy`:
```json
{
  "status": "Success",
  "result": [
    { "group": "", "Quantity": 12500.00, "InvoicedQuantity": 11200.50 }
  ]
}
```

með `groupBy: "Entry Type"`:
```json
{
  "status": "Success",
  "result": [
    { "group": "Purchase", "Quantity": 8500.00, "InvoicedQuantity": 8500.00 },
    { "group": "Sale",     "Quantity": -7200.00, "InvoicedQuantity": -7200.00 }
  ]
}
```

## Svarreitir

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| `status` | strengur | `"Success"` on the happy path, `"Error"` on Mistókst |
| `result` | fylki | One hlutur per group. hver hlutur has `group` (empty strengur þegar no `groupBy`) plus one numeric key per requested Reitur. |

ef `tableView` filters out all færslur, `CalcSums` Skilar 0 fyrir hver Reitur — this er ekki an Villa.

## Reitur Heiti Convention

JSON keys in the `result` hlutur eru derived úr BC Reitur names using the sama stripping rule as `Data.Records.Get`:

1. Characters `%`, `.`, `"`, `\`, `/`, `'` eru replaced með `_`
2. All remaining characters ekki in `[a-zA-Z0-9_]` eru removed

| BC Reitur Heiti | JSON Key |
|---------------|----------|
| `Quantity` | `Quantity` |
| `Invoiced Quantity` | `InvoicedQuantity` |
| `Cost Amount (Actual)` | `CostAmountActual` |
| `Sales (LCY)` | `SalesLCY` |

## CalcSums Requirement

`Data.Totals.Get` uses the Business Central `CalcSums` function, which requires hver requested Reitur til be:

- **Gerð tugabrot** — heiltala og other numeric types eru ekki stutt
- **Normal Reitur class** — FlowFields getur ekki be summed (nota Data.Records.Get með fieldNumbers til calculate individual FlowFields instead)

ef a Reitur does ekki meet these requirements, BC raises a runtime Villa.

## Usage Example

### Request — sum Quantity og Invoiced Quantity fyrir all Purchase færslur
```json
{
  "specversion": "1.0",
  "type": "Data.Totals.Get",
  "source": "my-integration",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Item Ledger Entry",
    "fieldNumbers": [12, 14],
    "tableView": "WHERE(Entry Type=CONST(Purchase))"
  }
}
```

### Response
```json
{
  "status": "Success",
  "result": [
    { "group": "", "Quantity": 8500.00, "InvoicedQuantity": 7200.00 }
  ]
}
```

### Request — group með færsla Gerð
```json
{
  "tableName": "Item Ledger Entry",
  "fieldNumbers": [12, 14],
  "groupBy": "Entry Type"
}
```
### Response
```json
{
  "status": "Success",
  "result": [
    { "group": "Purchase", "Quantity": 1207482, "InvoicedQuantity": 1207482 },
    { "group": "Sale",     "Quantity": -8765499, "InvoicedQuantity": -8765499 }
  ]
}
```

## Villa Handling

| Condition | Response |
|-----------|----------|
| `fieldNumbers` vantar eða empty fylki | `{"status":"Error","error":"fieldNumbers is required and must contain at least one field number."}` |
| tafla ekki identified | Villa raised með tafla evaluation |
| lesa heimild denied | `{"status":"Error","error":"Read permission denied for table {n}."}` |
| Reitur númer does ekki exist | `{"status":"Error","error":"Field {n} does not exist in table {t}."}` |
| Reitur er ekki tugabrot Gerð | `{"status":"Error","error":"Field {n} ({name}) in table {t} is not of type Decimal."}` |
| Reitur er lesa-restricted | `{"status":"Error","error":"Read access to field {n} ({name}) in table {t} is restricted."}` |
| Reitur ekki tugabrot eða ekki Normal | AL runtime Villa propagates as task Mistókst |
| No færslur match tableView | Skilar 0 fyrir hver Reitur (ekki an Villa) |

## Tengdar skilaboðategundir

- **Data.Records.Get** — Skilar full færsla data as JSON með pagination; styður the sama tafla identification og tableView parameters
- **Data.RecordIds.Get** — Skilar aðeins færsla IDs og modification timestamps
- **Help.Fields.Get** — Skilar Reitur metadata þar á meðal Reitur class (Normal/FlowField/FlowFilter) og data Gerð

