---
id: subscription-billing-createdocuments
title: "Subscription.Billing.CreateDocuments"
sidebar_label: "Subscription.Billing.CreateDocuments"
sidebar_position: 2
description: "Request and response contract for the Subscription.Billing.CreateDocuments Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Processes every unbilled Billing Line (Document Type = None) standing under a Billing Template
and turns them into sales or purchase documents, grouped per contract by default. Run
`Subscription.Billing.CreateProposal` first to populate the proposal lines this call consumes.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| billingTemplateCode | Code[20] | Yes | The Billing Template whose unbilled proposal lines are processed. May also be supplied as the message subject. |
| documentDate | Date | No | Document date stamped on the created documents. Defaults to the work date. |
| postingDate | Date | No | Posting date stamped on the created documents. Defaults to the work date. |
| postDocuments | Boolean | No | Defaults to false. When true, customer documents are posted immediately - vendor documents are never auto-posted regardless of this flag. |
| groupBy | Text | No | 'Contract' (default) groups one document per contract. 'Customer' groups one document per Bill-to Customer and only applies to customer proposal lines. |

Dates use the ISO format `YYYY-MM-DD`.

## Request Example

```json
{
  "billingTemplateCode": "MONTHLY",
  "postDocuments": false
}
```

## Response Shape

```json
{
  "status": "Success",
  "billingTemplateCode": "MONTHLY",
  "billingLinesProcessed": 12,
  "documentCount": 5,
  "documents": [
    { "documentType": "Invoice", "documentNo": "INV-000123", "contractNo": "CC000010" }
  ]
}
```

When `postDocuments` was explicitly true, the response also carries `"posted": true` at the
top level, and each document that was posted carries `"posted": true` of its own - posting
archives the proposal rows, and these documents are read back from that archive. A run with
no unbilled proposal lines is a success with `documents: []`, `documentCount` of 0, and a `message`.

## Errors

| Condition | Message |
| --- | --- |
| The template does not exist | The Billing Template '%1' does not exist. |
| billingTemplateCode is missing | The request is missing the required parameter 'billingTemplateCode'. |
| Proposal lines mix customer and vendor rows | You can create documents only for one type of partner at a time. |
| groupBy is not Contract or Customer | The parameter 'groupBy' must be either 'Contract' or 'Customer'. |
| groupBy = Customer on vendor lines | 'groupBy' = 'Customer' only applies when the pending proposal lines belong to customer contracts. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.

## Safety

This message type writes, and can post when `postDocuments` is explicitly set to true for customer
documents. It always refuses to mix customer and vendor proposal lines in one run.

**This run is not atomic.** Business Central commits each billing document as it creates it,
so a failure part way through - a posting error on one document, say - leaves every document
created before it standing. When that happens the response is:

```json
{
  "status": "Error",
  "error": "The billing run failed after Business Central had already created ...",
  "documents": [ { "documentType": "Invoice", "documentNo": "INV-000123", "contractNo": "CC000010" } ],
  "rolledBack": false
}
```

so the caller can see exactly which documents survived and review them before re-running the
template. Errors raised before Business Central is called - an unknown template, a mixed
partner proposal, an invalid `groupBy` - write nothing at all.

## Related Message Types

- `Subscription.Billing.CreateProposal`
- `Subscription.Billing.PreviewDocuments`

