---
id: orchestrator-status-restart
title: "Orchestrator.Status.Restart"
sidebar_label: "Orchestrator.Status.Restart"
sidebar_position: 17
description: "Request and response contract for the Orchestrator.Status.Restart Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Unconditionally restarts the orchestrator management Job Queue Entry. Cancels the current entry and creates a new one.

**Direction**: Outbound

## Request

No parameters required.

## Response

```json
{ "status": "Success", "message": "Orchestrator restarted.", "orchestratorStatus": "Ready" }
```

## Example

```json
{ "type": "Orchestrator.Status.Restart" }
```

