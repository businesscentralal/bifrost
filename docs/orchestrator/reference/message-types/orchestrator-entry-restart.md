---
id: orchestrator-entry-restart
title: "Orchestrator.Entry.Restart"
sidebar_label: "Orchestrator.Entry.Restart"
sidebar_position: 4
description: "Request and response contract for the Orchestrator.Entry.Restart Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Restarts a failed or held orchestrator entry by re-enqueuing it. Honors the retry policy and sends restart notifications if configured.

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
{ "type": "Orchestrator.Entry.Restart", "data": { "id": "a1b2c3d4-..." } }
```

