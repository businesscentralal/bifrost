---
id: orchestrator-report-list
title: "Orchestrator.Report.List"
sidebar_label: "Orchestrator.Report.List"
sidebar_position: 13
description: "Request and response contract for the Orchestrator.Report.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Lists available reports úr Report Metadata, excluding obsolete reports.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `processingOnly` | Boolean | No | Filter by processing-only flag |

## Svar

```json
{ "reports": [{ "id": 206, "name": "Sales - Invoice", "caption": "Sales Invoice",
    "processingOnly": false, "defaultLayout": "RDLC",
    "firstDataItemTableId": 112, "useRequestPage": true }], "count": 1 }
```

