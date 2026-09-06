---
id: iceland-collectorpayment-send
title: "Iceland.CollectorPayment.Send"
sidebar_label: "Iceland.CollectorPayment.Send"
sidebar_position: 17
description: "Request and response contract for the Iceland.CollectorPayment.Send Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a fund contribution return (SendPaymentInfo) to a skilagrein.is collector.
This is Step 3 of the submission workflow — requires master data from the Get calls.

**Direction:** Outbound
**Access Gate:** Requires write permission on Iceland Skg Period ori table.

## Request
```json
{
  "collectorNo": 1005,
  "username": "optional-override",
  "password": "optional-override",
  "employer": { "ssn": "1234567890", "name": "Company Name" },
  "entries": [
    {
      "entityType": "L",
      "entityNo": 1004,
      "personSSN": "0101012345",
      "monthYear": "2025-01",
      "personAmount": 50000,
      "employerAmount": 50000
    }
  ]
}
```

## Entity Types
| Code | Type | Source |
|------|------|--------|
| L | Common pension (lífeyrir sameign) | Iceland.PensionFund.Get |
| X | Private pension (séreign) | Iceland.PensionSupplement.Get |
| F | Union (stéttarfélag) | Iceland.Union.Get |
| S | Sick fund (sjúkrasjóður) | Iceland.Union.Get |
| O | Holiday fund (orlofsheimilasjóður) | Iceland.Union.Get |
| E | Vocational/Rehab fund (starfsmenntasjóður) | Iceland.RehabFund.Get |
| H | Community fund (félagsheimilasjóður) | Iceland.Union.Get |

## Response
```json
{
  "success": true,
  "replyState": "OK",
  "refNo": "12345",
  "postedAmount": "100000",
  "correctedAmount": "0",
  "httpStatusCode": 200
}
```
If `extraPayments` are flagged, call Iceland.CollectorExtraAmount.Confirm with the returned `refNo`.

## Submission Workflow
```
Step 1: Iceland.Collector.Get → identify active collector
Step 2: Iceland.PensionFund/Union/RehabFund/PensionSupplement.Get → resolve entityNo values
Step 3: Iceland.CollectorPayment.Send → submit payment (THIS CALL)
Step 4: Iceland.CollectorExtraAmount.Confirm → confirm extra charges using refNo from Step 3
```

## Tracking Tables
| Table | Purpose |
|-------|---------|
| Iceland Skg Period ori (10077152) | Tracks submission state: Open → Submitted → Confirmed |
| Iceland Skg Period Entry ori (10077153) | Employee contribution lines sent in this submission |
| Request Log ori (10077136) | Full HTTP audit: request XML, response, status, timing |

## Period Status Flow
`Open` → (submit) → `Submitted` → (confirm extras) → `Confirmed`
On error: `Open` → `Error` (re-open to retry).
Period table stores: Refno, Total Posted Amount, Total Corrected Amount, Extra Payments Flagged, Confirmation Status.

## Request Log
Every HTTP call is logged to `Request Log ori` with:
- Operation: "SendPaymentInfo"
- Service Name: "Skilagrein"
- Request Body (blob): the XML sent to the collector
- Response Body (blob): raw collector response
- The Period record links back via "Request Log Entry No."

## AI/Agent Playbook
1. Get the collector via Iceland.Collector.Get, note the `no` field.
2. Build entries: one per employee × entity type × fund for the reporting month.
3. Username defaults to Company Information "Registration No." if omitted.
4. Password is resolved from secure storage per collector if omitted.
5. After success, check the response for extra payments. If flagged, proceed to Step 4.
6. Multiple entries for different entity types can be combined in a single call to the same collector.

