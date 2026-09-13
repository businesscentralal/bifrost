---
id: orchestrator-telegram-message
title: "Orchestrator.Telegram.Message"
sidebar_label: "Orchestrator.Telegram.Message"
sidebar_position: 19
description: "Request and response contract for the Orchestrator.Telegram.Message Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Sendir a Telegram message to the current notandi. The chat ID er resolved úr the calling notandi's Bifrost Notaður Stilltuup — no chat ID parameter in the request.

**Direction**: Út á við

## Prerequisites

1. **HTTP Client Beiðnis** enabled fyrir the extension (Extension Stilltutings page 2500)
2. **Telegram Bot Token** stillt in Orchestrator Stilltuup
3. **Telegram Chat ID** set on the calling notandi's Bifrost Notaður Stilltuup færsla

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `message` | Text | Yes | The message text to send (supports HTML formatting) |

## Svar

```json
{ "status": "Success", "chatId": "123456789" }
```

## Example

```json
{ "type": "Orchestrator.Telegram.Message", "data": { "message": "Hello from BC!" } }
```

## IsEnabled

Skilar true aðeins þegar allir three prerequisites eru met. Ef `IsEnabled` returns false, the message tegund mun not appear in available tegund listings fyrir the current notandi.

