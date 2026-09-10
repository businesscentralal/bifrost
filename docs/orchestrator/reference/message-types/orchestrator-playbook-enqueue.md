---
id: orchestrator-playbook-enqueue
title: "Orchestrator.Playbook.Enqueue"
sidebar_label: "Orchestrator.Playbook.Enqueue"
sidebar_position: 9
description: "Request and response contract for the Orchestrator.Playbook.Enqueue Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Enqueues a playbook for one-time execution via the Job Queue with custom request data. The playbook runs once after the specified delay (minimum 60 seconds).

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `playbookCode` | Code[20] | Yes* | The playbook code to enqueue |
| `subject` | Text | Yes* | Alternative: pass playbookCode as envelope subject |
| `initialRequest` | Object | No | JSON payload for step 1 (stored in JQ Parameter table) |
| `jobQueueCategory` | Code[10] | No | Job Queue Category Code for the entry |
| `delaySeconds` | Integer | No | Seconds before execution starts (default/minimum: 60) |

## Response

```json
{ "status": "Success", "playbookCode": "MYPLAYBOOK",
  "jobQueueEntryId": "<guid>", "delaySeconds": 60 }
```

