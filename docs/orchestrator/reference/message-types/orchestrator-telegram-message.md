---
id: orchestrator-telegram-message
title: "Orchestrator.Telegram.Message"
sidebar_label: "Orchestrator.Telegram.Message"
sidebar_position: 19
description: "Request and response contract for the Orchestrator.Telegram.Message Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Sends a Telegram message to the current user. The chat ID is resolved from the calling user's Bifrost User Setup — no chat ID parameter in the request.

**Direction**: Outbound

## Prerequisites

1. **HTTP Client Requests** enabled for the extension (Extension Settings page 2500)
2. **Telegram Bot Token** configured in Orchestrator Setup
3. **Telegram Chat ID** set on the calling user's Bifrost User Setup record

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `message` | Text | Yes | The message text to send (supports HTML formatting) |

## Response

```json
{ "status": "Success", "chatId": "123456789" }
```

## Example

```json
{ "type": "Orchestrator.Telegram.Message", "data": { "message": "Hello from BC!" } }
```

## IsEnabled

Returns true only when all three prerequisites are met. If `IsEnabled` returns false, the message type will not appear in available type listings for the current user.

