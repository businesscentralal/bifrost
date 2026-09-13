---
id: csv-records-get
title: "CSV.Records.Get"
sidebar_label: "CSV.Records.Get"
sidebar_position: 8
description: "Beiðni- og svarsamningur fyrir CSV.Records.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Exports all matching færslur úr a specified Business Central tafla as a CSV file in opið Mirroring format. fyrir large result Stillir that approach the 2 GB OutStream limit, a continuation pattern er stutt via `continueFromRecordId`.

**Stefna**: Útgående (response til request)
**Efnisgerð**: text/csv

## Request Format

### Bifrost Parameters

- **Uppruni** (áskilið): Identifies the calling jöfnun eða system.
- **data** (valfrjálst): JSON hlutur containing Beiðnibreytur.

### Response Data Format

The **data** Reitur in Svarið contains a download URL til retrieve the CSV file:

- **Format**: `/api/origo/bifrost/v1.0/responses({guid})`
- **Usage**: Call the URL til download the full CSV response

### Input Parameters (in data payload)
```json
{
  "tableName": "Customer",
  "fieldNumbers": [1, 2, 5, 7],
  "startDateTime": "2026-01-01T00:00:00Z",
  "endDateTime": "2026-12-31T23:59:59Z",
  "tableView": "WHERE(Blocked = CONST( ))"
}
```

| Færibreyta | Athugasemdir |
|---|---|
| `tableName` | tafla Heiti. nota `tableNumber` (alias `tableNo` / `tableId`) instead til identify the tafla með númer, e.g. `18`. |
| `fieldNumbers` | valfrjálst. Specific Reitur numbers til include. Omit fyrir all Normal fields. |
| `startDateTime` / `endDateTime` | valfrjálst. Filter on `SystemModifiedAt` (ISO 8601). |
| `tableView` | valfrjálst. Additional BC SetView filter/sort. |

## Response Format

þegar færslur match, a UTF-8 encoded CSV file er returned með content Gerð `text/csv`. The fyrsta row er the header row; subsequent rows eru data rows, one per færsla.

**ef no færslur match the filters, no CSV er written.** Both `data` og `datacontenttype` in the Bifrost response mun be empty strengur. The task still completes successfully — check whether `data` er empty áður en attempting til download.

## Column Naming Convention

hver column header er formed með stripping non-alphanumeric characters (except `%`) úr the BC Reitur Heiti.

- Non-alphanumeric characters (except `%`) eru stripped úr the Reitur Heiti

Examples:
- Reitur `No.` → `No`
- Reitur `Name` → `Name`
- Reitur `Sell-to Customer No.` → `SelltoCustomerNo`
- Reitur `SystemId` → `SystemId`

## System Fields

The following system fields eru **always included** at the end of every row, regardless of `fieldNumbers`:

| Column | Reitur No. | Lýsing |
|--------|-----------|-------------|
| `timestamp` | 0 | innri timestamp (BigInteger) |
| `SystemId` | 2000000000 | færsla GUID |
| `SystemCreatedAt` | 2000000001 | Creation timestamp (UTC) |
| `SystemCreatedBy` | 2000000002 | Created með user GUID |
| `SystemModifiedAt` | 2000000003 | síðasta modified timestamp (UTC) |
| `SystemModifiedBy` | 2000000004 | síðasta modified með user GUID |

## $Company Column

fyrir per-company töflur (most Business Central töflur), a `$Company` column er appended eftir the system fields.
The Gildi er double-quoted og escaped.

The exact Gildi er controlled með the **Export Company Heiti Gerð** setup Reitur (Bifrost Setup):

| Setup Gildi | $Company Gildi |
|-------------|----------------|
| `Company Name` (Sjálfgefið) | `CompanyName()` — the technical Company.Name |
| `Company Display Name` | `Company."Display Name"`, falling back til `CompanyName()` þegar blank |

The Gildi er resolved once per request og reused fyrir every row in the export.
The enum er extensible via the `Bifrost Company Name Type` enum (65601) og `Bifrost Company Name` interface.

## __rowMarker__ Column (opið Mirroring)

The `__rowMarker__` column er **always** the síðasta column in every row.
fyrir `CSV.Records.Get`, the Gildi er always `4`, indicating an **upsert/virkt færsla**.

þegar combined með `CSV.DeletedRecords.Get` exports (rowMarker = `2`), downstream systems getur merge both CSV exports til maintain a complete færsla lifecycle view:

- `__rowMarker__ = 4`: færsla er virkt (insert eða update)
- `__rowMarker__ = 2`: færsla has been deleted

This follows the opið Mirroring convention notað með bc2adls og Azure Data Lake sync pipelines.

