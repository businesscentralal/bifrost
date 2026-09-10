---
id: orchestrator-jobqueueentry-restartifneeded
title: "Orchestrator.JobQueueEntry.RestartIfNeeded"
sidebar_label: "Orchestrator.JobQueueEntry.RestartIfNeeded"
sidebar_position: 8
description: "Request and response contract for the Orchestrator.JobQueueEntry.RestartIfNeeded Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Restarts a Job Queue Entry only if it is in Error, On Hold, or On Hold with Inactivity Timeout. Returns without action if already Ready or In Process.

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
{ "type": "Orchestrator.JobQueueEntry.RestartIfNeeded", "data": { "id": "a1b2c3d4-..." } }
```

