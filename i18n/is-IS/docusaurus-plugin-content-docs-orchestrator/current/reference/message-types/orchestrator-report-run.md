---
id: orchestrator-report-run
title: "Orchestrator.Report.Run"
sidebar_label: "Orchestrator.Report.Run"
sidebar_position: 14
description: "Request and response contract for the Orchestrator.Report.Run Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Keyrir a processing-only report — a batch job such as Adjust Cost, Post Inventory Cost to G/L,
or Updagsetning Currency Exchange Rates. These reports produce no skjal; they change data.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `reportId` | Integer | Yes | Must be a report með `processingOnly: true` |
| `requestPageXml` | Text | No | Report parameters XML. Falls back to saved preset, then sjálfgefiðs |
| `tableView` | Text | No | BC table view filter fyrir the root data vara |

Reports that produce output eru rejected — use `Orchestrator.Report.SaveAs` fyrir those.

## Svar

```json
{ "status": "Success", "reportId": 795, "reportName": "Adjust Cost - Item Entries",
  "usedPreset": true, "tableView": "", "durationMs": 41230 }
```

A failing report er caught og returned, not thrown:

```json
{ "status": "Error", "error": "<BC error text>", "callstack": "<BC error callstack>" }
```

## Lestu This Before Using It

- **Tókst aðeins means no villa was raised.** The report returns no niðurstaða. A run that
  matched zero færslur looks identical to one that adjusted 50,000 entries. Staðfestu með a
  following `Data.Records.Get` step against the register eða ledger the report writes to.
- **Effects eru irreversible, og partial on failure.** Most batch reports commit as they go,
  so `{"status":"Error"}` does NOT mean nothing happened.
- **Ekki auto-retry.** Stilltu the orchestrator entry retry policy to `Never` fyrir any chain
  containing this step.
- **Check what you eru calling first.** `Orchestrator.Report.List` with
  `{"processingOnly": true}` er unfiltered — it listar Date Compress G/L Entries og Delete
  Invoiced Sales Orders next to the harmless ones. Kallaðu á `Orchestrator.Report.Get` to confirm
  what a reportId actually er áður en running it.
- **No request page er shown.** Parameters come aðeins úr `requestPageXml` eða the saved
  preset. Capture a preset via the URL úr `Orchestrator.Report.Get`.
- **Long runs need the queue.** Batch jobs getur outlive a synchronous request — use
  `Orchestrator.Playbook.Enqueue` eða the async queue endpoint.

