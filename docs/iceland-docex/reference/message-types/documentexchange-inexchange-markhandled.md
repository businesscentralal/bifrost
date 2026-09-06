---
id: documentexchange-inexchange-markhandled
title: "DocumentExchange.InExchange.MarkHandled"
sidebar_label: "DocumentExchange.InExchange.MarkHandled"
sidebar_position: 46
description: "Request and response contract for the DocumentExchange.InExchange.MarkHandled Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Marks one or more InExchange documents as handled/delivered.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| documentId | string | Yes* | Single document ID to mark handled |
| documentIds | array | Yes* | Array of document IDs to mark handled |

*Provide either documentId or documentIds.

## Response
Confirmation of handled status update.

