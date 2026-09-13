---
id: orchestrator-playbook-schedule
title: "Orchestrator.Playbook.Schedule"
sidebar_label: "Orchestrator.Playbook.Schedule"
sidebar_position: 11
description: "Request and response contract for the Orchestrator.Playbook.Schedule Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Býr til an Orchestrator Entry fyrir the playbook með a recurring template. The Orchestrator Handler picks it up automatically og creates the Job Queue Entry.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `playbookCode` | Code[20] | Yes* | The playbook kóði to schedule |
| `subject` | Text | Yes* | Alternative: pass playbookCode as envelope subject |
| `recurringTemplateCode` | Code[20] | Yes | Recurring template that defines the schedule |
| `notificationType` | Text | No | None, EMail, eða Telegram (sjálfgefið: None) |
| `notificationRecipient` | Text | No | Recipient address (required þegar notificationType er not None) |
| `jobQueueCategoryCode` | Code[10] | No | Job Queue Category Code |
| `emitTelemetry` | Boolean | No | Emit telemetry (sjálfgefið: false) |
| `retryPolicy` | Text | No | Never, ThreeTimes, eða Alltaf (sjálfgefið: Alltaf) |

## Svar

```json
{ "status": "Success", "playbookCode": "MYPLAYBOOK", "scheduled": true, "orchestratorEntryId": "<guid>" }
```

