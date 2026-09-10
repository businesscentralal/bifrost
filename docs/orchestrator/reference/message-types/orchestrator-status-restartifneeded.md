---
id: orchestrator-status-restartifneeded
title: "Orchestrator.Status.RestartIfNeeded"
sidebar_label: "Orchestrator.Status.RestartIfNeeded"
sidebar_position: 18
description: "Request and response contract for the Orchestrator.Status.RestartIfNeeded Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Restarts the orchestrator only if it is not already running. Returns whether a restart was performed.

**Direction**: Outbound

## Request

No parameters required.

## Response

```json
{ "status": "Success", "message": "...", "restarted": true }
```

## Example

```json
{ "type": "Orchestrator.Status.RestartIfNeeded" }
```

