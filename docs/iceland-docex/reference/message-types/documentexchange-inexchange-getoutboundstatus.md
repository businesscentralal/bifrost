---
id: documentexchange-inexchange-getoutboundstatus
title: "DocumentExchange.InExchange.GetOutboundStatus"
sidebar_label: "DocumentExchange.InExchange.GetOutboundStatus"
sidebar_position: 45
description: "Request and response contract for the DocumentExchange.InExchange.GetOutboundStatus Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Checks delivery status of an outbound document in InExchange.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| documentId | string | No | Query single outbound document status |

If documentId is omitted, posts to the list endpoint with filter payload.

## Response
JSON with delivery status information.

