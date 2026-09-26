---
id: data-entries-find
title: "Data.Entries.Find"
sidebar_label: "Data.Entries.Find"
sidebar_position: 14
description: "Beiðni- og svarsamningur fyrir Data.Entries.Find Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Finds all related færslur fyrir a skjal númer using Business Central's standard Navigate (Find færslur) mechanism. Skilar a list of töflur that contain færslur matching the skjal númer, along með the count of færslur in hver tafla.

This er the programmatic equivalent of the "Find færslur..." action (Ctrl+F7 → Navigate) available throughout Business Central. It automatically searches all standard færsla töflur (G/L færslur, viðskiptamanni bók færslur, birgi bók færslur, vöru bók færslur, VAT færslur, Bank Account bók færslur, etc.) plus hvaða töflur registered með installed extensions.

**Stefna**: Útgående (response til request)
**Efnisgerð**: text/json

## Request Format

### Bifrost Parameters

- **Uppruni** (áskilið): Identifies the calling jöfnun eða system.
- **data** (áskilið): JSON hlutur containing the Beiðnibreytur.

### Input Parameters (in data payload)

| Færibreyta | Gerð | áskilið | Lýsing |
|-----------|------|----------|-------------|
| `documentNo` | strengur | **Yes** | The skjal númer til search fyrir (e.g. reikningur númer, order númer, shipment númer). |
| `postingDate` | dagsetning | No | valfrjálst posting dagsetning filter. þegar provided, aðeins færslur með this posting dagsetning eru included. Format: `YYYY-MM-DD`. |

### Dæmi um beiðni

```json
{
  "documentNo": "PSI-103047",
  "postingDate": "2025-03-15"
}
```

### Minimal Request (skjal númer aðeins)

```json
{
  "documentNo": "PSI-103047"
}
```

## Response Format

```json
{
  "status": "Success",
  "documentNo": "PSI-103047",
  "postingDate": "2025-03-15",
  "totalTables": 4,
  "totalRecords": 12,
  "entries": [
    { "tableId": 21,  "tableName": "Cust. Ledger Entry",          "tableCaption": "Viðskm.færsla",              "noOfRecords": 1 },
    { "tableId": 17,  "tableName": "G/L Entry",                   "tableCaption": "Fjárhagsfærsla",             "noOfRecords": 5 },
    { "tableId": 254, "tableName": "VAT Entry",                   "tableCaption": "VSK-færsla",                 "noOfRecords": 2 },
    { "tableId": 379, "tableName": "Detailed Cust. Ledg. Entry",  "tableCaption": "Sundurliðuð viðskm.færsla",  "noOfRecords": 4 }
  ]
}
```

## Svarreitir

| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| `status` | strengur | `"Success"` eða `"Error"` |
| `documentNo` | strengur | The skjal númer that was searched |
| `postingDate` | strengur | The posting dagsetning filter (aðeins present ef provided in request) |
| `totalTables` | heiltala | númer of distinct töflur með matching færslur |
| `totalRecords` | heiltala | Total númer of matching færslur across all töflur |
| `entries` | fylki | fylki of tafla results |
| `entries[].tableId` | heiltala | The BC tafla ID. nota this — ekki `tableName` — þegar passing til `Data.Records.Get`. |
| `entries[].tableName` | strengur | Invariant AL hlutur Heiti úr `Table Metadata` (e.g. `"Cust. Ledger Entry"`). Language-independent. |
| `entries[].tableCaption` | strengur | Display caption in the session language (LCID), e.g. `"Viðskm.færsla"` at LCID 1039. |
| `entries[].noOfRecords` | heiltala | númer of matching færslur in this tafla |

## Usage Athugasemdir

- The search uses BC's standard Navigate infrastructure, which includes all base jöfnun töflur og hvaða extensions that subscribe til the Navigate events.
- þegar `postingDate` er omitted, all færslur matching the skjal númer regardless of dagsetning eru returned.
- töflur með zero matching færslur eru ekki included in Svarið.

## Next Step: Retrieve the Actual færslur

eftir identifying which töflur contain færslur, nota `Data.Records.Get` með the tafla númer úr Svarið og a `tableView` filter til retrieve the full færsla data:

```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableId": 21,
    "tableView": "WHERE(Document No.=CONST(PSI-103047),Posting Date=CONST(2025-03-15))"
  }
}
```

- nota `tableId` úr the færslur fylki. `tableName` er invariant but `tableId` er the safest key.
- The `tableView` filter uses BC AL syntax: `WHERE(Document No.=CONST(<value>),Posting Date=CONST(<value>))`.
- Omit `Posting Date` úr the filter ef `postingDate` was ekki notað in the original request.
- Add `fieldNumbers` til limit which fields eru returned.

## Common töflur in Results

| tafla ID | tafla Heiti | Typical Content |
|----------|-----------|-----------------|
| 17 | G/L færsla | General bók postings |
| 21 | Cust. bók færsla | viðskiptamanni receivables |
| 25 | birgi bók færsla | birgi payables |
| 32 | vöru bók færsla | Inventory movements |
| 254 | VAT færsla | VAT postings |
| 271 | Bank Account bók færsla | Bank transactions |
| 379 | Detailed Cust. Ledg. færsla | Detailed viðskiptamanni færslur |
| 380 | Detailed birgi Ledg. færsla | Detailed birgi færslur |
| 5802 | Gildi færsla | vöru valuation færslur |

## Villa Handling

| Villa | Orsök |
|-------|-------|
| `documentNo is required.` | The `documentNo` Færibreyta was ekki provided eða er empty |

## Tengdar skilaboðategundir

- **Data.Records.Get** — Retrieve the actual færsla data úr töflur identified með this skilaboðategund
- **Data.RecordIds.Get** — Get færsla IDs með filters fyrir a specific tafla
- **Data.Totals.Get** — Aggregate numeric fields across matching færslur

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

