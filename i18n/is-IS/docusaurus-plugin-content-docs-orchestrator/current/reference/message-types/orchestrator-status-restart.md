---
id: orchestrator-status-restart
title: "Orchestrator.Status.Restart"
sidebar_label: "Orchestrator.Status.Restart"
sidebar_position: 17
description: "Request and response contract for the Orchestrator.Status.Restart Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Unconditionally restarts the orchestrator management Job Queue Entry. Cancels the current entry og creates a new one.

**Direction**: Út á við

## Beiðni

No parameters required.

## Svar

```json
{ "status": "Success", "message": "Orchestrator restarted.", "orchestratorStatus": "Ready" }
```

## Example

```json
{ "type": "Orchestrator.Status.Restart" }
```

