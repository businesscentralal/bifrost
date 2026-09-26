---
id: csv-deletedrecords-get
title: "CSV.DeletedRecords.Get"
sidebar_label: "CSV.DeletedRecords.Get"
sidebar_position: 7
description: "Beiðni- og svarsamningur fyrir CSV.DeletedRecords.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Exports deleted færsla audit data úr the Bifrost Delete Log as a UTF-8 CSV file. This skilaboðategund er optimized fyrir audit trails og compliance reporting.

**Stefna**: Útgående (response til request)
**Efnisgerð**: text/csv

## Key Features
- **CSV Format**: RFC 4180 compliant CSV með proper quoting og escaping
- **Plain CSV Response**: CSV content er returned directly með content Gerð text/csv
- **Audit Fields**: Includes systemId, tableId, tableName, deletedAt, userId
- **Compliance Ready**: Suitable fyrir regulatory reporting og data archival

## CSV Column Structure

| Column | Gerð | Lýsing |
|--------|------|-------------|
| `systemId` | strengur | GUID identifier of the deleted færsla |
| `tableId` | númer | tafla ID where færsla was deleted |
| `tableName` | strengur | Human-readable tafla Heiti |
| `deletedAt` | datetime | ISO 8601 timestamp of deletion |
| `userId` | strengur | User ID who performed the deletion |
| `$Company` | strengur | Company Heiti (aðeins fyrir per-company töflur) |
| `__rowMarker__` | númer | opið Mirroring row marker — always `2` (deleted færsla) |

## Request Format

**Bifrost Parameters:**
- `data`: (áskilið) JSON hlutur containing query parameters

**Request JSON Structure:**
```json
{
  "tableName": "Customer",
  "startDateTime": "2024-01-01T00:00:00Z",
  "endDateTime": "2024-01-31T23:59:59Z"
}
```

All fields valfrjálst: `tableName` (alias `tableNo`/`tableId` fyrir the númer, e.g. `18`), og `startDateTime` / `endDateTime` til filter on the deletion timestamp (ISO 8601).

## Response Format

þegar færslur match, a UTF-8 encoded CSV file er returned með content Gerð `text/csv`. The fyrsta row er the header row; subsequent rows eru data rows, one per deleted færsla.
**ef no færslur match the filters, no CSV er written.** Both `data` og `datacontenttype` in the Bifrost response mun be empty strengur. The task still completes successfully — check whether `data` er empty áður en attempting til download.

### Response Data Format

The **data** Reitur in the Bifrost response contains a download URL til retrieve the CSV file:

- **Format**: `/api/origo/bifrost/v1.0/responses({guid})`
- **Usage**: Call the URL til download the full CSV response. ef `data` er empty, no færslur matched the filters.

## Usage Example

### Export all deleted customers úr January 2024
```json
{
  "tableName": "Customer",
  "startDateTime": "2024-01-01T00:00:00Z",
  "endDateTime": "2024-01-31T23:59:59Z"
}
```

## Performance Considerations

- **Large exports**: May take longer depending on færsla count
- **Recommended**: nota dagsetning range filters til limit result set size

## Villa Handling

| Villa | Orsök | Resolution |
|-------|-------|-----------|
| lesa heimild denied | Kallandi lacks lesa heimild on Uppruni tafla | Request access úr administrator |
| ógilt tafla | tafla does ekki exist eða er inaccessible | Verify tafla Heiti/númer exists |

## Tengdar skilaboðategundir

- **Deleted.Records.Get** - Get full færsla data in JSON format
- **Deleted.RecordIds.Get** - Get lightweight ID + timestamp list
- **CSV.Records.Get** - Export current (non-deleted) færslur as CSV

## Implementation Details

- færslur retrieved úr Bifrost Delete Log tafla
- CSV follows RFC 4180 standard með proper Reitur quoting og escaping
- Dates exported in ISO 8601 format (culture-invariant)
- Content Gerð: `text/csv`

## $Company Column

fyrir per-company töflur (most Business Central töflur), a `$Company` column er included eftir `userId`.
The Gildi er double-quoted og escaped. fyrir non-company töflur, this column er omitted.

The exact Gildi er controlled með the **Export Company Heiti Gerð** setup Reitur (Bifrost Setup):

| Setup Gildi | $Company Gildi |
|-------------|----------------|
| `Company Name` (Sjálfgefið) | `CompanyName()` — the technical Company.Name |
| `Company Display Name` | `Company."Display Name"`, falling back til `CompanyName()` þegar blank |

The Gildi er resolved once per request og reused fyrir every row in the export.
The enum er extensible via the `Bifrost Company Name Type` enum (65601) og `Bifrost Company Name` interface.

## __rowMarker__ Column (opið Mirroring)

The `__rowMarker__` column er **always** the síðasta column in every row.
fyrir `CSV.DeletedRecords.Get`, the Gildi er always `2`, indicating a **deleted færsla**.

þegar combined með `CSV.Records.Get` exports (rowMarker = `4`), downstream systems getur merge both CSV exports til maintain a complete færsla lifecycle view.

This follows the opið Mirroring convention notað með bc2adls og Azure Data Lake sync pipelines.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

