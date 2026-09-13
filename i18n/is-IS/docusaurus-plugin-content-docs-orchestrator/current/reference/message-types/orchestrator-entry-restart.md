---
id: orchestrator-entry-restart
title: "Orchestrator.Entry.Restart"
sidebar_label: "Orchestrator.Entry.Restart"
sidebar_position: 4
description: "Request and response contract for the Orchestrator.Entry.Restart Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Endurræsir a failed eða held orchestrator entry by re-enqueuing it. Honors the retry policy og sends restart notifications ef stillt.

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
{ "type": "Orchestrator.Entry.Restart", "data": { "id": "a1b2c3d4-..." } }
```

