---
id: finance-financialreport-calculate
title: "Finance.FinancialReport.Calculate"
sidebar_label: "Finance.FinancialReport.Calculate"
sidebar_position: 44
description: "Request and response contract for the Finance.FinancialReport.Calculate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Executes a Financial Report definition (row group × column group) and returns the full calculated matrix as JSON. Uses BC `AccSchedManagement.CalcCell()` to compute each cell value. Read-only — no data is modified.

This is the only programmatic way to get calculated financial report values. Standard APIs, OData, and Data.Records.Get cannot calculate report results — they only return definitions.

**Direction**: Outbound (read-only)  **Content-Type**: `text/json`

## Identification

The `subject` envelope attribute identifies the Financial Report:
- **Report Name** (Code[10]) — e.g., `M-TEKJUR`, `M-STAÐA`, `GREINING`
- **SystemId** (GUID) — the Financial Report record's SystemId

To discover available reports, use `Data.Records.Get` on table `Financial Report` with fields: Name, Description, Financial Report Row Group, Financial Report Column Group.

## Request Parameters

| Parameter | Type | Required | Default | Notes |
|---|---|---|---|---|
| `dateFilter` | string | No | Report's saved filter | BC date filter (e.g., `2025-01-01..2026-06-30`). |
| `budgetFilter` | string | No | Report's saved filter | G/L Budget Name filter. |
| `dim1Filter` | string | No | Report's saved filter | Dimension 1 value filter. |
| `dim2Filter` | string | No | Report's saved filter | Dimension 2 value filter. |
| `dim3Filter` | string | No | Report's saved filter | Dimension 3 value filter. |
| `dim4Filter` | string | No | Report's saved filter | Dimension 4 value filter. |
| `useAmountsInAddCurrency` | boolean | No | Report's saved setting | Calculate in additional reporting currency. |
| `skipZeroRows` | boolean | No | `true` | Omit rows where all column values are zero. |
| `columnLayoutName` | string | No | Report's assigned column group | Override column definition (Code[10]). |

### Request Examples

**Income statement for H1 2026:**
```json
{ "subject": "M-TEKJUR", "data": { "dateFilter": "2026-01-01..2026-06-30" } }
```

**Balance sheet at year-end, all rows:**
```json
{ "subject": "M-STAÐA", "data": { "dateFilter": "..2025-12-31", "skipZeroRows": false } }
```

**Report with column override and dimension filter:**
```json
{ "subject": "GREINING", "data": { "dateFilter": "2026-01-01..2026-07-15", "columnLayoutName": "TÍMABIL", "dim1Filter": "ADM" } }
```

## Response Shape

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

### Response Fields

| Field | Type | Notes |
|---|---|---|
| `financialReportName` | string | The resolved Financial Report name (Code[10]). |
| `rowDefinition` | string | The Acc. Schedule Name used as row definition. |
| `columnDefinition` | string | The Column Layout Name used. |
| `dateFilter` | string | The effective date filter applied. |
| `calculatedAt` | datetime | UTC timestamp of calculation (format 9 = XML). |
| `columns` | array | Column metadata. |
| `columns[].columnNo` | string | Column identifier used as key in `values`. **Can be empty string** if Column Layout has no Column No. |
| `columns[].header` | string | Display header (localized). |
| `columns[].columnType` | string | Enum name (not localized). Values: `Net Change`, `Balance at Date`, `Beginning Balance`, `Year to Date`, `Rest of Fiscal Year`, `Entire Fiscal Year`. |
| `rows` | array | Calculated row data. |
| `rows[].lineNo` | integer | Internal line number (10000, 20000, ...). |
| `rows[].rowNo` | string | Display row ID (e.g., "P0001", "F0009"). **Can be empty.** |
| `rows[].description` | string | Line description (localized). |
| `rows[].totaling` | string | G/L account range (e.g., "6105..6295") or formula (e.g., "P0001..P0008", "F0009+F0016"). |
| `rows[].totalingType` | string | Enum name (not localized). Values: `Posting Accounts`, `Total Accounts`, `Formula`, `Set Base For Percent`, `Cost Type`, `Cost Type Total`, `Cash Flow Entry Accounts`, `Cash Flow Total Accounts`. |
| `rows[].bold` | boolean | True = summary/total line. Use for visual hierarchy. |
| `rows[].values` | object | Map of `columnNo → decimal`. Keys match `columns[].columnNo`. Negative = credit (revenue), positive = debit (expense). |
| `rowCount` | integer | Rows returned after filtering. |
| `columnCount` | integer | Number of columns. |
| `calculationDurationMs` | integer | Server-side execution time (ms). Typical: 5-50ms. |

