---
id: orchestrator-entry-register
title: "Orchestrator.Entry.Register"
sidebar_label: "Orchestrator.Entry.Register"
sidebar_position: 3
description: "Request and response contract for the Orchestrator.Entry.Register Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Registers an existing Job Queue Entry as an orchestrator entry. The orchestrator will then manage scheduling, monitoring, and notifications for it.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `jobQueueEntryId` | GUID | Yes* | The ID (PK) of the Job Queue Entry to register |
| `subject` | GUID | Yes* | Alternative: pass the Job Queue Entry ID as the envelope subject |

## Response

```json
{ "status": "Success", "id": "<systemId>", "blocked": true, "message": "..." }
```

## Example

```json
{ "type": "Orchestrator.Entry.Register", "data": { "jobQueueEntryId": "a1b2c3d4-..." } }
```

