---
id: subscription-contract-previewinvoice
title: "Subscription.Contract.PreviewInvoice"
sidebar_label: "Subscription.Contract.PreviewInvoice"
sidebar_position: 7
description: "Request and response contract for the Subscription.Contract.PreviewInvoice Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Shows what `Subscription.Contract.CreateInvoice` would bill for one customer Subscription
Contract, without keeping anything and without ever creating a document. The due
Subscription Lines are handed to the same ad-hoc billing proposal entry point the write
call uses, so the reported lines, periods and amounts reflect what Business Central would
actually produce. The proposal rows built for the preview are read and then deleted again.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| contractNo | Code[20] | Yes | The Customer Subscription Contract to preview. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on or before this date are billed. Defaults to the work date. |
| billingToDate | Date | No | Bills complete periods up to this date. Omit to use each line's own billing rhythm. |

Dates use the ISO format `YYYY-MM-DD`. There are no `documentDate` or `postingDate`
parameters - a preview never creates a document, so no document dates apply.

## Request Example

```json
{
  "contractNo": "CC000010",
  "billingDate": "2026-08-31"
}
```

## Response Shape

```json
{
  "status": "Success",
  "contractNo": "CC000010",
  "billingDate": "2026-08-31",
  "lines": [
    { "subscriptionLineEntryNo": 1001, "billingFrom": "2026-08-01", "billingTo": "2026-08-31", "unitPrice": "99.00", "amount": "99.00" }
  ],
  "wouldBillLineCount": 1,
  "totalAmount": "99.00",
  "preview": true,
  "rollback": true
}
```

When nothing on the contract is due, the call still succeeds with `lines: []`,
`wouldBillLineCount: 0` and a `message` explaining that nothing was due.

## Errors

| Condition | Message |
| --- | --- |
| The contract does not exist | The Customer Subscription Contract '%1' does not exist. |
| Another contract has pending template-less proposal lines | Contract '%1' has %2 pending billing line(s) with no billing template assigned... |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }`.

## Safety

Nothing is left behind, but this is not a rolled-back transaction: Microsoft's billing
proposal codeunit commits internally partway through its own run, so an ordinary error-based
rollback would not undo it. Instead, this call notes the last Billing Line entry number
before it does anything, builds the real proposal lines for the contract's due Subscription
Lines with that same entry point, reads back exactly the rows it just created, and then
deletes exactly those rows again - on both the success path and if the proposal call itself
fails partway through. No document is ever created, even temporarily: this call never
reaches the step that turns proposal lines into an invoice. The same blank-template billing
line caveat as `Subscription.Contract.CreateInvoice` applies: another contract's pending
template-less proposal lines block the preview so it cannot touch them, even temporarily.

## Related Message Types

- `Subscription.Contract.CreateInvoice`
- `Subscription.Contract.GetLines`

