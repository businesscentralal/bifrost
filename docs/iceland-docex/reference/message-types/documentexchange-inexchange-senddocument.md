---
id: documentexchange-inexchange-senddocument
title: "DocumentExchange.InExchange.SendDocument"
sidebar_label: "DocumentExchange.InExchange.SendDocument"
sidebar_position: 48
description: "Request and response contract for the DocumentExchange.InExchange.SendDocument Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Sends a document outbound via InExchange.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| payload | object | Yes | The outbound send payload |

## Response
Confirmation with outbound document reference.

