---
id: finance-financialreport-calculate
title: "Finance.FinancialReport.Calculate"
sidebar_label: "Finance.FinancialReport.Calculate"
sidebar_position: 44
description: "Beiðni- og svarsamningur fyrir Finance.FinancialReport.Calculate Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Executes a Financial Report definition (row group × column group) og Skilar the full calculated matrix as JSON. Uses BC `AccSchedManagement.CalcCell()` til compute hver cell Gildi. lesa-aðeins — no data er modified.

This er the aðeins programmatic way til get calculated financial report values. Standard APIs, OData, og Data.Records.Get getur ekki calculate report results — they aðeins return definitions.

**Stefna**: Útgående (lesa-aðeins)  **Efnisgerð**: `text/json`

## Identification

The `subject` envelope attribute identifies the Financial Report:
- **Report Heiti** (Code[10]) — e.g., `M-TEKJUR`, `M-STAÐA`, `GREINING`
- **SystemId** (GUID) — the Financial Report færsla's SystemId

til discover available reports, nota `Data.Records.Get` on tafla `Financial Report` með fields: Heiti, Lýsing, Financial Report Row Group, Financial Report Column Group.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Sjálfgefið | Athugasemdir |
|---|---|---|---|---|
| `dateFilter` | strengur | No | Report's saved filter | BC dagsetning filter (e.g., `2025-01-01..2026-06-30`). |
| `budgetFilter` | strengur | No | Report's saved filter | G/L Budget Heiti filter. |
| `dim1Filter` | strengur | No | Report's saved filter | Dimension 1 Gildi filter. |
| `dim2Filter` | strengur | No | Report's saved filter | Dimension 2 Gildi filter. |
| `dim3Filter` | strengur | No | Report's saved filter | Dimension 3 Gildi filter. |
| `dim4Filter` | strengur | No | Report's saved filter | Dimension 4 Gildi filter. |
| `useAmountsInAddCurrency` | sanngildi | No | Report's saved setting | Calculate in additional reporting currency. |
| `skipZeroRows` | sanngildi | No | `true` | Omit rows where all column values eru zero. |
| `columnLayoutName` | strengur | No | Report's assigned column group | Override column definition (Code[10]). |

### Request Examples

**Income statement fyrir H1 2026:**
```json
{ "subject": "M-TEKJUR", "data": { "dateFilter": "2026-01-01..2026-06-30" } }
```

**Balance sheet at year-end, all rows:**
```json
{ "subject": "M-STAÐA", "data": { "dateFilter": "..2025-12-31", "skipZeroRows": false } }
```

**Report með column override og dimension filter:**
```json
{ "subject": "GREINING", "data": { "dateFilter": "2026-01-01..2026-07-15", "columnLayoutName": "TÍMABIL", "dim1Filter": "ADM" } }
```

## Uppbygging svars

```json
{
  "status": "Success",
  "financialReportName": "M-TEKJUR",
  "rowDefinition": "M-TEKJUR",
  "columnDefinition": "M-HREYFING",
  "dateFilter": "2025-01-01..2026-12-31",
  "calculatedAt": "2026-07-15T16:22:56Z",
  "columns": [
    { "columnNo": "", "header": "Hreyfing", "columnType": "Net Change" }
  ],
  "rows": [
    { "lineNo": 30000, "rowNo": "P0003", "description": "Tekjur, vörusala", "totaling": "6105..6295", "totalingType": "Posting Accounts", "bold": false, "values": { "": -53859642.5 } },
    { "lineNo": 90000, "rowNo": "F0009", "description": "Samtals Tekjur", "totaling": "P0001..P0008", "totalingType": "Formula", "bold": true, "values": { "": -53797651.9 } },
    { "lineNo": 180000, "rowNo": "F0018", "description": "Brúttóhagnaður", "totaling": "F0009+F0016", "totalingType": "Formula", "bold": true, "values": { "": -156178351.9 } }
  ],
  "rowCount": 9,
  "columnCount": 1,
  "calculationDurationMs": 14
}
```

### Svarreitir