## Reitur Gerð Support

**stutt types** (included in output):
BigInteger, sanngildi, Code, dagsetning, DateFormula, DateTime, tugabrot, Duration, Guid, heiltala, Option, Text, Time

**Unsupported types** (silently skipped):
BLOB, Media, MediaSet, RecordID, OemCode, OemText, TableFilter

## Snið gilda

| Gerð | Format | Quoted |
|------|--------|--------|
| BigInteger, heiltala, tugabrot, Duration | Culture-invariant númer | No |
| sanngildi | `true` eða `false` | No |
| dagsetning | `YYYY-MM-DD` (blank dagsetning → empty strengur) | No |
| DateFormula | Culture-invariant | No |
| Time | `HH:mm:ss` | Yes |
| DateTime | ISO 8601 UTC með 3-digit ms, e.g. `2024-01-15T10:30:00.000Z` (zero DT → empty) | No |
| Option | Enum Gildi Heiti | Yes |
| Code, Text, Guid | strengur Gildi | Yes |

strengur quoting og escaping:
- LF (char 10) og CR (char 13) eru replaced með a space
- Backslash `\` er escaped as `\\`
- Double-quote `"` er escaped as `\"`
- The Gildi er wrapped in double quotes: `"value"`

## Usage Example

### Request
```json
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Customer",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Customer",
    "tableView": "WHERE(Blocked = CONST( ))"
  }
}
```

### Response (CSV excerpt)
```
No,Name,Address,City,Blocked,timestamp,SystemId,SystemCreatedAt,SystemCreatedBy,SystemModifiedAt,SystemModifiedBy,$Company,__rowMarker__
"C00001","Fabrikam, Inc.","123 Main St","Seattle","","",2024-01-15T10:30:00.000Z,...,"CRONUS International Ltd.",4
```

## Villa Handling

| Condition | Response |
|-----------|----------|
| tafla ekki identified in request | Villa raised með tafla evaluation |
| lesa heimild denied | Villa message með tafla númer |
| No færslur match filters | Task succeeds; `data` og `datacontenttype` eru both empty |
| Reitur of unsupported Gerð | Reitur silently skipped |
| `continueFromRecordId` points til non-existent færsla | Villa: "Unable til locate the færsla in tafla &#123;Heiti&#125; með System Id &#123;guid&#125;" |

## Continuation Pattern (Large Exports)

þegar the CSV response approaches the 2 GB OutStream limit, the export stops eftir the current 4 MB chunk og Skilar the `SystemId` of the **next unprocessed færsla** in the `continueFromRecordId` response Reitur.

### How It Works

1. Send a normal `CSV.Records.Get` request.
2. Check the `continueFromRecordId` Reitur in Svarið.
3. ef it contains a GUID, send another request með `continueFromRecordId` set til that Gildi.
4. Repeat until Svarið `continueFromRecordId` er empty (all færslur exported).

### Request Færibreyta

`continueFromRecordId` er a **top-level Bifrost attribute** (like `subject`), ekki part of the JSON data payload.

| Færibreyta | Gerð | áskilið | Lýsing |
|-----------|------|----------|-------------|
| `continueFromRecordId` | GUID | No | SystemId of the færsla til resume úr. Omit eða leave empty fyrir the fyrsta request. |

### Continuation Example

**fyrsta request** (no continuation):
```json
{
  "specversion": "1.0",
  "type": "CSV.Records.Get",
  "source": "my-integration",
  "subject": "Item Ledger Entry",
  "datacontenttype": "application/json",
  "data": {}
}
```

**Response** indicates more data available:
- CSV data in `data` Reitur (download URL)
- `continueFromRecordId` = `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`

**Next request** (með continuation):
```json
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

**Final response** (all færslur exported):
- CSV data in `data` Reitur
- `continueFromRecordId` er empty

### Important Athugasemdir

- hver continuation chunk includes the CSV header row, so consumers should skip the header on subsequent chunks.
- The sama filters (`tableView`, `startDateTime`, `endDateTime`) verður að be sent on every continuation request til ensure consistent results.
- `continueFromRecordId` uses `RecRef.GetBySystemId()` — ef the færsla was deleted between requests, an Villa er returned.

## Tengdar skilaboðategundir

- **Data.Records.Get** — sama filtering, Skilar JSON instead of CSV, styður skip/take pagination
- **Data.Record.Ids.Get** — Skilar aðeins færsla IDs (SystemId + SystemModifiedAt) as JSON
- **CSV.DeletedRecords.Get** — exports deleted færsla audit log færslur as CSV (rowMarker = 2)

