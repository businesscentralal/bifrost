---
id: subscription-billing-previewdocuments
title: "Subscription.Billing.PreviewDocuments"
sidebar_label: "Subscription.Billing.PreviewDocuments"
sidebar_position: 4
description: "Request and response contract for the Subscription.Billing.PreviewDocuments Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Shows what `Subscription.Billing.CreateDocuments` would produce for a Billing Template's
unbilled proposal lines (Document Type = None), by reading those Billing Line rows and
grouping them the same way a real run would - one entry per document that would be
created, grouped per contract by default. Nothing is created, and nothing is written at
all. Run `Subscription.Billing.CreateProposal` first to populate the proposal lines this
call reads.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| billingTemplateCode | Code[20] | Yes | The Billing Template to preview. May also be supplied as the message subject. |
| groupBy | Text | No | 'Contract' (default) groups one document per contract. 'Customer' groups one document per Partner No. and only applies when every pending line belongs to a customer contract. |

There are no `documentDate`, `postingDate` or `postDocuments` parameters - a preview never
creates or posts anything, so no document data applies.

## Request Example

```json
{
  "billingTemplateCode": "MONTHLY"
}
```

## Response Shape

```json
{
  "status": "Success",
  "billingTemplateCode": "MONTHLY",
  "billingLineCount": 12,
  "documentCount": 5,
  "documents": [
    { "contractNo": "CC000010", "partnerNo": "10000", "lineCount": 3, "totalAmount": "297.00" }
  ],
  "warnings": [],
  "preview": true,
  "rollback": true
}
```

`contractNo` is left blank on an entry when `groupBy` is `Customer`, because one document
created that way can span several contracts for the same Partner No. A run with no unbilled
proposal lines is a success with `documents: []`, `documentCount` of 0, and a `message`;
`preview` and `rollback` are still `true`.

## Errors

| Condition | Message |
| --- | --- |
| The template does not exist | The Billing Template '%1' does not exist. |
| billingTemplateCode is missing | The request is missing the required parameter 'billingTemplateCode'. |
| groupBy is not Contract or Customer | The parameter 'groupBy' must be either 'Contract' or 'Customer'. |
| groupBy = Customer but a vendor line is pending | 'groupBy' = 'Customer' only applies when the pending proposal lines belong to customer contracts. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }`. A mix of customer
and vendor proposal lines is not an error here - `Subscription.Billing.CreateDocuments`
would refuse to run, and this call reports that as a `warnings` entry instead, alongside
the grouping it can still show.

## Safety

This message type only reads. It does not call `Subscription.Billing.CreateDocuments` or any
other codeunit that writes, so there is no billing proposal to build, no document to create
even temporarily, and nothing to clean up afterwards - unlike the invoice previews, which
have to build and then remove real proposal lines because that is the only way to preview
them. `preview` and `rollback` are always `true` in the response because, quite simply,
nothing was ever written for either of them to undo.

## Related Message Types

- `Subscription.Billing.CreateDocuments`
- `Subscription.Billing.CreateProposal`

