---
id: subscription-renewal-createquote
title: "Subscription.Renewal.CreateQuote"
sidebar_label: "Subscription.Renewal.CreateQuote"
sidebar_position: 16
description: "Request and response contract for the Subscription.Renewal.CreateQuote Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Creates a contract renewal sales quote for a Customer Subscription Contract. Any stale
renewal lines left over from an earlier run against this contract are deleted first, then
a fresh Sub. Contract Renewal Line row is built from every still-open Subscription Line
on the contract, and Microsoft's `Codeunit "Create Sub. Contract Renewal"` turns those
rows into one sales quote. This bypasses Microsoft's interactive renewal wrapper entirely,
so it never shows a dialog or a request page.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| contractNo | Code[20] | Yes | The Customer Subscription Contract to renew. May also be supplied as the message subject. |

## Request Example

```json
{
  "contractNo": "CC000010"
}
```

## Response Shape

```json
{
  "status": "Success",
  "contractNo": "CC000010",
  "renewalLinesCreated": 4,
  "salesQuoteNo": "SQ000123"
}
```

## Errors

| Condition | Message |
| --- | --- |
| The contract does not exist | The Customer Subscription Contract '%1' does not exist. |
| No Subscription Line qualifies for renewal | The Customer Subscription Contract '%1' has no Subscription Lines that can be renewed. |
| Create Sub. Contract Renewal produced no quote | Create Sub. Contract Renewal did not produce a sales quote for Customer Subscription Contract '%1'. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes: it deletes and re-creates Sub. Contract Renewal Line rows for
this contract, and it creates a sales quote header and lines. It never posts anything and
never touches the contract itself. The write runs in an isolated transaction that rolls
back on error.

## Related Message Types

- `Subscription.Renewal.Extend`

