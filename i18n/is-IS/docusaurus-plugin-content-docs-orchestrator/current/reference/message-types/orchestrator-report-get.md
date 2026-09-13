---
id: orchestrator-report-get
title: "Orchestrator.Report.Get"
sidebar_label: "Orchestrator.Report.Get"
sidebar_position: 12
description: "Request and response contract for the Orchestrator.Report.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar full report metadata including layouts og saved request page preset XML.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `reportId` | Integer | Yes | The report object ID |

## Svar

Includes `layouts` array með available report layouts og `preset` object with
the notandi's saved `requestPageXml` (null ef no preset er til). Also includes
`requestPageUrl` to open the report in BC fyrir interactive configuration.

## Preset Capture Flow

1. Kallaðu á Report.Get to get `presetCapturePageUrl`
2. Open that URL in BC to capture request page parameters
3. Kallaðu á Report.Get again — `preset.requestPageXml` er now populated
4. Notaðu in playbooks via Report.SaveAs (auto-resolves úr preset)

