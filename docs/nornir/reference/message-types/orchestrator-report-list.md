---
id: orchestrator-report-list
title: "Orchestrator.Report.List"
sidebar_label: "Orchestrator.Report.List"
sidebar_position: 13
description: "Request and response contract for the Orchestrator.Report.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Lists available reports from Report Metadata, excluding obsolete reports.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `processingOnly` | Boolean | No | Filter by processing-only flag |

## Response

```json
{ "reports": [{ "id": 206, "name": "Sales - Invoice", "caption": "Sales Invoice",
    "processingOnly": false, "defaultLayout": "RDLC",
    "firstDataItemTableId": 112, "useRequestPage": true }], "count": 1 }
```

