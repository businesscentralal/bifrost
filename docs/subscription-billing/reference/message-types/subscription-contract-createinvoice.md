---
id: subscription-contract-createinvoice
title: "Subscription.Contract.CreateInvoice"
sidebar_label: "Subscription.Contract.CreateInvoice"
sidebar_position: 5
description: "Request and response contract for the Subscription.Contract.CreateInvoice Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Bills one customer Subscription Contract to an unposted sales invoice (or credit memo,
when a line calls for one). The due Subscription Lines on the contract are copied into a
temporary set and handed to Microsoft's ad-hoc billing proposal entry point - the same
entry point the per-contract billing dialog in the client uses - which creates Billing
Line proposal rows with no billing template attached. The document is then created from
those rows. Nothing is posted, and the document is never opened.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| contractNo | Code[20] | Yes | The Customer Subscription Contract to bill. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on or before this date are billed. Defaults to the work date. |
| billingToDate | Date | No | Bills complete periods up to this date. Omit to use each line's own billing rhythm. |
| documentDate | Date | No | Document date on the created document. Defaults to the work date. |
| postingDate | Date | No | Posting date on the created document. Defaults to the work date. |

Dates use the ISO format `YYYY-MM-DD`.

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
  "documents": [
    { "documentType": "Invoice", "documentNo": "SINV-000123" }
  ],
  "billingLineCount": 3
}
```

When nothing on the contract is due, the call still succeeds with `documents: []` and a
`message` explaining that nothing was due.

## Errors

| Condition | Message |
| --- | --- |
| The contract does not exist | The Customer Subscription Contract '%1' does not exist. |
| Another contract has pending template-less proposal lines | Contract '%1' has %2 pending billing line(s) with no billing template assigned... |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes an unposted document; it never posts and never opens a page.
The proposal rows this call creates carry a blank Billing Template Code, because that is
what the ad-hoc, per-contract billing entry point produces. Microsoft's own document
creation codeunit converts every blank-template Billing Line in the company when it runs -
not only the ones for this contract - so before doing anything this call checks for
blank-template Billing Lines that belong to a different contract and refuses to run,
naming that contract, rather than silently invoicing someone else's pending proposal.
The write runs in an isolated transaction that rolls back on error.

## Related Message Types

- `Subscription.Contract.PreviewInvoice`
- `Subscription.Contract.GetLines`
- `Subscription.Billing.CreateProposal`

