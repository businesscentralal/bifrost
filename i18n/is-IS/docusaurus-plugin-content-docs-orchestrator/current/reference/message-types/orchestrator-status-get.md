---
id: orchestrator-status-get
title: "Orchestrator.Status.Get"
sidebar_label: "Orchestrator.Status.Get"
sidebar_position: 16
description: "Request and response contract for the Orchestrator.Status.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar the current health status of the Job Queue Orchestrator, including whether the management entry er running og counts of orchestrator entries by state.

**Direction**: Út á við

## Beiðni

No parameters required.

## Svar

```json
{
  "status": "Success",
  "orchestratorStatus": "Ready",
  "jobQueueCategoryCode": "JOBSSCHDLR",
  "logJobQueueActivity": true,
  "entries": { "total": 10, "blocked": 1, "active": 9 }
}
```

## Example

```json
{ "type": "Orchestrator.Status.Get" }
```

