---
id: orchestrator-report-saveas
title: "Orchestrator.Report.SaveAs"
sidebar_label: "Orchestrator.Report.SaveAs"
sidebar_position: 15
description: "Request and response contract for the Orchestrator.Report.SaveAs Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Generates report output (PDF, Excel, Word, XML). Returns binary content via the standard response blob.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `reportId` | Integer | Yes | The report object ID |
| `format` | Text | No | PDF (default), Excel, Word, XML |
| `requestPageXml` | Text | No | Report parameters XML. Falls back to saved preset, then defaults |
| `tableView` | Text | No | BC table view filter for the root data item |
| `layoutName` | Text | No | Override layout name (from Report.Get layouts) |

## Response

Binary content (e.g. PDF) in the response blob. Via MCP: returned as `blobRef`.

## Playbook Pattern — Batch report to email

```
Step 10: Data.Records.Get → customer list
Step 20 (forEach): Orchestrator.Report.SaveAs
  { "reportId": 206, "format": "PDF",
    "tableView": "WHERE(Sell-to Customer No.=CONST(@_current.no))" }
Step 30 (forEach): Email.Draft.Set with blobRef attachment
Step 40 (forEach): Orchestrator.Email.Send
```

