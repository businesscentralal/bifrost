---
id: iceland-pensionsupplement-get
title: "Iceland.PensionSupplement.Get"
sidebar_label: "Iceland.PensionSupplement.Get"
sidebar_position: 50
description: "Request and response contract for the Iceland.PensionSupplement.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads Icelandic pension supplement funds (lífeyrisaukar/safnsjóðir) from skilagrein.is.
These are type 4 entities (Númer starts with 4).

**Direction:** Outbound
**Content-Type:** text/json

## Request
```json
{}
```
No parameters required.

## Response
Same structure as Iceland.PensionFund.Get with `"source": "skilagrein.is - PensionSupplements"`.

## Examples
- Gildi lífeyrissjóður - lífeyrisauki (4200)
- Birta lífeyrissjóður - lífeyrisauki (4430)
- Stapi lífeyrissjóður - lífeyrisauki (4500)

## Submission Workflow
```
Step 1: Iceland.Collector.Get → get all collectors
Step 2: Iceland.PensionSupplement.Get → get supplement entities (this call)
Step 3: Iceland.CollectorPayment.Send → submit with entityType "X" + entityNo from this response
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
1. Call with empty body `{}` to get all pension supplement funds.
2. The `collectorNo` field tells you which collector handles this supplement.
3. Use the fund `no` as `entityNo` and "X" (private pension/séreign) as `entityType` when building entries.
4. Supplements are typically additional voluntary savings on top of the mandatory pension contribution.

