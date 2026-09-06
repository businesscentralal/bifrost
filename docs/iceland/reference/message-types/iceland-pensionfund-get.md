---
id: iceland-pensionfund-get
title: "Iceland.PensionFund.Get"
sidebar_label: "Iceland.PensionFund.Get"
sidebar_position: 49
description: "Request and response contract for the Iceland.PensionFund.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads Icelandic pension funds (lífeyrissjóðir) from skilagrein.is.
These are type 1 entities (Númer starts with 1).

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
  "source": "skilagrein.is - PensionFunds",
  "count": 120,
  "funds": [{
    "no": "1005",
    "name": "Almenni-Lífsverk lífeyrissjóður",
    "registrationNo": "4502902549",
    "address": "Dalvegi 30",
    "postCode": "201",
    "city": "Kópavogur",
    "collectorNo": 1005
  }]
}
```

## Fund Types by First Digit
| Digit | Type | Message Type |
|---|---|---|
| 1 | Pension Fund | **Iceland.PensionFund.Get** |
| 2 | Union | Iceland.Union.Get |
| 3 | Rehabilitation Fund | Iceland.RehabFund.Get |
| 4 | Pension Supplement | Iceland.PensionSupplement.Get |

## Submission Workflow
```
Step 1: Iceland.Collector.Get → get all collectors
Step 2: Iceland.PensionFund.Get → get pension fund entities (this call)
Step 3: Iceland.CollectorPayment.Send → submit with entityType "L" + entityNo from this response
Step 4: Iceland.CollectorExtraAmount.Confirm → if extra charges flagged
```

## Tracking Tables
| Table | Purpose |
|-------|---------|
| Iceland Skg Fund ori (10077147) | Cached fund master data (all types 1-4) |
| Iceland Skg Period ori (10077152) | Tracks submission state per Collector+Fund+Period |
| Iceland Skg Period Entry ori (10077153) | Employee contribution lines within a period |
| Request Log ori (10077136) | HTTP audit log — every call logged with Type "Skilagrein" |

## AI/Agent Playbook
1. Call with empty body `{}` to get all pension funds.
2. The `collectorNo` field tells you which collector handles this fund.
3. Use the fund `no` as `entityNo` and "L" as `entityType` when building payment entries.
4. Refresh master data periodically — new funds can be added by skilagrein.is.

