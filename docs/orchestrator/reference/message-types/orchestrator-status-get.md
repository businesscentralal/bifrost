---
id: orchestrator-status-get
title: "Orchestrator.Status.Get"
sidebar_label: "Orchestrator.Status.Get"
sidebar_position: 16
description: "Request and response contract for the Orchestrator.Status.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns the current health status of the Job Queue Orchestrator, including whether the management entry is running and counts of orchestrator entries by state.

**Direction**: Outbound

## Request

No parameters required.

## Response

```json
{
  "status": "Success",
  "orchestratorStatus": "Ready",
  "jobQueueCategoryCode": "JOBSSCHDLR",
  "logJobQueueActivity": true,
  "entries": { "total": 10, "blocked": 1, "active": 9 }
}
```

## Example

```json
{ "type": "Orchestrator.Status.Get" }
```