## Important Notes for AI Agents

1. **Values map keys**: The `values` object keys are `columnNo` strings from column metadata. When a column layout has no Column No., the key is an empty string `""`. Always iterate `columns[]` to get the correct key for each value.
2. **Enum fields use invariant names**: `totalingType` and `columnType` return the BC enum **name** (English, stable) — never a localized caption. Safe to match on. `header` and `description` remain in the user's language.
3. **Sign convention**: Revenue/income amounts are typically **negative** (credit). Expenses are **positive** (debit). The `Show Opposite Sign` flag is applied automatically — what you receive is the display value.
4. **Formula rows**: Rows with `totalingType` containing "Formula" (or its localized equivalent) reference other rows by their `rowNo`. These are computed subtotals/totals. They appear with `bold: true` in most report designs.
5. **Finding the report name**: Use `Data.Records.Get` on table `Financial Report` to list all available reports. The Name field (Code[10]) goes into `subject`.
6. **Date filter format**: Use BC date filter syntax — `2026-01-01..2026-06-30` (range), `..2026-12-31` (up to date), or `2026-01-01..` (from date). Omit for the report's saved default.
7. **Async execution**: For reports with analysis views that may need updating, use async mode (set `async: true`) to avoid HTTP timeouts. Poll `queue_get_status` until complete.

## Row Visibility Logic

Each row has a `Show` field controlling inclusion:

| Show Value | Behavior |
|---|---|
| Yes | Always included (even if all zeros). |
| No | Always excluded. |
| If Any Column Not Zero | Included only if ≥1 column value ≠ 0. |
| When Positive Balance | Included only if ≥1 value > 0. |
| When Negative Balance | Included only if ≥1 value &lt; 0. |

`skipZeroRows` (default `true`) is additive: rows where ALL values = 0 are excluded even if Show = Yes. Set `false` to get the full structure including blank spacer rows.

## Errors

| Error | Cause | Resolution |
|---|---|---|
| `Financial report must be identified via subject (report name or SystemId).` | Subject is empty. | Set subject to the report name or GUID. |
| `Financial Report '{name}' not found.` | No matching record. | List reports with `Data.Records.Get` on table `Financial Report`. |
| `Row definition '{name}' not found...` | Missing Acc. Schedule Name. | The report's row group is misconfigured in BC. |
| `Column definition '{name}' not found.` | Invalid column layout. | Check `columnLayoutName` spelling or omit to use the report's default. |

## Performance

Calculation cost = rows × columns × CalcCell(). Observed performance: 38-row × 1-column = 14ms, 9-row × 1-column = 4ms. Reports with analysis views needing refresh may take longer on first call. Use async mode for safety.

## Related Message Types

| Message Type | Use For |
|---|---|
| `Data.Records.Get` (table: Financial Report) | List available reports and their row/column group assignments. |
| `Data.Records.Get` (table: Acc. Schedule Line) | Inspect row definitions without calculating values. |
| `Data.Records.Get` (table: Column Layout) | Inspect column definitions. |
| `Finance.GeneralJournal.Check` | Validate journal batches before posting. |
| `Finance.GeneralJournal.Post` | Post journal batches. |

