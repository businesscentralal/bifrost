---
id: orchestrator-email-send
title: "Orchestrator.Email.Send"
sidebar_label: "Orchestrator.Email.Send"
sidebar_position: 2
description: "Request and response contract for the Orchestrator.Email.Send Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Sends an email draft created by Email.Draft.Set. Requires the outboxSystemId from the draft response.

**Direction**: Inbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `outboxSystemId` | GUID | Yes* | SystemId of the Email Outbox entry (from Email.Draft.Set response) |
| `subject` | GUID | Yes* | Alternative: pass outboxSystemId as envelope subject |

## Response

```json
{ "status": "Success", "messageId": "<guid>", "outboxSystemId": "<guid>" }
```

## Playbook Pattern

Two-step email flow in a playbook:
1. Step N: `Email.Draft.Set` — template: `{"to":"...","subject":"...","htmlBody":"@prev.report"}`
   Set `ResultLogPaths = "outboxSystemId"` to capture the draft ID in workspace
2. Step N+10: `Orchestrator.Email.Send` — template: `{"outboxSystemId":"@N.outboxSystemId"}`
   Uses `@` workspace reference to the draft's outboxSystemId

This separation allows:
- Using Email.Draft.Set for review-before-send workflows (skip the Send step)
- Reusing Email.Draft.Set's full feature set (attachments, scenarios, CC/BCC)
- Keeping Orchestrator.Email.Send simple and focused

