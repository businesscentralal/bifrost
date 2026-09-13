---
id: orchestrator-report-saveas
title: "Orchestrator.Report.SaveAs"
sidebar_label: "Orchestrator.Report.SaveAs"
sidebar_position: 15
description: "Request and response contract for the Orchestrator.Report.SaveAs Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Generates report output (PDF, Excel, Word, XML). Skilar binary innihald via the standard response blob.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `reportId` | Integer | Yes | The report object ID |
| `format` | Text | No | PDF (sjálfgefið), Excel, Word, XML |
| `requestPageXml` | Text | No | Report parameters XML. Falls back to saved preset, then sjálfgefiðs |
| `tableView` | Text | No | BC table view filter fyrir the root data vara |
| `layoutName` | Text | No | Override layout heiti (from Report.Get layouts) |

## Svar

Binary innihald (e.g. PDF) in the response blob. Via MCP: returned as `blobRef`.

## Playbook Pattern — Batch report to email

```
Step 10: Data.Records.Get → customer list
Step 20 (forEach): Orchestrator.Report.SaveAs
  { "reportId": 206, "format": "PDF",
    "tableView": "WHERE(Sell-to Customer No.=CONST(@_current.no))" }
Step 30 (forEach): Email.Draft.Set with blobRef attachment
Step 40 (forEach): Orchestrator.Email.Send
```

