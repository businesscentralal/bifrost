---
id: iceland-collectorextraamount-confirm
title: "Iceland.CollectorExtraAmount.Confirm"
sidebar_label: "Iceland.CollectorExtraAmount.Confirm"
sidebar_position: 16
description: "Request and response contract for the Iceland.CollectorExtraAmount.Confirm Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Confirms or rejects extra charges (aukagreiðslur) flagged by a previous submission.
This is Step 4 (final step) of the submission workflow.

**Direction:** Outbound
**Access Gate:** Requires write permission on Iceland Skg Period ori table.

## Request
```json
{
  "collectorNo": 1005,
  "refno": "12345",
  "confirm": "yes"
}
```

## Parameters
| Field | Required | Description |
|-------|----------|-------------|
| collectorNo | Yes | The collector that flagged the extra charges |
| refno | Yes | Reference number from Iceland.CollectorPayment.Send response |
| confirm | Yes | "yes" to accept, "no" to reject extra charges |
| username | No | Override (defaults to Company Registration No.) |
| password | No | Override (defaults to stored password for collector) |

## Response
```json
{
  "success": true,
  "replyState": "OK",
  "refNo": "12345",
  "postedAmount": "100000",
  "correctedAmount": "5000",
  "httpStatusCode": 200
}
```

## Submission Workflow
```
Step 1: Iceland.Collector.Get → identify active collector
Step 2: Iceland.PensionFund/Union/RehabFund/PensionSupplement.Get → resolve fund data
Step 3: Iceland.CollectorPayment.Send → submit payment, get refNo
Step 4: Iceland.CollectorExtraAmount.Confirm → confirm/reject extras (THIS CALL)
```
Only needed when Step 3 response has `extraPayments` flagged.

## Tracking Tables
| Table | Purpose |
|-------|---------|
| Iceland Skg Period ori (10077152) | Period.Confirmation Status updated after this call |
| Iceland Skg Period Entry ori (10077153) | The original lines that triggered extra charges |
| Request Log ori (10077136) | HTTP audit: request and response logged |

## Period Status Flow
After Iceland.CollectorPayment.Send: Status = Submitted, Confirmation Status = Pending.
After this call with "yes": Confirmation Status = Confirmed.
After this call with "no": Confirmation Status = Rejected.

## Request Log
Every HTTP call is logged to `Request Log ori` with:
- Operation: "ConfirmExtraAmount"
- Service Name: "Skilagrein"
- Request/Response bodies stored as blobs for auditing

## AI/Agent Playbook
1. Only call this after Iceland.CollectorPayment.Send returned extra payments flagged.
2. Use the same `collectorNo` and the `refNo` from the Send response.
3. "yes" accepts the collector corrected amounts; "no" rejects (employer must resubmit).
4. This call is idempotent — calling again with same refno returns the current state.
5. If unsure whether to confirm, review the Period record's Total Posted vs Total Corrected amounts.

