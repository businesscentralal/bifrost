---
id: orchestrator-report-run
title: "Orchestrator.Report.Run"
sidebar_label: "Orchestrator.Report.Run"
sidebar_position: 14
description: "Request and response contract for the Orchestrator.Report.Run Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Runs a processing-only report — a batch job such as Adjust Cost, Post Inventory Cost to G/L,
or Update Currency Exchange Rates. These reports produce no document; they change data.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `reportId` | Integer | Yes | Must be a report with `processingOnly: true` |
| `requestPageXml` | Text | No | Report parameters XML. Falls back to saved preset, then defaults |
| `tableView` | Text | No | BC table view filter for the root data item |

Reports that produce output are rejected — use `Orchestrator.Report.SaveAs` for those.

## Response

```json
{ "status": "Success", "reportId": 795, "reportName": "Adjust Cost - Item Entries",
  "usedPreset": true, "tableView": "", "durationMs": 41230 }
```

A failing report is caught and returned, not thrown:

```json
{ "status": "Error", "error": "<BC error text>", "callstack": "<BC error callstack>" }
```

## Read This Before Using It

- **Success only means no error was raised.** The report returns no result. A run that
  matched zero records looks identical to one that adjusted 50,000 entries. Verify with a
  following `Data.Records.Get` step against the register or ledger the report writes to.
- **Effects are irreversible, and partial on failure.** Most batch reports commit as they go,
  so `{"status":"Error"}` does NOT mean nothing happened.
- **Do not auto-retry.** Set the orchestrator entry retry policy to `Never` for any chain
  containing this step.
- **Check what you are calling first.** `Orchestrator.Report.List` with
  `{"processingOnly": true}` is unfiltered — it lists Date Compress G/L Entries and Delete
  Invoiced Sales Orders next to the harmless ones. Call `Orchestrator.Report.Get` to confirm
  what a reportId actually is before running it.
- **No request page is shown.** Parameters come only from `requestPageXml` or the saved
  preset. Capture a preset via the URL from `Orchestrator.Report.Get`.
- **Long runs need the queue.** Batch jobs can outlive a synchronous request — use
  `Orchestrator.Playbook.Enqueue` or the async queue endpoint.

