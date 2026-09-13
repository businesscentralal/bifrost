---
id: finance-vatstatement-preview
title: "Finance.VATStatement.Preview"
sidebar_label: "Finance.VATStatement.Preview"
sidebar_position: 2
description: "Beiðni- og svarsamningur fyrir Finance.VATStatement.Preview Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Calculates a VAT Statement og Skilar amounts per line með `boxNo` fyrir RSK category mapping.
This bridges BC VAT entries og the Icelandic RSK VAT return.

**Stefna:** Read-Aðeins

## Role in VAT Return Verkflæði
```
Post transactions → CalcAndPostSettlement → **VATStatement.Preview** → Map to RSK → Validate → Submit
```

## Beiðni
```json
{
  "templateName": "VAT",
  "name": "VSK SKIL",
  "selection": "Closed",
  "dateFilter": "2026-03-01..2026-04-30"
}
```

| Parameter | nauðsynlegt | Lýsing |
|-----------|----------|-------------|
| templateName | Yes | VAT Statement Template code (e.g. "VAT") |
| Heiti | Yes | VAT Statement Heiti code (e.g. "VSK SKIL") |
| selection | No | "Open", "Closed", eða "Open og Closed" (default). **Notaðu "Closed" fyrir VAT Skilar** |
| dateFilter | No | Posting date filter matching RSK period startDate..endDate |

## Svar
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

## Mapping til RSK Entries

Each `boxNo` maps til a `categoryId` on Iceland VAT Period Entry ori:
```
For each line WHERE boxNo <> '':
  amount = ABS(ROUND(columnAmount, 1))
  set_records on Iceland VAT Period Entry ori
    WHERE Category Id = boxNo → Amount = amount
```
Sales amounts eru negative (credit); RSK expects positive. Notaðu ABS().

## Agent Playbook
1. Run `Finance.VAT.CalcAndPostSettlement` first til close VAT entries.
2. Kallaðu á this með `selection: "Closed"` og `dateFilter` = startDate..endDate frá GetInfo.
3. Map `columnAmount` (ABS, rounded) per `boxNo` til RSK entry `categoryId`.
4. Write til Iceland VAT Period Entry ori Reitur 15 (Amount) via `set_records`.
5. Kallaðu á `Iceland.VAT.Validate` then `Iceland.VAT.Submit`.

## VAT Statement Setup (one-time, "VSK SKIL")
| Box No. | Lýsing | Rate | Gerð | Amount Gerð |
|---------|-------------|------|------|-------------|
| 67 | Skattskyld velta 24% | 24% | Sale | Base |
| 68 | Útskattur 24% | 24% | Sale | Amount |
| 64 | Skattskyld velta 11% | 11% | Sale | Base |
| 65 | Útskattur 11% | 11% | Sale | Amount |
| 84 | Innskattur 24% | 24% | Purchase | Amount |
| 83 | Innskattur 11% | 11% | Purchase | Amount |
| 53 | Undanþegin velta | 0% | Sale | Base |


