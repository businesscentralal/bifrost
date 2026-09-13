---
id: orchestrator-entry-schedule
title: "Orchestrator.Entry.Schedule"
sidebar_label: "Orchestrator.Entry.Schedule"
sidebar_position: 6
description: "Request and response contract for the Orchestrator.Entry.Schedule Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Eyðir og immediately recreates the Job Queue Entry fyrir the orchestrator entry. Notaðus API credentials ef stillt, otherwise falls back to direct scheduling. Entry verður not be blocked.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `id` | GUID | Yes* | SystemId of the orchestrator entry |
| `subject` | GUID | Yes* | Alternative: pass the SystemId as the envelope subject |

*Provide either `id` in the data payload eða the SystemId as the `subject`.

## Svar

```json
{ "status": "Success", "id": "<guid>", "blocked": true, "message": "..." }
```

## Example

```json
{ "type": "Orchestrator.Entry.Schedule", "data": { "id": "a1b2c3d4-..." } }
```

