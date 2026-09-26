---
id: data-records-get
title: "Data.Records.Get"
sidebar_label: "Data.Records.Get"
sidebar_position: 18
description: "Beiðni- og svarsamningur fyrir Data.Records.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Les færslur úr hvaða non-restricted BC tafla og Skilar them as JSON in the Data Shipping standard format (`{id, primaryKey, fields}`). styður Reitur projection, BC tafla view filtering, `SystemModifiedAt` dagsetning range, og `skip`/`take` pagination.

**Stefna**: Útgående  **Efnisgerð**: `text/json`

## Forgangsröð auðkenna (tafla)

The target tafla er resolved með checking these keys in order og using the fyrsta one present:
1. `data.tableName` (strengur, e.g. `"Customer"`)
2. `data.tableNumber` (heiltala, e.g. `18`)
3. `data.tableNo` (alias fyrir `tableNumber`)
4. `data.tableId` (alias fyrir `tableNumber`)
5. `subject` envelope attribute (tafla Heiti eða númer as strengur, e.g. `"Customer"` eða `"18"`)

## Beiðnibreytur (in data)

| Færibreyta | Gerð | Sjálfgefið | Athugasemdir |
|---|---|---|---|
| `tableName` / `tableNumber` / `tableNo` / `tableId` | strengur / int | — | One áskilið (eða `subject`). Sjá Forgangsröð úrlausnar above. |
| `fieldNumbers` | int[] | all Normal fields | þegar set, aðeins these Reitur numbers eru returned in `fields`. FlowFields eru calculated og included **aðeins** þegar listed here. Primary-key fields eru always in `primaryKey` regardless. |
| `tableView` | strengur | — | BC `SetView` syntax, e.g. `"WHERE(Blocked = CONST( ))"` eða `"WHERE(Location Code = CONST(BLUE))"` |
| `startDateTime` / `endDateTime` | ISO 8601 | — | Filter on `SystemModifiedAt`. Provide both. |
| `skip` | int | 0 | Pagination offset. |
| `take` | int | 100 | Page size. `noOfRecords` in Svarið er the unpaginated total. |

## Uppbygging svars

```json
{
  "status": "Success",
  "noOfRecords": 245,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "No_": "10000" },
      "fields":     { "Name": "Contoso Ltd.", "Address": "123 Main St" }
    }
  ]
}
```

### Eiginleikar hverrar færslu

| Property | Lýsing |
|---|---|
| `id` | `SystemId` GUID, formatted án braces (`Format(guid, 0, 4)`). |
| `primaryKey` | hlutur — primary key Reitur(s) aðeins. Always present. |
| `fields` | hlutur — non-primary-key Reitur(s). Subject til `fieldNumbers` og Reitur-lesa takmarkanir. |

### Stöðlun reitaheita

Keys in `primaryKey` og `fields` eru derived úr BC Reitur names með:
1. Replacing `%`, `.`, `"`, `\`, `/`, `'` með `_`
2. Removing all other non-alphanumeric characters

| BC Reitur | JSON Key |
|---|---|
| `No.` | `No_` |
| `Sell-to Customer No.` | `SelltoCustomerNo_` |
| `Balance (LCY)` | `BalanceLCY` |

### Snið gilda

- **GUID**: bare form (`Format(value, 0, 4)`).
- **dagsetning / Time / DateTime / tugabrot / heiltala / etc.**: culture-invariant (`Format(value, 0, 9)`). Blank `0D` / `0T` / `0DT` render as empty strengur.
- **Option / Enum**: returned as the **display caption** (ekki the innri Heiti). nota `Help.Fields.Get` til discover the option set ef you need til filter.
- **BLOB / Media / MediaSet**: Base64-encoded.
- **Currency / LCY fields** með a `Currency Code` relation eru auto-converted (Sjá DataRecordsGetImpl `ShouldApplyLCYConversion`).
- **Dimension Set ID** fields eru auto-expanded til a `Dimensions` hlutur via `AddDimensionSetConversion`.

## Takmarkanir á aðgangi að reitum

Per-user Reitur-level lesa takmarkanir eru enforced via `Bifrost Field Access` (codeunit 65350). þegar a Reitur carries takmörkun Gerð `Both` eða `Read` fyrir the current user (eða a wildcard færsla matches), the Reitur er **silently dropped** úr the `fields` hlutur — no Villa er raised. Primary-key fields eru always returned. nota `Help.Fields.Get` til discover the `readRestricted` flag per Reitur áður en relying on a Gildi being present in Svarið.

Wildcards: `Field No. = 0` covers all fields on a tafla; `Table No. = 0` covers all töflur fyrir the user. Forgangsröð úrlausnar: specific færsla → all-fields wildcard → all-töflur wildcard. fyrsta match wins; no match means unrestricted.

## Uppgötvunarferli

þegar you don't know the tafla eða Reitur numbers:
1. `Help.Tables.Get` — list töflur og IDs.
2. `Help.Fields.Get` (með the chosen tafla) — list fields, types, captions, og lesa/skrifa takmarkanir.
3. `Data.Records.Get` — fetch a sample færsla (e.g. `take: 1`) til Sjá exact JSON key names.

## Dæmi (úr einingaprófum)

### All fields, all færslur
```json
{ "tableName": "Customer" }
```
Skilar `{status, noOfRecords, result[]}`. hver færsla has `id`, `primaryKey.No_`, og `fields.*`.

### Project specific fields
```json
{ "tableName": "Customer", "fieldNumbers": [2, 5, 7] }
```
viðskiptamanni Reitur 2=`Name`, 5=`Address`, 7=`City`. aðeins those appear in `fields`; Reitur 9 (`Phone No.`) er excluded.

### Modified-at dagsetning range
```json
{ "tableName": "Customer",
  "startDateTime": "2025-01-01T00:00:00Z",
  "endDateTime":   "2027-12-31T23:59:59Z" }
```

### BC tafla view filter
```json
{ "tableName": "Customer",
  "tableView": "WHERE(Blocked = CONST( ))",
  "fieldNumbers": [1, 2, 3, 5] }
```

### Pagination (færslur 101–200)
```json
{ "tableName": "Customer", "skip": 100, "take": 100 }
```
nota `noOfRecords` in Svarið til plan further pages.

## Villur

| Condition | Status / message |
|---|---|
| tafla ekki identified | Villa — `Table {name} not found.` |
| tafla er innri / restricted | Villa — `Table {id} ({name}) cannot be read via Data.Records.Get. This is an internal table.` |
| Kallandi lacks lesa heimild | Villa — populated með `CheckTableReadPermission`. |
| lesa-restricted Reitur requested via `fieldNumbers` | Reitur silently dropped úr response (Sjá `Bifrost Field Access`). |

## Tengdar skilaboðategundir

- **Data.RecordIds.Get** — IDs + `SystemModifiedAt` aðeins (lightweight incremental sync).
- **Data.Totals.Get** — server-side `CalcSums` fyrir tugabrot SumIndexFields.
- **CSV.Records.Get** — sama filtering, CSV output, styður 4 MB chunked continuation.
- **Data.Records.Set** — accepts the sama `{id, primaryKey, fields}` shape on the way back.
- **Help.Tables.Get** / **Help.Fields.Get** — schema discovery.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

