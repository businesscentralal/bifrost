---
id: iceland-collector-get
title: "Iceland.Collector.Get"
sidebar_label: "Iceland.Collector.Get"
sidebar_position: 15
description: "Request and response contract for the Iceland.Collector.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads all Skilagrein collectors (innheimtuaðilar) from skilagrein.is.
A collector aggregates multiple funds and provides a single web service endpoint for submissions.

**Direction:** Outbound
**Content-Type:** text/json

## Request
```json
{}
```
No parameters required.

## Response
```json
{
  "status": "Success",
  "source": "skilagrein.is - CollectorEntity",
  "count": 42,
  "collectors": [{
    "no": 1005,
    "name": "Almenni-Lífsverk lífeyrissjóður",
    "registrationNo": "4502902549",
    "address": "Dalvegi 30",
    "postCode": "201",
    "city": "Kópavogur",
    "phone": "510 2500",
    "webServiceUrl": "https://...",
    "webServiceActive": true,
    "webServiceAuthenticates": true
  }]
}
```

## Submission Workflow
```
Step 1: Iceland.Collector.Get → get all collectors (this call)
Step 2: Iceland.PensionFund/Union/RehabFund/PensionSupplement.Get → get fund entities
Step 3: Iceland.CollectorPayment.Send → submit contribution return
Step 4: Iceland.CollectorExtraAmount.Confirm → confirm/reject extra charges (if flagged)
```

## Tracking Tables
| Table | Purpose |
|-------|---------|
| Iceland Skg Collector ori (10077146) | Cached collector master data |
| Iceland Skg Fund ori (10077147) | Cached fund entities from all Get calls |
| Iceland Skg Period ori (10077152) | Tracks submission periods per Collector+Fund+Period |
| Iceland Skg Period Entry ori (10077153) | Employee contribution lines within a period |
| Request Log ori (10077136) | Audit log for every HTTP call (request/response bodies, status, timing) |

## Request Log
Every outbound HTTP call is logged to `Request Log ori` with Type = "Skilagrein".
Fields: Entry No., Sent At, Operation, Service URL, HTTP Status, Elapsed, Success, Error Text, Request Body (blob), Response Body (blob).
The Period table links back via "Request Log Entry No.".

## AI/Agent Playbook
1. Call with empty body `{}` to get all collectors.
2. Use `webServiceActive` to find collectors accepting electronic submissions.
3. Match `no` to the `collectorNo` field in fund responses and submission calls.
4. Only collectors with `webServiceActive: true` can receive payments via Iceland.CollectorPayment.Send.

