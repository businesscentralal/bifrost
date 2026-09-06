---
id: orchestrator-jobqueueentry-restart
title: "Orchestrator.JobQueueEntry.Restart"
sidebar_label: "Orchestrator.JobQueueEntry.Restart"
sidebar_position: 7
description: "Request and response contract for the Orchestrator.JobQueueEntry.Restart Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Restarts a Job Queue Entry by setting its status to Ready, regardless of current state.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | GUID | Yes* | SystemId of the Job Queue Entry |
| `subject` | GUID | Yes* | Alternative: pass the SystemId as the envelope subject |

## Response

```json
{ "status": "Success", "id": "<guid>", "entryStatus": "Ready", "description": "...", "message": "..." }
```

## Example

```json
{ "type": "Orchestrator.JobQueueEntry.Restart", "data": { "id": "a1b2c3d4-..." } }
```

