---
id: orchestrator-jobqueueentry-restart
title: "Orchestrator.JobQueueEntry.Restart"
sidebar_label: "Orchestrator.JobQueueEntry.Restart"
sidebar_position: 7
description: "Request and response contract for the Orchestrator.JobQueueEntry.Restart Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Endurræsir a Job Queue Entry by setting its status to Lestuy, regardless of current state.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `id` | GUID | Yes* | SystemId of the Job Queue Entry |
| `subject` | GUID | Yes* | Alternative: pass the SystemId as the envelope subject |

## Svar

```json
{ "status": "Success", "id": "<guid>", "entryStatus": "Ready", "description": "...", "message": "..." }
```

## Example

```json
{ "type": "Orchestrator.JobQueueEntry.Restart", "data": { "id": "a1b2c3d4-..." } }
```

