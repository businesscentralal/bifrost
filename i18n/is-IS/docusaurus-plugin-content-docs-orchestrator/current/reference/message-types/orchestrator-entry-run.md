---
id: orchestrator-entry-run
title: "Orchestrator.Entry.Run"
sidebar_label: "Orchestrator.Entry.Run"
sidebar_position: 5
description: "Request and response contract for the Orchestrator.Entry.Run Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Keyrir an orchestrator entry immediately as a one-time foreground run. Býr til a temporary Job Queue Entry copy án affecting the recurring schedule.

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
{ "type": "Orchestrator.Entry.Run", "data": { "id": "a1b2c3d4-..." } }
```

