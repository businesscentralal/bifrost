---
id: iceland-union-get
title: "Iceland.Union.Get"
sidebar_label: "Iceland.Union.Get"
sidebar_position: 61
description: "Request and response contract for the Iceland.Union.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads Icelandic unions (stéttarfélög) from skilagrein.is.
These are type 2 entities (Númer starts with 2).

**Direction:** Outbound
**Content-Type:** text/json

## Request
```json
{}
```
No parameters required.

## Response
Same structure as Iceland.PensionFund.Get with `"source": "skilagrein.is - Unions"`.

## Examples
- Efling, stéttarfélag (2112)
- VR (2511)
- Eining-Iðja (2235)

## Submission Workflow
```
Step 1: Iceland.Collector.Get → get all collectors
Step 2: Iceland.Union.Get → get union entities (this call)
Step 3: Iceland.CollectorPayment.Send → submit with entityType "F" + entityNo from this response
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
1. Call with empty body `{}` to get all unions.
2. The `collectorNo` field tells you which collector handles this union.
3. Use the union `no` as `entityNo` and "F" as `entityType` when building payment entries.
4. Union dues are typically combined with pension contributions in the same payment submission.

