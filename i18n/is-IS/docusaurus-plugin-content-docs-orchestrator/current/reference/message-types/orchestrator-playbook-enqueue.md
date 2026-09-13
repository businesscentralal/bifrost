---
id: orchestrator-playbook-enqueue
title: "Orchestrator.Playbook.Enqueue"
sidebar_label: "Orchestrator.Playbook.Enqueue"
sidebar_position: 9
description: "Request and response contract for the Orchestrator.Playbook.Enqueue Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Enqueues a playbook fyrir one-time execution via the Job Queue með custom request data. The playbook runs once eftir the specified delay (minimum 60 seconds).

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `playbookCode` | Code[20] | Yes* | The playbook kóði to enqueue |
| `subject` | Text | Yes* | Alternative: pass playbookCode as envelope subject |
| `initialRequest` | Object | No | JSON payload fyrir step 1 (stored in JQ Parameter table) |
| `jobQueueCategory` | Code[10] | No | Job Queue Category Code fyrir the entry |
| `delaySeconds` | Integer | No | Seconds áður en execution starts (sjálfgefið/minimum: 60) |

## Svar

```json
{ "status": "Success", "playbookCode": "MYPLAYBOOK",
  "jobQueueEntryId": "<guid>", "delaySeconds": 60 }
```

