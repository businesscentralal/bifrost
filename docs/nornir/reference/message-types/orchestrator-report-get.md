---
id: orchestrator-report-get
title: "Orchestrator.Report.Get"
sidebar_label: "Orchestrator.Report.Get"
sidebar_position: 12
description: "Request and response contract for the Orchestrator.Report.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns full report metadata including layouts and saved request page preset XML.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `reportId` | Integer | Yes | The report object ID |

## Response

Includes `layouts` array with available report layouts and `preset` object with
the user's saved `requestPageXml` (null if no preset exists). Also includes
`requestPageUrl` to open the report in BC for interactive configuration.

## Preset Capture Flow

1. Call Report.Get to get `presetCapturePageUrl`
2. Open that URL in BC to capture request page parameters
3. Call Report.Get again — `preset.requestPageXml` is now populated
4. Use in playbooks via Report.SaveAs (auto-resolves from preset)

