---
id: documentexchange-unimaze-retrymessage
title: "DocumentExchange.Unimaze.RetryMessage"
sidebar_label: "DocumentExchange.Unimaze.RetryMessage"
sidebar_position: 71
description: "Request and response contract for the DocumentExchange.Unimaze.RetryMessage Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retries a failed message (Unimaze only). Only works when message status is `failed` or `retrying`.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | UUID of the failed message |

## Response
Empty response on success (HTTP 200). Error on invalid state (HTTP 422).

## Workflow
```
1. StatusSync or GetDocumentInfo → find messages with status "failed"
2. GetValidations { "messageId": "<id>" } → understand why it failed
3. If transient failure: RetryMessage { "messageId": "<id>" }
4. If permanent failure: fix data and SubmitTransaction again
```

