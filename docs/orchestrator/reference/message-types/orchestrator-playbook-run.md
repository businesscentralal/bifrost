---
id: orchestrator-playbook-run
title: "Orchestrator.Playbook.Run"
sidebar_label: "Orchestrator.Playbook.Run"
sidebar_position: 10
description: "Request and response contract for the Orchestrator.Playbook.Run Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Executes a Bifrost Playbook immediately and returns the execution result. Optionally pass an initial request payload.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `playbookCode` | Code[20] | Yes* | The playbook code to execute |
| `subject` | Text | Yes* | Alternative: pass playbookCode as envelope subject |
| `initialRequest` | Object | No | JSON payload passed to step 1 |

## Response

```json
{ "status": "Success", "instanceId": "<guid>", "playbookCode": "MYPLAYBOOK",
  "playbookStatus": "Completed", "stepsExecuted": 3, "stepsFailed": 0, "itemsProcessed": 10 }
```

## Runs inline, for as long as it takes

The whole playbook executes inside this call and the response is written only at
the end. A caller that times out first gets nothing, while the server carries on:
the instance is left at `Running` and never completes, because the code that would
write the completion belongs to the session that was abandoned.

An LLM step inside a forEach is the usual cause — a per-item call against a slow
model turns a twelve-second playbook into several minutes. Use
`Orchestrator.Playbook.Enqueue`, or invoke this type asynchronously, for anything
that is not reliably quick, and read `Playbook Step Log ori` to follow progress.

`itemsProcessed` counts forEach iterations summed over every step, not distinct
items. Do not present it to a user as a record count.

