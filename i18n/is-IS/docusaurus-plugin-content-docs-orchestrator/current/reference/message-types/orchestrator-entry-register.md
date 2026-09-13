---
id: orchestrator-entry-register
title: "Orchestrator.Entry.Register"
sidebar_label: "Orchestrator.Entry.Register"
sidebar_position: 3
description: "Request and response contract for the Orchestrator.Entry.Register Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Registers an existing Job Queue Entry as an orchestrator entry. The orchestrator mun then manage scheduling, monitoring, og notifications fyrir it.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `jobQueueEntryId` | GUID | Yes* | The ID (PK) of the Job Queue Entry to register |
| `subject` | GUID | Yes* | Alternative: pass the Job Queue Entry ID as the envelope subject |

## Svar

```json
{ "status": "Success", "id": "<systemId>", "blocked": true, "message": "..." }
```

## Example

```json
{ "type": "Orchestrator.Entry.Register", "data": { "jobQueueEntryId": "a1b2c3d4-..." } }
```

