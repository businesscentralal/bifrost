---
id: orchestrator-status-restartifneeded
title: "Orchestrator.Status.RestartIfNeeded"
sidebar_label: "Orchestrator.Status.RestartIfNeeded"
sidebar_position: 18
description: "Request and response contract for the Orchestrator.Status.RestartIfNeeded Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Endurræsir the orchestrator aðeins ef it er not already running. Skilar whether a restart was performed.

**Direction**: Út á við

## Beiðni

No parameters required.

## Svar

```json
{ "status": "Success", "message": "...", "restarted": true }
```

## Example

```json
{ "type": "Orchestrator.Status.RestartIfNeeded" }
```