| Reitur | Gerð | Athugasemdir |
|---|---|---|
| `financialReportName` | strengur | The resolved Financial Report Heiti (Code[10]). |
| `rowDefinition` | strengur | The Acc. Schedule Heiti notað as row definition. |
| `columnDefinition` | strengur | The Column Layout Heiti notað. |
| `dateFilter` | strengur | The effective dagsetning filter applied. |
| `calculatedAt` | datetime | UTC timestamp of calculation (format 9 = XML). |
| `columns` | fylki | Column metadata. |
| `columns[].columnNo` | strengur | Column identifier notað as key in `values`. **getur be empty strengur** ef Column Layout has no Column No. |
| `columns[].header` | strengur | Display header (localized). |
| `columns[].columnType` | strengur | Enum Heiti (ekki localized). Values: `Net Change`, `Balance at Date`, `Beginning Balance`, `Year to Date`, `Rest of Fiscal Year`, `Entire Fiscal Year`. |
| `rows` | fylki | Calculated row data. |
| `rows[].lineNo` | heiltala | innri line númer (10000, 20000, ...). |
| `rows[].rowNo` | strengur | Display row ID (e.g., "P0001", "F0009"). **getur be empty.** |
| `rows[].description` | strengur | Line Lýsing (localized). |
| `rows[].totaling` | strengur | G/L account range (e.g., "6105..6295") eða formula (e.g., "P0001..P0008", "F0009+F0016"). |
| `rows[].totalingType` | strengur | Enum Heiti (ekki localized). Values: `Posting Accounts`, `Total Accounts`, `Formula`, `Set Base For Percent`, `Cost Type`, `Cost Type Total`, `Cash Flow Entry Accounts`, `Cash Flow Total Accounts`. |
| `rows[].bold` | sanngildi | True = summary/total line. nota fyrir visual hierarchy. |
| `rows[].values` | hlutur | Map of `columnNo → decimal`. Keys match `columns[].columnNo`. Negative = credit (revenue), positive = debit (expense). |
| `rowCount` | heiltala | Rows returned eftir filtering. |
| `columnCount` | heiltala | númer of columns. |
| `calculationDurationMs` | heiltala | Server-side execution time (ms). Typical: 5-50ms. |

## Important Athugasemdir fyrir AI Agents

1. **Values map keys**: The `values` hlutur keys eru `columnNo` strings úr column metadata. þegar a column layout has no Column No., the key er an empty strengur `""`. Always iterate `columns[]` til get the correct key fyrir hver Gildi.
2. **Enum fields nota invariant names**: `totalingType` og `columnType` return the BC enum **Heiti** (English, stable) — never a localized caption. Safe til match on. `header` og `description` remain in the user's language.
3. **Sign convention**: Revenue/income amounts eru typically **negative** (credit). Expenses eru **positive** (debit). The `Show Opposite Sign` flag er applied automatically — what you receive er the display Gildi.
4. **Formula rows**: Rows með `totalingType` containing "Formula" (eða its localized equivalent) reference other rows með their `rowNo`. These eru computed subtotals/totals. They appear með `bold: true` in most report designs.
5. **Finding the report Heiti**: nota `Data.Records.Get` on tafla `Financial Report` til list all available reports. The Heiti Reitur (Code[10]) goes í `subject`.
6. **dagsetning filter format**: nota BC dagsetning filter syntax — `2026-01-01..2026-06-30` (range), `..2026-12-31` (up til dagsetning), eða `2026-01-01..` (úr dagsetning). Omit fyrir the report's saved Sjálfgefið.
7. **Async execution**: fyrir reports með analysis views that may need updating, nota async mode (set `async: true`) til avoid HTTP timeouts. Poll `queue_get_status` until complete.

## Row Visibility Logic

hver row has a `Show` Reitur controlling inclusion:

| Show Gildi | Behavior |
|---|---|
| Yes | Always included (even ef all zeros). |
| No | Always excluded. |
| ef hvaða Column ekki Zero | Included aðeins ef ≥1 column Gildi ≠ 0. |
| þegar Positive Balance | Included aðeins ef ≥1 Gildi > 0. |
| þegar Negative Balance | Included aðeins ef ≥1 Gildi &lt; 0. |

`skipZeroRows` (Sjálfgefið `true`) er additive: rows where ALL values = 0 eru excluded even ef Show = Yes. Set `false` til get the full structure þar á meðal blank spacer rows.

## Villur

| Villa | Orsök | Resolution |
|---|---|---|
| `Financial report must be identified via subject (report name or SystemId).` | Subject er empty. | Set subject til the report Heiti eða GUID. |
| `Financial Report '{name}' not found.` | No matching færsla. | List reports með `Data.Records.Get` on tafla `Financial Report`. |
| `Row definition '{name}' not found...` | vantar Acc. Schedule Heiti. | The report's row group er misconfigured in BC. |
| `Column definition '{name}' not found.` | ógilt column layout. | Check `columnLayoutName` spelling eða omit til nota the report's Sjálfgefið. |

## Performance

Calculation cost = rows × columns × CalcCell(). Observed performance: 38-row × 1-column = 14ms, 9-row × 1-column = 4ms. Reports með analysis views needing refresh may take longer on fyrsta call. nota async mode fyrir safety.

## Tengdar skilaboðategundir

| skilaboðategund | nota fyrir |
|---|---|
| `Data.Records.Get` (tafla: Financial Report) | List available reports og their row/column group assignments. |
| `Data.Records.Get` (tafla: Acc. Schedule Line) | Inspect row definitions án calculating values. |
| `Data.Records.Get` (tafla: Column Layout) | Inspect column definitions. |
| `Finance.GeneralJournal.Check` | Validate dagbók batches áður en posting. |
| `Finance.GeneralJournal.Post` | Post dagbók batches. |

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

