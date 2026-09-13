---
id: orchestrator-jobqueueentry-restartifneeded
title: "Orchestrator.JobQueueEntry.RestartIfNeeded"
sidebar_label: "Orchestrator.JobQueueEntry.RestartIfNeeded"
sidebar_position: 8
description: "Request and response contract for the Orchestrator.JobQueueEntry.RestartIfNeeded Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Endurræsir a Job Queue Entry aðeins ef it er in Villa, On Hold, eða On Hold með Inactivity Timeout. Skilar án action ef already Lestuy eða In Process.

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
{ "type": "Orchestrator.JobQueueEntry.RestartIfNeeded", "data": { "id": "a1b2c3d4-..." } }
```

