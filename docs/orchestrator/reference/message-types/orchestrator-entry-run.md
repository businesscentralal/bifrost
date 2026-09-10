---
id: orchestrator-entry-run
title: "Orchestrator.Entry.Run"
sidebar_label: "Orchestrator.Entry.Run"
sidebar_position: 5
description: "Request and response contract for the Orchestrator.Entry.Run Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Executes an orchestrator entry immediately as a one-time foreground run. Creates a temporary Job Queue Entry copy without affecting the recurring schedule.

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
{ "type": "Orchestrator.Entry.Run", "data": { "id": "a1b2c3d4-..." } }
```

