---
id: orchestrator-playbook-schedule
title: "Orchestrator.Playbook.Schedule"
sidebar_label: "Orchestrator.Playbook.Schedule"
sidebar_position: 11
description: "Request and response contract for the Orchestrator.Playbook.Schedule Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Creates an Orchestrator Entry for the playbook using a recurring template. The Orchestrator Handler picks it up automatically and creates the Job Queue Entry.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `playbookCode` | Code[20] | Yes* | The playbook code to schedule |
| `subject` | Text | Yes* | Alternative: pass playbookCode as envelope subject |
| `recurringTemplateCode` | Code[20] | Yes | Recurring template that defines the schedule |
| `notificationType` | Text | No | None, EMail, or Telegram (default: None) |
| `notificationRecipient` | Text | No | Recipient address (required when notificationType is not None) |
| `jobQueueCategoryCode` | Code[10] | No | Job Queue Category Code |
| `emitTelemetry` | Boolean | No | Emit telemetry (default: false) |
| `retryPolicy` | Text | No | Never, ThreeTimes, or Always (default: Always) |

## Response

```json
{ "status": "Success", "playbookCode": "MYPLAYBOOK", "scheduled": true, "orchestratorEntryId": "<systemId>", "orchestratorEntryPkId": "<primaryKeyId>" }
```

`orchestratorEntryId` is the scheduled entry's SystemId. `orchestratorEntryPkId` is its primary-key ID and can be used by the entry lookup fallback.

