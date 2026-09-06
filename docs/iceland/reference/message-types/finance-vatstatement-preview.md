---
id: finance-vatstatement-preview
title: "Finance.VATStatement.Preview"
sidebar_label: "Finance.VATStatement.Preview"
sidebar_position: 2
description: "Request and response contract for the Finance.VATStatement.Preview Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Calculates a VAT Statement and returns amounts per line with `boxNo` for RSK category mapping.
This bridges BC VAT entries and the Icelandic RSK VAT return.

**Direction:** Read-only

## Role in VAT Return Workflow
```
Post transactions → CalcAndPostSettlement → **VATStatement.Preview** → Map to RSK → Validate → Submit
```

## Request
```json
{
  "templateName": "VAT",
  "name": "VSK SKIL",
  "selection": "Closed",
  "dateFilter": "2026-03-01..2026-04-30"
}
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| templateName | Yes | VAT Statement Template code (e.g. "VAT") |
| name | Yes | VAT Statement Name code (e.g. "VSK SKIL") |
| selection | No | "Open", "Closed", or "Open and Closed" (default). **Use "Closed" for VAT returns** |
| dateFilter | No | Posting date filter matching RSK period startDate..endDate |

## Response
```json
{
  "status": "Success",
  "lines": [
    { "lineNo": 10000, "rowNo": "010", "description": "Skattskyld velta 24%", "boxNo": "67", "columnAmount": -806451.61 },
    { "lineNo": 20000, "rowNo": "020", "description": "Útskattur 24%", "boxNo": "68", "columnAmount": -193548.39 },
    { "lineNo": 50000, "rowNo": "050", "description": "Innskattur 24%", "boxNo": "84", "columnAmount": 58064.52 }
  ]
}
```

## Mapping to RSK Entries

Each `boxNo` maps to a `categoryId` on Iceland VAT Period Entry ori:
```
For each line WHERE boxNo <> '':
  amount = ABS(ROUND(columnAmount, 1))
  set_records on Iceland VAT Period Entry ori
    WHERE Category Id = boxNo → Amount = amount
```
Sales amounts are negative (credit); RSK expects positive. Use ABS().

## Agent Playbook
1. Run `Finance.VAT.CalcAndPostSettlement` first to close VAT entries.
2. Call this with `selection: "Closed"` and `dateFilter` = startDate..endDate from GetInfo.
3. Map `columnAmount` (ABS, rounded) per `boxNo` to RSK entry `categoryId`.
4. Write to Iceland VAT Period Entry ori field 15 (Amount) via `set_records`.
5. Call `Iceland.VAT.Validate` then `Iceland.VAT.Submit`.

## VAT Statement Setup (one-time, "VSK SKIL")
| Box No. | Description | Rate | Type | Amount Type |
|---------|-------------|------|------|-------------|
| 67 | Skattskyld velta 24% | 24% | Sale | Base |
| 68 | Útskattur 24% | 24% | Sale | Amount |
| 64 | Skattskyld velta 11% | 11% | Sale | Base |
| 65 | Útskattur 11% | 11% | Sale | Amount |
| 84 | Innskattur 24% | 24% | Purchase | Amount |
| 83 | Innskattur 11% | 11% | Purchase | Amount |
| 53 | Undanþegin velta | 0% | Sale | Base |

