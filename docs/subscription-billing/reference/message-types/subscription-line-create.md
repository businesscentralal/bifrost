---
id: subscription-line-create
title: "Subscription.Line.Create"
sidebar_label: "Subscription.Line.Create"
sidebar_position: 12
description: "Request and response contract for the Subscription.Line.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Creates Subscription Lines (table 8059) on an existing Subscription Header by applying a
Subscription Package. Every package line becomes a Subscription Line, with prices, billing
rhythm and dates derived by Microsoft's own package application logic - the same logic the
Subscription Header page uses when a package is applied from the client.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| subscriptionHeaderNo | Code[20] | Yes | The Subscription Header to add lines to. May also be supplied as the message subject. |
| subscriptionPackageCode | Code[20] | Yes | The Subscription Package to apply. |
| subscriptionLineStartDate | Date | No | Start date for the new lines. Omit, or send 0001-01-01, to let the package's own formula decide. |
| subscriptionLineEndDate | Date | No | End date for the new lines. Omit to leave the lines open ended. |
| usageBasedBillingPackageLinesOnly | Boolean | No | When true, only the package's usage based lines are created. Defaults to false. |

Dates use the ISO format `YYYY-MM-DD`.

## Request Example

```json
{
  "subscriptionHeaderNo": "SUB000010",
  "subscriptionPackageCode": "STANDARD",
  "subscriptionLineStartDate": "2026-09-01"
}
```

## Response Shape

```json
{
  "status": "Success",
  "subscriptionHeaderNo": "SUB000010",
  "subscriptionPackageCode": "STANDARD",
  "linesCreated": 3,
  "createdLines": [1001, 1002, 1003]
}
```

`createdLines` holds the `Entry No.` of every Subscription Line this call added. A package
that adds nothing - for example because every line is filtered out by
`usageBasedBillingPackageLinesOnly` - is still a success, with `linesCreated` of 0.

## Errors

| Condition | Message |
| --- | --- |
| The Subscription Header does not exist | The Subscription Header '%1' does not exist. |
| The header has no Source No. | Standard TestField error naming 'Source No.'. |
| The Subscription Package does not exist | The Subscription Package '%1' does not exist. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes. Only Subscription Lines under the given header are created - no
contract is touched and nothing is billed. The write runs in an isolated transaction that
rolls back on error.

## Related Message Types

- `Subscription.Contract.GetLines`
- `Subscription.Contract.CreateInvoice`

