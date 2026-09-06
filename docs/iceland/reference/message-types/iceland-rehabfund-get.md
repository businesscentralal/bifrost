---
id: iceland-rehabfund-get
title: "Iceland.RehabFund.Get"
sidebar_label: "Iceland.RehabFund.Get"
sidebar_position: 52
description: "Request and response contract for the Iceland.RehabFund.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads Icelandic rehabilitation/education funds (endurhæfingarsjóðir) from skilagrein.is.
These are type 3 entities (Númer starts with 3).

**Direction:** Outbound
**Content-Type:** text/json

## Request
```json
{}
```
No parameters required.

## Response
Same structure as Iceland.PensionFund.Get with `"source": "skilagrein.is - RehabFunds"`.

## Examples
- Gildi - endurhæfingarsjóður (3200)
- Birta - endurhæfingarsjóður (3430)
- LSR B-deild - Endurhæfingarsj. (3650)

## Submission Workflow
```
Step 1: Iceland.Collector.Get → get all collectors
Step 2: Iceland.RehabFund.Get → get rehab fund entities (this call)
Step 3: Iceland.CollectorPayment.Send → submit with entityType "E" + entityNo from this response
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
1. Call with empty body `{}` to get all rehabilitation funds.
2. The `collectorNo` field tells you which collector handles this fund.
3. Use the fund `no` as `entityNo` and "E" as `entityType` when building payment entries.
4. Rehab fund contributions are typically paired with the parent pension fund submission.

