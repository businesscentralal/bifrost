---
id: documentexchange-inexchange-getincoming
title: "DocumentExchange.InExchange.GetIncoming"
sidebar_label: "DocumentExchange.InExchange.GetIncoming"
sidebar_position: 44
description: "Request and response contract for the DocumentExchange.InExchange.GetIncoming Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists incoming (unhandled) documents from InExchange.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | No | Document type filter (default: Invoice) |

## Response
JSON array of incoming document summaries with document IDs.

