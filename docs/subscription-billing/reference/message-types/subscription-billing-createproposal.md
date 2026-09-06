---
id: subscription-billing-createproposal
title: "Subscription.Billing.CreateProposal"
sidebar_label: "Subscription.Billing.CreateProposal"
sidebar_position: 3
description: "Request and response contract for the Subscription.Billing.CreateProposal Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Generates billing proposal lines (Billing Line, table 8061) for a Billing Template.
Every Subscription Line whose next billing date falls on or before the billing date and
that matches the template's own filter is proposed for billing. Nothing is invoiced yet -
call `Subscription.Billing.CreateDocuments` afterwards to turn the proposal into documents.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| billingTemplateCode | Code[20] | Yes | The Billing Template to run. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on or before this date are proposed. Defaults to the work date. |
| billingToDate | Date | No | Bills complete periods up to this date. Omit to use each line's own billing rhythm. |
| automatedBilling | Boolean | No | Defaults to true, which keeps the run silent. Leave it at the default. |

Dates use the ISO format `YYYY-MM-DD`.

## Request Example

```json
{
  "billingTemplateCode": "MONTHLY",
  "billingDate": "2026-08-31",
  "billingToDate": "2026-09-30"
}
```

## Response Shape

```json
{
  "status": "Success",
  "billingTemplateCode": "MONTHLY",
  "billingDate": "2026-08-31",
  "billingToDate": "2026-09-30",
  "proposalLinesCreated": 12,
  "proposalLineCount": 12,
  "contracts": ["CC000010", "CC000011"]
}
```

`proposalLinesCreated` counts the lines this call added. `proposalLineCount` is the total
number of proposal lines now standing for the template, including any created earlier.
A run that matches nothing is a success with `proposalLinesCreated` of 0.

## Errors

| Condition | Message |
| --- | --- |
| The template does not exist | The Billing Template '%1' does not exist. |
| billingTemplateCode is missing | The request is missing the required parameter 'billingTemplateCode'. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes. It only creates proposal lines - no invoice is created and
nothing is posted. The write runs in an isolated transaction that rolls back on error.

## Related Message Types

- `Subscription.Billing.CreateDocuments`
- `Subscription.Billing.PreviewDocuments`
- `Subscription.Contract.CreateInvoice`

