---
id: orchestrator-entry-schedule
title: "Orchestrator.Entry.Schedule"
sidebar_label: "Orchestrator.Entry.Schedule"
sidebar_position: 6
description: "Request and response contract for the Orchestrator.Entry.Schedule Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Deletes and immediately recreates the Job Queue Entry for the orchestrator entry. Uses API credentials if configured, otherwise falls back to direct scheduling. Entry must not be blocked.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | GUID | Yes* | SystemId of the orchestrator entry |
| `subject` | GUID | Yes* | Alternative: pass the SystemId as the envelope subject |

*Provide either `id` in the data payload or the SystemId as the `subject`.

## Response

```json
{ "status": "Success", "id": "<guid>", "blocked": true, "message": "..." }
```

## Example

```json
{ "type": "Orchestrator.Entry.Schedule", "data": { "id": "a1b2c3d4-..." } }
```

