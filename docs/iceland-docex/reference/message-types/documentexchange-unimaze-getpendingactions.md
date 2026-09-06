---
id: documentexchange-unimaze-getpendingactions
title: "DocumentExchange.Unimaze.GetPendingActions"
sidebar_label: "DocumentExchange.Unimaze.GetPendingActions"
sidebar_position: 64
description: "Request and response contract for the DocumentExchange.Unimaze.GetPendingActions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a summary of pending actions for a party (Unimaze only).
Shows counts of unprocessed inbound/outbound messages.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Party identifier (e.g. `0196:2020202222` or plain kennitala) |

## Response
Summary object with counts per category. Structure varies by Unimaze version.

## Workflow
Use as a dashboard indicator: call periodically to check if there are items needing attention.
Follow up with GetUnread or GetInbox for details.

